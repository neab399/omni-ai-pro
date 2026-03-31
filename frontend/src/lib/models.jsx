import React from 'react';

/* ══════════════════════════════════════════════════════════
   ALL 68+ MODELS — organised by section
══════════════════════════════════════════════════════════ */

/* ── TEXT PROVIDERS ── */
export const TEXT_PROVIDERS = [
  {
    id: 'openai', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'gpt-5-4',      name: 'GPT-5.4',           type: 'OpenAI Ultimate',       plan: 'elite',  contextWindow: '256K', speed: 'Medium',    badge: 'Elite' },
      { id: 'gpt-5-2',      name: 'GPT-5.2',           type: 'OpenAI Premium',        plan: 'elite',  contextWindow: '200K', speed: 'Medium',    badge: 'Elite' },
      { id: 'gpt-5-1',      name: 'GPT-5.1',           type: 'OpenAI Advanced',       plan: 'elite',  contextWindow: '200K', speed: 'Fast',      badge: 'Elite' },
      { id: 'gpt-5',        name: 'GPT-5',             type: 'OpenAI Flagship',       plan: 'pro',    contextWindow: '128K', speed: 'Medium',    badge: 'Pro' },
      { id: 'gpt-4-1-mini', name: 'GPT-4.1 mini',      type: 'OpenAI Premium',        plan: 'pro',    contextWindow: '128K', speed: 'Fast',      badge: 'Pro' },
      { id: 'gpt-5-mini',   name: 'GPT-5 Mini',        type: 'OpenAI Professional',   plan: 'basic',  contextWindow: '64K',  speed: 'Very Fast', badge: null },
      { id: 'gpt-4-1-nano', name: 'GPT-4.1 Nano',      type: 'Simple Chat',           plan: 'basic',  contextWindow: '32K',  speed: 'Very Fast', badge: 'Free' },
      { id: 'o1-pro',       name: 'OpenAI o1-Pro',     type: 'Deep Reasoning',        plan: 'elite',  contextWindow: '200K', speed: 'Slow',      badge: 'Elite' },
    ]
  },
  {
    id: 'anthropic', name: 'Anthropic', slug: 'anthropic', color: '#d97757',
    models: [
      { id: 'claude-4-6-opus',   name: 'Claude 4.6 Opus',    type: 'PhD Level Writing',    plan: 'elite', contextWindow: '200K', speed: 'Slow',   badge: 'Elite' },
      { id: 'claude-4-6-sonnet', name: 'Claude 4.6 Sonnet',  type: 'Undisputed Coding King',plan:'elite', contextWindow: '200K', speed: 'Medium', badge: 'Elite' },
      { id: 'claude-3-opus',     name: 'Claude 3 Opus',      type: 'Legacy Enterprise',    plan: 'elite', contextWindow: '200K', speed: 'Slow',   badge: 'Elite' },
      { id: 'claude-3-5-haiku',  name: 'Claude 3.5 Haiku',   type: 'Long-form Writing',    plan: 'basic', contextWindow: '200K', speed: 'Fast',   badge: null },
    ]
  },
  {
    id: 'google', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'gemini-3-ultra',  name: 'Gemini 3 Ultra',      type: 'Google Enterprise',   plan: 'elite', contextWindow: '2M',   speed: 'Slow',      badge: 'Elite' },
      { id: 'gemini-3-1-pro',  name: 'Gemini 3.1 Pro',      type: 'Google 2M Context',   plan: 'pro',   contextWindow: '2M',   speed: 'Medium',    badge: 'Pro' },
      { id: 'gemini-3-pro',    name: 'Gemini 3 Pro',        type: 'Google Pro',          plan: 'pro',   contextWindow: '1M',   speed: 'Medium',    badge: 'Pro' },
      { id: 'gemini-2-5-pro',  name: 'Gemini 2.5 Pro',      type: 'Google Powerful',     plan: 'pro',   contextWindow: '1M',   speed: 'Medium',    badge: 'Pro' },
      { id: 'gemini-3-flash',  name: 'Gemini 3 Flash-Lite', type: 'Google Fast',         plan: 'basic', contextWindow: '1M',   speed: 'Very Fast', badge: null },
      { id: 'gemini-2-0-flash',name: 'Gemini 2.0 Flash',    type: 'Bulk Content',        plan: 'basic', contextWindow: '1M',   speed: 'Very Fast', badge: null },
      { id: 'gemma-3',         name: 'Gemma 3',             type: 'Lightweight Summaries',plan:'basic',  contextWindow: '128K', speed: 'Very Fast', badge: 'Free' },
    ]
  },
  {
    id: 'xai', name: 'xAI', slug: 'x', color: '#ffffff',
    models: [
      { id: 'grok-4',       name: 'Grok 4',          type: 'X Data Integration',  plan: 'elite', contextWindow: '256K', speed: 'Medium',    badge: 'Elite' },
      { id: 'grok-4-1-fast',name: 'Grok 4.1 Fast',   type: 'xAI Witty',           plan: 'basic', contextWindow: '128K', speed: 'Very Fast', badge: null },
    ]
  },
  {
    id: 'deepseek', name: 'DeepSeek', slug: 'deepseek', color: '#4d6bfe',
    models: [
      { id: 'deepseek-v3-2',    name: 'DeepSeek V3.2',    type: 'Value King',         plan: 'basic', contextWindow: '64K',  speed: 'Fast',   badge: 'Popular' },
      { id: 'deepseek-reasoner',name: 'DeepSeek Reasoner', type: 'Complex Math/Science',plan:'pro',   contextWindow: '64K',  speed: 'Slow',   badge: 'Pro' },
    ]
  },
  {
    id: 'meta', name: 'Meta', slug: 'meta', color: '#0081fb',
    models: [
      { id: 'llama-4-400b',  name: 'Llama 4 (400B+)',  type: 'Server Breaking Power', plan: 'elite', contextWindow: '128K', speed: 'Slow',      badge: 'Elite' },
      { id: 'llama-4-8b',    name: 'Llama 4 (8B Alpha)',type: 'Fast Reasoning',       plan: 'basic', contextWindow: '128K', speed: 'Very Fast', badge: 'Free' },
      { id: 'llama-3-2-11b', name: 'Llama 3.2 (11B)',  type: 'Meta Creative',         plan: 'basic', contextWindow: '128K', speed: 'Fast',      badge: 'Free' },
      { id: 'llama-3-2-90b', name: 'Llama 3.2 (90B)',  type: 'Meta Powerful',         plan: 'basic', contextWindow: '128K', speed: 'Medium',    badge: 'Free' },
    ]
  },
  {
    id: 'alibaba', name: 'Alibaba', slug: 'alibabadotcom', color: '#ff6900',
    models: [
      { id: 'qwen-3-5',      name: 'Qwen 3.5',         type: 'Multilingual',         plan: 'basic', contextWindow: '128K', speed: 'Fast',      badge: null },
      { id: 'qwen-3-max',    name: 'Qwen 3 Max',       type: 'Asian Heavyweight',    plan: 'pro',   contextWindow: '128K', speed: 'Medium',    badge: 'Pro' },
      { id: 'qwen-3-coder',  name: 'Qwen 3 Coder Flash',type:'Code-Mixed',           plan: 'basic', contextWindow: '64K',  speed: 'Fast',      badge: null },
      { id: 'qwen-plus',     name: 'Qwen Plus',        type: 'General Purpose',      plan: 'basic', contextWindow: '64K',  speed: 'Fast',      badge: null },
    ]
  },
  {
    id: 'mistral', name: 'Mistral', slug: 'mistral', color: '#ff7000',
    models: [
      { id: 'mistral-small-3-1', name: 'Mistral Small 3.1', type: 'Fast Dialogue',   plan: 'basic', contextWindow: '32K',  speed: 'Very Fast', badge: null },
      { id: 'mistral-nemo',      name: 'Mistral Nemo',      type: 'Code-Mixed',      plan: 'basic', contextWindow: '128K', speed: 'Fast',      badge: null },
      { id: 'magistral-medium',  name: 'Magistral Medium',  type: 'European Logic',  plan: 'pro',   contextWindow: '64K',  speed: 'Medium',    badge: 'Pro' },
    ]
  },
  {
    id: 'moonshot', name: 'Kimi', slug: 'moonshot', color: '#6366f1',
    models: [
      { id: 'kimi-k2-turbo', name: 'Kimi-k2 Turbo', type: 'Huge Memory',           plan: 'pro',   contextWindow: '1M',   speed: 'Medium', badge: 'Pro' },
    ]
  },
  {
    id: 'zhipu', name: 'Zhipu', slug: 'zhipuai', color: '#2563eb',
    models: [
      { id: 'glm-5', name: 'GLM-5', type: 'Logic & Math', plan: 'basic', contextWindow: '128K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'minimax', name: 'MiniMax', slug: 'minimax', color: '#8b5cf6',
    models: [
      { id: 'minimax-m2-5', name: 'MiniMax M2.5', type: 'Roleplay', plan: 'basic', contextWindow: '1M', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'liquidai', name: 'LiquidAI', slug: 'liquid', color: '#06b6d4',
    models: [
      { id: 'lfm2', name: 'LiquidAI LFM2', type: 'Everyday Tasks', plan: 'basic', contextWindow: '32K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'seedream', name: 'Seedream', slug: 'bytedance', color: '#fe2c55',
    models: [
      { id: 'seedream-5-0', name: 'Seedream 5.0', type: 'Human-like Chat', plan: 'elite', contextWindow: '128K', speed: 'Medium', badge: 'Elite' },
      { id: 'seedream-4-5', name: 'Seedream 4.5', type: 'Conversational',  plan: 'pro',   contextWindow: '64K',  speed: 'Fast',   badge: 'Pro' },
      { id: 'seedream-4-0', name: 'Seedream 4.0', type: 'General Chat',    plan: 'basic', contextWindow: '32K',  speed: 'Fast',   badge: null },
    ]
  },
  {
    id: 'nanobanana', name: 'Nano Banana', slug: 'banana', color: '#facc15',
    models: [
      { id: 'nano-banana-2',   name: 'Nano Banana 2',   type: 'Exclusive',      plan: 'elite', contextWindow: '256K', speed: 'Fast',   badge: 'Excl.' },
      { id: 'nano-banana-pro', name: 'Nano Banana Pro', type: 'Premium Excl.',  plan: 'elite', contextWindow: '128K', speed: 'Fast',   badge: 'Excl.' },
      { id: 'nano-banana',     name: 'Nano Banana',     type: 'Exclusive Basic',plan: 'pro',   contextWindow: '64K',  speed: 'Fast',   badge: 'Excl.' },
    ]
  },
  {
    id: 'sarvam', name: 'Sarvam', slug: 'sarvam', color: '#f59e0b',
    models: [
      { id: 'sarvam-m', name: 'Sarvam M', type: 'Indian Regional Languages', plan: 'basic', contextWindow: '32K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'stepfun', name: 'StepFun', slug: 'stepfun', color: '#ec4899',
    models: [
      { id: 'stepfun-flash', name: 'StepFun Flash', type: 'Quick Generation', plan: 'basic', contextWindow: '64K', speed: 'Very Fast', badge: null },
    ]
  },
  {
    id: 'arcee', name: 'Arcee', slug: 'arcee', color: '#14b8a6',
    models: [
      { id: 'arcee-trinity', name: 'Arcee Trinity', type: 'Technical Writing', plan: 'basic', contextWindow: '128K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'xiaomi', name: 'Xiaomi', slug: 'xiaomi', color: '#ff6900',
    models: [
      { id: 'mimo-v2', name: 'Xiaomi MiMo-V2', type: 'Ultra-Cheap Chat', plan: 'basic', contextWindow: '32K', speed: 'Very Fast', badge: 'Free' },
    ]
  },
];

/* ── IMAGE MODELS ── */
export const IMAGE_PROVIDERS = [
  {
    id: 'flux', name: 'Flux / Black Forest', slug: 'flux', color: '#a855f7',
    models: [
      { id: 'flux-schnell',   name: 'Flux Schnell',       type: '1-Second Ultra Fast',       plan: 'basic', badge: null,    speed: '~1s' },
      { id: 'flux-2-pro',     name: 'FLUX.2 [pro] Kontext',type:'Commercial Grade',           plan: 'pro',   badge: 'Pro',   speed: '~8s' },
      { id: 'flux-dev',       name: 'Flux Dev',           type: 'Precise Details',           plan: 'basic', badge: null,    speed: '~5s' },
    ]
  },
  {
    id: 'stability', name: 'Stability AI', slug: 'stability', color: '#7c3aed',
    models: [
      { id: 'sana-sprint',  name: 'SANA Sprint 1.6B',     type: 'High-Res Efficient',        plan: 'basic', badge: null,    speed: '~2s' },
      { id: 'sdxl-lightning',name:'SDXL Lightning',       type: 'Cinematic & Artistic',      plan: 'basic', badge: null,    speed: '~2s' },
      { id: 'sd-img2img',   name: 'SD Img2Img',           type: 'Photo Transform',           plan: 'basic', badge: null,    speed: '~4s' },
      { id: 'sd3-ultra',    name: 'Stable Diffusion 3 Ultra',type:"Designer's Choice",       plan: 'pro',   badge: 'Pro',   speed: '~6s' },
    ]
  },
  {
    id: 'midjourney', name: 'Midjourney', slug: 'midjourney', color: '#ffffff',
    models: [
      { id: 'mj-v7', name: 'Midjourney v7', type: 'The Gold Standard',      plan: 'elite', badge: 'Elite', speed: '~60s' },
      { id: 'mj-v6', name: 'Midjourney v6', type: 'Premium Quality',        plan: 'pro',   badge: 'Pro',   speed: '~45s' },
    ]
  },
  {
    id: 'openai-img', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'dalle-3-hd', name: 'DALL-E 3 HD', type: 'Exact Text Prompt',   plan: 'pro',   badge: 'Pro',   speed: '~15s' },
    ]
  },
  {
    id: 'google-img', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'imagen-3', name: 'Google Imagen 3', type: 'Photorealistic Faces', plan: 'pro', badge: 'Pro',   speed: '~10s' },
    ]
  },
  {
    id: 'xai-img', name: 'xAI', slug: 'x', color: '#ffffff',
    models: [
      { id: 'grok-imagine',     name: 'Grok Imagine',     type: 'Creative Gen',             plan: 'pro',   badge: 'Pro',   speed: '~10s' },
      { id: 'grok-imagine-pro', name: 'Grok Imagine Pro', type: 'High-End Multimodal',      plan: 'elite', badge: 'Elite', speed: '~20s' },
    ]
  },
];

/* ── AUDIO MODELS ── */
export const AUDIO_PROVIDERS = [
  {
    id: 'openai-audio', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'whisperflow', name: 'WhisperFlow',  type: 'Live Dictation / Streaming', mode: 'stt', plan: 'basic', badge: null },
      { id: 'whisper-v3',  name: 'Whisper v3',   type: 'Audio File Upload',          mode: 'stt', plan: 'basic', badge: null },
    ]
  },
  {
    id: 'google-audio', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'google-tts', name: 'Google Standard TTS', type: 'AI Voice Reading',  mode: 'tts', plan: 'basic', badge: null },
    ]
  },
  {
    id: 'elevenlabs', name: 'ElevenLabs', slug: 'elevenlabs', color: '#f97316',
    models: [
      { id: 'elevenlabs-turbo', name: 'ElevenLabs Turbo', type: "World's Best Realistic Voice", mode: 'tts', plan: 'elite', badge: 'Elite 👑' },
    ]
  },
];

/* ── VIDEO MODELS ── */
export const VIDEO_PROVIDERS = [
  {
    id: 'openai-vid', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'sora', name: 'Sora Video AI', type: 'OpenAI Text to Video', plan: 'elite', badge: 'Elite', duration: '5–20s' },
    ]
  },
  {
    id: 'kling', name: 'Kling / Luma', slug: 'kling', color: '#ec4899',
    models: [
      { id: 'kling-luma', name: 'Kling AI / Luma', type: 'Fast Motion Video', plan: 'elite', badge: 'Elite', duration: '5–10s' },
    ]
  },
];

