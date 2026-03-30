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
   PROVIDERS & MODELS
══════════════════════════════════════════════════════════ */
const PROVIDERS = [
  {
    id: 'openai', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', type: 'Advanced Reasoning', category: 'thinking', premium: true, contextWindow: '128K', speed: 'Fast', badge: 'Popular' },
      { id: 'o3-mini', name: 'o3-mini', type: 'Fast Reasoning', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Very Fast', badge: 'New' },
    ]
  },
  {
    id: 'anthropic', name: 'Anthropic', slug: 'anthropic', color: '#e8a85f',
    models: [
      { id: 'claude-opus-4', name: 'Claude Opus 4', type: 'Deep Thinking', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Slow', badge: 'Best' },
      { id: 'claude-sonnet-3.5', name: 'Claude 3.5 Sonnet', type: 'Creative Writing', category: 'document', premium: false, contextWindow: '200K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'google', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'Latest & Fastest', category: 'thinking', premium: true, contextWindow: '1M', speed: 'Very Fast', badge: 'New' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: '2M Context Window', category: 'thinking', premium: true, contextWindow: '2M', speed: 'Medium', badge: null },
    ]
  },
  {
    id: 'deepseek', name: 'DeepSeek', slug: 'deepseek', color: '#4d6bfe',
    models: [
      { id: 'deepseek-r1', name: 'DeepSeek R1', type: 'Reasoning Model', category: 'thinking', premium: true, contextWindow: '64K', speed: 'Medium', badge: null },
      { id: 'deepseek-coder', name: 'DeepSeek Coder V2', type: 'Programming Pro', category: 'document', premium: false, contextWindow: '128K', speed: 'Fast', badge: null },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', type: 'General Purpose', category: 'thinking', premium: false, contextWindow: '64K', speed: 'Fast', badge: null },
    ]
  },
  {
    id: 'meta', name: 'Meta', slug: 'meta', color: '#0081fb',
    models: [
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', type: 'Open Source Leader', category: 'thinking', premium: false, contextWindow: '128K', speed: 'Fast', badge: 'Free' },
    ]
  }
];

const ALL_MODELS = PROVIDERS.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color })));

/* ══════════════════════════════════════════════════════════
   SLASH COMMANDS
══════════════════════════════════════════════════════════ */
const SLASH_COMMANDS = [
  { cmd: '/improve',   label: 'Improve Prompt',    desc: 'AI enhances your message before sending',  icon: '✨' },
  { cmd: '/summarize', label: 'Summarize',          desc: 'Ask AI to summarize a topic concisely',    icon: '📋' },
  { cmd: '/explain',   label: 'Explain Simply',     desc: 'Get a simple, clear explanation',          icon: '🎈' },
  { cmd: '/code',      label: 'Code Mode',          desc: 'Switch context to programming help',       icon: '💻' },
  { cmd: '/compare',   label: 'Compare Models',     desc: 'Force multi-model comparison mode',        icon: '⚖️' },
  { cmd: '/translate', label: 'Translate',          desc: 'Translate text to another language',       icon: '🌐' },
  { cmd: '/tweet',     label: 'Write a Tweet',      desc: 'Draft a compelling tweet',                 icon: '𝕏' },
  { cmd: '/email',     label: 'Draft Email',        desc: 'Write a professional email',               icon: '📧' },
  { cmd: '/proofread', label: 'Proofread',          desc: 'Check grammar and style',                  icon: '✍️' },
  { cmd: '/debug',     label: 'Debug Code',         desc: 'Analyze and fix code issues',              icon: '🐛' },
];

/* ══════════════════════════════════════════════════════════
   PROMPT TEMPLATES
══════════════════════════════════════════════════════════ */
const PROMPT_TEMPLATES = [
  { label: 'Debug Code',      text: 'Help me debug this code and explain what\'s wrong:\n\n```\n\n```',  icon: '🐛' },
  { label: 'Brainstorm',      text: 'Brainstorm 10 creative ideas for: ',                                icon: '💡' },
  { label: 'Pros & Cons',     text: 'Give a detailed pros and cons analysis of: ',                       icon: '⚖️' },
  { label: 'Write Post',      text: 'Write a compelling LinkedIn post about: ',                          icon: '✍️' },
  { label: 'Explain',         text: 'Explain the concept of [topic] step by step with examples: ',       icon: '🎓' },
  { label: 'Review',          text: 'Review the following and suggest improvements:\n\n',                icon: '🔍' },
  { label: 'Summarize',       text: 'Summarize the following in 5 key bullet points:\n\n',               icon: '📋' },
  { label: 'Email Draft',     text: 'Write a professional email about: ',                                icon: '📧' },
];

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const genId = () => Math.random().toString(36).slice(2, 9);
const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString();
};
const estimateTokens = (text) => Math.ceil((text || '').length / 4);

