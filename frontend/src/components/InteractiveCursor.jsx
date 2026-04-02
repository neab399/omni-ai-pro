import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function InteractiveCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 800, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 800, damping: 35 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (!isVisible) setIsVisible(true);
      
      const target = e.target.closest('button, a, .clickable, [role="button"]');
      if (target) {
        setIsPointer(true);
        if (target.getAttribute('data-magnetic') !== null) {
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const weight = 0.5; 
          cursorX.set(e.clientX + (centerX - e.clientX) * weight);
          cursorY.set(e.clientY + (centerY - e.clientY) * weight);
          setMagneticTarget(target);
          return;
        }
      } else {
        setIsPointer(false);
        setMagneticTarget(null);
      }
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isVisible, cursorX, cursorY]);

  return (
    <>
      {/* ─── Fluid Fluid Ring (Snappy Lag) ─── */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
        }}
        className={`fixed pointer-events-none z-[99999] rounded-full border border-omin-gold/40 backdrop-blur-[1px] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        animate={{
          width: isPointer ? (magneticTarget ? 64 : 48) : 32,
          height: isPointer ? (magneticTarget ? 64 : 48) : 32,
          backgroundColor: isPointer ? 'rgba(255, 217, 61, 0.1)' : 'rgba(255, 217, 61, 0.05)',
          borderWidth: isPointer ? '2px' : '1px'
        }}
      >
        <div className="absolute inset-0 rounded-full border border-white/10 scale-[0.8]" />
        {magneticTarget && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute -inset-1 rounded-full border border-dashed border-omin-gold/20"
          />
        )}
      </motion.div>
    </>
  );
}
