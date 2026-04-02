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
    const numParticles = 350;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * (canvas.width * 0.8),
            z: Math.random() * 1000,
            size: Math.random() * 2.5 + 0.5,
            color: Math.random() > 0.3 ? '#FF8C00' : '#FFD93D', // Orange and Gold sparks
            speed: Math.random() * 0.02 + 0.005,
            jitter: Math.random() * 2
        });
    }
    
    let rotation = 0;
    let globalSpeed = 1;
    const startTime = Date.now();
    const duration = 1800; // Match navigation timeout
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Accelerated rotation and forward speed
      rotation += 0.02 + (progress * 0.25);
      globalSpeed = 3 + (progress * 80);
      
      // Clear with trail
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(5, 5, 5, ${0.15 + (progress * 0.35)})`; // Darken trail as we speed up
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Additive blending for "Magic Glow"
      ctx.globalCompositeOperation = 'lighter';
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * 0.1); // Slow global vortex rotation
      
      particles.forEach(p => {
          p.z -= globalSpeed;
          p.angle += p.speed + (progress * 0.05); // Faster spiral
          
          if (p.z <= 1) {
              p.z = 1000;
              p.angle = Math.random() * Math.PI * 2;
              p.radius = Math.random() * (canvas.width * 0.5);
          }
          
          // Perspective projection
          const fov = 400;
          const scale = fov / p.z;
          const x = Math.cos(p.angle) * p.radius * scale;
          const y = Math.sin(p.angle) * p.radius * scale;
          const size = p.size * scale * 1.5;
          
          // Add chaos/sparkle
          const flicker = Math.random() > 0.1 ? 1 : 0.4;
          const jitterX = (Math.random() - 0.5) * p.jitter * 10;
          const jitterY = (Math.random() - 0.5) * p.jitter * 10;
          
          if (p.z < 800) {
              ctx.beginPath();
              const gradient = ctx.createRadialGradient(x + jitterX, y + jitterY, 0, x + jitterX, y + jitterY, size);
              gradient.addColorStop(0, p.color);
              gradient.addColorStop(0.5, p.color + '88');
              gradient.addColorStop(1, 'transparent');
              
              ctx.fillStyle = gradient;
              ctx.globalAlpha = (1 - p.z / 1000) * flicker;
              ctx.arc(x + jitterX, y + jitterY, size, 0, Math.PI * 2);
              ctx.fill();
              
              // Draw a core sparkle
              if (progress > 0.4 && Math.random() > 0.95) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + jitterX, y + jitterY, size/2, size/2);
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
          <canvas ref={canvasRef} className="w-full h-full bg-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40" />
          {/* Central Flash on Exit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 3] }}
            transition={{ duration: 1.8, ease: "easeIn" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-omin-gold blur-[100px] rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
