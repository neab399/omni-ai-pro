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
    ]
  },
  {
    id: 'anthropic', name: 'Anthropic', slug: 'anthropic', color: '#e8a85f',
    models: [
      { id: 'claude-opus-4', name: 'Claude Opus 4', type: 'Deep Thinking', category: 'thinking', premium: true, contextWindow: '200K', speed: 'Slow' },
      { id: 'claude-sonnet-3.5', name: 'Claude 3.5 Sonnet', type: 'Creative Writing', category: 'document', premium: false, contextWindow: '200K', speed: 'Fast' },
    ]
  },
  {
    id: 'google', name: 'Google', slug: 'googlegemini', color: '#4285f4',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', type: 'Latest & Fastest', category: 'thinking', premium: true, contextWindow: '1M', speed: 'Very Fast' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: '2M Context Window', category: 'thinking', premium: true, contextWindow: '2M', speed: 'Medium' },
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
    id: 'meta', name: 'Meta', slug: 'meta', color: '#0081fb',
    models: [
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', type: 'Open Source Leader', category: 'thinking', premium: false, contextWindow: '128K', speed: 'Fast' },
    ]
  }
];

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const IC = {
  Menu: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Plus: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Send: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Mic: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>,
  User: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  X: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Copy: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  Trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Pin: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v5M9 8h6M9 12h6M15 2H9a1 1 0 0 0-1 1v1.586a1 1 0 0 0 .293.707l1.414 1.414A1 1 0 0 1 10 7.5V8h4v-.5a1 1 0 0 1 .293-.707l1.414-1.414A1 1 0 0 0 16 4.586V3a1 1 0 0 0-1-1z"/></svg>,
  Edit: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Settings: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Sun: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ArrowRight: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const genId = () => Math.random().toString(36).slice(2, 9);
const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const estimateTokens = (text) => Math.ceil(text.length / 4);

const parseMarkdown = (text) => {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block" style="background:var(--bg-modal);border:1px solid var(--border-med);border-radius:8px;margin:16px 0;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-panel);border-bottom:1px solid var(--border-light);">
          <span style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;">${lang || 'code'}</span>
        </div>
        <pre style="margin:0;padding:12px;overflow-x:auto;font-size:13px;line-height:1.5;color:var(--text-sec);">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>`
    )
    .replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`)
    .split(/\n\n+/).map(para => `<p style="margin-bottom:12px; margin-top:0; line-height:1.6;">${para.replace(/\n/g, '<br/>')}</p>`).join('');
};

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '6px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOAST COMPONENT (FIXED)
══════════════════════════════════════════════════════════ */
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={() => removeToast(t.id)}
            style={{
              padding: '10px 16px', background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: '8px', 
              color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <span style={{ color: t.type === 'error' ? '#ef4444' : '#10b981' }}>●</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════════════════ */
function MessageBubble({ msg, model, userProfile, onCopy, onDelete, isCompact }) {
  const [showActions, setShowActions] = useState(false);
  const isUser = msg.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
      style={{ display: 'flex', gap: 12, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative' }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 6, background: isUser ? 'var(--text-main)' : 'var(--bg-hover)', border: `1px solid var(--border-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--bg-base)' }}>
        {isUser ? (userProfile?.avatar ? <img src={userProfile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IC.User />) : (model?.slug ? <BrandLogo slug={model.slug} color={model.color} size={16} /> : <img src="/logo.png" alt="AI" style={{ width: 16 }} />)}
      </div>

      <div style={{ maxWidth: isCompact ? '90%' : '85%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!isUser && model && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{model.name}</span>
          </div>
        )}

        <div style={{ background: isUser ? 'var(--bg-hover)' : 'transparent', border: isUser ? '1px solid var(--border-light)' : 'none', padding: isUser ? '10px 14px' : '4px 0', borderRadius: isUser ? '12px' : 0, color: 'var(--text-sec)', fontSize: 14.5 }}>
          {msg.isStreaming ? <TypingIndicator /> : <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />}
        </div>
      </div>

      <AnimatePresence>
        {showActions && !msg.isStreaming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: -12, [isUser ? 'left' : 'right']: 0, display: 'flex', gap: 4, background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 8, padding: '4px', zIndex: 10 }}>
            <button onClick={() => onCopy(msg.content)} style={{ padding: '4px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.Copy /></button>
            <button onClick={() => onDelete(msg.id)} style={{ padding: '4px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><IC.Trash /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR CONVERSATION ITEM (FIXED)
══════════════════════════════════════════════════════════ */
function ConvItem({ conv, isActive, onSelect, onPin, onDelete, onRename, renamingId, renameValue, setRenameValue, onRenameSubmit }) {
  const [hover, setHover] = useState(false);
  const isRenaming = renamingId === conv.id;

  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onSelect}
      style={{ padding: '10px 12px', borderRadius: '8px', background: isActive ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px', border: isActive ? '1px solid var(--border-light)' : '1px solid transparent' }}
    >
      {isRenaming ? (
        <input
          autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={onRenameSubmit}
          onKeyDown={(e) => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') setRenameValue(conv.title); }}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1, background: 'var(--bg-base)', border: '1px solid var(--text-muted)', borderRadius: '4px', padding: '2px 6px', fontSize: '13px', color: 'var(--text-main)', outline: 'none' }}
        />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {conv.pinned && <span style={{ fontSize: '10px' }}>📌</span>}
            <div style={{ fontSize: '13px', fontWeight: isActive ? '600' : '400', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{conv.title}</div>
          </div>
          {(hover || isActive) && (
            <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={onPin} title="Pin" style={{ background: 'none', border: 'none', color: conv.pinned ? '#FFD93D' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}><IC.Pin /></button>
              <button onClick={onRename} title="Rename" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}><IC.Edit /></button>
              <button onClick={onDelete} title="Delete" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}><IC.Trash /></button>
            </div>
          )}
        </>
      )}
    </div>
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
  const [userProfile, setUserProfile] = useState({ name: 'Omni User', email: '', avatar: null });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMultiChatMode, setMultiChatMode] = useState(false);
  const [input, setInput] = useState('');

  /* ── Model State ── */
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [activeModels, setActiveModels] = useState([{ ...PROVIDERS.find(p => p.id === 'meta').models[0], providerId: 'meta', slug: 'meta', color: '#0081fb' }]);

  /* ── Conversations ── */
  const [conversations, setConversations] = useState([{ id: 'default', title: 'New Conversation', createdAt: Date.now(), pinned: false }]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [renamingConvId, setRenamingConvId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [chatHistories, setChatHistories] = useState({ default: {} });

  /* ── UI State ── */
  const [toasts, setToasts] = useState([]);
  const chatEndRefs = useRef({});
  const inputRef = useRef(null);

  /* ── Theme Global Effect ── */
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Toast Helper (FIXED) ── */
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
      if (!error && data?.length > 0) {
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

  const saveChatToDB = async (convId, title, currentHistory, isPinned) => {
    if (!currentUser) return;
    await supabase.from('chats').upsert({ id: convId, user_id: currentUser.id, title: title, history: currentHistory, pinned: isPinned, updated_at: Date.now() });
  };

  useEffect(() => { Object.values(chatEndRefs.current).forEach(ref => ref?.scrollIntoView({ behavior: 'smooth' })); }, [chatHistories]);

  /* ── Init Models ── */
  useEffect(() => {
    activeModels.forEach(model => {
      const modelKey = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[modelKey]) {
        setChatHistories(prev => ({ ...prev, [activeConvId]: { ...(prev[activeConvId] || {}), [modelKey]: [{ id: genId(), role: 'assistant', content: `Hello! I'm **${model.name}**. How can I assist you today?`, model: model, timestamp: Date.now() }] } }));
      }
    });
  }, [activeModels, activeConvId, chatHistories]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const getCurrentHistory = useCallback((modelKey) => chatHistories[activeConvId]?.[modelKey] || [], [chatHistories, activeConvId]);

  /* ── Sidebar Actions ── */
  const handleNewConversation = () => {
    const id = genId();
    setConversations(p => [{ id, title: 'New Conversation', createdAt: Date.now(), pinned: false }, ...p]);
    setChatHistories(p => ({ ...p, [id]: {} }));
    setActiveConvId(id);
    setMultiChatMode(false);
    inputRef.current?.focus();
  };

  const handleDeleteConversation = async (id) => {
    setConversations(p => p.filter(c => c.id !== id));
    setChatHistories(p => { const n = { ...p }; delete n[id]; return n; });
    if (currentUser) await supabase.from('chats').delete().eq('id', id);
    if (activeConvId === id) handleNewConversation();
    addToast('Chat deleted', 'info');
  };

  const handlePinConversation = (id) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const handleRenameConversation = (id, newTitle) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, title: newTitle } : c));
    setRenamingConvId(null);
  };

  /* ── Multi-Model Controls ── */
  const addModelToChat = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (!activeModels.find(x => x.id === model.id && x.providerId === provider.id)) setActiveModels(p => [...p, m]);
    if (!isMultiChatMode) setShowModelSelector(false);
  };

  const removeModelFromChat = (modelId, providerId) => {
    if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
    setActiveModels(p => p.filter(m => !(m.id === modelId && m.providerId === providerId)));
  };

  const continueWithSingleModel = (model) => {
    setActiveModels([model]);
    setMultiChatMode(false);
    addToast(`Continued with ${model.name}`, 'success');
  };

  /* ── Send Message ── */
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
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

    if (activeConv?.title === 'New Conversation') {
      const newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      setConversations(p => p.map(c => c.id === activeConvId ? { ...c, title: newTitle } : c));
    }

    activeModels.forEach(async (model) => {
      const key = `${model.providerId}-${model.id}`;
      const streamId = genId();
      setChatHistories(prev => ({ ...prev, [activeConvId]: { ...prev[activeConvId], [key]: [...prev[activeConvId][key], { id: streamId, role: 'assistant', content: '', isStreaming: true, model }] } }));

      try {
        const response = await fetch('https://omni-ai-pro.onrender.com/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistories[activeConvId][key].filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content })).concat({ role: 'user', content: text }), providerId: model.providerId, modelId: model.id })
        });

        if (!response.ok) throw new Error("API Error");
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
                const data = JSON.parse(chunk.replace('data: ', ''));
                if (data.type === 'chunk') {
                  reply += data.text;
                  setChatHistories(prev => {
                    const msgs = [...prev[activeConvId][key]];
                    const idx = msgs.findIndex(m => m.id === streamId);
                    if (idx > -1) msgs[idx] = { ...msgs[idx], content: reply };
                    return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
                  });
                }
              } catch (e) {}
            }
          }
        }
        setChatHistories(prev => {
          const msgs = [...prev[activeConvId][key]];
          const idx = msgs.findIndex(m => m.id === streamId);
          if (idx > -1) msgs[idx] = { ...msgs[idx], isStreaming: false };
          saveChatToDB(activeConvId, activeConv?.title, { ...prev[activeConvId], [key]: msgs }, activeConv?.pinned);
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
      } catch (err) {
        setChatHistories(prev => {
          const msgs = [...prev[activeConvId][key]];
          const idx = msgs.findIndex(m => m.id === streamId);
          if (idx > -1) msgs[idx] = { ...msgs[idx], content: `❌ Error: ${err.message}`, isStreaming: false };
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
      }
    });
  };

  const handleDeleteMsg = (msgId) => {
    setChatHistories(prev => {
      const conv = { ...prev[activeConvId] };
      Object.keys(conv).forEach(k => conv[k] = conv[k].filter(m => m.id !== msgId));
      return { ...prev, [activeConvId]: conv };
    });
    addToast('Message deleted');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <style>{`
        :root[data-theme="dark"] { --bg-base: #000000; --bg-panel: #0a0a0a; --text-main: #ffffff; --text-sec: #e0e0e0; --text-muted: #888; --border-light: #1f1f1f; --border-med: #2a2a2a; --bg-hover: #141414; --bg-input: #111111; }
        :root[data-theme="light"] { --bg-base: #ffffff; --bg-panel: #fcfcfc; --text-main: #000000; --text-sec: #333333; --text-muted: #666; --border-light: #eee; --border-med: #ddd; --bg-hover: #f5f5f5; --bg-input: #f9f9f9; }
        * { box-sizing: border-box; }
        .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--border-med); border-radius: 10px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      {isSidebarOpen && (
        <aside style={{ width: 260, borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="OMNI" style={{ width: 24 }} /> OMNI AI PRO
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <button onClick={handleNewConversation} style={{ width: '100%', padding: '10px', background: 'var(--text-main)', color: 'var(--bg-base)', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><IC.Plus /> New Chat</button>
          </div>
          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '8px 4px' }}>CHATS</div>
            {conversations.filter(c => c.pinned).map(conv => (
              <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => setActiveConvId(conv.id)} onPin={() => handlePinConversation(conv.id)} onDelete={() => handleDeleteConversation(conv.id)} onRename={() => { setRenamingConvId(conv.id); setRenameValue(conv.title); }} renamingId={renamingConvId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConversation(conv.id, renameValue)} />
            ))}
            {conversations.filter(c => !c.pinned).map(conv => (
              <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => setActiveConvId(conv.id)} onPin={() => handlePinConversation(conv.id)} onDelete={() => handleDeleteConversation(conv.id)} onRename={() => { setRenamingConvId(conv.id); setRenameValue(conv.title); }} renamingId={renamingConvId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConversation(conv.id, renameValue)} />
            ))}
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--text-muted)', color: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userProfile.name[0]}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{userProfile.name}</div>
             </div>
             <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>{theme === 'dark' ? <IC.Sun /> : <IC.Moon />}</button>
          </div>
        </aside>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Header */}
        <header style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border-light)' }}>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.Menu /></button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setMultiChatMode(!isMultiChatMode)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', fontSize: 13, cursor: 'pointer', color: 'var(--text-main)', fontWeight: 500 }}>
              {isMultiChatMode ? 'Single Mode' : 'Multi-Model'}
            </button>
            <button onClick={() => setShowModelSelector(true)} style={{ padding: '6px 12px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border-med)', fontSize: 13, cursor: 'pointer', color: 'var(--text-main)' }}>+ Add AI</button>
          </div>
        </header>

        {/* ── CHAT VIEW (FIXED SCROLL) ── */}
        <div className="custom-scroll" style={{ flex: 1, display: 'flex', overflowX: isMultiChatMode ? 'auto' : 'hidden', overflowY: 'hidden', background: 'var(--bg-base)' }}>
          {isMultiChatMode ? (
            <div style={{ display: 'flex', height: '100%' }}>
              {activeModels.map((model, idx) => {
                const modelKey = `${model.providerId}-${model.id}`;
                return (
                <div key={idx} style={{ width: 420, borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                  <div style={{ padding: '12px 16px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: model.color }}>{model.name}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => continueWithSingleModel(model)} style={{ padding: '4px 8px', fontSize: 11, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-main)' }}>Continue <IC.ArrowRight /></button>
                      <button onClick={() => removeModelFromChat(model.id, model.providerId)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.X /></button>
                    </div>
                  </div>
                  <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {getCurrentHistory(modelKey).map(msg => <MessageBubble key={msg.id} msg={msg} model={model} userProfile={userProfile} onCopy={(txt) => { navigator.clipboard.writeText(txt); addToast('Copied'); }} onDelete={handleDeleteMsg} isCompact />)}
                      <div ref={el => chatEndRefs.current[modelKey] = el} />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
               <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {getCurrentHistory(`${activeModels[0]?.providerId}-${activeModels[0]?.id}`).map(msg => <MessageBubble key={msg.id} msg={msg} model={activeModels[0]} userProfile={userProfile} onCopy={(txt) => { navigator.clipboard.writeText(txt); addToast('Copied'); }} onDelete={handleDeleteMsg} />)}
                  <div ref={el => chatEndRefs.current['single'] = el} />
               </div>
            </div>
          )}
        </div>

        {/* ── FLOATING INPUT BOX ── */}
        <div style={{ padding: '20px 0 30px', background: 'var(--bg-base)' }}>
          <div style={{ maxWidth: isMultiChatMode ? '95%' : 760, margin: '0 auto', background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: '16px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <button style={{ padding: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><IC.Plus /></button>
            <textarea
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isMultiChatMode ? `Ask ${activeModels.length} models...` : `Message ${activeModels[0]?.name}...`}
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', maxHeight: '200px', resize: 'none', padding: '8px 0', color: 'var(--text-main)', lineHeight: 1.5 }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
            />
            <button onClick={handleSend} disabled={!input.trim()} style={{ padding: '8px 12px', borderRadius: '10px', background: input.trim() ? 'var(--text-main)' : 'transparent', color: input.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
              <IC.Send />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>OMNI AI PRO can make mistakes. Verify important information.</div>
        </div>
      </main>

      {/* Model Selector Modal */}
      <AnimatePresence>
        {showModelSelector && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
             <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: 12, width: '90%', maxWidth: 800, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>Select AI Model</h3>
                    <button onClick={() => setShowModelSelector(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><IC.X /></button>
                </div>
                <div className="custom-scroll" style={{ padding: 20, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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