/* ── MUSIC MODELS ── */
export const MUSIC_PROVIDERS = [
  {
    id: 'suno', name: 'Suno', slug: 'suno', color: '#a855f7',
    models: [
      { id: 'suno-v4', name: 'Suno v4', type: 'Full Song & Vocals', plan: 'elite', badge: 'Elite' },
    ]
  },
  {
    id: 'udio', name: 'Udio', slug: 'udio', color: '#ec4899',
    models: [
      { id: 'udio-premium', name: 'Udio Premium', type: 'High-Fidelity Tracks', plan: 'elite', badge: 'Elite' },
    ]
  },
];

/* Flat list for lookups */
export const ALL_TEXT_MODELS = TEXT_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
export const ALL_IMAGE_MODELS = IMAGE_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
export const ALL_AUDIO_MODELS = AUDIO_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
export const ALL_VIDEO_MODELS = VIDEO_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));

/* ── SLASH COMMANDS ── */
export const SLASH_COMMANDS = [
  { cmd: '/improve',   label: 'Improve Prompt',    desc: 'AI enhances your message',        icon: '✦' },
  { cmd: '/summarize', label: 'Summarize',          desc: 'Summarize a topic concisely',     icon: '▣' },
  { cmd: '/explain',   label: 'Explain Simply',     desc: 'Simple, clear explanation',       icon: '◉' },
  { cmd: '/code',      label: 'Code Mode',          desc: 'Switch to programming help',      icon: '⌥' },
  { cmd: '/compare',   label: 'Compare Models',     desc: 'Force multi-model mode',          icon: '⇌' },
  { cmd: '/translate', label: 'Translate',          desc: 'Translate to another language',   icon: '◎' },
  { cmd: '/email',     label: 'Draft Email',        desc: 'Write a professional email',      icon: '✉' },
  { cmd: '/proofread', label: 'Proofread',          desc: 'Check grammar and style',         icon: '✍' },
  { cmd: '/debug',     label: 'Debug Code',         desc: 'Analyze and fix code issues',     icon: '⚡' },
];

