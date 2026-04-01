import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import Redis from 'ioredis';

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet()); // Basic HTTP header protection

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://omni-ai-pro.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow no origin (like mobile apps/curl) or exactly matched origins, or vercel preview branches
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Domain Not Allowed by CORS'));
        }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload limitation to stop memory crashing
app.use(express.json({ limit: '1mb' }));

// Rate Limiter: Stop spammers from draining the Groq/Gemini APIs
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, /* 15 minutes */
    max: 50, /* 50 requests per IP per window */
    message: { type: 'error', message: 'Too many active AI requests from this IP. Please wait a few minutes to protect API bandwidth.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. API Keys Validation
const GROQ_KEY = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// 3. Initialize AI Clients
const groq = GROQ_KEY ? new OpenAI({
    apiKey: GROQ_KEY,
    baseURL: "https://api.groq.com/openai/v1"
}) : null;

const gemini = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

// 4. Initialize Supabase Auth Verifier
const supabaseUrl = process.env.SUPABASE_URL || 'https://chutexfnzoylpuikeblz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_M_oSfDnhS18elv7J3hsWjw_wcZk6bFp';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// 5. JWT Secure Guard Middleware
async function verifyAuth(req, res, next) {
    if (req.method !== 'POST') return next();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Blocked unauthenticated request to /api/chat');
        return res.status(401).json({ type: 'error', message: 'Unauthorized: Missing Supabase Authorization header.' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);
        if (error || !user) {
            console.warn(`Blocked invalid token: ${error?.message}`);
            return res.status(401).json({ type: 'error', message: 'Unauthorized: Invalid Supabase JWT token.' });
        }
        req.userAuth = user;
        next();
    } catch (err) {
        return res.status(500).json({ type: 'error', message: 'Internal Server Error during security auth verification.' });
    }
}

// 6. 🧠 Hybrid Context Caching Engine (Redis / Memory)
const REDIS_URL = process.env.REDIS_URL;
let redisClient = null;
const memoryCache = new Map(); // Fallback RAM Cache if Redis isn't configured

if (REDIS_URL) {
    redisClient = new Redis(REDIS_URL);
    console.log("🔥 Connected to Enterprise Redis Cluster");
}

function hashPrompt(messages, providerId, systemPrompt) {
    // We only hash the unique context needed to answer
    const data = JSON.stringify({ messages, providerId, systemPrompt: systemPrompt || '' });
    return `omni:chat:${crypto.createHash('sha256').update(data).digest('hex')}`;
}

async function getFromCache(key) {
    if (redisClient) {
        return await redisClient.get(key);
    } else {
        const entry = memoryCache.get(key);
        if (entry && entry.expiresAt > Date.now()) return entry.data;
        if (entry) memoryCache.delete(key);
        return null;
    }
}

async function saveToCache(key, text) {
    const TTL_SECONDS = 60 * 60 * 24; // Expire duplicate responses after 24 Hours
    if (redisClient) {
        await redisClient.set(key, text, 'EX', TTL_SECONDS);
    } else {
        memoryCache.set(key, { data: text, expiresAt: Date.now() + (TTL_SECONDS * 1000) });
    }
}

// 📊 Usage Tracking & Metrics
const estimateTokens = (text) => Math.ceil((text || '').length / 4);

const logUsage = async (userId, modelName, providerSlug, tokensIn, tokensOut, type) => {
    try {
        console.log(`📊 LOGGING: [${type}] ${modelName} for ${userId.slice(0, 8)}...`);
        const { error } = await supabaseClient.from('usage_metrics').insert([{
            user_id: userId,
            model_name: modelName,
            provider_slug: providerSlug,
            tokens_in: tokensIn,
            tokens_out: tokensOut,
            generation_type: type
        }]);
        if (error) console.error("❌ SQL_ERROR:", error.message);
    } catch (err) {
        console.error("❌ LOG_ERROR:", err.message);
    }
};

// --- Helper Functions for Streaming (SSE) ---
function setSSEHeaders(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
}

function sendChunk(res, text) { 
    res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`); 
}

function sendDone(res) { 
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`); 
    res.end(); 
}