/* ══════════════════════════════════════════════════════════
   MARKDOWN PARSER
══════════════════════════════════════════════════════════ */
const parseMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block" data-lang="${lang || 'code'}">
        <div class="code-header">
          <span class="code-lang">${lang || 'code'}</span>
          <button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('pre').innerText).then(()=>{this.textContent='✓ Copied';setTimeout(()=>this.textContent='Copy',1500)})">Copy</button>
        </div>
        <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>`
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/^[\-\*] (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, s => `<ul class="md-ul">${s}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li">$1</li>')
    .split(/\n\n+/)
    .map(para => {
      if (para.startsWith('<')) return para;
      return `<p class="md-p">${para.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
};

/* ══════════════════════════════════════════════════════════
   BOOST PROMPT via Anthropic API
══════════════════════════════════════════════════════════ */
async function boostPrompt(text) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a prompt engineering expert. Rewrite the following user prompt to be clearer, more specific, and more likely to get a high-quality AI response. Keep the same intent but make it significantly better. Return ONLY the improved prompt, nothing else.\n\nOriginal: ${text}`
        }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || text;
  } catch (_) { return text; }
}

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const IC = {
  Menu:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h16"/></svg>,
  Plus:      () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Send:      () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  User:      () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  X:         () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Copy:      () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  Trash:     () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Pin:       () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v5M9 8h6M9 12h6M15 2H9a1 1 0 0 0-1 1v1.586a1 1 0 0 0 .293.707l1.414 1.414A1 1 0 0 1 10 7.5V8h4v-.5a1 1 0 0 1 .293-.707l1.414-1.414A1 1 0 0 0 16 4.586V3a1 1 0 0 0-1-1z"/></svg>,
  Edit:      () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Sun:       () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon:      () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ArrowR:    () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Search:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Sparkle:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Paperclip: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Mic:       () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  Settings:  () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bolt:      () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>,
  Globe:     () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Check:     () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Layers:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  ChevronD:  () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  Sidebar:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  Zap:       () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

/* ══════════════════════════════════════════════════════════
   GLOBAL STYLES STRING
══════════════════════════════════════════════════════════ */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root[data-theme="dark"] {
    --bg-base:    #080808;
    --bg-panel:   #0d0d0d;
    --bg-hover:   #141414;
    --bg-input:   #101010;
    --bg-modal:   #111111;
    --bg-card:    #0f0f0f;
    --text-main:  #f0f0f0;
    --text-sec:   #c8c8c8;
    --text-muted: #666;
    --text-faint: #333;
    --border-light: #1c1c1c;
    --border-med:   #252525;
    --border-focus: #3a3a3a;
    --accent:     #e8a85f;
    --accent-low: rgba(232,168,95,0.08);
    --accent2:    #7c6af5;
    --green:      #22c55e;
    --red:        #ef4444;
    --shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
    --shadow-md:  0 8px 32px rgba(0,0,0,0.5);
    --shadow-lg:  0 20px 60px rgba(0,0,0,0.6);
    --glow:       0 0 24px rgba(232,168,95,0.08);
  }

  :root[data-theme="light"] {
    --bg-base:    #fafafa;
    --bg-panel:   #ffffff;
    --bg-hover:   #f4f4f4;
    --bg-input:   #f9f9f9;
    --bg-modal:   #ffffff;
    --bg-card:    #f7f7f7;
    --text-main:  #111111;
    --text-sec:   #444444;
    --text-muted: #888888;
    --text-faint: #cccccc;
    --border-light: #ebebeb;
    --border-med:   #e0e0e0;
    --border-focus: #cccccc;
    --accent:     #d97706;
    --accent-low: rgba(217,119,6,0.06);
    --accent2:    #7c6af5;
    --green:      #16a34a;
    --red:        #dc2626;
    --shadow-sm:  0 2px 8px rgba(0,0,0,0.06);
    --shadow-md:  0 8px 32px rgba(0,0,0,0.1);
    --shadow-lg:  0 20px 60px rgba(0,0,0,0.12);
    --glow:       0 0 24px rgba(217,119,6,0.06);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body { height: 100%; overflow: hidden; }

  body {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 14px;
    background: var(--bg-base);
    color: var(--text-main);
  }

  /* Scrollbar */
  .omni-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
  .omni-scroll::-webkit-scrollbar-track { background: transparent; }
  .omni-scroll::-webkit-scrollbar-thumb { background: var(--border-med); border-radius: 10px; }
  .omni-scroll::-webkit-scrollbar-thumb:hover { background: var(--border-focus); }

  /* Markdown */
  .md-p { margin: 0 0 12px; line-height: 1.7; color: var(--text-sec); font-size: 14.5px; }
  .md-p:last-child { margin-bottom: 0; }
  .md-h1 { font-size: 20px; font-weight: 700; color: var(--text-main); margin: 20px 0 10px; }
  .md-h2 { font-size: 17px; font-weight: 700; color: var(--text-main); margin: 16px 0 8px; }
  .md-h3 { font-size: 15px; font-weight: 600; color: var(--text-main); margin: 14px 0 6px; }
  .md-quote { border-left: 3px solid var(--accent); padding: 8px 16px; color: var(--text-muted); font-style: italic; margin: 12px 0; }
  .md-ul { margin: 8px 0 12px 0; padding: 0; list-style: none; }
  .md-li { padding: 3px 0 3px 18px; position: relative; color: var(--text-sec); font-size: 14.5px; line-height: 1.6; }
  .md-li::before { content: '·'; position: absolute; left: 4px; color: var(--accent); font-size: 18px; line-height: 1.2; }
  .inline-code { background: var(--bg-hover); border: 1px solid var(--border-light); border-radius: 4px; padding: 1px 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--accent); }

  /* Code block */
  .code-block { background: var(--bg-modal); border: 1px solid var(--border-med); border-radius: 10px; margin: 16px 0; overflow: hidden; }
  .code-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; background: var(--bg-hover); border-bottom: 1px solid var(--border-light); }
  .code-lang { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; font-family: 'JetBrains Mono', monospace; }
  .code-block pre { margin: 0; padding: 16px; overflow-x: auto; font-size: 13px; line-height: 1.6; color: var(--text-sec); font-family: 'JetBrains Mono', monospace; }
  .code-block pre::-webkit-scrollbar { height: 4px; }
  .code-block pre::-webkit-scrollbar-thumb { background: var(--border-med); border-radius: 4px; }
  .code-copy-btn { background: none; border: 1px solid var(--border-light); border-radius: 5px; padding: 3px 8px; font-size: 11px; color: var(--text-muted); cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
  .code-copy-btn:hover { border-color: var(--border-focus); color: var(--text-main); }

  /* Animations */
  @keyframes omni-spin { to { transform: rotate(360deg); } }
  @keyframes omni-pulse { 0%,100%{opacity:1}50%{opacity:0.35} }
  @keyframes omni-shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }
  @keyframes omni-fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
  @keyframes omni-glow { 0%,100%{box-shadow:0 0 12px rgba(232,168,95,0)}50%{box-shadow:0 0 24px rgba(232,168,95,0.12)} }

  .spin { animation: omni-spin 0.8s linear infinite; }
  .pulse-text { animation: omni-pulse 1.2s ease infinite; }
  .fade-in { animation: omni-fadeIn 0.3s ease forwards; }

  /* Input range */
  input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--border-med); outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--text-main); cursor: pointer; }

  /* Selection */
  ::selection { background: var(--accent-low); color: var(--text-main); }
`;

/* ══════════════════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 8, pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.95 }}
            onClick={() => removeToast(t.id)}
            style={{
              padding: '10px 16px',
              background: 'var(--bg-panel)',
              border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,0.3)' : t.type === 'success' ? 'rgba(34,197,94,0.3)' : 'var(--border-med)'}`,
              borderRadius: 10,
              color: 'var(--text-main)',
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 9,
              pointerEvents: 'auto',
              fontFamily: "'Outfit', sans-serif",
              minWidth: 180
            }}
          >
            <span style={{ color: t.type === 'error' ? 'var(--red)' : t.type === 'success' ? 'var(--green)' : 'var(--accent)', fontSize: 16 }}>
              {t.type === 'error' ? '✕' : t.type === 'success' ? '✓' : 'ℹ'}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BRAND LOGO
