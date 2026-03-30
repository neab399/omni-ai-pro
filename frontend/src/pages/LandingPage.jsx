import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

/* ══════════════════════════════════════════
   SUPABASE INITIALIZATION
══════════════════════════════════════════ */
const supabaseUrl = 'https://chutexfnzoylpuikeblz.supabase.co';
const supabaseKey = 'sb_publishable_M_oSfDnhS18elv7J3hsWjw_wcZk6bFp';
const supabase = createClient(supabaseUrl, supabaseKey);

/* ══════════════════════════════════════════
   REAL BRAND LOGOS via Simple Icons CDN
══════════════════════════════════════════ */
function BrandLogo({ slug, color, size = 28 }) {
  const hex = color.replace('#', '');
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${hex}`}
      alt={slug}
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

/* ══════════════════════════════════════════
   NOISE TEXTURE & EFFECTS
══════════════════════════════════════════ */
const NoiseBg = () => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', opacity: 0.04 }}>
    <filter id="omni-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
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
      style={{
        position: 'fixed', left: pos.x - 200, top: pos.y - 200, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,217,61,0.055) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 2, transition: 'left 0.06s linear, top 0.06s linear',
      }}
    />
  );
}

function MagBtn({ children, style, onClick }) {
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
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >{children}</motion.button>
  );
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const MODELS = [
  { name: 'GPT-4o', maker: 'OpenAI', color: '#10a37f', use: 'Reasoning & Analysis', slug: 'openai' },
  { name: 'o3-mini', maker: 'OpenAI', color: '#1a8a6e', use: 'Fast Reasoning', slug: 'openai' },
  { name: 'Claude Opus 4', maker: 'Anthropic', color: '#e8a85f', use: 'Deep Thinking', slug: 'anthropic' },
  { name: 'Claude Sonnet', maker: 'Anthropic', color: '#d4924a', use: 'Creative Writing', slug: 'anthropic' },
  { name: 'Gemini 1.5 Pro', maker: 'Google', color: '#4285f4', use: '1M Token Context', slug: 'googlegemini' },
  { name: 'Gemini Flash', maker: 'Google', color: '#34a853', use: 'Lightning Speed', slug: 'googlegemini' },
  { name: 'DALL·E 3', maker: 'OpenAI', color: '#ab68ff', use: 'Image Generation', slug: 'openai' },
  { name: 'Flux Pro', maker: 'Black Forest', color: '#ff4d6d', use: 'HD Image Gen', slug: 'flux' },
  { name: 'Whisper v3', maker: 'OpenAI', color: '#22d3ee', use: 'Voice to Text', slug: 'openai' },
  { name: 'Mistral Large', maker: 'Mistral', color: '#ff7000', use: 'Open Source Power', slug: 'mistralai' },
  { name: 'Llama 3.1 405B', maker: 'Meta', color: '#0082fb', use: 'Open Model', slug: 'meta' },
  { name: 'Perplexity', maker: 'Perplexity', color: '#20b8cd', use: 'Web Search AI', slug: 'perplexity' },
];

const MARQUEE_A = ['GPT-4o', 'Claude Opus 4', 'Gemini 1.5 Pro', 'DALL·E 3', 'Whisper v3', 'Flux Pro', 'Mistral Large', 'Llama 3.1 405B', 'o3-mini', 'Gemini Flash', 'Perplexity AI', 'Claude Sonnet'];
const MARQUEE_B = ['4 Million Tokens', '₹899 Per Month', '₹8,999 Per Year', '12+ Models', 'India Made', 'No Per-Token Billing', 'Enterprise Privacy', 'Cancel Anytime', 'Instant Access', 'Voice Mode', 'Image Generation', 'Web Search'];

function Marquee({ items, reverse }) {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow: 'hidden', display: 'flex' }}>
      <motion.div animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', flexShrink: 0 }}>
        {all.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: i % 2 === 0 ? 'rgba(255,217,61,0.6)' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', fontFamily: 'Space Grotesk, sans-serif' }}>
            <span style={{ fontSize: 5, opacity: 0.5 }}>◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const COMPARE = [
  { label: 'Monthly Cost', omni: '₹899', rival: '₹1,499+', gpt: '~₹1,700', claude: '~₹1,700' },
  { label: 'AI Models', omni: '12+ models', rival: '3–5 models', gpt: '1 model', claude: '1 model' },
  { label: 'Tokens / Month', omni: '4,000,000', rival: '~1,000,000', gpt: '~500,000', claude: '~400,000' },
  { label: 'Image Gen', omni: 'DALL·E 3 + Flux', rival: 'Limited', gpt: 'DALL·E 3', claude: '✗ None' },
  { label: 'Voice Mode', omni: 'Whisper v3', rival: 'Basic', gpt: 'Yes', claude: '✗ None' },
  { label: 'Yearly Price', omni: '₹8,999', rival: '₹14,999+', gpt: '~₹20,400', claude: '~₹20,400' },
  { label: 'Annual Savings', omni: 'Best value 🏆', rival: '+₹6,000', gpt: '+₹11,401', claude: '+₹11,401' },
];

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const [liveModel, setLiveModel] = useState(0);
  const [yearly, setYearly] = useState(false);
  
  // AUTH STATES
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Email Magic Link States
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navBg = useTransform(scrollYProgress, [0, 0.04], ['rgba(8,8,8,0)', 'rgba(8,8,8,0.96)']);
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.93]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLiveModel(p => (p + 1) % MODELS.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Universal OAuth Handler (Google, GitHub, Discord)
  const handleOAuthLogin = async (providerName) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: { redirectTo: `${window.location.origin}/chat` }
    });
    if (error) alert(`${providerName} Login failed: ` + error.message);
  };

  // Magic Link Handler
  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email!");
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: `${window.location.origin}/chat` }
    });
    
    setLoading(false);
    
    if (error) {
      alert("Error sending magic link: " + error.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleLogout = async () => await supabase.auth.signOut();

  const triggerAuth = () => {
    if (user) navigate('/chat');
    else setShowAuthModal(true);
  };

  const bebasStyle = { fontFamily: 'Bebas Neue, sans-serif' };
  const monoStyle = { fontFamily: 'DM Mono, monospace' };

  return (
    <div ref={containerRef} style={{ height: '100vh', overflowY: 'scroll', overflowX: 'hidden', background: '#080808', color: '#fff', fontFamily: 'Space Grotesk, Helvetica Neue, Arial, sans-serif', position: 'relative', scrollBehavior: 'smooth' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; background: #080808; }
        ::-webkit-scrollbar-thumb { background: rgba(255,217,61,0.5); border-radius: 4px; }
        input:focus { outline: none; border-color: #FFD93D !important; }
      `}</style>

      <NoiseBg />
      <CursorGlow />

      {/* ═══ AUTH MODAL POPUP (DIVERSE OPTIONS) ═══ */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#111', width: '100%', maxWidth: 420, padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#A1A1AA', fontSize: 24, cursor: 'pointer', zIndex: 10 }}>×</button>
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome to OMNI AI</h2>
                <p style={{ color: '#A1A1AA', fontSize: 14 }}>Log in or sign up to continue.</p>
              </div>

              {/* DIVERSE OAUTH BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Google */}
                <button onClick={() => handleOAuthLogin('google')} style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                {/* GitHub */}
                <button onClick={() => handleOAuthLogin('github')} style={{ width: '100%', padding: '12px', background: '#24292e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#1b1f23'} onMouseLeave={e => e.target.style.background = '#24292e'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  Continue with GitHub
                </button>

                {/* Discord */}
                <button onClick={() => handleOAuthLogin('discord')} style={{ width: '100%', padding: '12px', background: '#5865F2', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
                  <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.18,46,96.06,53,91.08,65.69,84.69,65.69Z"/></svg>
                  Continue with Discord
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 11, color: '#737373', fontWeight: 600, letterSpacing: '0.05em' }}>OR EMAIL LINK</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Email Magic Link Form */}
              {!emailSent ? (
                <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                    style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14 }}
                  />
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#FFD93D', color: '#080808', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.target.style.transform = 'scale(0.98)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
                    {loading ? 'Sending Link...' : 'Send Magic Link ✨'}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📩</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#4ADE80', marginBottom: 8 }}>Check your email!</h3>
                  <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.5 }}>We sent a magic login link to <strong style={{ color: '#fff' }}>{email}</strong>. Click it to instantly log in.</p>
                  <button type="button" onClick={() => setEmailSent(false)} style={{ background: 'none', border: 'none', color: '#FFD93D', fontSize: 12, marginTop: 16, cursor: 'pointer', fontWeight: 600 }}>← Try another email</button>
                </div>
              )}
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ NAV ═══ */}
      <motion.nav style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 999, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: navBg, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="OMNI AI" style={{ width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255, 217, 61, 0.4))' }} />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>OMNI AI <span style={{ color: '#FFD93D' }}>PRO</span></span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 13, color: '#A3A3A3' }}>
          {[['Models', '#models'], ['Compare', '#compare'], ['Pricing', '#pricing']].map(([label, href]) => (
            <a key={label} href={href} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#A3A3A3'}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
             <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 14px' }}>Log Out</button>
          ) : (
            <button onClick={triggerAuth} style={{ background: 'none', border: 'none', color: '#A3A3A3', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 14px' }}>Log In</button>
          )}
          <MagBtn onClick={triggerAuth} style={{ background: '#FFD93D', border: 'none', color: '#080808', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}>
            {user ? 'Go to Chat →' : 'Start Free →'}
          </MagBtn>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <motion.section style={{ scale: heroScale, opacity: heroOpacity, transformOrigin: 'top center' }}>
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 80px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -52%)', fontSize: 'clamp(160px, 28vw, 380px)', ...bebasStyle, color: 'rgba(255,217,61,0.035)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0, letterSpacing: '-0.04em' }}>899</div>
          
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,217,61,0.1)', border: '1px solid rgba(255,217,61,0.3)', color: '#FFD93D', padding: '6px 18px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>✦ India's Most Affordable AI Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', zIndex: 1, ...bebasStyle, fontSize: 'clamp(68px, 13vw, 168px)', lineHeight: 0.88, letterSpacing: '-0.02em', marginBottom: 26 }}>
            <span style={{ color: '#fff', display: 'block' }}>12+ AI MODELS</span>
            <span style={{ color: '#FFD93D', display: 'block' }}>₹899/MONTH</span>
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.25)', display: 'block', fontSize: '0.58em' }}>4 MILLION TOKENS</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.48 }} style={{ position: 'relative', zIndex: 1, color: '#D4D4D8', fontSize: 'clamp(14px, 1.8vw, 17px)', maxWidth: 520, lineHeight: 1.75, marginBottom: 44 }}>
            GPT-4o, Claude Opus, Gemini Pro, DALL·E 3, Whisper, and 7 more — all in one flat plan.{' '}
            <span style={{ color: '#A1A1AA' }}>Most platforms charge 2× more for a single model.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.62 }} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
            <MagBtn onClick={triggerAuth} style={{ background: '#FFD93D', color: '#080808', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em', boxShadow: '0 0 40px rgba(255,217,61,0.28)' }}>
              {user ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
            </MagBtn>
            <MagBtn style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#D4D4D8', padding: '16px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}><a href="#compare" style={{ textDecoration: 'none', color: 'inherit' }}>See Comparison ↓</a></MagBtn>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ fontSize: 11, color: '#A3A3A3', fontWeight: 700, letterSpacing: '0.1em' }}>NOW LIVE:</span>
            <AnimatePresence mode="wait">
              <motion.span key={liveModel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} style={{ fontSize: 13, fontWeight: 700, color: MODELS[liveModel].color }}>
                {MODELS[liveModel].name}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize: 11, color: '#737373', ...monoStyle }}>+{MODELS.length - 1} more</span>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ width: 1, height: 52, background: 'linear-gradient(to bottom, rgba(255,217,61,0.6), transparent)' }} />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d', padding: '13px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Marquee items={MARQUEE_A} />
        <Marquee items={MARQUEE_B} reverse />
      </div>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}>
          {[
            { big: '4M', sub: 'Tokens / Month' },
            { big: '12+', sub: 'AI Models Included' },
            { big: '₹899', sub: 'Monthly Flat' },
            { big: '₹8,999', sub: 'Yearly — save 2 months' },
            { big: '1M', sub: 'Max Context Window' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ padding: '40px 20px', background: '#0d0d0d', textAlign: 'center' }}>
              <div style={{ ...bebasStyle, fontSize: 'clamp(36px, 4vw, 52px)', color: '#FFD93D', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>{s.big}</div>
              <div style={{ fontSize: 10, color: '#A3A3A3', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ MODELS — REAL LOGOS VIA CDN ═══ */}
      <section id="models" style={{ padding: '40px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#FFD93D', textTransform: 'uppercase', marginBottom: 12 }}>12+ Models Included</div>
          <h2 style={{ ...bebasStyle, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff', marginBottom: 16 }}>
            Every top model.<br />
            <span style={{ color: 'rgba(255,255,255,0.2)', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>One dashboard.</span>
          </h2>
          <p style={{ color: '#D4D4D8', fontSize: 15, maxWidth: 460, lineHeight: 1.65 }}>Switch models mid-conversation. GPT-4o not cutting it? Try Claude. Need an image? DALL·E and Flux are right there.</p>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}>
          {MODELS.map((model, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} style={{ padding: '28px 24px', background: '#0d0d0d', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'background 0.3s' }}
              onMouseEnter={e => {
                const r = parseInt(model.color.slice(1,3),16);
                const g = parseInt(model.color.slice(3,5),16);
                const b = parseInt(model.color.slice(5,7),16);
                e.currentTarget.style.background = `rgba(${r},${g},${b},0.12)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0d0d0d';
              }}
            >
              <div style={{ marginBottom: 16, height: 32, display: 'flex', alignItems: 'center' }}>
                <BrandLogo slug={model.slug} color={model.color} size={30} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>{model.name}</div>
              <div style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 600, marginBottom: 8 }}>{model.maker}</div>
              <div style={{ fontSize: 11, color: model.color, ...monoStyle, opacity: 0.85 }}>{model.use}</div>
              <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: model.color, filter: 'blur(30px)', opacity: 0.15 }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ COMPARE ═══ */}
      <section id="compare" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#FFD93D', textTransform: 'uppercase', marginBottom: 12 }}>Honest Comparison</div>
          <h2 style={{ ...bebasStyle, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff', marginBottom: 16 }}>More models.<br /><span style={{ color: '#FFD93D' }}>Lower price.</span></h2>
          <p style={{ color: '#D4D4D8', fontSize: 15, maxWidth: 480, lineHeight: 1.65, marginBottom: 48 }}>See how OMNI AI PRO stacks up against single-model subscriptions and typical multi-AI bundles in the market.</p>
        </motion.div>

        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 11, color: '#E4E4E7', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Feature</th>
                {['OMNI AI PRO', 'Multi-AI Rival', 'GPT-4o Only', 'Claude Only'].map((h, i) => (
                  <th key={h} style={{ padding: '16px 20px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: i === 0 ? '#FFD93D' : '#D4D4D8', background: i === 0 ? 'rgba(255,217,61,0.05)' : 'transparent', borderLeft: i === 0 ? '1px solid rgba(255,217,61,0.15)' : 'none', borderRight: i === 0 ? '1px solid rgba(255,217,61,0.15)' : 'none' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, ri) => (
                <motion.tr key={ri} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: ri * 0.06 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '15px 20px', fontSize: 13, color: '#A1A1AA', fontWeight: 500 }}>{row.label}</td>
                  <td style={{ padding: '15px 20px', fontSize: 13, color: '#FFD93D', fontWeight: 700, textAlign: 'center', ...monoStyle, background: 'rgba(255,217,61,0.03)', borderLeft: '1px solid rgba(255,217,61,0.12)', borderRight: '1px solid rgba(255,217,61,0.12)' }}>{row.omni}</td>
                  <td style={{ padding: '15px 20px', fontSize: 12, color: '#A3A3A3', textAlign: 'center', ...monoStyle }}>{row.rival}</td>
                  <td style={{ padding: '15px 20px', fontSize: 12, color: '#A3A3A3', textAlign: 'center', ...monoStyle }}>{row.gpt}</td>
                  <td style={{ padding: '15px 20px', fontSize: 12, color: '#A3A3A3', textAlign: 'center', ...monoStyle }}>{row.claude}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 28, padding: '18px 22px', borderRadius: 12, background: 'rgba(255,217,61,0.06)', border: '1px solid rgba(255,217,61,0.2)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📌</span>
          <p style={{ fontSize: 13, color: '#D4D4D8', lineHeight: 1.65 }}>
            <strong style={{ color: '#FFD93D' }}>Yearly plan: ₹8,999 — effectively ₹749/month.</strong>{' '}
            Single-model subscriptions (ChatGPT Plus / Claude Pro) each cost ~₹1,700/month for just one AI. You get 12+ models for half the price of one.
          </p>
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ padding: '40px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        {[
          { n: '01', title: '4 Million Tokens Every Month', body: "That's 3,000+ long essays, 400+ full codebases, or months of daily conversations. We don't throttle you on day 20. Full 4M, every month.", big: '4M', sub: 'tokens/month', color: '#FFD93D' },
          { n: '02', title: 'Yearly: ₹8,999. That Is It.', body: 'Monthly is ₹899. Yearly is ₹8,999 — you get 2 months free. Most single-model plans abroad cost more per month than our full yearly price.', big: '₹749', sub: 'effective/month on yearly', color: '#4ADE80' },
          { n: '03', title: 'Switch 12+ Models Instantly', body: 'Not getting what you want from GPT-4o? Switch to Claude Opus. Need images? DALL·E and Flux are right there. One platform, zero friction.', big: '12+', sub: 'models, one price', color: '#60A5FA' },
          { n: '04', title: 'Your Data Is Yours. Always.', body: 'We do not train on your conversations. We do not sell your data. Encrypted at rest and in transit. Enterprise-grade privacy at ₹899/month.', big: '0', sub: 'data sold or shared', color: '#F472B6' },
        ].map((f, i) => {
          const even = i % 2 === 0;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center', padding: '72px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ order: even ? 0 : 1 }}>
                <div style={{ ...bebasStyle, fontSize: 13, color: '#A1A1AA', letterSpacing: '0.1em', marginBottom: 14 }}>{f.n} / 04</div>
                <h3 style={{ ...bebasStyle, fontSize: 'clamp(34px, 4.5vw, 58px)', lineHeight: 1, letterSpacing: '-0.02em', color: '#fff', marginBottom: 18 }}>{f.title}</h3>
                <p style={{ color: '#D4D4D8', fontSize: 15, lineHeight: 1.78, maxWidth: 460 }}>{f.body}</p>
              </div>
              <div style={{ order: even ? 1 : 0, display: 'flex', justifyContent: 'center' }}>
                <motion.div whileHover={{ scale: 1.04 }} style={{ width: 260, height: 260, borderRadius: 24, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,217,61,0.06) 0%, transparent 70%)' }} />
                  <div style={{ ...bebasStyle, fontSize: 'clamp(48px, 7vw, 72px)', color: f.color, lineHeight: 1, letterSpacing: '-0.03em', position: 'relative' }}>{f.big}</div>
                  <div style={{ fontSize: 10, color: '#A1A1AA', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 8 }}>{f.sub}</div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ ...bebasStyle, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff', marginBottom: 28 }}>Simple pricing.<br /><span style={{ color: '#FFD93D' }}>No tricks.</span></h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: 5 }}>
            {['Monthly', 'Yearly — save 16%'].map((label, i) => (
              <button key={i} onClick={() => setYearly(i === 1)} style={{ padding: '8px 20px', borderRadius: 999, background: (i === 1) === yearly ? '#FFD93D' : 'transparent', color: (i === 1) === yearly ? '#080808' : '#A1A1AA', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.22s' }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden' }}>
          {[
            { name: 'Starter', monthly: 299, yearly: 2999, color: '#A1A1AA', featured: false, badge: 'Best for Students', features: [
              { text: '1M tokens/month', included: true }, { text: 'GPT-4o mini & Claude Haiku', included: true }, { text: 'Standard Response Speed', included: true }, { text: 'Web & mobile app access', included: true }, { text: 'Claude Opus 4 & GPT-4o', included: false }, { text: 'DALL·E 3 & Flux Pro Images', included: false }, { text: 'Whisper Voice Mode', included: false }
            ]},
            { name: 'Pro', monthly: 899, yearly: 8999, color: '#FFD93D', featured: true, features: [
              { text: '4M tokens/month', included: true }, { text: 'All 12+ Premium Models', included: true }, { text: 'Claude Opus 4 & GPT-4o', included: true }, { text: 'DALL·E 3 + Flux Pro Images', included: true }, { text: 'Whisper Voice Mode', included: true }, { text: 'Document analysis (500 pgs)', included: true }, { text: 'Priority Speed & Support', included: true }
            ]},
            { name: 'Team', monthly: 2499, yearly: 23999, color: '#60A5FA', featured: false, features: [
              { text: '20M tokens/month', included: true }, { text: 'Everything in Pro Plan', included: true }, { text: 'Shared Team Workspace', included: true }, { text: 'API Access & Webhooks', included: true }, { text: '99.9% Uptime SLA', included: true }, { text: 'Priority Slack Support', included: true }
            ]},
          ].map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '44px 32px', background: plan.featured ? '#111' : '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
              {plan.featured && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #FFD93D, transparent)' }} />}
              {plan.featured && <span style={{ position: 'absolute', top: 18, right: 18, fontSize: 9, fontWeight: 900, letterSpacing: '0.14em', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,217,61,0.15)', color: '#FFD93D', border: '1px solid rgba(255,217,61,0.3)', textTransform: 'uppercase' }}>POPULAR</span>}
              {!plan.featured && plan.badge && <span style={{ position: 'absolute', top: 18, right: 18, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: '#D4D4D8', border: '1px solid rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>{plan.badge}</span>}
              
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>{plan.name}</div>
              
              <AnimatePresence mode="wait">
                <motion.div key={yearly ? 'y' : 'm'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{ ...bebasStyle, fontSize: 62, lineHeight: 1, color: plan.featured ? '#FFD93D' : '#fff', letterSpacing: '-0.02em' }}>{yearly ? '₹' + Math.round(plan.yearly / 12) : '₹' + plan.monthly}</span>
                    <span style={{ fontSize: 14, color: '#A1A1AA' }}>/mo</span>
                  </div>
                  {yearly && <div style={{ fontSize: 12, color: '#4ADE80', marginBottom: 4 }}>{'₹' + plan.yearly + '/year — save ₹' + ((plan.monthly * 12) - plan.yearly)}</div>}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '28px 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {plan.features.map((feat, fi) => (
                  <div key={fi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: feat.included ? 1 : 0.4 }}>
                    <span style={{ color: feat.included ? (plan.featured ? '#FFD93D' : '#4ADE80') : '#A1A1AA', marginTop: 1, flexShrink: 0, fontSize: 12, fontWeight: 900 }}>{feat.included ? '✓' : '✕'}</span>
                    <span style={{ fontSize: 13, color: feat.included ? '#D4D4D8' : '#A1A1AA', textDecoration: feat.included ? 'none' : 'line-through' }}>{feat.text}</span>
                  </div>
                ))}
              </div>

              <MagBtn onClick={triggerAuth} style={{ width: '100%', padding: '14px', background: plan.featured ? '#FFD93D' : 'rgba(255,255,255,0.08)', border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.15)', color: plan.featured ? '#080808' : '#F8FAFC', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em' }}>
                {plan.featured ? (user ? 'Go to Dashboard →' : 'Start Now →') : 'Get Started'}
              </MagBtn>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '40px 40px 120px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '80px 48px', borderRadius: 24, background: '#0d0d0d', border: '1px solid rgba(255,217,61,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #FFD93D, transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,217,61,0.05) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ ...bebasStyle, fontSize: 'clamp(52px, 10vw, 108px)', lineHeight: 0.88, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20 }}>STOP OVERPAYING.<br /><span style={{ color: '#FFD93D' }}>START NOW.</span></h2>
            <p style={{ color: '#D4D4D8', fontSize: 16, marginBottom: 40, maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.7 }}>₹899/month for 12+ AI models and 4 million tokens. Most single-model plans cost double — and cover only one AI.</p>
            <MagBtn onClick={triggerAuth} style={{ background: '#FFD93D', color: '#080808', border: 'none', padding: '18px 52px', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.02em', boxShadow: '0 0 60px rgba(255,217,61,0.25)' }}>
              {user ? 'Continue to Chat' : 'Start Free — No Card Needed'}
            </MagBtn>
            <p style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 600, marginTop: 16 }}>Instant access · Cancel anytime · Made in India 🇮🇳</p>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 40px', background: '#050505' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, background: '#FFD93D', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#080808' }}>O</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#D4D4D8' }}>OMNI AI PRO</span>
          </div>
          <p style={{ fontSize: 12, color: '#737373' }}>© 2026 OMNI AI PRO · Made with ♥ in India</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'API', 'Blog'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#737373', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D4D4D8'} onMouseLeave={e => e.target.style.color = '#737373'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}