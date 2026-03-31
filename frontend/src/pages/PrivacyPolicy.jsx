import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NoiseBg } from './landingComponents';

const Section = ({ number, title, children }) => (
  <section className="pb-10 border-b border-white/5 last:border-0">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-5 flex items-start gap-3">
      <span className="text-omin-gold font-display shrink-0">{number}.</span>
      <span>{title}</span>
    </h2>
    <div className="space-y-4 text-white/65 leading-relaxed text-sm md:text-base">{children}</div>
  </section>
);

const toc = [
  "Introduction", "Scope of This Policy", "Information We Collect", "How We Use Your Information",
  "Zero-Retention AI Policy", "Legal Bases for Processing (GDPR)", "Data Sharing & Third Parties",
  "International Data Transfers", "Data Retention", "Your Rights", "Children's Privacy",
  "Cookie Policy", "Security Measures", "Changes to This Policy", "Contact Us"
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white font-sans relative">
      <NoiseBg />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/8 bg-omin-black/90 backdrop-blur-xl z-50 flex items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ['0 0 10px rgba(255,217,61,0.25)', '0 0 22px rgba(255,217,61,0.55)', '0 0 10px rgba(255,217,61,0.25)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 bg-omin-gold rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
          >
            <img src="/logo.png" alt="O" className="w-5 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
          </motion.div>
          <span className="font-display font-bold tracking-wide hidden sm:block">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-6 text-xs text-white/40">
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          <Link to="/dpa" className="hover:text-white transition-colors">DPA</Link>
        </div>
        <Link to="/" className="ml-8 text-xs font-semibold text-white/40 hover:text-white transition-colors">← Home</Link>
      </header>

      <div className="pt-16 flex max-w-[1200px] mx-auto">
        {/* Sidebar TOC — desktop only */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto py-12 pr-8 pl-6 border-r border-white/5">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-5">Contents</p>
          <ul className="space-y-1">
            {toc.map((item, i) => (
              <li key={i}>
                <a href={`#s${i + 1}`} onClick={() => setActiveSection(i)}
                  className={`block py-1.5 px-3 rounded-lg text-xs transition-all ${activeSection === i ? 'bg-omin-gold/10 text-omin-gold font-semibold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  {i + 1}. {item}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-16 px-6 md:px-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-omin-gold/10 text-omin-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">🔒 Legal Document</div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">Privacy Policy</h1>
              <p className="text-white/40 text-sm">Last Updated: <span className="text-omin-gold">March 31, 2026</span> · Effective Immediately · Applies to all Omni AI Pro services</p>
              <div className="mt-6 p-4 bg-white/3 border border-white/8 rounded-xl text-sm text-white/60">
                This Privacy Policy explains how Omni AI Pro ("we", "our", or "us") collects, uses, stores, and protects your personal information when you use our platform. Please read this document carefully.
              </div>
            </div>

            <div className="space-y-10">
              <Section number="1" title="Introduction">
                <p>Welcome to Omni AI Pro, the world's most powerful unified AI terminal. This Privacy Policy governs your access to and use of the Omni AI Pro website located at <span className="text-omin-gold">omniaipro.com</span> and all associated services, APIs, and mobile applications (collectively, the "Service").</p>
                <p>Omni AI Pro is committed to protecting your privacy and personal data. We believe that privacy is a fundamental right, not a luxury feature. This policy is written in plain language wherever possible and designed to help you understand exactly what data we collect, why we collect it, and how you can control it.</p>
                <p>By accessing or using the Service, you confirm that you have read and understood this Privacy Policy. If you do not agree with any part of this policy, you must discontinue your use of the Service immediately.</p>
              </Section>

              <Section number="2" title="Scope of This Policy">
                <p>This Privacy Policy applies to all users of Omni AI Pro, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visitors to our public-facing website and landing pages.</li>
                  <li>Registered users with a free or paid account.</li>
                  <li>Enterprise customers and their authorized employees using our B2B offering.</li>
                  <li>Developers accessing the Omni AI Pro API programmatically.</li>
                </ul>
                <p>This policy does not apply to the privacy practices of the underlying AI model providers (e.g., OpenAI, Anthropic, Google) once a request has been forwarded to them. Please consult their individual privacy policies for more information on how they handle data.</p>
              </Section>

              <Section number="3" title="Information We Collect">
                <p><strong className="text-white">3.1 Information You Provide Directly</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Account Information:</strong> When you create an account, we collect your name, email address, and password (hashed using bcrypt, never stored in plain text).</li>
                  <li><strong className="text-white/80">Profile Information:</strong> Optional profile picture, username, and preferences that you choose to provide.</li>
                  <li><strong className="text-white/80">Payment Information:</strong> If you subscribe to a paid plan, billing details (name, card last 4 digits, billing address) are handled by our PCI-DSS compliant payment processor, Stripe. We do not store raw card numbers.</li>
                  <li><strong className="text-white/80">Support Communications:</strong> Any messages you send to our support team, including feedback, bug reports, or feature requests.</li>
                </ul>
                <p className="mt-4"><strong className="text-white">3.2 Information Collected Automatically</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Usage Data:</strong> Which AI models you interact with, conversation counts, session duration, and feature usage patterns — used exclusively to improve the Service.</li>
                  <li><strong className="text-white/80">Device & Browser Information:</strong> Browser type, operating system, screen resolution, and device identifiers.</li>
                  <li><strong className="text-white/80">Log Data:</strong> IP address, access timestamps, referrer URL, and error logs. These are retained for 30 days for security and debugging purposes.</li>
                  <li><strong className="text-white/80">Performance Telemetry:</strong> Core Web Vitals metrics (LCP, FID, CLS) collected via Vercel Speed Insights in aggregate, non-identifiable form.</li>
                </ul>
                <p className="mt-4"><strong className="text-white">3.3 Information We Do NOT Collect</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We do not collect or store the content of your AI conversations beyond what is needed to display your personal chat history within your account.</li>
                  <li>We do not collect financial data beyond what your payment processor shares with us.</li>
                  <li>We do not build advertising profiles or sell your data to advertisers.</li>
                </ul>
              </Section>

              <Section number="4" title="How We Use Your Information">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">To Provide the Service:</strong> Authenticating your login, routing your prompts to the selected AI model, and rendering responses in your browser.</li>
                  <li><strong className="text-white/80">To Improve the Service:</strong> Analyzing aggregate usage patterns to identify which features are popular, which models are most reliable, and where users experience friction.</li>
                  <li><strong className="text-white/80">To Communicate With You:</strong> Sending transactional emails (password resets, subscription confirmations, security alerts). We do not send unsolicited marketing emails.</li>
                  <li><strong className="text-white/80">To Ensure Security:</strong> Detecting and preventing unauthorized access, fraud, abuse, and terms-of-service violations.</li>
                  <li><strong className="text-white/80">To Comply With Legal Obligations:</strong> Maintaining records required by applicable law, responding to valid legal requests, and enforcing our Terms of Service.</li>
                </ul>
              </Section>

              <Section number="5" title="Zero-Retention AI Policy">
                <p>Omni AI Pro operates on a strict <strong className="text-omin-gold">Zero-Retention AI Policy</strong>. This means:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your prompts and AI-generated responses are transmitted to the relevant model provider (e.g., OpenAI, Anthropic) exclusively through their <strong className="text-white/80">enterprise API tier</strong>, which contractually prohibits them from using your data to train their foundation models.</li>
                  <li>We do not log or store prompt content in our own infrastructure beyond the duration of the active HTTP request (typically under 500ms).</li>
                  <li>Your chat history displayed in the Omni AI Pro interface is stored in your private, encrypted Supabase database row. Only you — authenticated via your session token — can access this data.</li>
                  <li>We do not perform any analysis, categorization, or sentiment analysis on the content of your conversations.</li>
                </ul>
                <p>This policy is independently enforceable through our agreements with Anthropic (API Policy §4.2), OpenAI (Enterprise API Terms §3.1), and Google (AI Services Addendum §2.b).</p>
              </Section>

              <Section number="6" title="Legal Bases for Processing (GDPR)">
                <p>If you are located in the European Economic Area (EEA), our processing of your personal data is subject to the General Data Protection Regulation (GDPR). Our legal bases are:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Contract Performance (Art. 6(1)(b)):</strong> Processing your account data to deliver the services you subscribed to.</li>
                  <li><strong className="text-white/80">Legitimate Interests (Art. 6(1)(f)):</strong> Using anonymized analytics to improve our product, and security monitoring to prevent fraud.</li>
                  <li><strong className="text-white/80">Legal Obligation (Art. 6(1)(c)):</strong> Retaining financial records as required by tax authorities.</li>
                  <li><strong className="text-white/80">Consent (Art. 6(1)(a)):</strong> For non-essential cookies and marketing communications, only where you have provided explicit consent.</li>
                </ul>
              </Section>

              <Section number="7" title="Data Sharing & Third Parties">
                <p>We do not sell, rent, or trade your personal data. We share data only with the following trusted sub-processors, under strict contractual obligations:</p>
                <div className="overflow-x-auto rounded-xl border border-white/8 mt-4">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/8"><th className="text-left p-4 text-white/50 font-semibold">Provider</th><th className="text-left p-4 text-white/50 font-semibold">Purpose</th><th className="text-left p-4 text-white/50 font-semibold">Location</th></tr></thead>
                    <tbody>
                      {[["Supabase", "Database & Authentication", "US / EU"],["Stripe", "Payment Processing", "US"],["OpenAI", "AI Model Inference", "US"],["Anthropic", "AI Model Inference", "US"],["Google Cloud", "AI Model Inference", "Global"],["Vercel", "Hosting & CDN", "Global"],["Sentry", "Error Monitoring", "US"]].map(([name, purpose, loc]) => (
                        <tr key={name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-4 text-white font-medium">{name}</td>
                          <td className="p-4 text-white/60">{purpose}</td>
                          <td className="p-4 text-white/40">{loc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section number="8" title="International Data Transfers">
                <p>Omni AI Pro is operated from India and serves users globally. When you access our Service, your data may be transferred to and processed in the United States or other countries where our service providers operate.</p>
                <p>For transfers of EEA/UK personal data to third countries, we rely on <strong className="text-white/80">Standard Contractual Clauses (SCCs)</strong> as approved by the European Commission, and supplementary measures where required. Transfers to our US-based providers (Supabase, Stripe, Vercel) are conducted under their respective SCCs and Data Processing Addendums.</p>
              </Section>

              <Section number="9" title="Data Retention">
                <p>We retain your personal data only for as long as necessary to fulfil the purposes described in this policy:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Account Data:</strong> Retained for the lifetime of your account, and for 30 days after account deletion to allow for recovery requests.</li>
                  <li><strong className="text-white/80">Chat History:</strong> Stored indefinitely within your account unless you manually delete individual conversations or request full data deletion.</li>
                  <li><strong className="text-white/80">Server Logs:</strong> Automatically purged after 30 days.</li>
                  <li><strong className="text-white/80">Financial Records:</strong> Retained for 7 years as required by financial regulations.</li>
                  <li><strong className="text-white/80">Backups:</strong> Database backups are overwritten and completely purged on a 30-day rotation cycle.</li>
                </ul>
              </Section>

              <Section number="10" title="Your Rights">
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Right of Access:</strong> Request a copy of all personal data we hold about you.</li>
                  <li><strong className="text-white/80">Right to Rectification:</strong> Correct inaccurate or incomplete data.</li>
                  <li><strong className="text-white/80">Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account and all associated data.</li>
                  <li><strong className="text-white/80">Right to Portability:</strong> Receive your data in a structured, machine-readable format (JSON/CSV).</li>
                  <li><strong className="text-white/80">Right to Object:</strong> Object to processing based on our legitimate interests.</li>
                  <li><strong className="text-white/80">Right to Restrict Processing:</strong> Request that we limit how we use your data while you contest its accuracy or our basis for processing.</li>
                </ul>
                <p>To exercise any of these rights, email us at <a href="mailto:privacy@omniaipro.com" className="text-omin-gold hover:underline">privacy@omniaipro.com</a>. We will respond within 30 days (14 days for EEA users).</p>
              </Section>

              <Section number="11" title="Children's Privacy">
                <p>Omni AI Pro is not directed at children under the age of 13, or under 16 in the EEA. We do not knowingly collect personal data from children. If we become aware that a child has provided us personal data without parental consent, we will take immediate steps to delete that information. If you believe a child has signed up without authorization, please contact us at <a href="mailto:privacy@omniaipro.com" className="text-omin-gold hover:underline">privacy@omniaipro.com</a>.</p>
              </Section>

              <Section number="12" title="Cookie Policy">
                <p>We use the following categories of cookies:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Strictly Necessary Cookies:</strong> Session tokens and authentication cookies required for the platform to function. Cannot be disabled.</li>
                  <li><strong className="text-white/80">Preference Cookies:</strong> Store your UI settings such as selected AI model, theme (light/dark), and sidebar state.</li>
                  <li><strong className="text-white/80">Analytics Cookies:</strong> Vercel Analytics uses privacy-first, cookieless tracking. No identifiable cookies are used for analytics.</li>
                </ul>
                <p>You may manage non-essential cookie preferences via the cookie banner displayed on your first visit.</p>
              </Section>

              <Section number="13" title="Security Measures">
                <p>We implement industry-leading security measures to protect your data. See our full <Link to="/security" className="text-omin-gold hover:underline">Security Architecture</Link> page for a comprehensive overview, including our use of TLS 1.3 encryption in transit, AES-256 encryption at rest, and Supabase Row Level Security (RLS) for database tenant isolation.</p>
              </Section>

              <Section number="14" title="Changes to This Policy">
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. When we make material changes, we will notify you by:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Updating the "Last Updated" date at the top of this page.</li>
                  <li>Sending an email notification to your registered email address at least 14 days before the change takes effect.</li>
                  <li>Displaying a prominent banner on our platform for 7 days following the update.</li>
                </ul>
                <p>Your continued use of the Service after the effective date of the revised policy constitutes your acceptance of the updated terms.</p>
              </Section>

              <Section number="15" title="Contact Us">
                <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through any of the following channels:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[["General Privacy Enquiries", "privacy@omniaipro.com"], ["Data Protection Officer", "dpo@omniaipro.com"], ["GDPR Requests", "gdpr@omniaipro.com"], ["Security Issues", "security@omniaipro.com"]].map(([label, email]) => (
                    <div key={label} className="p-4 bg-white/3 border border-white/8 rounded-xl">
                      <p className="text-white/40 text-xs mb-1">{label}</p>
                      <a href={`mailto:${email}`} className="text-omin-gold hover:underline text-sm font-medium">{email}</a>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-white/40 text-sm">If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority (e.g., the ICO in the UK, or your national DPA within the EEA).</p>
              </Section>
            </div>

            {/* Footer nav */}
            <div className="mt-16 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-white/30">
              <Link to="/terms" className="hover:text-omin-gold transition-colors">Terms of Service</Link>
              <Link to="/security" className="hover:text-omin-gold transition-colors">Security</Link>
              <Link to="/dpa" className="hover:text-omin-gold transition-colors">Data Processing Agreement</Link>
              <Link to="/" className="hover:text-omin-gold transition-colors ml-auto">← Return to Omni AI Pro</Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
