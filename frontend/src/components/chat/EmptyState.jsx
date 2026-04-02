import React from 'react';
import { motion } from 'framer-motion';
import { PROMPT_TEMPLATES, IC } from '../../lib/models';
import { BrandLogo } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   EMPTY STATE — Premium responsive layout
══════════════════════════════════════════════════════════ */
export function EmptyState({ activeModel, onTemplateSelect }) {
  // ─── Scramble Hook (God-Tier Aesthetic) ───
  const [title, setTitle] = React.useState('');
  const fullTitle = "How can I help you?";
  
  React.useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setTitle(fullTitle.split('').map((char, index) => {
        if(index < iteration) return fullTitle[index];
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
      }).join(''));
      
      if(iteration >= fullTitle.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
          
          {/* Model Avatar with Sentient Glow */}
          <div style={{ position: 'relative', margin: '0 auto 24px', width: 64, height: 64 }}>
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               style={{ position: 'absolute', inset: -10, borderRadius: 20, background: activeModel?.color || 'var(--accent)', filter: 'blur(20px)', zIndex: -1 }}
             />
             <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
                style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-panel)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}
              >
                {activeModel?.slug
                  ? <BrandLogo slug={activeModel.slug} color={activeModel.color} size={32} />
                  : <img src="/logo.png" alt="O" style={{ width: 32 }} onError={e => e.target.style.display = 'none'} />}
              </motion.div>
          </div>

          {/* Scramble Title */}
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', letterSpacing: '-.03em', fontFamily: "'Outfit', sans-serif" }}>
            {title}
          </h2>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 32px' }}
          >
            {activeModel ? `Harnessing ${activeModel.name} power — ${activeModel.type}` : 'Ready for a new era of intelligence.'}
          </motion.p>

          {/* Prompt Templates — Cascade Unfold */}
          <div style={{ display: 'grid', gap: 12, padding: '0 4px' }} className="grid grid-cols-1 sm:grid-cols-2">
            {PROMPT_TEMPLATES.slice(0, 4).map((t, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, rotateX: -30, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, borderColor: 'var(--accent)', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTemplateSelect(t.text)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 18,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  fontFamily: "'Outfit',sans-serif",
                  transition: 'border-color .2s, background .2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  perspective: '1000px',
                  willChange: 'transform, opacity'
                }}
              >
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{t.icon}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
