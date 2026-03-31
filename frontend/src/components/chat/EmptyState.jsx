import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMPT_TEMPLATES, IC } from '../../lib/models';
import { BrandLogo } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════════ */
export function EmptyState({ activeModel, onTemplateSelect }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            {activeModel?.slug
              ? <BrandLogo slug={activeModel.slug} color={activeModel.color} size={28} />
              : <img src="/logo.png" alt="O" style={{ width: 28 }} onError={e => e.target.style.display = 'none'} />}
          </div>
          <h2 style={{ fontSize: 21, fontWeight: 700, marginBottom: 7, color: 'var(--text-main)', letterSpacing: '-.02em' }}>
            How can I help you?
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 26, lineHeight: 1.6 }}>
            {activeModel ? `Chatting with ${activeModel.name} — ${activeModel.type}` : 'Start a conversation below.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PROMPT_TEMPLATES.slice(0, 4).map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .28 + i * .06 }}
                whileHover={{ y: -2, borderColor: 'var(--border-focus)' }}
                onClick={() => onTemplateSelect(t.text)}
                style={{ padding: '12px 13px', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-light)', textAlign: 'left', fontFamily: "'Outfit',sans-serif", transition: 'all .14s' }}
              >
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
