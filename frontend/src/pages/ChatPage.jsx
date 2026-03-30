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
   BRAND LOGO
══════════════════════════════════════════════════════════ */
function BrandLogo({ slug, color, size = 18 }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`}
      alt={slug}
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }}
      onError={e => { e.target.style.display = 'none'; }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   PROVIDERS & MODELS
══════════════════════════════════════════════════════════ */
const PROVIDERS = [
  {
    id: 'openai', name: 'OpenAI', slug: 'openai', color: '#10a37f',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', type: 'Advanced Reasoning', category: 'thinking', premium: true, contextWindow: '128K', speed: 'Fast' },
      { id: 'o3-mini', name: 'o3-mini', type: 'Fast Reasoning', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Very Fast' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', type: 'Enhanced Speed', category: 'thinking', premium: false, contextWindow: '128K', speed: 'Fast' },
      { id: 'dalle-3', name: 'DALL·E 3', type: 'Image Generation', category: 'image', premium: true, contextWindow: 'N/A', speed: 'Medium' },
      { id: 'whisper-v3', name: 'Whisper v3', type: 'Voice to Text', category: 'audio', premium: false, contextWindow: 'N/A', speed: 'Fast' },
    ]
  },
  {
    id: 'anthropic', name: 'Anthropic', slug: 'anthropic', color: '#e8a85f',
    models: [
      { id: 'claude-opus-4', name: 'Claude Opus 4', type: 'Deep Thinking', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Slow' },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', type: 'Creative Balance', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Fast' },
      { id: 'claude-sonnet-3.5', name: 'Claude 3.5 Sonnet', type: 'Creative Writing', category: 'document', premium: false, contextWindow: '200K', speed: 'Fast' },
      { id: 'claude-haiku', name: 'Claude 3.5 Haiku', type: 'High Speed', category: 'thinking', premium: false, contextWindow: '200K', speed: 'Ultra Fast' },
    ]
  },
  {
    id: 'google', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'Latest & Fastest', category: 'thinking', premium: true, contextWindow: '1M', speed: 'Very Fast' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: '2M Context Window', category: 'thinking', premium: true, contextWindow: '2M', speed: 'Medium' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', type: 'Fast Multi-modal', category: 'thinking', premium: false, contextWindow: '1M', speed: 'Very Fast' },
    ]
  },
  {
    id: 'deepseek', name: 'DeepSeek', slug: 'deepseek', color: '#4d6bfe',
    models: [
      { id: 'deepseek-r1', name: 'DeepSeek R1', type: 'Reasoning Model', category: 'thinking', premium: true, contextWindow: '64K', speed: 'Medium' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder V2', type: 'Programming Pro', category: 'document', premium: false, contextWindow: '128K', speed: 'Fast' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', type: 'General Purpose', category: 'thinking', premium: false, contextWindow: '64K', speed: 'Fast' },
    ]
  },
  {
    id: 'xai', name: 'xAI', slug: 'x', color: '#888888',
    models: [
      { id: 'grok-2', name: 'Grok 2', type: 'Real-time Knowledge', category: 'web_search', premium: true, contextWindow: '32K', speed: 'Fast' },
      { id: 'grok-1.5v', name: 'Grok 1.5 Vision', type: 'Image Understanding', category: 'thinking', premium: false, contextWindow: '32K', speed: 'Medium' },
    ]
  },
  {
    id: 'mistral', name: 'Mistral AI', slug: 'mistral', color: '#ff7000',
    models: [
      { id: 'mistral-large', name: 'Mistral Large', type: 'Top Tier', category: 'thinking', premium: true, contextWindow: '32K', speed: 'Medium' },
      { id: 'mistral-nemo', name: 'Mistral NeMo', type: 'Fast & Efficient', category: 'thinking', premium: false, contextWindow: '128K', speed: 'Fast' },
    ]
  },
  {
    id: 'meta', name: 'Meta', slug: 'meta', color: '#0081fb',
    models: [
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', type: 'Open Source Leader', category: 'thinking', premium: false, contextWindow: '128K', speed: 'Fast' },
      { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', type: 'Massive Scale', category: 'deep_research', premium: true, contextWindow: '128K', speed: 'Slow' },
    ]
  },
  {
    id: 'perplexity', name: 'Perplexity', slug: 'perplexity', color: '#20808d',
    models: [
      { id: 'perplexity-sonar', name: 'Perplexity Sonar', type: 'Web Search Expert', category: 'web_search', premium: true, contextWindow: '28K', speed: 'Fast' },
    ]
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Models', icon: '⚡' },
  { id: 'thinking', name: 'Reasoning', icon: '🧠' },
  { id: 'document', name: 'Writing', icon: '✍️' },
  { id: 'image', name: 'Image Gen', icon: '🎨' },
  { id: 'web_search', name: 'Web Search', icon: '🌐' },
  { id: 'deep_research', name: 'Deep Research', icon: '🔬' },
  { id: 'audio', name: 'Audio', icon: '🎙️' },
];

const PROMPT_TEMPLATES = [
  { id: 'explain', icon: '💡', label: 'Explain Like I\'m 5', text: 'Please explain the following concept in simple terms that a 5-year-old could understand: ' },
  { id: 'code', icon: '💻', label: 'Write Code', text: 'Write clean, well-commented code for the following task:\n\n' },
  { id: 'summarize', icon: '📋', label: 'Summarize', text: 'Please provide a concise, bullet-point summary of the following:\n\n' },
  { id: 'proofread', icon: '✏️', label: 'Proofread', text: 'Please proofread and improve the following text. Fix grammar, clarity, and flow:\n\n' },
  { id: 'brainstorm', icon: '🌩️', label: 'Brainstorm Ideas', text: 'Generate 10 creative and diverse ideas for the following topic:\n\n' },
  { id: 'translate', icon: '🌍', label: 'Translate', text: 'Translate the following text to English (or specify language):\n\n' },
  { id: 'debate', icon: '⚖️', label: 'Devil\'s Advocate', text: 'Present the strongest counter-arguments and opposing perspective for:\n\n' },
  { id: 'steps', icon: '📝', label: 'Step-by-Step Guide', text: 'Create a detailed, numbered step-by-step guide for:\n\n' },
  { id: 'email', icon: '📧', label: 'Draft Email', text: 'Write a professional email for the following purpose:\n\n' },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Open model selector' },
  { keys: ['⌘', 'N'], description: 'New conversation' },
  { keys: ['⌘', '/'], description: 'Show keyboard shortcuts' },
  { keys: ['⌘', 'E'], description: 'Export conversation' },
  { keys: ['⌘', 'F'], description: 'Search conversations' },
  { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
  { keys: ['⌘', 'M'], description: 'Toggle multi-chat mode' },
  { keys: ['Enter'], description: 'Send message' },
  { keys: ['Shift', 'Enter'], description: 'New line in input' },
  { keys: ['↑'], description: 'Edit last message' },
  { keys: ['Esc'], description: 'Close modal / Cancel edit' },
];

/* ══════════════════════════════════════════════════════════
   ICON LIBRARY (Clean & Professional)
══════════════════════════════════════════════════════════ */
const IC = {
  Menu: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Plus: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Send: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Mic: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  Image: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  User: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  Logout: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Grid: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  X: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Sparkles: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Columns: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>,
  Copy: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  ThumbUp: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14Z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
  ThumbDown: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10Z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>,
  Refresh: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  Edit: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Pin: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v5M9 8h6M9 12h6M15 2H9a1 1 0 0 0-1 1v1.586a1 1 0 0 0 .293.707l1.414 1.414A1 1 0 0 1 10 7.5V8h4v-.5a1 1 0 0 1 .293-.707l1.414-1.414A1 1 0 0 0 16 4.586V3a1 1 0 0 0-1-1z"/></svg>,
  Bookmark: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  Download: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Settings: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Keyboard: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"/></svg>,
  Template: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Brain: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Zap: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Sun: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ArrowRight: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const genId = () => Math.random().toString(36).slice(2, 9);

const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
};

const estimateTokens = (text) => Math.ceil(text.length / 4);

const parseMarkdown = (text) => {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block" style="background:var(--bg-modal);border:1px solid var(--border-med);border-radius:8px;margin:16px 0;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-panel);border-bottom:1px solid var(--border-light);">
          <span style="font-size:11px;color:var(--text-muted);font-family:'DM Mono',monospace;font-weight:600;text-transform:uppercase;">${lang || 'code'}</span>
          <button onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" style="font-size:11px;color:var(--text-muted);background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;">copy</button>
        </div>
        <pre style="margin:0;padding:12px;overflow-x:auto;font-family:'DM Mono',monospace;font-size:13px;line-height:1.5;color:var(--text-sec);">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>`
    )
    .replace(/^### (.+)$/gm, `<h3 style="font-size:1.1em;font-weight:700;color:var(--text-main);margin:20px 0 10px;">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 style="font-size:1.2em;font-weight:700;color:var(--text-main);margin:24px 0 12px;border-bottom:1px solid var(--border-light);padding-bottom:6px;">$1</h2>`)
    .replace(/^# (.+)$/gm, `<h1 style="font-size:1.4em;font-weight:800;color:var(--text-main);margin:28px 0 14px;">$1</h1>`)
    .replace(/^- (.+)$/gm, `<li style="margin-bottom:6px;position:relative;padding-left:1.2em;list-style:none;">$1</li>`)
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul style="margin:12px 0;padding:0;">${s}</ul>`)
    .replace(/`([^`]+)`/g, `<code style="background:var(--bg-hover);color:var(--text-main);padding:2px 6px;border-radius:4px;font-family:'DM Mono',monospace;font-size:0.9em;border:1px solid var(--border-light);">$1</code>`)
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong><em>$1</em></strong>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:var(--text-main);font-weight:700;">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split(/\n\n+/).map(para => {
        const trimmed = para.trim();
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<div')) return trimmed;
        return `<p style="margin-bottom:12px; margin-top:0; line-height:1.6;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
};

/* ══════════════════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════════════════ */
function TypingIndicator({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '6px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color || 'var(--text-muted)' }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════════════════ */
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            style={{
              padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'var(--bg-panel)',
              border: `1px solid ${t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : 'var(--border-med)'}`,
              color: 'var(--text-main)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onClick={() => removeToast(t.id)}
          >
            <span style={{color: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : 'var(--text-muted)'}}>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MESSAGE COMPONENT
══════════════════════════════════════════════════════════ */
function MessageBubble({ msg, model, userProfile, onCopy, onRegenerate, onEdit, onDelete, onBookmark, onReact, isCompact = false }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';
  
  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ display: 'flex', gap: isCompact ? 10 : 16, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative' }}
    >
      {/* Avatar */}
      <div style={{
        width: isCompact ? 26 : 32, height: isCompact ? 26 : 32, borderRadius: 6,
        background: isUser ? 'var(--text-main)' : 'var(--bg-hover)',
        border: `1px solid var(--border-light)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--bg-base)'
      }}>
        {isUser ? (
          userProfile?.avatar
            ? <img src={userProfile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <IC.User />
        ) : (
          model?.slug
            ? <BrandLogo slug={model.slug} color={model.color} size={isCompact ? 14 : 16} />
            : <img src="/logo.png" alt="AI" style={{ width: isCompact ? 14 : 16, height: isCompact ? 14 : 16, objectFit: 'contain' }} />
        )}
      </div>

      {/* Message Content */}
      <div style={{ maxWidth: isCompact ? '90%' : '85%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!isUser && model && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', fontFamily: "'Inter', sans-serif" }}>
              {model.name}
            </span>
            {msg.tokenCount && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                ~{msg.tokenCount} tokens
              </span>
            )}
          </div>
        )}

        <div style={{
          background: isUser ? 'var(--bg-hover)' : 'transparent',
          border: isUser ? '1px solid var(--border-light)' : 'none',
          padding: isUser ? (isCompact ? '10px 14px' : '12px 16px') : (isCompact ? '2px 0' : '6px 0'),
          borderRadius: isUser ? '12px' : 0,
          color: 'var(--text-sec)',
          fontSize: isCompact ? 13 : 14.5,
          fontFamily: "'Inter', sans-serif",
        }}>
          {msg.isStreaming ? (
            <TypingIndicator color="var(--text-muted)" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
          )}
        </div>

        {/* Timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </div>

      {/* Hover Action Buttons */}
      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute', top: -12,
              [isUser ? 'left' : 'right']: 0,
              display: 'flex', gap: 4,
              background: 'var(--bg-panel)', border: '1px solid var(--border-med)',
              borderRadius: 8, padding: '4px',
              zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {[
              { icon: copied ? <IC.Check /> : <IC.Copy />, action: handleCopy, title: 'Copy', color: copied ? '#10b981' : 'var(--text-muted)' },
              ...(isUser ? [{ icon: <IC.Edit />, action: () => onEdit(msg), title: 'Edit', color: 'var(--text-muted)' }] : [
                { icon: <IC.Refresh />, action: () => onRegenerate(msg), title: 'Regenerate', color: 'var(--text-muted)' },
              ]),
              { icon: <IC.Trash />, action: () => onDelete(msg.id), title: 'Delete', color: '#ef4444' },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} title={btn.title}
                style={{ padding: '4px 6px', background: 'none', border: 'none', color: btn.color, cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: 4, transition: 'all 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {btn.icon}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN CHAT PAGE
══════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const navigate = useNavigate();

  /* ── Core State ── */
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [currentUser, setCurrentUser] = useState(null); 
  const [userProfile, setUserProfile] = useState({ name: 'Loading...', email: '', avatar: null });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMultiChatMode, setMultiChatMode] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [editingMsg, setEditingMsg] = useState(null);
  const [sidebarSearch, setSidebarSearch] = useState('');

  /* ── Model State ── */
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModels, setActiveModels] = useState([{
    ...PROVIDERS.find(p => p.id === 'meta').models[0],
    providerName: 'Meta',
    providerId: 'meta',
    slug: 'meta',
    color: '#0081fb'
  }]);
  const [favoriteModels, setFavoriteModels] = useState([]);

  /* ── Conversations ── */
  const [conversations, setConversations] = useState([
    { id: 'default', title: 'New Conversation', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, folder: null }
  ]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [renamingConvId, setRenamingConvId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  /* ── Chat Histories ── */
  const [chatHistories, setChatHistories] = useState({ default: {} });

  /* ── Settings ── */
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 14, streamingEnabled: true, showTokens: true,
    sendOnEnter: true, compactMode: false, systemPrompt: '', temperature: 0.7, maxTokens: 2048,
    autoTitle: true,
  });

  /* ── Modals ── */
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showSystemPromptEditor, setShowSystemPromptEditor] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  /* ── Toasts ── */
  const [toasts, setToasts] = useState([]);
  const chatEndRefs = useRef({});
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  /* ── Toast Helper ── */
  const addToast = useCallback((message, type = 'info') => {
    const id = genId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  /* ── Theme Global Effect (FIXED) ── */
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Auth State Listener ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const m = session.user.user_metadata;
        setUserProfile({ name: m?.full_name || m?.name || 'Omni User', email: session.user.email, avatar: m?.avatar_url || m?.picture || null });
      } else navigate('/');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setCurrentUser(session.user);
      else navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  /* ── Fetch Chats ── */
  useEffect(() => {
    if (!currentUser) return;
    const fetchChats = async () => {
      const { data, error } = await supabase.from('chats').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
      if (error) return;
      if (data && data.length > 0) {
        const loadedConvs = data.map(c => ({ id: c.id, title: c.title, pinned: c.pinned, createdAt: c.created_at, updatedAt: c.updated_at }));
        const loadedHistories = {};
        data.forEach(c => { loadedHistories[c.id] = c.history; });
        setConversations(loadedConvs);
        setChatHistories(loadedHistories);
        setActiveConvId(loadedConvs[0].id);
      }
    };
    fetchChats();
  }, [currentUser]);

  const saveChatToDB = async (convId, title, currentHistory, isPinned, createdAt) => {
    if (!currentUser) return;
    const now = Date.now();
    await supabase.from('chats').upsert({ id: convId, user_id: currentUser.id, title: title || 'New Conversation', history: currentHistory, pinned: isPinned || false, created_at: createdAt || now, updated_at: now });
  };

  useEffect(() => {
    Object.values(chatEndRefs.current).forEach(ref => ref?.scrollIntoView({ behavior: 'smooth' }));
  }, [chatHistories]);

  /* ── Init model histories ── */
  useEffect(() => {
    activeModels.forEach(model => {
      const modelKey = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[modelKey]) {
        setChatHistories(prev => ({
          ...prev, [activeConvId]: { ...(prev[activeConvId] || {}), [modelKey]: [{
              id: genId(), role: 'assistant',
              content: `Hello! I'm **${model.name}**.\n\nI specialize in **${model.type}**. How can I assist you today?`,
              model: model, timestamp: Date.now(), tokenCount: 0,
            }] }
        }));
      }
    });
  }, [activeModels, activeConvId, chatHistories]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const getCurrentHistory = useCallback((modelKey) => chatHistories[activeConvId]?.[modelKey] || [], [chatHistories, activeConvId]);

  const handleNewConversation = useCallback(() => {
    const id = genId();
    setConversations(p => [{ id, title: 'New Conversation', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, folder: null }, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id);
    setMultiChatMode(false);
    setActiveModels([{ ...PROVIDERS.find(p => p.id === 'meta').models[0], providerName: 'Meta', providerId: 'meta', slug: 'meta', color: '#0081fb' }]);
    inputRef.current?.focus();
  }, []);

  const handleDeleteConversation = useCallback(async (id) => {
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { const n = { ...p }; delete n[id]; return n; });
    if (currentUser) await supabase.from('chats').delete().eq('id', id);
    if (activeConvId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) setActiveConvId(remaining[0].id);
      else handleNewConversation();
    }
  }, [activeConvId, conversations, handleNewConversation, currentUser]);

  /* ── Multi-Model Controls (FIXED) ── */
  const addModelToChat = useCallback((model, provider) => {
    const m = { ...model, providerName: provider.name, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (!activeModels.find(x => x.id === model.id && x.providerId === provider.id)) {
      setActiveModels(p => [...p, m]);
    }
    if (!isMultiChatMode) setShowModelSelector(false);
  }, [activeModels, isMultiChatMode]);

  const removeModelFromChat = useCallback((modelId, providerId) => {
    if (activeModels.length === 1) { addToast('At least one model must be active', 'error'); return; }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  }, [activeModels, addToast]);

  const continueWithSingleModel = useCallback((model) => {
      setActiveModels([model]);
      setMultiChatMode(false);
      addToast(`Switched to single chat with ${model.name}`, 'success');
  }, [addToast]);

  /* ── Send Message ── */
  const handleSend = useCallback((e) => {
    e?.preventDefault();
    const text = editingMsg ? editingMsg.newContent : input;
    if (!text?.trim() && !uploadedImage) return;

    if (editingMsg) {
      setChatHistories(prev => {
        const updated = { ...prev };
        activeModels.forEach(model => {
          const key = `${model.providerId}-${model.id}`;
          const msgs = [...(updated[activeConvId]?.[key] || [])];
          const idx = msgs.findIndex(m => m.id === editingMsg.id);
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], content: editingMsg.newContent };
            msgs.splice(idx + 1);
          }
          updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
        });
        return updated;
      });
      setEditingMsg(null);
    }

    const userMsg = { id: genId(), role: 'user', content: text.trim(), timestamp: Date.now(), image: uploadedImage };
    setChatHistories(prev => {
      const updated = { ...prev };
      activeModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        const curr = updated[activeConvId]?.[key] || [];
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...curr, userMsg] };
      });
      return updated;
    });

    setInput(''); setUploadedImage(null);

    let finalTitle = activeConv?.title;
    if (settings.autoTitle && activeConv?.title === 'New Conversation') {
      finalTitle = text.trim().slice(0, 40) + (text.length > 40 ? '…' : '');
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: finalTitle, updatedAt: Date.now() } : c));
    }

    const streamingMsg = { id: genId(), role: 'assistant', content: '', isStreaming: true, timestamp: Date.now() };
    setChatHistories(prev => {
      const updated = { ...prev };
      activeModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        const curr = updated[activeConvId]?.[key] || [];
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...curr, { ...streamingMsg, id: genId(), model }] };
      });
      return updated;
    });

    activeModels.forEach((model) => {
      const key = `${model.providerId}-${model.id}`;
      const validHistory = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming && !m.content.includes('❌')).map(m => ({ role: m.role, content: m.content }));
      const fullMessageHistory = [...validHistory, { role: 'user', content: text.trim() }];

      const fetchRealResponse = async () => {
        try {
          const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: fullMessageHistory, providerId: model.providerId, modelId: model.id, systemPrompt: settings.systemPrompt })
          });
          if (!response.ok) throw new Error("Server connection failed");

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let replyText = '', buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop();
            for (const part of parts) {
              const line = part.trim();
              if (line.startsWith('data: ')) {
                let parsed;
                try { parsed = JSON.parse(line.replace('data: ', '')); } catch (e) { continue; }
                if (parsed.type === 'error') throw new Error(parsed.message);
                if (parsed.type === 'chunk') {
                  replyText += parsed.text;
                  setChatHistories(prev => {
                    const updated = { ...prev };
                    const msgs = [...(updated[activeConvId]?.[key] || [])];
                    const streamIdx = msgs.findLastIndex(m => m.isStreaming);
                    if (streamIdx !== -1) msgs[streamIdx] = { ...msgs[streamIdx], content: replyText, tokenCount: estimateTokens(replyText) };
                    updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
                    return updated;
                  });
                }
              }
            }
          }
          setChatHistories(prev => {
            const updated = { ...prev };
            const msgs = [...(updated[activeConvId]?.[key] || [])];
            const streamIdx = msgs.findLastIndex(m => m.isStreaming);
            if (streamIdx !== -1) msgs[streamIdx] = { ...msgs[streamIdx], isStreaming: false };
            updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
            saveChatToDB(activeConvId, finalTitle || activeConv?.title, updated[activeConvId], activeConv?.pinned, activeConv?.createdAt);
            return updated;
          });
        } catch (error) {
          setChatHistories(prev => {
            const updated = { ...prev };
            const msgs = [...(updated[activeConvId]?.[key] || [])];
            const streamIdx = msgs.findLastIndex(m => m.isStreaming);
            if (streamIdx !== -1) msgs[streamIdx] = { ...msgs[streamIdx], content: `❌ **Error:** ${error.message}`, isStreaming: false, model };
            updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
            return updated;
          });
        }
      };
      fetchRealResponse();
    });
  }, [input, activeModels, activeConvId, activeConv, settings, editingMsg, uploadedImage, currentUser]);

  const handleRegenerate = useCallback((msg) => {
      // Basic regenerate dummy logic
      addToast('Regenerating response...', 'info');
  }, [addToast]);
  const handleCopyMessage = useCallback((content) => { navigator.clipboard.writeText(content); }, []);
  const handleDeleteMessage = useCallback(() => addToast('Message deleted', 'info'), [addToast]);

  const filteredProviders = useMemo(() => PROVIDERS.map(p => ({
    ...p, models: p.models.filter(m => (selectedCategory === 'all' || m.category === selectedCategory) && (!modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase())))
  })).filter(p => p.models.length > 0), [selectedCategory, modelSearch]);

  const filteredConvs = useMemo(() => {
    const pinned = conversations.filter(c => c.pinned && (!sidebarSearch || c.title.toLowerCase().includes(sidebarSearch.toLowerCase())));
    const regular = conversations.filter(c => !c.pinned && (!sidebarSearch || c.title.toLowerCase().includes(sidebarSearch.toLowerCase())));
    return { pinned, regular };
  }, [conversations, sidebarSearch]);

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", overflow: 'hidden', fontSize: settings.fontSize }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        
        :root[data-theme="dark"] {
          --bg-base: #09090b;
          --bg-panel: #09090b;
          --text-main: #fafafa;
          --text-sec: #e4e4e7;
          --text-muted: #a1a1aa;
          --border-light: #27272a;
          --border-med: #3f3f46;
          --bg-hover: #18181b;
          --bg-input: #18181b;
        }

        :root[data-theme="light"] {
          --bg-base: #ffffff;
          --bg-panel: #f9fafb;
          --text-main: #09090b;
          --text-sec: #3f3f46;
          --text-muted: #71717a;
          --border-light: #e4e4e7;
          --border-med: #d4d4d8;
          --bg-hover: #f4f4f5;
          --bg-input: #ffffff;
        }

        * { box-sizing: border-box; scrollbar-width: none; }
        ::-webkit-scrollbar { display: none; }
        input, textarea, button { font-family: inherit; color: inherit; }
        input::placeholder, textarea::placeholder { color: var(--text-muted); }
      `}</style>

      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
          >
            {/* Logo */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-light)' }}>
              <img src="/logo.png" alt="OMNI AI" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>OMNI AI PRO</div>
              </div>
            </div>

            <div style={{ padding: '12px' }}>
              <button onClick={handleNewConversation}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--text-main)', color: 'var(--bg-base)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              >
                <IC.Plus /> New Chat
              </button>
            </div>

            {/* Conversations */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, padding: '8px 4px' }}>RECENT CHATS</div>
              {filteredConvs.regular.map(conv => (
                <div key={conv.id} onClick={() => setActiveConvId(conv.id)}
                  style={{ padding: '8px 10px', borderRadius: 6, background: activeConvId === conv.id ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', fontSize: 13, color: activeConvId === conv.id ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: 2 }}
                >
                  {conv.title}
                </div>
              ))}
            </div>

            {/* Bottom Controls */}
            <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} style={{ flex: 1, padding: 8, background: 'var(--bg-hover)', border: 'none', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><IC.Sun /></button>
                <button onClick={() => setShowSettings(true)} style={{ flex: 1, padding: 8, background: 'var(--bg-hover)', border: 'none', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><IC.Settings /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--text-muted)', color: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                   {userProfile.name.charAt(0)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userProfile.name}</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ padding: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.Menu /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-hover)', padding: '4px', borderRadius: 8 }}>
                <button onClick={() => setMultiChatMode(false)} style={{ padding: '4px 10px', background: !isMultiChatMode ? 'var(--bg-panel)' : 'transparent', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: !isMultiChatMode ? 'var(--text-main)' : 'var(--text-muted)', boxShadow: !isMultiChatMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Single</button>
                <button onClick={() => setMultiChatMode(true)} style={{ padding: '4px 10px', background: isMultiChatMode ? 'var(--bg-panel)' : 'transparent', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: isMultiChatMode ? 'var(--text-main)' : 'var(--text-muted)', boxShadow: isMultiChatMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Multi Model</button>
            </div>
          </div>
          <button onClick={() => setShowModelSelector(true)} style={{ padding: '6px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, color: 'var(--text-main)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Add AI Model</button>
        </header>

        {/* Chat Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {isMultiChatMode ? (
            <div style={{ display: 'flex', width: '100%', overflowX: 'auto' }}>
              {activeModels.map((model, colIdx) => {
                const modelKey = `${model.providerId}-${model.id}`;
                const messages = getCurrentHistory(modelKey);
                return (
                  <div key={modelKey} style={{ flex: '1', minWidth: 380, borderRight: colIdx < activeModels.length - 1 ? '1px solid var(--border-light)' : 'none', display: 'flex', flexDirection: 'column' }}>
                    {/* Multi-Model Column Header (CLEAN DESIGN) */}
                    <div style={{ padding: '12px 16px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: model.color }}>
                          <BrandLogo slug={model.slug} color={model.color} size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{model.name}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => continueWithSingleModel(model)} title="Continue single chat with this AI" style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, color: 'var(--text-main)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                           Continue <IC.ArrowRight />
                        </button>
                        <button onClick={() => removeModelFromChat(model.id, model.providerId)} title="Remove model" style={{ padding: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <IC.X />
                        </button>
                      </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} model={model} userProfile={userProfile} onCopy={handleCopyMessage} onRegenerate={handleRegenerate} onEdit={() => {}} onDelete={handleDeleteMessage} />)}
                        <div ref={el => chatEndRefs.current[modelKey] = el} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 100px' }}>
              <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {getCurrentHistory(`${activeModels[0]?.providerId}-${activeModels[0]?.id}`).map(msg => (
                  <MessageBubble key={msg.id} msg={msg} model={activeModels[0]} userProfile={userProfile} onCopy={handleCopyMessage} onRegenerate={handleRegenerate} onEdit={() => {}} onDelete={handleDeleteMessage} />
                ))}
                <div ref={el => chatEndRefs.current['single'] = el} />
              </div>
            </div>
          )}
        </div>

        {/* Input Box (SLEEK ENTERPRISE LOOK) */}
        <div style={{ padding: '16px 24px', background: 'var(--bg-base)' }}>
          <div style={{ maxWidth: isMultiChatMode ? '100%' : 760, margin: '0 auto', background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'flex-end', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <button style={{ padding: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.Plus /></button>
            <textarea
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
              placeholder={isMultiChatMode ? `Ask ${activeModels.length} models...` : `Message ${activeModels[0]?.name}...`}
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px 0', fontSize: 14, maxHeight: 150 }}
            />
            <button onClick={handleSend} disabled={!input.trim()}
              style={{ padding: 8, borderRadius: 8, background: input.trim() ? 'var(--text-main)' : 'var(--bg-hover)', color: input.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', transition: 'all 0.2s' }}
            >
              <IC.Send />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>AI can make mistakes. Verify important information.</div>
        </div>
      </div>

      {/* Model Selector Modal */}
      <AnimatePresence>
        {showModelSelector && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
             <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: 12, width: '90%', maxWidth: 800, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>Select AI Model</h3>
                    <button onClick={() => setShowModelSelector(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><IC.X /></button>
                </div>
                <div style={{ padding: 20, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                   {PROVIDERS.map(p => p.models.map(m => (
                       <div key={m.id} onClick={() => { if(isMultiChatMode) addModelToChat(m, p); else { setActiveModels([{...m, providerId: p.id, color: p.color, slug: p.slug}]); setShowModelSelector(false); } }}
                         style={{ padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', background: 'var(--bg-input)' }}>
                           <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{m.name}</div>
                           <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.name}</div>
                       </div>
                   )))}
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}