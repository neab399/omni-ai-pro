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
    id: 'xai', name: 'xAI', slug: 'x', color: '#ffffff',
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
  { id: 'analyze', icon: '🔍', label: 'Analyze & Critique', text: 'Provide a thorough analysis and constructive critique of:\n\n' },
  { id: 'compare', icon: '📊', label: 'Compare Options', text: 'Create a detailed comparison table and recommendation for:\n\n' },
  { id: 'story', icon: '📖', label: 'Write a Story', text: 'Write a compelling short story with the following premise:\n\n' },
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
   ICON LIBRARY
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
  Folder: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Share: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
  Template: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Brain: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronDown: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>,
  Globe: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Zap: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Sun: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
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

const parseMarkdown = (text, accentColor = '#FFD93D') => {
  return text
    // 1. Code Blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block" style="background:var(--bg-modal);border:1px solid var(--border-med);border-radius:10px;margin:20px 0;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--bg-panel);border-bottom:1px solid var(--border-light);">
          <span style="font-size:11px;color:var(--text-muted);font-family:'DM Mono',monospace;font-weight:600;text-transform:uppercase;">${lang || 'code'}</span>
          <button onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" style="font-size:11px;color:var(--text-muted);background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;">copy code</button>
        </div>
        <pre style="margin:0;padding:16px;overflow-x:auto;font-family:'DM Mono',monospace;font-size:13.5px;line-height:1.6;color:var(--text-sec);">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>`
    )
    // 2. Headings
    .replace(/^### (.+)$/gm, `<h3 style="font-size:1.1em;font-weight:700;color:var(--text-main);margin:24px 0 12px;">$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2 style="font-size:1.3em;font-weight:800;color:var(--text-main);margin:28px 0 14px;border-bottom:1px solid var(--border-light);padding-bottom:8px;">$1</h2>`)
    .replace(/^# (.+)$/gm, `<h1 style="font-size:1.6em;font-weight:800;color:var(--text-main);margin:32px 0 16px;">$1</h1>`)
    // 3. Lists
    .replace(/^- (.+)$/gm, `<li style="margin-bottom:8px;position:relative;padding-left:1.5em;list-style:none;">$1</li>`)
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul style="margin:16px 0;padding:0;">${s}</ul>`)
    // 4. Inline Formatting
    .replace(/`([^`]+)`/g, `<code style="background:var(--bg-hover);color:${accentColor};padding:2px 6px;border-radius:4px;font-family:'DM Mono',monospace;font-size:0.9em;border:1px solid var(--border-light);">$1</code>`)
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong><em>$1</em></strong>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:var(--text-main);font-weight:700;">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 5. Paragraph & Spacing Magic
    .split(/\n\n+/).map(para => {
        const trimmed = para.trim();
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<div')) return trimmed;
        return `<p style="margin-bottom:16px; margin-top:0; line-height:1.7;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
};

