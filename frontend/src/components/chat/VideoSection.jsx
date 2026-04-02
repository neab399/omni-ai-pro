import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_VIDEO_MODELS, VIDEO_PROVIDERS, IC } from '../../lib/models';
import { BrandLogo } from './ChatUIKit';
import ModelSelectorModal from './ModelSelectorModal';
import { useAI } from '../../hooks/useAI';

/**
 * Video Generation Section
 * Creates cinematic videos from text prompts.
 */
export function VideoSection({ addToast }) {
  const [prompt, setPrompt]           = useState('');
  const [mode, setMode]               = useState('single');
  const [activeModels, setActiveModels] = useState([ALL_VIDEO_MODELS[0]]);
  const [showModelSel, setShowModelSel] = useState(false);
  const [results, setResults]         = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration]       = useState('5s');
  const [motion, setMotion]           = useState('medium');

  const { callAI } = useAI();

  const DURATIONS = ['3s', '5s', '10s', '20s'];
  const MOTIONS = ['slow', 'medium', 'fast', 'cinematic'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const models = mode === 'multi' ? activeModels : [activeModels[0]];
    setResults(models.map(m => ({ modelId: m.id, modelName: m.name, modelColor: m.color, url: null, loading: true, error: null })));

    models.forEach(async (model, idx) => {
      try {
        const data = await callAI('/api/video', {
          prompt,
          modelId: model.id,
          providerId: model.providerId,
          duration,
          motion
        });
        
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, url: data.url || null, error: data.error || null } : r));
      } catch (err) {
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, error: err.message } : r));
      }
    });
    setIsGenerating(false);
  };

  const handleModelSelect = (model, provider) => {
    const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
    if (mode === 'multi') {
      if (activeModels.find(a => a.id === model.id)) {
        if (activeModels.length === 1) return;
        setActiveModels(p => p.filter(a => a.id !== model.id));
      } else setActiveModels(p => [...p, m]);
    } else { setActiveModels([m]); setShowModelSel(false); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 8, padding: 3, border: '1px solid var(--border-light)' }}>
          {['single', 'multi'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: mode === m ? 700 : 500, background: mode === m ? 'var(--bg-panel)' : 'transparent', color: mode === m ? 'var(--accent)' : 'var(--text-muted)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}>
              {m === 'multi' ? '⇌ Compare' : 'Single'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {activeModels.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'var(--bg-hover)', border: `1px solid ${m.color}44`, fontSize: 12, color: m.color, fontWeight: 600 }}>
              <BrandLogo slug={m.slug} color={m.color} size={11} /> {m.name}
              {mode === 'multi' && activeModels.length > 1 && <button onClick={() => setActiveModels(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 0 }}><IC.X /></button>}
            </div>
          ))}
          <button onClick={() => setShowModelSel(true)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px dashed var(--border-med)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><IC.Plus /> {mode === 'multi' ? 'Add' : 'Switch'}</button>
        </div>
        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={motion} onChange={e => setMotion(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
          {MOTIONS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)} motion</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', background: 'var(--img-bg)' }}>
        {results.length === 0 ? (
          <VideoEmptyState onQuickPrompt={setPrompt} />
        ) : (
          <div style={{ maxWidth: mode === 'multi' ? '100%' : 760, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mode === 'multi' && results.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }}>
              {results.map((r, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-med)', background: 'var(--bg-card)' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.modelColor }}>{r.modelName}</span>
                    {r.url && <a href={r.url} download style={{ padding: '3px 9px', background: 'var(--accent)', color: 'var(--bg-base)', border: 'none', borderRadius: 5, fontSize: 11, cursor: 'pointer', textDecoration: 'none', fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>⬇ Download</a>}
                  </div>
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: 'var(--bg-hover)' }}>
                    {r.loading ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                        <div style={{ width: 38, height: 38, border: '2px solid var(--border-med)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="spin" />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generating video… this may take a minute</span>
                      </div>
                    ) : r.error ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24, color: 'var(--red)' }}>✕</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>{r.error}</span>
                      </div>
                    ) : r.url ? (
                      <video src={r.url} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prompt input */}
      <div style={{ padding: '10px 14px 12px', background: 'var(--bg-base)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe the video scene… (e.g. A slow pan across a mountain lake at sunrise, cinematic, 4K)"
              rows={2}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6, resize: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
              style={{ padding: '10px 22px', background: prompt.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: prompt.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: prompt.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              {isGenerating ? <><span className="spin"><IC.Video /></span> Generating…</> : <><IC.Video /> Generate</>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)} onSelect={handleModelSelect} activeModels={activeModels} isMulti={mode === 'multi'} providers={VIDEO_PROVIDERS} title="Choose Video Model" subtitle="AI video generation models" />
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoEmptyState({ onQuickPrompt }) {
  const ideas = ['A slow pan across misty mountain peaks at sunrise', 'Underwater scene with colorful coral reef and tropical fish', 'Time-lapse of a city at night, neon lights, rain on the streets', 'A majestic eagle soaring over the Grand Canyon'];
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Hollywood-Style Video AI</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Generate cinematic videos from text. Compare Sora vs Kling side by side.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.map((idea, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}
                onClick={() => onQuickPrompt(idea)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-sec)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                ▷ {idea}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
