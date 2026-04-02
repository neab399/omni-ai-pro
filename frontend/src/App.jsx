import { useState, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SplashScreen from './components/SplashScreen';
import { ArtifactProvider } from './context/ArtifactContext';
import { initAudioContext } from './lib/audio';

const GlobalFeedback = lazy(() => import('./components/GlobalFeedback'));
const CookieNotice = lazy(() => import('./components/CookieNotice'));
// const InteractiveCursor = lazy(() => import('./components/InteractiveCursor'));

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

  // 🚀 Performance: Defer non-critical UI components
  const [renderExtras, setRenderExtras] = useState(false);
  useState(() => {
    const timer = setTimeout(() => setRenderExtras(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🚀 Performance: Prefetch critical chunks while splash screen is active
  useState(() => {
    import('./pages/LandingPage');
    import('./pages/ChatPage');
    import('./pages/DashboardPage');
  }, []);

  return (
    <ArtifactProvider>
      <div onClick={() => initAudioContext()} onTouchStart={() => initAudioContext()}>
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay noise-grain" />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Router>
          <Suspense fallback={<div className="fixed inset-0 bg-[#030305] flex items-center justify-center animate-pulse-slow"><div className="w-8 h-8 border-2 border-omin-gold/20 border-t-omin-gold rounded-full animate-spin" /></div>}>
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
        {renderExtras && (
          <Suspense fallback={null}>
            <GlobalFeedback />
            <CookieNotice />
            {/* <InteractiveCursor /> */}
          </Suspense>
        )}
      </div>
      <Analytics />
      <SpeedInsights />
    </ArtifactProvider>
  );
}

export default App;