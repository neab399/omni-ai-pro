import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, MODELS } from './landingData';
import { NoiseBg, CursorGlow, MagBtn, BrandLogo, BentoCard, CountUp } from './landingComponents';
import { LogoCloud, LiveAIDemo, HowItWorks, ModelLibrary, CompareTable, TestimonialsSection, PricingSection, FAQSection, MarqueeSection } from './landingSections';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Scroll-linked transforms
  const navBg = useTransform(scrollYProgress, [0, 0.015], ['rgba(5,5,5,0)', 'rgba(5,5,5,0.9)']);
  const navBorder = useTransform(scrollYProgress, [0, 0.015], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, 80]);
  const dashboardScale = useTransform(scrollYProgress, [0.03, 0.14], [0.82, 1]);
  const dashboardRotateX = useTransform(scrollYProgress, [0.03, 0.14], [25, 0]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.03, 0.12], [0.2, 1]);
  const dashboardY = useTransform(scrollYProgress, [0.03, 0.14], [120, 0]);
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [liveModel, setLiveModel] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lock body scroll — landing page uses its own container scroll
    document.body.classList.add('landing-page-active');
    return () => document.body.classList.remove('landing-page-active');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (window.location.search.includes('auth=true')) {
      setShowAuthModal(true);
      // Clean up the URL so it doesn't get stuck in a loop
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => { const t = setInterval(() => setLiveModel(p => (p + 1) % 8), 3000); return () => clearInterval(t); }, []);

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/chat` } });
    if (error) alert(`${provider} Login failed: ` + error.message);
  };
  const handleMagicLink = async (e) => {
    e.preventDefault(); if (!email) return; setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/chat` } });
    setLoading(false); if (error) alert(error.message); else setEmailSent(true);
  };
  const handleLogout = async () => await supabase.auth.signOut();
  const triggerAuth = () => user ? navigate('/chat') : setShowAuthModal(true);

  const heroWords1 = "68 AI MODELS.".split(" ");
  const heroWords2 = "ONE DASHBOARD.".split(" ");

  return (
    <div ref={containerRef} className="landing-scroll-container h-screen w-full relative bg-omin-black text-white selection:bg-omin-gold/30 overflow-y-scroll overflow-x-hidden">
      <NoiseBg />
      <CursorGlow />

      {/* ═══ SCROLL PROGRESS BAR ═══ */}
      <motion.div style={{ scaleX: progressScaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-omin-gold via-yellow-200 to-omin-gold z-[200] origin-left" />

      {/* Background Parallax Orbs */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 600]) }} className="parallax-orb fixed top-[-15%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-omin-gold/[0.04] blur-[140px] pointer-events-none" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -500]) }} className="parallax-orb fixed bottom-[-25%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-500/[0.04] blur-[160px] pointer-events-none" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 300]) }} className="parallax-orb fixed top-[40%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-purple-500/[0.03] blur-[120px] pointer-events-none" />

      {/* ═══ AUTH MODAL ═══ */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="w-full max-w-[420px] p-8 rounded-3xl glass-strong relative shadow-[0_0_80px_rgba(255,217,61,0.08)]">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors text-xl">✕</button>
              <div className="text-center mb-8">
                <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(255,217,61,0.3)', '0 0 40px rgba(255,217,61,0.6)', '0 0 20px rgba(255,217,61,0.3)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 bg-omin-gold rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,217,61,0.3)] overflow-hidden"
              >
                <img src="/logo.png" alt="OMNI AI PRO" className="w-8 h-8 object-contain" style={{ filter: 'brightness(0)' }} />
              </motion.div>
                <h2 className="text-2xl font-display font-bold tracking-tight mb-2">Welcome to OMNI AI</h2>
                <p className="text-sm text-white/40">Log in or sign up to continue.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleOAuthLogin('google')} className="w-full py-3.5 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google
                </button>
                <button onClick={() => handleOAuthLogin('github')} className="w-full py-3.5 bg-[#111] text-white border border-white/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> Continue with GitHub
                </button>
              </div>
              <div className="flex items-center gap-4 my-6 opacity-30"><div className="flex-1 h-px bg-white" /><span className="text-[10px] font-bold tracking-widest uppercase">Or Email</span><div className="flex-1 h-px bg-white" /></div>
              {!emailSent ? (
                <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                  <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-omin-gold outline-none transition-colors" />
                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-omin-gold text-black rounded-xl text-sm font-bold hover:bg-omin-gold/90 transition-colors shadow-[0_0_25px_rgba(255,217,61,0.2)]">{loading ? 'Sending...' : 'Send Magic Link ✨'}</button>
                </form>
              ) : (
                <div className="text-center py-4 glass-pill rounded-xl"><p className="text-emerald-400 font-bold mb-1">Check your email!</p><p className="text-xs text-white/50">Magic link sent to {email}</p></div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ NAV ═══ */}
      <motion.nav style={{ background: navBg, borderBottomColor: navBorder }} className="landing-nav fixed top-[3px] z-[100] w-full h-[72px] flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl border-b border-transparent">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ['0 0 10px rgba(255,217,61,0.25)', '0 0 22px rgba(255,217,61,0.55)', '0 0 10px rgba(255,217,61,0.25)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 bg-omin-gold rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
          >
            <img src="/logo.png" alt="OMNI AI PRO" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
          </motion.div>
          <span className="font-display font-bold tracking-tight text-[15px]">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </div>
        <div className="hidden md:flex gap-8">
          {['Features', 'Models', 'Compare', 'Pricing'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] tracking-[0.2em] font-bold">{l}</a>)}
        </div>
        <div className="flex items-center gap-4">
          {user ? <button onClick={handleLogout} className="text-red-400 text-[13px] font-semibold hover:text-red-300">Log Out</button> : <button onClick={triggerAuth} className="text-white/50 text-[13px] font-semibold hover:text-white transition-colors hidden sm:block">Log In</button>}
          <MagBtn onClick={triggerAuth} className="nav-cta-btn bg-omin-gold text-black px-6 py-2.5 rounded-full text-[13px] font-bold shadow-[0_4px_20px_rgba(255,217,61,0.25)] hover:shadow-[0_4px_30px_rgba(255,217,61,0.4)] transition-all">
            {user ? 'Dashboard →' : 'Start Free →'}
          </MagBtn>
        </div>
      </motion.nav>

      {/* ═══ 1. HERO ═══ */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="hero-section relative flex flex-col items-center justify-center min-h-[95vh] text-center px-4 pt-32 pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 mb-10">
          <span className="glass-pill px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <span className="text-omin-gold mr-2">✦</span>The Ultimate AI Aggregator
          </span>
        </motion.div>
        <h1 className="hero-heading relative z-10 font-display font-bold text-[clamp(3rem,8vw,9rem)] leading-[0.9] tracking-tighter mb-10 max-w-6xl mx-auto flex flex-col items-center">
          <div className="overflow-hidden flex gap-[clamp(0.4rem,2vw,1.5rem)] flex-wrap justify-center">
            {heroWords1.map((w, i) => <motion.span key={i} initial={{ y: "120%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-white pb-2">{w}</motion.span>)}
          </div>
          <div className="overflow-hidden flex gap-[clamp(0.4rem,2vw,1.5rem)] flex-wrap justify-center">
            {heroWords2.map((w, i) => <motion.span key={i} initial={{ y: "120%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#FFD93D,45%,#fff,55%,#FFD93D)] bg-[length:250%_100%] animate-shimmer pb-4">{w}</motion.span>)}
          </div>
        </h1>
        <motion.p initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.6 }} className="hero-subtitle relative z-10 text-white/50 text-[clamp(0.95rem,2vw,1.25rem)] max-w-3xl leading-relaxed mb-12 font-medium">
          GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro, Midjourney, and Sora Video.<br className="hidden sm:block" /> Everything you need for Code, Copy, Audio, and Video — starting at just ₹249.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="hero-cta-row relative z-10 flex flex-col sm:flex-row gap-4 mb-12">
          <MagBtn onClick={triggerAuth} className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.12)] flex items-center justify-center gap-2 group">
            {user ? 'Go to Dashboard' : 'Start Free — No Card Needed'}<span className="group-hover:translate-x-1 transition-transform">→</span>
          </MagBtn>
          <a href="#compare" className="glass-pill text-white/60 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center">See Comparison ↓</a>
        </motion.div>
        {/* Live model ticker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="relative z-10 glass-pill px-5 py-2.5 rounded-full flex items-center gap-3">
          <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Live:</span>
          <AnimatePresence mode="wait">
            <motion.span key={liveModel} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-bold" style={{ color: MODELS[liveModel].color }}>{MODELS[liveModel].name}</motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* ═══ 2. LOGO CLOUD ═══ */}
      <LogoCloud />

      {/* ═══ 3. DASHBOARD MOCKUP (Apple 3D Scroll) ═══ */}
      <section className="dashboard-section relative w-full min-h-[130vh] -mt-[5vh] flex items-start justify-center">
        <div className="dashboard-viewport sticky top-[10vh] w-full max-w-[1400px] px-4 sm:px-6" style={{ perspective: '1200px' }}>
          <motion.div style={{ scale: dashboardScale, rotateX: dashboardRotateX, opacity: dashboardOpacity, y: dashboardY, transformStyle: 'preserve-3d' }} className="dashboard-mockup w-full aspect-[16/10] sm:aspect-[16/9] glass-strong rounded-3xl sm:rounded-[2rem] border border-white/15 shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex flex-col will-change-transform">
            <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-yellow-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="mx-auto flex items-center gap-2 text-[11px] font-medium text-white/25 tracking-widest uppercase"><div className="w-2 h-2 bg-omin-gold rounded-full shadow-[0_0_10px_#FFD93D]" />OMNI AI PRO — Live Preview</div>
            </div>
            <div className="flex-1 flex p-6 gap-6 relative">
              <div className="dashboard-sidebar-mock w-60 hidden lg:flex flex-col gap-3 border-r border-white/5 pr-6">
                <div className="h-10 w-full glass-pill rounded-xl flex items-center px-4 gap-3 bg-white/5"><div className="w-4 h-4 bg-omin-gold/20 rounded" /><div className="h-2 w-20 bg-white/15 rounded-full" /></div>
                <div className="h-8 w-full rounded-xl flex items-center px-4 gap-3 opacity-40"><div className="w-4 h-4 bg-white/15 rounded" /><div className="h-2 w-16 bg-white/15 rounded-full" /></div>
                <div className="h-8 w-full rounded-xl flex items-center px-4 gap-3 opacity-40"><div className="w-4 h-4 bg-white/15 rounded" /><div className="h-2 w-24 bg-white/15 rounded-full" /></div>
              </div>
              <div className="flex-1 flex flex-col gap-5 pt-8 px-4 sm:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="self-end max-w-[75%] glass-pill bg-white/8 p-5 rounded-2xl rounded-tr-sm">
                  <div className="h-3 w-48 bg-white/70 rounded-full mb-3" /><div className="h-3 w-32 bg-white/50 rounded-full" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="self-start max-w-[80%] relative pl-11">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-omin-gold flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(255,217,61,0.4)]">
                    <img src="/logo.png" alt="O" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
                  </div>
                  <div className="text-xs font-bold text-omin-gold uppercase tracking-wider mb-2 flex items-center gap-2">Claude 4.6 <span className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-white/60">Reasoning</span></div>
                  <div className="glass-panel bg-black/30 p-5 rounded-2xl">
                    <div className="h-3 w-[280px] bg-white/60 rounded-full mb-3" /><div className="h-3 w-[350px] bg-white/40 rounded-full mb-4" />
                    <div className="mt-4 border border-white/10 rounded-xl bg-[#040404] p-4">
                      <div className="h-2 w-36 bg-blue-400/50 rounded-full mb-2.5" /><div className="h-2 w-56 bg-emerald-400/50 rounded-full mb-2.5 ml-4" /><div className="h-2 w-28 bg-white/30 rounded-full ml-4" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-omin-black via-transparent to-transparent opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. MARQUEE ═══ */}
      <MarqueeSection />

      {/* ═══ 5. LIVE AI DEMO ═══ */}
      <LiveAIDemo />

      {/* ═══ 6. BENTO FEATURES ═══ */}
      <section id="features" className="bento-section section-content py-32 px-6 max-w-[1400px] mx-auto relative z-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="bento-sidebar lg:w-1/3 lg:sticky lg:top-40 h-fit">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight mb-6">Unfair<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-omin-gold to-yellow-100">Advantage.</span></h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-sm">Why pay for 5 different subscriptions when you can have the absolute best AI models in one unified terminal?</p>
          </motion.div>
        </div>
        <div className="bento-cards lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5 relative">
          <div className="absolute inset-0 bg-omin-gold/5 blur-[100px] rounded-full pointer-events-none -z-10" />
          <BentoCard className="bento-card-wide md:col-span-2 min-h-[300px] flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-3/5"><div className="text-omin-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">Model Ecosystem</div><h3 className="text-3xl font-display font-bold mb-4"><CountUp target={68} /> God-Tier AIs.</h3><p className="text-white/60 text-sm leading-relaxed">Instantly switch between GPT-5, Claude, Gemini, and open-source titans without leaving your thought process.</p></div>
            <div className="hidden md:flex flex-1 justify-center gap-4 opacity-60">
              {['openai', 'anthropic', 'googlegemini', 'meta'].map(s => <div key={s} className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}><BrandLogo slug={s} color="#fff" size={28} /></div>)}
            </div>
          </BentoCard>
          <BentoCard delay={0.15} className="min-h-[280px] flex flex-col justify-between">
            <div className="text-6xl font-display font-black"><CountUp target={20} suffix="M" /></div>
            <div><h3 className="text-xl font-bold mb-2">Massive Context</h3><p className="text-white/50 text-sm">Analyze entire codebases, PDFs, and books in a single prompt.</p></div>
          </BentoCard>
          <BentoCard delay={0.3} className="min-h-[280px] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 blur-[50px]" />
            <div className="flex gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center"><BrandLogo slug="midjourney" color="#fff" size={24} /></div>
              <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center shadow-[0_0_15px_rgba(255,217,61,0.2)]"><BrandLogo slug="openai" color="#a855f7" size={24} /></div>
            </div>
            <div className="relative z-10"><h3 className="text-xl font-bold mb-2">Image & Video AI</h3><p className="text-white/50 text-sm">Generate cinematic Sora videos and Midjourney portraits natively.</p></div>
          </BentoCard>
          <BentoCard delay={0.2} className="min-h-[280px] flex flex-col justify-between overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/15 blur-[40px]" />
            <div className="text-4xl mb-4">🎤</div>
            <div className="relative z-10"><h3 className="text-xl font-bold mb-2">Voice & Audio AI</h3><p className="text-white/50 text-sm">Whisper transcription, Suno music generation, and real-time voice chat all built in.</p></div>
          </BentoCard>
          <BentoCard delay={0.35} className="min-h-[280px] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/10 blur-[40px]" />
            <div className="text-4xl mb-4">🔒</div>
            <div className="relative z-10"><h3 className="text-xl font-bold mb-2">Enterprise Privacy</h3><p className="text-white/50 text-sm">End-to-end encryption, zero-retention APIs, and SOC 2 compliant infrastructure.</p></div>
          </BentoCard>
        </div>
      </section>

      {/* ═══ 7. HOW IT WORKS ═══ */}
      <HowItWorks />

      {/* ═══ 8. MODEL LIBRARY ═══ */}
      <ModelLibrary />

      {/* ═══ 9. COMPARE TABLE ═══ */}
      <CompareTable />

      {/* ═══ 10. TESTIMONIALS ═══ */}
      <TestimonialsSection />

      {/* ═══ 11. PRICING ═══ */}
      <PricingSection onAction={triggerAuth} />

      {/* ═══ 12. FAQ ═══ */}
      <FAQSection />

      {/* ═══ 13. FINAL CTA ═══ */}
      <section className="py-32 px-6 relative flex justify-center z-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="cta-card relative max-w-4xl w-full text-center glass-strong rounded-[3rem] p-16 md:p-24 border border-omin-gold/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-omin-gold/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-omin-gold/40 rounded-full animate-float" style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i}s` }} />)}
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-6 relative z-10">Access the God-Tier.</h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto relative z-10">Claim your unfair advantage today. All 68 models inside one immersive interface.</p>
          <div className="relative z-10"><MagBtn onClick={triggerAuth} className="cta-btn bg-omin-gold text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-omin-gold/90 shadow-[0_10px_40px_rgba(255,217,61,0.3)] hover:shadow-[0_10px_60px_rgba(255,217,61,0.5)] transition-all">{user ? 'Go to Dashboard' : 'Sign Up Free →'}</MagBtn></div>
        </motion.div>
      </section>

      {/* ═══ 14. FOOTER ═══ */}
      <footer className="border-t border-white/5 bg-[#010101] py-20 px-6 relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="footer-grid grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-omin-gold rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,217,61,0.2)] flex-shrink-0">
                  <img src="/logo.png" alt="OMNI AI PRO" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
                </div>
                <span className="font-display font-bold text-sm">OMNI AI PRO</span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">The world's most powerful AI aggregator. 68 models, one interface.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-5">Product</h4>
              <ul className="space-y-3">{['Features', 'Models', 'Pricing', 'API'].map(l => <li key={l}><a href="#" className="text-sm text-white/30 hover:text-white transition-colors">{l}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-5">Company</h4>
              <ul className="space-y-3">{['About', 'Blog', 'Careers', 'Contact'].map(l => <li key={l}><a href="#" className="text-sm text-white/30 hover:text-white transition-colors">{l}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-5">Legal</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Privacy', path: '/privacy' },
                  { name: 'Terms', path: '/terms' },
                  { name: 'Security', path: '/security' },
                  { name: 'DPA', path: '/dpa' }
                ].map(l => (
                  <li key={l.name}>
                    {l.path.startsWith('/') ? (
                      <Link to={l.path} className="text-sm text-white/30 hover:text-white transition-colors">{l.name}</Link>
                    ) : (
                      <a href={l.path} className="text-sm text-white/30 hover:text-white transition-colors">{l.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/20 font-display uppercase tracking-widest">© 2026 OMNI AI PRO. The God-Tier Interface.</p>
            <div className="flex gap-6 text-xs text-white/20">{['Twitter', 'GitHub', 'Discord'].map(l => <a key={l} href="#" className="hover:text-omin-gold transition-colors font-semibold uppercase tracking-widest">{l}</a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}