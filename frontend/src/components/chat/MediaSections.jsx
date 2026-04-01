import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_IMAGE_MODELS, ALL_AUDIO_MODELS, ALL_VIDEO_MODELS, IMAGE_PROVIDERS, AUDIO_PROVIDERS, VIDEO_PROVIDERS, IC, genId } from '../../lib/models';
import { BrandLogo, ModelAvatar } from './ChatUIKit';
import ModelSelectorModal from './ModelSelectorModal';

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
        const response = await fetch('https://omni-ai-pro.onrender.com/api/image', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: fullPrompt, negativePrompt: negPrompt, modelId: model.id, providerId: model.providerId, aspectRatio: ar, quality })
        });
        const data = await response.json();
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

export function ImageResult({ result, ar, large }) {
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

export function ImageEmptyState({ onQuickPrompt }) {
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

/* ══════════════════════════════════════════════════════════
   VOICE SECTION
══════════════════════════════════════════════════════════ */
export function VoiceSection({ addToast }) {
  const [tab, setTab]                 = useState('stt'); // stt | tts
  const [activeSTTModel, setSTTModel] = useState(ALL_AUDIO_MODELS.find(m => m.mode === 'stt'));
  const [activeTTSModel, setTTSModel] = useState(ALL_AUDIO_MODELS.find(m => m.mode === 'tts'));
  const [showModelSel, setShowModelSel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [ttsText, setTtsText]         = useState('');
  const [isPlaying, setIsPlaying]     = useState(false);
  const [audioFile, setAudioFile]     = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voice, setVoice]             = useState('alloy');
  const [speed, setSpeed]             = useState(1.0);
  const fileRef                       = useRef(null);
  const recognitionRef                = useRef(null);
  const audioRef                      = useRef(null);

  const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast('Speech recognition not supported in this browser', 'error'); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
    recognition.onresult = e => {
      let full = '';
      for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript;
      setTranscript(full);
    };
    recognition.onerror = () => { setIsListening(false); addToast('Mic error', 'error'); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const handleFileUpload = async (f) => {
    setAudioFile(f); setIsTranscribing(true);
    try {
      const formData = new FormData(); formData.append('file', f); formData.append('model', 'whisper-1');
      const res = await fetch('https://omni-ai-pro.onrender.com/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      setTranscript(data.text || 'Transcription complete.');
      addToast('Transcription done!', 'success');
    } catch (err) { addToast('Transcription failed: ' + err.message, 'error'); }
    setIsTranscribing(false);
  };

  const handleTTS = async () => {
    if (!ttsText.trim()) return;
    setIsPlaying(true);
    try {
      const res = await fetch('https://omni-ai-pro.onrender.com/api/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText, voice, speed, modelId: activeTTSModel?.id })
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
    } catch (err) { addToast('TTS failed: ' + err.message, 'error'); }
    setIsPlaying(false);
  };

  const copyTranscript = () => { navigator.clipboard.writeText(transcript); addToast('Copied!', 'success'); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />

      {/* Tab row */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 3, background: 'var(--bg-hover)', borderRadius: 8, padding: 3, border: '1px solid var(--border-light)' }}>
          {[['stt', '🎙 Speech to Text'], ['tts', '🔊 Text to Speech']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: tab === id ? 700 : 500, background: tab === id ? 'var(--bg-panel)' : 'transparent', color: tab === id ? 'var(--accent)' : 'var(--text-muted)', boxShadow: tab === id ? 'var(--shadow-sm)' : 'none', transition: 'all .15s', fontFamily: "'Outfit',sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <ModelAvatar model={tab === 'stt' ? activeSTTModel : activeTTSModel} size={22} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{tab === 'stt' ? activeSTTModel?.name : activeTTSModel?.name}</span>
          <button onClick={() => setShowModelSel(true)} style={{ padding: '3px 9px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'Outfit',sans-serif" }}>Change</button>
        </div>
      </div>

      <div className="omni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {tab === 'stt' ? (
            /* ── STT ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Live mic card */}
              <div style={{ borderRadius: 16, border: '1px solid var(--border-med)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Live Microphone</span>
                  {isListening && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)', background: 'rgba(239,68,68,.1)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(239,68,68,.3)', animation: 'omni-pulse 1s ease infinite' }}>LIVE</span>}
                </div>
                <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  {/* Mic button */}
                  <motion.button onClick={isListening ? stopListening : startListening}
                    whileTap={{ scale: .93 }}
                    animate={isListening ? { boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 18px rgba(239,68,68,.15)', '0 0 0 0 rgba(239,68,68,0)'] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 80, height: 80, borderRadius: '50%', background: isListening ? 'rgba(239,68,68,.12)' : 'var(--bg-hover)', border: `2px solid ${isListening ? 'var(--red)' : 'var(--border-med)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                    <svg width="28" height="28" fill="none" stroke={isListening ? 'var(--red)' : 'var(--text-muted)'} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                  </motion.button>
                  {/* Waveform bars */}
                  {isListening && (
                    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} style={{ width: 3, background: 'var(--red)', borderRadius: 2, animation: `wave ${.4 + Math.random() * .4}s ease-in-out infinite`, animationDelay: `${i * .07}s`, height: 6 + Math.random() * 20, opacity: .7 }} />
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{isListening ? 'Tap to stop' : 'Tap to start recording'}</span>
                </div>
              </div>

              {/* File upload card */}
              <div style={{ borderRadius: 16, border: '1px solid var(--border-med)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Upload Audio File</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input ref={fileRef} type="file" accept="audio/*,.mp3,.mp4,.wav,.m4a,.ogg,.webm" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileUpload(e.target.files[0])} />
                  <div onClick={() => fileRef.current?.click()}
                    style={{ padding: '24px', border: '2px dashed var(--border-med)', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-low)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.background = 'transparent'; }}>
                    {isTranscribing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <span className="spin"><IC.Refresh /></span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Transcribing…</span>
                      </div>
                    ) : audioFile ? (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>📂 {audioFile.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(audioFile.size / 1024 / 1024).toFixed(1)} MB · Click to change</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🎙</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Drop audio file or click to browse</div>
                        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>MP3, MP4, WAV, M4A, OGG, WebM</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transcript */}
              {transcript && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Transcript</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={copyTranscript} style={{ padding: '4px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}><IC.Copy /> Copy</button>
                      <button onClick={() => setTranscript('')} style={{ padding: '4px 9px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)' }}><IC.X /></button>
                    </div>
                  </div>
                  <div style={{ padding: '16px', fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.7 }}>{transcript}</div>
                </motion.div>
              )}
            </div>
          ) : (
            /* ── TTS ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Voice + speed settings */}
              <div style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', padding: '16px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Voice Settings</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Voice</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {VOICES.map(v => (
                        <button key={v} onClick={() => setVoice(v)}
                          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${voice === v ? 'var(--accent)' : 'var(--border-light)'}`, background: voice === v ? 'var(--accent-low)' : 'transparent', color: voice === v ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .14s', fontWeight: voice === v ? 700 : 400 }}>
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Speed — {speed.toFixed(1)}x</div>
                    <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Text area */}
              <div style={{ borderRadius: 14, border: '1px solid var(--border-med)', background: 'var(--bg-card)', overflow: 'hidden' }}>
                <textarea value={ttsText} onChange={e => setTtsText(e.target.value)}
                  placeholder="Type or paste text to convert to speech…"
                  rows={6}
                  style={{ width: '100%', padding: '16px', background: 'transparent', border: 'none', outline: 'none', fontSize: 14.5, color: 'var(--text-main)', lineHeight: 1.7, resize: 'none', fontFamily: "'Outfit',sans-serif' " }} />
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ttsText.length} chars · ~{Math.ceil(ttsText.length / 15)}s audio</span>
                  <button onClick={handleTTS} disabled={!ttsText.trim() || isPlaying}
                    style={{ padding: '8px 22px', background: ttsText.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: ttsText.trim() ? 'var(--bg-base)' : 'var(--text-muted)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: ttsText.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: 7 }}>
                    {isPlaying ? <><span className="spin"><IC.Volume /></span> Speaking…</> : <><IC.Play /> Speak</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModelSel && (
          <ModelSelectorModal onClose={() => setShowModelSel(false)}
            onSelect={(model, provider) => {
              const m = { ...model, providerId: provider.id, slug: provider.slug, color: provider.color };
              if (tab === 'stt') setSTTModel(m); else setTTSModel(m);
              setShowModelSel(false);
            }}
            activeModels={tab === 'stt' ? [activeSTTModel] : [activeTTSModel]}
            isMulti={false}
            providers={AUDIO_PROVIDERS.map(p => ({ ...p, models: p.models.filter(m => tab === 'stt' ? m.mode === 'stt' : m.mode === 'tts') })).filter(p => p.models.length > 0)}
            title={tab === 'stt' ? 'Choose Transcription Model' : 'Choose Voice Model'} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VIDEO SECTION
══════════════════════════════════════════════════════════ */
export function VideoSection({ addToast }) {
  const [prompt, setPrompt]           = useState('');
  const [mode, setMode]               = useState('single');
  const [activeModels, setActiveModels] = useState([ALL_VIDEO_MODELS[0]]);
  const [showModelSel, setShowModelSel] = useState(false);
  const [results, setResults]         = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration]       = useState('5s');
  const [motion, setMotion]           = useState('medium');

  const DURATIONS = ['3s', '5s', '10s', '20s'];
  const MOTIONS = ['slow', 'medium', 'fast', 'cinematic'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const models = mode === 'multi' ? activeModels : [activeModels[0]];
    setResults(models.map(m => ({ modelId: m.id, modelName: m.name, modelColor: m.color, url: null, loading: true, error: null })));

    models.forEach(async (model, idx) => {
      try {
        const res = await fetch('https://omni-ai-pro.onrender.com/api/video', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, modelId: model.id, providerId: model.providerId, duration, motion })
        });
        const data = await res.json();
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

export function VideoEmptyState({ onQuickPrompt }) {
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

/* ══════════════════════════════════════════════════════════
   CHAT MESSAGE BUBBLE
══════════════════════════════════════════════════════════ */