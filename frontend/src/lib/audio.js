export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  
  if (!window.__omniAudioCtx__) {
    window.__omniAudioCtx__ = new AudioContext();
  }
  return window.__omniAudioCtx__;
};

// Browser requires a user interaction to resume audio context
export const initAudioContext = () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
};

/* ── SFX: Sent Message (Low rising pop) ── */
export const playSendSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

/* ── SFX: Receive Message (High soft ping) ── */
export const playReceiveSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

/* ── SFX: Error (Dull Thud) ── */
export const playErrorSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

/* ── PRELOADING & BUFFERED SFX ── */
let selectBuffer = null;

export const preloadSounds = async () => {
  const ctx = getAudioContext();
  if (!ctx || selectBuffer) return;
  try {
    const res = await fetch('/sounds/select.wav');
    const arrayBuffer = await res.arrayBuffer();
    selectBuffer = await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn("Failed to preload sounds:", err);
  }
};

/* ── SFX: Modern Technology Select (Ultra-Premium) ── */
export const playSelectSound = (volume = 0.25) => {
  const ctx = getAudioContext();
  if (!ctx || !selectBuffer) return;
  initAudioContext();
  
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = selectBuffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
};

/* ── SFX: Haptic Hover Tick ── */
export const playHoverSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);
  
  filter.type = 'highpass';
  filter.frequency.value = 1500;
  
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

/* ── SFX: JARVIS-Style System Startup (Ultra-Premium Synthesis) ── */
export const playSystemStartupSFX = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  initAudioContext();
  
  const now = ctx.currentTime;
  
  // ── Layer 1: The "Riser" (Power up sweep)
  const riser = ctx.createOscillator();
  const riserGain = ctx.createGain();
  riser.type = 'sine';
  riser.frequency.setValueAtTime(110, now);
  riser.frequency.exponentialRampToValueAtTime(440, now + 1.2);
  riserGain.gain.setValueAtTime(0, now);
  riserGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
  riserGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
  riser.connect(riserGain);
  riserGain.connect(ctx.destination);
  
  // ── Layer 2: Digital HUD Bleeps (The "Tri-Tone")
  const playBleep = (freq, time, dur) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, now + time);
    g.gain.linearRampToValueAtTime(0.03, now + time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
    osc.connect(g);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    g.connect(filter);
    filter.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur + 0.1);
  };
  
  playBleep(880, 0.4, 0.08); // Bleep 1
  playBleep(1320, 0.52, 0.08); // Bleep 2
  playBleep(1760, 0.64, 0.12); // Final Bleep
  
  // ── Layer 3: Atmospheric Static Burst
  const noise = ctx.createBufferSource();
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.02, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  
  riser.start(now);
  riser.stop(now + 1.3);
  noise.start(now);
};
