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
  "Introduction & Scope", "Definitions", "Roles & Responsibilities",
  "Nature & Purpose of Processing", "Types of Personal Data Processed",
  "Authorized Sub-Processors", "Zero-Training Guarantee", "Confidentiality Obligations",
  "Security of Processing (Art. 32 GDPR)", "International Data Transfers",
  "Data Subject Rights Assistance", "Data Retention & Deletion",
  "Breach Notification", "Enterprise & Custom DPA", "Governing Law", "Contact"
];

export default function DPAPolicy() {
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white font-sans relative">
      <NoiseBg />

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
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
        </div>
        <Link to="/" className="ml-8 text-xs font-semibold text-white/40 hover:text-white transition-colors">← Home</Link>
      </header>

      <div className="pt-16 flex max-w-[1200px] mx-auto">
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

        <main className="flex-1 py-16 px-6 md:px-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-omin-gold/10 text-omin-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">⚖️ GDPR Compliant</div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">Data Processing Agreement</h1>
              <p className="text-white/40 text-sm">Effective Date: <span className="text-omin-gold">March 31, 2026</span> · Pursuant to GDPR Art. 28</p>
              <div className="mt-6 p-4 bg-white/3 border border-white/8 rounded-xl text-sm text-white/60">
                This Data Processing Agreement ("DPA") supplements the Terms of Service and is incorporated therein by reference. It governs all processing of personal data by Omni AI Pro ("Processor") on behalf of the Controller (the User or Enterprise Customer).
              </div>
            </div>

            <div className="space-y-10">
              <Section number="1" title="Introduction & Scope">
                <p>This Data Processing Agreement ("DPA") is entered into between Omni AI Pro ("Data Processor", "we") and the entity or individual accepting these terms ("Data Controller", "you"). This DPA forms part of the agreement established by accepting the Omni AI Pro Terms of Service.</p>
                <p>This DPA applies wherever Omni AI Pro processes personal data relating to individuals within the jurisdiction of any applicable data protection law, including without limitation the EU General Data Protection Regulation (GDPR), the UK GDPR, the California Consumer Privacy Act (CCPA), India's Digital Personal Data Protection Act (DPDPA) 2023, and other equivalent national laws.</p>
                <p>Where there is a conflict between this DPA and the Terms of Service with respect to data protection matters, this DPA shall control.</p>
              </Section>

              <Section number="2" title="Definitions">
                <p>For the purposes of this DPA, the following definitions apply:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">"Personal Data"</strong> means any information relating to an identified or identifiable natural person as defined under applicable data protection law.</li>
                  <li><strong className="text-white/80">"Processing"</strong> means any operation performed on personal data, including collection, storage, use, disclosure, deletion, or any other manipulation.</li>
                  <li><strong className="text-white/80">"Data Controller"</strong> means the entity that determines the purposes and means of processing personal data (the User/Customer).</li>
                  <li><strong className="text-white/80">"Data Processor"</strong> means Omni AI Pro, which processes personal data on behalf of and under the documented instructions of the Controller.</li>
                  <li><strong className="text-white/80">"Sub-Processor"</strong> means any third party engaged by Omni AI Pro to process personal data as part of delivering the Service.</li>
                  <li><strong className="text-white/80">"Data Subject"</strong> means the natural person to whom personal data relates (typically, the end user of the Service).</li>
                </ul>
              </Section>

              <Section number="3" title="Roles & Responsibilities">
                <p><strong className="text-white">3.1 Controller's Responsibilities:</strong> The Data Controller is responsible for:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ensuring that the collection and transfer of personal data to Omni AI Pro for processing is lawful, fair, and transparent under applicable law.</li>
                  <li>Providing the necessary data protection notices to data subjects.</li>
                  <li>Issuing documented processing instructions to Omni AI Pro that are lawful under applicable data protection law.</li>
                </ul>
                <p className="mt-4"><strong className="text-white">3.2 Processor's Responsibilities:</strong> Omni AI Pro, as Data Processor, agrees to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Process personal data only on documented instructions from the Controller.</li>
                  <li>Inform the Controller immediately if, in our opinion, any instruction violates applicable data protection law.</li>
                  <li>Ensure that all personnel with access to personal data are bound by appropriate confidentiality obligations.</li>
                  <li>Implement and maintain appropriate technical and organizational security measures.</li>
                  <li>Assist the Controller in fulfilling its data subject rights obligations.</li>
                </ul>
              </Section>

              <Section number="4" title="Nature & Purpose of Processing">
                <p>Omni AI Pro processes personal data solely for the purpose of providing the unified AI terminal Service as described in the Terms of Service. Specifically, this includes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Authenticating users and managing secure session tokens.</li>
                  <li>Routing AI prompts submitted by the Controller's end users to the appropriate third-party model provider API.</li>
                  <li>Storing and retrieving user conversation history for display within the authenticated user interface.</li>
                  <li>Processing subscription and billing information in conjunction with Stripe.</li>
                  <li>Monitoring application health, performance, and error rates for service reliability purposes.</li>
                </ul>
                <p>Processing for any other purpose requires explicit documented instruction from the Controller.</p>
              </Section>

              <Section number="5" title="Types of Personal Data Processed">
                <p>In the course of providing the Service, Omni AI Pro processes the following categories of personal data:</p>
                <div className="overflow-x-auto rounded-xl border border-white/8 mt-4">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/8 bg-white/3"><th className="text-left p-4 text-white/50 font-semibold">Category</th><th className="text-left p-4 text-white/50 font-semibold">Examples</th><th className="text-left p-4 text-white/50 font-semibold">Legal Basis</th></tr></thead>
                    <tbody>
                      {[
                        ["Identity Data","Name, email address, username","Contract Performance (Art. 6(1)(b))"],
                        ["Credentials","Hashed passwords, OAuth tokens","Contract Performance"],
                        ["Usage Data","Model selections, token counts, session duration","Legitimate Interests (Art. 6(1)(f))"],
                        ["Technical Data","IP address, browser type, device OS","Legitimate Interests"],
                        ["Billing Data","Name, last 4 card digits (via Stripe)","Contract Performance"],
                        ["Content Data","AI prompts & chat history","Contract Performance"]
                      ].map(([cat, ex, basis]) => (
                        <tr key={cat} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-4 text-white font-medium">{cat}</td>
                          <td className="p-4 text-white/50">{ex}</td>
                          <td className="p-4 text-white/40 text-xs">{basis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">We do not process special categories of personal data (e.g., health, biometric, religious, or political data) unless explicitly instructed to do so by the Controller under a separate written agreement.</p>
              </Section>

              <Section number="6" title="Authorized Sub-Processors">
                <p>Pursuant to GDPR Article 28(2), the Controller provides general authorization for Omni AI Pro to engage sub-processors. We maintain a current list of all authorized sub-processors, including their name, location, and the nature of processing:</p>
                <div className="overflow-x-auto rounded-xl border border-white/8 mt-4">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/8 bg-white/3"><th className="text-left p-4 text-white/50 font-semibold">Sub-Processor</th><th className="text-left p-4 text-white/50 font-semibold">Processing Activity</th><th className="text-left p-4 text-white/50 font-semibold">Location</th></tr></thead>
                    <tbody>
                      {[
                        ["Supabase Inc.", "Database hosting, authentication", "US / EU (AWS)"],
                        ["Stripe Inc.", "Payment processing", "United States"],
                        ["OpenAI L.L.C.", "AI model inference (GPT series)", "United States"],
                        ["Anthropic PBC", "AI model inference (Claude series)", "United States"],
                        ["Google LLC", "AI model inference (Gemini series)", "Global"],
                        ["Vercel Inc.", "Frontend hosting, CDN, edge compute", "Global"],
                        ["Sentry Inc.", "Error monitoring, crash analytics", "United States"]
                      ].map(([name, activity, loc]) => (
                        <tr key={name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-4 text-white font-medium">{name}</td>
                          <td className="p-4 text-white/50">{activity}</td>
                          <td className="p-4 text-white/40">{loc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">We will notify the Controller of any intended changes to this list (addition or replacement of sub-processors) with at least 14 days' notice, providing the Controller the opportunity to object.</p>
              </Section>

              <Section number="7" title="Zero-Training Guarantee">
                <p>Omni AI Pro makes the following binding commitment regarding AI training in this DPA:</p>
                <div className="p-5 bg-omin-gold/5 border border-omin-gold/20 rounded-xl">
                  <p className="text-omin-gold font-semibold mb-3">Zero-Training Contractual Guarantee</p>
                  <p className="text-white/70 text-sm">Omni AI Pro contractually guarantees that neither it nor any of its authorized sub-processors will use any personal data, prompts, conversation content, or AI-generated outputs processed through the Service to train, fine-tune, evaluate, or otherwise improve any machine learning model, foundation model, or AI system, including but not limited to the LLMs offered through the platform.</p>
                </div>
                <p className="mt-4">This guarantee is backed by binding Data Processing Agreements with each of our model provider sub-processors, who operate on API-tier terms that explicitly prohibit model training on customer API data.</p>
              </Section>

              <Section number="8" title="Confidentiality Obligations">
                <p>Omni AI Pro shall ensure that all employees, contractors, and agents who have access to personal data in the course of providing the Service are bound by appropriate confidentiality obligations, whether through employment contracts, contractor agreements, or non-disclosure agreements.</p>
                <p>Access to personal data is granted on a strict need-to-know basis. We maintain a documented access control register and conduct quarterly access reviews to revoke permissions that are no longer required.</p>
              </Section>

              <Section number="9" title="Security of Processing (Art. 32 GDPR)">
                <p>Pursuant to Article 32 of the GDPR, Omni AI Pro implements appropriate technical and organizational measures to ensure a level of security appropriate to the risk. These measures include, but are not limited to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Pseudonymisation and encryption of personal data (AES-256 at rest, TLS 1.3 in transit).</li>
                  <li>The ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems.</li>
                  <li>The ability to restore the availability of personal data in a timely manner in the event of a physical or technical incident (maintained RPO of 24 hours via automated backups).</li>
                  <li>A process for regularly testing, assessing, and evaluating the effectiveness of technical and organizational measures.</li>
                </ul>
                <p>See our full <Link to="/security" className="text-omin-gold hover:underline">Security Architecture</Link> page for a complete technical breakdown of all implemented controls.</p>
              </Section>

              <Section number="10" title="International Data Transfers">
                <p>Where personal data originating in the EEA, UK, or other jurisdictions with restrictions on international transfers is processed by Omni AI Pro or its sub-processors in a third country (e.g., the United States), we ensure that such transfers are subject to appropriate safeguards including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Standard Contractual Clauses (SCCs):</strong> We rely on the European Commission's approved SCCs (Controller-to-Processor and Controller-to-Controller modules as appropriate) for all transfers to US-based sub-processors.</li>
                  <li><strong className="text-white/80">UK IDTA:</strong> For transfers from the United Kingdom, we rely on the UK Information Commissioner's Office (ICO) International Data Transfer Agreement (IDTA).</li>
                  <li><strong className="text-white/80">Supplementary Measures:</strong> Where required by the Schrems II ruling, we implement supplementary technical measures (encryption, pseudonymization) to reduce the risk associated with any government access requests in the destination country.</li>
                </ul>
                <p>A copy of the applicable SCCs and transfer impact assessments is available upon written request to <a href="mailto:dpo@omniaipro.com" className="text-omin-gold hover:underline">dpo@omniaipro.com</a>.</p>
              </Section>

              <Section number="11" title="Data Subject Rights Assistance">
                <p>Pursuant to Articles 15–22 of the GDPR, Omni AI Pro will provide reasonable technical assistance to the Controller in fulfilling requests from data subjects exercising their rights, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Access (Art. 15):</strong> We will provide a data export of all personal data associated with a specified user account within 14 days of a valid written request.</li>
                  <li><strong className="text-white/80">Rectification (Art. 16):</strong> Users may update their profile information directly within the app. For data stored in system logs, we will action correction requests within 30 days.</li>
                  <li><strong className="text-white/80">Erasure (Art. 17):</strong> Upon a valid deletion request, we will permanently delete the specified user account and all associated personal data (excluding data we are legally required to retain) within 30 days.</li>
                  <li><strong className="text-white/80">Portability (Art. 20):</strong> We will provide a complete data export in structured JSON format upon request.</li>
                  <li><strong className="text-white/80">Restriction (Art. 18) and Objection (Art. 21):</strong> We will honour these requests within the timelines and scope specified by applicable law.</li>
                </ul>
              </Section>

              <Section number="12" title="Data Retention & Deletion">
                <p>Omni AI Pro retains personal data only for as long as necessary to fulfil the contractual obligations described in this DPA or as required by applicable law. Our standard retention schedule is:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Active Account Data:</strong> Retained for the duration of the account plus 30 days following deletion (recovery window).</li>
                  <li><strong className="text-white/80">Conversation History:</strong> Retained indefinitely until deleted by the user or upon account deletion.</li>
                  <li><strong className="text-white/80">Access Logs:</strong> Retained for 30 days then automatically purged.</li>
                  <li><strong className="text-white/80">Billing Records:</strong> Retained for 7 years as mandated by financial regulations.</li>
                  <li><strong className="text-white/80">Database Backups:</strong> Retained on a 30-day rolling basis and then permanently deleted.</li>
                </ul>
                <p>Upon termination of the service relationship, we will, at the Controller's choice, either return all personal data to the Controller in a portable format or securely delete all personal data within 30 days, and provide written confirmation to the Controller upon completion.</p>
              </Section>

              <Section number="13" title="Breach Notification">
                <p>In the event of a personal data breach (as defined under Article 4(12) of the GDPR), Omni AI Pro will:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Notify the Controller of the breach without undue delay, and in any event within <strong className="text-white/80">48 hours</strong> of becoming aware of the breach.</li>
                  <li>The notification will include, to the extent then-known: (a) a description of the nature of the breach; (b) the categories and approximate number of data subjects affected; (c) the categories and approximate number of records concerned; (d) the name and contact details of our Data Protection Officer; (e) a description of the likely consequences; and (f) a description of the measures taken or proposed to address the breach.</li>
                  <li>We will cooperate fully with the Controller in notifying affected data subjects and relevant supervisory authorities within the timelines required by applicable law.</li>
                </ul>
              </Section>

              <Section number="14" title="Enterprise & Custom DPA">
                <p>Enterprise customers requiring a customized, co-signed physical DPA for their procurement, legal, or compliance teams may request one by contacting our DPO. Enterprise DPAs may include additional provisions for:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Custom data retention schedules.</li>
                  <li>Enhanced audit rights, including the right to conduct on-site audits or commission third-party assessments.</li>
                  <li>Specific data residency requirements (e.g., EU-only data storage).</li>
                  <li>Custom sub-processor approval workflows.</li>
                  <li>Additional contractual liability caps aligned to enterprise subscription values.</li>
                </ul>
                <p>Contact <a href="mailto:enterprise@omniaipro.com" className="text-omin-gold hover:underline">enterprise@omniaipro.com</a> to initiate an enterprise DPA discussion.</p>
              </Section>

              <Section number="15" title="Governing Law">
                <p>This DPA shall be governed by the laws of India, without regard to conflict of laws principles, except where superseded by mandatory provisions of data protection law applicable in the Controller's jurisdiction (e.g., GDPR shall govern EEA Controllers with respect to EU-specific provisions).</p>
                <p>Any disputes arising from or relating to this DPA shall be resolved in accordance with the dispute resolution mechanism set out in the Terms of Service.</p>
              </Section>

              <Section number="16" title="Contact">
                <p>For all data protection, privacy, and DPA enquiries, please contact:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[["Data Protection Officer", "dpo@omniaipro.com"],["Privacy General", "privacy@omniaipro.com"],["GDPR Specific", "gdpr@omniaipro.com"],["Enterprise DPA", "enterprise@omniaipro.com"]].map(([label, email]) => (
                    <div key={label} className="p-4 bg-white/3 border border-white/8 rounded-xl">
                      <p className="text-white/40 text-xs mb-1">{label}</p>
                      <a href={`mailto:${email}`} className="text-omin-gold hover:underline text-sm font-medium">{email}</a>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <div className="mt-16 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-white/30">
              <Link to="/privacy" className="hover:text-omin-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-omin-gold transition-colors">Terms of Service</Link>
              <Link to="/security" className="hover:text-omin-gold transition-colors">Security</Link>
              <Link to="/" className="hover:text-omin-gold transition-colors ml-auto">← Return to Omni AI Pro</Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
