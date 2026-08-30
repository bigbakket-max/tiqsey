import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  RotateCcw,
  Compass,
  Sparkles,
  MapPin,
  Globe,
  X,
  ChevronDown,
  Zap,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import { getDisplayProductId } from "../utils/productIdGenerator";
import AttractionCard from "./AttractionCard";
import AttractionCardSkeleton from "./AttractionCardSkeleton";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";

interface Props {
  onBackToHome: () => void;
  onViewAttraction: (id: string) => void;
}

export default function AttractionsAndMuseumsPage({
  onBackToHome,
  onViewAttraction,
}: Props) {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "price-asc" | "price-desc"
  >("popularity");

  const [rev, setRev] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedRegion, selectedCity, sortBy, rev]);

  React.useEffect(() => {
    const handleUpdate = () => {
      setRev(prev => prev + 1);
    };
    window.addEventListener("tiqsey_attractions_updated", handleUpdate);
    return () => window.removeEventListener("tiqsey_attractions_updated", handleUpdate);
  }, []);

  // Dynamically extract categories and cities from POPULAR_ATTRACTIONS
  const categories = useMemo(() => {
    const cats = new Set(
      POPULAR_ATTRACTIONS.map((a) => a.category).filter(Boolean),
    );
    return ["All", ...Array.from(cats)];
  }, [rev]);

  const regions = useMemo(() => {
    const regs = new Set(
      POPULAR_ATTRACTIONS.map((a) => a.region).filter(Boolean),
    );
    return ["All", ...Array.from(regs)];
  }, [rev]);

  const cities = useMemo(() => {
    const filteredByRegion =
      selectedRegion === "All"
        ? POPULAR_ATTRACTIONS
        : POPULAR_ATTRACTIONS.filter((a) => a.region === selectedRegion);
    const cits = new Set(filteredByRegion.map((a) => a.city).filter(Boolean));
    return ["All", ...Array.from(cits)];
  }, [selectedRegion, rev]);

  // Filter and sort attractions automatically
  const filteredAndSortedAttractions = useMemo(() => {
    let result = [...POPULAR_ATTRACTIONS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description || "").toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          getDisplayProductId(a).toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== "All") {
      result = result.filter((a) => a.region === selectedRegion);
    }

    // City filter
    if (selectedCity !== "All") {
      result = result.filter((a) => a.city === selectedCity);
    }

    // Sort
    result.sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "popularity":
        default:
          return (
            (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) ||
            b.reviewsCount - a.reviewsCount
          );
      }
    });

    return result;
  }, [searchQuery, selectedCategory, selectedRegion, selectedCity, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedCity("All");
    setSortBy("popularity");
  };

  const seoTitle = useMemo(() => {
    let titleStr = "";
    if (selectedCategory !== "All") {
      titleStr += `${selectedCategory} `;
    } else {
      titleStr += "Top Attractions & Museums ";
    }

    if (selectedCity !== "All") {
      titleStr += `in ${selectedCity} `;
    } else if (selectedRegion !== "All") {
      titleStr += `in ${selectedRegion} `;
    } else {
      titleStr += "Worldwide ";
    }

    return `${titleStr.trim()} | Tiqsey`;
  }, [selectedCategory, selectedCity, selectedRegion]);

  const seoDescription = useMemo(() => {
    const categoryPart = selectedCategory !== "All" ? selectedCategory.toLowerCase() : "attractions, museums, tours, and activities";
    const locationPart = selectedCity !== "All" ? `in ${selectedCity}` : (selectedRegion !== "All" ? `in ${selectedRegion}` : "around the world");
    return `Discover and book top-rated ${categoryPart} ${locationPart} with Tiqsey. Save time with skip-the-line tickets and best price guarantee.`;
  }, [selectedCategory, selectedCity, selectedRegion]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 pb-20 pt-8 transition-colors duration-300">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back action */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
              Explore the World
            </span>
            <span className="text-sm font-black text-[#1A2B48] dark:text-slate-200">
              All Experiences in One Place
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div id="hero-banner-container" className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-10 md:p-14 mb-8 shadow-lg border border-slate-200/10">
          <div id="hero-banner-background" className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-60 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="relative z-10 max-w-4xl text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 leading-tight">
              Explore the world's best attractions & experiences
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6 max-w-2xl">
              Book tickets for top attractions, tours and activities across 30+ countries.
            </p>

            {/* Centered / Left-aligned Search Pill */}
            <div id="hero-search-pill" className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-lg border border-slate-200/10 flex flex-col sm:flex-row items-stretch sm:items-center mb-6 gap-2 sm:gap-0 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <div className="flex items-center flex-1 min-w-0 pl-4">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search attractions, cities or activities..."
                  className="w-full pl-3 pr-4 py-2 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors mr-2 cursor-pointer select-none"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                className="bg-[#E51937] hover:bg-[#c4132b] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 shrink-0"
              >
                Search
              </button>
            </div>

            {/* Trust Bar Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10 w-full max-w-4xl">
              <div className="flex items-center gap-2.5 text-left text-white/90">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Instant Confirmation</h4>
                  <p className="text-[10px] text-white/60">Get e-tickets instantly</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-left text-white/90">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Free Cancellation</h4>
                  <p className="text-[10px] text-white/60">Up to 24 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left text-white/90">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Best Price Guarantee</h4>
                  <p className="text-[10px] text-white/60">We match the price</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left text-white/90">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Secure Booking</h4>
                  <p className="text-[10px] text-white/60">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Modern Inline Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-1">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none active:scale-95 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
            {(selectedRegion !== "All" || selectedCity !== "All" || selectedCategory !== "All" || searchQuery) && (
              <span className="w-2 h-2 rounded-full bg-[#E51937] animate-pulse" />
            )}
          </button>

          {/* Region Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCity("All");
              }}
              className="appearance-none pl-5 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none shadow-xs"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "All" ? "Regions" : region}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* City Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none pl-5 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none shadow-xs"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "All" ? "Destinations" : city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-5 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none shadow-xs"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "Categories" : category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Active Reset helper badge */}
          {(selectedRegion !== "All" || selectedCity !== "All" || selectedCategory !== "All" || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-[#E51937] hover:underline cursor-pointer select-none ml-2 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Sort By Aligned Right */}
          <div className="flex items-center gap-2 sm:ml-auto ml-0 mt-2 sm:mt-0 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none pl-5 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none shadow-xs w-full sm:w-auto"
              >
                <option value="popularity">Recommended</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Counter & Clear state */}
        <div className="flex items-center justify-between mb-6 select-none">
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
            Showing{" "}
            <span className="text-brand font-extrabold">
              {filteredAndSortedAttractions.length}
            </span>{" "}
            out of{" "}
            <span className="text-slate-800 dark:text-slate-100 font-extrabold">
              {POPULAR_ATTRACTIONS.length}
            </span>{" "}
            listed experiences
          </p>
          {(searchQuery ||
            selectedCategory !== "All" ||
            selectedRegion !== "All" ||
            selectedCity !== "All") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer select-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Grid List with Animation */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <AttractionCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredAndSortedAttractions.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAndSortedAttractions.map((attr, idx) => (
                <motion.div
                  key={attr.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                >
                  <AttractionCard attr={attr} onClick={onViewAttraction} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-12 text-center max-w-md mx-auto mt-12"
            >
              <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-black text-[#1A2B48] dark:text-slate-200 mb-2">
                No matching experiences
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                We couldn't find any activities matching your filters. Try
                adjusting your search query or choosing another category or
                city.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer select-none"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
