import React, { useEffect } from "react";
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
  ChevronLeft,
  Plane,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface AboutPageProps {
  onBackToHome: () => void;
  onExploreActivities: () => void;
  onSelectAttraction?: (id: string) => void;
}

export default function AboutPage({ onBackToHome, onExploreActivities, onSelectAttraction }: AboutPageProps) {
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute("content") : "";

    document.title = "About Us | Tiqsey - Discover the world. One experience at a time.";

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

  const destinations = [
    {
      name: "Paris",
      experiences: "250+ Experiences",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Dubai",
      experiences: "320+ Experiences",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "London",
      experiences: "280+ Experiences",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Rome",
      experiences: "180+ Experiences",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Bali",
      experiences: "200+ Experiences",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Amsterdam",
      experiences: "150+ Experiences",
      image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Prague",
      experiences: "120+ Experiences",
      image: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Santorini",
      experiences: "90+ Experiences",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "New York",
      experiences: "300+ Experiences",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Barcelona",
      experiences: "160+ Experiences",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div id="about-us-page-root" className="bg-[#FAFBFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans pb-20">
      
      {/* Top Header Back Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & Key Value Props */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 text-[#FF385C] font-extrabold text-xs tracking-wider uppercase px-3.5 py-1.5 rounded-full w-max mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              About Us
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              Discover the world. <br />
              One <span className="text-[#FF385C]">experience</span> <br />
              at a time.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              At Tiqsey, we believe every journey should be unforgettable. We make it easy to discover, book and enjoy the world's best attractions, tours and activities.
            </p>

            {/* 3 Key Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex flex-col items-start gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-[#FF385C] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Trusted by millions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    Join thousands of happy travelers worldwide.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-[#FF385C] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Instant confirmation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    Get your tickets instantly and skip the queues.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-[#FF385C] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">24/7 Support</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    We're here for you anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Collage with Dotted Paths */}
          <div className="lg:col-span-6 relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
            
            {/* Background dotted flight path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-slate-300 dark:text-slate-700/80" viewBox="0 0 500 520" fill="none">
              <path d="M 130 110 Q 250 50 370 70" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M 410 140 Q 430 220 390 320" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M 90 350 Q 150 420 230 430" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            </svg>
            <Plane className="absolute top-[48px] right-[85px] sm:right-[105px] w-5 h-5 text-slate-400 dark:text-slate-500 rotate-[35deg] pointer-events-none" />

            <div className="relative w-full max-w-[480px] sm:max-w-[520px] h-[450px] sm:h-[500px] mx-auto">
              {/* Image 1: Tall Vertical Capsule Pill (Left) */}
              <div className="absolute left-0 top-6 sm:top-8 w-[145px] sm:w-[180px] h-[270px] sm:h-[320px] rounded-[80px] sm:rounded-[100px] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=600"
                  alt="Traveler exploring mountains and balloons"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Image 2: Top Right Landscape Box */}
              <div className="absolute right-2 sm:right-6 top-0 w-[165px] sm:w-[205px] h-[120px] sm:h-[145px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"
                  alt="Tropical ocean and sunset beach"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Image 3: Bottom Center Landscape Box */}
              <div className="absolute left-[105px] sm:left-[135px] bottom-0 w-[165px] sm:w-[195px] h-[115px] sm:h-[135px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 z-20 transition-transform duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600"
                  alt="Colosseum in Rome"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Image 4: Tall Vertical Capsule Pill (Far Right) */}
              <div className="absolute right-0 bottom-4 sm:bottom-6 w-[145px] sm:w-[175px] h-[255px] sm:h-[300px] rounded-[80px] sm:rounded-[100px] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-10 transition-transform duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=600"
                  alt="Colorful coastal village Cinque Terre"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              OUR STORY
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FF385C] rounded-full" />
            </h2>
            <p className="mt-6 text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
              Tiqsey was founded with a simple mission: to help travelers explore the world with ease and confidence.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              We know travel is more than just visiting new places — it's about creating memories that last a lifetime. That's why we partner with trusted local operators to bring you handpicked experiences at the best prices, with instant booking and real human support.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
              From iconic landmarks to hidden gems, we make every experience count.
            </p>
          </div>

          {/* Mission & Vision Container Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Image Side */}
            <div className="lg:col-span-5 h-[280px] lg:h-auto relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"
                alt="Cinque Terre Amalfi Coast"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Mission & Vision Content */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-8 relative">
              
              {/* Mission item */}
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[#FF385C] flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">OUR MISSION</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    To make travel more accessible and enjoyable for everyone by offering a wide range of curated experiences with transparency, convenience and outstanding value.
                  </p>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Vision item */}
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[#FF385C] flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">OUR VISION</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    To be the world's most trusted platform for travel experiences, inspiring people to explore more and create unforgettable memories.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>
      </ScrollReveal>

      {/* ================= WHY CHOOSE TIQSEY? SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-16">
          
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              WHY CHOOSE TIQSEY?
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FF385C] rounded-full" />
            </h2>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Best Price Guarantee</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                We offer competitive prices so you get the best value for your money.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-6">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Wide Selection</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Thousands of activities in 180+ countries and growing every day.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-6">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Top Rated Experiences</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Handpicked experiences rated by real travelers like you.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Secure Booking</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Your data is safe with us. We use industry-leading security.
              </p>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="pt-4 lg:pt-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FF385C]">180+</span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">Countries</span>
            </div>
            <div className="pt-4 lg:pt-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FF385C]">25,000+</span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">Experiences</span>
            </div>
            <div className="pt-4 lg:pt-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FF385C]">4.8/5</span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">Average Rating</span>
            </div>
            <div className="pt-4 lg:pt-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FF385C]">2M+</span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">Happy Travelers</span>
            </div>
          </div>

        </section>
      </ScrollReveal>

      {/* ================= POPULAR DESTINATIONS SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-16">
          
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider inline-block relative pb-2">
              POPULAR DESTINATIONS
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FF385C] rounded-full" />
            </h2>
          </div>

          {/* 10 Grid Items (2 rows of 5 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-10">
            {destinations.map((dest, idx) => (
              <div
                key={idx}
                onClick={onExploreActivities}
                className="group relative h-[180px] sm:h-[210px] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base sm:text-lg leading-tight">{dest.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">{dest.experiences}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Explore All Destinations Pill Button */}
          <div className="text-center">
            <button
              onClick={onExploreActivities}
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3 rounded-full shadow-sm text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </section>
      </ScrollReveal>

      {/* ================= CTA BANNER SECTION ================= */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="relative bg-slate-900 text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch min-h-[260px]">
            
            {/* Left Solid Red Container with Top-Right Curved Corner */}
            <div className="relative w-full md:w-[58%] bg-[#FF385C] p-8 sm:p-10 lg:p-12 z-10 flex flex-col justify-center md:rounded-tr-[80px] lg:rounded-tr-[100px] shrink-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 sm:mb-4 text-white">
                Ready to explore the world?
              </h2>
              <p className="text-white/95 text-xs sm:text-sm lg:text-base max-w-md mb-6 sm:mb-8 leading-relaxed font-medium">
                Find the best attractions, tours and activities and make your next trip unforgettable.
              </p>
              <div>
                <button
                  onClick={onExploreActivities}
                  className="inline-flex items-center gap-2.5 bg-white text-[#FF385C] hover:bg-slate-50 font-bold px-6 sm:px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="w-4 h-4 text-[#FF385C]" />
                </button>
              </div>
            </div>

            {/* Right Image Fill */}
            <div className="relative w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[48%] lg:w-[50%] h-[220px] md:h-auto overflow-hidden z-0">
              <img
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1000"
                alt="Couple standing on a cliff overlooking Horseshoe Bend canyon and winding river"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}

