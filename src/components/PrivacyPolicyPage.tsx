import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Database,
  Globe,
  UserCheck,
  Cookie,
  Server,
  RefreshCw
} from "lucide-react";
import { motion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
}

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-collected", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "sharing", title: "4. Information Sharing & Third Parties" },
  { id: "security", title: "5. Data Security & Storage" },
  { id: "cookies", title: "6. Cookies & Tracking" },
  { id: "your-rights", title: "7. Your Rights & Choices" },
  { id: "transfers", title: "8. International Transfers" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "contact", title: "10. Contact & Data Protection" },
];

export default function PrivacyPolicyPage({ onBackToHome }: PrivacyPolicyPageProps) {
  const [activeSection, setActiveSection] = useState("introduction");

  // SEO Optimization & Title setup
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Privacy Policy | Tiqsey - Your Data Protection & Trust";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-all mb-8 border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 text-brand-light text-xs font-semibold tracking-wide uppercase mb-4 border border-brand/30">
              <Shield className="w-3.5 h-3.5" />
              Privacy & Data Trust
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At Tiqsey, protecting your personal data and maintaining your trust is our top priority.
              This policy explains how we collect, use, safeguard, and share your information when you browse or book experiences on our platform.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-slate-800 pt-4">
              <span><strong>Last Updated:</strong> July 29, 2026</span>
              <span>•</span>
              <span><strong>Effective Date:</strong> January 1, 2026</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> GDPR & CCPA Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Navigation Table of Contents */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? "bg-brand text-white shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === sec.id ? "text-white" : "text-gray-400"}`} />
                  </button>
                ))}
              </nav>

              <div className="pt-4 mt-4 border-t border-gray-100 px-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200/80">
                  <p className="text-xs font-semibold text-gray-800 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand" /> Privacy Inquiries
                  </p>
                  <p className="text-xs text-gray-600 mb-2">Have questions about your data?</p>
                  <a
                    href="mailto:support@tiqsey.com"
                    className="text-xs font-bold text-brand hover:underline block break-all"
                  >
                    support@tiqsey.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Text Document */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-12">

              {/* Section 1 */}
              <section id="introduction" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-brand/10 text-brand">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600 space-y-4 leading-relaxed">
                  <p>
                    Welcome to <strong>Tiqsey</strong> ("we", "our", or "us"). Tiqsey operates a digital ticket booking marketplace and technology platform that connects travelers with attractions, museums, city tours, theme parks, and cultural activities around the world.
                  </p>
                  <p>
                    This Privacy Policy applies to all users of our website, mobile interface, and services. By accessing or using Tiqsey to browse activities or complete ticket bookings, you consent to the data collection and usage practices described in this document.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2 */}
              <section id="information-collected" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We collect information that you directly provide to us, as well as information generated automatically when you interact with our platform:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <UserCheck className="w-4 h-4 text-brand" /> Personal Identifiers
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                        <li>Full Name & Contact Information</li>
                        <li>Email Address (for instant digital ticket delivery)</li>
                        <li>Phone Number (for booking updates & SMS notifications)</li>
                        <li>Preferred Currency and Language Settings</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-emerald-600" /> Payment & Transaction Data
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                        <li>Selected activities, visit dates, and time slots</li>
                        <li>Payment confirmation tokens from Stripe or PayPal</li>
                        <li><em>Note: Full payment card numbers are processed directly by PCI-DSS certified gateways and never stored on Tiqsey servers.</em></li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <Server className="w-4 h-4 text-purple-600" /> Technical & Device Information
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                        <li>IP Address and approximate geographic location</li>
                        <li>Browser type, operating system, and device specs</li>
                        <li>Access times, referring URLs, and page navigation paths</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <Cookie className="w-4 h-4 text-amber-600" /> Wishlist & Preferences
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                        <li>Saved attractions and favorite destinations</li>
                        <li>Recently viewed activities and search queries</li>
                        <li>User feedback, ratings, and customer support history</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3 */}
              <section id="how-we-use" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  <p>We use the data we collect strictly for legitimate business and service purposes, including:</p>
                  <ul className="space-y-2.5 text-sm list-none pl-0">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span><strong>Fulfilling Bookings:</strong> Generating e-tickets, confirming time slots, and emailing voucher QR codes directly to your inbox.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span><strong>Customer Support & Assistance:</strong> Providing 24/7 help regarding schedule changes, venue alerts, refunds, or entry instructions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span><strong>Platform Optimization:</strong> Improving search response times, tailoring curated deals for your destination, and preventing fraud.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span><strong>Communication & Alerts:</strong> Sending essential booking reminders or optional newsletter updates (which you can opt-out of at any time).</span>
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 4 */}
              <section id="sharing" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">4. Information Sharing & Third Parties</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-900 text-sm rounded-r-xl">
                    <strong>Zero Sale Guarantee:</strong> Tiqsey does NOT sell, rent, or trade your personal information to third-party advertisers or data brokers.
                  </p>
                  <p>We only share necessary data with trusted third parties under strict confidentiality agreements:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li><strong>Venue Operators & Tour Partners:</strong> Names and ticket quantities are shared with museums, parks, or activity hosts strictly so they can validate your mobile pass at entry.</li>
                    <li><strong>Payment Processors:</strong> Transactions are handled securely via encrypted payment providers (e.g., Stripe, PayPal).</li>
                    <li><strong>Infrastructure & Analytics:</strong> Secure cloud infrastructure and performance analytics providers under contractual data security standards.</li>
                    <li><strong>Legal Obligations:</strong> If required by law, subpoena, or governmental regulation to protect user safety and prevent illegal activities.</li>
                  </ol>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 5 */}
              <section id="security" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                    <Shield className="w-6 h-6 text-brand" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Data Security & Storage</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    We employ industry-standard technical and organizational security measures to protect your information from unauthorized access, alteration, or disclosure:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <li className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand shrink-0" /> 256-bit SSL/TLS Encryption
                    </li>
                    <li className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand shrink-0" /> Regular Security Vulnerability Audits
                    </li>
                    <li className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                      <Server className="w-4 h-4 text-brand shrink-0" /> Secure Cloud Data Centers
                    </li>
                    <li className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand shrink-0" /> Restricted Employee Access Control
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 6 */}
              <section id="cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Cookies & Tracking Technologies</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Tiqsey uses essential cookies and local browser storage to remember your currency preference, keep items in your Wishlist, and ensure smooth navigation across pages.
                  </p>
                  <p>
                    You can manage or block cookies through your web browser settings. Note that disabling essential cookies may affect booking features or preference saving.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 7 */}
              <section id="your-rights" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Your Rights & Choices (GDPR & CCPA)</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>Depending on your location, you have rights regarding your personal data:</p>
                  <ul className="space-y-2 list-disc list-inside font-medium text-gray-800">
                    <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information.</li>
                    <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your account and personal history.</li>
                    <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                  </ul>
                  <p className="pt-2">To exercise any of these rights, email us at <a href="mailto:support@tiqsey.com" className="text-brand font-bold underline">support@tiqsey.com</a>.</p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 8 & 9 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section id="transfers" className="scroll-mt-28 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">8. International Transfers</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Because Tiqsey offers worldwide booking services, your data may be processed in countries where our partners or cloud servers operate, adhering to international transfer safeguards.
                  </p>
                </section>

                <section id="children" className="scroll-mt-28 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">9. Children's Privacy</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tiqsey does not knowingly collect personal data from children under 16 without parental consent. Ticket bookings for minors must be completed by an adult.
                  </p>
                </section>
              </div>

              <hr className="border-gray-100" />

              {/* Section 10 */}
              <section id="contact" className="scroll-mt-28 bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-brand" /> 10. Contact Us & Data Protection
                    </h3>
                    <p className="text-sm text-gray-300">
                      If you have questions, feedback, or requests regarding this Privacy Policy, our Data Protection Officer is ready to assist.
                    </p>
                  </div>
                  <a
                    href="mailto:support@tiqsey.com"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all text-sm shrink-0 shadow-lg shadow-brand/20"
                  >
                    Contact support@tiqsey.com
                  </a>
                </div>
              </section>

              {/* Back to Home CTA */}
              <div className="pt-6 text-center">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all text-sm shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Tiqsey Home
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
