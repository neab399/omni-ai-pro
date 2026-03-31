import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

/* ══════════════════════════════════════════════════════════
   SUPABASE
══════════════════════════════════════════════════════════ */
const supabaseUrl = 'https://chutexfnzoylpuikeblz.supabase.co';
const supabaseKey = 'sb_publishable_M_oSfDnhS18elv7J3hsWjw_wcZk6bFp';
const supabase = createClient(supabaseUrl, supabaseKey);

/* ══════════════════════════════════════════════════════════
   ALL 68+ MODELS — organised by section
══════════════════════════════════════════════════════════ */

/* ── TEXT PROVIDERS ── */
const TEXT_PROVIDERS = [
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
const IMAGE_PROVIDERS = [
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
const AUDIO_PROVIDERS = [
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
const VIDEO_PROVIDERS = [
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
const MUSIC_PROVIDERS = [
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
const ALL_TEXT_MODELS = TEXT_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
const ALL_IMAGE_MODELS = IMAGE_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
const ALL_AUDIO_MODELS = AUDIO_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));
const ALL_VIDEO_MODELS = VIDEO_PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));

/* ── SLASH COMMANDS ── */
const SLASH_COMMANDS = [
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
const PROMPT_TEMPLATES = [
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
const genId = () => Math.random().toString(36).slice(2, 9);
const formatTime = d => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const estimateTokens = t => Math.ceil((t || '').length / 4);

const parseMarkdown = (text) => {
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
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root[data-theme="dark"] {
    --bg-base:#060608; --bg-panel:#0c0c0e; --bg-hover:#141418; --bg-input:#101012;
    --bg-modal:#111114; --bg-card:#0f0f12;
    --text-main:#f0f0f2; --text-sec:#c0c0c8; --text-muted:#66667a; --text-faint:#2a2a36;
    --border-light:#181820; --border-med:#22222e; --border-focus:#3a3a50;
    --accent:#e8a85f; --accent-low:rgba(232,168,95,0.08); --accent2:#7c6af5;
    --green:#22c55e; --red:#ef4444; --blue:#3b82f6;
    --shadow-sm:0 2px 8px rgba(0,0,0,0.5); --shadow-md:0 8px 32px rgba(0,0,0,0.6);
    --shadow-lg:0 20px 60px rgba(0,0,0,0.7);
    --img-bg:#0a0a10; --section-active:rgba(232,168,95,0.06);
  }
  :root[data-theme="light"] {
    --bg-base:#f7f7fa; --bg-panel:#ffffff; --bg-hover:#f0f0f5; --bg-input:#f8f8fc;
    --bg-modal:#ffffff; --bg-card:#f4f4f8;
    --text-main:#0c0c14; --text-sec:#3c3c4a; --text-muted:#888899; --text-faint:#d0d0de;
    --border-light:#e8e8f0; --border-med:#dcdce8; --border-focus:#bbbbd0;
    --accent:#c2853a; --accent-low:rgba(194,133,58,0.07); --accent2:#5b4fd4;
    --green:#16a34a; --red:#dc2626; --blue:#2563eb;
    --shadow-sm:0 2px 8px rgba(0,0,0,0.06); --shadow-md:0 8px 32px rgba(0,0,0,0.1);
    --shadow-lg:0 20px 60px rgba(0,0,0,0.12);
    --img-bg:#f0f0f8; --section-active:rgba(194,133,58,0.05);
  }

  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  body{font-family:'Outfit',system-ui,sans-serif;font-size:14px;background:var(--bg-base);color:var(--text-main);}

  .omni-scroll::-webkit-scrollbar{width:4px;height:4px;}
  .omni-scroll::-webkit-scrollbar-track{background:transparent;}
  .omni-scroll::-webkit-scrollbar-thumb{background:var(--border-med);border-radius:10px;}
  .omni-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-focus);}

  .md-p{margin:0 0 11px;line-height:1.72;color:var(--text-sec);font-size:14.5px;}
  .md-p:last-child{margin-bottom:0;}
  .md-h1{font-size:20px;font-weight:700;color:var(--text-main);margin:20px 0 10px;}
  .md-h2{font-size:17px;font-weight:700;color:var(--text-main);margin:16px 0 8px;}
  .md-h3{font-size:15px;font-weight:600;color:var(--text-main);margin:14px 0 6px;}
  .md-quote{border-left:3px solid var(--accent);padding:8px 16px;color:var(--text-muted);font-style:italic;margin:12px 0;}
  .md-ul{margin:8px 0 12px;padding:0;list-style:none;}
  .md-li{padding:3px 0 3px 18px;position:relative;color:var(--text-sec);font-size:14.5px;line-height:1.6;}
  .md-li::before{content:'›';position:absolute;left:4px;color:var(--accent);font-size:16px;}
  .inline-code{background:var(--bg-hover);border:1px solid var(--border-light);border-radius:4px;padding:1px 6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent);}
  .code-block{background:var(--bg-modal);border:1px solid var(--border-med);border-radius:10px;margin:14px 0;overflow:hidden;}
  .code-header{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--bg-hover);border-bottom:1px solid var(--border-light);}
  .code-lang{font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;}
  .code-block pre{margin:0;padding:16px;overflow-x:auto;font-size:12.5px;line-height:1.65;color:var(--text-sec);font-family:'JetBrains Mono',monospace;}
  .code-copy-btn{background:none;border:1px solid var(--border-light);border-radius:5px;padding:2px 8px;font-size:11px;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;}
  .code-copy-btn:hover{border-color:var(--border-focus);color:var(--text-main);}

  @keyframes omni-spin{to{transform:rotate(360deg)}}
  @keyframes omni-pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes omni-fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes img-appear{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}

  .spin{animation:omni-spin .8s linear infinite;}
  .pulse-text{animation:omni-pulse 1.2s ease infinite;}
  .img-appear{animation:img-appear .4s ease forwards;}

  input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;background:var(--border-med);outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--accent);cursor:pointer;}
  ::selection{background:var(--accent-low);color:var(--text-main);}

  /* Image grid */
  .img-grid-1{grid-template-columns:1fr;}
  .img-grid-2{grid-template-columns:1fr 1fr;}
  .img-grid-3{grid-template-columns:1fr 1fr 1fr;}

  /* Waveform anim */
  @keyframes wave{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
`;

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const IC = {
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

/* ══════════════════════════════════════════════════════════
   SMALL REUSABLE UI
══════════════════════════════════════════════════════════ */
function BrandLogo({ slug, color, size = 16 }) {
  return <img src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`} alt={slug} width={size} height={size} style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />;
}

function ModelAvatar({ model, size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {model?.slug ? <BrandLogo slug={model.slug} color={model.color || '#888'} size={size * 0.52} /> : <img src="/logo.png" alt="AI" style={{ width: size * 0.55 }} />}
    </div>
  );
}

function UserAvatar({ profile, size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--bg-base)', fontWeight: 700, fontSize: size * 0.38 }}>
      {profile?.avatar ? <img src={profile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile?.name?.[0] || 'U')}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }} />
      ))}
    </div>
  );
}

