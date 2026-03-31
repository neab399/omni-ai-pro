import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chutexfnzoylpuikeblz.supabase.co';
const supabaseKey = 'sb_publishable_M_oSfDnhS18elv7J3hsWjw_wcZk6bFp';
const supabase = createClient(supabaseUrl, supabaseKey);

function BrandLogo({ slug, color, name, size = 28 }) {
  const hex = color.replace('#', '');
  const [error, setError] = useState(false);
  if (error || !slug) {
    return (
      <div style={{ width: size, height: size, background: color }} className="rounded-md flex items-center justify-center text-black font-display font-bold text-xs">
        {name ? name.charAt(0).toUpperCase() : 'A'}
      </div>
    );
  }
  return <img src={`https://cdn.simpleicons.org/${slug}/${hex}`} alt={slug} width={size} height={size} className="block object-contain" onError={() => setError(true)} />;
}

const NoiseBg = () => (
  <svg className="fixed inset-0 w-full h-full z-[1] pointer-events-none opacity-[0.035] mix-blend-screen">
    <filter id="omni-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#omni-noise)" />
  </svg>
);

function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-10 rounded-full transition-all duration-75 ease-linear mix-blend-screen"
      style={{ left: pos.x - 300, top: pos.y - 300, width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)' }}
    />
  );
}

