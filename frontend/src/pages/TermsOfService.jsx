import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white selection:bg-omin-gold/30 selection:text-omin-gold overflow-hidden font-sans relative">
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
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">Terms of Service.</h1>
          <p className="text-omin-gold font-medium mb-12">Effective Date: March 31, 2026</p>
          
          <div className="prose prose-invert prose-lg max-w-none text-white/70 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using Omni AI Pro ("Website" or "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Omni AI Pro and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Omni AI Pro.</p>
              <p className="mt-4"><strong>AI Generated Content:</strong> You retain ownership of all prompts you submit and all outputs generated through the Service, subject to the terms of the specific underlying AI model providers (e.g., OpenAI, Anthropic).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Subscriptions and Fair Use</h2>
              <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Omni AI Pro employs a Fair Use Policy for "unlimited" usage tiers to prevent automated abuse, API scraping, and account sharing.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li>Accounts are intended for individual human use.</li>
                <li>Automated scripting, botting, or reverse-engineering our API endpoints is strictly prohibited and will result in immediate termination without refund.</li>
                <li>We reserve the right to throttle usage temporarily if an account exhibits highly anomalous behavior that risks platform stability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Uses</h2>
              <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>To exploit, harm, or attempt to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                <li>To generate illegal, harmful, highly hateful, or non-consensual sexually explicit content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties & Limitation of Liability</h2>
              <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Omni AI Pro makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein.</p>
              <p className="mt-4">In no event shall Omni AI Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Changes to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at: <a href="mailto:legal@omniaipro.com" className="text-omin-gold hover:underline">legal@omniaipro.com</a></p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
