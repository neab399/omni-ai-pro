import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IC } from '../../lib/models';

export default function StudyTools({ isFocusMode, onToggleFocus }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'short', 'long'
  const timerRef = useRef(null);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') setTimeLeft(25 * 60);
    else if (mode === 'short') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerRef.current);
      // Play a chill sound?
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-notification-blurp-2228.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'work') setTimeLeft(25 * 60);
    else if (newMode === 'short') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  return (
    <div style={{ position: 'fixed', bottom: 100, right: isFocusMode ? '50%' : 24, transform: isFocusMode ? 'translateX(50%)' : 'none', zIndex: 1000, transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: 'auto' }}>
      <AnimatePresence>
        {isFocusMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ padding: '8px 16px', background: 'var(--bg-panel)', backdropFilter: 'var(--panel-blur-strong)', border: '1px solid var(--accent)', borderRadius: 20, boxShadow: 'var(--glow-gold-strong)', display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{ display: 'flex', gap: 4 }}>
              {['work', 'short'].map(m => (
                <button 
                  key={m} 
                  onClick={() => changeMode(m)}
                  style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 6, background: mode === m ? 'var(--accent)' : 'var(--bg-hover)', color: mode === m ? '#000' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                >
                  {m === 'work' ? 'Focus' : 'Break'}
                </button>
              ))}
            </div>
            
            <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-main)', minWidth: 60, textAlign: 'center' }}>
              {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: 2 }}>
              <button 
                onClick={isActive ? pauseTimer : startTimer}
                style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-low)', color: 'var(--accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isActive ? <IC.Stop /> : <IC.Play />}
              </button>
              <button 
                onClick={onToggleFocus}
                style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-hover)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Exit Focus Mode"
              >
                <IC.X />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: 'var(--glow-gold)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFocus}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-panel)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', position: 'relative' }}
          >
             <span style={{ fontSize: 20 }}>⏲️</span>
             <div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent)', boxSize: 14, borderRadius: '50%', border: '2px solid var(--bg-base)', fontSize: 8, fontWeight: 900, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>STUDY</div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