function MagBtn({ children, className, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`relative active:scale-95 transition-shadow ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

const TOTAL_MODELS_COUNT = 68;
const MODELS = [
  { name: 'Claude 4.6 Opus', maker: 'Anthropic', color: '#e8a85f', use: 'God-Tier Reasoning', slug: 'anthropic' },
  { name: 'GPT-5.4', maker: 'OpenAI', color: '#10a37f', use: 'Elite Logic & Coding', slug: 'openai' },
  { name: 'Gemini 3.1 Pro', maker: 'Google', color: '#4285f4', use: '2M Token Context', slug: 'googlegemini' },
  { name: 'Midjourney v7', maker: 'Midjourney', color: '#ffffff', use: 'Studio Image Gen', slug: 'midjourney' },
  { name: 'DeepSeek V3.2', maker: 'DeepSeek', color: '#4d6bfe', use: 'Math & Prose King', slug: 'deepseek' },
  { name: 'Sora Video AI', maker: 'OpenAI', color: '#ab68ff', use: 'Text to Video AI', slug: 'openai' },
  { name: 'Grok 4.1 Fast', maker: 'xAI', color: '#000000', use: 'Uncensored Real-time', slug: 'x' },
  { name: 'Flux Pro', maker: 'Black Forest', color: '#ff4d6d', use: 'HD Image Gen', slug: 'flux' }
];

const MARQUEE_A = ['GPT-5.4', 'Claude 4.6', 'Gemini 3.1', 'Midjourney v7', 'WhisperFlow', 'Flux Pro', 'DeepSeek', 'Sora Video'];

function Marquee({ items, reverse }) {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden flex">
      <motion.div animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="flex flex-shrink-0">
        {all.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-4 px-10 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap ${i % 2 === 0 ? 'text-omin-gold/70' : 'text-white/40'}`}>
            <span className="text-[6px] opacity-30">✦</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** 3D Bento Card component */
function BentoCard({ children, className, style, delay = 0 }) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel glow-border rounded-[2rem] p-8 relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      style={style}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,217,61,0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Master Scroll Physics
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const navBg = useTransform(scrollYProgress, [0, 0.02], ['rgba(5,5,5,0)', 'rgba(5,5,5,0.85)']);
  const navBorder = useTransform(scrollYProgress, [0, 0.02], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)']);

  // Hero Parallax
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  // Dashboard Mockup 3D Apple-style Scroll
  const dashboardScale = useTransform(scrollYProgress, [0.05, 0.25], [0.85, 1]);
  const dashboardRotateX = useTransform(scrollYProgress, [0.05, 0.25], [20, 0]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0.3, 1]);
  const dashboardY = useTransform(scrollYProgress, [0.05, 0.25], [100, 0]);

  const [liveModel, setLiveModel] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLiveModel(p => (p + 1) % 8), 3000);
    return () => clearInterval(t);
  }, []);

  const handleOAuthLogin = async (providerName) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: providerName, options: { redirectTo: `${window.location.origin}/chat` } });
    if (error) alert(`${providerName} Login failed: ` + error.message);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/chat` } });
    setLoading(false);
    if (error) alert(error.message); else setEmailSent(true);
  };

  const handleLogout = async () => await supabase.auth.signOut();
  const triggerAuth = () => user ? navigate('/chat') : setShowAuthModal(true);

  // Stagger Text Reveal Arrays
  const heroLine1 = "68 AI MODELS.".split(" ");
  const heroLine2 = "ONE DASHBOARD.".split(" ");

  return (
    <div ref={containerRef} className="h-screen w-full relative bg-omin-black text-white selection:bg-omin-gold/30 perspective-[1000px] overflow-hidden">
      {/* Set the main container scroll wrapper */}
      <div className="absolute inset-0 h-full w-full overflow-y-scroll overflow-x-hidden">
        
        <NoiseBg />
        <CursorGlow />

        {/* Background Orbs Parallax */}
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 500]) }} className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-omin-gold/5 blur-[120px] pointer-events-none mix-blend-screen" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -400]) }} className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none mix-blend-screen" />

        {/* AUTH MODAL */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-2xl">
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="w-full max-w-[400px] p-8 rounded-3xl glass-panel relative shadow-[0_0_60px_rgba(255,217,61,0.1)]">
                <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors text-xl">✕</button>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-display font-bold tracking-tight mb-2">Welcome to OMNI AI</h2>
                  <p className="text-sm text-white/50">Log in or sign up to continue.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleOAuthLogin('google')} className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google
                  </button>
                  <button onClick={() => handleOAuthLogin('github')} className="w-full py-3 bg-[#111] text-white border border-white/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#222] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> Continue with GitHub
                  </button>
                </div>
                <div className="flex items-center gap-4 my-6 opacity-30">
                  <div className="flex-1 h-px bg-white"></div>
                  <span className="text-[10px] font-bold tracking-widest uppercase">Or Email</span>
                  <div className="flex-1 h-px bg-white"></div>
                </div>
                {!emailSent ? (
                  <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                    <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-omin-gold outline-none transition-colors" />
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-omin-gold text-black rounded-xl text-sm font-bold hover:bg-omin-gold/90 transition-colors shadow-[0_0_20px_rgba(255,217,61,0.2)]">{loading ? 'Sending...' : 'Send Magic Link ✨'}</button>
                  </form>
                ) : (
                  <div className="text-center py-4 glass-pill rounded-xl">
                    <p className="text-emerald-400 font-bold mb-1">Check your email!</p>
                    <p className="text-xs text-white/50">Magic link sent to {email}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAV */}
        <motion.nav style={{ background: navBg, borderBottomColor: navBorder }} className="fixed top-0 z-[100] w-full h-[72px] flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl border-b border-transparent transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-omin-gold rounded shadow-[0_0_15px_rgba(255,217,61,0.3)] flex items-center justify-center text-black font-display font-black text-xs">O</div>
            <span className="font-display font-bold tracking-tight text-[15px]">OMNI AI <span className="text-omin-gold">PRO</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] text-white/50 font-semibold tracking-wide">
            {['Features', 'Compare'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors uppercase text-[11px] tracking-widest">{l}</a>)}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
               <button onClick={handleLogout} className="text-red-400 text-[13px] font-semibold hover:text-red-300">Log Out</button>
            ) : (
              <button onClick={triggerAuth} className="text-white/60 text-[13px] font-semibold hover:text-white transition-colors">Log In</button>
            )}
            <MagBtn onClick={triggerAuth} className="bg-omin-gold text-black px-6 py-2.5 rounded-full text-[13px] font-bold shadow-[0_4px_20px_rgba(255,217,61,0.25)] hover:shadow-[0_4px_30px_rgba(255,217,61,0.4)] transition-all">
              {user ? 'Go to Chat →' : 'Start Free →'}
            </MagBtn>
          </div>
        </motion.nav>

        <main className="relative z-10 w-full overflow-x-hidden">
          
          {/* HERO */}
          <motion.section style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative flex flex-col items-center justify-center min-h-[95vh] text-center px-4 pt-32 pb-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 mb-10">
              <span className="glass-pill px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/20">
                <span className="text-omin-gold mr-2">✦</span>The Ultimate AI Aggregator
              </span>
            </motion.div>

            <h1 className="relative z-10 font-display font-bold text-[clamp(3.5rem,8vw,9rem)] leading-[0.9] tracking-tighter mb-10 max-w-6xl mx-auto flex flex-col items-center">
              <div className="overflow-hidden flex gap-[clamp(0.5rem,2vw,1.5rem)] flex-wrap justify-center">
                {heroLine1.map((word, i) => (
                  <motion.span key={i} initial={{ y: "120%", opacity: 0, rotateZ: 5 }} animate={{ y: 0, opacity: 1, rotateZ: 0 }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-white pb-2">
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="overflow-hidden flex gap-[clamp(0.5rem,2vw,1.5rem)] flex-wrap justify-center">
                {heroLine2.map((word, i) => (
                  <motion.span key={i} initial={{ y: "120%", opacity: 0, rotateZ: 5 }} animate={{ y: 0, opacity: 1, rotateZ: 0 }} transition={{ duration: 0.9, delay: 0.3 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }} className="inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#FFD93D,45%,#fff,55%,#FFD93D)] bg-[length:250%_100%] animate-shimmer pb-4">
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>

            <motion.p initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.6 }} className="relative z-10 text-white/50 text-[clamp(1rem,2vw,1.25rem)] max-w-3xl leading-relaxed mb-12 font-medium">
              GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro, Midjourney, and Sora Video. Everything you need for Code, Copy, Audio, and Video starting at just ₹249.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="relative z-10 flex flex-col sm:flex-row gap-5 mb-16">
              <MagBtn onClick={triggerAuth} className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group">
                {user ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </MagBtn>
            </motion.div>
          </motion.section>

          {/* APPLE-STYLE MASSIVE DASHBOARD MOCKUP SCROLL REVEAL */}
          <section className="relative w-full min-h-[140vh] -mt-[10vh] flex items-start justify-center">
            {/* Sticky container for the mockup so it pins while scaling */}
            <div className="sticky top-[10vh] w-full max-w-[1400px] px-6" style={{ perspective: '1200px' }}>
              <motion.div 
                style={{ scale: dashboardScale, rotateX: dashboardRotateX, opacity: dashboardOpacity, y: dashboardY, transformStyle: 'preserve-3d' }} 
                className="w-full aspect-[16/10] sm:aspect-[16/9] glass-panel rounded-3xl sm:rounded-[2rem] border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden flex flex-col will-change-transform bg-[#0a0a0c]/80 backdrop-blur-3xl"
              >
                {/* Fake Mac Header */}
                <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="mx-auto text-[11px] font-medium text-white/30 tracking-widest uppercase flex items-center gap-2">
                     <div className="w-2 h-2 bg-omin-gold rounded-full shadow-[0_0_10px_#FFD93D]"></div>
                     Live Preview
                  </div>
                </div>
                {/* Fake Dashboard Body */}
                <div className="flex-1 flex p-6 gap-6 relative">
                   {/* Fake Sidebar */}
                   <div className="w-64 hidden lg:flex flex-col gap-4 border-r border-white/5 pr-6">
                      <div className="h-10 w-full glass-pill rounded-xl flex items-center px-4 gap-3 bg-white/5"><div className="w-4 h-4 bg-omin-gold/20 rounded"></div><div className="h-2 w-20 bg-white/20 rounded-full"></div></div>
                      <div className="h-8 w-full rounded-xl flex items-center px-4 gap-3 opacity-50"><div className="w-4 h-4 bg-white/20 rounded"></div><div className="h-2 w-16 bg-white/20 rounded-full"></div></div>
                      <div className="h-8 w-full rounded-xl flex items-center px-4 gap-3 opacity-50"><div className="w-4 h-4 bg-white/20 rounded"></div><div className="h-2 w-24 bg-white/20 rounded-full"></div></div>
                   </div>
                   {/* Fake Chat Area */}
                   <div className="flex-1 flex flex-col gap-6 pt-10 px-4 sm:px-10">
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: 0.2 }} className="self-end max-w-[80%] glass-pill bg-white/10 p-5 rounded-2xl rounded-tr-sm">
                        <div className="h-3 w-48 bg-white/80 rounded-full mb-3"></div>
                        <div className="h-3 w-32 bg-white/60 rounded-full"></div>
                      </motion.div>
                      
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: 0.6 }} className="self-start max-w-[85%] relative pl-12 pb-20">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-omin-gold flex items-center justify-center font-display font-black text-black text-xs">O</div>
                        <div className="text-xs font-bold text-omin-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                          Claude 4.6 <span className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-white">Reasoning</span>
                        </div>
                        <div className="glass-panel border-white/5 bg-black/40 p-6 rounded-2xl">
                           <div className="h-3 w-full max-w-[300px] bg-white/70 rounded-full mb-4"></div>
                           <div className="h-3 w-full max-w-[400px] bg-white/50 rounded-full mb-4"></div>
                           {/* Code Block Fake */}
                           <div className="mt-6 border border-white/10 rounded-xl bg-[#050505] p-5">
                              <div className="flex gap-2 mb-4">
                                 <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                              </div>
                              <div className="h-2 w-40 bg-[#3b82f6]/60 rounded-full mb-3"></div>
                              <div className="h-2 w-64 bg-[#10a37f]/60 rounded-full mb-3 ml-4"></div>
                              <div className="h-2 w-32 bg-white/40 rounded-full ml-4"></div>
                           </div>
                        </div>
                      </motion.div>
                   </div>
                </div>
                
                {/* Overlay glow for 3d pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-omin-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
              </motion.div>
            </div>
            {/* invisible div to ensure scroll continues */}
            <div className="h-[40vh] w-full absolute bottom-0"></div>
          </section>

          {/* MARQUEE */}
          <div className="border-y border-white/5 bg-black/40 py-8 my-20 flex flex-col gap-4 backdrop-blur-md relative z-20">
            <Marquee items={MARQUEE_A} />
          </div>

          {/* 3D BENTO BOX FEATURES (Sticky Scroll) */}
          <section id="features" className="py-32 px-6 max-w-[1400px] mx-auto min-h-[150vh] relative flex flex-col lg:flex-row gap-12 lg:gap-24 relative z-20">
             {/* Sticky Left Title */}
             <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit mb-12 lg:mb-0">
               <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }}>
                 <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight mb-6">
                   Unfair <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-omin-gold to-yellow-100">Advantage.</span>
                 </h2>
                 <p className="text-white/50 text-lg leading-relaxed max-w-sm">
                   Why pay for 5 different subscriptions when you can have the absolute best AI models on earth in one unified, impossibly fast terminal?
                 </p>
               </motion.div>
             </div>
             
             {/* Right Bento Grid */}
             <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="absolute inset-0 bg-omin-gold/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                
                <BentoCard className="md:col-span-2 aspect-auto min-h-[350px] flex flex-col md:flex-row gap-8 items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[size:100px]">
                  <div className="relative z-10 w-full md:w-3/5">
                    <div className="text-omin-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">Model Ecosystem</div>
                    <h3 className="text-3xl font-display font-bold mb-4">68 God-Tier AIs.</h3>
                    <p className="text-white/60 text-sm leading-relaxed">Instantly switch between GPT-5, Claude, Gemini, and local open-source titans without ever leaving your thought process. One prompt, limitless perspectives.</p>
                  </div>
                  <div className="hidden md:flex flex-1 justify-center relative scale-[1.2]">
                     <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent z-10"></div>
                     <div className="flex gap-4 rotate-12 scale-110 opacity-70">
                        <div className="flex flex-col gap-4 animate-[slideUp_10s_linear_infinite]">
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="openai" color="#fff" size={32}/></div>
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="anthropic" color="#e8a85f" size={32}/></div>
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="googlegemini" color="#4285f4" size={32}/></div>
                        </div>
                        <div className="flex flex-col gap-4 animate-[slideDown_10s_linear_infinite] mt-10">
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="midjourney" color="#fff" size={32}/></div>
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="meta" color="#0082fb" size={32}/></div>
                           <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center"><BrandLogo slug="x" color="#fff" size={32}/></div>
                        </div>
                     </div>
                     <style>{`@keyframes slideUp{from{transform:translateY(0)}to{transform:translateY(-50%)}} @keyframes slideDown{from{transform:translateY(-50%)}}to{transform:translateY(0)}`}</style>
                  </div>
                </BentoCard>

                <BentoCard delay={0.2} className="min-h-[300px] flex flex-col justify-between">
                   <div className="text-6xl font-display font-black text-white/90">20M</div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Massive Context</h3>
                     <p className="text-white/50 text-sm">Analyze entire codebases, massive PDFs, and entire books in a single prompt.</p>
                   </div>
                </BentoCard>

                <BentoCard delay={0.4} className="min-h-[300px] flex flex-col justify-between overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[50px]"></div>
                   <div className="flex gap-3 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-full glass-pill border-white/20 flex items-center justify-center"><BrandLogo slug="midjourney" color="#fff" size={24}/></div>
                      <div className="w-12 h-12 rounded-full glass-pill border-white/20 flex items-center justify-center border-omin-gold shadow-[0_0_15px_rgba(255,217,61,0.3)]"><BrandLogo slug="openai" color="#a855f7" size={24}/></div>
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2">Image & Video AI</h3>
                     <p className="text-white/50 text-sm">Don't just chat. Generate cinematic Sora videos and Midjourney portraits natively.</p>
                   </div>
                </BentoCard>
             </div>
          </section>

          {/* COMPARE */}
          <section id="compare" className="py-32 px-6 max-w-[1200px] mx-auto relative z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
              <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight mb-6">Stop overpaying.</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">One unified subscription that replaces them all.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-panel rounded-[2rem] overflow-hidden overflow-x-auto border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-black/60 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-omin-gold/50 to-transparent"></div>
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-8 text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] w-1/3">Criteria</th>
                    <th className="p-8 text-sm font-black text-omin-gold tracking-widest text-center bg-omin-gold/[0.03] uppercase relative">
                      <span className="relative z-10">OMNI PRO</span>
                      <div className="absolute inset-0 bg-gradient-to-b from-omin-gold/10 to-transparent opacity-50"></div>
                    </th>
                    <th className="p-8 text-[11px] font-bold text-white/40 text-center uppercase tracking-widest">ChatGPT+</th>
                    <th className="p-8 text-[11px] font-bold text-white/40 text-center uppercase tracking-widest">Claude Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { label: 'Starting Price / Mo', omni: '₹249', rival: '₹1,499+', gpt: '~₹1,700', claude: '~₹1,700' },
                    { label: 'Models Included', omni: '68 Top Models', rival: '3–5 Models', gpt: 'Only 3', claude: 'Only 3' },
                    { label: 'Max Tokens / Month', omni: 'Up to 20,000,000', rival: '~1,000,000', gpt: '~500,000', claude: '~400,000' },
                    { label: 'Image & Video Gen', omni: 'Midjourney + Sora', rival: 'Basic', gpt: 'DALL·E 3', claude: 'None' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 pl-8 text-sm font-semibold text-white/80">{row.label}</td>
                      <td className="p-6 text-center text-lg font-bold text-white bg-omin-gold/[0.02] border-x border-omin-gold/10 relative">
                         {row.omni}
                      </td>
                      <td className="p-6 text-center text-sm font-medium text-white/40">{row.gpt}</td>
                      <td className="p-6 text-center text-sm font-medium text-white/40">{row.claude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </section>

          {/* CTA */}
          <section className="py-32 px-6 relative flex justify-center z-20">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }} className="relative z-10 max-w-4xl w-full text-center glass-panel rounded-[3rem] p-16 md:p-24 border border-omin-gold/20 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-omin-gold/10 to-transparent opacity-50 mix-blend-screen group-hover:opacity-80 transition-opacity duration-1000"></div>
                <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-6 relative z-10">Access the God-Tier.</h2>
                <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto relative z-10">Claim your unfair advantage today. All 68 models inside one immersive interface.</p>
                <div className="relative z-10">
                  <MagBtn onClick={triggerAuth} className="bg-omin-gold text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-omin-gold/90 shadow-[0_10px_40px_rgba(255,217,61,0.3)] hover:shadow-[0_10px_60px_rgba(255,217,61,0.5)] transition-all">
                    {user ? 'Go to Dashboard' : 'Sign Up Free'}
                  </MagBtn>
                </div>
             </motion.div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/5 bg-[#010101] py-16 px-6 mt-10 relative z-20">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-omin-gold rounded shadow-[0_0_15px_rgba(255,217,61,0.2)] flex items-center justify-center text-black font-display font-black text-xs">O</div>
                <span className="font-display font-bold tracking-tight text-white/80 text-sm">OMNI AI PRO</span>
              </div>
              <p className="text-xs text-white/30 font-medium tracking-wide font-display uppercase">© 2026 OMNI AI PRO. The God-Tier Interface.</p>
              <div className="flex gap-8 text-xs font-bold tracking-widest uppercase text-white/30">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}