/* ══════════════════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════════════════ */
function TypingIndicator({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '8px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color || '#FFD93D' }}
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
              padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              background: t.type === 'success' ? 'rgba(74,222,128,0.15)' : t.type === 'error' ? 'rgba(239,68,68,0.15)' : 'var(--bg-panel)',
              border: `1px solid ${t.type === 'success' ? 'rgba(74,222,128,0.3)' : t.type === 'error' ? 'rgba(239,68,68,0.3)' : 'var(--border-med)'}`,
              color: t.type === 'success' ? '#4ade80' : t.type === 'error' ? '#ef4444' : 'var(--text-main)',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
            onClick={() => removeToast(t.id)}
          >
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}</span>
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
  const accentColor = isUser ? 'var(--text-main)' : (model?.color || '#FFD93D');

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ display: 'flex', gap: isCompact ? 10 : 14, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative' }}
    >
      {/* Avatar */}
      <div style={{
        width: isCompact ? 28 : 34, height: isCompact ? 28 : 34, borderRadius: isCompact ? 8 : 10,
        background: isUser ? 'var(--bg-user-msg)' : `${accentColor}12`,
        border: `1px solid ${isUser ? 'var(--border-light)' : accentColor + '30'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
      }}>
        {isUser ? (
          userProfile?.avatar
            ? <img src={userProfile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <IC.User />
        ) : (
          model?.slug
            ? <BrandLogo slug={model.slug} color={model.color} size={isCompact ? 14 : 18} />
            : <img src="/logo.png" alt="AI" style={{ width: isCompact ? 14 : 18, height: isCompact ? 14 : 18, objectFit: 'contain' }} />
        )}
      </div>

      {/* Message Content */}
      <div style={{ maxWidth: isCompact ? '90%' : '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Model label */}
        {!isUser && model && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: model.color, fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em' }}>
              {model.name}
            </span>
            {msg.tokenCount && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                ~{msg.tokenCount} tokens
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div style={{
          background: isUser ? 'var(--bg-user-msg)' : 'transparent',
          border: isUser ? '1px solid var(--border-light)' : 'none',
          padding: isUser ? (isCompact ? '10px 14px' : '14px 18px') : (isCompact ? '4px 0' : '8px 0'),
          borderRadius: isUser ? '16px 16px 4px 16px' : 0,
          color: 'var(--text-sec)',
          fontSize: isCompact ? 14 : 15,
          lineHeight: 1.75,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.01em'
        }}>
          {msg.isStreaming ? (
            <TypingIndicator color={model?.color} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content, accentColor) }} />
          )}
        </div>

        {/* Reactions & timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
            {formatTime(msg.timestamp)}
          </span>
          {msg.reaction && (
            <span style={{ fontSize: 11 }}>{msg.reaction === 'up' ? '👍' : '👎'}</span>
          )}
          {msg.bookmarked && (
            <span style={{ fontSize: 10, color: '#FFD93D' }}>★</span>
          )}
        </div>
      </div>

      {/* Hover Action Buttons */}
      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute', top: -8,
              [isUser ? 'left' : 'right']: 0,
              display: 'flex', gap: 4,
              background: 'var(--bg-modal)', border: '1px solid var(--border-med)',
              borderRadius: 10, padding: '4px 6px',
              zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}
          >
            {[
              { icon: copied ? <IC.Check /> : <IC.Copy />, action: handleCopy, title: 'Copy', color: copied ? '#4ade80' : 'var(--text-muted)' },
              ...(isUser ? [{ icon: <IC.Edit />, action: () => onEdit(msg), title: 'Edit', color: 'var(--text-muted)' }] : [
                { icon: <IC.Refresh />, action: () => onRegenerate(msg), title: 'Regenerate', color: 'var(--text-muted)' },
                { icon: <IC.ThumbUp />, action: () => onReact(msg.id, 'up'), title: 'Good response', color: msg.reaction === 'up' ? '#4ade80' : 'var(--text-muted)' },
                { icon: <IC.ThumbDown />, action: () => onReact(msg.id, 'down'), title: 'Bad response', color: msg.reaction === 'down' ? '#ef4444' : 'var(--text-muted)' },
                { icon: <IC.Bookmark />, action: () => onBookmark(msg.id), title: 'Bookmark', color: msg.bookmarked ? '#FFD93D' : 'var(--text-muted)' },
              ]),
              { icon: <IC.Share />, action: () => onCopy(msg.content), title: 'Share', color: 'var(--text-muted)' },
              { icon: <IC.Trash />, action: () => onDelete(msg.id), title: 'Delete', color: '#ef4444' },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} title={btn.title}
                style={{ padding: '4px 5px', background: 'none', border: 'none', color: btn.color, cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: 6, transition: 'all 0.15s' }}
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
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null); // Added for Supabase DB
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
  // Ab default model Meta ka Llama 3.3 hoga
  const [activeModels, setActiveModels] = useState([{
    ...PROVIDERS.find(p => p.id === 'meta').models[0],
    providerName: 'Meta',
    providerId: 'meta',
    slug: 'meta',
    color: '#0081fb',
    enabled: true
  }]);
  const [favoriteModels, setFavoriteModels] = useState([]);

  /* ── Conversations ── */
  const [conversations, setConversations] = useState([
    { id: 'default', title: 'New Conversation', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, folder: null }
  ]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [renamingConvId, setRenamingConvId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  /* ── Chat Histories (convId -> modelKey -> messages[]) ── */
  const [chatHistories, setChatHistories] = useState({ default: {} });

  /* ── Settings ── */
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 14, streamingEnabled: true, showTokens: true,
    sendOnEnter: true, compactMode: false, soundEnabled: false,
    systemPrompt: '', temperature: 0.7, maxTokens: 2048,
    autoTitle: true, showTimestamps: true,
  });

  /* ── Modals ── */
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showSystemPromptEditor, setShowSystemPromptEditor] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  /* ── Toasts ── */
  const [toasts, setToasts] = useState([]);

  /* ── Refs ── */
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
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  /* ── Fetch Chats from Supabase on Load ── */
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      if (data && data.length > 0) {
        const loadedConvs = data.map(c => ({
          id: c.id, title: c.title, pinned: c.pinned, createdAt: c.created_at, updatedAt: c.updated_at
        }));
        
        const loadedHistories = {};
        data.forEach(c => { loadedHistories[c.id] = c.history; });

        setConversations(loadedConvs);
        setChatHistories(loadedHistories);
        setActiveConvId(loadedConvs[0].id);
      }
    };
    fetchChats();
  }, [currentUser]);

  /* ── DB Save Helper ── */
  const saveChatToDB = async (convId, title, currentHistory, isPinned, createdAt) => {
    if (!currentUser) return;
    const now = Date.now();
    const chatData = {
      id: convId,
      user_id: currentUser.id,
      title: title || 'New Conversation',
      history: currentHistory,
      pinned: isPinned || false,
      created_at: createdAt || now,
      updated_at: now
    };
    const { error } = await supabase.from('chats').upsert(chatData);
    if (error) console.error("Error saving chat:", error);
  };

  /* ── Auto-scroll ── */
  useEffect(() => {
    Object.values(chatEndRefs.current).forEach(ref => ref?.scrollIntoView({ behavior: 'smooth' }));
  }, [chatHistories]);

  /* ── Init model histories when model added ── */
  useEffect(() => {
    activeModels.forEach(model => {
      const modelKey = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[modelKey]) {
        setChatHistories(prev => ({
          ...prev,
          [activeConvId]: {
            ...(prev[activeConvId] || {}),
            [modelKey]: [{
              id: genId(),
              role: 'assistant',
              content: `Hello! I'm **${model.name}** by ${model.providerName}.\n\nI specialize in **${model.type}** with a context window of **${model.contextWindow}**.\n\nHow can I assist you today?`,
              model: model,
              timestamp: Date.now(),
              tokenCount: 0,
            }]
          }
        }));
      }
    });
  }, [activeModels, activeConvId, chatHistories]);

  /* ── Helpers ── */
  const activeConv = conversations.find(c => c.id === activeConvId);

  const getCurrentHistory = useCallback((modelKey) => {
    return chatHistories[activeConvId]?.[modelKey] || [];
  }, [chatHistories, activeConvId]);

  const handleNewConversation = useCallback(() => {
    const id = genId();
    const newConv = { id, title: 'New Conversation', createdAt: Date.now(), updatedAt: Date.now(), pinned: false, folder: null };
    setConversations(p => [newConv, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id);
    setMultiChatMode(false);
    setActiveModels([{
      ...PROVIDERS[0].models[0],
      providerName: PROVIDERS[0].name,
      providerId: PROVIDERS[0].id,
      slug: PROVIDERS[0].slug,
      color: PROVIDERS[0].color,
      enabled: true
    }]);
    inputRef.current?.focus();
  }, []);

  const handleDeleteConversation = useCallback(async (id) => {
    // 1. Delete from State
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { const n = { ...p }; delete n[id]; return n; });
    
    // 2. Delete from DB
    if (currentUser) {
      await supabase.from('chats').delete().eq('id', id);
    }

    if (activeConvId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) setActiveConvId(remaining[0].id);
      else handleNewConversation();
    }
    addToast('Conversation deleted', 'info');
  }, [activeConvId, conversations, handleNewConversation, addToast, currentUser]);

  const handlePinConversation = useCallback((id) => {
    setConversations(p => {
      const updated = p.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c);
      const targetConv = updated.find(c => c.id === id);
      if (targetConv) {
        saveChatToDB(targetConv.id, targetConv.title, chatHistories[targetConv.id], targetConv.pinned, targetConv.createdAt);
      }
      return updated;
    });
  }, [chatHistories]);

  const handleRenameConversation = useCallback((id, title) => {
    setConversations(p => {
      const updated = p.map(c => c.id === id ? { ...c, title } : c);
      const targetConv = updated.find(c => c.id === id);
      if (targetConv) {
        saveChatToDB(targetConv.id, targetConv.title, chatHistories[targetConv.id], targetConv.pinned, targetConv.createdAt);
      }
      return updated;
    });
    setRenamingConvId(null);
    addToast('Conversation renamed', 'success');
  }, [chatHistories, addToast]);

  /* ── Keyboard Shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === 'k') { e.preventDefault(); setShowModelSelector(true); }
        if (e.key === 'n') { e.preventDefault(); handleNewConversation(); }
        if (e.key === '/') { e.preventDefault(); setShowShortcuts(true); }
        if (e.key === 'b') { e.preventDefault(); setSidebarOpen(p => !p); }
        if (e.key === 'm') { e.preventDefault(); setMultiChatMode(p => !p); }
        if (e.key === 'e') { e.preventDefault(); setShowExportMenu(true); }
      }
      if (e.key === 'Escape') {
        setShowModelSelector(false); setShowSettings(false);
        setShowShortcuts(false); setShowPromptLibrary(false);
        setShowSystemPromptEditor(false); setEditingMsg(null);
        setShowExportMenu(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNewConversation]);


  /* ── Send Message (Connected to Stream & Port 5000 + Memory & Buffer Fix) ── */
  const handleSend = useCallback((e) => {
    e?.preventDefault();
    const text = editingMsg ? editingMsg.newContent : input;
    if (!text?.trim() && !uploadedImage) return;

    const enabledModels = activeModels.filter(m => m.enabled);

    // Handle edit mode
    if (editingMsg) {
      setChatHistories(prev => {
        const updated = { ...prev };
        enabledModels.forEach(model => {
          const key = `${model.providerId}-${model.id}`;
          const msgs = [...(updated[activeConvId]?.[key] || [])];
          const idx = msgs.findIndex(m => m.id === editingMsg.id);
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], content: editingMsg.newContent, edited: true };
            msgs.splice(idx + 1);
          }
          updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
        });
        return updated;
      });
      setEditingMsg(null);
    }

    const userMsg = {
      id: genId(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
      image: uploadedImage,
    };

    setChatHistories(prev => {
      const updated = { ...prev };
      enabledModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        const curr = updated[activeConvId]?.[key] || [];
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...curr, userMsg] };
      });
      return updated;
    });

    setInput('');
    setUploadedImage(null);

    let finalTitle = activeConv?.title;
    if (settings.autoTitle && activeConv?.title === 'New Conversation') {
      finalTitle = text.trim().slice(0, 40) + (text.length > 40 ? '…' : '');
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: finalTitle, updatedAt: Date.now() } : c));
    } else {
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, updatedAt: Date.now() } : c));
    }

    const streamingMsg = { id: genId(), role: 'assistant', content: '', isStreaming: true, timestamp: Date.now() };
    setChatHistories(prev => {
      const updated = { ...prev };
      enabledModels.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        const curr = updated[activeConvId]?.[key] || [];
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...curr, { ...streamingMsg, id: genId(), model }] };
      });
      return updated;
    });

    // 🚀 FETCH REAL STREAMING RESPONSES FROM BACKEND
    enabledModels.forEach((model) => {
      const key = `${model.providerId}-${model.id}`;

      // 🧠 Chat History Memory Generate karo
      const currentModelHistory = chatHistories[activeConvId]?.[key] || [];
      const validHistory = currentModelHistory
        .filter(m => !m.isStreaming && !m.content.includes('❌'))
        .map(m => ({ role: m.role, content: m.content }));
      
      const fullMessageHistory = [...validHistory, { role: 'user', content: text.trim() }];

      const fetchRealResponse = async () => {
        try {
// Puraana (localhost) hatao, aur ye dalo:
const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: fullMessageHistory, // Pura context bhej rahe hain
              providerId: model.providerId, 
              modelId: model.id,
              systemPrompt: settings.systemPrompt             
            })
          });

          if (!response.ok) throw new Error("Server connection failed");

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let replyText = '';
          let buffer = ''; // 🚀 YAHAN BUFFER ADD HUA HAI (Groq ki speed handle karne ke liye)

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            // Text ko tukdo (chunks) mein split karo
            const parts = buffer.split('\n\n');
            buffer = parts.pop(); // Incomplete part wapas buffer mein daal do

            for (const part of parts) {
              const line = part.trim();
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '');
                
                let parsed;
                try {
                  parsed = JSON.parse(dataStr);
                } catch (e) {
                  continue; // Aadha JSON aane par ignore karo (buffer sambhal lega)
                }
                
                if (parsed.type === 'error') throw new Error(parsed.message);
                
                if (parsed.type === 'chunk') {
                  replyText += parsed.text;
                  setChatHistories(prev => {
                    const updated = { ...prev };
                    const msgs = [...(updated[activeConvId]?.[key] || [])];
                    const streamIdx = msgs.findLastIndex(m => m.isStreaming);
                    if (streamIdx !== -1) {
                      msgs[streamIdx] = { ...msgs[streamIdx], content: replyText, tokenCount: estimateTokens(replyText) };
                    }
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

            setConversations(convs => {
              const currentConv = convs.find(c => c.id === activeConvId);
              saveChatToDB(activeConvId, finalTitle || currentConv?.title, updated[activeConvId], currentConv?.pinned, currentConv?.createdAt);
              return convs;
            });
            return updated;
          });

        } catch (error) {
          console.error("API Error:", error);
          setChatHistories(prev => {
            const updated = { ...prev };
            const msgs = [...(updated[activeConvId]?.[key] || [])];
            const streamIdx = msgs.findLastIndex(m => m.isStreaming);
            if (streamIdx !== -1) {
              msgs[streamIdx] = { ...msgs[streamIdx], content: `❌ **Error:** ${error.message}`, isStreaming: false, model };
            }
            updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
            return updated;
          });
        }
      };

      fetchRealResponse();
    });
  }, [input, activeModels, activeConvId, activeConv, settings, editingMsg, uploadedImage, currentUser]);
  /* ── Message Actions ── */
  const handleCopyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content).then(() => addToast('Copied to clipboard', 'success'));
  }, [addToast]);

  const handleRegenerate = useCallback((msg) => {
    const key = `${msg.model.providerId}-${msg.model.id}`;
    setChatHistories(prev => {
      const updated = { ...prev };
      const msgs = [...(updated[activeConvId]?.[key] || [])];
      const idx = msgs.findIndex(m => m.id === msg.id);
      if (idx !== -1) msgs[idx] = { ...msgs[idx], isStreaming: true, content: '' };
      updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
      return updated;
    });
    setTimeout(() => {
      const newContent = `**Regenerated response from ${msg.model.name}:**\n\nThis is a fresh response for your previous query. In production this would use a new API call with the same context.\n\n- Temperature: **${settings.temperature}**\n- Model: **${msg.model.name}**\n\nResponse regenerated at ${new Date().toLocaleTimeString()}.`;
      setChatHistories(prev => {
        const updated = { ...prev };
        const msgs = [...(updated[activeConvId]?.[key] || [])];
        const idx = msgs.findIndex(m => m.id === msg.id);
        if (idx !== -1) msgs[idx] = { ...msgs[idx], isStreaming: false, content: newContent, tokenCount: estimateTokens(newContent) };
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: msgs };
        
        // Save regeneration to DB
        setConversations(convs => {
            const currentConv = convs.find(c => c.id === activeConvId);
            saveChatToDB(activeConvId, currentConv?.title, updated[activeConvId], currentConv?.pinned, currentConv?.createdAt);
            return convs;
        });

        return updated;
      });
    }, 1200);
    addToast('Regenerating response…', 'info');
  }, [activeConvId, settings.temperature, addToast]);

  const handleDeleteMessage = useCallback((msgId) => {
    setChatHistories(prev => {
      const updated = { ...prev };
      const conv = { ...(updated[activeConvId] || {}) };
      Object.keys(conv).forEach(key => {
        conv[key] = conv[key].filter(m => m.id !== msgId);
      });
      updated[activeConvId] = conv;
      
      // Save deletion to DB
      setConversations(convs => {
        const currentConv = convs.find(c => c.id === activeConvId);
        saveChatToDB(activeConvId, currentConv?.title, updated[activeConvId], currentConv?.pinned, currentConv?.createdAt);
        return convs;
      });

      return updated;
    });
    addToast('Message deleted', 'info');
  }, [activeConvId, addToast]);

  const handleBookmarkMessage = useCallback((msgId) => {
    setChatHistories(prev => {
      const updated = { ...prev };
      const conv = { ...(updated[activeConvId] || {}) };
      Object.keys(conv).forEach(key => {
        conv[key] = conv[key].map(m => m.id === msgId ? { ...m, bookmarked: !m.bookmarked } : m);
      });
      updated[activeConvId] = conv;
      return updated;
    });
    addToast('Message bookmarked', 'success');
  }, [activeConvId, addToast]);

  const handleReactMessage = useCallback((msgId, reaction) => {
    setChatHistories(prev => {
      const updated = { ...prev };
      const conv = { ...(updated[activeConvId] || {}) };
      Object.keys(conv).forEach(key => {
        conv[key] = conv[key].map(m => m.id === msgId ? { ...m, reaction: m.reaction === reaction ? null : reaction } : m);
      });
      updated[activeConvId] = conv;
      return updated;
    });
  }, [activeConvId]);

  /* ── Model Management ── */
  const addModelToChat = useCallback((model, provider) => {
    const m = { ...model, providerName: provider.name, providerId: provider.id, slug: provider.slug, color: provider.color, enabled: true };
    if (!activeModels.find(x => x.id === model.id && x.providerId === provider.id)) {
      setActiveModels(p => [...p, m]);
      addToast(`${model.name} added to chat`, 'success');
    } else addToast(`${model.name} is already active`, 'info');
    if (!isMultiChatMode) setShowModelSelector(false);
  }, [activeModels, isMultiChatMode, addToast]);

  const removeModelFromChat = useCallback((modelId, providerId) => {
    if (activeModels.length === 1) { addToast('At least one model must be active', 'error'); return; }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  }, [activeModels, addToast]);

  const toggleModelEnabled = useCallback((modelId, providerId) => {
    setActiveModels(p => p.map(m => m.id === modelId && m.providerId === providerId ? { ...m, enabled: !m.enabled } : m));
  }, []);

  const toggleFavorite = useCallback((key) => {
    setFavoriteModels(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);
  }, []);

  /* ── Export ── */
  const handleExport = useCallback((format) => {
    const firstModelKey = Object.keys(chatHistories[activeConvId] || {})[0];
    const msgs = chatHistories[activeConvId]?.[firstModelKey] || [];

    let content = '';
    if (format === 'md') {
      content = `# ${activeConv?.title || 'Conversation'}\n\n${msgs.map(m =>
        `**${m.role === 'user' ? 'You' : m.model?.name || 'AI'}** *(${formatTime(m.timestamp)})*\n\n${m.content}\n\n---\n`
      ).join('\n')}`;
    } else if (format === 'txt') {
      content = msgs.map(m => `[${m.role === 'user' ? 'You' : m.model?.name || 'AI'}]: ${m.content}`).join('\n\n');
    } else {
      content = JSON.stringify({ title: activeConv?.title, messages: msgs }, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${(activeConv?.title || 'chat').replace(/\s/g, '_')}.${format}`;
    a.click(); URL.revokeObjectURL(url);
    setShowExportMenu(false);
    addToast(`Exported as .${format}`, 'success');
  }, [chatHistories, activeConvId, activeConv, addToast]);

  /* ── Consensus ── */
  const generateConsensus = useCallback(() => {
    const enabled = activeModels.filter(m => m.enabled);
    if (enabled.length < 2) { addToast('Enable at least 2 models for consensus', 'error'); return; }
    const consensusContent = `# 🌟 Consensus Response\n\nSynthesizing perspectives from **${enabled.length} models**:\n\n${enabled.map(m => `### ${m.name} (${m.providerName})\n*Specialization: ${m.type}*\nWould contribute its ${m.type.toLowerCase()} capabilities to this analysis.\n`).join('\n')}\n\n**Summary**: In production, this would use an orchestration layer to query all models simultaneously and synthesize a final, authoritative response that combines the strengths of each model.`;
    const consensusMsg = { id: genId(), role: 'assistant', content: consensusContent, model: { name: 'Consensus', color: '#FFD93D', slug: null }, timestamp: Date.now(), tokenCount: estimateTokens(consensusContent) };

    setChatHistories(prev => {
      const updated = { ...prev };
      enabled.forEach(model => {
        const key = `${model.providerId}-${model.id}`;
        const curr = updated[activeConvId]?.[key] || [];
        updated[activeConvId] = { ...(updated[activeConvId] || {}), [key]: [...curr, consensusMsg] };
      });
      
      // Save consensus to DB
      setConversations(convs => {
        const currentConv = convs.find(c => c.id === activeConvId);
        saveChatToDB(activeConvId, currentConv?.title, updated[activeConvId], currentConv?.pinned, currentConv?.createdAt);
        return convs;
      });

      return updated;
    });
    addToast('Consensus generated', 'success');
  }, [activeModels, activeConvId, addToast]);

  /* ── Filtered models for selector ── */
  const filteredProviders = useMemo(() => PROVIDERS.map(p => ({
    ...p,
    models: p.models.filter(m => {
      const catOk = selectedCategory === 'all' || m.category === selectedCategory;
      const searchOk = !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.type.toLowerCase().includes(modelSearch.toLowerCase()) || p.name.toLowerCase().includes(modelSearch.toLowerCase());
      return catOk && searchOk;
    })
  })).filter(p => p.models.length > 0), [selectedCategory, modelSearch]);

  /* ── Filtered conversations ── */
  const filteredConvs = useMemo(() => {
    const pinned = conversations.filter(c => c.pinned && (!sidebarSearch || c.title.toLowerCase().includes(sidebarSearch.toLowerCase())));
    const regular = conversations.filter(c => !c.pinned && (!sidebarSearch || c.title.toLowerCase().includes(sidebarSearch.toLowerCase())));
    return { pinned, regular };
  }, [conversations, sidebarSearch]);

  /* ── Total token usage ── */
  const totalTokens = useMemo(() => {
    let total = 0;
    Object.values(chatHistories[activeConvId] || {}).forEach(msgs => {
      msgs.forEach(m => { if (m.tokenCount) total += m.tokenCount; });
    });
    return total;
  }, [chatHistories, activeConvId]);

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div data-theme={theme} style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: "'Syne', sans-serif", overflow: 'hidden', fontSize: settings.fontSize }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        
        :root {
          --bg-base: #050505;
          --bg-panel: rgba(8,8,8,0.98);
          --text-main: #fff;
          --text-sec: #E4E4E7;
          --text-muted: #777;
          --border-light: rgba(255,255,255,0.05);
          --border-med: rgba(255,255,255,0.1);
          --bg-hover: rgba(255,255,255,0.04);
          --bg-input: rgba(14,14,14,0.95);
          --bg-user-msg: #161616;
          --bg-modal: #0c0c0c;
        }
        [data-theme="light"] {
          --bg-base: #f0f2f5;
          --bg-panel: rgba(255,255,255,0.98);
          --text-main: #111;
          --text-sec: #333;
          --text-muted: #555;
          --border-light: rgba(0,0,0,0.08);
          --border-med: rgba(0,0,0,0.15);
          --bg-hover: rgba(0,0,0,0.05);
          --bg-input: rgba(255,255,255,0.95);
          --bg-user-msg: #e4e6eb;
          --bg-modal: #ffffff;
        }

        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: var(--text-muted) transparent; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-med); border-radius: 4px; }
        textarea { scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
        .hover-row:hover { background: var(--bg-hover) !important; }
        input::placeholder, textarea::placeholder { color: var(--text-muted) !important; }
        input, textarea { color: var(--text-main) !important; }
        li::before { 
  content: "•"; 
  position: absolute; 
  left: 0; 
  color: #FFD93D; 
  font-weight: bold;
  font-size: 1.2em;
}
ol { margin: 16px 0; padding-left: 20px; }
ol li { margin-bottom: 8px; list-style-type: decimal; color: var(--text-sec); }
      `}</style>

      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 268, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}
          >
            {/* Logo */}
            <div style={{ padding: '18px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-light)' }}>
              <img src="/logo.png" alt="OMNI AI" style={{ width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255, 217, 61, 0.4))' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OMNI <span style={{ color: '#FFD93D' }}>AI</span></div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace" }}>AGGREGATOR PRO</div>
              </div>
            </div>

            {/* New Chat */}
            <div style={{ padding: '12px 12px 8px' }}>
              <button onClick={handleNewConversation}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,217,61,0.08)', color: '#FFD93D', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,217,61,0.15)', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,217,61,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,217,61,0.08)'}
              >
                <IC.Plus /> New conversation
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>⌘N</span>
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '0 12px 8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  value={sidebarSearch}
                  onChange={e => setSidebarSearch(e.target.value)}
                  placeholder="Search conversations…"
                  style={{ width: '100%', padding: '7px 10px 7px 32px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
                />
                <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <IC.Search />
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div style={{ padding: '0 12px 10px' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>CHAT MODE</div>
              <div style={{ display: 'flex', gap: 6, background: 'var(--bg-hover)', borderRadius: 8, padding: 3 }}>
                {[{ label: 'Single', icon: <IC.User />, val: false }, { label: 'Multi', icon: <IC.Columns />, val: true }].map(opt => (
                  <button key={String(opt.val)} onClick={() => setMultiChatMode(opt.val)}
                    style={{ flex: 1, padding: '6px 8px', background: isMultiChatMode === opt.val ? 'rgba(255,217,61,0.12)' : 'transparent', color: isMultiChatMode === opt.val ? '#FFD93D' : 'var(--text-muted)', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.15s' }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Models */}
            {isMultiChatMode && (
              <div style={{ padding: '0 12px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
                  ACTIVE MODELS ({activeModels.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {activeModels.map((m, i) => (
                    <div key={i} style={{ padding: '6px 8px', background: m.enabled ? 'var(--bg-hover)' : 'transparent', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, opacity: m.enabled ? 1 : 0.4, border: `1px solid ${m.enabled ? 'var(--border-light)' : 'transparent'}` }}>
                      <BrandLogo slug={m.slug} color={m.color} size={13} />
                      <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: m.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                      <button onClick={() => toggleModelEnabled(m.id, m.providerId)}
                        style={{ width: 20, height: 20, background: m.enabled ? 'rgba(74,222,128,0.15)' : 'var(--bg-hover)', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.enabled ? '#4ade80' : 'var(--text-muted)' }} />
                      </button>
                      {activeModels.length > 1 && (
                        <button onClick={() => removeModelFromChat(m.id, m.providerId)}
                          style={{ padding: 3, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <IC.X />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setShowModelSelector(true)}
                    style={{ padding: '6px 8px', background: 'transparent', border: '1px dashed var(--border-med)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FFD93D'; e.currentTarget.style.borderColor = 'rgba(255,217,61,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-med)'; }}
                  >
                    <IC.Plus /> Add model
                  </button>
                </div>
              </div>
            )}

            {/* Conversations */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
              {filteredConvs.pinned.length > 0 && (
                <>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", padding: '6px 8px 4px' }}>PINNED</div>
                  {filteredConvs.pinned.map(conv => (
                    <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id}
                      onSelect={() => setActiveConvId(conv.id)}
                      onPin={() => handlePinConversation(conv.id)}
                      onDelete={() => handleDeleteConversation(conv.id)}
                      onRename={() => { setRenamingConvId(conv.id); setRenameValue(conv.title); }}
                      renamingId={renamingConvId} renameValue={renameValue}
                      setRenameValue={setRenameValue}
                      onRenameSubmit={() => handleRenameConversation(conv.id, renameValue)}
                    />
                  ))}
                </>
              )}
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", padding: '6px 8px 4px' }}>RECENT</div>
              {filteredConvs.regular.length === 0 && (
                <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No conversations yet</div>
              )}
              {filteredConvs.regular.map(conv => (
                <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id}
                  onSelect={() => setActiveConvId(conv.id)}
                  onPin={() => handlePinConversation(conv.id)}
                  onDelete={() => handleDeleteConversation(conv.id)}
                  onRename={() => { setRenamingConvId(conv.id); setRenameValue(conv.title); }}
                  renamingId={renamingConvId} renameValue={renameValue}
                  setRenameValue={setRenameValue}
                  onRenameSubmit={() => handleRenameConversation(conv.id, renameValue)}
                />
              ))}
            </div>

            {/* Bottom Controls */}
            <div style={{ borderTop: '1px solid var(--border-light)', padding: '8px 12px' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {[
                  { icon: theme === 'dark' ? <IC.Sun /> : <IC.Moon />, action: () => setTheme(p => p === 'dark' ? 'light' : 'dark'), title: 'Toggle Theme' },
                  { icon: <IC.Template />, action: () => setShowPromptLibrary(true), title: 'Prompt Library' },
                  { icon: <IC.Brain />, action: () => setShowSystemPromptEditor(true), title: 'System Prompt' },
                  { icon: <IC.Keyboard />, action: () => setShowShortcuts(true), title: 'Shortcuts' },
                  { icon: <IC.Settings />, action: () => setShowSettings(true), title: 'Settings' },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} title={btn.title}
                    style={{ flex: 1, padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FFD93D'; e.currentTarget.style.background = 'rgba(255,217,61,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* User Profile */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#FFD93D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000' }}>
                    {userProfile.avatar ? <img src={userProfile.avatar} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userProfile.name.charAt(0)}
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-main)' }}>{userProfile.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Mono', monospace" }}>{userProfile.email}</div>
                  </div>
                </div>
                <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
                  title="Sign Out"
                  style={{ padding: 7, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  <IC.Logout />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          MAIN AREA
      ═══════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* HEADER */}
        <header style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'blur(12px)', flexShrink: 0, zIndex: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(p => !p)}
              style={{ padding: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <IC.Menu />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeModels.slice(0, isMultiChatMode ? activeModels.length : 1).map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', background: `${m.color}12`, border: `1px solid ${m.color}25`, borderRadius: 8 }}>
                  <BrandLogo slug={m.slug} color={m.color} size={13} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.name}</span>
                </div>
              ))}
              {isMultiChatMode && activeModels.length > 3 && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>+{activeModels.length - 3} more</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Token counter */}
            {settings.showTokens && totalTokens > 0 && (
              <div style={{ padding: '4px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: 6 }}>
                <IC.Zap />
                {totalTokens.toLocaleString()} tokens
              </div>
            )}

            {/* Consensus button */}
            {isMultiChatMode && activeModels.filter(m => m.enabled).length >= 2 && (
              <button onClick={generateConsensus}
                style={{ padding: '7px 14px', background: 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,107,107,0.15))', border: '1px solid rgba(255,217,61,0.3)', borderRadius: 10, color: '#FFD93D', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,217,61,0.2), rgba(255,107,107,0.2))'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,107,107,0.15))'}
              >
                <IC.Sparkles /> Synthesize
              </button>
            )}

            {/* Export */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowExportMenu(p => !p)}
                style={{ padding: '7px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <IC.Download /> Export
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 12, padding: 6, minWidth: 140, zIndex: 100, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                  >
                    {[{ fmt: 'md', label: '📝 Markdown', ext: '.md' }, { fmt: 'txt', label: '📄 Plain Text', ext: '.txt' }, { fmt: 'json', label: '🔧 JSON', ext: '.json' }].map(opt => (
                      <button key={opt.fmt} onClick={() => handleExport(opt.fmt)}
                        style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: 13, textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Model Selector */}
            <button onClick={() => setShowModelSelector(true)}
              style={{ padding: '7px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border-med)', borderRadius: 10, color: 'var(--text-main)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            >
              <IC.Grid /> Models
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>⌘K</span>
            </button>
          </div>
        </header>

        {/* CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {isMultiChatMode ? (
            /* ── MULTI CHAT ── */
            <div style={{ display: 'flex', width: '100%', overflowX: 'auto' }}>
              {activeModels.map((model, colIdx) => {
                const modelKey = `${model.providerId}-${model.id}`;
                const messages = getCurrentHistory(modelKey);
                return (
                  <div key={modelKey} style={{ flex: '0 0 380px', borderRight: colIdx < activeModels.length - 1 ? '1px solid var(--border-light)' : 'none', display: 'flex', flexDirection: 'column', opacity: model.enabled ? 1 : 0.35, pointerEvents: model.enabled ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                    {/* Column header */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: `${model.color}15`, border: `1px solid ${model.color}30`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BrandLogo slug={model.slug} color={model.color} size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: model.color }}>{model.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{model.type}</div>
                        </div>
                      </div>
                      <button onClick={() => toggleModelEnabled(model.id, model.providerId)}
                        style={{ padding: '3px 8px', background: model.enabled ? 'rgba(74,222,128,0.1)' : 'var(--bg-hover)', border: `1px solid ${model.enabled ? '#4ade8040' : 'var(--border-med)'}`, borderRadius: 6, color: model.enabled ? '#4ade80' : 'var(--text-muted)', cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: 'inherit' }}
                      >
                        {model.enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 14px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {messages.map(msg => (
                          <MessageBubble key={msg.id} msg={msg} model={model} userProfile={userProfile}
                            onCopy={handleCopyMessage} onRegenerate={handleRegenerate}
                            onEdit={m => setEditingMsg({ ...m, newContent: m.content })}
                            onDelete={handleDeleteMessage} onBookmark={handleBookmarkMessage}
                            onReact={handleReactMessage} isCompact={true}
                          />
                        ))}
                        <div ref={el => chatEndRefs.current[modelKey] = el} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── SINGLE CHAT ── */
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 160px' }}>
              <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
                {/* Welcome screen */}
                {(getCurrentHistory(`${activeModels[0]?.providerId}-${activeModels[0]?.id}`).length === 0) && (
                  <WelcomeScreen model={activeModels[0]} onPrompt={text => { setInput(text); inputRef.current?.focus(); }} />
                )}
                {getCurrentHistory(`${activeModels[0]?.providerId}-${activeModels[0]?.id}`).map(msg => (
                  <MessageBubble key={msg.id} msg={msg} model={activeModels[0]} userProfile={userProfile}
                    onCopy={handleCopyMessage} onRegenerate={handleRegenerate}
                    onEdit={m => setEditingMsg({ ...m, newContent: m.content })}
                    onDelete={handleDeleteMessage} onBookmark={handleBookmarkMessage}
                    onReact={handleReactMessage}
                  />
                ))}
                <div ref={el => chatEndRefs.current['single'] = el} />
              </div>
            </div>
          )}
        </div>

        {/* ─── INPUT AREA ─── */}
        <div style={{ flexShrink: 0, padding: '12px 16px 20px' }}>
          <div style={{ maxWidth: isMultiChatMode ? '100%' : 780, margin: '0 auto' }}>

            {/* Edit mode banner */}
            <AnimatePresence>
              {editingMsg && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.2)', borderRadius: '10px 10px 0 0', marginBottom: -1, fontSize: 12, color: '#FFD93D' }}
                >
                  <IC.Edit /> Editing message
                  <button onClick={() => setEditingMsg(null)}
                    style={{ marginLeft: 'auto', padding: 4, background: 'none', border: 'none', color: '#FFD93D', cursor: 'pointer', display: 'flex' }}
                  >
                    <IC.X />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image preview */}
            <AnimatePresence>
              {uploadedImage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ padding: '8px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: '10px 10px 0 0', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <img src={uploadedImage} alt="Upload preview" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 6 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Image attached</span>
                  <button onClick={() => setUploadedImage(null)}
                    style={{ marginLeft: 'auto', padding: 4, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
                  >
                    <IC.X />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main input */}
            <div style={{ background: 'var(--bg-input)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-med)', borderRadius: editingMsg || uploadedImage ? '0 0 16px 16px' : 16, padding: '8px 10px 8px 14px', display: 'flex', alignItems: 'flex-end', gap: 8, boxShadow: theme === 'dark' ? '0 -4px 30px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)' : '0 -4px 30px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.05)' }}>

              {/* Left actions */}
              <div style={{ display: 'flex', gap: 2, paddingBottom: 4 }}>
                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) { const r = new FileReader(); r.onload = ev => setUploadedImage(ev.target.result); r.readAsDataURL(file); }
                  }}
                />
                <button onClick={() => fileInputRef.current?.click()} title="Upload image"
                  style={{ padding: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 8, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFD93D'; e.currentTarget.style.background = 'rgba(255,217,61,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                >
                  <IC.Image />
                </button>
                <button onClick={() => setShowPromptLibrary(true)} title="Prompt templates"
                  style={{ padding: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 8, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFD93D'; e.currentTarget.style.background = 'rgba(255,217,61,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
                >
                  <IC.Template />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={editingMsg ? editingMsg.newContent : input}
                onChange={e => editingMsg ? setEditingMsg(p => ({ ...p, newContent: e.target.value })) : setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && settings.sendOnEnter) { e.preventDefault(); handleSend(e); }
                  if (e.key === 'ArrowUp' && !input && !editingMsg) {
                    const key = `${activeModels[0]?.providerId}-${activeModels[0]?.id}`;
                    const msgs = getCurrentHistory(key);
                    const lastUser = [...msgs].reverse().find(m => m.role === 'user');
                    if (lastUser) setEditingMsg({ ...lastUser, newContent: lastUser.content });
                  }
                }}
                placeholder={isRecording ? '🎙️ Listening…' : `Message ${isMultiChatMode ? `${activeModels.filter(m => m.enabled).length} models` : activeModels[0]?.name}… (⇧↵ for new line)`}
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: settings.fontSize, padding: '10px 0', resize: 'none', outline: 'none', fontFamily: "'Inter', sans-serif", lineHeight: 1.6, maxHeight: 180, overflowY: 'auto' }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
                }}
              />

              {/* Char counter */}
              {(editingMsg ? editingMsg.newContent : input).length > 100 && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", paddingBottom: 12, flexShrink: 0 }}>
                  {(editingMsg ? editingMsg.newContent : input).length}
                </div>
              )}

              {/* Right actions */}
              <div style={{ display: 'flex', gap: 2, paddingBottom: 4 }}>
                <button onClick={() => setIsRecording(p => !p)} title="Voice input"
                  style={{ padding: 8, background: isRecording ? 'rgba(239,68,68,0.15)' : 'none', border: 'none', color: isRecording ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 8, transition: 'all 0.15s' }}
                  onMouseEnter={e => !isRecording && (e.currentTarget.style.color = '#FFD93D', e.currentTarget.style.background = 'rgba(255,217,61,0.08)')}
                  onMouseLeave={e => !isRecording && (e.currentTarget.style.color = 'var(--text-muted)', e.currentTarget.style.background = 'none')}
                >
                  <IC.Mic />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!(editingMsg ? editingMsg.newContent : input).trim() && !uploadedImage}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: (editingMsg ? editingMsg.newContent : input).trim() || uploadedImage
                      ? 'linear-gradient(135deg, #FFD93D, #FF8C42)'
                      : 'var(--bg-hover)',
                    border: 'none', cursor: (editingMsg ? editingMsg.newContent : input).trim() ? 'pointer' : 'not-allowed',
                    color: (editingMsg ? editingMsg.newContent : input).trim() || uploadedImage ? '#000' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
                  }}
                >
                  <IC.Send />
                </button>
              </div>
            </div>

            {/* Input footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: '🌡️', label: `Temp: ${settings.temperature}` },
                  { icon: '📏', label: `Max: ${settings.maxTokens === 16384 ? 'No Limit' : settings.maxTokens}` },
                  { icon: settings.streamingEnabled ? '⚡' : '⏸', label: settings.streamingEnabled ? 'Streaming' : 'Batch' },
                ].map((item, i) => (
                  <button key={i} onClick={() => setShowSettings(true)}
                    style={{ fontSize: 10, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: 4, padding: 0, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                {settings.sendOnEnter ? '↵ to send' : '⌘↵ to send'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════ */}

      {/* MODEL SELECTOR */}
      <AnimatePresence>
        {showModelSelector && (
          <ModalOverlay onClose={() => setShowModelSelector(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 20, width: '92vw', maxWidth: 980, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
            >
              {/* Header */}
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>AI Model Library</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                      {PROVIDERS.reduce((a, p) => a + p.models.length, 0)} models from {PROVIDERS.length} providers
                    </p>
                  </div>
                  <button onClick={() => setShowModelSelector(false)}
                    style={{ padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                  >
                    <IC.X />
                  </button>
                </div>
                {/* Search */}
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <input
                    autoFocus value={modelSearch} onChange={e => setModelSearch(e.target.value)}
                    placeholder="Search models, providers, capabilities…"
                    style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,217,61,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                  />
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <IC.Search />
                  </div>
                  {modelSearch && (
                    <button onClick={() => setModelSearch('')}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                    >
                      <IC.X />
                    </button>
                  )}
                </div>
                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      style={{ padding: '6px 14px', background: selectedCategory === cat.id ? 'rgba(255,217,61,0.12)' : 'var(--bg-hover)', color: selectedCategory === cat.id ? '#FFD93D' : 'var(--text-muted)', border: selectedCategory === cat.id ? '1px solid rgba(255,217,61,0.25)' : '1px solid var(--border-light)', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s', flexShrink: 0 }}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
                {filteredProviders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>No models match your search</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Try adjusting filters or search terms</div>
                  </div>
                ) : (
                  filteredProviders.map(provider => (
                    <div key={provider.id} style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <BrandLogo slug={provider.slug} color={provider.color} size={18} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: provider.color }}>{provider.name}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 10, fontFamily: "'DM Mono', monospace" }}>
                          {provider.models.length} model{provider.models.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                        {provider.models.map(model => {
                          const isActive = activeModels.some(m => m.id === model.id && m.providerId === provider.id);
                          const favKey = `${provider.id}-${model.id}`;
                          const isFav = favoriteModels.includes(favKey);
                          return (
                            <div key={model.id}
                              onClick={() => isMultiChatMode ? addModelToChat(model, provider) : (setActiveModels([{ ...model, providerName: provider.name, providerId: provider.id, slug: provider.slug, color: provider.color, enabled: true }]), setShowModelSelector(false))}
                              style={{ padding: '14px 14px 12px', background: isActive ? `${provider.color}0d` : 'var(--bg-hover)', border: `1px solid ${isActive ? provider.color + '35' : 'var(--border-light)'}`, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'all 0.15s' }}
                              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = `${provider.color}50`; } }}
                              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border-light)'; } }}
                            >
                              {model.premium && (
                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg, #FFD93D, #FF8C42)', padding: '1px 7px', borderRadius: 6, fontSize: 9, fontWeight: 800, color: '#000', letterSpacing: '0.04em' }}>PRO</div>
                              )}
                              <button
                                onClick={e => { e.stopPropagation(); toggleFavorite(favKey); }}
                                style={{ position: 'absolute', top: 8, left: 10, padding: 2, background: 'none', border: 'none', cursor: 'pointer', color: isFav ? '#FFD93D' : 'var(--text-muted)', fontSize: 13, transition: 'color 0.15s' }}
                              >
                                {isFav ? '★' : '☆'}
                              </button>
                              <div style={{ marginTop: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{model.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{model.type}</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>{model.contextWindow}</span>
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>{model.speed}</span>
                                </div>
                              </div>
                              {isActive && (
                                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4ade80', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                                  <IC.Check /> Active
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <ModalOverlay onClose={() => setShowSettings(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 20, width: '90vw', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
            >
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Settings</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>Customize your experience</p>
                </div>
                <button onClick={() => setShowSettings(false)} style={{ padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <IC.X />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
                {[
                  {
                    section: 'Generation', items: [
                      { label: 'Temperature', desc: 'Controls randomness (0 = deterministic, 1 = creative)', type: 'slider', key: 'temperature', min: 0, max: 1, step: 0.1 },
                      { label: 'Max Tokens', desc: 'Maximum response length (Full right for No Limit)', type: 'slider', key: 'maxTokens', min: 256, max: 16384, step: 256 },
                      { label: 'Streaming', desc: 'Show responses word by word as they generate', type: 'toggle', key: 'streamingEnabled' },
                    ]
                  },
                  {
                    section: 'Interface', items: [
                      { label: 'Font Size', desc: 'Text size in the chat', type: 'slider', key: 'fontSize', min: 12, max: 18, step: 1 },
                      { label: 'Compact Mode', desc: 'Reduce spacing for denser chat view', type: 'toggle', key: 'compactMode' },
                      { label: 'Show Timestamps', desc: 'Display time on each message', type: 'toggle', key: 'showTimestamps' },
                      { label: 'Token Counter', desc: 'Show estimated token usage', type: 'toggle', key: 'showTokens' },
                    ]
                  },
                  {
                    section: 'Behavior', items: [
                      { label: 'Send on Enter', desc: 'Press Enter to send (Shift+Enter for new line)', type: 'toggle', key: 'sendOnEnter' },
                      { label: 'Auto-title', desc: 'Automatically name conversations from first message', type: 'toggle', key: 'autoTitle' },
                    ]
                  },
                ].map(group => (
                  <div key={group.section} style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>{group.section.toUpperCase()}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {group.items.map(item => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-hover)', borderRadius: 10, gap: 16 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                          </div>
                          {item.type === 'toggle' ? (
                            <button onClick={() => setSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                              style={{ width: 40, height: 22, background: settings[item.key] ? '#FFD93D' : 'var(--border-med)', border: 'none', borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
                            >
                              <div style={{ width: 16, height: 16, background: settings[item.key] ? '#000' : 'var(--text-muted)', borderRadius: '50%', position: 'absolute', top: 3, left: settings[item.key] ? 21 : 3, transition: 'left 0.2s' }} />
                            </button>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              <input type="range" min={item.min} max={item.max} step={item.step} value={settings[item.key]}
                                onChange={e => setSettings(p => ({ ...p, [item.key]: parseFloat(e.target.value) }))}
                                style={{ width: 90, accentColor: '#FFD93D' }}
                              />
                              <span style={{ fontSize: 12, color: '#FFD93D', fontFamily: "'DM Mono', monospace", minWidth: 36, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {item.key === 'maxTokens' && settings[item.key] === 16384 ? 'No Limit' : settings[item.key]}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button onClick={() => { setSettings({ fontSize: 14, streamingEnabled: true, showTokens: true, sendOnEnter: true, compactMode: false, soundEnabled: false, systemPrompt: '', temperature: 0.7, maxTokens: 2048, autoTitle: true, showTimestamps: true }); addToast('Settings reset to defaults', 'info'); }}
                  style={{ padding: '10px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* PROMPT LIBRARY MODAL */}
      <AnimatePresence>
        {showPromptLibrary && (
          <ModalOverlay onClose={() => setShowPromptLibrary(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 20, width: '90vw', maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
            >
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Prompt Library</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>Quick-start templates for common tasks</p>
                </div>
                <button onClick={() => setShowPromptLibrary(false)} style={{ padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <IC.X />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, alignContent: 'start' }}>
                {PROMPT_TEMPLATES.map(tpl => (
                  <button key={tpl.id}
                    onClick={() => { setInput(tpl.text); setShowPromptLibrary(false); inputRef.current?.focus(); }}
                    style={{ padding: '14px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,217,61,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,217,61,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{tpl.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{tpl.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {tpl.text}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* SYSTEM PROMPT EDITOR */}
      <AnimatePresence>
        {showSystemPromptEditor && (
          <ModalOverlay onClose={() => setShowSystemPromptEditor(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 20, width: '90vw', maxWidth: 620, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
            >
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>System Prompt</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>Define AI behavior and persona for this session</p>
                </div>
                <button onClick={() => setShowSystemPromptEditor(false)} style={{ padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <IC.X />
                </button>
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Quick presets:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {[
                    { label: 'Assistant', prompt: 'You are a helpful, harmless, and honest AI assistant.' },
                    { label: 'Coder', prompt: 'You are an expert software engineer. Write clean, efficient, well-documented code. Always explain your reasoning.' },
                    { label: 'Writer', prompt: 'You are a professional writer with expertise in clarity, creativity, and compelling storytelling.' },
                    { label: 'Analyst', prompt: 'You are a meticulous data analyst. Provide structured, evidence-based insights with clear reasoning.' },
                  ].map(preset => (
                    <button key={preset.label}
                      onClick={() => setSettings(p => ({ ...p, systemPrompt: preset.prompt }))}
                      style={{ padding: '5px 12px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,217,61,0.1)'; e.currentTarget.style.color = '#FFD93D'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={settings.systemPrompt}
                  onChange={e => setSettings(p => ({ ...p, systemPrompt: e.target.value }))}
                  placeholder="You are a helpful AI assistant..."
                  rows={8}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 12, fontSize: 13, color: 'var(--text-main)', fontFamily: "'DM Mono', monospace", lineHeight: 1.6, outline: 'none', resize: 'vertical', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,217,61,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{settings.systemPrompt.length} chars</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setSettings(p => ({ ...p, systemPrompt: '' }))}
                      style={{ padding: '8px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                    >Clear</button>
                    <button onClick={() => { setShowSystemPromptEditor(false); addToast('System prompt saved', 'success'); }}
                      style={{ padding: '8px 20px', background: 'rgba(255,217,61,0.15)', border: '1px solid rgba(255,217,61,0.3)', borderRadius: 10, color: '#FFD93D', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                    >Save</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS MODAL */}
      <AnimatePresence>
        {showShortcuts && (
          <ModalOverlay onClose={() => setShowShortcuts(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-med)', borderRadius: 20, width: '90vw', maxWidth: 440, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)' }}
            >
              <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)' }}>Keyboard Shortcuts</h2>
                <button onClick={() => setShowShortcuts(false)} style={{ padding: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <IC.X />
                </button>
              </div>
              <div style={{ padding: '12px 24px 24px' }}>
                {KEYBOARD_SHORTCUTS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < KEYBOARD_SHORTCUTS.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.description}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {s.keys.map((k, ki) => (
                        <span key={ki} style={{ padding: '3px 8px', background: 'var(--bg-hover)', border: '1px solid var(--border-med)', borderRadius: 6, fontSize: 11, color: '#FFD93D', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{k}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATIONS */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HELPER COMPONENTS
══════════════════════════════════════════════════════════ */

function ModalOverlay({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
    >
      {children}
    </motion.div>
  );
}

function ConvItem({ conv, isActive, onSelect, onPin, onDelete, onRename, renamingId, renameValue, setRenameValue, onRenameSubmit }) {
  const [hover, setHover] = useState(false);
  const isRenaming = renamingId === conv.id;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: '8px 10px', borderRadius: 8, background: isActive ? 'rgba(255,217,61,0.07)' : hover ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2, border: isActive ? '1px solid rgba(255,217,61,0.15)' : '1px solid transparent', transition: 'all 0.12s' }}
      onClick={onSelect}
    >
      {isRenaming ? (
        <input
          autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
          onBlur={onRenameSubmit}
          onKeyDown={e => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') setRenameValue(conv.title); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'var(--bg-hover)', border: '1px solid rgba(255,217,61,0.4)', borderRadius: 6, padding: '3px 8px', fontSize: 12, color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' }}
        />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 500, color: isActive ? '#FFD93D' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.pinned && <span style={{ marginRight: 4, fontSize: 10 }}>📌</span>}
              {conv.title}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace", marginTop: 1, opacity: 0.8 }}>
              {formatTime(conv.updatedAt)}
            </div>
          </div>
          {hover && (
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <button onClick={onRename} title="Rename" style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 5 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><IC.Edit /></button>
              <button onClick={onPin} title={conv.pinned ? 'Unpin' : 'Pin'} style={{ padding: 4, background: 'none', border: 'none', color: conv.pinned ? '#FFD93D' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 5 }} onMouseEnter={e => e.currentTarget.style.color = '#FFD93D'} onMouseLeave={e => e.currentTarget.style.color = conv.pinned ? '#FFD93D' : 'var(--text-muted)'}><IC.Pin /></button>
              <button onClick={onDelete} title="Delete" style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', borderRadius: 5 }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><IC.Trash /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WelcomeScreen({ model, onPrompt }) {
  const suggestions = [
    { icon: '💡', text: 'Explain quantum computing simply' },
    { icon: '💻', text: 'Write a Python web scraper' },
    { icon: '✍️', text: 'Draft a professional email' },
    { icon: '🔬', text: 'Analyze pros and cons of React vs Vue' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
      <div style={{ width: 56, height: 56, background: model ? `${model.color}18` : 'rgba(255,217,61,0.05)', border: `1px solid ${model ? model.color + '30' : 'var(--border-med)'}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', overflow: 'hidden' }}>
        {model?.slug
          ? <BrandLogo slug={model.slug} color={model.color} size={26} />
          : <img src="/logo.png" alt="Omni AI" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
        }
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
        {model ? `Chat with ${model.name}` : 'Start a Conversation'}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 36px', fontFamily: "'DM Mono', monospace" }}>
        {model ? `${model.providerName} · ${model.type} · ${model.contextWindow} context` : 'Select a model to begin'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 520, margin: '0 auto' }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onPrompt(s.text)}
            style={{ padding: '14px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.borderColor = 'var(--border-med)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
} 