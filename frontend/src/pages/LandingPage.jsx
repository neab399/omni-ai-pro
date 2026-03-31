import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
  <svg className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-[0.025] mix-blend-screen">
    <filter id="omni-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
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
      style={{ left: pos.x - 250, top: pos.y - 250, width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,217,61,0.06) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)' }}
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
  { name: 'Flux Pro', maker: 'Black Forest', color: '#ff4d6d', use: 'HD Image Gen', slug: 'flux' },
  { name: 'WhisperFlow', maker: 'Cartesia', color: '#22d3ee', use: 'Live Dictation', slug: 'cartesia' },
  { name: 'Qwen 3 Max', maker: 'Alibaba', color: '#ff7000', use: 'Asian Heavyweight', slug: 'alibabadotcom' },
  { name: 'Llama 4', maker: 'Meta', color: '#0082fb', use: 'Massive Open Model', slug: 'meta' },
  { name: 'Suno v4', maker: 'Suno', color: '#20b8cd', use: 'AI Music Gen', slug: 'suno' },
  { name: 'Claude Sonnet', maker: 'Anthropic', color: '#d4924a', use: 'Coding Master', slug: 'anthropic' },
  { name: 'OpenAI o1-Pro', maker: 'OpenAI', color: '#1a8a6e', use: 'Deep Thinker', slug: 'openai' },
  { name: 'Gemini 3 Ultra', maker: 'Google', color: '#4285f4', use: 'Enterprise Logic', slug: 'googlegemini' },
  { name: 'DALL-E 3 HD', maker: 'OpenAI', color: '#ab68ff', use: 'Exact Text Images', slug: 'openai' }
];

const MARQUEE_A = ['GPT-5.4', 'Claude 4.6 Opus', 'Gemini 3.1 Pro', 'Midjourney v7', 'WhisperFlow', 'Flux Pro', 'DeepSeek V3.2', 'Llama 4', 'Sora Video'];
const MARQUEE_B = ['Up to 20M Tokens', 'Starting at ₹249', '68 AI Models', 'India Made', 'Text, Image, Audio, Video', 'Enterprise Privacy'];

