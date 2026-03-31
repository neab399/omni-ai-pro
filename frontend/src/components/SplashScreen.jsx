import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'OMNI AI PRO'.split('');

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = React.useState(0); // 0=logo, 1=text, 2=exit

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#030305',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Radial glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.6, 0.3], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 500, height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,217,61,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          {/* Orbiting particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                rotate: [i * 60, i * 60 + 360],
              }}
              transition={{ duration: 2.5, delay: 0.3 + i * 0.1, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 200, height: 200,
                pointerEvents: 'none',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                width: 3, height: 3,
                borderRadius: '50%',
                background: '#FFD93D',
                boxShadow: '0 0 10px rgba(255,217,61,0.6)',
                transform: 'translateX(-50%)',
              }} />
            </motion.div>
          ))}

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 80, height: 80,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #FFD93D 0%, #e8a850 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 60px rgba(255,217,61,0.3), 0 0 120px rgba(255,217,61,0.1)',
              marginBottom: 32,
            }}
          >
            <img src="/logo.png" alt="O" style={{ width: 44, filter: 'brightness(0)' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:36px;font-weight:900;color:#030305;font-family:Outfit,sans-serif">O</span>'; }} />
          </motion.div>

          {/* Title — letter by letter */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, perspective: 400 }}>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontSize: letter === ' ' ? 12 : 28,
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '-0.03em',
                  color: i >= 8 ? '#FFD93D' : '#f0f0f5', // "PRO" is gold
                  display: 'inline-block',
                  minWidth: letter === ' ' ? 10 : undefined,
                  textShadow: i >= 8 ? '0 0 20px rgba(255,217,61,0.5)' : 'none',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            68 AI Models · One Platform
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute', bottom: 60,
              width: 140, height: 2,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #FFD93D, #e8a850)',
                borderRadius: 2,
                boxShadow: '0 0 12px rgba(255,217,61,0.4)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
