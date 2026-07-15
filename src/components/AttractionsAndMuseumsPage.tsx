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
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
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
          a.category.toLowerCase().includes(q),
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
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 mb-10 shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-20" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-brand text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Access Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Attractions & Museums
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed mb-0">
              Browse, filter, and lock in all premium entry passes, private
              museum visits, skip-the-line bookings, and incredible city
              adventures. All listed experiences are automatically compiled here
              in real-time.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 p-5 mb-8 shadow-xs flex flex-col gap-5">
          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by attraction name, description, city, or category..."
                className="w-full pl-11 pr-11 py-2.5 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl font-medium border border-slate-200 dark:border-slate-800/80 focus:border-brand/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm focus:ring-2 focus:ring-brand/10 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer select-none"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-row gap-3 items-center">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 select-none">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>SORT BY:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold border border-slate-200 dark:border-slate-800/80 rounded-xl focus:border-brand/40 focus:outline-none transition-all text-sm cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Region Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 select-none">
                <Globe className="w-3.5 h-3.5" />
                <span>FILTER BY REGION:</span>
              </span>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCity("All"); // Reset city when region changes
                }}
                className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-800/80 rounded-xl focus:border-brand/40 focus:outline-none transition-all text-sm cursor-pointer w-full"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "All" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 select-none">
                <MapPin className="w-3.5 h-3.5" />
                <span>FILTER BY DESTINATION:</span>
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-800/80 rounded-xl focus:border-brand/40 focus:outline-none transition-all text-sm cursor-pointer w-full"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === "All" ? "All Destinations" : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 select-none">
                <Compass className="w-3.5 h-3.5" />
                <span>FILTER BY CATEGORY:</span>
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-800/80 rounded-xl focus:border-brand/40 focus:outline-none transition-all text-sm cursor-pointer w-full"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
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
