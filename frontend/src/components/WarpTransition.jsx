import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarpTransition({ active, onComplete }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);
    
    const particles = [];
    const numParticles = 450; 
    
    const maxZ = 1000;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            angle: Math.random() * Math.PI * 2,
            z: Math.random() * maxZ,
            size: Math.random() * 2.5 + 0.5,
            color: Math.random() > 0.4 ? '#FF8C00' : '#FFD93D',
            speed: Math.random() * 0.04 + 0.01,
            // Randomly offset from the main spiral line
            offset: (Math.random() - 0.5) * 60 
        });
    }
    
    let rotation = 0;
    const startTime = Date.now();
    const duration = 1800; // Total duration
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // ─── DYNAMIC PARAMETERS ───
      // Rotation speeds up as we enter
      rotation += 0.04 + (progress * 0.35);
      
      // Radius shrinks significantly as time goes on (Radial Contraction)
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.6;
      const currentPortalRadius = maxRadius * Math.pow(1 - progress, 1.5);
      
      // Speed up forward motion
      const globalSpeed = 5 + (progress * 110);
      
      // Magic Trail
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(5, 5, 5, ${0.12 + (progress * 0.4)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'lighter';
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // ─── DRAW THE SPIRALING LOOP (OPTIONAL CORE GLOW) ───
      if (progress < 0.7) {
        ctx.beginPath();
        const ringGlow = ctx.createRadialGradient(0, 0, currentPortalRadius - 10, 0, 0, currentPortalRadius + 10);
        ringGlow.addColorStop(0, 'transparent');
        ringGlow.addColorStop(0.5, `rgba(255, 140, 0, ${0.2 * (1 - progress)})`);
        ringGlow.addColorStop(1, 'transparent');
        ctx.strokeStyle = ringGlow;
        ctx.lineWidth = 20 * (1 - progress);
        ctx.arc(0, 0, Math.max(1, currentPortalRadius), 0, Math.PI * 2);
        ctx.stroke();
      }

      particles.forEach(p => {
          p.z -= globalSpeed;
          p.angle += p.speed;
          
          if (p.z <= 1) {
              p.z = maxZ;
              p.angle = Math.random() * Math.PI * 2;
          }
          
          // Perspective
          const fov = 450;
          const scale = fov / p.z;
          
          // Vortex Spiral + Radial Contraction Logic
          // The base radius also shrinks, focusing everything into a point
          const x = Math.cos(p.angle + rotation) * (currentPortalRadius + p.offset) * scale;
          const y = Math.sin(p.angle + rotation) * (currentPortalRadius + p.offset) * scale;
          
          const size = p.size * scale;
          
          if (p.z < 950) {
              const alpha = (1 - p.z / maxZ) * (Math.random() > 0.05 ? 1 : 0.4);
              
              ctx.beginPath();
              const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
              grad.addColorStop(0, '#FFFFFF');
              grad.addColorStop(0.4, p.color);
              grad.addColorStop(1, 'transparent');
              
              ctx.fillStyle = grad;
              ctx.globalAlpha = alpha * (1 - progress * 0.3); // Fade slightly at the very end
              
              // Velocity stretch
              const stretch = globalSpeed * 0.15;
              ctx.ellipse(x, y, size, size + stretch, Math.atan2(y, x) + Math.PI/2, 0, Math.PI * 2);
              ctx.fill();
          }
      });
      
      ctx.restore();
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    animate();
    return () => {
        window.removeEventListener('resize', setSize);
        cancelAnimationFrame(animationFrame);
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full bg-black/95" />
          
          {/* Vortex Contraction Point (The Dimension "Exit") */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0.5, 8], opacity: [0, 0, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.6, 0.9, 1], ease: "circIn" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-omin-gold/50 rounded-full blur-3xl pointer-events-none"
          />
          
          {/* Final White-Out Flash (The Passing) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.85, 0.95, 1] }}
            className="absolute inset-0 bg-white mix-blend-overlay z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
