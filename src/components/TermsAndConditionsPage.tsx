import React, { useEffect } from "react";
import {
  FileText,
  Shield,
  CheckCircle2,
  Lock,
  AlertCircle,
  Globe,
  Scale,
  CreditCard,
  Ticket,
  RefreshCw,
  UserCheck,
  Ban,
  Building2,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import LegalDocumentLayout, {
  LegalSectionItem,
  TrustPageKey,
} from "./LegalDocumentLayout";

interface TermsAndConditionsPageProps {
  onBackToHome: () => void;
  onNavigate?: (page: TrustPageKey) => void;
}

export default function TermsAndConditionsPage({
  onBackToHome,
  onNavigate,
}: TermsAndConditionsPageProps) {
  const { t } = useSettings();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Terms & Conditions | Tiqsey - Service Agreement";
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
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <FileText className="w-5 h-5" />,
      searchText:
        "acceptance terms agreement privacy policy cookie policy amendments access browse purchase ticket vouchers",
      content: (
        <>
          <p className="text-sm sm:text-base">
            By accessing, browsing, or purchasing ticket vouchers through{" "}
            <strong className="text-slate-900 dark:text-white">Tiqsey</strong>{" "}
            ("we", "our", "us", or "the Platform"), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our{" "}
            <button
              type="button"
              onClick={() => handleInternalLink("privacy-policy")}
              className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
            >
              Privacy Policy
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => handleInternalLink("cookie-policy")}
              className="text-[#e3000f] font-semibold underline hover:text-[#c7000d] cursor-pointer"
            >
              Cookie Policy
            </button>
            .
          </p>
          <p className="text-sm sm:text-base">
            If you do not agree to these terms, you should discontinue using the platform. Updated revisions take effect upon publication with the revised effective date shown above.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "2. Platform Role & Booking Marketplace",
      icon: <Building2 className="w-5 h-5" />,
      searchText:
        "platform role marketplace intermediary venue operators museums parks tours e-ticket voucher safety schedules",
      content: (
        <>
          <p className="text-sm sm:text-base">
            Tiqsey operates as a digital booking marketplace connecting travelers with verified attraction operators, museums, theme parks, tour guides, and cultural organizers ("Venue Operators"):
          </p>
          <ul className="space-y-2.5 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              <strong className="text-slate-900 dark:text-white">Official E-Ticket Issuer:</strong> When you complete checkout on Tiqsey, we facilitate the reservation and generate valid digital entry vouchers or QR passes on behalf of the participating Venue Operator.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Venue Admission Rules:</strong> Entry remains subject to capacity guidelines, security screenings, dress codes, and posted operating hours of each individual venue.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">On-Site Delivery:</strong> Guided tours, exhibits, transport services, and on-site safety are directly operated by the named Venue Operator.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "accounts",
      title: "3. User Accounts & Eligibility",
      icon: <UserCheck className="w-5 h-5" />,
      searchText:
        "accounts eligibility 18 years parental consent guest booking accurate email security password unauthorized",
      content: (
        <>
          <p className="text-sm sm:text-base">
            To place bookings on Tiqsey, you must be at least 18 years old or have legal parental/guardian authorization. When creating an account or booking as a guest, you agree to:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              Provide accurate contact information (including an active email address for instant digital ticket delivery).
            </li>
            <li>
              Safeguard your login credentials and accept responsibility for orders placed under your authenticated session.
            </li>
            <li>
              Notify us promptly at{" "}
              <a
                href="mailto:support@tiqsey.com"
                className="text-[#e3000f] font-bold underline"
              >
                support@tiqsey.com
              </a>{" "}
              if you suspect unauthorized account activity.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "pricing",
      title: "4. Ticket Purchases, Pricing & Taxes",
      icon: <CreditCard className="w-5 h-5" />,
      searchText:
        "pricing taxes fees usd eur gbp aud stripe paypal apple pay google pay dynamic currency exchange",
      content: (
        <>
          <p className="text-sm sm:text-base">
            All ticket prices shown on Tiqsey reflect your chosen display currency (such as USD, EUR, GBP, or AUD) with applicable taxes and service fees presented clearly prior to payment authorization.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Secure Payment Gateways</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Transactions are encrypted and cleared via PCI-DSS certified payment processors including Stripe, PayPal, Apple Pay, and Google Pay.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e3000f] shrink-0" />
                <span>Dynamic Currency Conversion</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Multi-currency display estimates update continuously against reference exchange benchmarks.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "delivery",
      title: "5. E-Ticket Delivery, Redemption & Entry",
      icon: <Ticket className="w-5 h-5" />,
      searchText:
        "delivery redemption entry instant e-voucher qr barcode my bookings smartphone scanning government id timed entry",
      content: (
        <>
          <p className="text-sm sm:text-base">
            Upon successful payment confirmation:
          </p>
          <ol className="list-decimal list-inside space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <strong className="text-slate-900 dark:text-white">Instant E-Voucher Generation:</strong> Your digital entry pass containing a unique QR barcode is emailed immediately and accessible inside your account's "My Bookings" view.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Mobile Redemption:</strong> Nearly all venues scan mobile vouchers directly at entrance turnstiles. Select landmarks may also check a matching government photo ID.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Timed-Entry Punctuality:</strong> When purchasing timed admission slots, arrive at least 15 minutes early; Venue Operators may restrict late arrivals.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "cancellations",
      title: "6. Cancellations, Refunds & Rescheduling",
      icon: <RefreshCw className="w-5 h-5" />,
      searchText:
        "cancellations refunds rescheduling free cancellation 24 hours 100% weather force majeure closure",
      content: (
        <>
          <p className="text-sm sm:text-base">
            Specific cancellation eligibility depends on the ticket option chosen and is always highlighted clearly on each attraction page before checkout:
          </p>
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-1.5">
            <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Free Cancellation Protection</span>
            </p>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Tickets labeled "Free Cancellation" are eligible for a 100% refund up to 24 hours prior to your scheduled visit start time via your booking dashboard or customer support.
            </p>
          </div>
          <p className="text-sm sm:text-base">
            If an attraction closes unexpectedly due to severe weather, operational disruption, or force majeure, Tiqsey guarantees either a 100% full refund or priority rescheduling at no extra fee.
          </p>
        </>
      ),
    },
    {
      id: "conduct",
      title: "7. Acceptable Use & Prohibited Conduct",
      icon: <Ban className="w-5 h-5" />,
      searchText:
        "acceptable use prohibited conduct resell duplicate forge scrapers bots chargebacks disrupt infrastructure",
      content: (
        <>
          <p className="text-sm sm:text-base">
            While using the Tiqsey platform, you agree not to:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>
              Resell, duplicate, alter, or commercially broker Tiqsey ticket vouchers without explicit written authorization.
            </li>
            <li>
              Deploy automated scrapers, bots, or data-harvesting scripts against pricing feeds or availability endpoints.
            </li>
            <li>
              Submit fraudulent payment instruments or initiate unwarranted chargebacks after valid voucher redemption.
            </li>
            <li>
              Interfere with site availability, bypass access limits, or test system vulnerabilities without permission.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "8. Intellectual Property Rights",
      icon: <Shield className="w-5 h-5" />,
      searchText:
        "intellectual property logos trademarks software code copy photography copyright",
      content: (
        <p className="text-sm sm:text-base">
          All Tiqsey brand marks, interface architecture, curated copy, original photography, and software components remain the exclusive intellectual property of Tiqsey or its licensed partners and are protected under applicable copyright and trademark statutes.
        </p>
      ),
    },
    {
      id: "liability",
      title: "9. Limitation of Liability & Disclaimers",
      icon: <AlertCircle className="w-5 h-5" />,
      searchText:
        "liability disclaimers schedules availability damages delays third-party attractions belongings",
      content: (
        <p className="text-sm sm:text-base">
          Tiqsey works continuously with partners to ensure real-time slot accuracy and venue information. To the maximum extent allowed under applicable consumer law, Tiqsey is not liable for indirect or consequential losses arising from third-party attraction delays, temporary exhibit closures, or personal belongings lost on-site. Statutory consumer rights remain unaffected.
        </p>
      ),
    },
  ];

  return (
    <LegalDocumentLayout
      activePage="terms-and-conditions"
      eyebrow="Legal & Booking Terms"
      heroIcon={<Scale className="w-4 h-4" />}
      title={t("termsAndConditions", "Terms & Conditions")}
      subtitle="Clear, plain-language service terms governing your use of the Tiqsey platform, ticket reservations, cancellations, refunds, and traveler protections."
      lastUpdated="July 29, 2026"
      effectiveDate="January 1, 2026"
      complianceText="Official Service Agreement"
      highlights={[
        {
          label: "Flexible Changes",
          value: "24h Free Refund",
          detail:
            "Full refund up to 24 hours prior on all Free Cancellation tickets.",
        },
        {
          label: "Voucher Delivery",
          value: "Instant QR Pass",
          detail:
            "Digital tickets arrive by email and stay accessible under My Bookings.",
        },
        {
          label: "Closure Guarantee",
          value: "100% Protected",
          detail:
            "Automatic refund or free rescheduling if a venue closes unexpectedly.",
        },
      ]}
      sections={sections}
      onBackToHome={onBackToHome}
      onNavigate={onNavigate}
      sidebarSupportHeading="Booking & Legal Help"
      sidebarSupportDescription="Need clarification on cancellations, refunds, or voucher rules?"
      footerContactHeading="10. Governing Law & Customer Support"
      footerContactDescription="These Terms are governed by applicable consumer protection laws. For order support, cancellation help, or formal inquiries, our support team is available 24/7."
    />
  );
}
