import React, { useEffect, useRef, useState, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform, AnimatePresence, useScroll } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { playSelectSound, playHoverSound } from '../lib/audio';

/* ─── Animated Canvas Particle Network ─── */
export function CanvasBackground() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animationFrameId;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const numParticles = Math.min(Math.floor((width * height) / 15000), 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 217, 61, 0.4)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (repel gently)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 150) {
          const force = (150 - distToMouse) / 150;
          p.x -= dx * force * 0.05;
          p.y -= dy * force * 0.05;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 217, 61, ${0.15 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    init();
    draw();

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-[1] pointer-events-none opacity-40 mix-blend-screen" />;
}

// Backward-compat alias — pages that import NoiseBg still work
export const NoiseBg = CanvasBackground;

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
  return <div className="fixed pointer-events-none z-10 rounded-full mix-blend-screen" style={{ left: pos.x - 300, top: pos.y - 300, width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,217,61,0.12) 0%, rgba(59,130,246,0.06) 30%, transparent 70%)', filter: 'blur(60px)', willChange: 'transform', transform: 'translateZ(0)' }} />;
}

/* ─── Scramble Character Reveal ─── */
function ScrambleChar({ char, delay, index }) {
  const GLITCH_CHARS = "!<>-_\\\\/[]{}—=+*^?#________";
  const [charState, setCharState] = useState(char === " " ? "\u00A0" : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
  const [isScrambling, setIsScrambling] = useState(char !== " ");

  useEffect(() => {
    if (char === " ") return;
    let timeout;
    const startDelay = delay * 1000 + index * 40;
    const duration = 300 + Math.random() * 400; 

    const interval = setInterval(() => {
      setCharState(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
    }, 40);

    timeout = setTimeout(() => {
      clearInterval(interval);
      setCharState(char);
      setIsScrambling(false);
    }, startDelay + duration);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [char, delay, index]);

  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: delay + index * 0.02 }}
      className={`inline-block ${isScrambling ? "text-omin-gold opacity-90 font-mono" : ""}`}
      style={{ minWidth: char === " " ? '0.25em' : 'auto' }}
    >
      {charState}
    </motion.span>
  );
}

export function ScrambleText({ text, className, delay = 0 }) {
  const characters = text.split("");
  return (
    <motion.span className={className}>
      {characters.map((char, i) => <ScrambleChar key={i} char={char} delay={delay} index={i} />)}
    </motion.span>
  );
}

