import React, { useState, useEffect } from "react";
import {
  FileText,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Globe,
  Scale,
  CreditCard,
  Ticket,
  RefreshCw,
  UserCheck,
  Ban,
  Building2,
  Clock
} from "lucide-react";

interface TermsAndConditionsPageProps {
  onBackToHome: () => void;
}

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Platform Role & Services" },
  { id: "accounts", title: "3. Accounts & Eligibility" },
  { id: "pricing", title: "4. Ticket Purchases & Pricing" },
  { id: "delivery", title: "5. E-Ticket Delivery & Entry" },
  { id: "cancellations", title: "6. Cancellations & Refunds" },
  { id: "conduct", title: "7. Acceptable Use & Conduct" },
  { id: "intellectual-property", title: "8. Intellectual Property" },
  { id: "liability", title: "9. Liability & Disclaimers" },
  { id: "disputes", title: "10. Governing Law & Contact" },
];

export default function TermsAndConditionsPage({ onBackToHome }: TermsAndConditionsPageProps) {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Terms & Conditions | Tiqsey - Service Agreement";
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
              <Scale className="w-3.5 h-3.5" />
              Legal & Service Terms
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Welcome to Tiqsey. These Terms and Conditions govern your access to and use of the Tiqsey website, mobile interfaces, ticket booking engine, and customer support services.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-slate-800 pt-4">
              <span><strong>Last Updated:</strong> July 29, 2026</span>
              <span>•</span>
              <span><strong>Effective Date:</strong> January 1, 2026</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Official Service Agreement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sticky Sidebar Navigation */}
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
                    <Mail className="w-3.5 h-3.5 text-brand" /> Legal Questions?
                  </p>
                  <p className="text-xs text-gray-600 mb-2">Need clarification regarding our terms?</p>
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

          {/* Main Legal Document Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-12">

              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-brand/10 text-brand">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600 space-y-4 leading-relaxed">
                  <p>
                    By accessing, browsing, or purchasing ticket vouchers through <strong>Tiqsey</strong> ("we", "our", "us", or "the Platform"), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our <a href="/privacy-policy" className="text-brand font-semibold underline">Privacy Policy</a> and <a href="/cookie-policy" className="text-brand font-semibold underline">Cookie Policy</a>.
                  </p>
                  <p>
                    If you do not agree to these terms in full, you must discontinue using our services immediately. We reserve the right to amend these Terms at any time, with updated versions taking effect immediately upon publication.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2 */}
              <section id="services" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Platform Role & Booking Marketplace</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Tiqsey acts as an intermediary digital marketplace connecting travelers with third-party attraction operators, museums, theme parks, tour companies, and cultural event organizers ("Venue Operators"):
                  </p>
                  <ul className="space-y-2 text-sm list-disc list-inside text-gray-700">
                    <li><strong>E-Ticket Voucher Issuer:</strong> When you book on Tiqsey, we facilitate the reservation and issue official digital vouchers or entry barcodes on behalf of Venue Operators.</li>
                    <li><strong>Venue Rules & Safety:</strong> Entry into attractions is subject to the specific rules, capacity limits, security checks, and operating schedules set by each individual Venue Operator.</li>
                    <li><strong>Direct Services:</strong> Physical tours, transport, exhibit maintenance, and venue safety remain under the direct responsibility of the respective Venue Operator.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3 */}
              <section id="accounts" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. User Accounts & Eligibility</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    To place ticket orders on Tiqsey, you must be at least 18 years of age or possess legal parental consent. When registering an account or making a guest booking, you agree to:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-800">
                    <li>Provide accurate, current, and complete contact details (especially your email address for instant e-ticket delivery).</li>
                    <li>Maintain the security of your password and accept responsibility for all activities under your account.</li>
                    <li>Notify us immediately at <a href="mailto:support@tiqsey.com" className="text-brand font-bold underline">support@tiqsey.com</a> if you suspect unauthorized access to your account.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 4 */}
              <section id="pricing" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">4. Ticket Purchases, Pricing & Taxes</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                  <p>
                    All ticket prices listed on Tiqsey are displayed in your selected currency (e.g. USD, EUR, GBP, AUD) and include applicable booking fees or local taxes unless stated otherwise.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" /> Secure Payment Gateways
                      </h4>
                      <p className="text-xs text-gray-600">
                        Payments are processed via encrypted, PCI-DSS compliant payment solutions (Stripe, PayPal, Apple Pay, Google Pay).
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand" /> Dynamic Currency Exchange
                      </h4>
                      <p className="text-xs text-gray-600">
                        Converted display prices are updated regularly based on real-time central exchange rates.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 5 */}
              <section id="delivery" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. E-Ticket Delivery, Redemption & Entry</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Upon successful payment confirmation:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-800 font-medium">
                    <li><strong>Instant E-Voucher Generation:</strong> Your digital entry pass containing a unique QR barcode will be delivered to your email inbox and stored under your account's "My Bookings" tab.</li>
                    <li><strong>Mobile Redemption:</strong> Most venues support direct smartphone scanning at the turnstiles. Certain historical sites may require presenting a valid government ID matching the booking name.</li>
                    <li><strong>Timed-Entry Slots:</strong> If your ticket includes a specific time slot, you must arrive on time. Venue Operators reserve the right to refuse late admission.</li>
                  </ol>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 6 */}
              <section id="cancellations" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Cancellations, Refunds & Rescheduling</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Cancellation terms vary by specific ticket type and are clearly displayed on each attraction page prior to purchase:
                  </p>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <p className="font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> Free Cancellation Badges
                    </p>
                    <p className="text-xs text-emerald-800">
                      Tickets marked with "Free Cancellation" can be cancelled for a 100% full refund up to 24 hours before your scheduled visit time via your Tiqsey dashboard or by emailing customer support.
                    </p>
                  </div>
                  <p>
                    In the rare event that a venue closes unexpectedly due to severe weather, maintenance, or force majeure, Tiqsey will issue a full refund or assist in rescheduling your visit at no additional charge.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 7 */}
              <section id="conduct" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                    <Ban className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Acceptable Use & Prohibited Conduct</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>When using Tiqsey, you agree NOT to:</p>
                  <ul className="space-y-2 list-disc list-inside text-gray-800">
                    <li>Resell, duplicate, forge, or commercialize Tiqsey ticket vouchers for unauthorized profit.</li>
                    <li>Use automated scrapers, bots, or extraction tools to gather pricing or content without written consent.</li>
                    <li>Submit fraudulent payment information or attempt chargebacks for validated ticket entries.</li>
                    <li>Engage in any activity that disrupts or overloads our platform infrastructure.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 8 */}
              <section id="intellectual-property" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">8. Intellectual Property Rights</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    All content on Tiqsey—including logos, design trademarks, software code, copy, photography, interactive search widgets, and graphics—is the property of Tiqsey or its licensors and is protected under international copyright and trademark laws.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 9 */}
              <section id="liability" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gray-100 text-gray-800">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">9. Limitation of Liability & Disclaimers</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Tiqsey strives to maintain accurate schedules, venue descriptions, and real-time availability. However, to the maximum extent permitted by law, Tiqsey is not liable for indirect, incidental, or consequential damages resulting from venue operational delays, personal injuries at third-party attractions, or lost belongings.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 10 */}
              <section id="disputes" className="scroll-mt-28 bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-brand" /> 10. Governing Law & Customer Support
                    </h3>
                    <p className="text-sm text-gray-300">
                      These Terms are governed by applicable consumer laws. For questions, booking support, or legal inquiries, our support team is available 24/7.
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
