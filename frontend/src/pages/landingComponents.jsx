import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';

/* ─── Noise Background ─── */
export const NoiseBg = () => (
  <svg className="noise-bg-mobile fixed inset-0 w-full h-full z-[1] pointer-events-none opacity-[0.03] mix-blend-screen">
    <filter id="omni-noise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter="url(#omni-noise)" />
  </svg>
);

/* ─── Cursor Glow (throttled with rAF) ─── */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);
  useEffect(() => {
    if (isMobile) return;
    const h = e => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => { window.removeEventListener('mousemove', h); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isMobile]);
  if (isMobile) return null;
  return <div className="fixed pointer-events-none z-10 rounded-full mix-blend-screen" style={{ left: pos.x - 300, top: pos.y - 300, width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)', willChange: 'transform', transform: 'translateZ(0)' }} />;
}

/* ─── Magnetic Button ─── */
export function MagBtn({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 }), sy = useSpring(y, { stiffness: 180, damping: 18 });
  const onMove = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * 0.3); y.set((e.clientY - (r.top + r.height / 2)) * 0.3); };
  return <motion.button ref={ref} style={{ x: sx, y: sy }} className={`relative active:scale-95 transition-shadow ${className}`} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>{children}</motion.button>;
}

/* ─── Brand Logo ─── */
export function BrandLogo({ slug, color, name, size = 28 }) {
  const hex = color.replace('#', '');
  const [error, setError] = useState(false);
  if (error || !slug) return <div style={{ width: size, height: size, background: color }} className="rounded-md flex items-center justify-center text-black font-display font-bold text-xs">{name ? name.charAt(0).toUpperCase() : 'A'}</div>;
  return <img src={`https://cdn.simpleicons.org/${slug}/${hex}`} alt={slug} width={size} height={size} className="block object-contain" onError={() => setError(true)} />;
}

/* ─── Marquee (optimized: 2x duplicate instead of 4x) ─── */
export function Marquee({ items, reverse }) {
  const all = [...items, ...items];
  return (
    <div className="overflow-hidden flex">
      <motion.div animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="marquee-track flex flex-shrink-0" style={{ willChange: 'transform' }}>
        {all.map((item, i) => <span key={i} className={`inline-flex items-center gap-2 md:gap-4 px-3 md:px-10 text-[7.5px] sm:text-[9.5px] md:text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap ${i % 2 === 0 ? 'text-omin-gold/70' : 'text-white/40'}`}><span className="text-[4px] md:text-[5px] opacity-30">✦</span>{item}</span>)}
      </motion.div>
    </div>
  );
}

/* ─── 3D Bento Card ─── */
export function BentoCard({ children, className, delay = 0 }) {
  let mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }) { let { left, top } = currentTarget.getBoundingClientRect(); mouseX.set(clientX - left); mouseY.set(clientY - top); }
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={`glass-panel glow-border rounded-2xl md:rounded-[2rem] p-5 md:p-8 relative overflow-hidden group ${className}`} onMouseMove={handleMouseMove}>
      <motion.div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(255,217,61,0.12), transparent 80%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/* ─── Animated Counter ─── */
export function CountUp({ target, suffix = '', className }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { setStarted(true); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let frame; const dur = 2000; const start = performance.now();
    const step = (now) => { const p = Math.min((now - start) / dur, 1); const ease = 1 - Math.pow(1 - p, 4); setCount(Math.floor(ease * target)); if (p < 1) frame = requestAnimationFrame(step); };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);
  return <span ref={ref} className={className}>{count}{suffix}</span>;
}

/* ─── Typewriter ─── */
export function Typewriter({ text, speed = 30, onDone, startDelay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) { clearInterval(iv); onDone?.(); } }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed, onDone]);
  return <>{displayed}<span className="cursor-blink text-omin-gold">▎</span></>;
}

/* ─── Section Header ─── */
export function SectionHeader({ badge, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10 md:mb-20">
      {badge && <div className="text-omin-gold text-[9px] md:text-xs font-bold tracking-[0.25em] uppercase mb-3 md:mb-5">{badge}</div>}
      <h2 className="font-display font-bold text-[1.75rem] md:text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight mb-3 md:mb-6 leading-[1.1] md:leading-tight">{title}</h2>
      {subtitle && <p className="text-white/50 text-[11px] md:text-lg max-w-[280px] md:max-w-2xl mx-auto leading-relaxed px-2 md:px-0">{subtitle}</p>}
    </motion.div>
  );
}
