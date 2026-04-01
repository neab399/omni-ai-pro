import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLASH_COMMANDS, PROMPT_TEMPLATES, genId, estimateTokens, IC } from '../../lib/models';
import { InputTBtn } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   ADVANCED INPUT
══════════════════════════════════════════════════════════ */
export default function AdvancedInput({ input, setInput, onSend, activeModels, isMultiChatMode, inputRef: extRef, hasMessages }) {
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
    if (last?.startsWith('/') && last.length >= 1) {
      setSlashFilter(last.slice(1).toLowerCase()); setShowSlash(true); setSlashIdx(0);
    } else setShowSlash(false);
  }, [input]);

  useEffect(() => {
    const h = e => { if (!slashRef.current?.contains(e.target)) setShowSlash(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredCmds = SLASH_COMMANDS.filter(c =>
    c.cmd.slice(1).includes(slashFilter) || c.label.toLowerCase().includes(slashFilter)
  );

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: `Rewrite this prompt to be clearer and more effective. Return ONLY the improved prompt:\n\n${t}` }],
        }),
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
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSlashIdx(p => Math.max(p - 1, 0)); return; }
      if (e.key === 'Tab' || (e.key === 'Enter' && showSlash)) { e.preventDefault(); applySlash(filteredCmds[slashIdx]); return; }
      if (e.key === 'Escape') { setShowSlash(false); return; }
    }
    if (e.key === 'ArrowUp' && !input && promptHistory.length) {
      e.preventDefault();
      const i = Math.min(histIdx + 1, promptHistory.length - 1);
      setHistIdx(i); setInput(promptHistory[i]); return;
    }
    if (e.key === 'ArrowDown' && histIdx >= 0) {
      e.preventDefault();
      const i = histIdx - 1;
      setHistIdx(i); setInput(i < 0 ? '' : promptHistory[i]); return;
    }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ padding: isMobileView ? '8px 0 12px' : '12px 0 24px', background: 'var(--bg-base)', position: 'relative', flexShrink: 0 }} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {/* Template chips — only when no conversation started yet */}
      <AnimatePresence>
        {focused && !input && !hasMessages && (
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

      <div style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto', position: 'relative', padding: isMobileView ? '0 4px' : 0 }}>
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
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', fontFamily: "'JetBrains Mono',monospace" }}>
                      {c.cmd} <span style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 400, color: 'var(--text-muted)' }}>{c.label}</span>
                    </div>
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

        {isMobileView ? (
          /* ── MOBILE COMPACT INPUT ── */
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py" style={{ display: 'none' }} onChange={e => addFiles(Array.from(e.target.files))} />
            
            <button onClick={() => fileRef.current?.click()} 
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', flexShrink: 0, padding: 0, marginBottom: 4, cursor: 'pointer' }}>
              <span style={{ fontSize: 24, marginTop: -2, fontWeight: 300 }}>+</span>
            </button>

            <motion.div
              animate={{ borderColor: focused ? 'var(--border-focus)' : 'var(--border-med)', boxShadow: focused ? 'var(--glow-gold-strong), 0 0 0 1px rgba(255,217,61,0.08)' : 'var(--shadow-sm)' }}
              style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: 22, overflow: 'hidden', backdropFilter: 'var(--panel-blur)' }}>
              
              {activeModels.length > 1 && (
                <div style={{ padding: '6px 12px 0', display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase' }}>Sending to:</span>
                  {activeModels.map((m, i) => <span key={i} style={{ fontSize: 10, color: m.color, fontWeight: 600 }}>{m.name}</span>)}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 6, paddingRight: 6 }}>
                <textarea
                  ref={inputEl}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  placeholder={isMultiChatMode ? `Ask ${activeModels.length} models…` : `Message ${activeModels[0]?.name || 'AI'}…`}
                  rows={1}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.5, padding: '10px 14px', resize: 'none', maxHeight: 120, minHeight: 44, caretColor: 'var(--accent)', overflowX: 'hidden' }}
                />

                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, marginBottom: 2 }}>
                  {input.trim() ? (
                    <motion.button onClick={handleSend} disabled={sending} whileTap={{ scale: .85 }}
                      style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--text-main)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-base)', boxShadow: 'var(--glow-gold)' }}>
                      {sending ? <span className="spin" style={{ display: 'flex' }}><IC.Send /></span> : <span style={{ transform: 'rotate(-45deg)', marginTop: -2, marginRight: -2 }}><IC.ArrowR /></span>}
                    </motion.button>
                  ) : (
                    <button onClick={handleBoost} disabled={isBoosting} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-hover)', border: 'none', cursor: isBoosting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBoosting ? 'var(--text-faint)' : 'var(--text-muted)' }}>
                      <span className={isBoosting ? 'spin' : ''} style={{ display: 'flex' }}><IC.Sparkle /></span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── DESKTOP FULL INPUT ── */
          <motion.div
            animate={{ borderColor: focused ? 'var(--border-focus)' : 'var(--border-med)', boxShadow: focused ? 'var(--glow-gold-strong), 0 0 0 1px rgba(255,217,61,0.08)' : 'var(--shadow-sm)' }}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-med)', borderRadius: 18, overflow: 'visible', backdropFilter: 'var(--panel-blur)', transition: 'border-color 0.3s' }}>
            
            {activeModels.length > 1 && (
              <div style={{ padding: '9px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginRight: 3 }}>Sending to:</span>
                {activeModels.map((m, i) => <span key={i} style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', color: m.color }}>{m.name}</span>)}
              </div>
            )}

            <textarea
              ref={inputEl}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder={isMultiChatMode ? `Ask ${activeModels.length} models…` : `Message ${activeModels[0]?.name || 'AI'}…`}
              rows={1}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.55, padding: '14px 18px', resize: 'none', maxHeight: 220, minHeight: 54, caretColor: 'var(--accent)', overflowX: 'hidden' }}
            />

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
                  style={{ padding: '8px 20px', borderRadius: 11, background: input.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: input.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: `1px solid ${input.trim() ? 'transparent' : 'var(--border-light)'}`, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif", transition: 'all .22s', boxShadow: input.trim() ? 'var(--glow-gold)' : 'none' }}>
                  {sending ? <span className="spin"><IC.Send /></span> : <IC.Send />}
                  {isMultiChatMode && input.trim() && <span style={{ fontSize: 10, opacity: .7 }}>×{activeModels.length}</span>}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {!isMobileView && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10.5, color: 'var(--text-faint)' }}>
            OMNI AI PRO · Type <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '1px 5px', background: 'var(--bg-hover)', borderRadius: 3, border: '1px solid var(--border-light)' }}>/</code> for commands · Drag files to attach
          </div>
        )}
      </div>
    </div>
  );
}
