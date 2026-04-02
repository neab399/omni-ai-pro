import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IC, ALL_TEXT_MODELS, genId } from '../lib/models';

// Using IC from models.jsx instead of local Icons

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
  const [metrics, setMetrics] = useState({ weeklyUsage: [], models: [], recentChats: [], monthlyData: [] });
  const [stats, setStats] = useState({ totalTokens: 0, totalChats: 0, hoursSaved: 0 });

  // ── Fetch Real Data ──
  const fetchMetrics = useCallback(async (userId) => {
    try {
      const { data: usageData, error } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !usageData || usageData.length === 0) {
        console.log("Using Mock Data (Table empty or not found)");
        const mock = generateMockData();
        setMetrics(mock);
        setStats({ 
          totalTokens: mock.models.reduce((s, m) => s + m.tokens, 0), 
          totalChats: mock.models.reduce((s, m) => s + m.uses, 0),
          hoursSaved: 127 
        });
        return;
      }

      // Aggregate Weekly Usage
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekly = days.map(d => ({ label: d, value: 0 }));
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      usageData.forEach(row => {
        const d = new Date(row.created_at);
        if (d > last7Days) {
          const dayName = days[d.getDay()];
          const entry = weekly.find(w => w.label === dayName);
          if (entry) entry.value += 1;
        }
      });

      // Aggregate Models
      const modelMap = {};
      usageData.forEach(row => {
        if (!modelMap[row.model_name]) {
          modelMap[row.model_name] = { name: row.model_name, uses: 0, tokens: 0, color: '#FFD93D', slug: row.provider_slug || 'openai' };
        }
        modelMap[row.model_name].uses += 1;
        modelMap[row.model_name].tokens += (row.tokens_in + row.tokens_out);
      });
      const models = Object.values(modelMap).sort((a, b) => b.uses - a.uses);

      // Recent Chats
      const recentChats = usageData.slice(0, 5).map(row => ({
        title: row.generation_type === 'chat' ? 'Chat Session' : `Generated ${row.generation_type}`,
        model: row.model_name,
        time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: row.tokens_in + row.tokens_out
      }));

      setMetrics({ weeklyUsage: weekly, models, recentChats, monthlyData: [] });
      setStats({
        totalTokens: usageData.reduce((s, r) => s + r.tokens_in + r.tokens_out, 0),
        totalChats: usageData.length,
        hoursSaved: Math.floor(usageData.length * 0.25) // Estimate 15m saved per interaction
      });

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('omni-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchMetrics(session.user.id);
      } else {
        navigate('/');
      }
      setLoading(false);
    });
  }, [navigate, fetchMetrics]);
  
  const totalTokens = stats.totalTokens;
  const totalChats = stats.totalChats;
  const topModel = metrics.models[0] || { name: 'None', color: '#FFD93D' };
  
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
    { id: 'overview', label: 'Overview', icon: IC.Sparkle },
    { id: 'models', label: 'Models', icon: IC.Bolt },
    { id: 'activity', label: 'Activity', icon: IC.Refresh },
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
              <IC.ArrowR style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                OmniAI Commander
              </h1>
              <p style={{ fontSize: 12, color: 'var(--db-muted)', margin: 0 }}>Terminal Ready · {userName}</p>
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
              {theme === 'dark' ? <IC.Sun /> : <IC.Moon />}
            </button>
            <div onClick={() => navigate('/settings')} style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--db-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 700, fontSize: 13, color: '#030305', cursor: 'pointer' }}>
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
              
              {/* ── Quick Actions (Command Center Feel) ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'New Chat', icon: IC.Chat, color: '#FFD93D', path: '/chat?mode=chat' },
                  { label: 'Generate Art', icon: IC.Image, color: '#a855f7', path: '/chat?mode=image' },
                  { label: 'Voice Mode', icon: IC.Mic, color: '#4ade80', path: '/chat?mode=voice' },
                  { label: 'Settings', icon: IC.Settings, color: '#60a5fa', path: '/settings' },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.div key={i}
                      whileHover={{ y: -4, scale: 1.02, boxShadow: 'var(--db-glow)' }}
                      onClick={() => navigate(action.path)}
                      style={{ background: 'var(--db-panel)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '24px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all .2s' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                        <Icon />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>{action.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Stat Cards ── */}
              <div className="db-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Total Interactions', value: totalChats, icon: IC.Chat, color: '#FFD93D', suffix: '' },
                  { label: 'Tokens Used', value: totalTokens < 1000 ? totalTokens : Math.round(totalTokens / 1000), icon: IC.Bolt, color: '#4ade80', suffix: totalTokens < 1000 ? '' : 'K' },
                  { label: 'Models Active', value: metrics.models.length, icon: IC.Sparkle, color: '#60a5fa', suffix: '' },
                  { label: 'Hours Saved', value: stats.hoursSaved, icon: IC.Refresh, color: '#a855f7', suffix: 'h' },
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
                  <MiniBarChart data={metrics.weeklyUsage} height={100} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
                    {metrics.weeklyUsage.map((d, i) => (
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
                  {metrics.recentChats.map((chat, i) => (
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
                <IC.Bolt /> Most Used Models
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {metrics.models.map((model, i) => {
                  const pct = (model.uses / metrics.models[0].uses) * 100;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${model.color}12`, border: `1px solid ${model.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={`https://cdn.simpleicons.org/${model.slug}/${model.color.replace('#', '')}`} alt="" width={20} height={20} style={{ objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: model.color }}>{model.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--db-muted)' }}>{model.uses} interactions · {(model.tokens / 1000).toFixed(0)}K tokens</span>
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
                  {metrics.models.map((m, i) => (
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
                  {metrics.models.map((m, i) => (
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
                <IC.Refresh /> 30-Day Activity
              </h2>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'var(--db-panel)', backdropFilter: 'blur(24px)', border: '1px solid var(--db-border)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
                <MiniBarChart data={metrics.monthlyData.length > 0 ? metrics.monthlyData : metrics.weeklyUsage} height={140} color="#4ade80" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
                  <span style={{ fontSize: 10, color: 'var(--db-muted)' }}>Activity Distribution</span>
                  <span style={{ fontSize: 10, color: 'var(--db-muted)' }}>Real-time</span>
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
                    const TypeIcon = item.type === 'image' ? IC.Image : item.type === 'voice' ? IC.Mic : item.type === 'video' ? IC.Video : IC.Chat;
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