/* ── PROMPT TEMPLATES ── */
export const PROMPT_TEMPLATES = [
  { label: 'Debug Code',    text: 'Help me debug this code:\n\n```\n\n```', icon: '⚡' },
  { label: 'Brainstorm',    text: 'Brainstorm 10 creative ideas for: ',      icon: '◎' },
  { label: 'Pros & Cons',   text: 'Pros and cons analysis of: ',             icon: '⇌' },
  { label: 'Summarize',     text: 'Summarize in 5 key bullet points:\n\n',   icon: '▣' },
  { label: 'Explain',       text: 'Explain step by step with examples: ',    icon: '◉' },
  { label: 'Email Draft',   text: 'Write a professional email about: ',      icon: '✉' },
  { label: 'Review',        text: 'Review and suggest improvements:\n\n',    icon: '✦' },
  { label: 'Write Post',    text: 'Write a LinkedIn post about: ',           icon: '✍' },
];

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
export const genId = () => Math.random().toString(36).slice(2, 9);
export const formatTime = d => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const estimateTokens = t => Math.ceil((t || '').length / 4);

export const parseMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block" data-lang="${lang || 'code'}">
        <div class="code-header"><span class="code-lang">${lang || 'code'}</span>
          <button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('pre').innerText).then(()=>{this.textContent='✓ Copied';setTimeout(()=>this.textContent='Copy',1500)})">Copy</button>
        </div>
        <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>`
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/^[\-\*] (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, s => `<ul class="md-ul">${s}</ul>`)
    .split(/\n\n+/)
    .map(p => p.startsWith('<') ? p : `<p class="md-p">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
};

