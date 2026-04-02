import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_IMAGE_MODELS, IMAGE_PROVIDERS, IC } from '../../lib/models';
import { BrandLogo } from './ChatUIKit';
import ModelSelectorModal from './ModelSelectorModal';
import { useAI } from '../../hooks/useAI';

/**
 * Image Generation Section
 * Allows users to choose models and generate high-quality images.
 */
export function ImageSection({ addToast }) {
  const [prompt, setPrompt]           = useState('');
  const [negPrompt, setNegPrompt]     = useState('');
  const [mode, setMode]               = useState('single'); // single | multi
  const [activeModels, setActiveModels] = useState([{ ...ALL_IMAGE_MODELS[0] }]);
  const [showModelSel, setShowModelSel] = useState(false);
  const [results, setResults]         = useState([]); // [{modelId, url, loading}]
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle]             = useState('photorealistic');
  const [ar, setAr]                   = useState('1:1');
  const [quality, setQuality]         = useState('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { callAI } = useAI();

  const STYLES = ['photorealistic', 'anime', 'oil painting', 'cinematic', 'illustration', 'watercolor', '3D render', 'sketch'];
  const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '3:4', '9:16'];
  const QUALITIES = ['standard', 'high', 'ultra'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const models = mode === 'multi' ? activeModels : [activeModels[0]];
    const newResults = models.map(m => ({ modelId: m.id, modelName: m.name, modelColor: m.color, url: null, loading: true, error: null }));
    setResults(newResults);

    models.forEach(async (model, idx) => {
      try {
        const fullPrompt = `${prompt}${style !== 'photorealistic' ? `, ${style} style` : ''}`;
        const data = await callAI('/api/image', {
          prompt: fullPrompt,
          negativePrompt: negPrompt,
          modelId: model.id,
          providerId: model.providerId,
          aspectRatio: ar,
          quality
        });
        
        setResults(prev => prev.map((r, i) => i === idx ? { ...r, loading: false, url: data.url || data.imageUrl || null, error: data.error || null } : r));
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
        if (activeModels.length === 1) { addToast('Need at least 1 model', 'error'); return; }
        setActiveModels(p => p.filter(a => a.id !== model.id));
      } else {
        if (activeModels.length >= 4) { addToast('Max 4 models for comparison', 'error'); return; }
        setActiveModels(p => [...p, m]);
      }
    } else {
      setActiveModels([m]);
      setShowModelSel(false);
    }
  };

  const continueWithModel = (model) => { setActiveModels([model]); setMode('single'); addToast(`Continuing with ${model.name}`, 'success'); };

  const downloadImage = async (url, name) => {
    try {
      const a = document.createElement('a');
      a.href = url; a.download = `omni-${name}-${Date.now()}.png`; a.click();
    } catch (_) { addToast('Download failed', 'error'); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* ── Toolbar ── */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {/* Mode */}
        <div style={{ display: 'flex', background: 'var(--bg-hover)', borderRadius: 8, padding: 3, gap: 2, border: '1px solid var(--border-light)' }}>
          {['single', 'multi'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: mode === m ? 700 : 500, background: mode === m ? 'var(--bg-panel)' : 'transparent', color: mode === m ? 'var(--accent)' : 'var(--text-muted)', boxShadow: mode === m ? 'var(--shadow-sm)' : 'none', transition: 'all .15s', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
              {m === 'multi' ? <><IC.Layers /> Compare</> : <>Single</>}
            </button>
          ))}
        </div>

        {/* Active models */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {activeModels.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'var(--bg-hover)', border: `1px solid ${m.color}44`, fontSize: 12, color: m.color, fontWeight: 600 }}>
              <BrandLogo slug={m.slug} color={m.color} size={11} /> {m.name}
              {mode === 'multi' && activeModels.length > 1 && (
                <button onClick={() => setActiveModels(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 0, marginLeft: 2 }}><IC.X /></button>
              )}
            </div>
          ))}
          <button onClick={() => setShowModelSel(true)}
            style={{ padding: '4px 12px', borderRadius: 20, border: '1px dashed var(--border-med)', background: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <IC.Plus /> {mode === 'multi' ? 'Add' : 'Switch'}
          </button>
        </div>

        {/* Style + AR chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
            {STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={ar} onChange={e => setAr(e.target.value)} style={{ padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 7, fontSize: 12, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
            {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Results area ── */}
      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', background: 'var(--img-bg)' }}>
        {results.length === 0 ? (
          <ImageEmptyState onQuickPrompt={p => setPrompt(p)} />
        ) : (
          <div style={{ maxWidth: mode === 'multi' ? '100%' : 700, margin: '0 auto' }}>
            {mode === 'multi' ? (
              /* Compare grid */
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(results.length, 2)}, 1fr)`, gap: 16 }}>
                {results.map((r, i) => (
                  <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-med)', background: 'var(--bg-card)' }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.modelColor }}>{r.modelName}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.url && <button onClick={() => continueWithModel(activeModels[i])} style={{ padding: '3px 10px', fontSize: 11, fontWeight: 600, background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Outfit',sans-serif" }}>Use <IC.ArrowR /></button>}
                        {r.url && <button onClick={() => downloadImage(r.url, r.modelName)} style={{ padding: '3px 7px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-muted)' }}><IC.Download /></button>}
                      </div>
                    </div>
                    <ImageResult result={r} ar={ar} />
                  </div>
                ))}
              </div>
            ) : (
              /* Single result */
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-med)' }}>
                <ImageResult result={results[0]} ar={ar} large />
                {results[0]?.url && (
                  <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => downloadImage(results[0].url, results[0].modelName)} style={{ padding: '7px 16px', background: 'var(--accent)', color: 'var(--bg-base)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}><IC.Download /> Download</button>
                    <button onClick={() => { setResults([]); setPrompt(''); }} style={{ padding: '7px 14px', background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-light)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>New</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Prompt input ── */}
      <div style={{ padding: '10px 14px 12px', background: 'var(--bg-base)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-med)', borderRadius: 14, overflow: 'hidden' }}>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe the image you want to create… (⌘+Enter to generate)"
              rows={2}
              style={{ width: '100%', padding: '13px 16px', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, color: 'var(--text-main)', lineHeight: 1.6, resize: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setShowAdvanced(p => !p)} style={{ padding: '5px 11px', border: '1px solid var(--border-light)', borderRadius: 7, background: showAdvanced ? 'var(--accent-low)' : 'transparent', color: showAdvanced ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>⚙ Negative Prompt</button>
                <button onClick={() => { const quick = ['sunset over mountains', 'futuristic city', 'portrait of a woman', 'abstract art', 'forest waterfall']; setPrompt(quick[Math.floor(Math.random() * quick.length)]); }} style={{ padding: '5px 11px', border: '1px solid var(--border-light)', borderRadius: 7, background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>✦ Random</button>
              </div>
              <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
                style={{ padding: '8px 22px', background: prompt.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: prompt.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: prompt.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}>
                {isGenerating ? <><span className="spin"><IC.Wand /></span> Generating…</> : <><IC.Wand /> Generate{mode === 'multi' ? ` ×${activeModels.length}` : ''}</>}
              </button>
            </div>
            {showAdvanced && (
              <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border-light)' }}>
                <input value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="What to avoid (e.g. blurry, watermark, extra fingers)…"
                  style={{ width: '100%', padding: '9px 13px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-main)', outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)} onSelect={handleModelSelect} activeModels={activeModels} isMulti={mode === 'multi'} providers={IMAGE_PROVIDERS} title="Choose Image Model" subtitle={mode === 'multi' ? 'Select up to 4 models to compare' : 'Select image generation model'} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageResult({ result, ar, large }) {
  const aspectMap = { '1:1': '100%', '16:9': '56.25%', '4:3': '75%', '3:4': '133%', '9:16': '177.7%' };
  const paddingPct = aspectMap[ar] || '100%';
  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: large ? Math.min(parseFloat(paddingPct), 80) + '%' : '60%', background: 'var(--bg-hover)', overflow: 'hidden' }}>
      {result.loading ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, border: '2px solid var(--border-med)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="spin" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generating with {result.modelName}…</span>
        </div>
      ) : result.error ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, color: 'var(--red)' }}>✕</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '0 16px' }}>{result.error}</span>
        </div>
      ) : result.url ? (
        <img src={result.url} alt="Generated" className="img-appear"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>No image returned</span>
        </div>
      )}
    </div>
  );
}

function ImageEmptyState({ onQuickPrompt }) {
  const ideas = ['A cyberpunk street at night, neon lights reflecting on wet pavement', 'Majestic mountain peaks at golden hour, hyperrealistic', 'Watercolor portrait of a fox in the forest, soft light', 'Abstract geometric art, bold colors, minimalist design', 'Cinematic scene: astronaut walking on alien planet'];
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Create Stunning Images</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>Describe what you want. Choose single generation or compare multiple AI models side by side.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.map((idea, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => onQuickPrompt(idea)}
                style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--text-sec)', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
                ✦ {idea}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
