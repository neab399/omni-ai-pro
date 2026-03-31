import React from 'react';
import { motion } from 'framer-motion';
import { PROMPT_TEMPLATES, IC } from '../../lib/models';
import { BrandLogo } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   EMPTY STATE — Premium responsive layout
══════════════════════════════════════════════════════════ */
export function EmptyState({ activeModel, onTemplateSelect }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
          {/* Model Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 30px rgba(255,217,61,0.08)' }}
          >
            {activeModel?.slug
              ? <BrandLogo slug={activeModel.slug} color={activeModel.color} size={28} />
              : <img src="/logo.png" alt="O" style={{ width: 28 }} onError={e => e.target.style.display = 'none'} />}
          </motion.div>

          {/* Title */}
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 7, color: 'var(--text-main)', letterSpacing: '-.02em' }}>
            How can I help you?
          </h2>

          {/* Subtitle — constrained width for mobile */}
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 28px', padding: '0 8px' }}>
            {activeModel ? `Chatting with ${activeModel.name} — ${activeModel.type}` : 'Start a conversation below.'}
          </p>

          {/* Prompt Templates — single column on mobile, 2 col on larger */}
          <div style={{ display: 'grid', gap: 10, padding: '0 4px' }} className="grid grid-cols-1 sm:grid-cols-2">
            {PROMPT_TEMPLATES.slice(0, 4).map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .25 + i * .08, type: 'spring', bounce: 0.2 }}
                whileHover={{ y: -2, borderColor: 'var(--border-focus)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onTemplateSelect(t.text)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  fontFamily: "'Outfit',sans-serif",
                  transition: 'all .18s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{t.icon}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text.slice(0, 50)}…</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
