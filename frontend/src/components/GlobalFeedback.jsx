import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://chutexfnzoylpuikeblz.supabase.co', 'sb_publishable_M_oSfDnhS18elv7J3hsWjw_wcZk6bFp');

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
      className="fixed bottom-4 right-4 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-sans font-semibold text-sm px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,217,61,0.3)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-[#FFD93D]/50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      Share Feedback
    </button>
  );
}
