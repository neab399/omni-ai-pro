import React, { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, MODELS } from './landingData';
import { CanvasBackground, CursorGlow, MagBtn, BrandLogo, BentoCard, CountUp, StaggeredText, ScrambleText, SiriWave, Floating3DOrb, SectionHeader, ParallaxLayer, SafeSpline } from './landingComponents';
import InteractiveLogo from '../components/InteractiveLogo';
// 🚀 Performance: Lazy Load ALL Below-the-Fold Sections
const LogoCloud = lazy(() => import('./landingSections').then(module => ({ default: module.LogoCloud })));
const LiveAIDemo = lazy(() => import('./landingSections').then(module => ({ default: module.LiveAIDemo })));
const HowItWorks = lazy(() => import('./landingSections').then(module => ({ default: module.HowItWorks })));
const ModelLibrary = lazy(() => import('./landingSections').then(module => ({ default: module.ModelLibrary })));
const CompareTable = lazy(() => import('./landingSections').then(module => ({ default: module.CompareTable })));
const TestimonialsSection = lazy(() => import('./landingSections').then(module => ({ default: module.TestimonialsSection })));
const PricingSection = lazy(() => import('./landingSections').then(module => ({ default: module.PricingSection })));
const FAQSection = lazy(() => import('./landingSections').then(module => ({ default: module.FAQSection })));
const MarqueeSection = lazy(() => import('./landingSections').then(module => ({ default: module.MarqueeSection })));

import confetti from 'canvas-confetti';
import { preloadSounds, initAudioContext, playSystemStartupSFX, playSelectSound, playHoverSound } from '../lib/audio';
import WarpTransition from '../components/WarpTransition';

// ─── Lightweight Sentient Glow Background for Mobile ───
const MobileHeroBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-omin-black">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[radial-gradient(circle,rgba(255,217,61,0.15)_0%,transparent_70%)] blur-[100px]"
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,5,0)_0%,rgba(5,5,5,1)_85%)] z-10" />
  </div>
);