/* ══════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════ */
export const GLOBAL_STYLES = `
  :root[data-theme="dark"] {
    --bg-base: #030305;
    --bg-panel: rgba(14, 14, 18, 0.65);
    --bg-hover: rgba(255, 255, 255, 0.04);
    --bg-input: rgba(0, 0, 0, 0.5);
    --bg-modal: #080810;
    --bg-card: rgba(255, 255, 255, 0.02);
    
    --text-main: #f0f0f5;
    --text-sec: rgba(255, 255, 255, 0.72);
    --text-muted: rgba(255, 255, 255, 0.40);
    --text-faint: rgba(255, 255, 255, 0.13);
    
    --border-light: rgba(255, 255, 255, 0.06);
    --border-med: rgba(255, 255, 255, 0.10);
    --border-focus: rgba(255, 217, 61, 0.45);
    
    --accent: #FFD93D;
    --accent-low: rgba(255, 217, 61, 0.08);
    --accent2: #3b82f6;
    
    --green: #4ade80; --red: #f87171; --blue: #60a5fa;
    --shadow-sm: 0 2px 16px rgba(0,0,0,0.5);
    --shadow-md: 0 8px 40px rgba(0,0,0,0.7);
    --shadow-lg: 0 20px 80px rgba(0,0,0,0.9);
    --glow-gold: 0 0 20px rgba(255,217,61,0.12), 0 0 60px rgba(255,217,61,0.05);
    --glow-gold-strong: 0 0 25px rgba(255,217,61,0.2), 0 0 80px rgba(255,217,61,0.08);
    --img-bg: #020204;
    --section-active: rgba(255, 217, 61, 0.06);
    --panel-blur: blur(24px);
    --panel-blur-strong: blur(40px);
  }
  
  :root[data-theme="light"] {
    --bg-base: #f8f9fa;
    --bg-panel: rgba(255,255,255,0.85);
    --bg-hover: rgba(0, 0, 0, 0.035);
    --bg-input: #f0f1f3;
    --bg-modal: #ffffff;
    --bg-card: rgba(0,0,0,0.015);
    
    --text-main: #09090b;
    --text-sec: #3f3f46;
    --text-muted: #71717a;
    --text-faint: #c4c4cc;
    
    --border-light: rgba(0,0,0,0.06);
    --border-med: rgba(0,0,0,0.10);
    --border-focus: #e8a850;
    
    --accent: #e8a850;
    --accent-low: rgba(232, 168, 80, 0.10);
    --accent2: #2563eb;
    
    --green: #16a34a; --red: #dc2626; --blue: #2563eb;
    --shadow-sm: 0 1px 8px rgba(0,0,0,0.04);
    --shadow-md: 0 6px 24px rgba(0,0,0,0.06);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.10);
    --glow-gold: 0 0 15px rgba(232,168,80,0.08);
    --glow-gold-strong: 0 0 20px rgba(232,168,80,0.12);
    --img-bg: #f0f1f3;
    --section-active: rgba(232, 168, 80, 0.08);
    --panel-blur: blur(20px);
    --panel-blur-strong: blur(30px);
  }

  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  body{font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:14px;background:var(--bg-base);color:var(--text-main);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

  .omni-scroll::-webkit-scrollbar{width:5px;height:5px;}
  .omni-scroll::-webkit-scrollbar-track{background:transparent;}
  .omni-scroll::-webkit-scrollbar-thumb{background:var(--border-med);border-radius:10px;transition:background .3s;}
  .omni-scroll::-webkit-scrollbar-thumb:hover{background:var(--accent);box-shadow:0 0 8px var(--accent-low);}

  .md-p{margin:0 0 14px;line-height:1.8;color:var(--text-sec);font-size:14.5px;letter-spacing:0.01em;}
  .md-p:last-child{margin-bottom:0;}
  .md-h1{font-size:26px;font-weight:800;color:var(--text-main);margin:30px 0 16px;font-family:'Outfit',sans-serif;letter-spacing:-0.03em;background:linear-gradient(135deg,var(--text-main),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .md-h2{font-size:21px;font-weight:700;color:var(--text-main);margin:26px 0 13px;font-family:'Outfit',sans-serif;letter-spacing:-0.02em;}
  .md-h3{font-size:17px;font-weight:600;color:var(--text-main);margin:20px 0 11px;font-family:'Outfit',sans-serif;letter-spacing:-0.01em;}
  .md-quote{border-left:3px solid var(--accent);padding:12px 20px;color:var(--text-muted);font-style:italic;margin:16px 0;background:var(--accent-low);border-radius:0 12px 12px 0;backdrop-filter:blur(8px);}
  .md-ul{margin:12px 0 16px;padding:0;list-style:none;}
  .md-li{padding:5px 0 5px 24px;position:relative;color:var(--text-sec);font-size:14.5px;line-height:1.7;}
  .md-li::before{content:'✦';position:absolute;left:4px;color:var(--accent);font-size:10px;top:10px;filter:drop-shadow(0 0 3px var(--accent-low));}
  .inline-code{background:var(--accent-low);border:1px solid rgba(255,217,61,0.15);border-radius:7px;padding:2.5px 7px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent);font-weight:600;letter-spacing:0.02em;}
  
  .code-block{background:#08080c;border:1px solid var(--border-med);border-radius:16px;margin:20px 0;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04);}
  .code-header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:linear-gradient(135deg,rgba(255,217,61,0.04),transparent 60%);backdrop-filter:var(--panel-blur);border-bottom:1px solid var(--border-light);}
  .code-lang{font-size:10.5px;color:var(--accent);font-weight:800;text-transform:uppercase;letter-spacing:.12em;text-shadow:0 0 12px var(--accent-low);}
  .code-block pre{margin:0;padding:22px;overflow-x:auto;font-size:13px;line-height:1.8;color:#c8cacc;font-family:'JetBrains Mono','Fira Code',monospace;letter-spacing:0.02em;}
  .code-copy-btn{background:rgba(255,255,255,0.03);border:1px solid var(--border-med);border-radius:8px;padding:5px 14px;font-size:11px;color:var(--text-muted);cursor:pointer;font-weight:700;transition:all .25s;backdrop-filter:blur(4px);}
  .code-copy-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-low);box-shadow:var(--glow-gold);}

  @keyframes omni-spin{to{transform:rotate(360deg)}}
  @keyframes omni-pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes omni-fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes img-appear{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
  @keyframes msg-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glow-pulse{0%,100%{box-shadow:0 0 12px rgba(255,217,61,0.08)}50%{box-shadow:0 0 24px rgba(255,217,61,0.18)}}
  @keyframes gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes wave{0%,100%{height:6px}50%{height:22px}}
  @keyframes subtle-breathe{0%,100%{opacity:0.6}50%{opacity:1}}

  .spin{animation:omni-spin .7s linear infinite;}
  .pulse-text{animation:omni-pulse 1.2s ease infinite;}
  .img-appear{animation:img-appear .5s cubic-bezier(0.16, 1, 0.3, 1) forwards;}
  .msg-appear{animation:msg-slide .35s cubic-bezier(0.16, 1, 0.3, 1) forwards;}

  input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;background:var(--border-med);outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--accent);cursor:pointer;box-shadow:0 0 14px rgba(255,217,61,0.25);border:2px solid rgba(0,0,0,0.3);}
  ::selection{background:rgba(255,217,61,0.2);color:var(--accent);}

  .img-grid-1{grid-template-columns:1fr;}
  .img-grid-2{grid-template-columns:1fr 1fr;}
  .img-grid-3{grid-template-columns:1fr 1fr 1fr;}
`;

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
export const IC = {
  Menu:      () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h16"/></svg>,
  Plus:      () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Send:      () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  User:      () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  X:         () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Copy:      () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  Trash:     () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Pin:       () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v5M9 8h6M9 12h6M15 2H9a1 1 0 0 0-1 1v1.586a1 1 0 0 0 .293.707l1.414 1.414A1 1 0 0 1 10 7.5V8h4v-.5a1 1 0 0 1 .293-.707l1.414-1.414A1 1 0 0 0 16 4.586V3a1 1 0 0 0-1-1z"/></svg>,
  Edit:      () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Sun:       () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon:      () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ArrowR:    () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Search:    () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Sparkle:   () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Paperclip: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Mic:       () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  Check:     () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Layers:    () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  ChevronD:  () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  Sidebar:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  Bolt:      () => <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>,
  Image:     () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Volume:    () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  Video:     () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Chat:      () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Download:  () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Play:      () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Stop:      () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>,
  Pause:     () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Refresh:   () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Music:     () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Star:      () => <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Wand:      () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 4V2M15 16v-2M8 9H2M21 9h-2M17.8 11.8 19 13M15 9h.01M10.2 6.2 9 5M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM15 9v10"/></svg>,
};