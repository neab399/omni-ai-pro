import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function GlobalFeedback() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleAuth = (session) => {
      if (session?.user) {
        setUser(session.user);
        // Automatically link this user to their Sentry Feedback
        Sentry.setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.full_name || session.user.email
        });
      } else {
        setUser(null);
        Sentry.setUser(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => handleAuth(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => handleAuth(session));
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // If logged in, attach Sentry's form interceptor to this button
      const feedback = Sentry.getFeedback();
      const btn = document.getElementById('omni-feedback-btn');
      if (feedback && btn) {
        // Sentry intercepts the click on this element and opens the form
        return feedback.attachTo(btn);
      }
    }
  }, [user]);

  const handleClick = () => {
    if (!user) {
      // If not logged in, clicking the button redirects to Landing Page login hash
      window.location.href = '/?auth=true';
    }
  };

  return (
    <button
      id="omni-feedback-btn"
      onClick={handleClick}
      style={{ zIndex: 999999 }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-sans font-semibold text-sm p-3 md:px-5 md:py-3.5 rounded-full md:rounded-2xl shadow-[0_5px_30px_rgba(255,217,61,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-[#FFD93D]/50 group"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span className="hidden md:inline">Share Feedback</span>
    </button>
  );
}
