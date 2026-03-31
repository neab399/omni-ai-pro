import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Security() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white">Security Architecture.</h1>
          <p className="text-omin-gold font-medium mb-12 uppercase tracking-widest text-sm">Enterprise-Grade Protection</p>
          
          <div className="prose prose-invert prose-lg max-w-none text-white/70 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Threat Intelligence & Encryption</h2>
              <p>Security is the foundation of Omni AI Pro. All data transmitted between your device and our servers is protected using top-tier encryption standards. We utilize TLS 1.3 for all data in transit, ensuring that your prompts, configurations, and identity data cannot be intercepted by malicious actors.</p>
              <p className="mt-4">For data at rest, we rely on Supabase's hardened PostgreSQL infrastructure, which utilizes AES-256 encryption. Our database volumes, backups, and transaction logs are all encrypted by default at the storage level.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Zero-Retention AI Routing</h2>
              <p>As an AI aggregator, we act as a secure proxy between you and the world's most powerful LLMs (GPT-4, Claude 3, Gemini). Our API routing infrastructure operates on a strict Zero-Retention policy:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-white/80">
                <li>We do not cache or store your unencrypted prompts in memory longer than the immediate API request lifecycle.</li>
                <li>API calls to third-party providers (OpenAI, Anthropic) use our enterprise-tier agreements, meaning your data is <strong>never</strong> used to train their models.</li>
                <li>Your chat history is persisted in your user-siloed database row and is completely inaccessible to anyone but you.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Row Level Security (RLS)</h2>
              <p>Our database architecture enforces strict isolation. We utilize Row Level Security (RLS) in Supabase. This means the database compiler itself strictly enforces that queries can only return rows that match your uniquely authenticated Session ID constraint. Even in the highly unlikely event of an application-layer vulnerability, the database physical layer prevents data leakage across tenants.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Compliance & Auditing</h2>
              <p>We are continuously working towards holding full SOC 2 Type II and ISO 27001 certifications. We undergo quarterly penetration testing by third-party security firms to identify and remediate potential vulnerabilities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Responsible Disclosure</h2>
              <p>If you believe you have found a security vulnerability in Omni AI Pro, please report it immediately to our security team. We take all reports seriously and will investigate promptly.</p>
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl mt-6">
                <p className="font-bold text-white m-0">Security Contact:</p>
                <a href="mailto:security@omniaipro.com" className="text-omin-gold hover:underline">security@omniaipro.com</a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
