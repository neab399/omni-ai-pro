import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLASH_COMMANDS, PROMPT_TEMPLATES, genId, estimateTokens, IC } from '../../lib/models';
import { InputTBtn } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   ADVANCED INPUT
   Status: Restored & Upgraded (God-Tier)
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
    <div style={{ padding: isMobileView ? '8px 0 12px' : '12px 0 24px', background: 'transparent', position: 'relative', flexShrink: 0, zIndex: 10 }} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {/* Template chips — only when no conversation started yet */}
      <AnimatePresence>
        {focused && !input && !hasMessages && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto 12px', display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {PROMPT_TEMPLATES.map((t, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                onClick={() => { setInput(t.text); setTimeout(() => inputEl.current?.focus(), 50); }}
                style={{ flexShrink: 0, padding: '6px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: 99, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontFamily: "'Outfit',sans-serif", transition: 'all .14s', backdropFilter: 'blur(10px)' }}
                whileHover={{ borderColor: 'var(--accent)', color: 'var(--text-main)', background: 'rgba(255,255,255,0.06)' }}>
                {t.icon} {t.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: isMultiChatMode ? '96%' : 760, margin: '0 auto', position: 'relative', padding: isMobileView ? '0 4px' : 0 }}>
        
        {/* Sentient Aura Glow (Behind Input) */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              style={{ position: 'absolute', inset: -2, borderRadius: isMobileView ? 24 : 20, background: `linear-gradient(45deg, ${activeModels[0]?.color || 'var(--accent)'}33, transparent, ${activeModels[0]?.color || 'var(--accent)'}33)`, filter: 'blur(15px)', zIndex: -1, pointerEvents: 'none' }}
            />
          )}
        </AnimatePresence>

        {/* Slash dropdown */}
        <AnimatePresence>
          {showSlash && filteredCmds.length > 0 && (
            <motion.div ref={slashRef} initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
              style={{ position: 'absolute', bottom: 'calc(100% + 12px)', left: 0, right: 0, background: 'rgba(20,20,25,0.9)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-med)', borderRadius: 16, overflow: 'hidden', zIndex: 60, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '10px 16px 8px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Command Synchronizer</div>
              {filteredCmds.map((c, i) => (
                <div key={i} onClick={() => applySlash(c)}
                  style={{ padding: '12px 16px', background: i === slashIdx ? 'rgba(255,255,255,0.05)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .14s' }}
                  onMouseEnter={() => setSlashIdx(i)}>
                  <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: "'JetBrains Mono',monospace" }}>
                      {c.cmd} <span style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 400, color: 'var(--text-muted)' }}>{c.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, opacity: 0.8 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 4px' }}>
              {attachments.map(a => (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  key={a.id} 
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 11.5, color: 'var(--text-sec)', backdropFilter: 'blur(10px)' }}
                >
                  <span style={{ fontSize: 14 }}>{a.type.startsWith('image') ? '🖼' : '📄'}</span>
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{a.name}</span>
                  <button onClick={() => setAttachments(p => p.filter(x => x.id !== a.id))} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}>✕</button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {isMobileView ? (
          /* ── MOBILE COMPACT INPUT ── */
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py" style={{ display: 'none' }} onChange={e => addFiles(Array.from(e.target.files))} />
            
            <button onClick={() => fileRef.current?.click()} 
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', flexShrink: 0, padding: 0, marginBottom: 2, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: 26, fontWeight: 300 }}>+</span>
            </button>

            <motion.div
              animate={{ borderColor: focused ? (activeModels[0]?.color || 'var(--border-focus)') : 'var(--border-med)', boxShadow: focused ? `0 0 20px ${(activeModels[0]?.color || 'var(--accent)')}22` : 'var(--shadow-sm)' }}
              style={{ flex: 1, background: 'rgba(15,15,20,0.8)', border: '1px solid var(--border-med)', borderRadius: 24, overflow: 'hidden', backdropFilter: 'blur(20px)', willChange: 'transform, border-color' }}>
              
              {activeModels.length > 1 && (
                <div style={{ padding: '8px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multiplexing:</span>
                  {activeModels.map((m, i) => <span key={i} style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>{m.name}</span>)}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 6, paddingRight: 6 }}>
                <textarea
                  ref={inputEl} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)}
                  placeholder={isMultiChatMode ? `Querying ${activeModels.length} Cores…` : `Message ${activeModels[0]?.name || 'OMNI'}…`}
                  rows={1}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.5, padding: '12px 16px', resize: 'none', maxHeight: 120, minHeight: 46, caretColor: 'var(--accent)', overflowX: 'hidden' }}
                />

                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, marginBottom: 4 }}>
                  {input.trim() ? (
                    <motion.button onClick={handleSend} disabled={sending} whileTap={{ scale: .85 }} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--text-main)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-base)', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }}>
                      {sending ? <span className="spin" style={{ display: 'flex' }}><IC.Send /></span> : <span style={{ transform: 'rotate(-45deg)', marginTop: -2, marginRight: -2 }}><IC.ArrowR /></span>}
                    </motion.button>
                  ) : (
                    <button onClick={handleBoost} disabled={isBoosting} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: isBoosting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBoosting ? 'var(--accent)' : 'var(--text-muted)' }}>
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
            animate={{ 
              borderColor: focused ? (activeModels[0]?.color || 'var(--border-focus)') : 'var(--border-med)', 
              boxShadow: focused ? `0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px ${(activeModels[0]?.color || 'var(--accent)')}22` : 'var(--shadow-sm)',
              y: focused ? -2 : 0
            }}
            style={{ background: 'rgba(15,15,20,0.7)', border: '1px solid var(--border-med)', borderRadius: 20, overflow: 'visible', backdropFilter: 'blur(25px)', transition: 'border-color 0.4s, transform 0.4s, box-shadow 0.4s', willChange: 'transform' }}>
            
            {activeModels.length > 1 && (
              <div style={{ padding: '12px 18px 0', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', marginRight: 4 }}>Neural Pipeline:</span>
                {activeModels.map((m, i) => <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={i} style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: m.color }}>{m.name}</motion.span>)}
              </div>
            )}

            <textarea
              ref={inputEl} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder={isMultiChatMode ? `Multiplexing ${activeModels.length} Intelligence Streams…` : `Communicate with ${activeModels[0]?.name || 'OMNI CORE'}…`}
              rows={1}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 15, fontFamily: "'Outfit',sans-serif", color: overLimit ? 'var(--red)' : 'var(--text-main)', lineHeight: 1.6, padding: '18px 20px', resize: 'none', maxHeight: 240, minHeight: 60, caretColor: 'var(--accent)', overflowX: 'hidden', opacity: focused ? 1 : 0.8, transition: 'opacity 0.3s' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.js,.ts,.py" style={{ display: 'none' }} onChange={e => addFiles(Array.from(e.target.files))} />
                <InputTBtn title="Upload Data" onClick={() => fileRef.current?.click()}><IC.Paperclip /></InputTBtn>
                <InputTBtn title="Refine via AI" onClick={handleBoost} disabled={!input.trim() || isBoosting} active={boostDone}>
                  {isBoosting ? <span className="spin"><IC.Sparkle /></span> : boostDone ? <span style={{ color: 'var(--green)' }}>✓</span> : <IC.Sparkle />}
                </InputTBtn>
                <AnimatePresence>
                  {(isBoosting || boostDone) && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 11, color: isBoosting ? 'var(--accent)' : 'var(--green)', fontWeight: 700, marginLeft: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isBoosting ? 'PROMPT OPTIMIZATION…' : 'REFINED!'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {input.length > 0 && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: overLimit ? 'var(--red)' : 'var(--text-faint)', fontWeight: 600 }}>
                    {tokens.toLocaleString()} <span style={{ opacity: 0.5 }}>TKNS</span>
                  </motion.span>
                )}
                <motion.button onClick={handleSend} disabled={!input.trim()} whileTap={{ scale: .95 }}
                  style={{ padding: '10px 24px', borderRadius: 14, background: input.trim() ? 'var(--text-main)' : 'rgba(255,255,255,0.03)', color: input.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, fontFamily: "'Outfit',sans-serif", transition: 'all .3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: input.trim() ? '0 10px 25px rgba(255,255,255,0.1)' : 'none' }}>
                  {sending ? <span className="spin"><IC.Send /></span> : <IC.Send />}
                  <span>{sending ? 'PROCESSING' : 'SEND'}</span>
                  {isMultiChatMode && input.trim() && <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 6, marginLeft: 2 }}>{activeModels.length}</span>}
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