function Marquee({ items, reverse }) {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden flex">
      <motion.div animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="flex flex-shrink-0">
        {all.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-3 px-8 text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap ${i % 2 === 0 ? 'text-omin-gold/60' : 'text-white/30'}`}>
            <span className="text-[6px] opacity-40">◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const COMPARE = [
  { label: 'Starting Price', omni: '₹249', rival: '₹1,499+', gpt: '~₹1,700', claude: '~₹1,700' },
  { label: 'AI Models Included', omni: '68 Models', rival: '3–5 Models', gpt: '1 Model', claude: '1 Model' },
  { label: 'Max Tokens / Month', omni: 'Up to 20,000,000', rival: '~1,000,000', gpt: '~500,000', claude: '~400,000' },
  { label: 'God-Tier Models', omni: 'GPT-5.4 + Claude 4.6', rival: 'GPT-4o Only', gpt: 'GPT-4o', claude: 'Claude 3.5' },
  { label: 'Image & Video Gen', omni: 'Midjourney + Sora', rival: 'Basic', gpt: 'DALL·E 3', claude: 'None' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const [liveModel, setLiveModel] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navBg = useTransform(scrollYProgress, [0, 0.05], ['rgba(5,5,5,0)', 'rgba(5,5,5,0.85)']);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLiveModel(p => (p + 1) % 12), 3000);
    return () => clearInterval(t);
  }, []);

  const handleOAuthLogin = async (providerName) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: { redirectTo: `${window.location.origin}/chat` }
    });
    if (error) alert(`${providerName} Login failed: ` + error.message);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: `${window.location.origin}/chat` }
    });
    setLoading(false);
    if (error) alert(error.message); else setEmailSent(true);
  };

  const handleLogout = async () => await supabase.auth.signOut();
  const triggerAuth = () => user ? navigate('/chat') : setShowAuthModal(true);

  return (
    <div ref={containerRef} className="h-screen w-full overflow-y-scroll overflow-x-hidden relative scroll-smooth bg-omin-black text-white selection:bg-omin-gold/30">
      <NoiseBg />
      <CursorGlow />

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="w-full max-w-[400px] p-8 rounded-2xl glass-panel relative shadow-2xl shadow-omin-gold/5">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors text-xl">✕</button>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold tracking-tight mb-2">Welcome to OMNI AI</h2>
                <p className="text-sm text-white/50">Log in or sign up to continue.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleOAuthLogin('google')} className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google
                </button>
                <button onClick={() => handleOAuthLogin('github')} className="w-full py-3 bg-[#24292e] text-white border border-white/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#2b3137] transition-colors">
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
                  <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-omin-gold outline-none transition-colors" />
                  <button type="submit" disabled={loading} className="w-full py-3 bg-omin-gold text-black rounded-xl text-sm font-bold hover:bg-omin-gold/90 transition-colors">{loading ? 'Sending...' : 'Send Magic Link ✨'}</button>
                </form>
              ) : (
                <div className="text-center py-2">
                  <p className="text-emerald-400 font-medium mb-2">Check your email!</p>
                  <p className="text-xs text-white/50">Magic link sent to {email}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV */}
      <motion.nav style={{ background: navBg }} className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-omin-gold rounded shadow-[0_0_15px_rgba(255,217,61,0.4)] flex items-center justify-center text-black font-display font-black text-xs">O</div>
          <span className="font-display font-bold tracking-tight text-sm">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-[13px] text-white/50 font-medium">
          {['Models', 'Compare', 'Pricing'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>)}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
             <button onClick={handleLogout} className="text-red-400 text-[13px] font-semibold hover:text-red-300">Log Out</button>
          ) : (
            <button onClick={triggerAuth} className="text-white/60 text-[13px] font-semibold hover:text-white transition-colors">Log In</button>
          )}
          <MagBtn onClick={triggerAuth} className="bg-omin-gold text-black px-5 py-2 rounded-lg text-[13px] font-bold shadow-[0_4px_20px_rgba(255,217,61,0.25)] hover:shadow-[0_4px_25px_rgba(255,217,61,0.4)] transition-all">
            {user ? 'Go to Chat →' : 'Start Free →'}
          </MagBtn>
        </div>
      </motion.nav>

      {/* HERO */}
      <motion.section style={{ scale: heroScale, opacity: heroOpacity }} className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-20 overflow-hidden origin-top">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-display font-black text-white/[0.015] tracking-tighter select-none pointer-events-none whitespace-nowrap blur-[2px]">OMNI PRO</div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative z-10 mb-8">
          <span className="glass-pill px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-omin-gold uppercase shadow-[0_0_20px_rgba(255,217,61,0.1)]">✦ The Ultimate AI Aggregator</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 font-display font-bold text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-tighter mb-8">
          <span className="block text-white">68 AI MODELS.</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-omin-gold via-yellow-200 to-omin-gold">ONE DASHBOARD.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="relative z-10 text-white/50 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro, Midjourney, and Sora Video. Everything you need for Code, Copy, Audio, and Video starting at just ₹249.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="relative z-10 flex flex-col sm:flex-row gap-4 mb-14">
          <MagBtn onClick={triggerAuth} className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-2">
            {user ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
          </MagBtn>
          <a href="#compare" className="glass-pill text-white/70 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">See Comparison ↓</a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="relative z-10 glass-pill px-5 py-2.5 flex items-center gap-3 shadow-lg">
          <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-0.5">Live Demo:</span>
          <AnimatePresence mode="wait">
            <motion.span key={liveModel} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-bold font-sans" style={{ color: MODELS[liveModel].color }}>{MODELS[liveModel].name}</motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10">
          <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent"></div>
        </motion.div>
      </motion.section>

      {/* MARQUEE */}
      <div className="border-y border-white/5 bg-black/40 py-4 flex flex-col gap-3 backdrop-blur-sm">
        <Marquee items={MARQUEE_A} />
        <Marquee items={MARQUEE_B} reverse />
      </div>

      {/* STATS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { big: '68', sub: 'Models Included' },
            { big: '20M', sub: 'Max Tokens/Mo' },
            { big: '₹249', sub: 'Starting Price' },
            { big: '12+', sub: 'God-Tier AIs' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-panel rounded-2xl p-8 text-center hover:bg-white/[0.02] transition-colors">
              <div className="font-display font-bold text-4xl md:text-5xl text-white mb-2 tracking-tight">{s.big}</div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODELS */}
      <section id="models" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
          <div className="text-omin-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">The God-Tier Library</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-none mb-6">Switch models mid-thought.</h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl">Whether you need Claude's nuance, GPT's logic, or Midjourney's art, you have instant access to the world's best APIs.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(showAllModels ? MODELS : MODELS.slice(0, 8)).map((model, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
              <div className="mb-4 text-2xl h-8"><BrandLogo slug={model.slug} color={model.color} name={model.name} /></div>
              <h3 className="font-bold text-lg text-white mb-1 group-hover:text-omin-gold transition-colors">{model.name}</h3>
              <p className="text-xs text-white/40 mb-3">{model.maker}</p>
              <p className="text-[11px] font-medium" style={{ color: model.color }}>{model.use}</p>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: model.color }} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button onClick={() => setShowAllModels(!showAllModels)} className="glass-pill px-8 py-3 rounded-full text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all">
            {showAllModels ? 'Show Less ↑' : 'View All 68 Models ↓'}
          </button>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">Stop overpaying.</h2>
          <p className="text-white/50">See how OMNI AI stuns the competition in value and power.</p>
        </motion.div>

        <div className="glass-panel rounded-3xl overflow-hidden overflow-x-auto border border-white/10 shadow-2xl">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest w-1/3">Feature</th>
                <th className="p-6 text-sm font-black text-omin-gold text-center bg-omin-gold/[0.03]">OMNI AI PRO</th>
                <th className="p-6 text-xs font-bold text-white/40 text-center">ChatGPT Plus</th>
                <th className="p-6 text-xs font-bold text-white/40 text-center">Claude Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 border-t border-white/5">
              {COMPARE.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-5 pl-6 text-[13px] font-medium text-white/70">{row.label}</td>
                  <td className="p-5 text-center text-sm font-bold text-white bg-omin-gold/[0.02] border-x border-omin-gold/10">{row.omni}</td>
                  <td className="p-5 text-center text-xs text-white/40">{row.gpt}</td>
                  <td className="p-5 text-center text-xs text-white/40">{row.claude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] py-10 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-omin-gold rounded flex items-center justify-center text-black font-display font-black text-[10px]">O</div>
            <span className="font-display font-bold tracking-tight text-white/80 text-sm">OMNI AI PRO</span>
          </div>
          <p className="text-xs text-white/30">© 2026 OMNI AI PRO. The God-Tier Interface.</p>
          <div className="flex gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}