function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 7, pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 22, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 22 }}
            onClick={() => removeToast(t.id)}
            style={{ padding: '9px 15px', background: 'var(--bg-panel)', border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,0.3)' : t.type === 'success' ? 'rgba(34,197,94,0.3)' : 'var(--border-med)'}`, borderRadius: 10, color: 'var(--text-main)', fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 9, pointerEvents: 'auto', minWidth: 180 }}>
            <span style={{ color: t.type === 'error' ? 'var(--red)' : t.type === 'success' ? 'var(--green)' : 'var(--accent)', fontSize: 15 }}>{t.type === 'error' ? '✕' : t.type === 'success' ? '✓' : 'ℹ'}</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function PlanBadge({ plan }) {
  const cfg = { elite: { label: 'Elite', color: '#facc15', bg: 'rgba(250,204,21,.1)' }, pro: { label: 'Pro', color: 'var(--accent)', bg: 'var(--accent-low)' }, basic: { label: 'Free', color: 'var(--green)', bg: 'rgba(34,197,94,.1)' } };
  const c = cfg[plan] || cfg.basic;
  return <span style={{ fontSize: 9, fontWeight: 700, color: c.color, background: c.bg, padding: '2px 6px', borderRadius: 99, border: `1px solid ${c.color}33`, letterSpacing: '.06em', textTransform: 'uppercase', flexShrink: 0 }}>{c.label}</span>;
}

/* ══════════════════════════════════════════════════════════
   SECTION TABS
══════════════════════════════════════════════════════════ */
const SECTIONS = [
  { id: 'chat',  label: 'Chat',  icon: IC.Chat  },
  { id: 'image', label: 'Image', icon: IC.Image  },
  { id: 'voice', label: 'Voice', icon: IC.Volume },
  { id: 'video', label: 'Video', icon: IC.Video  },
];

function SectionTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 10, padding: 3, border: '1px solid var(--border-light)' }}>
      {SECTIONS.map(s => {
        const isActive = s.id === active;
        const Icon = s.icon;
        return (
          <button key={s.id} onClick={() => onChange(s.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: isActive ? 700 : 500, background: isActive ? 'var(--bg-panel)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-muted)', boxShadow: isActive ? 'var(--shadow-sm)' : 'none', transition: 'all .18s', fontFamily: "'Outfit',sans-serif" }}>
            <Icon /> {s.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODEL SELECTOR MODAL (shared)
══════════════════════════════════════════════════════════ */
function ModelSelectorModal({ onClose, onSelect, activeModels, isMulti, providers, title, subtitle }) {
  const [search, setSearch] = useState('');
  const allModels = providers.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));

  const filtered = useMemo(() => {
    if (!search) return allModels;
    const q = search.toLowerCase();
    return allModels.filter(m => m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q) || m.providerName.toLowerCase().includes(q));
  }, [search, allModels]);

  const isActive = m => activeModels.some(a => a.id === m.id && a.providerId === m.providerId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(5px)' }}>
      <motion.div initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 18, width: '92%', maxWidth: 860, maxHeight: '84vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>

        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)', marginBottom: 4 }}>{title || 'Choose Model'}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle || (isMulti ? 'Select multiple to compare side by side' : 'Select one model')}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><IC.X /></button>
        </div>

        <div style={{ padding: '14px 24px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><IC.Search /></div>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models…"
              style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 13.5, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'} />
          </div>
        </div>

        <div className="omni-scroll" style={{ padding: '0 24px 24px', overflowY: 'auto', flex: 1 }}>
          {providers.filter(p => p.models.some(m => filtered.some(f => f.id === m.id && f.providerId === p.id))).map(provider => (
            <div key={provider.id} style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <BrandLogo slug={provider.slug} color={provider.color} size={14} />
                <span style={{ fontSize: 11, fontWeight: 700, color: provider.color, textTransform: 'uppercase', letterSpacing: '.07em' }}>{provider.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
                {filtered.filter(m => m.providerId === provider.id).map(model => {
                  const active = isActive(model);
                  return (
                    <motion.div key={model.id} whileHover={{ y: -2 }} whileTap={{ scale: .97 }}
                      onClick={() => onSelect(model, provider)}
                      style={{ padding: '12px 13px', borderRadius: 12, cursor: 'pointer', background: active ? `${provider.color}0f` : 'var(--bg-card)', border: `1px solid ${active ? provider.color : 'var(--border-light)'}`, position: 'relative', transition: 'all .15s' }}>
                      {active && <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IC.Check /></div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, paddingRight: active ? 22 : 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', flex: 1, lineHeight: 1.3 }}>{model.name}</span>
                        <PlanBadge plan={model.plan} />
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>{model.type}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {model.contextWindow && <span style={{ fontSize: 9.5, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 99, border: '1px solid var(--border-light)' }}>{model.contextWindow}</span>}
                        {model.speed && <span style={{ fontSize: 9.5, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 99, border: '1px solid var(--border-light)' }}>{model.speed}</span>}
                        {model.duration && <span style={{ fontSize: 9.5, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 99, border: '1px solid var(--border-light)' }}>{model.duration}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}>No models found for "{search}"</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   IMAGE SECTION
══════════════════════════════════════════════════════════ */
function ImageSection({ addToast }) {
  const [prompt, setPrompt]           = useState('');
  const [negPrompt, setNegPrompt]     = useState('');
  const [mode, setMode]               = useState('single'); // single | multi
  const [activeModels, setActiveModels] = useState([{ ...ALL_IMAGE_MODELS[0] }]);
  const [showModelSel, setShowModelSel] = useState(false);
  const [results, setResults]         = useState([]); // [{modelId, url, loading}]
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle]             = useState('photorealistic');
  const [ar, setAr]                   = useState('1:1');
  const [quality, setQuality]         = useState('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const STYLES = ['photorealistic', 'anime', 'oil painting', 'cinematic', 'illustration', 'watercolor', '3D render', 'sketch'];
  const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '3:4', '9:16'];
  const QUALITIES = ['standard', 'high', 'ultra'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const models = mode === 'multi' ? activeModels : [activeModels[0]];
    const newResults = models.map(m => ({ modelId: m.id, modelName: m.name, modelColor: m.color, url: null, loading: true, error: null }));
    setResults(newResults);

    models.forEach(async (model, idx) => {
      try {
        const fullPrompt = `${prompt}${style !== 'photorealistic' ? `, ${style} style` : ''}`;
        const response = await fetch('https://omni-ai-pro.onrender.com/api/image', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: fullPrompt, negativePrompt: negPrompt, modelId: model.id, providerId: model.providerId, aspectRatio: ar, quality })
        });
        const data = await response.json();
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, url: data.url || data.imageUrl || null, error: data.error || null } : r));
      } catch (err) {
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, error: err.message } : r));
      }
    });
    setIsGenerating(false);
  };

  const handleModelSelect = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (mode === 'multi') {
      if (activeModels.find(a => a.id === model.id)) {
        if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
        setActiveModels(p => p.filter(a => a.id !== model.id));
      } else {
        if (activeModels.length >= 4) { addToast('Max 4 models for comparison', 'error'); return; }
        setActiveModels(p => [...p, m]);
      }
    } else {
      setActiveModels([m]);
      setShowModelSel(false);
    }
  };

  const continueWithModel = (model) => { setActiveModels([model]); setMode('single'); addToast(`Continuing with ${model.name}`, 'success'); };

  const downloadImage = async (url, name) => {
    try {
      const a = document.createElement('a');
      a.href = url; a.download = `omni-${name}-${Date.now()}.png`; a.click();
    } catch (_) { addToast('Download failed', 'error'); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* ── Toolbar ── */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {/* Mode */}
        <div style={{ display: 'flex', background: 'var(--bg-hover)', borderRadius: 8, padding: 3, gap: 2, border: '1px solid var(--border-light)' }}>
          {['single', 'multi'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: mode === m ? 700 : 500, background: mode === m ? 'var(--bg-panel)' : 'transparent', color: mode === m ? 'var(--accent)' : 'var(--text-muted)', boxShadow: mode === m ? 'var(--shadow-sm)' : 'none', transition: 'all .15s', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
              {m === 'multi' ? <><IC.Layers /> Compare</> : <>Single</>}
            </button>
          ))}
        </div>

        {/* Active models */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {activeModels.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'var(--bg-hover)', border: `1px solid ${m.color}44`, fontSize: 12, color: m.color, fontWeight: 600 }}>
              <BrandLogo slug={m.slug} color={m.color} size={11} /> {m.name}
              {mode === 'multi' && activeModels.length > 1 && (
                <button onClick={() => setActiveModels(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 0, marginLeft: 2 }}><IC.X /></button>
              )}
            </div>
          ))}
          <button onClick={() => setShowModelSel(true)}
            style={{ padding: '4px 12px', borderRadius: 20, border: '1px dashed var(--border-med)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <IC.Plus /> {mode === 'multi' ? 'Add' : 'Switch'}
          </button>
        </div>

        {/* Style + AR chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
            {STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={ar} onChange={e => setAr(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
            {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Results area ── */}
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', background: 'var(--img-bg)' }}>
        {results.length === 0 ? (
          <ImageEmptyState onQuickPrompt={p => setPrompt(p)} />
        ) : (
          <div style={{ maxWidth: mode === 'multi' ? '100%' : 700, margin: '0 auto' }}>
            {mode === 'multi' ? (
              /* Compare grid */
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(results.length, 2)}, 1fr)`, gap: 16 }}>
                {results.map((r, i) => (
                  <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-med)', background: 'var(--bg-card)' }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.modelColor }}>{r.modelName}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.url && <button onClick={() => continueWithModel(activeModels[i])} style={{ padding: '3px 10px', fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Outfit',sans-serif" }}>Use <IC.ArrowR /></button>}
                        {r.url && <button onClick={() => downloadImage(r.url, r.modelName)} style={{ padding: '3px 7px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-muted)' }}><IC.Download /></button>}
                      </div>
                    </div>
                    <ImageResult result={r} ar={ar} />
                  </div>
                ))}
              </div>
            ) : (
              /* Single result */
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-med)' }}>
                <ImageResult result={results[0]} ar={ar} large />
                {results[0]?.url && (
                  <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => downloadImage(results[0].url, results[0].modelName)} style={{ padding: '7px 16px', background: 'var(--accent)', color: 'var(--bg-base)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}><IC.Download /> Download</button>
                    <button onClick={() => { setResults([]); setPrompt(''); }} style={{ padding: '7px 14px', background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>New</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Prompt input ── */}
      <div style={{ padding: '14px 20px 22px', background: 'var(--bg-base)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 14, overflow: 'hidden' }}>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe the image you want to create… (⌘+Enter to generate)"
              rows={2}
              style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, color: 'var(--text-main)', lineHeight: 1.6, resize: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setShowAdvanced(p => !p)} style={{ padding: '5px 11px', border: '1px solid var(--border-light)', borderRadius: 7, background: showAdvanced ? 'var(--accent-low)' : 'transparent', color: showAdvanced ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>⚙ Negative Prompt</button>
                <button onClick={() => { const quick = ['sunset over mountains', 'futuristic city', 'portrait of a woman', 'abstract art', 'forest waterfall']; setPrompt(quick[Math.floor(Math.random() * quick.length)]); }} style={{ padding: '5px 11px', border: '1px solid var(--border-light)', borderRadius: 7, background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>✦ Random</button>
              </div>
              <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
                style={{ padding: '8px 22px', background: prompt.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: prompt.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: prompt.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}>
                {isGenerating ? <><span className="spin"><IC.Wand /></span> Generating…</> : <><IC.Wand /> Generate{mode === 'multi' ? ` ×${activeModels.length}` : ''}</>}
              </button>
            </div>
            {showAdvanced && (
              <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border-light)' }}>
                <input value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="What to avoid (e.g. blurry, watermark, extra fingers)…"
                  style={{ width: '100%', padding: '9px 13px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)} onSelect={handleModelSelect} activeModels={activeModels} isMulti={mode === 'multi'} providers={IMAGE_PROVIDERS} title="Choose Image Model" subtitle={mode === 'multi' ? 'Select up to 4 models to compare' : 'Select image generation model'} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageResult({ result, ar, large }) {
  const aspectMap = { '1:1': '100%', '16:9': '56.25%', '4:3': '75%', '3:4': '133%', '9:16': '177.7%' };
  const paddingPct = aspectMap[ar] || '100%';
  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: large ? Math.min(parseFloat(paddingPct), 80) + '%' : '60%', background: 'var(--bg-hover)', overflow: 'hidden' }}>
      {result.loading ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, border: '2px solid var(--border-med)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="spin" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generating with {result.modelName}…</span>
        </div>
      ) : result.error ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, color: 'var(--red)' }}>✕</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '0 16px' }}>{result.error}</span>
        </div>
      ) : result.url ? (
        <img src={result.url} alt="Generated" className="img-appear"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>No image returned</span>
        </div>
      )}
    </div>
  );
}

function ImageEmptyState({ onQuickPrompt }) {
  const ideas = ['A cyberpunk street at night, neon lights reflecting on wet pavement', 'Majestic mountain peaks at golden hour, hyperrealistic', 'Watercolor portrait of a fox in the forest, soft light', 'Abstract geometric art, bold colors, minimalist design', 'Cinematic scene: astronaut walking on alien planet'];
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Create Stunning Images</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Describe what you want. Choose single generation or compare multiple AI models side by side.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.map((idea, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => onQuickPrompt(idea)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-sec)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                ✦ {idea}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VOICE SECTION
══════════════════════════════════════════════════════════ */
function VoiceSection({ addToast }) {
  const [tab, setTab]                 = useState('stt'); // stt | tts
  const [activeSTTModel, setSTTModel] = useState(ALL_AUDIO_MODELS.find(m => m.mode === 'stt'));
  const [activeTTSModel, setTTSModel] = useState(ALL_AUDIO_MODELS.find(m => m.mode === 'tts'));
  const [showModelSel, setShowModelSel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [ttsText, setTtsText]         = useState('');
  const [isPlaying, setIsPlaying]     = useState(false);
  const [audioFile, setAudioFile]     = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voice, setVoice]             = useState('alloy');
  const [speed, setSpeed]             = useState(1.0);
  const fileRef                       = useRef(null);
  const recognitionRef                = useRef(null);
  const audioRef                      = useRef(null);

  const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast('Speech recognition not supported in this browser', 'error'); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
    recognition.onresult = e => {
      let full = '';
      for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript;
      setTranscript(full);
    };
    recognition.onerror = () => { setIsListening(false); addToast('Mic error', 'error'); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const handleFileUpload = async (f) => {
    setAudioFile(f); setIsTranscribing(true);
    try {
      const formData = new FormData(); formData.append('file', f); formData.append('model', 'whisper-1');
      const res = await fetch('https://omni-ai-pro.onrender.com/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      setTranscript(data.text || 'Transcription complete.');
      addToast('Transcription done!', 'success');
    } catch (err) { addToast('Transcription failed: ' + err.message, 'error'); }
    setIsTranscribing(false);
  };

  const handleTTS = async () => {
    if (!ttsText.trim()) return;
    setIsPlaying(true);
    try {
      const res = await fetch('https://omni-ai-pro.onrender.com/api/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText, voice, speed, modelId: activeTTSModel?.id })
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
    } catch (err) { addToast('TTS failed: ' + err.message, 'error'); }
    setIsPlaying(false);
  };

  const copyTranscript = () => { navigator.clipboard.writeText(transcript); addToast('Copied!', 'success'); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />

      {/* Tab row */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 8, padding: 3, border: '1px solid var(--border-light)' }}>
          {[['stt', '🎙 Speech to Text'], ['tts', '🔊 Text to Speech']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: tab === id ? 700 : 500, background: tab === id ? 'var(--bg-panel)' : 'transparent', color: tab === id ? 'var(--accent)' : 'var(--text-muted)', boxShadow: tab === id ? 'var(--shadow-sm)' : 'none', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <ModelAvatar model={tab === 'stt' ? activeSTTModel : activeTTSModel} size={22} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{tab === 'stt' ? activeSTTModel?.name : activeTTSModel?.name}</span>
          <button onClick={() => setShowModelSel(true)} style={{ padding: '3px 9px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'Outfit',sans-serif" }}>Change</button>
        </div>
      </div>

      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '28px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {tab === 'stt' ? (
            /* ── STT ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Live mic card */}
              <div style={{ borderRadius: 16, border: '1px solid var(--border-med)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Live Microphone</span>
                  {isListening && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)', background: 'rgba(239,68,68,.1)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(239,68,68,.3)', animation: 'omni-pulse 1s ease infinite' }}>LIVE</span>}
                </div>
                <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  {/* Mic button */}
                  <motion.button onClick={isListening ? stopListening : startListening}
                    whileTap={{ scale: .93 }}
                    animate={isListening ? { boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 18px rgba(239,68,68,.15)', '0 0 0 0 rgba(239,68,68,0)'] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 80, height: 80, borderRadius: '50%', background: isListening ? 'rgba(239,68,68,.12)' : 'var(--bg-hover)', border: `2px solid ${isListening ? 'var(--red)' : 'var(--border-med)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                    <svg width="28" height="28" fill="none" stroke={isListening ? 'var(--red)' : 'var(--text-muted)'} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                  </motion.button>
                  {/* Waveform bars */}
                  {isListening && (
                    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} style={{ width: 3, background: 'var(--red)', borderRadius: 2, animation: `wave ${.4 + Math.random() * .4}s ease-in-out infinite`, animationDelay: `${i * .07}s`, height: 6 + Math.random() * 20, opacity: .7 }} />
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{isListening ? 'Tap to stop' : 'Tap to start recording'}</span>
                </div>
              </div>

              {/* File upload card */}
              <div style={{ borderRadius: 16, border: '1px solid var(--border-med)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Upload Audio File</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input ref={fileRef} type="file" accept="audio/*,.mp3,.mp4,.wav,.m4a,.ogg,.webm" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileUpload(e.target.files[0])} />
                  <div onClick={() => fileRef.current?.click()}
                    style={{ padding: '24px', border: '2px dashed var(--border-med)', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.background = 'transparent'; }}>
                    {isTranscribing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <span className="spin"><IC.Refresh /></span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Transcribing…</span>
                      </div>
                    ) : audioFile ? (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>📂 {audioFile.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(audioFile.size / 1024 / 1024).toFixed(1)} MB · Click to change</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🎙</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Drop audio file or click to browse</div>
                        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>MP3, MP4, WAV, M4A, OGG, WebM</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transcript */}
              {transcript && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Transcript</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={copyTranscript} style={{ padding: '4px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}><IC.Copy /> Copy</button>
                      <button onClick={() => setTranscript('')} style={{ padding: '4px 9px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)' }}><IC.X /></button>
                    </div>
                  </div>
                  <div style={{ padding: '16px', fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.7 }}>{transcript}</div>
                </motion.div>
              )}
            </div>
          ) : (
            /* ── TTS ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Voice + speed settings */}
              <div style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', padding: '16px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Voice Settings</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Voice</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {VOICES.map(v => (
                        <button key={v} onClick={() => setVoice(v)}
                          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${voice === v ? 'var(--accent)' : 'var(--border-light)'}`, background: voice === v ? 'var(--accent-low)' : 'transparent', color: voice === v ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .14s', fontWeight: voice === v ? 700 : 400 }}>
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Speed — {speed.toFixed(1)}x</div>
                    <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Text area */}
              <div style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', overflow: 'hidden' }}>
                <textarea value={ttsText} onChange={e => setTtsText(e.target.value)}
                  placeholder="Type or paste text to convert to speech…"
                  rows={6}
                  style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, color: 'var(--text-main)', lineHeight: 1.7, resize: 'none', fontFamily: "'Outfit',sans-serif' " }} />
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ttsText.length} chars · ~{Math.ceil(ttsText.length / 15)}s audio</span>
                  <button onClick={handleTTS} disabled={!ttsText.trim() || isPlaying}
                    style={{ padding: '8px 22px', background: ttsText.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: ttsText.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: ttsText.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}>
                    {isPlaying ? <><span className="spin"><IC.Volume /></span> Speaking…</> : <><IC.Play /> Speak</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)}
            onSelect={(model, provider) => {
              const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
              if (tab === 'stt') setSTTModel(m); else setTTSModel(m);
              setShowModelSel(false);
            }}
            activeModels={tab === 'stt' ? [activeSTTModel] : [activeTTSModel]}
            isMulti={false}
            providers={AUDIO_PROVIDERS.map(p => ({ ...p, models: p.models.filter(m => tab === 'stt' ? m.mode === 'stt' : m.mode === 'tts') })).filter(p => p.models.length > 0)}
            title={tab === 'stt' ? 'Choose Transcription Model' : 'Choose Voice Model'} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VIDEO SECTION
══════════════════════════════════════════════════════════ */
function VideoSection({ addToast }) {
  const [prompt, setPrompt]           = useState('');
  const [mode, setMode]               = useState('single');
  const [activeModels, setActiveModels] = useState([ALL_VIDEO_MODELS[0]]);
  const [showModelSel, setShowModelSel] = useState(false);
  const [results, setResults]         = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration]       = useState('5s');
  const [motion, setMotion]           = useState('medium');

  const DURATIONS = ['3s', '5s', '10s', '20s'];
  const MOTIONS = ['slow', 'medium', 'fast', 'cinematic'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const models = mode === 'multi' ? activeModels : [activeModels[0]];
    setResults(models.map(m => ({ modelId: m.id, modelName: m.name, modelColor: m.color, url: null, loading: true, error: null })));

    models.forEach(async (model, idx) => {
      try {
        const res = await fetch('https://omni-ai-pro.onrender.com/api/video', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, modelId: model.id, providerId: model.providerId, duration, motion })
        });
        const data = await res.json();
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, url: data.url || null, error: data.error || null } : r));
      } catch (err) {
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, error: err.message } : r));
      }
    });
    setIsGenerating(false);
  };

  const handleModelSelect = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (mode === 'multi') {
      if (activeModels.find(a => a.id === model.id)) {
        if (activeModels.length === 1) return;
        setActiveModels(p => p.filter(a => a.id !== model.id));
      } else setActiveModels(p => [...p, m]);
    } else { setActiveModels([m]); setShowModelSel(false); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 8, padding: 3, border: '1px solid var(--border-light)' }}>
          {['single', 'multi'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: mode === m ? 700 : 500, background: mode === m ? 'var(--bg-panel)' : 'transparent', color: mode === m ? 'var(--accent)' : 'var(--text-muted)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}>
              {m === 'multi' ? '⇌ Compare' : 'Single'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {activeModels.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'var(--bg-hover)', border: `1px solid ${m.color}44`, fontSize: 12, color: m.color, fontWeight: 600 }}>
              <BrandLogo slug={m.slug} color={m.color} size={11} /> {m.name}
              {mode === 'multi' && activeModels.length > 1 && <button onClick={() => setActiveModels(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 0 }}><IC.X /></button>}
            </div>
          ))}
          <button onClick={() => setShowModelSel(true)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px dashed var(--border-med)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><IC.Plus /> {mode === 'multi' ? 'Add' : 'Switch'}</button>
        </div>
        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={motion} onChange={e => setMotion(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
          {MOTIONS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)} motion</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', background: 'var(--img-bg)' }}>
        {results.length === 0 ? (
          <VideoEmptyState onQuickPrompt={setPrompt} />
        ) : (
          <div style={{ maxWidth: mode === 'multi' ? '100%' : 760, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mode === 'multi' && results.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }}>
              {results.map((r, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-med)', background: 'var(--bg-card)' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.modelColor }}>{r.modelName}</span>
                    {r.url && <a href={r.url} download style={{ padding: '3px 9px', background: 'var(--accent)', color: 'var(--bg-base)', border: 'none', borderRadius: 5, fontSize: 11, cursor: 'pointer', textDecoration: 'none', fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>⬇ Download</a>}
                  </div>
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: 'var(--bg-hover)' }}>
                    {r.loading ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                        <div style={{ width: 38, height: 38, border: '2px solid var(--border-med)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="spin" />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generating video… this may take a minute</span>
                      </div>
                    ) : r.error ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24, color: 'var(--red)' }}>✕</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>{r.error}</span>
                      </div>
                    ) : r.url ? (
                      <video src={r.url} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prompt input */}
      <div style={{ padding: '14px 20px 22px', background: 'var(--bg-base)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe the video scene… (e.g. A slow pan across a mountain lake at sunrise, cinematic, 4K)"
              rows={2}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6, resize: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
              style={{ padding: '10px 22px', background: prompt.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: prompt.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: prompt.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              {isGenerating ? <><span className="spin"><IC.Video /></span> Generating…</> : <><IC.Video /> Generate</>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)} onSelect={handleModelSelect} activeModels={activeModels} isMulti={mode === 'multi'} providers={VIDEO_PROVIDERS} title="Choose Video Model" subtitle="AI video generation models" />
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoEmptyState({ onQuickPrompt }) {
  const ideas = ['A slow pan across misty mountain peaks at sunrise', 'Underwater scene with colorful coral reef and tropical fish', 'Time-lapse of a city at night, neon lights, rain on the streets', 'A majestic eagle soaring over the Grand Canyon'];
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Hollywood-Style Video AI</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Generate cinematic videos from text. Compare Sora vs Kling side by side.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.map((idea, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}
                onClick={() => onQuickPrompt(idea)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-sec)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                ▷ {idea}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHAT MESSAGE BUBBLE
══════════════════════════════════════════════════════════ */
function MessageBubble({ msg, model, userProfile, onCopy, onDelete, onRegenerate, isCompact }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
      style={{ display: 'flex', gap: 12, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative', padding: '4px 0' }}>
      {isUser ? <UserAvatar profile={userProfile} size={29} /> : <ModelAvatar model={model} size={29} />}
      <div style={{ maxWidth: isCompact ? '88%' : '82%', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexDirection: isUser ? 'row-reverse' : 'row' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: isUser ? 'var(--text-muted)' : (model?.color || 'var(--text-main)') }}>{isUser ? 'You' : (model?.name || 'AI')}</span>
          <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>{formatTime(msg.timestamp)}</span>
        </div>
        <div style={{ background: isUser ? 'var(--bg-hover)' : 'transparent', border: isUser ? '1px solid var(--border-light)' : 'none', padding: isUser ? '10px 14px' : '2px 0', borderRadius: isUser ? '14px 4px 14px 14px' : 0, wordBreak: 'break-word' }}>
          {msg.isStreaming ? <TypingIndicator /> : <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />}
        </div>
        {!isUser && !msg.isStreaming && msg.content && (
          <span style={{ fontSize: 10.5, color: 'var(--text-faint)', paddingLeft: 2 }}>~{estimateTokens(msg.content).toLocaleString()} tokens</span>
        )}
      </div>
      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
            style={{ position: 'absolute', top: -10, [isUser ? 'left' : 'right']: 0, display: 'flex', gap: 2, background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 9, padding: '4px 5px', zIndex: 10, boxShadow: 'var(--shadow-sm)' }}>
            <ActionBtn onClick={() => { onCopy(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1500); }} title="Copy">{copied ? <IC.Check /> : <IC.Copy />}</ActionBtn>
            {!isUser && onRegenerate && <ActionBtn onClick={onRegenerate} title="Regenerate"><IC.Bolt /></ActionBtn>}
            <ActionBtn onClick={() => onDelete(msg.id)} title="Delete" danger><IC.Trash /></ActionBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionBtn({ children, onClick, title, danger }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: 5, background: h ? (danger ? 'rgba(239,68,68,.1)' : 'var(--bg-hover)') : 'none', border: 'none', borderRadius: 6, color: h && danger ? 'var(--red)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .12s', display: 'flex', alignItems: 'center' }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   CONV ITEM (sidebar)
══════════════════════════════════════════════════════════ */
function ConvItem({ conv, isActive, onSelect, onPin, onDelete, onRename, renamingId, renameValue, setRenameValue, onRenameSubmit }) {
  const [h, setH] = useState(false);
  const renaming = renamingId === conv.id;
  return (
    <motion.div whileHover={{ x: 2 }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onSelect}
      style={{ padding: '8px 10px', borderRadius: 9, background: isActive ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 7, marginBottom: 1, border: `1px solid ${isActive ? 'var(--border-light)' : 'transparent'}`, transition: 'all .14s' }}>
      {renaming ? (
        <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)} onBlur={onRenameSubmit}
          onKeyDown={e => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') setRenameValue(conv.title); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--accent)', borderRadius: 5, padding: '3px 7px', fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
            {conv.pinned && <span style={{ fontSize: 9, color: 'var(--accent)', flexShrink: 0 }}>📌</span>}
            <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{conv.title}</span>
          </div>
          {(h || isActive) && (
            <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
              <SBtn onClick={onPin} color={conv.pinned ? 'var(--accent)' : undefined}><IC.Pin /></SBtn>
              <SBtn onClick={onRename}><IC.Edit /></SBtn>
              <SBtn onClick={onDelete} danger><IC.Trash /></SBtn>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
function SBtn({ children, onClick, color, danger }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 23, height: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? 'var(--bg-base)' : 'none', border: 'none', borderRadius: 5, color: h && danger ? 'var(--red)' : (color || 'var(--text-muted)'), cursor: 'pointer', transition: 'all .12s' }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   ADVANCED INPUT (chat)
══════════════════════════════════════════════════════════ */
function AdvancedInput({ input, setInput, onSend, activeModels, isMultiChatMode, inputRef: extRef }) {
  const intRef = useRef(null);
  const inputEl = extRef || intRef;
  const fileRef = useRef(null);
  const slashRef = useRef(null);

  const [focused,       setFocused]       = useState(false);
  const [showSlash,     setShowSlash]     = useState(false);
  const [slashFilter,   setSlashFilter]   = useState('');
  const [slashIdx,      setSlashIdx]      = useState(0);
  const [attachments,   setAttachments]   = useState([]);
  const [isBoosting,    setIsBoosting]    = useState(false);
  const [boostDone,     setBoostDone]     = useState(false);
  const [sending,       setSending]       = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [histIdx,       setHistIdx]       = useState(-1);

  const tokens = estimateTokens(input);
  const overLimit = tokens > 3800;

  useEffect(() => {
    const el = inputEl.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [input, inputEl]);

  useEffect(() => {
    if (input.includes('\n')) { setShowSlash(false); return; }
    const last = input.split(' ').at(-1);
    if (last?.startsWith('/') && last.length >= 1) { setSlashFilter(last.slice(1).toLowerCase()); setShowSlash(true); setSlashIdx(0); }
    else setShowSlash(false);
  }, [input]);

  useEffect(() => {
    const h = e => { if (!slashRef.current?.contains(e.target)) setShowSlash(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredCmds = SLASH_COMMANDS.filter(c => c.cmd.slice(1).includes(slashFilter) || c.label.toLowerCase().includes(slashFilter));

  const applySlash = cmd => {
    setInput(input.replace(/\/\S*$/, '') + cmd.cmd.slice(1) + ': ');
    setShowSlash(false);
    setTimeout(() => inputEl.current?.focus(), 50);
  };

  const handleBoost = async () => {
    const t = input.trim(); if (!t || isBoosting) return;
    setIsBoosting(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: `Rewrite this prompt to be clearer and more effective. Return ONLY the improved prompt:\n\n${t}` }] })
      });
      const data = await res.json();
      const improved = data.content?.[0]?.text;
      if (improved) { setInput(improved); setBoostDone(true); setTimeout(() => setBoostDone(false), 2500); }
    } catch (_) {}
    setIsBoosting(false);
  };

  const handleDrop = e => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); };
  const addFiles = files => setAttachments(p => [...p, ...files.map(f => ({ id: genId(), name: f.name, size: f.size, type: f.type }))]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    setPromptHistory(p => [input, ...p.slice(0, 49)]);
    setHistIdx(-1); setSending(true);
    setTimeout(() => setSending(false), 600);
    onSend();
  };

  const handleKeyDown = e => {
    if (showSlash && filteredCmds.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx(p => Math.min(p + 1, filteredCmds.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx(p => Math.max(p - 1, 0)); return; }
      if (e.key === 'Tab' || (e.key === 'Enter' && showSlash)) { e.preventDefault(); applySlash(filteredCmds[slashIdx]); return; }
      if (e.key === 'Escape') { setShowSlash(false); return; }
    }
    if (e.key === 'ArrowUp' && !input && promptHistory.length) { e.preventDefault(); const i = Math.min(histIdx + 1, promptHistory.length - 1); setHistIdx(i); setInput(promptHistory[i]); return; }
    if (e.key === 'ArrowDown' && histIdx >= 0) { e.preventDefault(); const i = histIdx - 1; setHistIdx(i); setInput(i < 0 ? '' : promptHistory[i]); return; }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ padding: '12px 0 24px', background: 'var(--bg-base)', position: 'relative', flexShrink: 0 }} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {/* Template chips */}
      <AnimatePresence>
        {focused && !input && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto 10px', display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {PROMPT_TEMPLATES.map((t, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                onClick={() => { setInput(t.text); setTimeout(() => inputEl.current?.focus(), 50); }}
                style={{ flexShrink: 0, padding: '5px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 99, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', fontFamily: "'Outfit',sans-serif", transition: 'all .14s' }}
                whileHover={{ borderColor: 'var(--border-focus)', color: 'var(--text-main)' }}>
                {t.icon} {t.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto', position: 'relative' }}>
        {/* Slash dropdown */}
        <AnimatePresence>
          {showSlash && filteredCmds.length > 0 && (
            <motion.div ref={slashRef} initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
              style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 14, overflow: 'hidden', zIndex: 60, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ padding: '9px 14px 6px', fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Commands</div>
              {filteredCmds.map((c, i) => (
                <div key={i} onClick={() => applySlash(c)}
                  style={{ padding: '10px 14px', background: i === slashIdx ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                  onMouseEnter={() => setSlashIdx(i)}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', fontFamily: "'JetBrains Mono',monospace" }}>{c.cmd} <span style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 400, color: 'var(--text-muted)' }}>{c.label}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{ marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {attachments.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 11.5, color: 'var(--text-sec)' }}>
                <span>{a.type.startsWith('image') ? '🖼' : '📄'}</span>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                <button onClick={() => setAttachments(p => p.filter(x => x.id !== a.id))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <motion.div animate={{ borderColor: focused ? 'var(--border-focus)' : 'var(--border-med)', boxShadow: focused ? '0 0 0 1px rgba(255,255,255,0.04), var(--shadow-md)' : 'var(--shadow-sm)' }}
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: 16, overflow: 'visible' }}>

          {/* Multi-model tags */}
          {activeModels.length > 1 && (
            <div style={{ padding: '9px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginRight: 3 }}>Sending to:</span>
              {activeModels.map((m, i) => <span key={i} style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', color: m.color }}>{m.name}</span>)}
            </div>
          )}

          <textarea ref={inputEl} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder={isMultiChatMode ? `Ask ${activeModels.length} models at once… (/ for commands)` : `Message ${activeModels[0]?.name || 'AI'}… (/ commands · ↑ history)`}
            rows={1}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.65, padding: '13px 16px', resize: 'none', maxHeight: 220, minHeight: 52, caretColor: 'var(--accent)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px 10px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py" style={{ display: 'none' }} onChange={e => addFiles(Array.from(e.target.files))} />
              <InputTBtn title="Attach" onClick={() => fileRef.current?.click()}><IC.Paperclip /></InputTBtn>
              <InputTBtn title="Boost prompt with AI" onClick={handleBoost} disabled={!input.trim() || isBoosting} active={boostDone}>
                {isBoosting ? <span className="spin"><IC.Sparkle /></span> : boostDone ? <span style={{ color: 'var(--green)' }}>✓</span> : <IC.Sparkle />}
              </InputTBtn>
              {(isBoosting || boostDone) && (
                <span style={{ fontSize: 11, color: isBoosting ? 'var(--text-muted)' : 'var(--green)', animation: isBoosting ? 'omni-pulse 1.2s ease infinite' : 'none', fontWeight: 600 }}>
                  {isBoosting ? 'Boosting…' : 'Boosted!'}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {input.length > 0 && <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: overLimit ? 'var(--red)' : 'var(--text-faint)' }}>{tokens.toLocaleString()}</span>}
              <motion.button onClick={handleSend} disabled={!input.trim()} whileTap={{ scale: .9 }}
                style={{ padding: '7px 18px', borderRadius: 10, background: input.trim() ? 'var(--text-main)' : 'transparent', color: input.trim() ? 'var(--bg-base)' : 'var(--text-faint)', border: `1px solid ${input.trim() ? 'transparent' : 'var(--border-light)'}`, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}>
                {sending ? <span className="spin"><IC.Send /></span> : <IC.Send />}
                {isMultiChatMode && input.trim() && <span style={{ fontSize: 10, opacity: .7 }}>×{activeModels.length}</span>}
              </motion.button>
            </div>
          </div>
        </motion.div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10.5, color: 'var(--text-faint)' }}>
          OMNI AI PRO · Type <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '1px 5px', background: 'var(--bg-hover)', borderRadius: 3, border: '1px solid var(--border-light)' }}>/</code> for commands · Drag files to attach
        </div>
      </div>
    </div>
  );
}

function InputTBtn({ children, title, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(34,197,94,.1)' : h ? 'var(--bg-hover)' : 'none', border: active ? '1px solid rgba(34,197,94,.25)' : '1px solid transparent', borderRadius: 7, color: disabled ? 'var(--text-faint)' : h ? 'var(--text-main)' : 'var(--text-muted)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .14s' }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPTY STATE (chat)
══════════════════════════════════════════════════════════ */
function EmptyState({ activeModel, onTemplateSelect }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            {activeModel?.slug ? <BrandLogo slug={activeModel.slug} color={activeModel.color} size={28} /> : <img src="/logo.png" alt="O" style={{ width: 28 }} onError={e => e.target.style.display='none'} />}
          </div>
          <h2 style={{ fontSize: 21, fontWeight: 700, marginBottom: 7, color: 'var(--text-main)', letterSpacing: '-.02em' }}>How can I help you?</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 26, lineHeight: 1.6 }}>
            {activeModel ? `Chatting with ${activeModel.name} — ${activeModel.type}` : 'Start a conversation below.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PROMPT_TEMPLATES.slice(0, 4).map((t, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 + i * .06 }}
                whileHover={{ y: -2, borderColor: 'var(--border-focus)' }}
                onClick={() => onTemplateSelect(t.text)}
                style={{ padding: '12px 13px', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-light)', textAlign: 'left', fontFamily: "'Outfit',sans-serif", transition: 'all .14s' }}>
                <div style={{ fontSize: 17, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text.slice(0, 42)}…</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SEARCH PANE
══════════════════════════════════════════════════════════ */
function SearchPane({ conversations, chatHistories, onJump, onClose }) {
  const [q, setQ] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const out = [];
    conversations.forEach(conv => {
      Object.values(chatHistories[conv.id] || {}).forEach(msgs => {
        (msgs || []).forEach(msg => {
          if (msg.content?.toLowerCase().includes(q.toLowerCase()))
            out.push({ conv, msg });
        });
      });
    });
    return out.slice(0, 30);
  }, [q, conversations, chatHistories]);

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
      style={{ position: 'absolute', inset: 0, background: 'var(--bg-panel)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><IC.Search /></div>
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Search messages…"
            style={{ width: '100%', padding: '8px 10px 8px 30px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.X /></button>
      </div>
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {!q && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-faint)', fontSize: 12 }}>Type to search</div>}
        {q && results.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-faint)', fontSize: 12 }}>No results for "{q}"</div>}
        {results.map((r, i) => (
          <div key={i} onClick={() => onJump(r.conv.id)}
            style={{ padding: '10px', borderRadius: 8, cursor: 'pointer', marginBottom: 5, border: '1px solid var(--border-light)', transition: 'background .1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 3 }}>{r.conv.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.msg.role === 'user' ? '👤 ' : '🤖 '}{r.msg.content?.slice(0, 80)}…
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN CHAT PAGE
══════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const navigate = useNavigate();

  const [theme,         setTheme]         = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [currentUser,   setCurrentUser]   = useState(null);
  const [userProfile,   setUserProfile]   = useState({ name: 'Omni User', email: '', avatar: null });
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [isMultiMode,   setIsMultiMode]   = useState(false);
  const [input,         setInput]         = useState('');
  const [isLoading,     setIsLoading]     = useState(true);
  const [activeSection, setActiveSection] = useState('chat'); // chat | image | voice | video

  const [showModelSel,  setShowModelSel]  = useState(false);
  const [activeModels,  setActiveModels]  = useState([{ ...TEXT_PROVIDERS.find(p => p.id === 'meta').models[0], providerId: 'meta', slug: 'meta', color: '#0081fb' }]);

  const [conversations,  setConversations]  = useState([{ id: 'default', title: 'New Conversation', createdAt: Date.now(), pinned: false }]);
  const [activeConvId,   setActiveConvId]   = useState('default');
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameValue,    setRenameValue]    = useState('');
  const [chatHistories,  setChatHistories]  = useState({ default: {} });

  const [toasts,        setToasts]         = useState([]);
  const [showSearch,    setShowSearch]      = useState(false);

  const chatEndRefs = useRef({});
  const inputRef    = useRef(null);

  useEffect(() => { localStorage.setItem('omni-theme', theme); document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const addToast = useCallback((message, type = 'info') => {
    const id = genId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const m = session.user.user_metadata;
        setUserProfile({ name: m?.full_name || m?.name || 'Omni User', email: session.user.email, avatar: m?.avatar_url || m?.picture || null });
      } else navigate('/');
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) setCurrentUser(session.user); else navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { data, error } = await supabase.from('chats').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
      if (!error && data?.length > 0) {
        setConversations(data.map(c => ({ id: c.id, title: c.title, pinned: c.pinned, createdAt: c.created_at })));
        const h = {}; data.forEach(c => { h[c.id] = c.history || {}; });
        setChatHistories(h); setActiveConvId(data[0].id);
      }
    })();
  }, [currentUser]);

  const saveChatToDB = useCallback(async (convId, title, history, pinned) => {
    if (!currentUser) return;
    await supabase.from('chats').upsert({ id: convId, user_id: currentUser.id, title, history, pinned, updated_at: Date.now() });
  }, [currentUser]);

  useEffect(() => { Object.values(chatEndRefs.current).forEach(r => r?.scrollIntoView({ behavior: 'smooth' })); }, [chatHistories]);

  useEffect(() => {
    activeModels.forEach(model => {
      const key = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[key]) {
        setChatHistories(prev => ({ ...prev, [activeConvId]: { ...(prev[activeConvId] || {}), [key]: [{ id: genId(), role: 'assistant', content: `Hello! I'm **${model.name}** — ${model.type}. How can I help?`, model, timestamp: Date.now() }] } }));
      }
    });
  }, [activeModels, activeConvId]);

  useEffect(() => {
    const h = e => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') { e.preventDefault(); setShowSearch(p => !p); }
      if (mod && e.key === 'n') { e.preventDefault(); handleNewConv(); }
      if (mod && e.key === '\\') { e.preventDefault(); setSidebarOpen(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const getCurrentHistory = useCallback(key => chatHistories[activeConvId]?.[key] || [], [chatHistories, activeConvId]);
  const sortedConvs = useMemo(() => {
    const pin = conversations.filter(c => c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const unpin = conversations.filter(c => !c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    return [...pin, ...unpin];
  }, [conversations]);

  const handleNewConv = () => {
    const id = genId();
    setConversations(p => [{ id, title: 'New Conversation', createdAt: Date.now(), pinned: false }, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id); setIsMultiMode(false); setShowSearch(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDeleteConv = async (id) => {
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { const n = { ...p }; delete n[id]; return n; });
    if (currentUser) await supabase.from('chats').delete().eq('id', id);
    if (activeConvId === id) handleNewConv();
    addToast('Chat deleted');
  };

  const handlePinConv = id => setConversations(p => p.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  const handleRenameConv = (id, t) => { if (!t.trim()) return; setConversations(p => p.map(c => c.id === id ? { ...c, title: t.trim() } : c)); setRenamingId(null); };

  const handleModelSelect = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (isMultiMode) {
      if (activeModels.find(x => x.id === model.id && x.providerId === provider.id)) {
        if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
        setActiveModels(p => p.filter(x => !(x.id === model.id && x.providerId === provider.id)));
        addToast(`Removed ${model.name}`);
      } else { setActiveModels(p => [...p, m]); addToast(`Added ${model.name}`, 'success'); }
    } else { setActiveModels([m]); setShowModelSel(false); addToast(`Switched to ${model.name}`, 'success'); }
  };

  const removeModelFromChat = (modelId, providerId) => {
    if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  };

  const continueWithModel = model => { setActiveModels([model]); setIsMultiMode(false); addToast(`Continued with ${model.name}`, 'success'); };

  const handleSend = async () => {
    const text = input.trim(); if (!text) return;
    setInput('');
    const userMsg = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
    setChatHistories(prev => {
      const updated = { ...prev };
      activeModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...(updated[activeConvId]?.[key] || []), userMsg] };
      });
      return updated;
    });
    if (activeConv?.title === 'New Conversation')
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: text.slice(0, 36) + (text.length > 36 ? '…' : '') } : c));

    activeModels.forEach(async model => {
      const key = `${model.providerId}-${model.id}`;
      const streamId = genId();
      setChatHistories(prev => ({
        ...prev, [activeConvId]: { ...prev[activeConvId], [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] }
      }));
      try {
        const priorMsgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
        priorMsgs.push({ role: 'user', content: text });
        const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: priorMsgs, providerId: model.providerId, modelId: model.id })
        });
        if (!response.ok) throw new Error(`API Error ${response.status}`);
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let reply = '';
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          for (const chunk of decoder.decode(value).split('\n\n')) {
            if (chunk.startsWith('data: ')) {
              try {
                const d = JSON.parse(chunk.slice(6));
                if (d.type === 'chunk') { reply += d.text; setChatHistories(prev => { const msgs = [...(prev[activeConvId]?.[key] || [])]; const i = msgs.findIndex(m => m.id === streamId); if (i > -1) msgs[i] = { ...msgs[i], content: reply }; return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } }; }); }
              } catch (_) {}
            }
          }
        }
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])]; const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], isStreaming: false };
          const updated = { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
          saveChatToDB(activeConvId, activeConv?.title || 'Chat', updated[activeConvId], activeConv?.pinned || false);
          return updated;
        });
      } catch (err) {
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])]; const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], content: `❌ **Error:** ${err.message}`, isStreaming: false };
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
        addToast(`${model.name}: ${err.message}`, 'error');
      }
    });
  };

  const handleDeleteMsg = msgId => {
    setChatHistories(prev => { const conv = { ...prev[activeConvId] }; Object.keys(conv).forEach(k => { conv[k] = (conv[k] || []).filter(m => m.id !== msgId); }); return { ...prev, [activeConvId]: conv }; });
  };

  const handleRegenerate = async (model) => {
    const key = `${model.providerId}-${model.id}`;
    const history = chatHistories[activeConvId]?.[key] || [];
    const lastUser = [...history].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    setChatHistories(prev => {
      const msgs = [...(prev[activeConvId]?.[key] || [])];
      const lastAI = [...msgs].reverse().findIndex(m => m.role === 'assistant' && !m.isStreaming);
      if (lastAI !== -1) msgs.splice(msgs.length - 1 - lastAI, 1);
      return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
    });
    const streamId = genId();
    setChatHistories(prev => ({ ...prev, [activeConvId]: { ...prev[activeConvId], [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] } }));
    try {
      const msgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs, providerId: model.providerId, modelId: model.id }) });
      if (!response.ok) throw new Error(`API Error ${response.status}`);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let reply = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        for (const chunk of decoder.decode(value).split('\n\n')) {
          if (chunk.startsWith('data: ')) { try { const d = JSON.parse(chunk.slice(6)); if (d.type === 'chunk') { reply += d.text; setChatHistories(prev => { const m = [...(prev[activeConvId]?.[key] || [])]; const i = m.findIndex(x => x.id === streamId); if (i > -1) m[i] = { ...m[i], content: reply }; return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; }); } } catch (_) {} }
        }
      }
      setChatHistories(prev => { const m = [...(prev[activeConvId]?.[key] || [])]; const i = m.findIndex(x => x.id === streamId); if (i > -1) m[i] = { ...m[i], isStreaming: false }; return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; });
      addToast('Regenerated', 'success');
    } catch (err) { addToast('Regeneration failed', 'error'); }
  };

  if (isLoading) return (
    <div style={{ height: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ width: 34, height: 34, border: '2px solid #1a1a22', borderTopColor: '#e8a85f', borderRadius: '50%' }} className="spin" />
      <span style={{ fontSize: 13, color: '#555', fontFamily: "'Outfit',sans-serif" }}>Loading OMNI AI PRO…</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', overflow: 'hidden', fontFamily: "'Outfit',sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══ SIDEBAR ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: .2, ease: 'easeInOut' }}
            style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>

            {/* Logo */}
            <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/logo.png" alt="O" style={{ width: 18 }} onError={e => e.target.style.display = 'none'} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-.02em', color: 'var(--text-main)' }}>OMNI AI PRO</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 500 }}>68 Models · 4 Modes</div>
              </div>
            </div>

            {/* New chat + search */}
            <div style={{ padding: '0 10px 10px', display: 'flex', gap: 5, flexShrink: 0 }}>
              <button onClick={handleNewConv}
                style={{ flex: 1, padding: '8px 12px', background: 'var(--text-main)', color: 'var(--bg-base)', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Outfit',sans-serif", transition: 'opacity .14s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.82'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <IC.Plus /> New Chat
              </button>
              <button onClick={() => setShowSearch(p => !p)} title="Search (⌘K)"
                style={{ width: 35, height: 35, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: showSearch ? 'var(--accent)' : 'var(--text-muted)', transition: 'all .14s' }}>
                <IC.Search />
              </button>
            </div>

            {/* Conv list */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence>
                {showSearch && <SearchPane conversations={conversations} chatHistories={chatHistories} onJump={id => { setActiveConvId(id); setShowSearch(false); }} onClose={() => setShowSearch(false)} />}
              </AnimatePresence>
              <div className="omni-scroll" style={{ height: '100%', overflowY: 'auto', padding: '0 8px' }}>
                {sortedConvs.some(c => c.pinned) && <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 4px', letterSpacing: '.08em', textTransform: 'uppercase' }}>📌 Pinned</div>}
                {sortedConvs.filter(c => c.pinned).map(conv => (
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); }} onPin={() => handlePinConv(conv.id)} onDelete={() => handleDeleteConv(conv.id)} onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConv(conv.id, renameValue)} />
                ))}
                {sortedConvs.some(c => !c.pinned) && <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 4px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Recent</div>}
                {sortedConvs.filter(c => !c.pinned).map(conv => (
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); }} onPin={() => handlePinConv(conv.id)} onDelete={() => handleDeleteConv(conv.id)} onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConv(conv.id, renameValue)} />
                ))}
              </div>
            </div>

            {/* Active models strip */}
            {activeSection === 'chat' && (
              <div style={{ padding: '9px 12px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
                <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Active {activeModels.length > 1 ? `Models (${activeModels.length})` : 'Model'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {activeModels.slice(0, 3).map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px', borderRadius: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)' }}>
                      <BrandLogo slug={m.slug} color={m.color} size={12} />
                      <span style={{ fontSize: 11.5, color: m.color, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                      <PlanBadge plan={m.plan} />
                      {activeModels.length > 1 && <button onClick={() => removeModelFromChat(m.id, m.providerId)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 0, lineHeight: 1 }}><IC.X /></button>}
                    </div>
                  ))}
                  {activeModels.length > 3 && <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>+{activeModels.length - 3} more</div>}
                </div>
              </div>
            )}

            {/* User */}
            <div style={{ padding: '9px 12px 13px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <UserAvatar profile={userProfile} size={26} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} style={{ width: 27, height: 27, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
                </button>
                <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} title="Sign out" style={{ width: 27, height: 27, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⎋</button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══ MAIN ═══ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', flexShrink: 0, gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <button onClick={() => setSidebarOpen(p => !p)} title="Toggle sidebar (⌘\\)"
              style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <IC.Sidebar />
            </button>
            {activeSection === 'chat' && <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{activeConv?.title || 'New Conversation'}</span>}
          </div>

          {/* Section tabs — centre */}
          <SectionTabs active={activeSection} onChange={setActiveSection} />

          {/* Right controls — only for chat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            {activeSection === 'chat' && (
              <>
                <button onClick={() => setIsMultiMode(p => !p)}
                  style={{ padding: '5px 11px', borderRadius: 8, background: isMultiMode ? 'var(--accent-low)' : 'var(--bg-hover)', border: `1px solid ${isMultiMode ? 'rgba(232,168,95,.3)' : 'var(--border-light)'}`, fontSize: 12, cursor: 'pointer', color: isMultiMode ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}>
                  <IC.Layers />{isMultiMode ? `Multi (${activeModels.length})` : 'Multi-Model'}
                </button>
                <button onClick={() => setShowModelSel(true)}
                  style={{ padding: '5px 11px', borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', fontSize: 12, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500, fontFamily: "'Outfit',sans-serif", transition: 'all .14s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                  {activeModels.length === 1 && activeModels[0]?.slug && <BrandLogo slug={activeModels[0].slug} color={activeModels[0].color} size={12} />}
                  {activeModels.length === 1 ? activeModels[0]?.name : `${activeModels.length} Models`}
                  <IC.ChevronD />
                </button>
              </>
            )}
            <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
              style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
            </button>
          </div>
        </header>

        {/* Section content */}
        <AnimatePresence mode="wait">
          {activeSection === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Chat messages */}
              <div className="omni-scroll" style={{ flex: 1, display: 'flex', overflowX: isMultiMode ? 'auto' : 'hidden', overflowY: isMultiMode ? 'hidden' : 'auto', background: 'var(--bg-base)', minHeight: 0 }}>
                {isMultiMode ? (
                  <div style={{ display: 'flex', height: '100%', minWidth: 'max-content' }}>
                    {activeModels.map((model, idx) => {
                      const key = `${model.providerId}-${model.id}`;
                      const history = getCurrentHistory(key);
                      return (
                        <motion.div key={`${model.id}-${idx}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * .06 }}
                          style={{ width: 390, borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                          <div style={{ padding: '10px 14px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ModelAvatar model={model} size={24} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 12.5, color: model.color }}>{model.name}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{model.type}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button onClick={() => continueWithModel(model)} style={{ padding: '3px 9px', fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Outfit',sans-serif" }}>Continue <IC.ArrowR /></button>
                              <button onClick={() => removeModelFromChat(model.id, model.providerId)} style={{ width: 24, height: 24, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IC.X /></button>
                            </div>
                          </div>
                          <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {history.map(msg => <MessageBubble key={msg.id} msg={msg} model={model} userProfile={userProfile} onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }} onDelete={handleDeleteMsg} onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(model) : null} isCompact />)}
                            <div ref={el => chatEndRefs.current[key] = el} />
                          </div>
                        </motion.div>
                      );
                    })}
                    <div style={{ width: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 20 }}>
                      <button onClick={() => setShowModelSel(true)}
                        style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-hover)', border: '2px dashed var(--border-med)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, fontSize: 12, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        <span style={{ fontSize: 20 }}>＋</span>Add Model
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {(() => {
                      const key = `${activeModels[0]?.providerId}-${activeModels[0]?.id}`;
                      const history = getCurrentHistory(key);
                      if (!history.some(m => m.role === 'user'))
                        return <EmptyState activeModel={activeModels[0]} onTemplateSelect={t => { setInput(t); setTimeout(() => inputRef.current?.focus(), 100); }} />;
                      return (
                        <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '30px 20px 14px' }}>
                          <div style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {history.map(msg => <MessageBubble key={msg.id} msg={msg} model={activeModels[0]} userProfile={userProfile} onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }} onDelete={handleDeleteMsg} onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(activeModels[0]) : null} />)}
                            <div ref={el => chatEndRefs.current['single'] = el} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              {/* Chat input */}
              <div style={{ padding: '0 20px', background: 'var(--bg-base)', flexShrink: 0 }}>
                <AdvancedInput input={input} setInput={setInput} onSend={handleSend} activeModels={activeModels} isMultiChatMode={isMultiMode} inputRef={inputRef} />
              </div>
            </motion.div>
          )}

          {activeSection === 'image' && (
            <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <ImageSection addToast={addToast} />
            </motion.div>
          )}

          {activeSection === 'voice' && (
            <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <VoiceSection addToast={addToast} />
            </motion.div>
          )}

          {activeSection === 'video' && (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <VideoSection addToast={addToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Model selector (chat) */}
      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)} onSelect={handleModelSelect} activeModels={activeModels} isMulti={isMultiMode} providers={TEXT_PROVIDERS} title="Choose AI Model" subtitle={isMultiMode ? 'Select multiple models to compare side by side' : 'Select one model to chat with'} />
        )}
      </AnimatePresence>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}