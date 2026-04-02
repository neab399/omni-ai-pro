import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_AUDIO_MODELS, AUDIO_PROVIDERS, IC } from '../../lib/models';
import { ModelAvatar } from './ChatUIKit';
import ModelSelectorModal from './ModelSelectorModal';
import { useAI } from '../../hooks/useAI';
import { supabase } from '../../lib/supabase';

/**
 * Voice Section
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS).
 */
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

  const { API_BASE } = useAI();

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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const formData = new FormData(); 
      formData.append('file', f); 
      formData.append('model', 'whisper-1');
      
      const res = await fetch(`${API_BASE}/api/transcribe`, { 
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData 
      });
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
      // 0-Cost Native Browser Speech
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.rate = speed;
      
      // Match voice if possible
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const selected = voices.find(v => v.name.toLowerCase().includes(voice)) || voices[0];
        utterance.voice = selected;
      }
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) { 
      addToast('Browser text-to-speech failed', 'error'); 
      setIsPlaying(false);
    }
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
