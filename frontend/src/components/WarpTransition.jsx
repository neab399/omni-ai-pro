import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarpTransition({ active, onComplete }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const numStars = 150;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * canvas.width,
        o: Math.random()
      });
    }
    
    let speed = 0.5;
    const maxSpeed = 45;
    const startTime = Date.now();
    const duration = 1800; // Total duration of warp
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Accelerated easing
      speed = progress < 0.5 
        ? 0.5 + (maxSpeed * Math.pow(progress * 2, 3)) 
        : maxSpeed;
      
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      stars.forEach(s => {
        s.z -= speed;
        if (s.z <= 1) {
          s.z = canvas.width;
          s.x = (Math.random() - 0.5) * canvas.width;
          s.y = (Math.random() - 0.5) * canvas.height;
        }
        
        const px = s.x / (s.z / canvas.width);
        const py = s.y / (s.z / canvas.width);
        
        // Stretch lines based on speed
        const size = (1 - s.z / canvas.width) * 3;
        const stretch = speed > 5 ? speed * 0.4 : 1;
        
        ctx.beginPath();
        // Golden streaks
        const gradient = ctx.createLinearGradient(px, py, px, py + stretch);
        gradient.addColorStop(0, 'rgba(255, 217, 61, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 217, 61, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = size;
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - stretch);
        ctx.stroke();
      });
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
