import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or declined cookies
    const consent = localStorage.getItem('omni-cookie-consent');
    if (!consent) {
      // Small delay so it doesn't pop up the exact millisecond they land
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('omni-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('omni-cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[420px] z-[999]"
        >
          <div className="bg-omin-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(255,217,61,0.05)] text-sm shadow-omin-gold/5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="text-2xl">🍪</div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1 font-display">Your Privacy</h3>
                <p className="text-white/60 leading-relaxed text-xs">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium transition-colors font-sans text-xs"
              >
                Essential Only
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-xl bg-omin-gold text-black font-bold hover:bg-omin-gold/90 transition-colors shadow-[0_0_15px_rgba(255,217,61,0.3)] hover:shadow-[0_0_20px_rgba(255,217,61,0.5)] font-sans text-xs"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
