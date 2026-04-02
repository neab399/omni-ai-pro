import { useState, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SplashScreen from './components/SplashScreen';
import CookieNotice from './components/CookieNotice';
import GlobalFeedback from './components/GlobalFeedback';
import InteractiveCursor from './components/InteractiveCursor';
import { ArtifactProvider } from './context/ArtifactContext';
import { initAudioContext } from './lib/audio';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Security = lazy(() => import('./pages/Security'));
const DPAPolicy = lazy(() => import('./pages/DPAPolicy'));

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <ArtifactProvider>
      <div onClick={() => initAudioContext()} onTouchStart={() => initAudioContext()}>
        <InteractiveCursor />
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay noise-grain" />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Router>
          <Suspense fallback={<div className="min-h-screen bg-omin-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-omin-gold/20 border-t-omin-gold rounded-full animate-spin" /></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/security" element={<Security />} />
              <Route path="/dpa" element={<DPAPolicy />} />
            </Routes>
          </Suspense>
        </Router>
        <GlobalFeedback />
        <CookieNotice />
      </div>
      <Analytics />
      <SpeedInsights />
    </ArtifactProvider>
  );
}

export default App;