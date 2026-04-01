import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

/* ── Supabase ─────────────────────────────────────────── */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* ── Data / constants ─────────────────────────────────── */
import {
  TEXT_PROVIDERS, ALL_TEXT_MODELS,
  genId, GLOBAL_STYLES, IC,
} from '../lib/models';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000');

/* ── Extracted components ─────────────────────────────── */
import { Toast, BrandLogo, ModelAvatar } from '../components/chat/ChatUIKit';
import SectionTabs             from '../components/chat/SectionTabs';
import ModelSelectorModal      from '../components/chat/ModelSelectorModal';
import MessageBubble           from '../components/chat/MessageBubble';
import { EmptyState }          from '../components/chat/EmptyState';
import AdvancedInput           from '../components/chat/AdvancedInput';
import ChatSidebar             from '../components/chat/ChatSidebar';
import { ImageSection, VoiceSection, VideoSection } from '../components/chat/MediaSections';
import { useArtifacts } from '../context/ArtifactContext';
import ArtifactPanel from '../components/chat/ArtifactPanel';
import { playSendSound, playReceiveSound, playErrorSound, initAudioContext } from '../lib/audio';

/* ══════════════════════════════════════════════════════════
   CHAT PAGE — state + handlers only (~250 lines)
══════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const navigate = useNavigate();

  /* ── Responsive ───────────────────────────────────────── */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);

  /* ── Core state ───────────────────────────────────────── */
  const [theme,         setTheme]         = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [currentUser,   setCurrentUser]   = useState(null);
  const [userProfile,   setUserProfile]   = useState({ name: 'Omni User', email: '', avatar: null });
  const [sidebarOpen,   setSidebarOpen]   = useState(() => window.innerWidth >= 768);
  const [isMultiMode,   setIsMultiMode]   = useState(false);
  const [input,         setInput]         = useState('');
  const [isLoading,     setIsLoading]     = useState(true);
  const [activeSection, setActiveSection] = useState('chat');
  const [soundEnabled,  setSoundEnabled]  = useState(() => localStorage.getItem('omni-sound') !== 'false');

  const [showModelSel,  setShowModelSel]  = useState(false);
  const [activeModels,  setActiveModels]  = useState([{
    ...TEXT_PROVIDERS.find(p => p.id === 'meta').models[0],
    providerId: 'meta', slug: 'meta', color: '#0081fb',
  }]);

  const [conversations,  setConversations]  = useState([{ id: 'default', title: 'New Conversation', createdAt: Date.now(), pinned: false }]);
  const [activeConvId,   setActiveConvId]   = useState('default');
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameValue,    setRenameValue]    = useState('');
  const [chatHistories,  setChatHistories]  = useState({ default: {} });
  const [toasts,         setToasts]         = useState([]);
  const [showSearch,     setShowSearch]     = useState(false);

  const chatEndRefs = useRef({});
  const inputRef    = useRef(null);

  /* ── Theme & Sound sync ───────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('omni-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('omni-sound', soundEnabled);
  }, [soundEnabled]);

  /* ── Toast helpers ────────────────────────────────────── */
  const addToast = useCallback((message, type = 'info') => {
    const id = genId();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  /* ── Auth ─────────────────────────────────────────────── */
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

  /* ── Load chats from DB ───────────────────────────────── */
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

  /* ── Scroll to bottom ─────────────────────────────────── */
  useEffect(() => {
    Object.values(chatEndRefs.current).forEach(r => r?.scrollIntoView({ behavior: 'smooth' }));
  }, [chatHistories]);

  /* ── Init model history ───────────────────────────────── */
  useEffect(() => {
    activeModels.forEach(model => {
      const key = `${model.providerId}-${model.id}`;
      if (!chatHistories[activeConvId]?.[key]) {
        setChatHistories(prev => ({
          ...prev,
          [activeConvId]: {
            ...(prev[activeConvId] || {}),
            [key]: [{ id: genId(), role: 'assistant', content: `Hello! I'm **${model.name}** — ${model.type}. How can I help?`, model, timestamp: Date.now() }],
          },
        }));
      }
    });
  }, [activeModels, activeConvId]);

  /* ── Keyboard shortcuts ───────────────────────────────── */
  useEffect(() => {
    const h = e => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k')  { e.preventDefault(); setShowSearch(p => !p); }
      if (mod && e.key === 'n')  { e.preventDefault(); handleNewConv(); }
      if (mod && e.key === '\\') { e.preventDefault(); setSidebarOpen(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Derived ──────────────────────────────────────────── */
  const activeConv = conversations.find(c => c.id === activeConvId);
  const getCurrentHistory = useCallback(key => chatHistories[activeConvId]?.[key] || [], [chatHistories, activeConvId]);
  const sortedConvs = useMemo(() => {
    const pin   = conversations.filter(c =>  c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const unpin = conversations.filter(c => !c.pinned).sort((a, b) => b.createdAt - a.createdAt);
    return [...pin, ...unpin];
  }, [conversations]);

  /* ── Conversation handlers ────────────────────────────── */
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

  const handleRenameConv = (id, value) => {
    if (!value.trim()) return;
    setConversations(p => p.map(c => c.id === id ? { ...c, title: value.trim() } : c));
    setRenamingId(null);
  };

  const handleStartRename = (id, currentTitle) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  /* ── Model selection ──────────────────────────────────── */
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

  /* ── Send message ─────────────────────────────────────── */
  const handleSend = async () => {
    initAudioContext();
    const text = input.trim(); if (!text) return;
    if (soundEnabled) playSendSound();
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
        ...prev,
        [activeConvId]: { ...prev[activeConvId], [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] },
      }));
      try {
        const priorMsgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
        priorMsgs.push({ role: 'user', content: text });
        
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || '';

        const response = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ messages: priorMsgs, providerId: model.providerId, modelId: model.id }),
        });
        if (!response.ok) throw new Error(`API Error ${response.status}`);
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let reply = '';
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          for (const chunk of decoder.decode(value).split('\n\n')) {
            if (chunk.startsWith('data: ')) {
              try {
                const d = JSON.parse(chunk.slice(6));
                if (d.type === 'chunk') {
                  reply += d.text;
                  setChatHistories(prev => {
                    const msgs = [...(prev[activeConvId]?.[key] || [])];
                    const i = msgs.findIndex(m => m.id === streamId);
                    if (i > -1) msgs[i] = { ...msgs[i], content: reply };
                    return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
                  });
                }
              } catch (_) {}
            }
          }
        }
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], isStreaming: false };
          const updated = { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
          saveChatToDB(activeConvId, activeConv?.title || 'Chat', updated[activeConvId], activeConv?.pinned || false);
          return updated;
        });
        if (soundEnabled) playReceiveSound();
      } catch (err) {
        setChatHistories(prev => {
          const msgs = [...(prev[activeConvId]?.[key] || [])];
          const i = msgs.findIndex(m => m.id === streamId);
          if (i > -1) msgs[i] = { ...msgs[i], content: `❌ **Error:** ${err.message}`, isStreaming: false };
          return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
        });
        addToast(`${model.name}: ${err.message}`, 'error');
        if (soundEnabled) playErrorSound();
      }
    });
  };

  const handleDeleteMsg = msgId => {
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
    setChatHistories(prev => {
      const msgs = [...(prev[activeConvId]?.[key] || [])];
      const lastAI = [...msgs].reverse().findIndex(m => m.role === 'assistant' && !m.isStreaming);
      if (lastAI !== -1) msgs.splice(msgs.length - 1 - lastAI, 1);
      return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: msgs } };
    });
    const streamId = genId();
    setChatHistories(prev => ({
      ...prev,
      [activeConvId]: { ...prev[activeConvId], [key]: [...(prev[activeConvId]?.[key] || []), { id: streamId, role: 'assistant', content: '', isStreaming: true, model, timestamp: Date.now() }] },
    }));
    try {
      const msgs = (chatHistories[activeConvId]?.[key] || []).filter(m => !m.isStreaming).map(m => ({ role: m.role, content: m.content }));
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(`${API_BASE}/api/chat`, { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify({ messages: msgs, providerId: model.providerId, modelId: model.id }) 
      });
      if (!response.ok) throw new Error(`API Error ${response.status}`);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let reply = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        for (const chunk of decoder.decode(value).split('\n\n')) {
          if (chunk.startsWith('data: ')) {
            try {
              const d = JSON.parse(chunk.slice(6));
              if (d.type === 'chunk') {
                reply += d.text;
                setChatHistories(prev => { const m = [...(prev[activeConvId]?.[key] || [])]; const i = m.findIndex(x => x.id === streamId); if (i > -1) m[i] = { ...m[i], content: reply }; return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; });
              }
            } catch (_) {}
          }
        }
      }
      setChatHistories(prev => { const m = [...(prev[activeConvId]?.[key] || [])]; const i = m.findIndex(x => x.id === streamId); if (i > -1) m[i] = { ...m[i], isStreaming: false }; return { ...prev, [activeConvId]: { ...prev[activeConvId], [key]: m } }; });
      addToast('Regenerated', 'success');
    } catch (err) { addToast('Regeneration failed', 'error'); }
  };

  /* ── Loading screen ───────────────────────────────────── */
  if (isLoading) return (
    <div style={{ height: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ width: 34, height: 34, border: '2px solid #1a1a22', borderTopColor: '#e8a85f', borderRadius: '50%' }} className="spin" />
      <span style={{ fontSize: 13, color: '#555', fontFamily: "'Outfit',sans-serif" }}>Loading OMNI AI PRO…</span>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  const { isOpen: isArtifactOpen } = useArtifacts();

  return (
    <div className={`chat-page-root chat-layout ${isArtifactOpen && !isMobile ? 'side-panel-open' : ''}`} style={{ display: 'flex', height: '100dvh', background: 'var(--bg-base)', color: 'var(--text-main)', overflow: 'hidden', fontFamily: "'Outfit',sans-serif", position: 'relative' }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 140, backdropFilter: 'blur(4px)' }} />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <ChatSidebar
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            userProfile={userProfile}
            theme={theme}
            setTheme={setTheme}
            activeSection={activeSection}
            activeModels={activeModels}
            conversations={conversations}
            activeConvId={activeConvId}
            chatHistories={chatHistories}
            sortedConvs={sortedConvs}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            renamingId={renamingId}
            renameValue={renameValue}
            setRenameValue={setRenameValue}
            onNewConv={handleNewConv}
            onSelectConv={id => { setActiveConvId(id); setShowSearch(false); if (isMobile) setSidebarOpen(false); }}
            onPinConv={handlePinConv}
            onDeleteConv={handleDeleteConv}
            onRenameConv={handleStartRename}
            onRenameSubmit={handleRenameConv}
            onSignOut={() => supabase.auth.signOut().then(() => navigate('/'))}
            onSearchJump={id => setActiveConvId(id)}
            removeModelFromChat={removeModelFromChat}
          />
        )}
      </AnimatePresence>

      {/* ═══ MAIN ═══ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Header (Single Row on Mobile) */}
        <header className="chat-header-mobile" style={{ background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur)', borderBottom: '1px solid var(--border-light)', flexShrink: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-low), transparent)', pointerEvents: 'none' }} />

          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 12px' : '0 18px', gap: isMobile ? 6 : 10 }}>
            {/* Left: Sidebar toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setSidebarOpen(p => !p)} title="History &amp; conversations"
                style={{ height: 34, width: isMobile ? 34 : undefined, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all .14s', flexShrink: 0, padding: isMobile ? 0 : '0 8px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <IC.Sidebar />
                {!isMobile && <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>History</span>}
              </button>
              
              {/* Desktop Chat Title */}
              {!isMobile && activeSection === 'chat' && (
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeConv?.title || 'New Chat'}
                </span>
              )}
            </div>

            {/* Centre: Section tabs (desktop) OR Model Selector (mobile) */}
            {!isMobile && <SectionTabs active={activeSection} onChange={setActiveSection} />}
            {isMobile && activeSection === 'chat' && (
              <button onClick={() => setShowModelSel(true)}
                style={{ flex: 1, maxWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px 14px', borderRadius: 12, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                {activeModels.length === 1 && activeModels[0]?.slug && <BrandLogo slug={activeModels[0].slug} color={activeModels[0].color} size={16} />}
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeModels.length === 1 ? activeModels[0]?.name : `${activeModels.length} Models`}
                </span>
                <IC.ChevronD />
              </button>
            )}

            {/* Right: Compare (mobile) & Theme */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {/* Desktop Model/Compare controls */}
              {!isMobile && activeSection === 'chat' && (
                <>
                  <button onClick={() => setIsMultiMode(p => !p)}
                    style={{ padding: '5px 11px', borderRadius: 8, background: isMultiMode ? 'var(--accent-low)' : 'var(--bg-hover)', border: `1px solid ${isMultiMode ? 'rgba(232,168,95,.3)' : 'var(--border-light)'}`, fontSize: 12, cursor: 'pointer', color: isMultiMode ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}>
                    <IC.Layers />{isMultiMode ? `Multi (${activeModels.length})` : 'Multi-Model'}
                  </button>
                  <button onClick={() => setShowModelSel(true)}
                    style={{ padding: '5px 11px', borderRadius: 9, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', fontSize: 12, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500, fontFamily: "'Outfit',sans-serif", transition: 'all .14s' }}>
                    {activeModels.length === 1 && activeModels[0]?.slug && <BrandLogo slug={activeModels[0].slug} color={activeModels[0].color} size={12} />}
                    {activeModels.length === 1 ? activeModels[0]?.name : `${activeModels.length} Models`}
                    <IC.ChevronD />
                  </button>
                </>
              )}

              {/* Mobile Compare Button */}
              {isMobile && activeSection === 'chat' && (
                <button onClick={() => setIsMultiMode(p => !p)}
                  style={{ width: 34, height: 34, background: isMultiMode ? 'var(--accent-low)' : 'var(--bg-hover)', border: `1px solid ${isMultiMode ? 'var(--accent)' : 'var(--border-light)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isMultiMode ? 'var(--accent)' : 'var(--text-muted)' }}>
                  <IC.Layers />
                </button>
              )}

              {/* Theme toggle */}
              <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
                style={{ width: 34, height: 34, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
              </button>
            </div>
          </div>
        </header>


        {/* Section content */}
        <AnimatePresence mode="wait">
          {activeSection === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Chat messages */}
              <div className="omni-scroll" style={{ flex: 1, display: 'flex', overflowX: isMultiMode ? 'auto' : 'hidden', overflowY: isMultiMode ? 'hidden' : 'auto', background: 'var(--bg-base)', minHeight: 0, position: 'relative' }}>
                {isMultiMode ? (
                  <>
                    {/* Swipeable model columns */}
                    <div style={{ display: 'flex', height: '100%', minWidth: isMobile ? undefined : 'max-content', scrollSnapType: isMobile ? 'x mandatory' : 'none', WebkitOverflowScrolling: 'touch' }}>
                      {activeModels.map((model, idx) => {
                        const key = `${model.providerId}-${model.id}`;
                        const history = getCurrentHistory(key);
                        return (
                          <motion.div key={`${model.id}-${idx}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * .06 }}
                            style={{ width: isMobile ? '100vw' : 390, minWidth: isMobile ? '100vw' : 390, borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', flexShrink: 0, scrollSnapAlign: isMobile ? 'start' : 'none' }}>
                            <div style={{ padding: '8px 12px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ModelAvatar model={model} size={22} />
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 12, color: model.color }}>{model.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{model.type}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 5 }}>
                                <button onClick={() => continueWithModel(model)} style={{ padding: '3px 9px', fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Outfit',sans-serif" }}>Continue <IC.ArrowR /></button>
                                <button onClick={() => removeModelFromChat(model.id, model.providerId)} style={{ width: 24, height: 24, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IC.X /></button>
                              </div>
                            </div>
                            <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '14px 10px' : '18px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                              {history.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} model={model} userProfile={userProfile}
                                  onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }}
                                  onDelete={handleDeleteMsg}
                                  onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(model) : null}
                                  isCompact
                                />
                              ))}
                              <div ref={el => chatEndRefs.current[key] = el} />
                            </div>
                          </motion.div>
                        );
                      })}
                      {!isMobile && (
                        <div style={{ width: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 20 }}>
                          <button onClick={() => setShowModelSel(true)}
                            style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-hover)', border: '2px dashed var(--border-med)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, fontSize: 12, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                            <span style={{ fontSize: 20 }}>＋</span>Add Model
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Mobile swipe indicator dots */}
                    {isMobile && activeModels.length > 1 && (
                      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 99, backdropFilter: 'blur(8px)' }}>
                        {activeModels.map((m, i) => (
                          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, opacity: 0.7, transition: 'all .2s' }} title={m.name} />
                        ))}
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>swipe →</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {(() => {
                      const key = `${activeModels[0]?.providerId}-${activeModels[0]?.id}`;
                      const history = getCurrentHistory(key);
                      if (!history.some(m => m.role === 'user'))
                        return <EmptyState activeModel={activeModels[0]} onTemplateSelect={t => { setInput(t); setTimeout(() => inputRef.current?.focus(), 100); }} />;
                      return (
                        <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px 12px 10px' : '30px 20px 14px' }}>
                          <div style={{ maxWidth: isMobile ? '100%' : 740, width: '100%', minWidth: 0, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20, overflow: 'hidden' }}>
                            {history.map(msg => (
                              <MessageBubble key={msg.id} msg={msg} model={activeModels[0]} userProfile={userProfile}
                                onCopy={txt => { navigator.clipboard.writeText(txt); addToast('Copied!', 'success'); }}
                                onDelete={handleDeleteMsg}
                                onRegenerate={msg.role === 'assistant' && !msg.isStreaming ? () => handleRegenerate(activeModels[0]) : null}
                                isCompact={isMobile}
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

              {/* Chat input */}
              <div className="chat-input-mobile" style={{ padding: isMobile ? '0 10px' : '0 20px', background: 'var(--bg-base)', flexShrink: 0 }}>
                {(() => {
                  const key = `${activeModels[0]?.providerId}-${activeModels[0]?.id}`;
                  const history = getCurrentHistory(key);
                  const hasMessages = history.some(m => m.role === 'user');
                  return <AdvancedInput input={input} setInput={setInput} onSend={handleSend} activeModels={activeModels} isMultiChatMode={isMultiMode} inputRef={inputRef} hasMessages={hasMessages} />;
                })()}
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

        {/* ── Mobile bottom navigation bar ── */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'stretch', borderTop: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur)', flexShrink: 0, zIndex: 50, height: 54 }}>
            {[{ id: 'chat', label: 'Chat', Icon: IC.Chat }, { id: 'image', label: 'Image', Icon: IC.Image }, { id: 'voice', label: 'Voice', Icon: IC.Volume }, { id: 'video', label: 'Video', Icon: IC.Video }].map(({ id, label, Icon }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => setActiveSection(id)}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: isActive ? 'var(--accent)' : 'var(--text-muted)', transition: 'all .18s', fontFamily: "'Outfit',sans-serif", position: 'relative', padding: '8px 0' }}>
                  {isActive && <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: 'var(--accent)', borderRadius: '0 0 3px 3px', boxShadow: '0 0 8px var(--accent)' }} />}
                  <Icon />
                  <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Model selector modal */}
      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal
            onClose={() => setShowModelSel(false)}
            onSelect={handleModelSelect}
            activeModels={activeModels}
            isMulti={isMultiMode}
            providers={TEXT_PROVIDERS}
            title="Choose AI Model"
            subtitle={isMultiMode ? 'Select multiple models to compare side by side' : 'Select one model to chat with'}
          />
        )}
      </AnimatePresence>

      <ArtifactPanel />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}