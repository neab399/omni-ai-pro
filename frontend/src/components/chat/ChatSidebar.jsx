import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IC } from '../../lib/models';
import { BrandLogo, UserAvatar, PlanBadge, SBtn } from './ChatUIKit';
import InteractiveLogo from '../InteractiveLogo';

/* ══════════════════════════════════════════════════════════
   CONV ITEM (single conversation row)
══════════════════════════════════════════════════════════ */
function ConvItem({ conv, isActive, onSelect, onPin, onDelete, onRename, renamingId, renameValue, setRenameValue, onRenameSubmit }) {
  const [h, setH] = useState(false);
  const renaming = renamingId === conv.id;
  return (
    <motion.div
      whileHover={{ x: 2 }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onSelect}
      style={{ padding: '8px 10px', borderRadius: 9, background: isActive ? 'var(--bg-hover)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 7, marginBottom: 1, border: `1px solid ${isActive ? 'var(--border-light)' : 'transparent'}`, transition: 'all .14s' }}
    >
      {renaming ? (
        <input
          autoFocus
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={onRenameSubmit}
          onKeyDown={e => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') setRenameValue(conv.title); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--accent)', borderRadius: 5, padding: '3px 7px', fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }}
        />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
            {conv.pinned && <span style={{ fontSize: 9, color: 'var(--accent)', flexShrink: 0 }}>📌</span>}
            <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {conv.title}
            </span>
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

/* ══════════════════════════════════════════════════════════
   SEARCH PANE
══════════════════════════════════════════════════════════ */
function SearchPane({ conversations, chatHistories, onJump, onClose }) {
  const [q, setQ] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const results = React.useMemo(() => {
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
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
      style={{ position: 'absolute', inset: 0, background: 'var(--bg-panel)', zIndex: 10, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '14px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><IC.Search /></div>
          <input
            ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Search messages…"
            style={{ width: '100%', padding: '8px 10px 8px 30px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }}
          />
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
   STUDENT PROGRESS (Gamification)
   - Tracks Daily Study Streak (flame)
   - Tracks Knowledge Points (💎 KP / XP)
══════════════════════════════════════════════════════════ */
function StudentProgress() {
  const [streak, setStreak] = useState(0);
  const [kp, setKp] = useState(0);

  useEffect(() => {
    // ── Streak Logic ──
    const lastDate = localStorage.getItem('omni-last-study');
    const savedStreak = parseInt(localStorage.getItem('omni-streak') || '0');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        const newStreak = savedStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('omni-streak', newStreak);
      } else {
        setStreak(1);
        localStorage.setItem('omni-streak', '1');
      }
      localStorage.setItem('omni-last-study', today);
    } else {
      setStreak(savedStreak || 1);
    }

    // ── KP Logic (Mock) ──
    const updateKP = () => {
      const savedKp = parseInt(localStorage.getItem('omni-kp') || '120');
      setKp(savedKp);
    };
    updateKP();
    window.addEventListener('storage', updateKP);
    return () => window.removeEventListener('storage', updateKP);
  }, []);

  return (
    <div style={{ padding: '12px', borderTop: '1px solid var(--border-light)', background: 'rgba(255,217,61,0.03)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Streak */}
        <div style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Study Streak</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>{streak} <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>Days</span></span>
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, width: 30, height: 30, background: 'var(--omin-gold)', opacity: 0.1, borderRadius: '50%', blur: '20px' }} />
        </div>
        {/* KP */}
        <div style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Knowledge XP</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 18 }}>💎</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>{kp} <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>KP</span></span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 8, height: 4, background: 'var(--bg-base)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--omin-gold), #fb923c)', boxShadow: '0 0 10px var(--omin-gold)' }} />
      </div>
      <div style={{ fontSize: 8.5, color: 'var(--text-faint)', marginTop: 4, textAlign: 'right', fontWeight: 600 }}>80 KP to Level 4 (Scholar)</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHAT SIDEBAR
══════════════════════════════════════════════════════════ */
export default function ChatSidebar({
  isMobile, sidebarOpen,
  userProfile, theme, setTheme,
  activeSection, activeModels,
  conversations, activeConvId,
  chatHistories, sortedConvs,
  showSearch, setShowSearch,
  renamingId, renameValue, setRenameValue,
  onNewConv, onSelectConv, onPinConv,
  onDeleteConv, onRenameConv, onRenameSubmit,
  onSignOut, onSearchJump,
  removeModelFromChat,
}) {
  if (!sidebarOpen) return null;

  return (
    <motion.aside
      className={isMobile ? 'chat-sidebar-mobile' : ''}
      initial={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }}
      animate={{ width: isMobile ? 280 : 260, opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }}
      transition={{ duration: .25, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur-strong)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, position: isMobile ? 'fixed' : 'relative', zIndex: isMobile ? 150 : 'auto', top: 0, left: 0, bottom: 0 }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <InteractiveLogo size={30} iconSize={18} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-.02em', color: 'var(--text-main)', fontFamily: "'Outfit',sans-serif" }}>
            OMNI AI <span style={{ color: 'var(--accent)' }}>PRO</span>
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.04em' }}>68 Models · 4 Modes</div>
        </div>
      </div>

      {/* New chat + search */}
      <div style={{ padding: '0 10px 10px', display: 'flex', gap: 5, flexShrink: 0 }}>
        <button onClick={onNewConv}
          style={{ flex: 1, padding: '9px 12px', background: 'var(--accent)', color: 'var(--bg-base)', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Outfit',sans-serif", transition: 'all .2s', boxShadow: 'var(--glow-gold)' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--glow-gold-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--glow-gold)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
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
          {showSearch && (
            <SearchPane
              conversations={conversations}
              chatHistories={chatHistories}
              onJump={id => { onSearchJump(id); setShowSearch(false); }}
              onClose={() => setShowSearch(false)}
            />
          )}
        </AnimatePresence>
        <div className="omni-scroll" style={{ height: '100%', overflowY: 'auto', padding: '0 8px' }}>
          {sortedConvs.some(c => c.pinned) && (
            <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 4px', letterSpacing: '.08em', textTransform: 'uppercase' }}>📌 Pinned</div>
          )}
          {sortedConvs.filter(c => c.pinned).map(conv => (
            <ConvItem
              key={conv.id} conv={conv} isActive={activeConvId === conv.id}
              onSelect={() => { onSelectConv(conv.id); if (isMobile) {} }}
              onPin={() => onPinConv(conv.id)}
              onDelete={() => onDeleteConv(conv.id)}
              onRename={() => onRenameConv(conv.id, conv.title)}
              renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue}
              onRenameSubmit={() => onRenameSubmit(conv.id, renameValue)}
            />
          ))}
          {sortedConvs.some(c => !c.pinned) && (
            <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, padding: '8px 4px 4px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Recent</div>
          )}
          {sortedConvs.filter(c => !c.pinned).map(conv => (
            <ConvItem
              key={conv.id} conv={conv} isActive={activeConvId === conv.id}
              onSelect={() => { onSelectConv(conv.id); }}
              onPin={() => onPinConv(conv.id)}
              onDelete={() => onDeleteConv(conv.id)}
              onRename={() => onRenameConv(conv.id, conv.title)}
              renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue}
              onRenameSubmit={() => onRenameSubmit(conv.id, renameValue)}
            />
          ))}
        </div>
      </div>

      {/* Active models strip */}
      {activeSection === 'chat' && (
        <div style={{ padding: '9px 12px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
            Active {activeModels.length > 1 ? `Models (${activeModels.length})` : 'Model'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeModels.slice(0, 3).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px', borderRadius: 7, background: 'var(--bg-hover)', border: '1px solid var(--border-light)' }}>
                <BrandLogo slug={m.slug} color={m.color} size={12} />
                <span style={{ fontSize: 11.5, color: m.color, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                <PlanBadge plan={m.plan} />
                {activeModels.length > 1 && (
                  <button onClick={() => removeModelFromChat(m.id, m.providerId)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 0, lineHeight: 1 }}><IC.X /></button>
                )}
              </div>
            ))}
            {activeModels.length > 3 && <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center' }}>+{activeModels.length - 3} more</div>}
          </div>
        </div>
      )}

      {/* 🚀 New: Student Gamification Dashboard */}
      <StudentProgress />

      {/* User footer */}
      <div style={{ padding: '9px 12px 13px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <UserAvatar profile={userProfile} size={26} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
            style={{ width: 27, height: 27, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
          </button>
          <button onClick={onSignOut} title="Sign out"
            style={{ width: 27, height: 27, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            ⎋
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
