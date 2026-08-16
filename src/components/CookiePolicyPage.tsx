import React, { useState, useEffect } from "react";
import {
  Cookie,
  Shield,
  CheckCircle2,
  Lock,
  Eye,
  FileText,
  Mail,
  ArrowLeft,
  ChevronRight,
  Settings,
  Info,
  Sliders,
  Check,
  X,
  HelpCircle,
  Globe,
  Database
} from "lucide-react";

interface CookiePolicyPageProps {
  onBackToHome: () => void;
}

const SECTIONS = [
  { id: "what-are-cookies", title: "1. What Are Cookies?" },
  { id: "how-we-use-cookies", title: "2. How Tiqsey Uses Cookies" },
  { id: "cookie-categories", title: "3. Categories of Cookies" },
  { id: "manage-preferences", title: "4. Manage Cookie Preferences" },
  { id: "third-party-cookies", title: "5. Third-Party & Social Media" },
  { id: "browser-settings", title: "6. Managing Cookies in Browser" },
  { id: "policy-updates", title: "7. Updates to This Policy" },
  { id: "contact-us", title: "8. Contact Information" },
];

export default function CookiePolicyPage({ onBackToHome }: CookiePolicyPageProps) {
  const [activeSection, setActiveSection] = useState("what-are-cookies");

  // Cookie preference toggles (Interactive)
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("tiqsey_cookie_preferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      essential: true, // Always true & disabled
      functional: true,
      analytics: true,
      marketing: false,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Cookie Policy | Tiqsey - Transparency & Control";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleToggle = (key: "functional" | "analytics" | "marketing") => {
    setPreferences((prev: typeof preferences) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSavedSuccess(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("tiqsey_cookie_preferences", JSON.stringify(preferences));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-all mb-8 border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4 border border-amber-500/30">
              <Cookie className="w-3.5 h-3.5" />
              Cookie Transparency & Control
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              This policy explains how Tiqsey uses cookies and similar storage technologies to recognize you, remember your trip preferences, secure your ticket bookings, and deliver a seamless experience.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-slate-800 pt-4">
              <span><strong>Last Updated:</strong> July 29, 2026</span>
              <span>•</span>
              <span><strong>Effective Date:</strong> January 1, 2026</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ePrivacy & GDPR Compliant
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
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80">
                  <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-700" /> Preference Control
                  </p>
                  <p className="text-xs text-amber-800 mb-2">You can customize non-essential cookies anytime on this page.</p>
                  <button
                    onClick={() => scrollToSection("manage-preferences")}
                    className="text-xs font-bold text-brand hover:underline block"
                  >
                    Manage Preferences ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Policy Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-12">

              {/* Section 1 */}
              <section id="what-are-cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. What Are Cookies?</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600 space-y-4 leading-relaxed">
                  <p>
                    Cookies are small text files containing bits of data that are stored on your computer, tablet, or smartphone when you visit a website. They are widely used across the web to enable websites to function properly, remember user choices, and provide analytical insight to site operators.
                  </p>
                  <p>
                    In addition to cookies, Tiqsey may use local storage, session storage, or web beacons. Throughout this policy, we refer to all of these technologies collectively as <strong>"Cookies"</strong>.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2 */}
              <section id="how-we-use-cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. How Tiqsey Uses Cookies</h2>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    When you explore tickets, compare attraction prices, or save items to your wishlist on Tiqsey, cookies help us deliver a fast, personal, and reliable experience:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" /> Instant Preference Memory
                      </h4>
                      <p className="text-xs text-gray-600">
                        Remembers your selected currency (e.g., USD, EUR, GBP) and preferred display language across sessions.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" /> Wishlist Persistence
                      </h4>
                      <p className="text-xs text-gray-600">
                        Saves your favorited destinations and ticket wishlist so you never lose track of planned activities.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" /> Secure Authentication
                      </h4>
                      <p className="text-xs text-gray-600">
                        Keeps you securely logged into your Tiqsey account while completing bookings or viewing past e-tickets.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" /> Platform Performance
                      </h4>
                      <p className="text-xs text-gray-600">
                        Optimizes image loading speeds and search filter caching so pages render instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3 */}
              <section id="cookie-categories" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <Info className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">3. Categories of Cookies We Use</h2>
                </div>
                <div className="space-y-6 text-gray-600 leading-relaxed">

                  {/* Cat 1 */}
                  <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <Lock className="w-4.5 h-4.5 text-emerald-600" /> Strictly Necessary Cookies
                      </h3>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                        Always Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal">
                      These cookies are essential for you to browse the Tiqsey platform and use its features, such as accessing secure booking pages and holding ticket selections during checkout. Without these cookies, the core service cannot function.
                    </p>
                  </div>

                  {/* Cat 2 */}
                  <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <Sliders className="w-4.5 h-4.5 text-brand" /> Functional & Preference Cookies
                      </h3>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal">
                      Functional cookies allow Tiqsey to remember choices you make (such as currency conversion or country location) to provide an enhanced, personal trip planning experience.
                    </p>
                  </div>

                  {/* Cat 3 */}
                  <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <Eye className="w-4.5 h-4.5 text-amber-600" /> Performance & Analytics Cookies
                      </h3>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal">
                      These cookies collect anonymous information about how visitors navigate Tiqsey—such as which attraction pages are visited most frequently. This data helps us improve load times and fix technical errors.
                    </p>
                  </div>

                  {/* Cat 4 */}
                  <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <Globe className="w-4.5 h-4.5 text-indigo-600" /> Marketing & Social Media Cookies
                      </h3>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-full">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-normal">
                      These cookies are set by embedded social media services (like Facebook or Instagram social links) or marketing partners to track visitors across websites and display relevant travel deals.
                    </p>
                  </div>

                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 4 - Interactive Preference Control */}
              <section id="manage-preferences" className="scroll-mt-28 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">4. Manage Your Cookie Preferences</h2>
                    <p className="text-xs text-gray-300 mt-1">
                      Customize your cookie settings below. Your preferences will be saved immediately for this browser.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6 bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                  {/* Essential */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <div className="pr-4">
                      <p className="font-bold text-sm text-white flex items-center gap-2">
                        Essential & Security Cookies <span className="text-[10px] uppercase font-extrabold bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full">Required</span>
                      </p>
                      <p className="text-xs text-gray-400">Required for ticket search, currency conversion, and checkout security.</p>
                    </div>
                    <div className="shrink-0 bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold">
                      Always On
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                    <div className="pr-4">
                      <p className="font-bold text-sm text-white">Functional Preferences</p>
                      <p className="text-xs text-gray-400">Remembers your wishlist items, preferred language, and recent searches.</p>
                    </div>
                    <button
                      onClick={() => handleToggle("functional")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.functional ? "bg-brand" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.functional ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                    <div className="pr-4">
                      <p className="font-bold text-sm text-white">Analytics & Performance</p>
                      <p className="text-xs text-gray-400">Helps us analyze traffic patterns to optimize booking speed and reliability.</p>
                    </div>
                    <button
                      onClick={() => handleToggle("analytics")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.analytics ? "bg-brand" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.analytics ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="pr-4">
                      <p className="font-bold text-sm text-white">Marketing & Social Media</p>
                      <p className="text-xs text-gray-400">Allows social media integrations (e.g. Facebook/Instagram) and tailored travel deals.</p>
                    </div>
                    <button
                      onClick={() => handleToggle("marketing")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.marketing ? "bg-brand" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.marketing ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all text-sm shadow-md"
                  >
                    Save Preferences
                  </button>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
                    </span>
                  )}
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 5 */}
              <section id="third-party-cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Third-Party & Social Media Services</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Tiqsey features official links to social media platforms such as our <strong>Facebook</strong> and <strong>Instagram</strong> pages.
                  </p>
                  <p>
                    When interacting with social links or embedded payment services (like Stripe or PayPal), these third parties may set their own cookies according to their respective privacy and cookie policies. We encourage you to review their policies directly:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium pt-1">
                    <li><a href="https://www.facebook.com/policies/cookies/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Meta / Facebook Cookie Policy</a></li>
                    <li><a href="https://help.instagram.com/1896641480634370" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Instagram Cookie Policy</a></li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 6 */}
              <section id="browser-settings" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">6. How to Control Cookies in Your Browser</h2>
                </div>
                <div className="space-y-3 text-gray-600 leading-relaxed text-sm">
                  <p>
                    Most modern web browsers allow you to manage, block, or delete cookies via their settings menus:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors block"
                    >
                      Google Chrome
                    </a>
                    <a
                      href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors block"
                    >
                      Apple Safari
                    </a>
                    <a
                      href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors block"
                    >
                      Mozilla Firefox
                    </a>
                    <a
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-400c-23f2-4402-d0da8e561d37"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors block"
                    >
                      Microsoft Edge
                    </a>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 7 & 8 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section id="policy-updates" className="scroll-mt-28 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">7. Policy Updates</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We may update this Cookie Policy periodically to reflect technological changes or legal requirements. Updated versions will be posted here with a revised effective date.
                  </p>
                </section>

                <section id="contact-us" className="scroll-mt-28 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">8. Questions & Contact</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    For questions regarding our use of cookies or privacy practices, reach out to our team at:
                  </p>
                  <a href="mailto:support@tiqsey.com" className="text-xs font-bold text-brand hover:underline">
                    support@tiqsey.com
                  </a>
                </section>
              </div>

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
