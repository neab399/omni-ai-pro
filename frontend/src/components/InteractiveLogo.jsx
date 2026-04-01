import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function InteractiveLogo({ className = "", size = 32, iconSize = 20 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        boxShadow: [
          '0 5px 15px rgba(255,217,61,0.25)', 
          '0 10px 30px rgba(255,217,61,0.6)', 
          '0 5px 15px rgba(255,217,61,0.25)'
        ],
        y: [0, -4, 0]
      }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative bg-omin-gold rounded-[25%] flex items-center justify-center cursor-pointer flex-shrink-0 ${className}`}
    >
      <motion.div 
        style={{ transform: "translateZ(15px)" }} 
        className="flex items-center justify-center w-full h-full relative z-10"
      >
        <img 
          src="/logo.png" 
          alt="OMNI AI PRO" 
          style={{ width: iconSize, height: iconSize, filter: 'brightness(0)', objectFit: 'contain' }} 
        />
      </motion.div>
      
      {/* Dynamic 3D Glare */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[25%]"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), transparent 50%)",
          x: glareX,
          y: glareY,
          opacity: 0.5,
          mixBlendMode: "overlay"
        }}
      />
      {/* Deep Shadow */}
      <div 
        className="absolute inset-0 rounded-[25%] pointer-events-none"
        style={{
          boxShadow: 'inset 0 -2px 10px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.4)',
        }}
      />
    </motion.div>
  );
}
