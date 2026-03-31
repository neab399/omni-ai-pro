import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/* ── Icons ── */
const Icons = {
  Back:    () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Chat:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Image:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Voice:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>,
  Video:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Zap:     () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>,
  Users:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star:    () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trend:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Globe:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Sun:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

/* ── Animated Counter ── */
function AnimCounter({ target, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1600;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Mini Bar Chart ── */
function MiniBarChart({ data, color = '#FFD93D', height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height, padding: '0 4px' }}>
      {data.map((d, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(d.value / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: 1, borderRadius: 4,
            background: `linear-gradient(to top, ${color}40, ${color})`,
            minHeight: 4, position: 'relative', cursor: 'pointer',
          }}
          title={`${d.label}: ${d.value}`}
        />
      ))}
    </div>
  );
}

/* ── Activity Ring ── */
function ActivityRing({ percentage, size = 100, strokeWidth = 8, color = '#FFD93D' }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - percentage / 100) }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/* ── Styles ── */
const STYLES = `
  :root[data-theme="dark"] {
    --db-bg: #030305; --db-panel: rgba(14,14,18,0.65); --db-hover: rgba(255,255,255,0.04);
    --db-border: rgba(255,255,255,0.06); --db-text: #f0f0f5; --db-sec: rgba(255,255,255,0.6);
    --db-muted: rgba(255,255,255,0.35); --db-accent: #FFD93D; --db-accent-low: rgba(255,217,61,0.08);
    --db-glow: 0 0 20px rgba(255,217,61,0.1);
  }
  :root[data-theme="light"] {
    --db-bg: #f8f9fa; --db-panel: rgba(255,255,255,0.85); --db-hover: rgba(0,0,0,0.03);
    --db-border: rgba(0,0,0,0.06); --db-text: #09090b; --db-sec: #3f3f46;
    --db-muted: #71717a; --db-accent: #e8a850; --db-accent-low: rgba(232,168,80,0.1);
    --db-glow: 0 0 15px rgba(232,168,80,0.06);
  }
  .db-scroll::-webkit-scrollbar{width:5px;height:5px;}
  .db-scroll::-webkit-scrollbar-track{background:transparent;}
  .db-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:10px;}
  .db-scroll::-webkit-scrollbar-thumb:hover{background:var(--db-accent);}
  @media (max-width: 768px) {
    .db-grid { grid-template-columns: 1fr !important; }
    .db-stat-grid { grid-template-columns: 1fr 1fr !important; }
    .db-header { flex-direction: column; gap: 12px !important; align-items: flex-start !important; }
  }
  @media (max-width: 480px) {
    .db-stat-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ── Mock Data Generator ── */
function generateMockData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyUsage = days.map(d => ({ label: d, value: Math.floor(Math.random() * 80 + 20) }));
  
  const models = [
    { name: 'GPT-5', provider: 'OpenAI', color: '#10a37f', slug: 'openai', uses: 847, tokens: 1240000 },
    { name: 'Claude 4.6 Sonnet', provider: 'Anthropic', color: '#d97757', slug: 'anthropic', uses: 634, tokens: 980000 },
    { name: 'Gemini 3.1 Pro', provider: 'Google', color: '#4285f4', slug: 'googlegemini', uses: 412, tokens: 620000 },
    { name: 'DeepSeek V3.2', provider: 'DeepSeek', color: '#4d6bfe', slug: 'deepseek', uses: 289, tokens: 410000 },
    { name: 'Llama 4', provider: 'Meta', color: '#0081fb', slug: 'meta', uses: 198, tokens: 290000 },
    { name: 'Grok 4', provider: 'xAI', color: '#888', slug: 'x', uses: 156, tokens: 230000 },
  ];
  
  const recentChats = [
    { title: 'React Performance Optimization', model: 'Claude 4.6 Sonnet', time: '2 min ago', tokens: 3421 },
    { title: 'Database Schema Design', model: 'GPT-5', time: '15 min ago', tokens: 5890 },
    { title: 'Marketing Copy Draft', model: 'Gemini 3.1 Pro', time: '1 hour ago', tokens: 2100 },
    { title: 'API Integration Help', model: 'DeepSeek V3.2', time: '3 hours ago', tokens: 4560 },
    { title: 'Code Review Session', model: 'Claude 4.6 Sonnet', time: 'Yesterday', tokens: 8900 },
  ];
  
  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100 + 10),
  }));
  
  return { weeklyUsage, models, recentChats, monthlyData };
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const data = useMemo(() => generateMockData(), []);
  
  useEffect(() => {
    localStorage.setItem('omni-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
      else navigate('/');
      setLoading(false);
    });
  }, [navigate]);
  
  const totalTokens = data.models.reduce((s, m) => s + m.tokens, 0);
  const totalChats = data.models.reduce((s, m) => s + m.uses, 0);
  const topModel = data.models[0];
  
  if (loading) return (
    <div style={{ height: '100vh', background: '#030305', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{STYLES}</style>
      <div style={{ width: 34, height: 34, border: '2px solid #1a1a22', borderTopColor: '#FFD93D', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#555', fontFamily: "'Outfit',sans-serif" }}>Loading Dashboard…</span>
    </div>
  );
  
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  
  const TABS = [
    { id: 'overview', label: 'Overview', icon: Icons.Trend },
    { id: 'models', label: 'Models', icon: Icons.Zap },
    { id: 'activity', label: 'Activity', icon: Icons.Clock },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--db-bg)', color: 'var(--db-text)', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{STYLES}</style>
      
      {/* ═══ HEADER ═══ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--db-border)', background: 'var(--db-panel)', backdropFilter: 'blur(24px)' }}>
        <div className="db-header" style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => navigate('/chat')} style={{ width: 34, height: 34, background: 'var(--db-hover)', border: '1px solid var(--db-border)', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--db-muted)', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--db-accent)'; e.currentTarget.style.color = 'var(--db-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--db-border)'; e.currentTarget.style.color = 'var(--db-muted)'; }}>
              <Icons.Back />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                Dashboard
              </h1>
              <p style={{ fontSize: 12, color: 'var(--db-muted)', margin: 0 }}>Welcome back, {userName}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 3, background: 'var(--db-hover)', borderRadius: 10, padding: 3, border: '1px solid var(--db-border)' }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 700 : 500, background: active ? 'var(--db-panel)' : 'transparent', color: active ? 'var(--db-accent)' : 'var(--db-muted)', boxShadow: active ? 'var(--db-glow)' : 'none', transition: 'all .2s', fontFamily: "'Outfit',sans-serif" }}>
                  <Icon /> <span className="desktop-only">{t.label}</span>
                </button>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
              style={{ width: 34, height: 34, background: 'var(--db-hover)', border: '1px solid var(--db-border)', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--db-muted)' }}>
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--db-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 700, fontSize: 13, color: '#030305' }}>
              {userAvatar ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userName[0]}
            </div>
          </div>
        </div>
      </header>
      
      {/* ═══ CONTENT ═══ */}
      <main className="db-scroll" style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              
              {/* ── Stat Cards ── */}
              <div className="db-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Total Conversations', value: totalChats, icon: Icons.Chat, color: '#FFD93D', suffix: '' },
                  { label: 'Tokens Used', value: Math.round(totalTokens / 1000), icon: Icons.Zap, color: '#4ade80', suffix: 'K' },
                  { label: 'Models Used', value: 18, icon: Icons.Globe, color: '#60a5fa', suffix: '' },
                  { label: 'Hours Saved', value: 127, icon: Icons.Clock, color: '#a855f7', suffix: 'h' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px 18px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${stat.color}08`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                          <Icon />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--db-muted)', fontWeight: 500 }}>{stat.label}</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.03em', color: 'var(--db-text)' }}>
                        <AnimCounter target={stat.value} suffix={stat.suffix} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* ── Charts Row ── */}
              <div className="db-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 28 }}>
                {/* Weekly Usage */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: 0 }}>Weekly Activity</h3>
                      <p style={{ fontSize: 12, color: 'var(--db-muted)', margin: '4px 0 0' }}>Messages sent per day</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--db-accent)', background: 'var(--db-accent-low)', padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>+24% ↑</span>
                  </div>
                  <MiniBarChart data={data.weeklyUsage} height={100} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
                    {data.weeklyUsage.map((d, i) => (
                      <span key={i} style={{ fontSize: 10, color: 'var(--db-muted)', flex: 1, textAlign: 'center' }}>{d.label}</span>
                    ))}
                  </div>
                </motion.div>
                
                {/* Daily Goal Ring */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 16, alignSelf: 'flex-start' }}>Daily Goal</h3>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityRing percentage={73} size={110} />
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: 'var(--db-accent)' }}>73%</div>
                      <div style={{ fontSize: 10, color: 'var(--db-muted)' }}>of daily target</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--db-muted)', marginTop: 14, textAlign: 'center' }}>27 more messages to reach your daily goal</p>
                </motion.div>
              </div>
              
              {/* ── Recent Conversations ── */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px', marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", margin: 0 }}>Recent Conversations</h3>
                  <button onClick={() => navigate('/chat')} style={{ fontSize: 12, color: 'var(--db-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>View all →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {data.recentChats.map((chat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
                      onClick={() => navigate('/chat')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', border: '1px solid transparent', transition: 'all .18s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--db-hover)'; e.currentTarget.style.borderColor = 'var(--db-border)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--db-hover)', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--db-muted)' }}>
                          <Icons.Chat />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--db-muted)' }}>{chat.model} · {chat.time}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--db-muted)', fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{chat.tokens.toLocaleString()} tok</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === 'models' && (
            <motion.div key="models" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Zap /> Most Used Models
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.models.map((model, i) => {
                  const pct = (model.uses / data.models[0].uses) * 100;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${model.color}12`, border: `1px solid ${model.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={`https://cdn.simpleicons.org/${model.slug}/${model.color.replace('#', '')}`} alt="" width={20} height={20} style={{ objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: model.color }}>{model.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--db-muted)' }}>{model.uses} chats · {(model.tokens / 1000).toFixed(0)}K tokens</span>
                        </div>
                        <div style={{ height: 5, background: 'var(--db-hover)', borderRadius: 4, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${model.color}80, ${model.color})` }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--db-accent)', background: 'var(--db-accent-low)', padding: '3px 8px', borderRadius: 99, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>#{i + 1}</span>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Provider distribution */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px', marginTop: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 16 }}>Token Distribution</h3>
                <div style={{ display: 'flex', gap: 2, height: 12, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
                  {data.models.map((m, i) => (
                    <motion.div key={i}
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.tokens / totalTokens) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
                      style={{ background: m.color, minWidth: 4 }}
                      title={`${m.name}: ${((m.tokens / totalTokens) * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {data.models.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--db-sec)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 3, background: m.color }} />
                      {m.name} ({((m.tokens / totalTokens) * 100).toFixed(0)}%)
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Clock /> 30-Day Activity
              </h2>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
                <MiniBarChart data={data.monthlyData} height={140} color="#4ade80" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
                  <span style={{ fontSize: 10, color: 'var(--db-muted)' }}>30 days ago</span>
                  <span style={{ fontSize: 10, color: 'var(--db-muted)' }}>Today</span>
                </div>
              </motion.div>
              
              {/* Activity Timeline */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 16 }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { action: 'Generated image with Flux Schnell', time: '5 min ago', type: 'image', color: '#a855f7' },
                    { action: 'Chat session with Claude 4.6 Sonnet', time: '12 min ago', type: 'chat', color: '#d97757' },
                    { action: 'Voice transcription with Whisper v3', time: '1 hour ago', type: 'voice', color: '#10a37f' },
                    { action: 'Compared GPT-5 vs Claude 4.6 Sonnet', time: '2 hours ago', type: 'chat', color: '#FFD93D' },
                    { action: 'Generated video with Sora', time: '4 hours ago', type: 'video', color: '#ec4899' },
                    { action: 'Chat session with Gemini 3.1 Pro', time: '6 hours ago', type: 'chat', color: '#4285f4' },
                    { action: 'Music generation with Suno v4', time: 'Yesterday', type: 'chat', color: '#a855f7' },
                    { action: 'Image comparison: Midjourney vs DALL-E', time: 'Yesterday', type: 'image', color: '#FFD93D' },
                  ].map((item, i) => {
                    const TypeIcon = item.type === 'image' ? Icons.Image : item.type === 'voice' ? Icons.Voice : item.type === 'video' ? Icons.Video : Icons.Chat;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                        style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < 7 ? '1px solid var(--db-border)' : 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                            <TypeIcon />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.action}</div>
                          <div style={{ fontSize: 11, color: 'var(--db-muted)' }}>{item.time}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
