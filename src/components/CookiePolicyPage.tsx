import React, { useState, useEffect } from "react";
import {
  Cookie,
  Shield,
  CheckCircle2,
  Lock,
  Eye,
  Settings,
  Info,
  Sliders,
  Globe,
  Database,
  RotateCcw,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import LegalDocumentLayout, {
  LegalSectionItem,
  TrustPageKey,
} from "./LegalDocumentLayout";

interface CookiePolicyPageProps {
  onBackToHome: () => void;
  onNavigate?: (page: TrustPageKey) => void;
}

interface CookiePreferencesState {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferencesState = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: false,
};

function loadCookiePreferences(): CookiePreferencesState {
  try {
    const saved = localStorage.getItem("tiqsey_cookie_preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        essential: true,
        functional: Boolean(parsed.functional ?? true),
        analytics: Boolean(parsed.analytics ?? true),
        marketing: Boolean(parsed.marketing ?? false),
      };
    }
  } catch {
    // Use defaults
  }
  return DEFAULT_PREFERENCES;
}

export default function CookiePolicyPage({
  onBackToHome,
  onNavigate,
}: CookiePolicyPageProps) {
  const { t } = useSettings();
  const [preferences, setPreferences] = useState<CookiePreferencesState>(() =>
    loadCookiePreferences()
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Cookie Policy | Tiqsey - Transparency & Control";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const persistPreferences = (
    next: CookiePreferencesState,
    feedback: string
  ) => {
    setPreferences(next);
    try {
      localStorage.setItem("tiqsey_cookie_preferences", JSON.stringify(next));
      window.dispatchEvent(new Event("tiqsey_cookie_preferences_updated"));
    } catch {
      // Ignore storage errors in private mode
    }
    setStatusMessage(feedback);
    setTimeout(() => {
      setStatusMessage((curr) => (curr === feedback ? null : curr));
    }, 3000);
  };

  const handleToggle = (key: "functional" | "analytics" | "marketing") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setStatusMessage(null);
  };

  const handleAcceptAll = () => {
    persistPreferences(
      {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
      "All cookie categories accepted and saved."
    );
  };

  const handleEssentialOnly = () => {
    persistPreferences(
      {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      "Updated to Essential Cookies Only."
    );
  };

  const handleResetDefaults = () => {
    persistPreferences(
      DEFAULT_PREFERENCES,
      "Cookie preferences restored to recommended defaults."
    );
  };

  const handleSaveCustom = () => {
    persistPreferences(preferences, "Custom cookie preferences saved.");
  };

  const activeCategoryCount =
    1 +
    (preferences.functional ? 1 : 0) +
    (preferences.analytics ? 1 : 0) +
    (preferences.marketing ? 1 : 0);

  const cookieInventory = [
    {
      name: "tiqsey_cookie_preferences",
      category: "Strictly Necessary",
      purpose: "Stores your selected cookie and privacy consent choices.",
      retention: "12 months",
      active: true,
    },
    {
      name: "tiqsey_auth_session",
      category: "Strictly Necessary",
      purpose: "Keeps your account and ticket checkout session authenticated.",
      retention: "Session / 30 days",
      active: true,
    },
    {
      name: "tiqsey_settings",
      category: "Functional",
      purpose: "Remembers selected display currency, language, and Dark Mode.",
      retention: "Persistent",
      active: preferences.functional,
    },
    {
      name: "wishlist & recentlyViewed",
      category: "Functional",
      purpose: "Preserves favorite attractions and recently browsed tours.",
      retention: "Persistent",
      active: preferences.functional,
    },
    {
      name: "tiqsey_perf_metrics",
      category: "Analytics",
      purpose: "Measures anonymous page load performance and search responsiveness.",
      retention: "90 days",
      active: preferences.analytics,
    },
    {
      name: "tiqsey_campaign_ref",
      category: "Marketing",
      purpose: "Attributes promotional offers and seasonal deal referrals.",
      retention: "30 days",
      active: preferences.marketing,
    },
  ];

  // Live consent summary bar placed cleanly above the TOC & main document
  const liveConsentBanner = (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Sliders className="w-4 h-4 text-[#e3000f] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Your Current Cookie Status:{" "}
            <span className="text-[#e3000f] tabular-nums">
              {activeCategoryCount} of 4 Categories Enabled
            </span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          {statusMessage ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </span>
          ) : (
            "Apply quick presets below or customize individual toggles in Section 4."
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-[#e3000f] hover:bg-[#c7000d] text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Accept All Cookies
        </button>
      </div>
    </div>
  );

  const sections: LegalSectionItem[] = [
    {
      id: "what-are-cookies",
      title: "1. What Are Cookies?",
      icon: <Cookie className="w-5 h-5" />,
      searchText:
        "what are cookies small text files browser storage local storage session storage web beacons",
      content: (
        <>
          <p className="text-sm sm:text-base">
            Cookies are small text files placed on your computer, tablet, or smartphone when you visit a website. They help websites function reliably, remember your trip settings, and measure site performance.
          </p>
          <p className="text-sm sm:text-base">
            In addition to browser cookies, Tiqsey uses standard browser <strong className="text-slate-900 dark:text-white">localStorage</strong> and <strong className="text-slate-900 dark:text-white">sessionStorage</strong> to preserve theme, currency, and wishlist state safely inside your device. Throughout this policy, we refer to these mechanisms collectively as <strong className="text-slate-900 dark:text-white">"Cookies"</strong>.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-cookies",
      title: "2. How Tiqsey Uses Cookies",
      icon: <Database className="w-5 h-5" />,
      searchText:
        "how tiqsey uses cookies instant preference memory currency wishlist persistence authentication security performance speed",
      content: (
        <>
          <p className="text-sm sm:text-base">
            When you compare ticket prices or save tours to your wishlist on Tiqsey, cookies support four core capabilities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Preference Memory</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Remembers your preferred currency (USD, EUR, GBP), display language, and Light/Dark theme across visits.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Wishlist Continuity</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Keeps your bookmarked attractions and recently viewed activities intact as you compare dates.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Checkout Integrity</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Protects authenticated account sessions and maintains ticket reservations cleanly through checkout.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Platform Reliability</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Identifies slow attraction pages or layout errors so we can keep browsing instant on mobile and desktop.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "cookie-categories",
      title: "3. Cookie Categories & Breakdown Table",
      icon: <Info className="w-5 h-5" />,
      searchText:
        "categories strictly necessary functional analytics performance marketing breakdown table retention status keys",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Strictly Necessary</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                  Always Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Essential for secure checkout sessions, CSRF protection, and persisting your cookie consent choice.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#e3000f] shrink-0" />
                  <span>Functional Preferences</span>
                </h3>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                  {preferences.functional ? "Enabled" : "Paused"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Saves language, currency conversion, Dark Mode preference, Wishlist items, and recently viewed tours.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Performance & Analytics</span>
                </h3>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                  {preferences.analytics ? "Enabled" : "Paused"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Collects aggregated diagnostics on search latency and popular attractions to improve reliability.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Marketing & Attribution</span>
                </h3>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                  {preferences.marketing ? "Enabled" : "Paused"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Supports referral attribution for promotional campaigns and social media integrations.
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-bold">Storage Key / Cookie</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Purpose</th>
                  <th className="py-3 px-4 font-bold">Retention</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {cookieInventory.map((item) => (
                  <tr
                    key={item.name}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-900 dark:text-slate-100 font-semibold whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {item.purpose}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 tabular-nums whitespace-nowrap">
                      {item.retention}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-semibold">
                      <span
                        className={
                          item.active
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                        }
                      >
                        {item.active ? "Active" : "Paused"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Breakdown Cards */}
          <div className="md:hidden space-y-3">
            {cookieInventory.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white break-all">
                    {item.name}
                  </span>
                  <span
                    className={`text-xs font-bold shrink-0 ${
                      item.active
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {item.active ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {item.category} · Retention: {item.retention}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "manage-preferences",
      title: "4. Manage Cookie Preferences",
      icon: <Settings className="w-5 h-5" />,
      searchText:
        "manage cookie preferences toggles essential functional analytics marketing accept all save preferences reset",
      content: (
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 sm:p-7 rounded-2xl border border-slate-800 space-y-5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Customize Your Browser Preferences
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Changes are stored immediately in your browser via <span className="font-mono text-xs">tiqsey_cookie_preferences</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer w-fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="space-y-4 bg-slate-950/80 dark:bg-slate-900/70 p-4 sm:p-5 rounded-xl border border-slate-800">
            {/* Essential */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white">
                  Essential & Security Cookies{" "}
                  <span className="text-xs font-semibold text-emerald-400 ml-1.5">
                    · Required
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Necessary for ticket search, account login, and payment security.
                </p>
              </div>
              <span className="shrink-0 bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                Always Active
              </span>
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-800 pb-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white">
                  Functional Preferences
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Remembers your Wishlist items, currency selection, language, and Dark Mode.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.functional}
                aria-label="Toggle Functional Preferences cookies"
                onClick={() => handleToggle("functional")}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  preferences.functional ? "bg-[#e3000f]" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    preferences.functional ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between gap-3 py-1 border-b border-slate-800 pb-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white">
                  Analytics & Performance
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Helps measure search speed, availability reliability, and technical errors.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.analytics}
                aria-label="Toggle Analytics and Performance cookies"
                onClick={() => handleToggle("analytics")}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  preferences.analytics ? "bg-[#e3000f]" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    preferences.analytics ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white">
                  Marketing & Social Media
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Supports promotional deal attribution and embedded social widgets.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.marketing}
                aria-label="Toggle Marketing and Social Media cookies"
                onClick={() => handleToggle("marketing")}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  preferences.marketing ? "bg-[#e3000f]" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    preferences.marketing ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e3000f] hover:bg-[#c7000d] text-white font-bold transition-colors text-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                Accept All
              </button>
            </div>

            {statusMessage && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "third-party-cookies",
      title: "5. Third-Party & Social Media Services",
      icon: <Globe className="w-5 h-5" />,
      searchText:
        "third-party social media facebook instagram meta stripe paypal policies",
      content: (
        <>
          <p className="text-sm sm:text-base">
            When interacting with encrypted checkout windows (Stripe, PayPal) or opening official Tiqsey links on Meta/Facebook or Instagram, those external providers manage cookies under their own policies:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 dark:text-slate-300 font-medium">
            <li>
              <a
                href="https://www.facebook.com/policies/cookies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e3000f] hover:underline"
              >
                Meta / Facebook Cookie Policy
              </a>
            </li>
            <li>
              <a
                href="https://help.instagram.com/1896641480634370"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e3000f] hover:underline"
              >
                Instagram Cookie Information
              </a>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "browser-settings",
      title: "6. Managing Cookies in Your Browser",
      icon: <Shield className="w-5 h-5" />,
      searchText:
        "browser settings chrome safari firefox microsoft edge block delete clear cookies",
      content: (
        <>
          <p className="text-sm sm:text-base">
            In addition to the interactive toggles above, most browsers let you view, block, or clear cookies directly inside privacy settings:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              {
                name: "Google Chrome",
                href: "https://support.google.com/chrome/answer/95647",
              },
              {
                name: "Apple Safari",
                href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
              },
              {
                name: "Mozilla Firefox",
                href: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop",
              },
              {
                name: "Microsoft Edge",
                href: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-400c-23f2-4402-d0da8e561d37",
              },
            ].map((browser) => (
              <a
                key={browser.name}
                href={browser.href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-center text-center text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#e3000f]/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {browser.name}
              </a>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "policy-updates",
      title: "7. Policy Updates & Retention",
      icon: <Info className="w-5 h-5" />,
      searchText:
        "updates policy changes effective date retention compliance review",
      content: (
        <p className="text-sm sm:text-base">
          We review this Cookie Policy whenever we introduce new booking capabilities or updated privacy regulations take effect. Any material changes will update the "Last Updated" date at the top of this document. You can also revisit our{" "}
          <button
            type="button"
            onClick={() =>
              onNavigate
                ? onNavigate("privacy-policy")
                : (window.location.href = "/privacy-policy")
            }
            className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
          >
            Privacy Policy
          </button>{" "}
          for broader data protection terms.
        </p>
      ),
    },
  ];

  return (
    <LegalDocumentLayout
      activePage="cookie-policy"
      eyebrow="Cookie Transparency & Control"
      heroIcon={<Cookie className="w-4 h-4" />}
      title={t("cookiePolicy", "Cookie Policy")}
      subtitle="Understand exactly how Tiqsey uses cookies and local browser storage to keep checkout secure, save your wishlist, and give you instant control over optional tracking."
      lastUpdated="July 29, 2026"
      effectiveDate="January 1, 2026"
      complianceText="ePrivacy & GDPR Compliant"
      highlights={[
        {
          label: "Default Posture",
          value: "Essential Ready",
          detail:
            "Core checkout and security work even with marketing cookies disabled.",
        },
        {
          label: "Browser Control",
          value: "Instant Toggle",
          detail:
            "Adjust functional, analytics, or marketing storage keys with zero reload.",
        },
        {
          label: "Data Inspection",
          value: "6 Documented Keys",
          detail:
            "Every storage key, retention period, and live active status is listed clearly.",
        },
      ]}
      topBanner={liveConsentBanner}
      sections={sections}
      onBackToHome={onBackToHome}
      onNavigate={onNavigate}
      sidebarSupportHeading="Cookie Questions"
      sidebarSupportDescription="Want details about browser storage keys or privacy compliance?"
      footerContactHeading="8. Questions About Cookies or Privacy?"
      footerContactDescription="If you have questions regarding how Tiqsey uses cookies, browser storage, or consent settings, reach our privacy team anytime."
    />
  );
}