/* ─── Staggered Character Reveal ─── */
export function StaggeredText({ text, className, delay = 0 }) {
  const characters = text.split("");
  return (
    <motion.span className={className}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ─── Magnetic Button ─── */
export function MagBtn({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  const [hovered, setHovered] = useState(false);
  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      animate={{
        boxShadow: hovered
          ? '0 0 28px rgba(255,217,61,0.4), 0 0 60px rgba(255,217,61,0.12)'
          : '0 0 0px rgba(255,217,61,0)'
      }}
      transition={{ boxShadow: { duration: 0.3 } }}
      className={`relative overflow-hidden active:scale-95 transition-transform ${className}`}
      onMouseMove={onMove}
      onMouseEnter={() => { setHovered(true); playHoverSound(); }}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      onClick={(e) => { playSelectSound(); onClick?.(e); }}
    >
      {/* Sweeping shimmer on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,217,61,0.45) 50%, transparent 65%)',
          backgroundSize: '250% 100%',
          backgroundPosition: '200% 0',
        }}
        animate={hovered ? { backgroundPosition: ['-200% 0', '200% 0'] } : {}}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
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
        {all.map((item, i) => <span key={i} className={`inline-flex items-center gap-1.5 md:gap-4 px-2 md:px-10 font-bold uppercase whitespace-nowrap ${i % 2 === 0 ? 'text-omin-gold/70' : 'text-white/40'}`} style={{ fontSize: 'clamp(7px, 1.8vw, 11px)', letterSpacing: '0.15em', WebkitTextSizeAdjust: 'none' }}><span style={{ fontSize: '5px' }} className="opacity-30">✦</span>{item}</span>)}
      </motion.div>
    </div>
  );
}

/* ─── 3D Bento Card with Liquid Glassmorphism ─── */
export function BentoCard({ children, className, delay = 0 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const spotX = useMotionValue(-1000);
  const spotY = useMotionValue(-1000);
  const liquidX = useSpring(spotX, { stiffness: 100, damping: 20 });
  const liquidY = useSpring(spotY, { stiffness: 100, damping: 20 });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  function handleMouseMove(e) { 
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect(); 
    spotX.set(e.clientX - rect.left); 
    spotY.set(e.clientY - rect.top); 
    
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    spotX.set(-1000);
    spotY.set(-1000);
  }

  const background1 = useMotionTemplate`radial-gradient(400px circle at ${liquidX}px ${liquidY}px, rgba(255,217,61,0.25), transparent 80%)`;
  const background2 = useMotionTemplate`radial-gradient(600px circle at ${spotX}px ${spotY}px, rgba(59,130,246,0.15), transparent 70%)`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-80px" }} 
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} 
      style={{ perspective: 1500 }}
      className={`relative ${className}`}
    >
      <motion.div 
        style={{ 
          rotateX: isMobile ? 0 : rotateX, 
          rotateY: isMobile ? 0 : rotateY, 
          transformStyle: "preserve-3d" 
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isMobile && playHoverSound()}
        onMouseLeave={handleMouseLeave}
        onClick={() => playSelectSound(0.15)}
        className={`glass-panel glow-border rounded-2xl md:rounded-[2rem] p-5 md:p-8 relative overflow-hidden group h-full w-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow duration-500 cursor-pointer`}
        data-magnetic
      >
        {/* Liquid Border Light (Desktop Only) */}
        {!isMobile && (
          <motion.div 
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100" 
            style={{ 
              background: background1, 
              transform: "translateZ(1px)" 
            }} 
          />
        )}
        {/* Secondary Organic Glow (Desktop Only) */}
        {!isMobile && (
          <motion.div 
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-700 group-hover:opacity-40" 
            style={{ 
              background: background2, 
              transform: "translateZ(2px)" 
            }} 
          />
        )}
        <div className="relative z-10 h-full" style={{ transform: isMobile ? "none" : "translateZ(35px)" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Siri Wave Visualizer ─── */
export function SiriWave({ className }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let phase = 0;
    const colors = ['rgba(34,211,238,0.7)', 'rgba(244,114,182,0.6)', 'rgba(251,191,36,0.5)'];
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += 0.04;
      
      colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        
        const frequency = 0.015 + i * 0.005;
        const amplitude = 30 + i * 10;
        
        for (let x = 0; x < canvas.width; x++) {
          const y = (canvas.height / 2) + Math.sin(x * frequency + phase + i) * (amplitude * Math.sin(phase * 0.5));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    draw();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
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

/* ─── Specialized Loop Typewriter (for terminal demo) ─── */
export function LoopTypewriter({ sequences, speed = 30, deleteSpeed = 20, pause = 2000 }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentFullText = sequences[index].text;

    if (!isDeleting && displayed === currentFullText) {
      // Pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayed === '') {
      // Switch to next sequence
      setIsDeleting(false);
      setIndex((i) => (i + 1) % sequences.length);
    } else {
      // Type or delete
      const nextChar = isDeleting 
        ? currentFullText.slice(0, displayed.length - 1)
        : currentFullText.slice(0, displayed.length + 1);
      
      timeout = setTimeout(() => setDisplayed(nextChar), isDeleting ? deleteSpeed : speed);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, sequences, speed, deleteSpeed, pause]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-omin-gold text-[9.5px] md:text-[11px] font-bold uppercase tracking-wider">{sequences[index].label}</span>
        <span className="text-[8px] md:text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60">{sequences[index].tag}</span>
      </div>
      <div className="border border-white/10 rounded-lg md:rounded-xl bg-[#050505] p-3 md:p-5 overflow-x-auto min-h-[120px]">
        <pre className={`text-[9.5px] md:text-[12.5px] leading-relaxed whitespace-pre ${sequences[index].color || 'text-white/80'}`}>
          {displayed}<span className="cursor-blink text-omin-gold">▎</span>
        </pre>
      </div>
    </div>
  );
}

/* ─── Error Boundary For 3D Assets ─── */
class SplineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Spline Load Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return this.props.fallback || <div className="absolute inset-0 bg-gradient-to-br from-omin-gold/5 to-blue-500/5 backdrop-blur-3xl animate-pulse" />;
    return this.props.children;
  }
}

/* ─── Safe Spline Wrapper ─── */
export function SafeSpline({ scene, onLoad, className, fallback }) {
  return (
    <SplineErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback || <div className="absolute inset-0 bg-omin-black/20 animate-pulse" />}>
        <Spline 
          scene={scene} 
          onLoad={onLoad}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}

/* ─── Floating 3D Orb ─── */
export function Floating3DOrb({ className, scene = "https://prod.spline.design/ATpf-K-V8F1ZIdP6/scene.splinecode" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: loaded ? 1 : 0 }} 
      transition={{ duration: 1 }}
      className={`pointer-events-none ${className}`}
    >
      <SafeSpline 
        scene={scene} 
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
}

/* ─── Section Header with Cinematic Unfold ─── */
export function SectionHeader({ badge, title, subtitle, scramble = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
      className="text-center mb-10 md:mb-20 px-4"
    >
      {badge && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-omin-gold text-[9px] md:text-xs font-bold tracking-[0.35em] uppercase mb-3 md:mb-5"
        >
          {badge}
        </motion.div>
      )}
      <motion.h2 
        initial={{ letterSpacing: "0.2em", scale: 0.95, opacity: 0 }}
        whileInView={{ letterSpacing: "-0.02em", scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="font-display font-bold text-[1.75rem] md:text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight mb-3 md:mb-6 leading-[1.1] md:leading-tight"
      >
        {scramble ? <ScrambleText text={title} /> : title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/50 text-[11px] md:text-lg max-w-[280px] md:max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Parallax Layer ─── */
export function ParallaxLayer({ children, speed = 0.5, className }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500 * speed]);
  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
