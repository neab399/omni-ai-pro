import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DPAPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white selection:bg-omin-gold/30 selection:text-omin-gold font-sans relative pb-32">
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

      <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white">Data Processing Agreement.</h1>
          <p className="text-omin-gold font-medium mb-12 uppercase tracking-widest text-sm">GDPR & CCPA Compliant Sub-processing</p>
          
          <div className="prose prose-invert prose-lg max-w-none text-white/70 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Scope and Applicability</h2>
              <p>This Data Processing Agreement (“DPA”) forms part of the Terms of Service between Omni AI Pro (“Data Processor”) and its users (“Data Controller”). It outlines the roles, responsibilities, and legally-binding constraints governing the processing of personal data.</p>
              <p className="mt-4">When you provide prompts, source code, or internal corporate data to Omni AI Pro, we act solely as a processor, routing your encrypted requests to the underlying Large Language Models (LLMs).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Processing of Customer Data</h2>
              <p>We process customer data purely for the purpose of fulfilling the functionality of our unified AI terminal interface. We shall not use, retain, or disclose personal data for any purpose other than providing these services.</p>
              <p className="mt-4"><strong>Zero Training Obligation:</strong> Under no circumstances will Omni AI Pro use Customer Data to train, fine-tune, or improve our internal models or routing algorithms. Our agreements with sub-processors strictly forbid them from doing the same.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Authorized Subprocessors</h2>
              <p>To provide our services, we utilize industry-leading sub-processors. We maintain strict Data Protection Agreements with all of them to ensure your data stays locked down:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li><strong>Supabase:</strong> For database hosting and authentication (encrypted).</li>
                <li><strong>OpenAI L.L.C.:</strong> For API processing of GPT models (Business Tier).</li>
                <li><strong>Anthropic PBC:</strong> For API processing of Claude models (API Tier).</li>
                <li><strong>Google LLC:</strong> For API processing of Gemini models (Enterprise Tier).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Deletion and Return</h2>
              <p>Upon termination of your Omni AI Pro account, or upon your explicit request via our application interface, we shall promptly delete all your personal data, chat history, and uploaded files from our systems, unless required by national or international law to retain a copy.</p>
              <p className="mt-4">Residual backups containing your data are automatically aggressively recycled and completely purged within 30 days of standard backup rotation cycles.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
              <p>For data protection inquiries or to request a fully signed and countersigned physical copy of this DPA for your enterprise procurement team, contact our Data Protection Officer:</p>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl mt-6">
                <p className="font-bold text-white m-0">DPO Contact:</p>
                <a href="mailto:dpo@omniaipro.com" className="text-omin-gold hover:underline">dpo@omniaipro.com</a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