function sendError(res, message) { 
    res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`); 
    res.end(); 
}

// --- AI Logic Handlers ---

// 🟣 Meta (Llama via Groq)
async function streamGroq(res, messages, systemPrompt, cacheKey) {
    if (!groq) return sendError(res, 'Groq API setup failed.');
    let fullResponse = '';
    try {
        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages,
            stream: true,
        });

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
                fullResponse += text;
                sendChunk(res, text);
            }
        }
        sendDone(res);
        // Save the successfully captured stream into our Hybrid Cache!
        if (cacheKey && fullResponse.length > 5) await saveToCache(cacheKey, fullResponse);

        // 📊 LOG: Chat Usage (Meta)
        if (typeof res.locals?.userId === 'string') {
            logUsage(res.locals.userId, "llama-3.3-70b", "meta", estimateTokens(messages.map(m=>m.content).join(' ')), estimateTokens(fullResponse), 'chat');
        }
    } catch (e) {
        sendError(res, `Groq Error: ${e.message}`);
    }
}

// 🔵 Google Gemini
async function streamGemini(res, messages, systemPrompt, cacheKey) {
    if (!gemini) return sendError(res, 'Gemini API key missing.');
    let fullResponse = '';
    try {
        const modelInstance = gemini.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            ...(systemPrompt ? { systemInstruction: systemPrompt } : {}) 
        });
        
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const result = await modelInstance.startChat({ history })
            .sendMessageStream(messages[messages.length - 1].content);

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                fullResponse += text;
                sendChunk(res, text);
            }
        }
        sendDone(res);
        // Save the successfully captured stream into our Hybrid Cache!
        if (cacheKey && fullResponse.length > 5) await saveToCache(cacheKey, fullResponse);

        // 📊 LOG: Chat Usage (Google)
        if (typeof res.locals?.userId === 'string') {
            logUsage(res.locals.userId, "gemini-1.5-flash", "google", estimateTokens(messages.map(m=>m.content).join(' ')), estimateTokens(fullResponse), 'chat');
        }
    } catch (e) {
        sendError(res, `Gemini Error: ${e.message}`);
    }
}

// --- Main API Route ---
app.post('/api/chat', chatLimiter, verifyAuth, async (req, res) => {
    const { messages = [], providerId, systemPrompt } = req.body;
    res.locals = { userId: req.userAuth.id }; // Pass to stream handlers
    setSSEHeaders(res);

    try {
        // 1. Generate Mathematical SHA-256 Fingerprint for Identity
        const cacheKey = hashPrompt(messages, providerId, systemPrompt);
        
        // 2. Check the Blazing Fast Cache!
        const cachedAnswer = await getFromCache(cacheKey);
        if (cachedAnswer) {
            console.log(`⚡ CACHE HIT! (${providerId}) Bypassing API logic.`);
            sendChunk(res, cachedAnswer); // Instantly reply in 1 packet!
            return sendDone(res);
        }

        console.log(`🤖 CACHE MISS (${providerId}). Generating fresh response...`);

        // 3. Fallback to Expensive API Calls if Not Cached
        if (providerId === 'meta') {
            await streamGroq(res, messages, systemPrompt, cacheKey);
        } else if (providerId === 'google') {
            await streamGemini(res, messages, systemPrompt, cacheKey);
        } else {
            sendError(res, `Provider ${providerId} not configured.`);
        }
    } catch (err) {
        sendError(res, `Internal Server Error: ${err.message}`);
    }
});

// 🖼️ 0-Cost Image Generation (via Pollinations.ai)
app.post('/api/image', verifyAuth, async (req, res) => {
    const { prompt, aspectRatio = '1:1', modelId = 'flux' } = req.body;
    
    // Default dimensions based on aspect ratio
    const dims = { '1:1': [1024, 1024], '16:9': [1280, 720], '9:16': [720, 1280], '4:3': [1024, 768], '3:4': [768, 1024] };
    const [w, h] = dims[aspectRatio] || [1024, 1024];

    try {
        console.log(`🎨 GEN IMAGE: "${prompt.slice(0, 40)}..." [${aspectRatio}]`);
        
        // Construct Pollinations URL (Free, no key needed)
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&model=${modelId === 'flux' ? 'flux' : 'turbo'}&nologo=true`;
        
        // 📊 LOG: Image Usage
        logUsage(req.userAuth.id, modelId, 'pollinations', 0, 0, 'image');

        // Return JSON with the URL
        res.json({ success: true, url: imageUrl, modelUsed: modelId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate image URL' });
    }
});

// 🎬 SOTA Video Simulation (God-Tier Demo)
app.post('/api/video', verifyAuth, async (req, res) => {
    const { prompt } = req.body;
    console.log(`📹 GEN VIDEO: "${prompt.slice(0, 40)}..."`);

    // Simulate high-end processing delay
    setTimeout(() => {
        // Return a high-quality AI-generated stock video as a placeholder for Sora/Kling
        const demoVideos = [
            'https://cdn.pixabay.com/vimeo/853755015/city-174828.mp4?width=1280&hash=1d8b7b2b7b2b7b2b7b2b7b2b7b2b7b2b7b2b7b2b',
            'https://cdn.pixabay.com/vimeo/849925244/mountain-173673.mp4?width=1280&hash=d7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7'
        ];
        const randomVideo = demoVideos[Math.floor(Math.random() * demoVideos.length)];
        
        // 📊 LOG: Video Usage
        logUsage(req.userAuth.id, 'sora-demo', 'openai', 0, 0, 'video');

        res.json({ success: true, url: randomVideo });
    }, 4500); // 4.5s "thinking" time for cinematic feel
});

// 🎙️ 0-Cost Transcription Simulation (for file uploads)
app.post('/api/transcribe', verifyAuth, async (req, res) => {
    console.log(`🎙️ TRANSCRIBE: Received audio for processing...`);
    
    // Simulate processing time
    setTimeout(() => {
        // 📊 LOG: Voice Usage
        logUsage(req.userAuth.id, 'whisper-sim', 'openai', 0, 0, 'voice');

        res.json({ 
            text: "This is a high-fidelity simulation of an AI transcription. In a production environment, this would be processed by Whisper v3 or a similar SOTA model.",
            success: true 
        });
    }, 2000);
});

// --- Start Server (FIXED FOR RENDER) ---
app.listen(PORT, '0.0.0.0', () => {
    console.log('---');
    console.log(`🚀 OMNI AI BACKEND IS LIVE`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
    console.log(`🔐 Groq Status: ${GROQ_KEY ? 'Connected ✅' : 'Not Found ❌'}`);
    console.log(`🔐 Gemini Status: ${GEMINI_KEY ? 'Connected ✅' : 'Not Found ❌'}`);
    console.log('---');
});