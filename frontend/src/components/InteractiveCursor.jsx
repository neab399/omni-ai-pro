import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function InteractiveCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
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
          // Magnetic effect: blend mouse position with target center
          const weight = 0.5; // How much it snaps
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
    <motion.div
      style={{
        left: springX,
        top: springY,
        x: '-50%',
        y: '-50%',
      }}
      className={`fixed pointer-events-none z-[99999] rounded-full border-2 border-omin-gold/60 backdrop-blur-[2px] transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      animate={{
        width: isPointer ? (magneticTarget ? 60 : 40) : 20,
        height: isPointer ? (magneticTarget ? 60 : 40) : 20,
        backgroundColor: isPointer ? 'rgba(255, 217, 61, 0.15)' : 'rgba(255, 217, 61, 0.05)',
      }}
    >
      <div className="absolute inset-0 rounded-full border border-white/20 scale-[0.8]" />
      {magneticTarget && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 rounded-full border border-omin-gold/10"
        />
      )}
    </motion.div>
  );
}
