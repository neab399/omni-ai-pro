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
    const numParticles = 400; // Increased density
    
    // Portal ring parameters
    const portalRadius = Math.min(canvas.width, canvas.height) * 0.35;
    
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Cluster particles near the portal radius for the "Loop" feel
        const offset = (Math.random() - 0.5) * 40; 
        particles.push({
            angle: angle,
            baseRadius: portalRadius + offset,
            z: Math.random() * 1000,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.4 ? '#FF8C00' : '#FFD93D',
            speed: Math.random() * 0.05 + 0.01,
            life: Math.random()
        });
    }
    
    let rotation = 0;
    let globalSpeed = 1;
    const startTime = Date.now();
    const duration = 1800; 
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      rotation += 0.05 + (progress * 0.3);
      globalSpeed = 5 + (progress * 90);
      
      // Magic Trail
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(5, 5, 5, ${0.1 + (progress * 0.4)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'lighter';
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // ─── DRAW THE GLOWING CIRCULAR LOOP (PORTAL MOUTH) ───
      const ringOpacity = Math.max(0, (1 - progress * 1.5)) * 0.3;
      if (ringOpacity > 0) {
        ctx.beginPath();
        const ringGlow = ctx.createRadialGradient(0, 0, portalRadius - 20, 0, 0, portalRadius + 20);
        ringGlow.addColorStop(0, 'transparent');
        ringGlow.addColorStop(0.5, `rgba(255, 140, 0, ${ringOpacity})`);
        ringGlow.addColorStop(1, 'transparent');
        ctx.strokeStyle = ringGlow;
        ctx.lineWidth = 40;
        ctx.arc(0, 0, portalRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      particles.forEach(p => {
          p.z -= globalSpeed;
          p.angle += p.speed;
          
          if (p.z <= 1) {
              p.z = 1000;
              p.angle = Math.random() * Math.PI * 2;
          }
          
          // Perspective
          const fov = 450;
          const scale = fov / p.z;
          
          // Spiral motion relative to the "Loop"
          const currentRadius = p.baseRadius * scale;
          const x = Math.cos(p.angle + rotation) * currentRadius;
          const y = Math.sin(p.angle + rotation) * currentRadius;
          
          const size = p.size * scale;
          
          // Render spark if in view
          if (p.z < 950) {
              const alpha = (1 - p.z / 1000) * (Math.random() > 0.1 ? 1 : 0.5);
              
              ctx.beginPath();
              const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
              grad.addColorStop(0, '#FFFFFF');
              grad.addColorStop(0.3, p.color);
              grad.addColorStop(1, 'transparent');
              
              ctx.fillStyle = grad;
              ctx.globalAlpha = alpha;
              
              // Motion blur stretch
              if (progress > 0.3) {
                  const stretch = globalSpeed * 0.2;
                  ctx.ellipse(x, y, size, size + stretch, Math.atan2(y, x) + Math.PI/2, 0, Math.PI * 2);
              } else {
                  ctx.arc(x, y, size, 0, Math.PI * 2);
              }
              ctx.fill();

              // Extra "Electrical" Jitter for high progress
              if (progress > 0.6 && Math.random() > 0.98) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.5;
                ctx.moveTo(x, y);
                ctx.lineTo(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50);
                ctx.stroke();
              }
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
          <canvas ref={canvasRef} className="w-full h-full bg-black/90" />
          
          {/* Dimensional White-Point */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 4], opacity: [0, 0, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.7, 0.9, 1], ease: "expIn" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full blur-2xl"
          />
          
          {/* Final Portal Expansion Flash */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.85, 0.95, 1] }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
