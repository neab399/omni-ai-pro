import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white selection:bg-omin-gold/30 selection:text-omin-gold overflow-x-hidden font-sans relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-screen pointer-events-none z-10" />
      
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/10 bg-omin-black/80 backdrop-blur-xl z-50 flex items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-omin-gold rounded-xl flex items-center justify-center text-black font-display font-black text-lg shadow-[0_0_20px_rgba(255,217,61,0.3)]">O</div>
          <span className="font-display font-bold text-xl tracking-wide hidden sm:block">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </Link>
        <div className="flex-1" />
        <Link to="/" className="text-sm font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-2">
          ← Back to Home
        </Link>
      </header>

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">Privacy Policy.</h1>
          <p className="text-omin-gold font-medium mb-12">Last Updated: March 31, 2026</p>
          
          <div className="prose prose-invert prose-lg max-w-none text-white/70 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>Welcome to Omni AI Pro ("Company", "we", "our", "us"). We respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website omniaipro.com and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Zero-Retention API and AI Models</h2>
              <p>Omni AI Pro acts as a unified terminal for various third-party AI models (including OpenAI, Anthropic, Google, and Meta). We prioritize your privacy through a <strong>Zero-Retention Policy</strong> for your prompts and generations.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li>We do not use your data, prompts, or generated outputs to train our own internal models.</li>
                <li>API calls made through Omni AI Pro to third-party providers are utilizing their enterprise/API tier terms, which explicitly prohibit them from training on your data.</li>
                <li>Your chat history is stored securely in our database solely for the purpose of syncing across your devices and can be deleted at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information We Collect</h2>
              <p>We may collect several types of information from and about users of our Website, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li><strong>Identity Data:</strong> First name, last name, and email address when you sign up.</li>
                <li><strong>Usage Data:</strong> Information about how you use our application, models accessed, and interaction metrics.</li>
                <li><strong>Cookies & Tracking:</strong> We use essential cookies to maintain your session and preference cookies for UI state. We respect your choices regarding non-essential tracking.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. GDPR & CCPA Compliance</h2>
              <p>If you are a resident of the European Economic Area (EEA) or California, you have specific rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li>The right to access, update or delete the info we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object and restrict processing.</li>
                <li>The right to data portability.</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at privacy@omniaipro.com.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
              <p>To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:privacy@omniaipro.com" className="text-omin-gold hover:underline">privacy@omniaipro.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
