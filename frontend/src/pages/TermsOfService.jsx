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
  "Agreement to Terms", "Eligibility", "Account Registration & Security",
  "The Service", "AI-Generated Content & Ownership", "Subscriptions & Billing",
  "Fair Use Policy", "Prohibited Conduct", "API Access & Developer Terms",
  "Third-Party AI Model Providers", "Disclaimer of Warranties",
  "Limitation of Liability", "Indemnification", "Termination",
  "Dispute Resolution & Governing Law", "Changes to Terms", "Contact"
];

export default function TermsOfService() {
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
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
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
              <div className="inline-flex items-center gap-2 bg-omin-gold/10 text-omin-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">📜 Legal Document</div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">Terms of Service</h1>
              <p className="text-white/40 text-sm">Effective Date: <span className="text-omin-gold">March 31, 2026</span> · Version 1.0</p>
              <div className="mt-6 p-4 bg-white/3 border border-white/8 rounded-xl text-sm text-white/60">
                Please read these Terms of Service carefully before using Omni AI Pro. By accessing or using the Service, you agree to be legally bound by these terms.
              </div>
            </div>

            <div className="space-y-10">
              <Section number="1" title="Agreement to Terms">
                <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Omni AI Pro ("Company", "we", "us"). By creating an account, accessing, or using any part of our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, incorporated herein by reference.</p>
                <p>If you are accepting these Terms on behalf of a company or legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, and all references to "you" shall refer to that entity.</p>
                <p>If you do not agree to these Terms, you must immediately cease all use of the Service and delete your account.</p>
              </Section>

              <Section number="2" title="Eligibility">
                <p>You must meet all of the following eligibility requirements to use the Service:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Be at least 13 years of age (or 16 years if located in the EEA).</li>
                  <li>Not be prohibited from using the Service under applicable law in your jurisdiction.</li>
                  <li>Not have had a previous Omni AI Pro account terminated for a Terms violation.</li>
                  <li>Have the legal capacity to enter into a binding contract in your country of residence.</li>
                </ul>
              </Section>

              <Section number="3" title="Account Registration & Security">
                <p>To access core features of the Service, you must create an account. You agree to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide accurate, current, and complete information during registration.</li>
                  <li>Maintain and promptly update your account information.</li>
                  <li>Keep your password confidential and not share your account credentials with any third party.</li>
                  <li>Notify us immediately at <a href="mailto:security@omniaipro.com" className="text-omin-gold hover:underline">security@omniaipro.com</a> if you suspect unauthorized access to your account.</li>
                </ul>
                <p>You are solely responsible for all activity that occurs under your account. Omni AI Pro shall not be liable for any loss arising from your failure to maintain the confidentiality of your credentials.</p>
              </Section>

              <Section number="4" title="The Service">
                <p>Omni AI Pro provides a unified, high-performance artificial intelligence terminal that allows users to interact with multiple large language model (LLM) providers — including but not limited to OpenAI GPT series, Anthropic Claude series, Google Gemini series, and various open-source models hosted via Hugging Face and similar platforms — through a single, streamlined interface.</p>
                <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice, at our sole discretion. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.</p>
              </Section>

              <Section number="5" title="AI-Generated Content & Ownership">
                <p><strong className="text-white">5.1 Your Prompts:</strong> You retain full ownership of the prompts, instructions, and context you provide to the Service.</p>
                <p><strong className="text-white">5.2 AI Outputs:</strong> Subject to the terms of the underlying model providers, you generally retain ownership of the outputs generated in response to your prompts. You are responsible for ensuring that your use of AI-generated content complies with applicable laws, including copyright law.</p>
                <p><strong className="text-white">5.3 Our License to Your Content:</strong> By using the Service, you grant Omni AI Pro a limited, non-exclusive, royalty-free license to store and transmit your content solely to the extent necessary to provide the Service to you. We do not claim ownership of your content and do not use it for any other purpose.</p>
                <p><strong className="text-white">5.4 No Training on Your Data:</strong> Omni AI Pro expressly agrees not to use the content of your prompts or AI outputs to train, fine-tune, or otherwise improve any machine learning model.</p>
              </Section>

              <Section number="6" title="Subscriptions & Billing">
                <p>Certain features of the Service are available only to paying subscribers ("Pro" or "Enterprise" plans). By subscribing to a paid plan, you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">Billing Cycle:</strong> Subscriptions are billed monthly or annually in advance, automatically renewing at the end of each period.</li>
                  <li><strong className="text-white/80">Payment Failure:</strong> If a payment fails, you will be notified and given a 7-day grace period to update your payment method before your account is downgraded to the free tier.</li>
                  <li><strong className="text-white/80">Refund Policy:</strong> Subscription fees are non-refundable except where required by applicable law. We may grant refunds at our sole discretion on a case-by-case basis.</li>
                  <li><strong className="text-white/80">Price Changes:</strong> We reserve the right to change subscription fees with at least 30 days' prior notice to your registered email address.</li>
                  <li><strong className="text-white/80">Taxes:</strong> All prices are exclusive of applicable taxes. You are responsible for paying any taxes, levies, or duties associated with your subscription.</li>
                </ul>
              </Section>

              <Section number="7" title="Fair Use Policy">
                <p>To ensure a high-quality experience for all users, Omni AI Pro enforces a Fair Use Policy for plans described as "unlimited". This policy prohibits:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Automated scripting or botting that sends more than 600 API requests per hour per account.</li>
                  <li>Sharing account credentials to enable multiple users to access the platform on a single subscription.</li>
                  <li>Using the Service to build or train a competing AI aggregation product.</li>
                  <li>Reverse-engineering or scraping our API endpoints, caching mechanisms, or routing infrastructure.</li>
                </ul>
                <p>Violations of the Fair Use Policy may result in immediate throttling, account suspension, or permanent termination without refund.</p>
              </Section>

              <Section number="8" title="Prohibited Conduct">
                <p>You agree that you will not, under any circumstances, use the Service to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Generate, distribute, or promote content that is illegal, defamatory, obscene, fraudulent, threatening, or invasive of privacy.</li>
                  <li>Generate non-consensual intimate imagery (NCII) or sexual content involving minors (CSAM). Any such activity will result in immediate, permanent account termination and reporting to relevant law enforcement agencies.</li>
                  <li>Facilitate, plan, or incite violence, terrorism, self-harm, or harm to others.</li>
                  <li>Conduct phishing, spoofing, social engineering, or other deceptive practices targeting individuals or organizations.</li>
                  <li>Attempt to circumvent content safety filters or jailbreak the underlying AI models.</li>
                  <li>Harvest or collect information about other users without their consent.</li>
                  <li>Introduce malware, viruses, or any other malicious code to the platform.</li>
                  <li>Violate any applicable local, state, national, or international law or regulation.</li>
                </ul>
              </Section>

              <Section number="9" title="API Access & Developer Terms">
                <p>Developers accessing the Service programmatically via API keys are subject to the following additional terms:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>API keys are non-transferable and must not be embedded in public client-side code.</li>
                  <li>You are solely responsible for all usage that occurs under your API key.</li>
                  <li>Rate limits are enforced per API key. Exceeding rate limits will result in HTTP 429 responses and potential temporary key suspension.</li>
                  <li>We reserve the right to revoke API access without notice for abuse, security reasons, or terms violations.</li>
                </ul>
              </Section>

              <Section number="10" title="Third-Party AI Model Providers">
                <p>The Service routes your requests to third-party AI model providers. Your use of these models is additionally subject to the terms of each respective provider, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white/80">OpenAI:</strong> subject to the OpenAI Terms of Service and Usage Policies.</li>
                  <li><strong className="text-white/80">Anthropic:</strong> subject to Anthropic's Consumer Terms and Usage Policy.</li>
                  <li><strong className="text-white/80">Google:</strong> subject to Google's Gemini API Additional Terms of Service.</li>
                </ul>
                <p>We are not responsible for the outputs, availability, or accuracy of any third-party AI model. Model availability may change at any time based on third-party API changes outside our control.</p>
              </Section>

              <Section number="11" title="Disclaimer of Warranties">
                <p className="uppercase text-xs text-white/40 tracking-wider mb-3">Important — Please Read Carefully</p>
                <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, OMNI AI PRO DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, TITLE, AND NON-INFRINGEMENT.</p>
                <p>WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE RESULTS OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; (C) THE QUALITY OF ANY AI-GENERATED OUTPUTS WILL MEET YOUR EXPECTATIONS.</p>
              </Section>

              <Section number="12" title="Limitation of Liability">
                <p className="uppercase text-xs text-white/40 tracking-wider mb-3">Important — Please Read Carefully</p>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL OMNI AI PRO, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR: ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES.</p>
                <p>IN NO EVENT SHALL OUR TOTAL CUMULATIVE LIABILITY TO YOU EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO OMNI AI PRO IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) USD $100.</p>
              </Section>

              <Section number="13" title="Indemnification">
                <p>You agree to indemnify, defend, and hold harmless Omni AI Pro and its officers, directors, employees, contractors, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to: (a) your violation of these Terms; (b) your use or misuse of the Service; (c) your violation of any third-party right, including intellectual property or privacy rights; or (d) AI-generated content that you publish or distribute.</p>
              </Section>

              <Section number="14" title="Termination">
                <p><strong className="text-white">14.1 By You:</strong> You may terminate your account at any time by deleting it through the account settings page. Termination does not entitle you to any refund of prepaid subscription fees.</p>
                <p><strong className="text-white">14.2 By Us:</strong> We reserve the right to suspend or permanently terminate your account at any time, with or without notice, if we reasonably believe you have violated these Terms, applicable law, or pose a risk to the platform or other users.</p>
                <p><strong className="text-white">14.3 Effect of Termination:</strong> Upon termination, your right to access the Service ceases immediately. Sections 5, 11, 12, 13, and 15 of these Terms shall survive termination.</p>
              </Section>

              <Section number="15" title="Dispute Resolution & Governing Law">
                <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from or relating to these Terms or the Service shall first be subject to a mandatory 30-day informal negotiation period upon written notice to <a href="mailto:legal@omniaipro.com" className="text-omin-gold hover:underline">legal@omniaipro.com</a>. If the dispute is not resolved informally, it shall be subject to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India.</p>
                <p>Nothing in this section shall prevent either party from seeking injunctive or other equitable relief from a court of competent jurisdiction to prevent actual or threatened infringement of intellectual property rights.</p>
              </Section>

              <Section number="16" title="Changes to Terms">
                <p>We reserve the right to modify these Terms at any time. If we make material changes, we will provide at least 30 days' advance notice via email and an in-app notification. Your continued use of the Service after the effective date of any revision constitutes acceptance of the updated Terms. If you do not agree to the updated Terms, you must stop using the Service before the effective date.</p>
              </Section>

              <Section number="17" title="Contact">
                <p>For legal inquiries, please contact our legal team:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[["Legal Department", "legal@omniaipro.com"], ["Billing Support", "billing@omniaipro.com"], ["Account Issues", "support@omniaipro.com"], ["Abuse Reports", "abuse@omniaipro.com"]].map(([label, email]) => (
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
              <Link to="/security" className="hover:text-omin-gold transition-colors">Security</Link>
              <Link to="/dpa" className="hover:text-omin-gold transition-colors">DPA</Link>
              <Link to="/" className="hover:text-omin-gold transition-colors ml-auto">← Return to Omni AI Pro</Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
