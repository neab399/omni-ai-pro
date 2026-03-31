import React from 'react';
import { motion } from 'framer-motion';
import { IC } from '../../lib/models';

/* ══════════════════════════════════════════════════════════
   SECTION DEFINITIONS
══════════════════════════════════════════════════════════ */
export const SECTIONS = [
  { id: 'chat',  label: 'Chat',  icon: IC.Chat  },
  { id: 'image', label: 'Image', icon: IC.Image  },
  { id: 'voice', label: 'Voice', icon: IC.Volume },
  { id: 'video', label: 'Video', icon: IC.Video  },
];

/* ══════════════════════════════════════════════════════════
   SECTION TABS — Responsive: icons-only on mobile
══════════════════════════════════════════════════════════ */
export default function SectionTabs({ active, onChange }) {
  return (
    <div className="chat-section-tabs-mobile" style={{ display: 'flex', gap: 2, background: 'var(--bg-hover)', borderRadius: 11, padding: 3, border: '1px solid var(--border-light)', backdropFilter: 'var(--panel-blur)', flexShrink: 0 }}>
      {SECTIONS.map(s => {
        const isActive = s.id === active;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px 10px',
              borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: isActive ? 700 : 500,
              background: isActive ? 'var(--bg-panel)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              boxShadow: isActive ? 'var(--shadow-sm), var(--glow-gold)' : 'none',
              transition: 'all .22s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: "'Outfit',sans-serif",
              letterSpacing: isActive ? '0.02em' : '0',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon />
            <span className="hidden sm:inline">{s.label}</span>
            {isActive && <span className="sm:hidden" style={{ fontSize: 10, fontWeight: 700 }}>{s.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
