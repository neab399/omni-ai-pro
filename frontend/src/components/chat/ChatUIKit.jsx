import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IC } from '../../lib/models';

/* ══════════════════════════════════════════════════════════
   BRAND LOGO
══════════════════════════════════════════════════════════ */
export function BrandLogo({ slug, color, size = 16 }) {
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
   MODEL AVATAR
══════════════════════════════════════════════════════════ */
export function ModelAvatar({ model, size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {model?.slug
        ? <BrandLogo slug={model.slug} color={model.color || '#888'} size={size * 0.52} />
        : <img src="/logo.png" alt="AI" style={{ width: size * 0.55 }} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   USER AVATAR
══════════════════════════════════════════════════════════ */
export function UserAvatar({ profile, size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', color: 'var(--bg-base)', fontWeight: 700, fontSize: size * 0.38 }}>
      {profile?.avatar
        ? <img src={profile.avatar} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : (profile?.name?.[0] || 'U')}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════════════════ */
export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '6px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-low)' }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
export function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', gap: 7, pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 22, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 22 }}
            onClick={() => removeToast(t.id)}
            style={{ padding: '9px 15px', background: 'var(--bg-panel)', border: `1px solid ${t.type === 'error' ? 'rgba(239,68,68,0.3)' : t.type === 'success' ? 'rgba(34,197,94,0.3)' : 'var(--border-med)'}`, borderRadius: 10, color: 'var(--text-main)', fontSize: 13, cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 9, pointerEvents: 'auto', minWidth: 180 }}
          >
            <span style={{ color: t.type === 'error' ? 'var(--red)' : t.type === 'success' ? 'var(--green)' : 'var(--accent)', fontSize: 15 }}>
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
   PLAN BADGE
══════════════════════════════════════════════════════════ */
export function PlanBadge({ plan }) {
  const cfg = {
    elite: { label: 'Elite', color: '#facc15', bg: 'rgba(250,204,21,.1)' },
    pro:   { label: 'Pro',   color: 'var(--accent)', bg: 'var(--accent-low)' },
    basic: { label: 'Free',  color: 'var(--green)',  bg: 'rgba(34,197,94,.1)' },
  };
  const c = cfg[plan] || cfg.basic;
  return (
    <span style={{ fontSize: 9, fontWeight: 700, color: c.color, background: c.bg, padding: '2px 6px', borderRadius: 99, border: `1px solid ${c.color}33`, letterSpacing: '.06em', textTransform: 'uppercase', flexShrink: 0 }}>
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   ACTION BUTTON (message actions)
══════════════════════════════════════════════════════════ */
export function ActionBtn({ children, onClick, title, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ padding: 5, background: h ? (danger ? 'rgba(239,68,68,.1)' : 'var(--bg-hover)') : 'none', border: 'none', borderRadius: 6, color: h && danger ? 'var(--red)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .12s', display: 'flex', alignItems: 'center' }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR SMALL BUTTON
══════════════════════════════════════════════════════════ */
export function SBtn({ children, onClick, color, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ width: 23, height: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? 'var(--bg-base)' : 'none', border: 'none', borderRadius: 5, color: h && danger ? 'var(--red)' : (color || 'var(--text-muted)'), cursor: 'pointer', transition: 'all .12s' }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   INPUT TOOLBAR BUTTON
══════════════════════════════════════════════════════════ */
export function InputTBtn({ children, title, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(34,197,94,.1)' : h ? 'var(--bg-hover)' : 'none', border: active ? '1px solid rgba(34,197,94,.25)' : '1px solid transparent', borderRadius: 7, color: disabled ? 'var(--text-faint)' : h ? 'var(--text-main)' : 'var(--text-muted)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .14s' }}
    >
      {children}
    </button>
  );
}
