import React, { useEffect, useState } from "react";
import {
  Shield,
  Zap,
  Headphones,
  Target,
  Eye,
  ShieldCheck,
  Ticket,
  Star,
  Lock,
  ArrowRight,
  ArrowLeft,
  Plane,
  MapPin,
  Compass,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { useSettings } from "../contexts/SettingsContext";

interface AboutPageProps {
  onBackToHome: () => void;
  onExploreActivities: () => void;
  onSelectAttraction?: (id: string) => void;
  onSelectDestination?: (destination: string) => void;
}

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: "eager" | "lazy";
}

function SafeImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackLabel,
  loading = "lazy",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-rose-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <MapPin className="w-6 h-6 text-[#e3000f] mb-1.5" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default function AboutPage({
  onBackToHome,
  onExploreActivities,
  onSelectDestination,
}: AboutPageProps) {
  const { t } = useSettings();

  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription
      ? metaDescription.getAttribute("content")
      : "";

    document.title =
      "About Us | Tiqsey - Discover the world. One experience at a time.";

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute(
      "content",
      "At Tiqsey, we believe every journey should be unforgettable. We make it easy to discover, book and enjoy the world's best attractions, tours and activities."
    );

    return () => {
      document.title = originalTitle;
      if (descTag && originalDescription) {
        descTag.setAttribute("content", originalDescription);
      }
    };
  }, []);

  const handleCityClick = (cityName: string) => {
    if (onSelectDestination) {
      onSelectDestination(cityName);
    } else {
      onExploreActivities();
    }
  };

  const destinations = [
    {
      name: "Paris",
      experiences: "250+ Experiences",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Dubai",
      experiences: "320+ Experiences",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "London",
      experiences: "280+ Experiences",
      image:
        "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Rome",
      experiences: "180+ Experiences",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Bali",
      experiences: "200+ Experiences",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Amsterdam",
      experiences: "150+ Experiences",
      image:
        "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Prague",
      experiences: "120+ Experiences",
      image:
        "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Santorini",
      experiences: "90+ Experiences",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "New York",
      experiences: "300+ Experiences",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Barcelona",
      experiences: "160+ Experiences",
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div
      id="about-us-page-root"
      className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[100dvh] font-sans pb-24 lg:pb-20 overflow-x-clip transition-colors duration-200"
    >
      {/* Top Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{t("backToHome", "Back to Home")}</span>
        </button>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Text & Key Value Props */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-[#e3000f] font-bold text-xs tracking-widest uppercase mb-4">
              <Compass className="w-4 h-4 shrink-0" />
              <span>{t("aboutUs", "About Tiqsey")}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                ·
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Global Ticket Marketplace
              </span>
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-5 [text-wrap:balance]">
              {t(
                "discoverTheWorld",
                "Discover the world. One experience at a time."
              )}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {t(
                "aboutHeroDesc",
                "At Tiqsey, we believe every journey should be unforgettable. We make it easy to discover, book and enjoy the world's best attractions, tours and activities."
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                type="button"
                onClick={onExploreActivities}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e3000f] hover:bg-[#c7000d] text-white font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t("exploreNow", "Explore Experiences")}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* 3 Key Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#e3000f] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t("trustedByMillions", "Trusted Worldwide")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t(
                      "trustedByMillionsDesc",
                      "Verified local operators in 30+ destinations."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#e3000f] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t("instantConfirmationTitle", "Instant QR Entry")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t(
                      "instantConfirmationDesc",
                      "Mobile e-tickets delivered straight to your inbox."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#e3000f] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t("support247", "24/7 Support")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t(
                      "support247Desc",
                      "Real assistance before and during your trip."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Collage with Dotted Flight Paths */}
          <div className="lg:col-span-6 relative min-h-[360px] sm:min-h-[500px] flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none text-slate-300 dark:text-slate-700/80"
              viewBox="0 0 500 520"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 130 110 Q 250 50 370 70"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <path
                d="M 410 140 Q 430 220 390 320"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <path
                d="M 90 350 Q 150 420 230 430"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>
            <Plane
              className="hidden sm:block absolute top-[48px] right-[85px] sm:right-[105px] w-5 h-5 text-slate-400 dark:text-slate-500 rotate-[35deg] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative w-full max-w-[300px] sm:max-w-[520px] h-[350px] sm:h-[480px] mx-auto">
              {/* Image 1 */}
              <div className="absolute left-0 top-4 sm:top-8 w-[112px] sm:w-[180px] h-[205px] sm:h-[310px] rounded-[60px] sm:rounded-[100px] overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-[1.03]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=600"
                  alt="Traveler exploring mountain vistas"
                  fallbackLabel="Mountain Adventures"
                  loading="eager"
                />
              </div>

              {/* Image 2 */}
              <div className="absolute right-1 sm:right-6 top-0 w-[132px] sm:w-[205px] h-[94px] sm:h-[145px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-[1.03]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"
                  alt="Tropical coastline at sunset"
                  fallbackLabel="Coastal Escapes"
                  loading="eager"
                />
              </div>

              {/* Image 3 */}
              <div className="absolute left-[72px] sm:left-[135px] bottom-0 w-[135px] sm:w-[195px] h-[92px] sm:h-[135px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-4 border-white dark:border-slate-800 z-20 transition-transform duration-300 hover:scale-[1.03]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600"
                  alt="Colosseum landmark in Rome"
                  fallbackLabel="Rome Heritage"
                  loading="eager"
                />
              </div>

              {/* Image 4 */}
              <div className="absolute right-0 bottom-3 sm:bottom-6 w-[112px] sm:w-[175px] h-[195px] sm:h-[295px] rounded-[60px] sm:rounded-[100px] overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-[1.03]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=600"
                  alt="Coastal cliffs and village in Cinque Terre"
                  fallbackLabel="Italian Coast"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              {t("ourStory", "Our Story")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#e3000f] rounded-full" />
            </h2>
            <p className="mt-6 text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug [text-wrap:balance]">
              {t(
                "ourStorySubtitle",
                "Tiqsey was founded with a simple mission: to help travelers explore the world with ease and confidence."
              )}
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t(
                "ourStoryDesc",
                "We know travel is more than just visiting new places — it's about creating memories that last a lifetime. That's why we partner with trusted local operators to bring you handpicked experiences at transparent prices, with instant booking and real human support."
              )}
            </p>
            <p className="mt-3 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
              {t(
                "ourStoryFooter",
                "From iconic landmarks to hidden gems, we make every experience count."
              )}
            </p>
          </div>

          {/* Mission & Vision Split Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 min-h-[260px] lg:min-h-[380px] relative overflow-hidden">
              <SafeImage
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"
                alt="Scenic Mediterranean coastline village"
                fallbackLabel="Curated Travel Destinations"
              />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-8">
              <div className="flex gap-4 sm:gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#e3000f] flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {t("ourMission", "Our Mission")}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {t(
                      "ourMissionDesc",
                      "To make travel more accessible and enjoyable for everyone by offering a wide range of curated experiences with transparent pricing, instant mobile vouchers, and dependable support."
                    )}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="flex gap-4 sm:gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#e3000f] flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {t("ourVision", "Our Vision")}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {t(
                      "ourVisionDesc",
                      "To be the world's most trusted marketplace for cultural attractions and tours, inspiring people to explore further with complete confidence."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= WHY CHOOSE TIQSEY? SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              {t("whyChooseTiqsey", "Why Choose Tiqsey?")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#e3000f] rounded-full" />
            </h2>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("bestPriceGuarantee", "Best Price Guarantee")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t(
                  "bestPriceGuaranteeDesc",
                  "Transparent rates with taxes shown clearly before checkout."
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("wideSelection", "Wide Selection")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t(
                  "wideSelectionDesc",
                  "Thousands of landmarks, museums, and guided tours in 30+ countries."
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("topRatedExp", "Top Rated Experiences")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t(
                  "topRatedExpDesc",
                  "Handpicked operators reviewed by real verified guests."
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("secureBooking", "Secure Booking")}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t(
                  "secureBookingDesc",
                  "Encrypted PCI-DSS certified payments and strict privacy standards."
                )}
              </p>
            </div>
          </div>

          {/* Tabular Impact Stats Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center lg:divide-x divide-slate-200 dark:divide-slate-800">
            <div>
              <span className="block text-2xl sm:text-4xl font-black text-[#e3000f] tabular-nums">
                30+
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                {t("countries", "Countries Covered")}
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-black text-[#e3000f] tabular-nums">
                25,000+
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                {t("experiences", "Curated Activities")}
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-black text-[#e3000f] tabular-nums">
                4.8/5
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                {t("averageRating", "Verified Guest Rating")}
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-4xl font-black text-[#e3000f] tabular-nums">
                2M+
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-wide">
                {t("happyTravelers", "Annual Ticketed Guests")}
              </span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= POPULAR DESTINATIONS SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              {t("popularDestinations", "Popular Destinations")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#e3000f] rounded-full" />
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              Select any city below to browse available tickets and guided tours directly.
            </p>
          </div>

          {/* Direct City Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 mb-10">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => handleCityClick(dest.name)}
                aria-label={`Explore ${dest.name} (${dest.experiences})`}
                className="group relative h-[170px] sm:h-[215px] w-full text-left rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3000f]"
              >
                <SafeImage
                  src={dest.image}
                  alt={dest.name}
                  fallbackLabel={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base sm:text-lg leading-tight flex items-center justify-between gap-1">
                    <span>{t(dest.name, dest.name)}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                  </h3>
                  <p className="text-[11px] text-slate-200 font-medium mt-0.5 tabular-nums">
                    {dest.experiences}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onExploreActivities}
              className="min-h-[44px] inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t("exploreAllDestinations", "Explore All Destinations")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </ScrollReveal>



      {/* ================= CTA BANNER SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="relative bg-[#e3000f] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md flex flex-col md:flex-row items-stretch min-h-[260px]">
            <div className="relative w-full md:w-[58%] p-6 sm:p-10 lg:p-12 z-10 flex flex-col justify-center shrink-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 sm:mb-4 text-white [text-wrap:balance]">
                {t("readyToExploreWorld", "Ready to explore the world?")}
              </h2>
              <p className="text-white/95 text-xs sm:text-sm lg:text-base max-w-md mb-6 sm:mb-8 leading-relaxed font-medium">
                {t(
                  "readyToExploreWorldDesc",
                  "Find the best attractions, tours and activities and make your next trip unforgettable."
                )}
              </p>
              <div>
                <button
                  type="button"
                  onClick={onExploreActivities}
                  className="min-h-[44px] inline-flex items-center gap-2.5 bg-white text-[#e3000f] hover:bg-slate-50 font-bold px-6 sm:px-7 py-3 rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t("exploreNow", "Start Exploring")}</span>
                  <ArrowRight className="w-4 h-4 text-[#e3000f]" />
                </button>
              </div>
            </div>

            <div className="relative w-full md:w-[42%] min-h-[200px] sm:min-h-[220px] md:min-h-full overflow-hidden z-0">
              <SafeImage
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1000"
                alt="Travelers overlooking a canyon river at golden hour"
                fallbackLabel="Start Your Journey"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
