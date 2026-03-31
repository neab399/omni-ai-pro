import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // ── Branding to match Omni AI Pro ──────────────────
      colorScheme: 'dark',
      buttonLabel: 'Share Feedback',
      submitButtonLabel: 'Send Feedback',
      // ── Theming ────────────────────────────────────────
      themeLight: { accentBackground: '#FFD93D', accentForeground: '#000' },
      themeDark:  { accentBackground: '#FFD93D', accentForeground: '#000', background: '#0a0a0a', foreground: '#ffffff', backgroundHover: '#111' },
      // ── Widget position ────────────────────────────────
      autoInject: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="min-h-screen bg-omin-black text-white flex items-center justify-center font-display text-xl">An unexpected error occurred. Our team has been notified.</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
