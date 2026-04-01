import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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
async function streamGroq(res, messages, systemPrompt) {
    if (!groq) return sendError(res, 'Groq API setup failed.');
    try {
        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages,
            stream: true,
        });

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) sendChunk(res, text);
        }
        sendDone(res);
    } catch (e) {
        sendError(res, `Groq Error: ${e.message}`);
    }
}

// 🔵 Google Gemini
async function streamGemini(res, messages, systemPrompt) {
    if (!gemini) return sendError(res, 'Gemini API key missing.');
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
            if (text) sendChunk(res, text);
        }
        sendDone(res);
    } catch (e) {
        sendError(res, `Gemini Error: ${e.message}`);
    }
}

// --- Main API Route ---
app.post('/api/chat', chatLimiter, async (req, res) => {
    const { messages = [], providerId, systemPrompt } = req.body;
    setSSEHeaders(res);

    try {
        if (providerId === 'meta') {
            await streamGroq(res, messages, systemPrompt);
        } else if (providerId === 'google') {
            await streamGemini(res, messages, systemPrompt);
        } else {
            sendError(res, `Provider ${providerId} not configured.`);
        }
    } catch (err) {
        sendError(res, `Internal Server Error: ${err.message}`);
    }
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