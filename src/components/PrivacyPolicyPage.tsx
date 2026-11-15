import React, { useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  Database,
  Globe,
  UserCheck,
  Cookie,
  Server,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import LegalDocumentLayout, {
  LegalSectionItem,
  TrustPageKey,
} from "./LegalDocumentLayout";

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onNavigate?: (page: TrustPageKey) => void;
}

export default function PrivacyPolicyPage({
  onBackToHome,
  onNavigate,
}: PrivacyPolicyPageProps) {
  const { t } = useSettings();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Privacy Policy | Tiqsey - Your Data Protection & Trust";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleInternalLink = (page: TrustPageKey) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.history.pushState({}, "", `/${page}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sections: LegalSectionItem[] = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <FileText className="w-5 h-5" />,
      searchText:
        "introduction welcome tiqsey marketplace platform digital ticket booking website mobile privacy practices consent",
      content: (
        <>
          <p>
            Welcome to <strong className="text-slate-900 dark:text-white">Tiqsey</strong> ("we", "our", or "us"). Tiqsey operates a digital ticket booking marketplace and technology platform that connects travelers with attractions, museums, city tours, theme parks, and cultural activities around the world.
          </p>
          <p>
            This Privacy Policy applies to all users of our website, mobile interface, and services. By accessing or using Tiqsey to browse activities or complete ticket bookings, you acknowledge the data collection, protection, and usage practices described in this document alongside our{" "}
            <button
              type="button"
              onClick={() => handleInternalLink("cookie-policy")}
              className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
            >
              Cookie Policy
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => handleInternalLink("terms-and-conditions")}
              className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
            >
              Terms & Conditions
            </button>
            .
          </p>
        </>
      ),
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: <Database className="w-5 h-5" />,
      searchText:
        "information collect personal identifiers name email phone currency language payment stripe paypal pci-dss technical ip browser wishlist",
      content: (
        <>
          <p>
            We collect information that you directly provide to us when creating an account or booking tickets, as well as technical telemetry generated automatically to keep the platform fast and secure:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Personal Identifiers</span>
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Full Name and Contact Details</li>
                <li>Email Address for instant QR e-ticket delivery</li>
                <li>Phone Number for urgent booking alerts</li>
                <li>Preferred Currency and Language Settings</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Payment & Transaction Data</span>
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Selected activities, visit dates, and time slots</li>
                <li>Encrypted confirmation tokens from Stripe or PayPal</li>
                <li className="italic">
                  Full card numbers are processed directly by PCI-DSS certified payment providers and never stored on Tiqsey servers.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Technical & Device Information</span>
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>IP Address and approximate region for localization</li>
                <li>Browser type, operating system, and screen viewport</li>
                <li>Session timestamps and error diagnostic logs</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                <Cookie className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Wishlist & Preferences</span>
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Saved attractions and favorite destinations</li>
                <li>Recently viewed activities and filter choices</li>
                <li>Traveler reviews, ratings, and support correspondence</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: <Eye className="w-5 h-5" />,
      searchText:
        "use information fulfilling bookings e-tickets qr customer support 24/7 platform optimization fraud newsletter opt-out",
      content: (
        <>
          <p>
            We process your personal information strictly for legitimate service fulfillment, fraud prevention, and customer care:
          </p>
          <ul className="space-y-3 text-sm list-none pl-0">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Fulfilling Bookings:</strong> Generating instant e-tickets, locking timed-entry slots, and emailing mobile QR vouchers directly to your inbox.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Customer Support & Venue Alerts:</strong> Providing 24/7 assistance for schedule updates, refund requests, and entry instructions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Security & Fraud Prevention:</strong> Verifying transaction integrity, preventing unauthorized ticket reselling, and maintaining fast page speeds.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Essential Communication:</strong> Delivering mandatory booking receipts and optional promotional alerts (you may opt out anytime).
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "4. Information Sharing & Third Parties",
      icon: <Globe className="w-5 h-5" />,
      searchText:
        "zero sale guarantee sharing third parties venue operators museums parks stripe paypal legal obligations",
      content: (
        <>
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm">
            <strong>Zero Sale Guarantee:</strong> Tiqsey never sells, rents, or trades your personal information to third-party advertisers or data brokers.
          </div>
          <p className="text-sm">
            We share only the minimum required data with vetted partners strictly necessary to deliver your booked experience:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <strong className="text-slate-900 dark:text-white">Venue Operators & Activity Hosts:</strong> Guest names, booking references, and ticket counts are shared solely to validate entry passes at venue check-in.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Payment Gateways:</strong> Payments are processed directly through encrypted, certified providers such as Stripe and PayPal.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Cloud Infrastructure Providers:</strong> Encrypted hosting and database systems governed by strict data-processing agreements.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Legal Compliance:</strong> Disclosure only where strictly mandated by valid legal process or law enforcement.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Data Security & Storage",
      icon: <Lock className="w-5 h-5" />,
      searchText:
        "security storage tls ssl encryption vulnerability audits cloud data centers access control retention",
      content: (
        <>
          <p className="text-sm">
            We apply layered technical and organizational safeguards to protect account records and transaction tokens against unauthorized access or disclosure:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <li className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium">
              <Lock className="w-4 h-4 text-[#e3000f] shrink-0" />
              <span>256-bit TLS/HTTPS Encryption in Transit</span>
            </li>
            <li className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium">
              <Shield className="w-4 h-4 text-[#e3000f] shrink-0" />
              <span>Periodic Security & Dependency Audits</span>
            </li>
            <li className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium">
              <Server className="w-4 h-4 text-[#e3000f] shrink-0" />
              <span>Hardened Cloud Storage & Backups</span>
            </li>
            <li className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium">
              <UserCheck className="w-4 h-4 text-[#e3000f] shrink-0" />
              <span>Least-Privilege Access Controls</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "6. Cookies & Local Browser Storage",
      icon: <Cookie className="w-5 h-5" />,
      searchText:
        "cookies local storage preferences currency wishlist tracking browser settings manage consent",
      content: (
        <>
          <p className="text-sm">
            Tiqsey uses essential cookies and browser local storage to remember your preferred currency, language, Wishlist selections, and active booking sessions.
          </p>
          <p className="text-sm">
            You have direct control over optional functional, analytics, and marketing cookies at any time via our interactive{" "}
            <button
              type="button"
              onClick={() => handleInternalLink("cookie-policy")}
              className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
            >
              Cookie Preference Center
            </button>
            .
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "7. Your Rights & Choices (GDPR & CCPA)",
      icon: <UserCheck className="w-5 h-5" />,
      searchText:
        "rights gdpr ccpa access rectification erasure deletion portability opt-out forgotten support",
      content: (
        <>
          <p className="text-sm">
            Depending on your jurisdiction (including the EU/EEA, UK, and California), you are entitled to exercise full control over your personal data:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              <strong className="text-slate-900 dark:text-white">Right to Access:</strong> Request a clear summary or export of the personal data we hold for your account.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Right to Rectification:</strong> Request prompt correction of inaccurate names, emails, or traveler details.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Right to Erasure:</strong> Request deletion of your profile and associated personal history, subject to statutory financial record retention.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Right to Opt-Out:</strong> Unsubscribe from promotional digests or disable optional cookies anytime.
            </li>
          </ul>
          <p className="text-sm">
            To submit a data access or deletion request, email our Data Protection team at{" "}
            <a
              href="mailto:support@tiqsey.com?subject=Privacy%20Rights%20Request"
              className="text-[#e3000f] font-bold underline"
            >
              support@tiqsey.com
            </a>
            . We respond within 30 calendar days.
          </p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "8. International Data Transfers",
      icon: <Globe className="w-5 h-5" />,
      searchText:
        "international transfers cross-border safeguards destinations global partners standard contractual clauses",
      content: (
        <p className="text-sm">
          Because Tiqsey connects travelers with venues across more than 30 countries, booking fulfillment may require transferring guest reservation details to local activity operators outside your country of residence under standard contractual and operational safeguards.
        </p>
      ),
    },
    {
      id: "children",
      title: "9. Children's Privacy",
      icon: <Shield className="w-5 h-5" />,
      searchText:
        "children privacy under 16 parental consent minors bookings adult",
      content: (
        <p className="text-sm">
          Tiqsey does not knowingly collect personal information directly from children under 16 years of age without verified parental consent. Ticket purchases for family or youth admission must be completed by an adult account holder or guardian.
        </p>
      ),
    },
  ];

  return (
    <LegalDocumentLayout
      activePage="privacy-policy"
      eyebrow="Privacy & Data Governance"
      heroIcon={<Shield className="w-4 h-4" />}
      title={t("privacyPolicy", "Privacy Policy")}
      subtitle="At Tiqsey, protecting your personal data and maintaining transparent booking trust is fundamental. Review exactly what information we collect, why we use it, and how you control it."
      lastUpdated="July 29, 2026"
      effectiveDate="January 1, 2026"
      complianceText="GDPR & CCPA Aligned"
      highlights={[
        {
          label: "Commercial Policy",
          value: "Zero Data Sale",
          detail:
            "We never sell, rent, or broker traveler details to advertisers.",
        },
        {
          label: "Checkout Security",
          value: "PCI-DSS Level 1",
          detail:
            "Full card numbers stay exclusively with Stripe and PayPal.",
        },
        {
          label: "Traveler Control",
          value: "Full Data Rights",
          detail:
            "Request access, updates, or account deletion within 30 days.",
        },
      ]}
      sections={sections}
      onBackToHome={onBackToHome}
      onNavigate={onNavigate}
      sidebarSupportHeading="Privacy Inquiries"
      sidebarSupportDescription="Questions about data rights, exports, or account deletion?"
      footerContactHeading="10. Contact Our Data Protection Team"
      footerContactDescription="If you have questions, access requests, or feedback regarding this Privacy Policy, our privacy team responds promptly."
    />
  );
}