══════════════════════════════════════════════════════════ */
function BrandLogo({ slug, color, size = 16 }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`}
      alt={slug} width={size} height={size}
      style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }}
      onError={e => { e.target.style.display = 'none'; }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   MODEL AVATAR
══════════════════════════════════════════════════════════ */
function ModelAvatar({ model, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'var(--bg-hover)',
      border: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, overflow: 'hidden'
    }}>
      {model?.slug
        ? <BrandLogo slug={model.slug} color={model.color || '#888'} size={size * 0.55} />
        : <img src="/logo.png" alt="AI" style={{ width: size * 0.6 }} />
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   USER AVATAR
══════════════════════════════════════════════════════════ */
function UserAvatar({ profile, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'var(--text-main)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, overflow: 'hidden',
      color: 'var(--bg-base)', fontWeight: 700, fontSize: size * 0.4
    }}>
      {profile?.avatar
        ? <img src={profile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : (profile?.name?.[0] || 'U')
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════════════════ */
function MessageBubble({ msg, model, userProfile, onCopy, onDelete, onRegenerate, isCompact }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        display: 'flex',
        gap: 12,
        flexDirection: isUser ? 'row-reverse' : 'row',
        position: 'relative',
        padding: isCompact ? '4px 0' : '6px 0'
      }}
    >
      {/* Avatar */}
      {isUser
        ? <UserAvatar profile={userProfile} size={30} />
        : <ModelAvatar model={model} size={30} />
      }

      {/* Content */}
      <div style={{ maxWidth: isCompact ? '88%' : '82%', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>

        {/* Name + time */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          flexDirection: isUser ? 'row-reverse' : 'row'
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isUser ? 'var(--text-muted)' : (model?.color || 'var(--text-main)') }}>
            {isUser ? 'You' : (model?.name || 'AI')}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            {formatTime(msg.timestamp)}
          </span>
        </div>

        {/* Bubble */}
        <div style={{
          background: isUser ? 'var(--bg-hover)' : 'transparent',
          border: isUser ? '1px solid var(--border-light)' : 'none',
          padding: isUser ? '10px 14px' : '2px 0',
          borderRadius: isUser ? '14px 4px 14px 14px' : 0,
          color: 'var(--text-sec)',
          fontSize: 14.5,
          lineHeight: 1.65,
          wordBreak: 'break-word'
        }}>
          {msg.isStreaming
            ? <TypingIndicator />
            : <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
          }
        </div>

        {/* Token info for AI messages */}
        {!isUser && !msg.isStreaming && msg.content && (
          <div style={{ fontSize: 11, color: 'var(--text-faint)', paddingLeft: 2 }}>
            ~{estimateTokens(msg.content).toLocaleString()} tokens
          </div>
        )}
      </div>

      {/* Action buttons on hover */}
      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute', top: -8,
              [isUser ? 'left' : 'right']: 0,
              display: 'flex', gap: 3,
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-med)',
              borderRadius: 9, padding: '4px 6px', zIndex: 10,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ActionBtn onClick={handleCopy} title="Copy">
              {copied ? <IC.Check /> : <IC.Copy />}
            </ActionBtn>
            {!isUser && onRegenerate && (
              <ActionBtn onClick={onRegenerate} title="Regenerate">
                <IC.Bolt />
              </ActionBtn>
            )}
            <ActionBtn onClick={() => onDelete(msg.id)} title="Delete" danger>
              <IC.Trash />
            </ActionBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ActionBtn({ children, onClick, title, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: 5, background: h ? (danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-hover)') : 'none',
        border: 'none', borderRadius: 6, color: h && danger ? 'var(--red)' : 'var(--text-muted)',
        cursor: 'pointer', transition: 'all 0.12s', display: 'flex', alignItems: 'center'
      }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   CONVERSATION ITEM (SIDEBAR)
══════════════════════════════════════════════════════════ */
function ConvItem({ conv, isActive, onSelect, onPin, onDelete, onRename, renamingId, renameValue, setRenameValue, onRenameSubmit }) {
  const [hover, setHover] = useState(false);
  const isRenaming = renamingId === conv.id;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{
        padding: '9px 10px', borderRadius: 9,
        background: isActive ? 'var(--bg-hover)' : 'transparent',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        marginBottom: 1,
        border: `1px solid ${isActive ? 'var(--border-light)' : 'transparent'}`,
        transition: 'all 0.15s'
      }}
    >
      {isRenaming ? (
        <input
          autoFocus value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={onRenameSubmit}
          onKeyDown={e => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') setRenameValue(conv.title); }}
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-focus)',
            borderRadius: 5, padding: '3px 7px', fontSize: 13, color: 'var(--text-main)',
            outline: 'none', fontFamily: "'Outfit', sans-serif"
          }}
        />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 7 }}>
            {conv.pinned && <span style={{ fontSize: 9, color: 'var(--accent)', flexShrink: 0 }}>📌</span>}
            <div style={{
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
            }}>{conv.title}</div>
          </div>
          {(hover || isActive) && (
            <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
              <SidebarBtn onClick={onPin} title="Pin" color={conv.pinned ? 'var(--accent)' : undefined}><IC.Pin /></SidebarBtn>
              <SidebarBtn onClick={onRename} title="Rename"><IC.Edit /></SidebarBtn>
              <SidebarBtn onClick={onDelete} title="Delete" danger><IC.Trash /></SidebarBtn>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function SidebarBtn({ children, onClick, title, color, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? 'var(--bg-base)' : 'none', border: 'none', borderRadius: 5,
        color: h && danger ? 'var(--red)' : (color || 'var(--text-muted)'),
        cursor: 'pointer', transition: 'all 0.12s'
      }}
    >{children}</button>
  );
}

/* ══════════════════════════════════════════════════════════
   ADVANCED INPUT COMPONENT
══════════════════════════════════════════════════════════ */
function AdvancedInput({ input, setInput, onSend, activeModels, isMultiChatMode, inputRef: externalRef }) {
  const internalRef = useRef(null);
  const inputEl = externalRef || internalRef;
  const fileInputRef = useRef(null);
  const slashRef = useRef(null);

  const [isFocused,      setIsFocused]      = useState(false);
  const [showSlash,      setShowSlash]      = useState(false);
  const [slashFilter,    setSlashFilter]    = useState('');
  const [slashIdx,       setSlashIdx]       = useState(0);
  const [attachments,    setAttachments]    = useState([]);
  const [isDragging,     setIsDragging]     = useState(false);
  const [isBoosting,     setIsBoosting]     = useState(false);
  const [boostDone,      setBoostDone]      = useState(false);
  const [promptHistory,  setPromptHistory]  = useState([]);
  const [historyIndex,   setHistoryIndex]   = useState(-1);
  const [sending,        setSending]        = useState(false);
  const [showShortcuts,  setShowShortcuts]  = useState(false);
  const [showTemplates,  setShowTemplates]  = useState(false);
  const [charAnim,       setCharAnim]       = useState(false);

  const tokens = estimateTokens(input);
  const isOverLimit = tokens > 3800;

  /* Auto-resize */
  useEffect(() => {
    const el = inputEl.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [input, inputEl]);

  /* Slash detection */
  useEffect(() => {
    if (input.includes('\n')) { setShowSlash(false); return; }
    const words = input.split(' ');
    const last = words[words.length - 1];
    if (last.startsWith('/') && last.length >= 1) {
      setSlashFilter(last.slice(1).toLowerCase());
      setShowSlash(true);
      setSlashIdx(0);
    } else {
      setShowSlash(false);
    }
  }, [input]);

  /* Close on outside click */
  useEffect(() => {
    const h = (e) => { if (!slashRef.current?.contains(e.target)) setShowSlash(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredCmds = SLASH_COMMANDS.filter(c =>
    c.cmd.slice(1).includes(slashFilter) || c.label.toLowerCase().includes(slashFilter)
  );

  const applySlashCmd = (cmd) => {
    if (cmd.cmd === '/improve') {
      const base = input.replace(/\/\S+\s?/, '').trim();
      setInput(base);
      setShowSlash(false);
      handleBoost(base);
      return;
    }
    setInput(input.replace(/\/\S+/, '') + cmd.cmd.slice(1) + ': ');
    setShowSlash(false);
    setTimeout(() => inputEl.current?.focus(), 50);
  };

  const handleBoost = async (text) => {
    const t = (text !== undefined ? text : input).trim();
    if (!t || isBoosting) return;
    setIsBoosting(true);
    setBoostDone(false);
    try {
      const improved = await boostPrompt(t);
      setInput(improved);
      setBoostDone(true);
      setCharAnim(true);
      setTimeout(() => setBoostDone(false), 2500);
      setTimeout(() => setCharAnim(false), 600);
    } catch (_) {}
    setIsBoosting(false);
  };

  /* File handling */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const addFiles = (files) => {
    const att = files.map(f => ({
      id: genId(), name: f.name,
      size: f.size, type: f.type, file: f
    }));
    setAttachments(p => [...p, ...att]);
  };

  const removeAttachment = (id) => setAttachments(p => p.filter(a => a.id !== id));

  /* Send */
  const handleSend = () => {
    if (!input.trim() || sending || isBoosting) return;
    setPromptHistory(p => [input, ...p.slice(0, 49)]);
    setHistoryIndex(-1);
    setSending(true);
    setTimeout(() => setSending(false), 600);
    onSend();
  };

  /* Keyboard */
  const handleKeyDown = (e) => {
    if (showSlash && filteredCmds.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx(p => Math.min(p + 1, filteredCmds.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx(p => Math.max(p - 1, 0)); return; }
      if (e.key === 'Tab' || e.key === 'Enter') {
        if (e.key === 'Enter' && !showSlash) { /* fall through */ }
        else { e.preventDefault(); applySlashCmd(filteredCmds[slashIdx]); return; }
      }
      if (e.key === 'Escape') { setShowSlash(false); return; }
    }
    if (e.key === 'ArrowUp' && !input && promptHistory.length) {
      e.preventDefault();
      const idx = Math.min(historyIndex + 1, promptHistory.length - 1);
      setHistoryIndex(idx);
      setInput(promptHistory[idx]);
      return;
    }
    if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setInput(idx < 0 ? '' : promptHistory[idx]);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = isMultiChatMode
    ? `Ask ${activeModels.length} AI models at once… (/ for commands)`
    : `Message ${activeModels[0]?.name || 'AI'}… (/ commands · ↑ history)`;

  return (
    <div
      style={{ padding: '14px 0 26px', background: 'var(--bg-base)', position: 'relative', flexShrink: 0 }}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Template Chips */}
      <AnimatePresence>
        {isFocused && !input && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              maxWidth: isMultiChatMode ? '96%' : 760,
              margin: '0 auto 12px',
              display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2,
              scrollbarWidth: 'none'
            }}
          >
            {PROMPT_TEMPLATES.map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setInput(t.text); setTimeout(() => inputEl.current?.focus(), 50); }}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 20, fontSize: 12.5,
                  color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  whiteSpace: 'nowrap',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s'
                }}
                whileHover={{ borderColor: 'var(--border-focus)', color: 'var(--text-main)' }}
              >
                <span style={{ fontSize: 13 }}>{t.icon}</span>{t.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto', position: 'relative' }}>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(232,168,95,0.04)',
                border: '2px dashed var(--accent)',
                borderRadius: 16, zIndex: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)', pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                📎 Drop files to attach
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slash Command Dropdown */}
        <AnimatePresence>
          {showSlash && filteredCmds.length > 0 && (
            <motion.div
              ref={slashRef}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.13 }}
              style={{
                position: 'absolute', bottom: 'calc(100% + 8px)',
                left: 0, right: 0,
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-med)',
                borderRadius: 14, overflow: 'hidden', zIndex: 60,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ padding: '10px 14px 6px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>
                Commands
              </div>
              {filteredCmds.map((c, i) => (
                <div
                  key={i}
                  onClick={() => applySlashCmd(c)}
                  style={{
                    padding: '10px 14px',
                    background: i === slashIdx ? 'var(--bg-hover)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={() => setSlashIdx(i)}
                >
                  <span style={{ fontSize: 17, width: 26, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: 8 }}>
                      {c.cmd}
                      <span style={{ fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 400, color: 'var(--text-muted)' }}>{c.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.desc}</div>
                  </div>
                  {i === slashIdx && <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'monospace' }}>↵</span>}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}
            >
              {attachments.map(att => (
                <div key={att.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text-sec)'
                }}>
                  <span>{att.type.startsWith('image') ? '🖼' : '📄'}</span>
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({(att.size / 1024).toFixed(0)}K)</span>
                  <button onClick={() => removeAttachment(att.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main input wrapper */}
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 1px rgba(255,255,255,0.06), var(--shadow-md)'
              : 'var(--shadow-sm)',
            borderColor: isFocused ? 'var(--border-focus)' : 'var(--border-med)'
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-med)',
            borderRadius: 16, overflow: 'visible',
            position: 'relative'
          }}
        >
          {/* Multi-model chips */}
          {activeModels.length > 1 && (
            <div style={{ padding: '10px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Broadcasting to:</span>
              {activeModels.map((m, i) => (
                <span key={i} style={{
                  padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                  color: m.color || 'var(--text-muted)'
                }}>{m.name}</span>
              ))}
            </div>
          )}

          {/* Textarea */}
          <div style={{ position: 'relative' }}>
            <textarea
              ref={inputEl}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              rows={1}
              style={{
                width: '100%', background: 'transparent',
                border: 'none', outline: 'none',
                fontSize: 14.5, fontFamily: "'Outfit', sans-serif",
                color: isOverLimit ? 'var(--red)' : 'var(--text-main)',
                lineHeight: 1.65,
                padding: '14px 16px',
                resize: 'none', maxHeight: 220, minHeight: 52,
                caretColor: 'var(--accent)',
                transition: 'color 0.2s'
              }}
            />
          </div>

          {/* Bottom toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 10px 10px',
            borderTop: '1px solid var(--border-light)'
          }}>
            {/* Left tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py" style={{ display: 'none' }} onChange={e => addFiles(Array.from(e.target.files))} />

              <InputToolBtn title="Attach file (or drag & drop)" onClick={() => fileInputRef.current?.click()}>
                <IC.Paperclip />
              </InputToolBtn>

              <InputToolBtn
                title={isBoosting ? 'Boosting…' : 'Boost prompt with AI ✨'}
                onClick={() => handleBoost()}
                disabled={!input.trim() || isBoosting}
                active={boostDone}
              >
                {isBoosting
                  ? <span style={{ display: 'inline-block', animation: 'omni-spin 0.7s linear infinite' }}><IC.Sparkle /></span>
                  : boostDone
                    ? <span style={{ color: 'var(--green)' }}>✓</span>
                    : <IC.Sparkle />
                }
              </InputToolBtn>

              <AnimatePresence>
                {isBoosting && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 11, color: 'var(--text-muted)', animation: 'omni-pulse 1.2s ease infinite' }}
                    className="pulse-text"
                  >
                    Enhancing prompt…
                  </motion.span>
                )}
                {boostDone && !isBoosting && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}
                  >
                    Prompt boosted!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Right tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Token counter */}
              {input.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    color: isOverLimit ? 'var(--red)' : 'var(--text-faint)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {tokens.toLocaleString()} tok
                </motion.div>
              )}

              {/* Shortcuts button */}
              <button
                onClick={() => setShowShortcuts(p => !p)}
                title="Keyboard shortcuts"
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-faint)', cursor: 'pointer',
                  fontSize: 11, padding: '3px 5px', borderRadius: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'color 0.15s'
                }}
              >⌘?</button>

              {/* Send button */}
              <motion.button
                onClick={handleSend}
                disabled={!input.trim()}
                whileTap={{ scale: 0.9 }}
                style={{
                  padding: '7px 16px',
                  borderRadius: 10,
                  background: input.trim() ? 'var(--text-main)' : 'transparent',
                  color: input.trim() ? 'var(--bg-base)' : 'var(--text-faint)',
                  border: `1px solid ${input.trim() ? 'transparent' : 'var(--border-light)'}`,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                {sending
                  ? <span style={{ display: 'inline-block', animation: 'omni-spin 0.7s linear infinite' }}><IC.Send /></span>
                  : <IC.Send />
                }
                {isMultiChatMode && input.trim() && (
                  <span style={{ fontSize: 10, opacity: 0.7 }}>×{activeModels.length}</span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Shortcuts popover */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              style={{
                position: 'absolute', bottom: 'calc(100% + 10px)', right: 0,
                background: 'var(--bg-panel)', border: '1px solid var(--border-med)',
                borderRadius: 12, padding: '14px 16px', zIndex: 50,
                minWidth: 250, boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shortcuts</div>
              {[
                ['Enter',        'Send message'],
                ['Shift+Enter',  'New line'],
                ['↑  (empty)',   'Recall last message'],
                ['/command',     'Slash commands'],
                ['Tab / ↵',      'Select slash command'],
                ['Drag & Drop',  'Attach files'],
              ].map(([k, d]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 7 }}>
                  <kbd style={{
                    fontSize: 11, padding: '2px 7px', borderRadius: 5,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: 'var(--bg-hover)', border: '1px solid var(--border-med)',
                    color: 'var(--text-main)', whiteSpace: 'nowrap'
                  }}>{k}</kbd>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-faint)' }}>
        OMNI AI PRO · Type <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '1px 5px', background: 'var(--bg-hover)', borderRadius: 3, border: '1px solid var(--border-light)' }}>/</code> for commands · Drag files to attach
      </div>
    </div>
  );
}

function InputToolBtn({ children, title, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 30, height: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(34,197,94,0.1)' : h ? 'var(--bg-hover)' : 'none',
        border: active ? '1px solid rgba(34,197,94,0.25)' : '1px solid transparent',
        borderRadius: 7,
        color: disabled ? 'var(--text-faint)' : h ? 'var(--text-main)' : 'var(--text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s'
      }}
    >{children}</button>
  );
}

/* ══════════════════════════════════════════════════════════
   MODEL SELECTOR MODAL
══════════════════════════════════════════════════════════ */
function ModelSelectorModal({ onClose, onSelect, activeModels, isMultiChatMode }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    return ALL_MODELS.filter(m => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.providerName.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === 'all' || (tab === 'free' && !m.premium) || (tab === 'thinking' && m.category === 'thinking') || (tab === 'fast' && (m.speed === 'Fast' || m.speed === 'Very Fast'));
      return matchSearch && matchTab;
    });
  }, [search, tab]);

  const isActive = (m) => activeModels.some(a => a.id === m.id && a.providerId === m.providerId);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-panel)', border: '1px solid var(--border-med)',
          borderRadius: 18, width: '90%', maxWidth: 820, maxHeight: '80vh',
          display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Choose AI Model</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {isMultiChatMode ? 'Select multiple models to compare responses side by side' : 'Select one model to chat with'}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <IC.X />
          </button>
        </div>

        {/* Search + Tabs */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><IC.Search /></div>
            <input
              autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search models…"
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                background: 'var(--bg-input)', border: '1px solid var(--border-light)',
                borderRadius: 10, fontSize: 14, color: 'var(--text-main)',
                outline: 'none', fontFamily: "'Outfit', sans-serif",
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all','All'], ['free','Free'], ['thinking','Thinking'], ['fast','Fast']].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                  background: tab === v ? 'var(--text-main)' : 'var(--bg-hover)',
                  color: tab === v ? 'var(--bg-base)' : 'var(--text-muted)',
                  border: '1px solid var(--border-light)', cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s'
                }}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="omni-scroll" style={{ padding: '0 24px 24px', overflowY: 'auto' }}>
          {PROVIDERS.filter(p => filtered.some(m => m.providerId === p.id)).map(provider => (
            <div key={provider.id} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <BrandLogo slug={provider.slug} color={provider.color} size={16} />
                <span style={{ fontSize: 12, fontWeight: 700, color: provider.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{provider.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {filtered.filter(m => m.providerId === provider.id).map(model => {
                  const active = isActive(model);
                  return (
                    <motion.div
                      key={model.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(model, provider)}
                      style={{
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                        background: active ? 'var(--accent-low)' : 'var(--bg-card)',
                        border: `1px solid ${active ? 'var(--accent)' : 'var(--border-light)'}`,
                        position: 'relative', transition: 'all 0.15s'
                      }}
                    >
                      {active && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IC.Check />
                        </div>
                      )}
                      {model.badge && (
                        <div style={{ position: 'absolute', top: 8, right: active ? 32 : 8, padding: '1px 7px', borderRadius: 20, fontSize: 9, fontWeight: 700, background: model.badge === 'Free' ? 'rgba(34,197,94,0.15)' : model.badge === 'New' ? 'rgba(124,106,245,0.15)' : 'rgba(232,168,95,0.12)', color: model.badge === 'Free' ? 'var(--green)' : model.badge === 'New' ? 'var(--accent2)' : 'var(--accent)', border: `1px solid currentColor`, letterSpacing: '0.06em' }}>{model.badge}</div>
                      )}
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-main)', marginBottom: 3 }}>{model.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{model.type}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <ModelTag>{model.contextWindow}</ModelTag>
                        <ModelTag>{model.speed}</ModelTag>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              No models found for "{search}"
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModelTag({ children }) {
  return (
    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', color: 'var(--text-muted)', fontWeight: 500 }}>{children}</span>
  );
}

/* ══════════════════════════════════════════════════════════
   SEARCH SIDEBAR (Chat History Search)
══════════════════════════════════════════════════════════ */
function SearchPane({ conversations, chatHistories, onJump, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const out = [];
    conversations.forEach(conv => {
      const history = chatHistories[conv.id] || {};
      Object.values(history).forEach(msgs => {
        (msgs || []).forEach(msg => {
          if (msg.content?.toLowerCase().includes(q.toLowerCase())) {
            out.push({ conv, msg });
          }
        });
      });
    });
    return out.slice(0, 30);
  }, [q, conversations, chatHistories]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
      style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%',
        background: 'var(--bg-panel)', zIndex: 10, display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><IC.Search /></div>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search messages…"
            style={{ width: '100%', padding: '8px 10px 8px 32px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit', sans-serif" }} />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.X /></button>
      </div>
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {!q && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-faint)', fontSize: 12 }}>Type to search your chat history</div>}
        {q && results.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-faint)', fontSize: 12 }}>No results for "{q}"</div>}
        {results.map((r, i) => (
          <div key={i} onClick={() => onJump(r.conv.id)}
            style={{ padding: '10px', borderRadius: 8, cursor: 'pointer', marginBottom: 6, border: '1px solid var(--border-light)', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 3 }}>{r.conv.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.msg.role === 'user' ? '👤 ' : '🤖 '}
              {r.msg.content?.slice(0, 80)}…
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════════ */
function EmptyState({ onTemplateSelect, activeModel }) {
  const capabilities = [
    { icon: '💻', label: 'Code & Debug' },
    { icon: '✍️', label: 'Write & Edit' },
    { icon: '🔍', label: 'Research' },
    { icon: '📊', label: 'Analyze Data' },
    { icon: '🌐', label: 'Translate' },
    { icon: '🎯', label: 'Brainstorm' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {activeModel?.slug
              ? <BrandLogo slug={activeModel.slug} color={activeModel.color} size={28} />
              : <img src="/logo.png" alt="OMNI" style={{ width: 28 }} />
            }
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
            How can I help you?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
            {activeModel ? `You're chatting with ${activeModel.name}. ${activeModel.type}.` : 'Start a conversation below.'}
          </p>

          {/* Capabilities */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
            {capabilities.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ padding: '7px 14px', borderRadius: 20, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{c.icon}</span>{c.label}
              </motion.div>
            ))}
          </div>

          {/* Quick templates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PROMPT_TEMPLATES.slice(0, 4).map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                whileHover={{ y: -2, borderColor: 'var(--border-focus)' }}
                onClick={() => onTemplateSelect(t.text)}
                style={{
                  padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                  textAlign: 'left', fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text.slice(0, 40)}…</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN CHAT PAGE
══════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const navigate = useNavigate();

  /* ── Core State ── */
  const [theme,          setTheme]          = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [currentUser,    setCurrentUser]    = useState(null);
  const [userProfile,    setUserProfile]    = useState({ name: 'Omni User', email: '', avatar: null });
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [isMultiMode,    setIsMultiMode]    = useState(false);
  const [input,          setInput]          = useState('');
  const [isLoading,      setIsLoading]      = useState(true);

  /* ── Model State ── */
  const [showModelSel,   setShowModelSel]   = useState(false);
  const [activeModels,   setActiveModels]   = useState([{
    ...PROVIDERS.find(p => p.id === 'meta').models[0],
    providerId: 'meta', slug: 'meta', color: '#0081fb'
  }]);

  /* ── Conversations ── */
  const [conversations,  setConversations]  = useState([{ id: 'default', title: 'New Conversation', createdAt: Date.now(), pinned: false }]);
  const [activeConvId,   setActiveConvId]   = useState('default');
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameValue,    setRenameValue]    = useState('');
  const [chatHistories,  setChatHistories]  = useState({ default: {} });

  /* ── UI State ── */
  const [toasts,         setToasts]         = useState([]);
  const [showSearch,     setShowSearch]     = useState(false);
  const [showSettings,   setShowSettings]   = useState(false);
  const [sidebarWidth,   setSidebarWidth]   = useState(260);

  const chatEndRefs = useRef({});
  const inputRef    = useRef(null);

  /* ── Theme ── */
  useEffect(() => {
    localStorage.setItem('omni-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Toast ── */
  const addToast = useCallback((message, type = 'info') => {
    const id = genId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const m = session.user.user_metadata;
        setUserProfile({ name: m?.full_name || m?.name || 'Omni User', email: session.user.email, avatar: m?.avatar_url || m?.picture || null });
      } else {
        navigate('/');
      }
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) setCurrentUser(session.user);
      else navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  /* ── Load chats ── */
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { data, error } = await supabase.from('chats').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
      if (!error && data?.length > 0) {
        setConversations(data.map(c => ({ id: c.id, title: c.title, pinned: c.pinned, createdAt: c.created_at, updatedAt: c.updated_at })));
        const h = {};
        data.forEach(c => { h[c.id] = c.history || {}; });
        setChatHistories(h);
        setActiveConvId(data[0].id);
      }
    })();
  }, [currentUser]);

  /* ── Save to DB ── */
  const saveChatToDB = useCallback(async (convId, title, history, pinned) => {
    if (!currentUser) return;
    await supabase.from('chats').upsert({ id: convId, user_id: currentUser.id, title, history, pinned, updated_at: Date.now() });
  }, [currentUser]);

  /* ── Scroll to bottom ── */
  useEffect(() => {
    Object.values(chatEndRefs.current).forEach(ref => ref?.scrollIntoView({ behavior: 'smooth' }));
  }, [chatHistories]);

  /* ── Init model messages ── */
  useEffect(() => {
    activeModels.forEach(model => {
      const key = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[key]) {
        setChatHistories(prev => ({
          ...prev,
          [activeConvId]: {
            ...(prev[activeConvId] || {}),
            [key]: [{
              id: genId(), role: 'assistant',
              content: `Hello! I'm **${model.name}** (${model.type}). How can I help you today?`,
              model, timestamp: Date.now()
            }]
          }
        }));
      }
    });
  }, [activeModels, activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const getCurrentHistory = useCallback(key => chatHistories[activeConvId]?.[key] || [], [chatHistories, activeConvId]);

  /* ── Sorted convs ── */
  const sortedConvs = useMemo(() => {
    const pinned = conversations.filter(c => c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const unpinned = conversations.filter(c => !c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    return [...pinned, ...unpinned];
  }, [conversations]);

  /* ══ SIDEBAR ACTIONS ══ */
  const handleNewConv = () => {
    const id = genId();
    setConversations(p => [{ id, title: 'New Conversation', createdAt: Date.now(), pinned: false }, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id);
    setIsMultiMode(false);
    setShowSearch(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDeleteConv = async (id) => {
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { const n = { ...p }; delete n[id]; return n; });
    if (currentUser) await supabase.from('chats').delete().eq('id', id);
    if (activeConvId === id) handleNewConv();
    addToast('Chat deleted', 'info');
  };

  const handlePinConv = (id) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const handleRenameConv = (id, newTitle) => {
    if (!newTitle.trim()) return;
    setConversations(p => p.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c));
    setRenamingId(null);
  };

  /* ══ MODEL ACTIONS ══ */
  const handleModelSelect = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (isMultiMode) {
      if (activeModels.find(x => x.id === model.id && x.providerId === provider.id)) {
        if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
        setActiveModels(p => p.filter(x => !(x.id === model.id && x.providerId === provider.id)));
        addToast(`Removed ${model.name}`, 'info');
      } else {
        setActiveModels(p => [...p, m]);
        addToast(`Added ${model.name}`, 'success');
      }
    } else {
      setActiveModels([m]);
      setShowModelSel(false);
      addToast(`Switched to ${model.name}`, 'success');
    }
  };

  const removeModelFromChat = (modelId, providerId) => {
    if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  };

  const continueWithModel = (model) => {
    setActiveModels([model]);
    setIsMultiMode(false);
    addToast(`Continued with ${model.name}`, 'success');
  };

  /* ══ SEND ══ */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const userMsg = { id: genId(), role: 'user', content: text, timestamp: Date.now() };

    /* Add user message to all active models */
    setChatHistories(prev => {
      const updated = { ...prev };
      activeModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        updated[activeConvId] = {
          ...(updated[activeConvId] || {}),
          [key]: [...(updated[activeConvId]?.[key] || []), userMsg]
        };
      });
      return updated;
    });

    /* Auto-title */
    if (activeConv?.title === 'New Conversation') {
      const newTitle = text.slice(0, 36) + (text.length > 36 ? '…' : '');
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: newTitle } : c));
    }

    /* Stream each model */
    activeModels.forEach(async (model) => {
      const key = `${model.providerId}-${model.id}`;
      const streamId = genId();

      setChatHistories(prev => ({
        ...prev,
        [activeConvId]: {
          ...prev[activeConvId],
          [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }]
        }
      }));

      try {
        const historyForModel = chatHistories[activeConvId]?.[key] || [];
        const msgs = historyForModel.filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
        msgs.push({ role: 'user', content: text });

        const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: msgs, providerId: model.providerId, modelId: model.id })
        });

        if (!response.ok) throw new Error(`API Error ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let reply = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunks = decoder.decode(value).split('\n\n');
          for (const chunk of chunks) {
            if (chunk.startsWith('data: ')) {
              try {
                const data = JSON.parse(chunk.slice(6));
                if (data.type === 'chunk') {
                  reply += data.text;
                  setChatHistories(prev => {
                    const msgs = [...(prev[activeConvId]?.[key] || [])];
                    const idx = msgs.findIndex(m => m.id === streamId);
                    if (idx > -1) msgs[idx] = { ...msgs[idx], content: reply };
                    return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
                  });
                }
              } catch (_) {}
            }
          }
        }

        /* Finalize */
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const idx = msgs.findIndex(m => m.id === streamId);
          if (idx > -1) msgs[idx] = { ...msgs[idx], isStreaming: false };
          const updated = { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
          saveChatToDB(activeConvId, activeConv?.title || 'Chat', updated[activeConvId], activeConv?.pinned || false);
          return updated;
        });

      } catch (err) {
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const idx = msgs.findIndex(m => m.id === streamId);
          if (idx > -1) msgs[idx] = { ...msgs[idx], content: `❌ **Error:** ${err.message}\n\nPlease try again or switch to a different model.`, isStreaming: false };
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
        addToast(`${model.name} failed: ${err.message}`, 'error');
      }
    });
  };

  const handleDeleteMsg = (msgId) => {
    setChatHistories(prev => {
      const conv = { ...prev[activeConvId] };
      Object.keys(conv).forEach(k => { conv[k] = (conv[k] || []).filter(m => m.id !== msgId); });
      return { ...prev, [activeConvId]: conv };
    });
  };

  const handleRegenerate = async (model) => {
    const key = `${model.providerId}-${model.id}`;
    const history = chatHistories[activeConvId]?.[key] || [];
    const lastUser = [...history].reverse().find(m => m.role === 'user');
    if (!lastUser) return;

    // Remove last AI message
    setChatHistories(prev => {
      const msgs = [...(prev[activeConvId]?.[key] || [])];
      const lastAI = [...msgs].reverse().findIndex(m => m.role === 'assistant' && !m.isStreaming);
      if (lastAI !== -1) msgs.splice(msgs.length - 1 - lastAI, 1);
      return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
    });

    // Re-stream (reuse handleSend logic with stored text)
    // Simplified: we trigger from the last user message
    const streamId = genId();
    setChatHistories(prev => ({
      ...prev,
      [activeConvId]: {
        ...prev[activeConvId],
        [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }]
      }
    }));

    try {
      const msgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, providerId: model.providerId, modelId: model.id })
      });
      if (!response.ok) throw new Error(`API Error ${response.status}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunks = decoder.decode(value).split('\n\n');
        for (const chunk of chunks) {
          if (chunk.startsWith('data: ')) {
            try {
              const data = JSON.parse(chunk.slice(6));
              if (data.type === 'chunk') {
                reply += data.text;
                setChatHistories(prev => {
                  const m = [...(prev[activeConvId]?.[key] || [])];
                  const i = m.findIndex(x => x.id === streamId);
                  if (i > -1) m[i] = { ...m[i], content: reply };
                  return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } };
                });
              }
            } catch (_) {}
          }
        }
      }
      setChatHistories(prev => {
        const m = [...(prev[activeConvId]?.[key] || [])];
        const i = m.findIndex(x => x.id === streamId);
        if (i > -1) m[i] = { ...m[i], isStreaming: false };
        return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } };
      });
    } catch (err) {
      addToast('Regeneration failed', 'error');
    }
    addToast('Regenerated response', 'success');
  };

  /* ══ SIGN OUT ══ */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  /* ══ KEYBOARD SHORTCUTS ══ */
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(p => !p); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); handleNewConv(); }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); setSidebarOpen(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ══ LOADING ══ */
  if (isLoading) {
    return (
      <div style={{ height: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <style>{GLOBAL_STYLES}</style>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 32, height: 32, border: '2px solid #1c1c1c', borderTopColor: '#e8a85f', borderRadius: '50%' }} />
        <span style={{ fontSize: 13, color: '#666', fontFamily: "'Outfit', sans-serif" }}>Loading OMNI AI PRO…</span>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: sidebarWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{
              borderRight: '1px solid var(--border-light)',
              background: 'var(--bg-panel)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', flexShrink: 0,
              position: 'relative'
            }}
          >
            {/* Logo */}
            <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/logo.png" alt="OMNI" style={{ width: 18 }} onError={e => e.target.style.display = 'none'} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OMNI AI PRO</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 500 }}>Multi-Model Intelligence</div>
              </div>
            </div>

            {/* New Chat + Search */}
            <div style={{ padding: '0 12px 12px', display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={handleNewConv}
                style={{
                  flex: 1, padding: '9px 12px',
                  background: 'var(--text-main)', color: 'var(--bg-base)',
                  borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7,
                  fontFamily: "'Outfit', sans-serif", transition: 'opacity 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <IC.Plus /> New Chat
              </button>
              <button
                onClick={() => setShowSearch(p => !p)}
                title="Search chats (⌘K)"
                style={{
                  width: 36, height: 36, background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                  borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: showSearch ? 'var(--text-main)' : 'var(--text-muted)', transition: 'all 0.15s'
                }}
              >
                <IC.Search />
              </button>
            </div>

            {/* Search pane or conversation list */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence>
                {showSearch && (
                  <SearchPane
                    conversations={conversations}
                    chatHistories={chatHistories}
                    onJump={(id) => { setActiveConvId(id); setShowSearch(false); }}
                    onClose={() => setShowSearch(false)}
                  />
                )}
              </AnimatePresence>

              <div className="omni-scroll" style={{ height: '100%', overflowY: 'auto', padding: '0 10px' }}>
                {/* Pinned section */}
                {sortedConvs.some(c => c.pinned) && (
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 5px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    📌 Pinned
                  </div>
                )}
                {sortedConvs.filter(c => c.pinned).map(conv => (
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id}
                    onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); }}
                    onPin={() => handlePinConv(conv.id)}
                    onDelete={() => handleDeleteConv(conv.id)}
                    onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }}
                    renamingId={renamingId} renameValue={renameValue}
                    setRenameValue={setRenameValue}
                    onRenameSubmit={() => handleRenameConv(conv.id, renameValue)}
                  />
                ))}
                {/* Recent section */}
                {sortedConvs.some(c => c.pinned) && sortedConvs.some(c => !c.pinned) && (
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 700, padding: '10px 4px 5px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Recent
                  </div>
                )}
                {sortedConvs.filter(c => !c.pinned).map(conv => (
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id}
                    onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); }}
                    onPin={() => handlePinConv(conv.id)}
                    onDelete={() => handleDeleteConv(conv.id)}
                    onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }}
                    renamingId={renamingId} renameValue={renameValue}
                    setRenameValue={setRenameValue}
                    onRenameSubmit={() => handleRenameConv(conv.id, renameValue)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom: Active model(s) display */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
                Active {activeModels.length > 1 ? `Models (${activeModels.length})` : 'Model'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {activeModels.slice(0, 3).map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)' }}>
                    <BrandLogo slug={m.slug} color={m.color} size={13} />
                    <span style={{ fontSize: 12, color: m.color, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    {activeModels.length > 1 && (
                      <button onClick={() => removeModelFromChat(m.id, m.providerId)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                        <IC.X />
                      </button>
                    )}
                  </div>
                ))}
                {activeModels.length > 3 && (
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>+{activeModels.length - 3} more</div>
                )}
              </div>
            </div>

            {/* User profile */}
            <div style={{ padding: '10px 12px 14px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <UserAvatar profile={userProfile} size={28} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
                </button>
                <button onClick={handleSignOut} title="Sign out" style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  ⎋
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <header style={{
          height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-panel)', flexShrink: 0
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              title="Toggle sidebar (⌘\\)"
              style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <IC.Sidebar />
            </button>

            {/* Breadcrumb */}
            {!sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>OMNI</span>
                <span style={{ color: 'var(--border-med)' }}>/</span>
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
              {activeConv?.title || 'New Conversation'}
            </span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Multi-model toggle */}
            <button
              onClick={() => setIsMultiMode(p => !p)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                background: isMultiMode ? 'var(--accent-low)' : 'var(--bg-hover)',
                border: `1px solid ${isMultiMode ? 'rgba(232,168,95,0.3)' : 'var(--border-light)'}`,
                fontSize: 12.5, cursor: 'pointer',
                color: isMultiMode ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s'
              }}
            >
              <IC.Layers />
              {isMultiMode ? `Multi (${activeModels.length})` : 'Multi-Model'}
            </button>

            {/* Model selector */}
            <button
              onClick={() => setShowModelSel(true)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                fontSize: 12.5, cursor: 'pointer', color: 'var(--text-main)',
                display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
                fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              {activeModels.length === 1 && activeModels[0]?.slug && (
                <BrandLogo slug={activeModels[0].slug} color={activeModels[0].color} size={13} />
              )}
              {activeModels.length === 1 ? activeModels[0]?.name : `${activeModels.length} Models`}
              <IC.ChevronD />
            </button>

            {/* Theme */}
            <button
              onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
              style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
            >
              {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
            </button>
          </div>
        </header>

        {/* ── CHAT BODY ── */}
        <div
          className="omni-scroll"
          style={{ flex: 1, display: 'flex', overflowX: isMultiMode ? 'auto' : 'hidden', overflowY: isMultiMode ? 'hidden' : 'auto', background: 'var(--bg-base)', minHeight: 0 }}
        >
          {isMultiMode ? (
            /* MULTI-MODEL VIEW */
            <div style={{ display: 'flex', height: '100%', minWidth: 'max-content' }}>
              {activeModels.map((model, idx) => {
                const key = `${model.providerId}-${model.id}`;
                const history = getCurrentHistory(key);
                const hasMessages = history.filter(m => m.role === 'user').length > 0;

                return (
                  <motion.div
                    key={`${model.id}-${model.providerId}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    style={{ width: 400, borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--bg-base)' }}
                  >
                    {/* Column header */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-light)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      flexShrink: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <ModelAvatar model={model} size={26} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: model.color }}>{model.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{model.type}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          onClick={() => continueWithModel(model)}
                          title="Continue with this model only"
                          style={{
                            padding: '4px 10px', fontSize: 11, fontWeight: 600,
                            background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                            borderRadius: 6, cursor: 'pointer', color: 'var(--text-main)',
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontFamily: "'Outfit', sans-serif"
                          }}
                        >
                          Continue <IC.ArrowR />
                        </button>
                        <button
                          onClick={() => removeModelFromChat(model.id, model.providerId)}
                          style={{ width: 26, height: 26, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <IC.X />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {!hasMessages ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, opacity: 0.5 }}>
                          <ModelAvatar model={model} size={36} />
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Waiting for message…</span>
                        </div>
                      ) : (
                        history.map(msg => (
                          <MessageBubble
                            key={msg.id} msg={msg} model={model}
                            userProfile={userProfile}
                            onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }}
                            onDelete={handleDeleteMsg}
                            onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(model) : null}
                            isCompact
                          />
                        ))
                      )}
                      <div ref={el => chatEndRefs.current[key] = el} />
                    </div>
                  </motion.div>
                );
              })}

              {/* Add model column */}
              <div style={{ width: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 20 }}>
                <button
                  onClick={() => setShowModelSel(true)}
                  style={{
                    padding: '12px 16px', borderRadius: 12,
                    background: 'var(--bg-hover)', border: '2px dashed var(--border-med)',
                    cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    fontSize: 12, fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span style={{ fontSize: 22 }}>＋</span>
                  Add Model
                </button>
              </div>
            </div>
          ) : (
            /* SINGLE MODEL VIEW */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Check if conversation has user messages */}
              {(() => {
                const key = `${activeModels[0]?.providerId}-${activeModels[0]?.id}`;
                const history = getCurrentHistory(key);
                const hasUserMsg = history.some(m => m.role === 'user');

                if (!hasUserMsg) {
                  return (
                    <EmptyState
                      activeModel={activeModels[0]}
                      onTemplateSelect={(text) => { setInput(text); setTimeout(() => inputRef.current?.focus(), 100); }}
                    />
                  );
                }

                return (
                  <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 16px' }}>
                    <div style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
                      {history.map(msg => (
                        <MessageBubble
                          key={msg.id} msg={msg}
                          model={activeModels[0]}
                          userProfile={userProfile}
                          onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }}
                          onDelete={handleDeleteMsg}
                          onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(activeModels[0]) : null}
                        />
                      ))}
                      <div ref={el => chatEndRefs.current['single'] = el} />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* ── ADVANCED INPUT ── */}
        <div style={{ padding: '0 20px', background: 'var(--bg-base)', flexShrink: 0 }}>
          <AdvancedInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            activeModels={activeModels}
            isMultiChatMode={isMultiMode}
            inputRef={inputRef}
          />
        </div>
      </main>

      {/* ═══════════════════════════════════
          MODEL SELECTOR MODAL
      ═══════════════════════════════════ */}
      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal
            onClose={() => setShowModelSel(false)}
            onSelect={handleModelSelect}
            activeModels={activeModels}
            isMultiChatMode={isMultiMode}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}