import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo, BentoCard, CountUp, Typewriter, SectionHeader, Marquee } from './landingComponents';
import { MODELS, MARQUEE_ITEMS, COMPARE_DATA, PRICING, FAQ_DATA, TESTIMONIALS, LOGO_PROVIDERS } from './landingData';

/* ═══ 1. LOGO CLOUD ═══ */
export function LogoCloud() {
  return (
    <section className="py-16 px-6 relative z-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-5xl mx-auto text-center">
        <p className="text-[11px] font-bold tracking-[0.3em] text-white/30 uppercase mb-10">Powered by the world's leading AI providers</p>
        <div className="logo-cloud-grid flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {LOGO_PROVIDERS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="opacity-40 hover:opacity-90 transition-opacity duration-500 grayscale hover:grayscale-0">
              <BrandLogo slug={p.slug} color={p.color} name={p.name} size={36} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══ 2. LIVE AI DEMO ═══ */
export function LiveAIDemo() {
  const [phase, setPhase] = useState(0);
  const userPrompt = "Write a Python function that finds the longest palindrome in a string.";
  const aiResponse = `def longest_palindrome(s: str) -> str:
    if len(s) < 2:
        return s
    
    start, max_len = 0, 1
    
    def expand(left, right):
        nonlocal start, max_len
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
    
    for i in range(len(s)):
        expand(i, i)      # odd length
        expand(i, i + 1)  # even length
    
    return s[start:start + max_len]`;

  return (
    <section className="section-content py-32 px-6 max-w-[1000px] mx-auto relative z-20">
      <SectionHeader badge="✦ Live Demo" title="See it in action." subtitle="Watch OMNI AI generate real code in real-time. No signup needed to be impressed." />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="demo-terminal glass-strong rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        {/* Terminal Header */}
        <div className="h-14 border-b border-white/10 bg-white/[0.02] flex items-center px-6 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" /><div className="w-3 h-3 rounded-full bg-yellow-500/80" /><div className="w-3 h-3 rounded-full bg-green-500/80" />
          <div className="mx-auto flex items-center gap-2 text-[11px] font-bold text-white/30 tracking-widest uppercase"><div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]" />omni-terminal</div>
        </div>
        {/* Chat Body */}
        <div className="demo-body p-8 space-y-6 min-h-[400px] font-mono text-[13px]">
          {/* User Message */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 flex-shrink-0">U</div>
            <div className="glass-pill bg-white/5 p-4 rounded-2xl rounded-tl-sm max-w-[90%]">
              <Typewriter text={userPrompt} speed={25} startDelay={500} onDone={() => setTimeout(() => setPhase(1), 600)} />
            </div>
          </div>
          {/* AI Response */}
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-omin-gold flex items-center justify-center text-xs font-display font-black text-black flex-shrink-0">O</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-omin-gold text-[11px] font-bold uppercase tracking-wider">Claude 4.6 Opus</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60">Code</span>
                </div>
                <div className="border border-white/10 rounded-xl bg-[#050505] p-5 overflow-x-auto">
                  <pre className="text-[12.5px] leading-relaxed text-emerald-300/90 whitespace-pre"><Typewriter text={aiResponse} speed={12} startDelay={0} /></pre>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══ 3. HOW IT WORKS ═══ */
export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Choose Your Model', desc: 'Pick from 68 AI models — or let OMNI auto-route to the best one for your task.', icon: '🎯' },
    { num: '02', title: 'Write Your Prompt', desc: 'Use natural language, upload files, paste images, or dictate with voice. OMNI understands everything.', icon: '✍️' },
    { num: '03', title: 'Get God-Tier Results', desc: 'Receive instant, beautifully formatted responses with code, images, audio, or video — all in one place.', icon: '⚡' },
  ];
  return (
    <section className="section-content py-32 px-6 max-w-[1100px] mx-auto relative z-20">
      <SectionHeader badge="How It Works" title="Three steps. Infinite power." />
      <div className="hiw-grid grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hiw-line absolute top-16 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-omin-gold/30 to-transparent hidden md:block" />
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }} className="text-center relative">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-[14px] md:rounded-2xl glass-panel border-white/10 flex items-center justify-center text-xl md:text-2xl relative z-10 bg-omin-black">{s.icon}</div>
            <div className="text-omin-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 md:mb-3">{s.num}</div>
            <h3 className="text-[1.15rem] md:text-xl font-display font-bold mb-2 md:mb-3">{s.title}</h3>
            <p className="text-white/50 text-[13px] md:text-sm leading-relaxed max-w-[280px] md:max-w-xs mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══ 4. MODEL LIBRARY ═══ */
export function ModelLibrary() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? MODELS : MODELS.slice(0, 8);
  return (
    <section id="models" className="section-content py-32 px-6 max-w-[1400px] mx-auto relative z-20">
      <div className="model-lib-header flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="text-omin-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">The God-Tier Library</div>
          <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight leading-none mb-4">
            <CountUp target={68} className="text-omin-gold" /> AI Models.
          </h2>
          <p className="text-white/50 text-lg max-w-xl">Switch models mid-thought. Whether you need Claude's nuance, GPT's logic, or Midjourney's art.</p>
        </motion.div>
        <button onClick={() => setShowAll(!showAll)} className="glass-pill px-8 py-3 rounded-full text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all self-start lg:self-auto">
          {showAll ? 'Show Less ↑' : `View All 68 Models ↓`}
        </button>
      </div>
      <div className="model-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }} className="glass-panel p-5 sm:p-6 rounded-2xl md:rounded-[2rem] relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
            <div className="mb-4"><BrandLogo slug={m.slug} color={m.color} name={m.name} /></div>
            <h3 className="font-bold text-[1.1rem] md:text-lg text-white mb-1 group-hover:text-omin-gold transition-colors">{m.name}</h3>
            <p className="text-xs text-white/40 mb-3">{m.maker}</p>
            <p className="text-[11px] font-semibold" style={{ color: m.color }}>{m.use}</p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: m.color }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══ 5. COMPARE TABLE ═══ */
export function CompareTable() {
  return (
    <section id="compare" className="section-content py-32 px-6 max-w-[1200px] mx-auto relative z-20">
      <SectionHeader title="Stop overpaying." subtitle="One unified subscription that replaces them all." />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="compare-wrapper glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-black/60 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-omin-gold/50 to-transparent" />
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead><tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="p-7 text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] w-1/3">Criteria</th>
              <th className="p-7 text-sm font-black text-omin-gold tracking-widest text-center bg-omin-gold/[0.03] uppercase relative"><span className="relative z-10">OMNI PRO</span><div className="absolute inset-0 bg-gradient-to-b from-omin-gold/10 to-transparent opacity-50" /></th>
              <th className="p-7 text-[11px] font-bold text-white/40 text-center uppercase tracking-widest">ChatGPT+</th>
              <th className="p-7 text-[11px] font-bold text-white/40 text-center uppercase tracking-widest">Claude Pro</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {COMPARE_DATA.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 pl-7 text-sm font-semibold text-white/80">{r.label}</td>
                  <td className="p-6 text-center text-lg font-bold text-white bg-omin-gold/[0.02] border-x border-omin-gold/10">{r.omni}</td>
                  <td className="p-6 text-center text-sm font-medium text-white/40">{r.gpt}</td>
                  <td className="p-6 text-center text-sm font-medium text-white/40">{r.claude}</td>
                </tr>))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (Stacked) */}
        <div className="md:hidden flex flex-col divide-y divide-white/10">
          {COMPARE_DATA.map((r, i) => (
            <div key={i} className="p-5 flex flex-col gap-4">
              <div className="text-[12px] font-bold text-white/60 tracking-wider uppercase">{r.label}</div>
              <div className="bg-omin-gold/[0.05] border border-omin-gold/20 rounded-xl p-4 flex justify-between items-center shadow-[0_0_15px_rgba(255,217,61,0.05)]">
                <span className="text-[10px] font-black tracking-widest text-omin-gold uppercase">OMNI PRO</span>
                <span className="text-[1.05rem] font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">{r.omni}</span>
              </div>
              <div className="flex justify-between items-center px-2 pt-2">
                <span className="text-[10.5px] text-white/40 uppercase font-semibold">ChatGPT+</span>
                <span className="text-[12px] text-white/40 font-medium">{r.gpt}</span>
              </div>
              <div className="flex justify-between items-center px-2 pb-1">
                <span className="text-[10.5px] text-white/40 uppercase font-semibold">Claude Pro</span>
                <span className="text-[12px] text-white/40 font-medium">{r.claude}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══ 6. TESTIMONIALS ═══ */
export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t); }, []);
  return (
    <section className="section-content py-32 px-6 max-w-[1000px] mx-auto relative z-20">
      <SectionHeader badge="Testimonials" title="Loved by builders." subtitle="See what professionals are saying about OMNI AI PRO." />
      <div className="testimonial-container relative h-[280px] sm:h-[240px]">
        <AnimatePresence mode="wait">
          {TESTIMONIALS.map((t, i) => i === active && (
            <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }} transition={{ duration: 0.5 }} className="testimonial-card absolute inset-0 glass-panel rounded-[2rem] p-10 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">{Array.from({ length: t.stars }).map((_, j) => <span key={j} className="star-filled text-lg">★</span>)}</div>
                <p className="text-white text-[16px] leading-relaxed italic font-medium">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-black" style={{ background: t.color }}>{t.initials}</div>
                <div><div className="font-bold text-sm">{t.name}</div><div className="text-xs text-white/40">{t.role}</div></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-omin-gold w-6' : 'bg-white/20'}`} />)}
      </div>
    </section>
  );
}

/* ═══ 7. PRICING ═══ */
export function PricingSection({ onAction }) {
  return (
    <section id="pricing" className="section-content py-32 px-6 max-w-[1200px] mx-auto relative z-20">
      <SectionHeader badge="Pricing" title="Unfairly affordable." subtitle="Access every AI model on earth for less than a single ChatGPT subscription." />
      <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {PRICING.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
            className={`pricing-card rounded-[2rem] p-6 lg:p-8 flex flex-col relative overflow-hidden ${p.popular ? 'pricing-popular-card pricing-popular glass-strong border-omin-gold/30 md:scale-[1.03] z-10' : 'glass-panel'}`}>
            {p.popular && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-omin-gold/60 via-yellow-200 to-omin-gold/60" />}
            {p.popular && <div className="text-[10px] font-black tracking-[0.3em] text-omin-gold uppercase mb-4">★ Most Popular</div>}
            <h3 className="font-display font-bold text-xl md:text-2xl mb-2">{p.tier}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-[2rem] md:text-4xl font-display font-black text-white">₹{p.price}</span>
              <span className="text-white/40 text-xs md:text-sm">{p.period}</span>
            </div>
            <p className="text-white/50 text-xs md:text-sm mb-6 md:mb-8">{p.desc}</p>
            <ul className="flex-1 space-y-3 mb-6 md:mb-8">
              {p.features.map((f, j) => <li key={j} className="flex items-center gap-3 text-xs md:text-sm text-white/70"><span className="text-omin-gold text-[10px] md:text-xs">✓</span>{f}</li>)}
            </ul>
            <button onClick={onAction} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${p.popular ? 'bg-omin-gold text-black hover:bg-omin-gold/90 shadow-[0_0_30px_rgba(255,217,61,0.2)]' : 'glass-pill text-white hover:bg-white/10'}`}>
              {p.popular ? 'Get Pro Now →' : `Choose ${p.tier}`}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══ 8. FAQ ═══ */
export function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="faq-container section-content py-32 px-6 max-w-[800px] mx-auto relative z-20">
      <SectionHeader badge="FAQ" title="Got questions?" subtitle="Everything you need to know about OMNI AI PRO." />
      <div className="space-y-4">
        {FAQ_DATA.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-panel rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors" data-state={open === i ? 'open' : 'closed'}>
              <span className="font-semibold text-[15px] pr-6">{f.q}</span>
              <span className={`accordion-chevron text-white/40 text-xl flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══ 9. MARQUEE SECTION ═══ */
export function MarqueeSection() {
  return (
    <div className="border-y border-white/5 bg-black/40 py-8 flex flex-col gap-4 backdrop-blur-md relative z-20">
      <Marquee items={MARQUEE_ITEMS} /><Marquee items={['Up to 20M Tokens', 'Starting at ₹249', '68 AI Models', 'India Made', 'Text, Image, Audio, Video']} reverse />
    </div>
  );
}
