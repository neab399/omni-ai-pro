import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  "Security Philosophy", "Encryption in Transit", "Encryption at Rest",
  "Database Security & RLS", "Zero-Retention AI Routing", "Authentication & Session Management",
  "Network & Infrastructure Security", "Application Security", "Sub-Processor Security",
  "Incident Response", "Penetration Testing & Audits", "Compliance & Certifications",
  "Responsible Disclosure", "Contact"
];

export default function Security() {
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-omin-black text-white font-sans relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.025] mix-blend-screen pointer-events-none z-10" />

      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/8 bg-omin-black/90 backdrop-blur-xl z-50 flex items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-omin-gold rounded-lg flex items-center justify-center text-black font-display font-black text-sm shadow-[0_0_15px_rgba(255,217,61,0.3)]">O</div>
          <span className="font-display font-bold tracking-wide hidden sm:block">OMNI AI <span className="text-omin-gold">PRO</span></span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-6 text-xs text-white/40">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/dpa" className="hover:text-white transition-colors">DPA</Link>
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
              <div className="inline-flex items-center gap-2 bg-omin-gold/10 text-omin-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">🛡️ Security Architecture</div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">Security</h1>
              <p className="text-white/40 text-sm">Last Updated: <span className="text-omin-gold">March 31, 2026</span> · Enterprise-Grade Protection</p>
              <div className="mt-6 p-4 bg-white/3 border border-white/8 rounded-xl text-sm text-white/60">
                Security is not a feature — it is the foundation of Omni AI Pro. This document outlines the comprehensive security measures we employ to protect your data, your conversations, and your account.
              </div>
            </div>

            {/* Security stat badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {[["TLS 1.3", "Encryption in Transit"],["AES-256", "Encryption at Rest"],["RLS", "Database Isolation"],["0-Retention", "AI Data Policy"]].map(([stat, label]) => (
                <div key={stat} className="p-4 bg-white/3 border border-white/8 rounded-xl text-center">
                  <div className="text-omin-gold font-display font-bold text-lg">{stat}</div>
                  <div className="text-white/40 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-10">
              <Section number="1" title="Security Philosophy">
                <p>At Omni AI Pro, security is built into every layer of our infrastructure by design — not added as an afterthought. We follow a "Defense in Depth" philosophy, meaning that multiple independent layers of security controls protect your data. Even if one layer were hypothetically circumvented, all remaining layers would continue to provide strong protection.</p>
                <p>Our security architecture is organized around three core principles: <strong className="text-white/80">Confidentiality</strong> (your data is accessible only to you), <strong className="text-white/80">Integrity</strong> (your data is never modified without authorization), and <strong className="text-white/80">Availability</strong> (the Service remains accessible and resilient).</p>
              </Section>

              <Section number="2" title="Encryption in Transit">
                <p>All data transmitted between your browser and our servers is protected using <strong className="text-white/80">TLS 1.3</strong> (Transport Layer Security), the latest and most secure version of the protocol. We enforce HTTPS on all domains and subdomains by implementing <strong className="text-white/80">HTTP Strict Transport Security (HSTS)</strong> with a long-duration max-age directive.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All TLS certificates are issued by a trusted Certificate Authority and automatically renewed via Let's Encrypt or Vercel's managed certificate infrastructure.</li>
                  <li>Weak cipher suites (RC4, 3DES, TLS 1.0, TLS 1.1) are explicitly disabled.</li>
                  <li>WebSocket connections used for streaming AI responses are also encrypted over WSS (WebSocket Secure).</li>
                  <li>Our API-to-API communication with model providers (OpenAI, Anthropic, etc.) is additionally protected through private, authenticated HTTPS tunnels.</li>
                </ul>
              </Section>

              <Section number="3" title="Encryption at Rest">
                <p>All data stored in our database infrastructure is encrypted at rest using <strong className="text-white/80">AES-256</strong>, the same encryption standard used by governments and financial institutions worldwide.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Supabase manages our PostgreSQL database volumes, which are encrypted at the block storage level by default on AWS infrastructure.</li>
                  <li>Passwords are never stored in plain text and are hashed using the bcrypt algorithm (cost factor 12).</li>
                  <li>Sensitive fields such as API key references are encrypted at the application layer with an additional encryption key before database storage.</li>
                  <li>Database backups are also encrypted using AES-256 and stored in a geographically separate location.</li>
                </ul>
              </Section>

              <Section number="4" title="Database Security & Row Level Security (RLS)">
                <p>Our most powerful database security feature is Supabase's <strong className="text-white/80">Row Level Security (RLS)</strong>. This is a PostgreSQL-native mechanism that enforces access control policies directly at the database engine level — not just at the application layer.</p>
                <p>In practice, this means:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Every database query is automatically constrained by a policy that checks the authenticated user's Session ID against the <code className="text-omin-gold bg-white/5 px-1 rounded">user_id</code> column of every row.</li>
                  <li>Even if a bug in our application code somehow issues a poorly-scoped query (e.g., <code className="text-omin-gold bg-white/5 px-1 rounded">SELECT * FROM conversations</code>), the database engine itself will enforce that only rows belonging to the authenticated user are returned.</li>
                  <li>No user can ever read another user's conversations, settings, or personal data. This is a hard, mathematically enforced guarantee at the infrastructure level.</li>
                  <li>Administrative service-role access to the full database is protected by a separate API key stored exclusively in encrypted environment variables — never exposed to client-side code.</li>
                </ul>
              </Section>

              <Section number="5" title="Zero-Retention AI Routing">
                <p>Because Omni AI Pro routes your prompts to third-party AI model providers, we have implemented architectural controls to ensure that this process is as private and secure as possible.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Prompt content is never written to disk during the forwarding process. Requests are processed in-memory and forwarded immediately.</li>
                  <li>We use the <strong className="text-white/80">Enterprise API tier</strong> for all major providers, which contractually disables use of requests for model training.</li>
                  <li>Our backend does not log or parse prompt content for any analytical purpose. Only metadata (model name, token count, response latency) is logged for billing and performance monitoring.</li>
                  <li>Streaming responses are forwarded directly to your browser via a secure server-sent events (SSE) channel without intermediate buffering.</li>
                </ul>
              </Section>

              <Section number="6" title="Authentication & Session Management">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Authentication is handled by <strong className="text-white/80">Supabase Auth</strong>, which implements industry-standard OAuth 2.0 and OpenID Connect flows.</li>
                  <li>JSON Web Tokens (JWTs) are used for session management, signed with HS256 and set to expire after 1 hour by default. Refresh tokens are used to maintain sessions without requiring re-authentication.</li>
                  <li>Sessions are invalidated server-side upon logout. Tokens cannot be re-used after expiry or invalidation.</li>
                  <li>We support and encourage the use of OAuth 2.0 social sign-in (Google, GitHub) which eliminates password-based attack vectors entirely for users who opt in.</li>
                  <li>Rate limiting is applied to all authentication endpoints to prevent brute-force attacks (maximum 10 failed login attempts per 15-minute window per IP).</li>
                </ul>
              </Section>

              <Section number="7" title="Network & Infrastructure Security">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">DDoS Protection:</strong> Vercel provides enterprise-grade DDoS mitigation at the edge network level, absorbing volumetric attacks before they reach our application servers.</li>
                  <li><strong className="text-white/80">Web Application Firewall (WAF):</strong> Vercel's edge network includes WAF rules that block common attack patterns including SQL injection, XSS, and CSRF attempts.</li>
                  <li><strong className="text-white/80">IP Allowlisting:</strong> Administrative database access is restricted to specific, pre-approved IP addresses.</li>
                  <li><strong className="text-white/80">CDN:</strong> Static assets are served via Vercel's global CDN with integrity verification (SRI hashes) to prevent tampering in transit.</li>
                  <li><strong className="text-white/80">Environment Isolation:</strong> Production, staging, and development environments are strictly isolated, with separate database instances, API keys, and access controls.</li>
                </ul>
              </Section>

              <Section number="8" title="Application Security">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Input Validation:</strong> All user-supplied input is validated and sanitized on both the client side (React controlled inputs) and the server side before being processed or stored.</li>
                  <li><strong className="text-white/80">Content Security Policy (CSP):</strong> Our HTTP headers include strict CSP directives that prevent malicious script injection and cross-origin data exfiltration.</li>
                  <li><strong className="text-white/80">CORS Policy:</strong> Cross-Origin Resource Sharing is restricted to our own domains. Unauthorized origins cannot make credentialed API calls.</li>
                  <li><strong className="text-white/80">Dependency Scanning:</strong> Our CI/CD pipeline runs automated vulnerability scans on all third-party npm dependencies using <code className="text-omin-gold bg-white/5 px-1 rounded">npm audit</code> and Snyk.</li>
                  <li><strong className="text-white/80">Secret Management:</strong> API keys, database credentials, and configuration secrets are stored exclusively in encrypted environment variables managed by Vercel. They are never committed to source code repositories.</li>
                </ul>
              </Section>

              <Section number="9" title="Sub-Processor Security">
                <p>We have conducted security due diligence on all third-party service providers we rely upon. All sub-processors with access to personal data are contractually obligated to implement security measures at least equivalent to our own.</p>
                <div className="overflow-x-auto rounded-xl border border-white/8 mt-4">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/8 bg-white/3"><th className="text-left p-4 text-white/50 font-semibold">Provider</th><th className="text-left p-4 text-white/50 font-semibold">Certifications</th></tr></thead>
                    <tbody>
                      {[["Supabase (AWS)","SOC 2 Type II, ISO 27001, GDPR DPA"],["Vercel","SOC 2 Type II, GDPR DPA"],["Stripe","PCI DSS Level 1, SOC 2 Type II"],["OpenAI","SOC 2 Type II, GDPR API Addendum"],["Anthropic","SOC 2 Type II"],["Google Cloud","ISO 27001, SOC 2 Type II, GDPR"]].map(([name, cert]) => (
                        <tr key={name} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-4 text-white font-medium">{name}</td>
                          <td className="p-4 text-white/50">{cert}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section number="10" title="Incident Response">
                <p>In the event of a security incident, Omni AI Pro follows a structured Incident Response Plan (IRP):</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Detection:</strong> Sentry error monitoring and Supabase audit logs alert our team to anomalous behavior within minutes.</li>
                  <li><strong className="text-white/80">Containment:</strong> Affected systems are isolated immediately to prevent further damage or data exposure.</li>
                  <li><strong className="text-white/80">Eradication:</strong> The root cause is identified and patched before systems are restored.</li>
                  <li><strong className="text-white/80">Notification:</strong> In the event of a personal data breach, affected users will be notified within 72 hours, in compliance with GDPR Article 33 requirements.</li>
                  <li><strong className="text-white/80">Post-Mortem:</strong> A detailed post-mortem report is produced after every significant security event to prevent recurrence.</li>
                </ul>
              </Section>

              <Section number="11" title="Penetration Testing & Audits">
                <p>We conduct regular security testing to proactively identify and remediate vulnerabilities before malicious actors can exploit them:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Quarterly automated vulnerability scans across all application endpoints and network infrastructure.</li>
                  <li>Annual third-party penetration testing performed by certified security professionals (CEH, OSCP certified).</li>
                  <li>Bi-annual code reviews with a specific focus on authentication flows, data access patterns, and API security.</li>
                  <li>Continuous dependency vulnerability monitoring via automated tooling in our CI/CD pipeline.</li>
                </ul>
              </Section>

              <Section number="12" title="Compliance & Certifications">
                <p>Omni AI Pro is actively working toward the following compliance frameworks:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">GDPR (General Data Protection Regulation):</strong> Full compliance for all EU/EEA users, including data processing agreements, rights management, and breach notification workflows.</li>
                  <li><strong className="text-white/80">CCPA (California Consumer Privacy Act):</strong> Compliance for California residents, including opt-out rights and data deletion on request.</li>
                  <li><strong className="text-white/80">SOC 2 Type II:</strong> Pursuing certification in 2026 to provide independent third-party verification of our security controls.</li>
                </ul>
              </Section>

              <Section number="13" title="Responsible Disclosure">
                <p>We deeply value the security research community and encourage researchers to responsibly disclose any vulnerabilities they discover in our systems.</p>
                <p>If you believe you have found a security vulnerability:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Email us immediately at <a href="mailto:security@omniaipro.com" className="text-omin-gold hover:underline">security@omniaipro.com</a> with a detailed description of the vulnerability.</li>
                  <li>Please do not publicly disclose the vulnerability until we have acknowledged receipt and had a reasonable opportunity to remediate it (maximum 90 days).</li>
                  <li>Do not access, modify, or delete user data without explicit permission.</li>
                  <li>We will acknowledge all valid reports within 48 hours and provide regular status updates as we work on a fix.</li>
                </ul>
                <div className="p-4 bg-omin-gold/5 border border-omin-gold/20 rounded-xl mt-4">
                  <p className="text-omin-gold font-semibold text-sm mb-1">🏆 Responsible Disclosure Commitment</p>
                  <p className="text-white/60 text-xs">We publicly thank all responsible security researchers in our Hall of Fame and may offer bounties for critical vulnerabilities at our discretion.</p>
                </div>
              </Section>

              <Section number="14" title="Contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[["Security Team", "security@omniaipro.com"],["Privacy / DPO", "privacy@omniaipro.com"],["Abuse / DMCA", "abuse@omniaipro.com"],["General Legal", "legal@omniaipro.com"]].map(([label, email]) => (
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
              <Link to="/dpa" className="hover:text-omin-gold transition-colors">DPA</Link>
              <Link to="/" className="hover:text-omin-gold transition-colors ml-auto">← Return to Omni AI Pro</Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
