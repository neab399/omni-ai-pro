import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IC } from '../../lib/models';
import { BrandLogo, PlanBadge } from './ChatUIKit';

/* ══════════════════════════════════════════════════════════
   MODEL SELECTOR MODAL
══════════════════════════════════════════════════════════ */
export default function ModelSelectorModal({ onClose, onSelect, activeModels, isMulti, providers, title, subtitle }) {
  const [search, setSearch] = useState('');

  const allModels = providers.flatMap(p =>
    p.models.map(m => ({ ...m, providerId: p.id, providerName: p.name, slug: p.slug, color: p.color }))
  );

  const filtered = useMemo(() => {
    if (!search) return allModels;
    const q = search.toLowerCase();
    return allModels.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.providerName.toLowerCase().includes(q)
    );
  }, [search, allModels]);

  const isActive = m => activeModels.some(a => a.id === m.id && a.providerId === m.providerId);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur-strong)', border: '1px solid var(--border-med)', borderRadius: 20, width: '92%', maxWidth: 860, maxHeight: '84vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg), var(--glow-gold)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)', marginBottom: 4 }}>
              {title || 'Choose Model'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {subtitle || (isMulti ? 'Select multiple to compare side by side' : 'Select one model')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <IC.X />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 24px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <IC.Search />
            </div>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search models…"
              style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 13.5, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>
        </div>

        {/* Model list */}
        <div className="omni-scroll" style={{ padding: '0 24px 24px', overflowY: 'auto', flex: 1 }}>
          {providers
            .filter(p => p.models.some(m => filtered.some(f => f.id === m.id && f.providerId === p.id)))
            .map(provider => (
              <div key={provider.id} style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <BrandLogo slug={provider.slug} color={provider.color} size={14} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: provider.color, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                    {provider.name}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
                  {filtered.filter(m => m.providerId === provider.id).map(model => {
                    const active = isActive(model);
                    return (
                      <motion.div
                        key={model.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: .97 }}
                        onClick={() => onSelect(model, provider)}
                        style={{ padding: '12px 13px', borderRadius: 12, cursor: 'pointer', background: active ? `${provider.color}0f` : 'var(--bg-card)', border: `1px solid ${active ? provider.color : 'var(--border-light)'}`, position: 'relative', transition: 'all .15s' }}
                      >
                        {active && (
                          <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IC.Check />
                          </div>
                        )}
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
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              No models found for "{search}"
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