// ─── Sleek Section Loader for Suspense ───
const SectionLoader = () => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-omin-gold/30 border-t-omin-gold rounded-full"
    />
    <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Loading Vision...</span>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll(); // Native window scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 📱 Device Detection for Performance Mode
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll-linked transforms — REFINED FOR MODAL VISIBILITY & PERFORMANCE
  // Simplified Nav (Performance: Use CSS transitions instead of useTransform)
  const navBg = scrolled ? 'rgba(5,5,5,0.94)' : 'rgba(5,5,5,0)';
  const navBorder = scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)';
  
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // ─── Adaptive Environment Dynamics ───
  // Removed heavy background color shifts to stop "hanging" on lag
  const glowColor = 'rgba(255,217,61,0.15)'; 

  const [liveModel, setLiveModel] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warpActive, setWarpActive] = useState(false);

  useEffect(() => {
    // Preload ultra-premium sounds
    preloadSounds();

    // Trigger JARVIS-Style System Startup SFX
    const startupTimeout = setTimeout(() => {
      playSystemStartupSFX();
    }, 1500);
    
    return () => {
      clearTimeout(startupTimeout);
    };
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
  const triggerAuth = (e) => {
    if (e && e.clientX) {
      const scalar = 2;
      const gold = confetti.shapeFromText({ text: '✦', scalar });
      const star = confetti.shapeFromText({ text: '★', scalar });

      confetti({
        particleCount: 200,
        spread: 90,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#FFD93D', '#FFFFFF', '#FFB800', '#4ade80', '#3b82f6'],
        ticks: 300,
        gravity: 1,
        decay: 0.96,
        startVelocity: 40,
        shapes: [gold, star, 'circle'],
        zIndex: 999999
      });
    }
    playSelectSound(0.5);
    setShowAuthModal(true);
  };

  const handleDashboardEntry = () => {
    if (!user) {
      triggerAuth();
      return;
    }
    
    playSelectSound(0.8);
    setWarpActive(true);
    // After warp completes, navigate
    setTimeout(() => {
      navigate('/chat');
    }, 1800);
  };
  
  // 🚀 Auto-navigate after login if auth modal was open (requested dashboard flow)
  useEffect(() => {
    if (user && showAuthModal) {
      setShowAuthModal(false);
      // Brief delay to allow modal to close before warp
      setTimeout(() => {
        handleDashboardEntry();
      }, 300);
    }
  }, [user]); // Specifically watching user state

  // 3D Hero Scene State
  const [splineLoaded, setSplineLoaded] = useState(false);

  const heroWords1 = "68 AI MODELS.".split(" ");
  const heroWords2 = "ONE DASHBOARD.".split(" ");

  return (
    <div className="landing-root min-h-screen w-full relative bg-omin-black text-white selection:bg-omin-gold/30">
      <CanvasBackground />
      {/* <CursorGlow /> */}

      {/* ═══ SCROLL PROGRESS BAR ═══ */}
      <motion.div style={{ scaleX: progressScaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-omin-gold via-yellow-200 to-omin-gold z-[200] origin-left" />

      {/* Static Background Orbs (Performance: Fixed positions) */}
      <div className="fixed top-[-15%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-omin-gold/[0.04] blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[25%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-500/[0.04] blur-[160px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-purple-500/[0.03] blur-[120px] pointer-events-none" />

      {/* ─── VISIONARY WARP TUNNEL ─── */}
      <WarpTransition active={warpActive} onComplete={() => setWarpActive(false)} />

      {/* ═══ AUTH MODAL ═══ */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="w-full max-w-[420px] p-8 rounded-3xl glass-strong relative shadow-[0_0_80px_rgba(255,217,61,0.08)]">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors text-xl">✕</button>
              <div className="text-center mb-8">
                <InteractiveLogo size={48} iconSize={32} className="mx-auto mb-4" />
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

      {/* ─── ATMOSPHERIC ADAPTIVE LIGHT LEAKS ─── */}
      <motion.div 
        style={{ backgroundColor: glowColor }}
        className="fixed top-0 -left-[20%] w-[70%] h-[70%] blur-[120px] pointer-events-none z-0 transition-colors duration-1000" 
      />
      <div 
        style={{ backgroundColor: glowColor }}
        className="fixed bottom-0 -right-[20%] w-[70%] h-[70%] blur-[120px] pointer-events-none z-0 transition-colors duration-1000" 
      />

      {/* ═══ NAV ═══ */}
      <nav style={{ background: navBg, borderBottomColor: navBorder }} className="landing-nav fixed top-0 sm:top-[3px] z-[100] w-full min-w-[320px] h-[72px] flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl border-b border-transparent transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" data-magnetic onClick={() => playSelectSound(0.15)}>
          <InteractiveLogo size={32} iconSize={20} />
          <span className="font-display font-bold tracking-tight text-[15px]">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </div>
        <div className="hidden md:flex gap-8">
          {['Features', 'Models', 'Compare', 'Pricing'].map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => playSelectSound(0.1)} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] tracking-[0.2em] font-bold">{l}</a>)}
        </div>
        <div className="flex items-center gap-4">
          {user ? <button onClick={handleLogout} className="text-red-400 text-[13px] font-semibold hover:text-red-300">Log Out</button> : <button onClick={triggerAuth} className="text-white/50 text-[13px] font-semibold hover:text-white transition-colors hidden sm:block">Log In</button>}
          <MagBtn onClick={handleDashboardEntry} className="nav-cta-btn bg-omin-gold text-black px-6 py-2.5 rounded-full text-[13px] font-bold shadow-[0_4px_20px_rgba(255,217,61,0.25)] hover:shadow-[0_4px_30px_rgba(255,217,61,0.4)] transition-all">
            Dashboard →
          </MagBtn>
        </div>
      </nav>

      {/* ═══ 1. HERO ═══ */}
      <section className="hero-section relative flex flex-col items-center justify-start min-h-[90vh] text-center px-4 pt-44 pb-10">
        {/* ═══ ✨ ADAPTIVE CORE ✨ (3D on Desktop, CSS on Mobile) ═══ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <MobileHeroBackground />
        </div>

        <div className="relative z-10 mb-6 md:mb-10">
          <span className="glass-pill px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[8.5px] md:text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <span className="text-omin-gold mr-2">✦</span>The Ultimate AI Aggregator
          </span>
        </div>
        <h1 className="hero-heading relative z-10 font-display font-black text-[2.75rem] md:text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.95] md:leading-[0.9] tracking-[-0.04em] mb-6 md:mb-10 text-white flex flex-col items-center">
          <div className="opacity-80">
            68 AI MODELS.
          </div>
          <div className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#FFD93D,45%,#fff,55%,#FFD93D)] bg-[length:250%_100%] animate-shimmer pb-2 md:pb-4">
            ONE DASHBOARD.
          </div>
        </h1>
        <div className="hero-subtitle relative z-10 text-white/50 text-[11px] md:text-[clamp(0.95rem,2vw,1.25rem)] max-w-[280px] md:max-w-3xl leading-[1.6] md:leading-relaxed mb-8 md:mb-12 font-medium">
          GPT-5.4, Claude 4.6 Opus, Gemini 3.1 Pro, Midjourney, and Sora Video. Everything you need for Code, Copy, Audio, and Video — starting at just ₹249.
        </div>
        <div className="hero-cta-row relative z-10 flex flex-col sm:flex-row gap-3 md:gap-4 mb-10 md:mb-12">
          <MagBtn onClick={handleDashboardEntry} className="bg-white text-black px-6 py-3.5 md:px-10 md:py-4 rounded-full font-bold text-[12px] md:text-lg hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.12)] flex items-center justify-center gap-2 group" data-magnetic>
            {user ? 'Go to Dashboard' : 'Start Free — No Card Needed'}<span className="group-hover:translate-x-1 transition-transform">→</span>
          </MagBtn>
          <a href="#compare" className="glass-pill text-white/60 px-6 py-3.5 md:px-8 md:py-4 text-[11px] md:text-base rounded-full font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center" data-magnetic>See Comparison ↓</a>
        </div>
        {/* Live model ticker */}
        <div className="relative z-10 glass-pill px-5 py-2.5 rounded-full flex items-center gap-3">
          <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Live:</span>
          <AnimatePresence mode="wait">
            <motion.span key={liveModel} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs font-bold" style={{ color: MODELS[liveModel].color }}>{MODELS[liveModel].name}</motion.span>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ 2. LOGO CLOUD ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <LogoCloud />
      </Suspense>

      {/* ═══ 3. DASHBOARD MOCKUP (Apple 3D Scroll) ═══ */}
      <section className="dashboard-section relative w-full py-16 md:py-32 flex items-start justify-center bg-black/40">
        <div className="dashboard-viewport w-full max-w-[1400px] px-4 sm:px-6">
          <div className="dashboard-mockup w-full aspect-[16/10] sm:aspect-[16/9] glass-strong rounded-3xl sm:rounded-[2rem] border border-white/15 shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden flex flex-col relative">
            
            {/* Background Corner Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-omin-gold/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-omin-gold/10 blur-[110px] pointer-events-none" />

            <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-6 gap-2 relative z-10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-yellow-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="mx-auto flex items-center gap-2 text-[11px] font-medium text-white/25 tracking-widest uppercase"><motion.div animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-2 h-2 bg-omin-gold rounded-full shadow-[0_0_10px_#FFD93D]" />OMNI AI PRO — Live Preview</div>
            </div>
            <div className="flex-1 flex p-6 gap-6 relative z-10">
              <div className="dashboard-sidebar-mock w-60 hidden lg:flex flex-col gap-3 border-r border-white/5 pr-6">
                <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="h-10 w-full glass-pill rounded-xl flex items-center px-4 gap-3 bg-white/5"><div className="w-4 h-4 bg-omin-gold/20 rounded" /><div className="h-2 w-20 bg-white/15 rounded-full" /></motion.div>
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }} className="h-8 w-full rounded-xl flex items-center px-4 gap-3"><div className="w-4 h-4 bg-white/15 rounded" /><div className="h-2 w-16 bg-white/15 rounded-full" /></motion.div>
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1, ease: 'easeInOut' }} className="h-8 w-full rounded-xl flex items-center px-4 gap-3"><div className="w-4 h-4 bg-white/15 rounded" /><div className="h-2 w-24 bg-white/15 rounded-full" /></motion.div>
              </div>
              <div className="flex-1 flex flex-col gap-5 pt-8 px-4 sm:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="self-end max-w-[75%] glass-pill bg-white/8 p-5 rounded-2xl rounded-tr-sm">
                  <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="h-3 w-48 bg-white/70 rounded-full mb-3" /><div className="h-3 w-32 bg-white/50 rounded-full opacity-60" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="self-start max-w-[80%] relative pl-11">
                  <motion.div animate={{ boxShadow: ['0 0 10px rgba(255,217,61,0.3)', '0 0 25px rgba(255,217,61,0.8)', '0 0 10px rgba(255,217,61,0.3)'], scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 top-0 w-8 h-8 rounded-full bg-omin-gold flex items-center justify-center overflow-hidden z-10">
                    <img src="/logo.png" alt="O" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
                  </motion.div>
                  <div className="text-xs font-bold text-omin-gold uppercase tracking-wider mb-2 flex items-center gap-2">Claude 4.6 <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="px-2 py-0.5 rounded text-[9px] bg-white/10 flex items-center gap-1.5 text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-omin-gold animate-pulse"></span>Reasoning</motion.span></div>
                  <div className="glass-panel bg-black/30 p-5 rounded-2xl relative overflow-hidden shadow-[inset_0_0_20px_rgba(255,217,61,0.02)]">
                    <motion.div className="h-3 bg-white/70 rounded-full mb-3" animate={{ width: ['0px', '280px'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
                    <motion.div className="h-3 bg-white/50 rounded-full mb-4" animate={{ width: ['0px', '350px'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5, repeatDelay: 0.5 }} />
                    <div className="mt-4 border border-white/10 rounded-xl bg-[#030303] p-4 relative overflow-hidden">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="h-2 w-36 bg-blue-400/50 rounded-full mb-2.5" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="h-2 w-56 bg-emerald-400/50 rounded-full mb-2.5 ml-4" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="h-2 w-28 bg-white/30 rounded-full ml-4" />
                      {/* Code block shimmer */}
                      <motion.div animate={{ x: ['-200%', '300%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transform -skew-x-12" />
                    </div>
                    {/* Inner glowing aura */}
                    <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-omin-gold/15 blur-[40px] rounded-full pointer-events-none mix-blend-screen" />
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Foreground Immersive Lighting FX (on top of UI) */}
            <motion.div animate={{ top: ['-100%', '200%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} className="absolute left-0 right-0 h-[250px] bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none blur-xl transform -skew-y-12 mix-blend-overlay z-20" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-omin-black via-black/40 to-transparent opacity-90 pointer-events-none z-20" />
            
            {/* Pulsing Border Glow */}
            <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 rounded-3xl sm:rounded-[2rem] border-[1px] md:border-2 border-omin-gold z-30 pointer-events-none mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* ═══ 4. MARQUEE ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <MarqueeSection />
      </Suspense>

      {/* ═══ 5. LIVE AI DEMO ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <LiveAIDemo />
      </Suspense>

      {/* ═══ 6. BENTO FEATURES ═══ */}
      <section id="features" className="bento-section section-content py-20 md:py-32 px-5 md:px-6 max-w-[1400px] mx-auto relative z-20 flex flex-col lg:flex-row gap-8 lg:gap-20">
        {!isMobile && <Floating3DOrb className="absolute -top-20 -left-40 w-[600px] h-[600px] opacity-20 blur-3xl" />}
        <div className="bento-sidebar lg:w-1/3 lg:sticky lg:top-40 h-fit text-center lg:text-left">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display font-bold text-[2rem] md:text-[clamp(3.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight mb-4 md:mb-6">Unfair<br className="hidden lg:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-omin-gold to-yellow-100 pl-2 lg:pl-0">Advantage.</span></h2>
            <p className="text-white/50 text-[12px] md:text-lg leading-relaxed max-w-[280px] md:max-w-sm mx-auto lg:mx-0">Why pay for 5 different subscriptions when you can have the absolute best AI models in one unified terminal?</p>
          </motion.div>
        </div>
        <div className="bento-cards lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 relative">
          <div className="absolute inset-0 bg-omin-gold/5 blur-[100px] rounded-full pointer-events-none -z-10" />
          <BentoCard className="bento-card-wide md:col-span-2 min-h-[200px] md:min-h-[300px] flex flex-col md:flex-row gap-5 md:gap-8 items-center text-center md:text-left p-6 md:p-8">
            <div className="w-full md:w-3/5">
              <div className="text-omin-gold text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 md:mb-3">Model Ecosystem</div>
              <h3 className="text-[1.5rem] md:text-4xl font-display font-bold mb-2 md:mb-4 leading-tight">
                <CountUp target={68} /> <ScrambleText text="God-Tier AIs." />
              </h3>
              <p className="text-white/60 text-[11px] md:text-sm leading-relaxed max-w-[260px] sm:max-w-none mx-auto">Instantly switch between GPT-5, Claude, Gemini, and open-source titans without leaving your thought process.</p>
            </div>
            <div className="flex flex-wrap md:flex-nowrap flex-1 justify-center gap-2 md:gap-4 opacity-70 md:opacity-60 mt-1 md:mt-0">
              {['openai', 'anthropic', 'googlegemini', 'meta'].map((s, i) => <motion.div key={s} animate={{ y: [0, -15, 0], rotate: [0, i%2?5:-5, 0] }} transition={{ duration: 4 + (i%3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} className="w-9 h-9 md:w-14 md:h-14 rounded-[10px] md:rounded-2xl glass-panel flex items-center justify-center relative"><BrandLogo slug={s} color="#fff" size={16} /></motion.div>)}
            </div>
          </BentoCard>
          <BentoCard delay={0.15} className="min-h-[160px] md:min-h-[280px] flex flex-col justify-between p-6 md:p-8">
            <motion.div animate={{ scale: [1, 1.05, 1], textShadow: ["0px 0px 0px rgba(255,217,61,0)", "0px 0px 20px rgba(255,217,61,0.5)", "0px 0px 0px rgba(255,217,61,0)"] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="text-[2.2rem] md:text-6xl font-display font-black leading-none mb-3 md:mb-0 text-white"><CountUp target={20} suffix="M" /></motion.div>
            <div><h3 className="text-[1rem] md:text-xl font-bold mb-1 md:mb-2">Massive Context</h3><p className="text-white/50 text-[11px] md:text-sm">Analyze entire codebases, PDFs, and books in a single prompt.</p></div>
          </BentoCard>
          <BentoCard delay={0.3} className="min-h-[160px] md:min-h-[280px] flex flex-col justify-between overflow-hidden p-6 md:p-8">
            <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-blue-500/15 blur-[40px] md:blur-[50px]" />
            <div className="flex gap-2.5 md:gap-3 mb-3 md:mb-6 relative z-10">
              <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-8 h-8 md:w-12 md:h-12 rounded-full glass-pill flex items-center justify-center"><BrandLogo slug="midjourney" color="#fff" size={16} /></motion.div>
              <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.15, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="w-8 h-8 md:w-12 md:h-12 rounded-full glass-pill flex items-center justify-center shadow-[0_0_15px_rgba(255,217,61,0.2)]"><BrandLogo slug="openai" color="#a855f7" size={16} /></motion.div>
            </div>
            <div className="relative z-10"><h3 className="text-[1rem] md:text-xl font-bold mb-1 md:mb-2">Image & Video AI</h3><p className="text-white/50 text-[11px] md:text-sm">Generate cinematic Sora videos and Midjourney portraits natively.</p></div>
          </BentoCard>
          <BentoCard delay={0.2} className="min-h-[160px] md:min-h-[280px] flex flex-col justify-between overflow-hidden p-6 md:p-8">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/15 blur-[40px]" />
            <div className="flex items-center justify-center h-24 relative z-10">
              <SiriWave className="opacity-80" />
            </div>
            <div className="relative z-10">
              <h3 className="text-[1rem] md:text-xl font-bold mb-1 md:mb-2">
                <ScrambleText text="Voice & Audio AI" />
              </h3>
              <p className="text-white/50 text-[11px] md:text-sm">Whisper transcription, Suno music generation, and real-time voice chat all built in.</p>
            </div>
          </BentoCard>
          <BentoCard delay={0.35} className="min-h-[160px] md:min-h-[280px] flex flex-col justify-between overflow-hidden p-6 md:p-8">
            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-400/10 blur-[40px]" />
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-[1.5rem] md:text-4xl mb-3 md:mb-4 inline-block drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">🔒</motion.div>
            <div className="relative z-10"><h3 className="text-[1rem] md:text-xl font-bold mb-1 md:mb-2">Enterprise Privacy</h3><p className="text-white/50 text-[11px] md:text-sm">End-to-end encryption, zero-retention APIs, and SOC 2 compliant infrastructure.</p></div>
          </BentoCard>
        </div>
      </section>

      {/* ═══ 7. HOW IT WORKS ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>

      {/* ═══ 8. MODEL LIBRARY ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <ModelLibrary />
      </Suspense>

      {/* ═══ 9. COMPARE TABLE ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <CompareTable />
      </Suspense>

      {/* ═══ 10. TESTIMONIALS ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      {/* ═══ 11. PRICING ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <PricingSection onAction={triggerAuth} />
      </Suspense>

      {/* ═══ 12. FAQ ═══ */}
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>

      {/* ═══ 13. FINAL CTA ═══ */}
      <section className="py-16 md:py-32 px-6 relative flex justify-center z-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="cta-card relative max-w-4xl w-full text-center glass-strong rounded-[2rem] md:rounded-[3rem] p-10 md:p-24 border border-omin-gold/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-omin-gold/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-omin-gold/40 rounded-full animate-float" style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i}s` }} />)}
          <h2 className="font-display font-bold text-3xl md:text-6xl tracking-tight mb-4 md:mb-6 relative z-10">Access the God-Tier.</h2>
          <p className="text-white/60 text-[12px] md:text-lg mb-8 md:mb-12 max-w-[260px] md:max-w-xl mx-auto relative z-10">Claim your unfair advantage today. All 68 models inside one immersive interface.</p>
          <div className="relative z-10"><MagBtn onClick={handleDashboardEntry} className="cta-btn bg-omin-gold text-black px-8 py-3.5 md:px-12 md:py-5 rounded-full font-bold text-[13px] md:text-lg hover:bg-omin-gold/90 shadow-[0_10px_40px_rgba(255,217,61,0.3)] hover:shadow-[0_10px_60px_rgba(255,217,61,0.5)] transition-all">{user ? 'Go to Dashboard' : 'Sign Up Free →'}</MagBtn></div>
        </motion.div>
      </section>

      {/* ═══ 14. FOOTER ═══ */}
      <footer className="border-t border-white/5 bg-[#010101] py-16 md:py-20 px-6 relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="footer-grid flex flex-col md:grid md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="md:col-span-1 border-b border-white/5 pb-6 md:pb-0 md:border-transparent mb-2 md:mb-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <InteractiveLogo size={32} iconSize={20} />
                <span className="font-display font-bold text-sm">OMNI AI PRO</span>
              </div>
              <p className="text-[11px] md:text-xs text-white/30 leading-relaxed max-w-[200px]">The world's most powerful AI aggregator. 68 models, one interface.</p>
            </div>
            <div className="grid grid-cols-3 md:contents gap-4 w-full">
              <div>
                <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-3 md:mb-5">Product</h4>
                <ul className="space-y-2.5 md:space-y-3">{['Features', 'Models', 'Pricing', 'API'].map(l => <li key={l}><a href="#" className="text-xs md:text-sm text-white/30 hover:text-white transition-colors">{l}</a></li>)}</ul>
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-3 md:mb-5">Company</h4>
                <ul className="space-y-2.5 md:space-y-3">{['About', 'Blog', 'Careers', 'Contact'].map(l => <li key={l}><a href="#" className="text-xs md:text-sm text-white/30 hover:text-white transition-colors">{l}</a></li>)}</ul>
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-3 md:mb-5">Legal</h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {[
                    { name: 'Privacy', path: '/privacy' },
                    { name: 'Terms', path: '/terms' },
                    { name: 'Security', path: '/security' },
                    { name: 'DPA', path: '/dpa' }
                  ].map(l => (
                    <li key={l.name}>
                      {l.path.startsWith('/') ? (
                        <Link to={l.path} className="text-xs md:text-sm text-white/30 hover:text-white transition-colors">{l.name}</Link>
                      ) : (
                        <a href={l.path} className="text-xs md:text-sm text-white/30 hover:text-white transition-colors">{l.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
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