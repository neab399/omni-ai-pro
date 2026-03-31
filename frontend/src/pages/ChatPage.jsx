import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

/* ══════════════════════════════════════════════════════════
   SUPABASE
══════════════════════════════════════════════════════════ */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import { TEXT_PROVIDERS, IMAGE_PROVIDERS, AUDIO_PROVIDERS, VIDEO_PROVIDERS, MUSIC_PROVIDERS, ALL_TEXT_MODELS, ALL_IMAGE_MODELS, ALL_AUDIO_MODELS, ALL_VIDEO_MODELS, SLASH_COMMANDS, PROMPT_TEMPLATES, genId, formatTime, estimateTokens, parseMarkdown, GLOBAL_STYLES, IC } from '../lib/models';

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
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '6px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.15, 1, 0.15] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-low)' }} />
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
    <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 11, padding: 3, border: '1px solid var(--border-light)', backdropFilter: 'var(--panel-blur)' }}>
      {SECTIONS.map(s => {
        const isActive = s.id === active;
        const Icon = s.icon;
        return (
          <button key={s.id} onClick={() => onChange(s.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: isActive ? 700 : 500, background: isActive ? 'var(--bg-panel)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-muted)', boxShadow: isActive ? 'var(--shadow-sm), var(--glow-gold)' : 'none', transition: 'all .22s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: "'Outfit',sans-serif", letterSpacing: isActive ? '0.02em' : '0' }}>
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur-strong)', border: '1px solid var(--border-med)', borderRadius: 20, width: '92%', maxWidth: 860, maxHeight: '84vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg), var(--glow-gold)', overflow: 'hidden' }}>

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
import { ImageSection, VoiceSection, VideoSection } from '../components/chat/MediaSections';
function MessageBubble({ msg, model, userProfile, onCopy, onDelete, onRegenerate, isCompact }) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
      style={{ display: 'flex', gap: 12, flexDirection: isUser ? 'row-reverse' : 'row', position: 'relative', padding: '6px 0' }}>
      {isUser ? <UserAvatar profile={userProfile} size={30} /> : <ModelAvatar model={model} size={30} />}
      <div style={{ maxWidth: isCompact ? '88%' : '80%', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isUser ? 'row-reverse' : 'row' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: isUser ? 'var(--text-muted)' : (model?.color || 'var(--text-main)'), letterSpacing: '0.01em' }}>{isUser ? 'You' : (model?.name || 'AI')}</span>
          <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: "'JetBrains Mono',monospace" }}>{formatTime(msg.timestamp)}</span>
        </div>
        <div style={{ background: isUser ? 'var(--bg-hover)' : 'transparent', border: isUser ? '1px solid var(--border-light)' : 'none', borderLeft: !isUser ? '2px solid ' + (model?.color || 'var(--accent)') + '30' : 'none', padding: isUser ? '11px 15px' : '2px 0 2px 14px', borderRadius: isUser ? '16px 4px 16px 16px' : 0, wordBreak: 'break-word', backdropFilter: isUser ? 'var(--panel-blur)' : 'none' }}>
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

        <motion.div animate={{ borderColor: focused ? 'var(--border-focus)' : 'var(--border-med)', boxShadow: focused ? 'var(--glow-gold-strong), 0 0 0 1px rgba(255,217,61,0.08)' : 'var(--shadow-sm)' }}
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: 18, overflow: 'visible', backdropFilter: 'var(--panel-blur)', transition: 'border-color 0.3s' }}>

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
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.65, padding: '14px 18px', resize: 'none', maxHeight: 220, minHeight: 54, caretColor: 'var(--accent)' }} />

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
                style={{ padding: '8px 20px', borderRadius: 11, background: input.trim() ? 'var(--accent)' : 'transparent', color: input.trim() ? 'var(--bg-base)' : 'var(--text-faint)', border: `1px solid ${input.trim() ? 'transparent' : 'var(--border-light)'}`, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", transition: 'all .22s', boxShadow: input.trim() ? 'var(--glow-gold)' : 'none' }}>
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

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [theme,         setTheme]         = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [currentUser,   setCurrentUser]   = useState(null);
  const [userProfile,   setUserProfile]   = useState({ name: 'Omni User', email: '', avatar: null });
  const [sidebarOpen,   setSidebarOpen]   = useState(() => window.innerWidth >= 768);
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
    <div className="chat-page-root" style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', overflow: 'hidden', fontFamily: "'Outfit',sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 140, backdropFilter: 'blur(4px)' }} />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside className={isMobile ? 'chat-sidebar-mobile' : ''} initial={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }} animate={{ width: isMobile ? 280 : 260, opacity: 1, x: 0 }} exit={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }} transition={{ duration: .25, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur-strong)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, position: isMobile ? 'fixed' : 'relative', zIndex: isMobile ? 150 : 'auto', top: 0, left: 0, bottom: 0 }}>

            {/* Logo */}
            <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 20px rgba(255,217,61,0.2)', animation: 'glow-pulse 3s ease-in-out infinite' }}>
                <img src="/logo.png" alt="O" style={{ width: 18, filter: 'brightness(0)' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-.02em', color: 'var(--text-main)', fontFamily: "'Outfit',sans-serif" }}>OMNI AI <span style={{ color: 'var(--accent)' }}>PRO</span></div>
                <div style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.04em' }}>68 Models · 4 Modes</div>
              </div>
            </div>

            {/* New chat + search */}
            <div style={{ padding: '0 10px 10px', display: 'flex', gap: 5, flexShrink: 0 }}>
              <button onClick={handleNewConv}
                style={{ flex: 1, padding: '9px 12px', background: 'var(--accent)', color: 'var(--bg-base)', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Outfit',sans-serif", transition: 'all .2s', boxShadow: 'var(--glow-gold)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--glow-gold-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--glow-gold)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
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
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); if (isMobile) setSidebarOpen(false); }} onPin={() => handlePinConv(conv.id)} onDelete={() => handleDeleteConv(conv.id)} onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConv(conv.id, renameValue)} />
                ))}
                {sortedConvs.some(c => !c.pinned) && <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 4px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Recent</div>}
                {sortedConvs.filter(c => !c.pinned).map(conv => (
                  <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onSelect={() => { setActiveConvId(conv.id); setShowSearch(false); if (isMobile) setSidebarOpen(false); }} onPin={() => handlePinConv(conv.id)} onDelete={() => handleDeleteConv(conv.id)} onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onRenameSubmit={() => handleRenameConv(conv.id, renameValue)} />
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
        <header className="chat-header-mobile" style={{ height: isMobile ? 50 : 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 10px' : '0 18px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur)', flexShrink: 0, gap: isMobile ? 6 : 10, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-low), transparent)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 9, minWidth: 0 }}>
            <button onClick={() => setSidebarOpen(p => !p)} title="Toggle sidebar"
              style={{ width: 32, height: 32, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .14s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <IC.Sidebar />
            </button>
            {activeSection === 'chat' && !isMobile && <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{activeConv?.title || 'New Conversation'}</span>}
          </div>

          {/* Section tabs — centre */}
          <SectionTabs active={activeSection} onChange={setActiveSection} />

          {/* Right controls — only for chat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 6, minWidth: 0 }}>
            {activeSection === 'chat' && (
              <>
                {!isMobile && (
                  <button onClick={() => setIsMultiMode(p => !p)}
                    style={{ padding: '5px 11px', borderRadius: 8, background: isMultiMode ? 'var(--accent-low)' : 'var(--bg-hover)', border: `1px solid ${isMultiMode ? 'rgba(232,168,95,.3)' : 'var(--border-light)'}`, fontSize: 12, cursor: 'pointer', color: isMultiMode ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Outfit',sans-serif", transition: 'all .18s' }}>
                    <IC.Layers />{isMultiMode ? `Multi (${activeModels.length})` : 'Multi-Model'}
                  </button>
                )}
                <button onClick={() => setShowModelSel(true)} className="chat-model-btn-mobile"
                  style={{ padding: isMobile ? '5px 8px' : '5px 11px', borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', fontSize: isMobile ? 11 : 12, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500, fontFamily: "'Outfit',sans-serif", transition: 'all .14s', maxWidth: isMobile ? 120 : 'none', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                  {activeModels.length === 1 && activeModels[0]?.slug && <BrandLogo slug={activeModels[0].slug} color={activeModels[0].color} size={12} />}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeModels.length === 1 ? activeModels[0]?.name : `${activeModels.length} Models`}</span>
                  <IC.ChevronD />
                </button>
              </>
            )}
            {!isMobile && (
              <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
                style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
              </button>
            )}
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
              <div className="chat-input-mobile" style={{ padding: isMobile ? '0 10px' : '0 20px', background: 'var(--bg-base)', flexShrink: 0 }}>
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