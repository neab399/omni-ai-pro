import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const MODELS = [
  { name: 'Claude 4.6 Opus', maker: 'Anthropic', color: '#e8a85f', use: 'God-Tier Reasoning', slug: 'anthropic' },
  { name: 'GPT-5.4', maker: 'OpenAI', color: '#10a37f', use: 'Elite Logic & Coding', slug: 'openai' },
  { name: 'Gemini 3.1 Pro', maker: 'Google', color: '#4285f4', use: '2M Token Context', slug: 'googlegemini' },
  { name: 'Midjourney v7', maker: 'Midjourney', color: '#ffffff', use: 'Studio Image Gen', slug: 'midjourney' },
  { name: 'DeepSeek V3.2', maker: 'DeepSeek', color: '#4d6bfe', use: 'Math & Prose King', slug: 'deepseek' },
  { name: 'Sora Video AI', maker: 'OpenAI', color: '#ab68ff', use: 'Text to Video AI', slug: 'openai' },
  { name: 'Grok 4.1 Fast', maker: 'xAI', color: '#1DA1F2', use: 'Uncensored Real-time', slug: 'x' },
  { name: 'Flux Pro', maker: 'Black Forest', color: '#ff4d6d', use: 'HD Image Gen', slug: 'flux' },
  { name: 'WhisperFlow', maker: 'Cartesia', color: '#22d3ee', use: 'Live Dictation', slug: 'cartesia' },
  { name: 'Qwen 3 Max', maker: 'Alibaba', color: '#ff7000', use: 'Asian Heavyweight', slug: 'alibabadotcom' },
  { name: 'Llama 4', maker: 'Meta', color: '#0082fb', use: 'Massive Open Model', slug: 'meta' },
  { name: 'Suno v4', maker: 'Suno', color: '#20b8cd', use: 'AI Music Gen', slug: 'suno' },
  { name: 'Claude Sonnet', maker: 'Anthropic', color: '#d4924a', use: 'Coding Master', slug: 'anthropic' },
  { name: 'OpenAI o1-Pro', maker: 'OpenAI', color: '#1a8a6e', use: 'Deep Thinker', slug: 'openai' },
  { name: 'Gemini 3 Ultra', maker: 'Google', color: '#4285f4', use: 'Enterprise Logic', slug: 'googlegemini' },
  { name: 'DALL-E 3 HD', maker: 'OpenAI', color: '#ab68ff', use: 'Exact Text Images', slug: 'openai' },
];

export const MARQUEE_ITEMS = ['GPT-5.4', 'Claude 4.6', 'Gemini 3.1', 'Midjourney v7', 'WhisperFlow', 'Flux Pro', 'DeepSeek', 'Sora Video', 'Llama 4', 'Qwen 3'];

export const COMPARE_DATA = [
  { label: 'Starting Price / Mo', omni: '₹249', gpt: '~₹1,700', claude: '~₹1,700' },
  { label: 'Models Included', omni: '68 Top Models', gpt: 'Only 3', claude: 'Only 3' },
  { label: 'Max Tokens / Month', omni: 'Up to 20M', gpt: '~500K', claude: '~400K' },
  { label: 'Image & Video Gen', omni: 'MJ + Sora + Flux', gpt: 'DALL·E 3', claude: 'None' },
  { label: 'Voice & Music AI', omni: 'Whisper + Suno', gpt: 'Basic TTS', claude: 'None' },
];

export const PRICING = [
  { tier: 'Starter', price: '249', period: '/mo', desc: 'Perfect for individual creators and students.', features: ['20 AI Models', '500K Tokens/mo', 'Text & Image Gen', 'Community Support', 'Basic Analytics'], popular: false },
  { tier: 'Pro', price: '599', period: '/mo', desc: 'For professionals who need the full arsenal.', features: ['All 68 Models', '5M Tokens/mo', 'Text, Image, Video, Audio', 'Priority Support', 'API Access', 'Custom Presets'], popular: true },
  { tier: 'Ultra', price: '999', period: '/mo', desc: 'Enterprise-grade power for teams and agencies.', features: ['All 68 Models', '20M Tokens/mo', 'Everything in Pro', 'Dedicated Support', 'Team Workspaces', 'Custom Fine-tuning', 'SLA Guarantee'], popular: false },
];

export const FAQ_DATA = [
  { q: 'How is OMNI AI different from ChatGPT or Claude?', a: 'OMNI AI gives you access to 68+ AI models in one interface. Instead of paying $20/mo each for ChatGPT, Claude, and Midjourney separately, you get ALL of them — plus dozens more — starting at just ₹249/mo.' },
  { q: 'Can I switch models mid-conversation?', a: 'Absolutely. Our intelligent routing system lets you start a conversation with GPT-5.4 and seamlessly switch to Claude 4.6 Opus mid-thread. Your context is preserved across model switches.' },
  { q: 'What types of AI are included?', a: 'Text generation (GPT-5, Claude, Gemini, Llama), image generation (Midjourney, DALL-E, Flux), video generation (Sora), music generation (Suno), voice transcription (Whisper), and more.' },
  { q: 'Is my data private and secure?', a: 'Yes. We use end-to-end encryption, zero-retention API policies, and SOC 2 compliant infrastructure. Your prompts and data are never used to train third-party models.' },
  { q: 'Do you offer a free trial?', a: 'Yes! Sign up with no credit card needed and get access to a generous free tier with 50K tokens to explore the platform before committing.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and international payments via Stripe. All prices are in INR with no hidden fees.' },
];

export const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Full-Stack Developer', text: 'OMNI AI replaced 4 different subscriptions for me. Having GPT-5, Claude, and Midjourney in one place is insane. The interface is buttery smooth.', stars: 5, initials: 'AM', color: '#3b82f6' },
  { name: 'Priya Sharma', role: 'Content Strategist', text: 'I was skeptical, but the model-switching feature is a game changer. I draft with Claude, refine with GPT, and generate visuals with Midjourney — all in one chat.', stars: 5, initials: 'PS', color: '#a855f7' },
  { name: 'Rahul Kapoor', role: 'Startup Founder', text: 'At ₹599/mo for ALL 68 models, this is the most insane value in AI right now. My entire team uses it daily. Nothing else comes close.', stars: 5, initials: 'RK', color: '#f59e0b' },
];

export const LOGO_PROVIDERS = [
  { slug: 'openai', color: '#fff', name: 'OpenAI' },
  { slug: 'anthropic', color: '#e8a85f', name: 'Anthropic' },
  { slug: 'googlegemini', color: '#4285f4', name: 'Google' },
  { slug: 'meta', color: '#0082fb', name: 'Meta' },
  { slug: 'midjourney', color: '#fff', name: 'Midjourney' },
  { slug: 'x', color: '#fff', name: 'xAI' },
  { slug: 'deepseek', color: '#4d6bfe', name: 'DeepSeek' },
];
