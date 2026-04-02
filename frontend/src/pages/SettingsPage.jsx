import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IC } from '../lib/models';

/**
 * Settings Page
 * A premium, glassmorphic interface for managing user preferences and account details.
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [theme, setTheme] = useState(() => localStorage.getItem('omni-theme') || 'dark');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('omni-sound') !== 'false');
  
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
      } else {
        navigate('/');
      }
      setLoading(false);
    });
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('omni-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('omni-sound', soundEnabled);
  }, [soundEnabled]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    setIsSaving(false);
    if (!error) {
      alert('Profile updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return null;

  const TABS = [
    { id: 'profile', label: 'Profile', icon: <IC.Users /> },
    { id: 'appearance', label: 'Appearance', icon: <IC.Layers /> },
    { id: 'account', label: 'Account', icon: <IC.Zap /> },
    { id: 'security', label: 'Security', icon: <IC.X /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-panel)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', sticky: 'top', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <IC.ArrowR style={{ transform: 'rotate(180deg)' }} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Settings</h1>
        </div>
        <button onClick={handleSignOut} style={{ background: 'var(--red-low)', color: 'var(--red)', border: '1px solid var(--red-low)', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Sign Out
        </button>
      </header>

      <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
        {/* Sidebar Tabs */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, border: 'none', background: activeTab === tab.id ? 'var(--accent-low)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500, transition: 'all .2s'
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <div style={{ background: 'var(--bg-panel)', borderRadius: 20, border: '1px solid var(--border-med)', padding: 32, boxShadow: 'var(--shadow-lg)' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Profile Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-main)', fontSize: 14, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Email Address</label>
                    <input value={user?.email || ''} readOnly
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 14, cursor: 'not-allowed', outline: 'none' }} />
                  </div>
                  <button onClick={handleSaveProfile} disabled={isSaving}
                    style={{ background: 'var(--accent)', color: 'var(--bg-base)', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10, alignSelf: 'flex-start' }}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Appearance</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>Visual Theme</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['dark', 'light'].map(t => (
                        <button key={t} onClick={() => setTheme(t)}
                          style={{
                            flex: 1, padding: '20px', borderRadius: 12, border: `2px solid ${theme === t ? 'var(--accent)' : 'var(--border-light)'}`,
                            background: theme === t ? 'var(--accent-low)' : 'var(--bg-hover)', color: theme === t ? 'var(--accent)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 700, textTransform: 'capitalize'
                          }}>
                          {t} Mode
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-hover)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>Sound Effects</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Play subtle sounds on message send/receive</div>
                    </div>
                    <button onClick={() => setSoundEnabled(p => !p)}
                      style={{
                        width: 44, height: 24, borderRadius: 20, background: soundEnabled ? 'var(--accent)' : 'var(--border-med)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all .25s'
                      }}>
                      <div style={{ position: 'absolute', top: 3, left: soundEnabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'all .25s' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Subscription & Plan</h2>
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent-low), transparent)', border: '1px solid var(--accent-low)', borderRadius: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Current Plan</div>
                      <div style={{ fontSize: 24, fontWeight: 800 }}>OmniAI Pro</div>
                    </div>
                    <div style={{ background: 'var(--accent)', color: 'var(--bg-base)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>ACTIVE</div>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>You have full access to all premium models including GPT-5, Claude 4.5, and Sora. Your next billing date is May 1st, 2026.</div>
                </div>
                <button style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border-light)', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Manage Subscription</button>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Security</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 12, border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>Two-Factor Authentication</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Secure your account with 2FA</div>
                    </div>
                    <button style={{ color: 'var(--accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Enable</button>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--red-low)', borderRadius: 12, border: '1px solid var(--red-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--red)' }}>Delete Account</div>
                      <div style={{ fontSize: 12, color: 'var(--red)', opacity: 0.7 }}>Permanently remove all your data</div>
                    </div>
                    <button style={{ color: 'var(--red)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
