import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  Printer,
  Link2,
  Check,
  FileText,
  Shield,
  Cookie,
  Scale,
  Mail,
} from "lucide-react";

export type TrustPageKey =
  | "about"
  | "privacy-policy"
  | "cookie-policy"
  | "terms-and-conditions";

export interface LegalSectionItem {
  id: string;
  title: string;
  searchText: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface LegalHighlight {
  label: string;
  value: string;
  detail: string;
}

interface LegalDocumentLayoutProps {
  activePage: Exclude<TrustPageKey, "about">;
  eyebrow: string;
  heroIcon: React.ReactNode;
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  complianceText: string;
  highlights: LegalHighlight[];
  sections: LegalSectionItem[];
  onBackToHome: () => void;
  onNavigate?: (page: TrustPageKey) => void;
  sidebarSupportHeading?: string;
  sidebarSupportDescription?: string;
  sidebarExtra?: React.ReactNode;
  heroExtra?: React.ReactNode;
  topBanner?: React.ReactNode;
  footerContactHeading: string;
  footerContactDescription: string;
}

export default function LegalDocumentLayout({
  activePage,
  eyebrow,
  heroIcon,
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  complianceText,
  highlights,
  sections,
  onBackToHome,
  sidebarSupportHeading = "Legal & Privacy Support",
  sidebarSupportDescription = "Have a question about any clause in this policy?",
  sidebarExtra,
  heroExtra,
  topBanner,
  footerContactHeading,
  footerContactDescription,
}: LegalDocumentLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ""
  );
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sections;
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(normalizedQuery) ||
        sec.searchText.toLowerCase().includes(normalizedQuery)
    );
  }, [sections, normalizedQuery]);

  useEffect(() => {
    if (
      filteredSections.length > 0 &&
      !filteredSections.some((s) => s.id === activeSection)
    ) {
      setActiveSection(filteredSections[0].id);
    }
  }, [filteredSections, activeSection]);

  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#/, "");
    if (rawHash && !rawHash.startsWith("/")) {
      const target = sections.find((s) => s.id === rawHash);
      if (target) {
        setActiveSection(target.id);
        setTimeout(() => {
          const el = document.getElementById(target.id);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 104;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }
        }, 120);
      }
    }
  }, [sections]);

  useEffect(() => {
    if (filteredSections.length === 0) return;

    const elements = filteredSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-110px 0px -60% 0px",
        threshold: [0.05, 0.25],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredSections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -104;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  const handleCopySectionLink = async (id: string) => {
    const url = `${window.location.origin}/${activePage}#${id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.style.position = "fixed";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopiedSectionId(id);
      setTimeout(() => {
        setCopiedSectionId((curr) => (curr === id ? null : curr));
      }, 2200);
    } catch {
      // Clipboard blocked in restricted frame
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 lg:pb-20 overflow-x-clip transition-colors duration-200 print:bg-white print:text-black print:pb-0">
      {/* Deep-Link Copy Feedback Toast */}
      {copiedSectionId && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 dark:border-slate-300 text-xs font-semibold flex items-center gap-2 print:hidden"
        >
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>Section link copied to clipboard</span>
        </div>
      )}

      {/* Editorial Hero Header */}
      <header className="bg-slate-900 dark:bg-slate-900/95 text-white pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 print:bg-white print:text-black print:border-slate-200 print:pt-4 print:pb-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Top navigation actions inside header */}
          <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
            <button
              type="button"
              onClick={onBackToHome}
              className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Print Document</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-400 print:text-slate-600 mb-3">
              {heroIcon}
              <span>{eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white print:text-black mb-4 [text-wrap:balance]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 print:text-slate-700 leading-relaxed mb-6 max-w-2xl">
              {subtitle}
            </p>

            {/* Unboxed Metadata Strip */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 print:text-slate-600 border-t border-slate-800 print:border-slate-200 pt-4 tabular-nums">
              <span>
                <strong className="text-slate-200 print:text-black font-semibold">
                  Last Updated:
                </strong>{" "}
                {lastUpdated}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span>
                <strong className="text-slate-200 print:text-black font-semibold">
                  Effective Date:
                </strong>{" "}
                {effectiveDate}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-emerald-400 print:text-emerald-700 font-semibold">
                {complianceText}
              </span>
            </div>

            {heroExtra && <div className="mt-6 print:hidden">{heroExtra}</div>}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 print:mt-6">
        {/* At a Glance Highlights Strip */}
        {highlights.length > 0 && (
          <section
            aria-label="Key summary highlights"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 print:border-slate-300"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Optional Page-Specific Interactive Banner (e.g. Cookie Quick Consent Bar) */}
        {topBanner && <div className="mb-8 print:hidden">{topBanner}</div>}

        {/* Mobile Quick-Jump Selector + Search Toolbar */}
        <div className="mb-6 lg:hidden space-y-3 print:hidden">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-3">
            <label htmlFor={`mobile-toc-${activePage}`} className="sr-only">
              Jump to policy section
            </label>
            <div className="flex items-center gap-2">
              <select
                id={`mobile-toc-${activePage}`}
                value={activeSection}
                onChange={(e) => scrollToSection(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#e3000f]/40"
              >
                {filteredSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Two-Column Document Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Desktop Sticky Scroll-Spy Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 print:hidden">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Contents
                </h2>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                  {filteredSections.length}/{sections.length}
                </span>
              </div>

              <nav aria-label="Document sections" className="space-y-1">
                {filteredSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full min-h-[40px] text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-[#e3000f] text-white font-semibold"
                          : "text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              {sidebarExtra && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {sidebarExtra}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#e3000f]" />
                    <span>{sidebarSupportHeading}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                    {sidebarSupportDescription}
                  </p>
                  <a
                    href="mailto:support@tiqsey.com"
                    className="text-xs font-bold text-[#e3000f] hover:underline block break-all"
                  >
                    support@tiqsey.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Policy Document Body */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6 min-w-0 print:col-span-12">
            {/* In-Page Keyword Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 print:hidden">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clauses, keywords, refunds, GDPR, or payment terms..."
                  aria-label="Search policy clauses"
                  className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#e3000f]/40 focus:border-[#e3000f]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0 tabular-nums px-1">
                <span>
                  Showing{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {filteredSections.length}
                  </strong>{" "}
                  of {sections.length} sections
                </span>
                {normalizedQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-[#e3000f] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Sections Document Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 lg:p-10 space-y-10 break-words print:border-0 print:p-0">
              {filteredSections.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    No matching clauses found
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    No sections in this document matched "{searchQuery}". Clear the filter to view all clauses.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e3000f] text-white text-sm font-bold hover:bg-[#c7000d] transition-colors cursor-pointer"
                  >
                    Show All Sections
                  </button>
                </div>
              ) : (
                filteredSections.map((sec, idx) => (
                  <React.Fragment key={sec.id}>
                    {idx > 0 && (
                      <hr className="border-slate-100 dark:border-slate-800" />
                    )}
                    <section id={sec.id} className="scroll-mt-28 group">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {sec.icon && (
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#e3000f] shrink-0">
                              {sec.icon}
                            </div>
                          )}
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {sec.title}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopySectionLink(sec.id)}
                          aria-label={`Copy link to ${sec.title}`}
                          title="Copy direct link to section"
                          className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer print:hidden"
                        >
                          {copiedSectionId === sec.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-[75ch] space-y-4">
                        {sec.content}
                      </div>
                    </section>
                  </React.Fragment>
                ))
              )}

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Unified Document Contact Callout */}
              <section
                aria-label="Contact support"
                className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white print:text-black mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#e3000f] shrink-0" />
                      <span>{footerContactHeading}</span>
                    </h3>
                    <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed max-w-xl">
                      {footerContactDescription}
                    </p>
                  </div>
                  <a
                    href="mailto:support@tiqsey.com"
                    className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#e3000f] hover:bg-[#c7000d] text-white font-bold transition-colors text-sm whitespace-nowrap shrink-0"
                  >
                    Email support@tiqsey.com
                  </a>
                </div>
              </section>

              {/* Bottom Return Home CTA */}
              <div className="pt-2 text-center print:hidden">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Tiqsey Home</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
