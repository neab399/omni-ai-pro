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
