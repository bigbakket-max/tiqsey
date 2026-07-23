import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  RotateCcw,
  Flame,
  Sparkles,
  MapPin,
  Star,
  Percent,
  X,
  Globe,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { useWishlist } from "../contexts/WishlistContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import { getDisplayProductId } from "../utils/productIdGenerator";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onBackToHome: () => void;
  onViewAttraction: (id: string) => void;
}

export default function HotDealsPage({
  onBackToHome,
  onViewAttraction,
}: Props) {
  const { t, formatPrice } = useSettings();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "discount-desc" | "price-asc" | "price-desc" | "rating"
  >("discount-desc");

  const [rev, setRev] = useState(0);

  React.useEffect(() => {
    const handleUpdate = () => {
      setRev(prev => prev + 1);
    };
    window.addEventListener("tiqsey_attractions_updated", handleUpdate);
    return () => window.removeEventListener("tiqsey_attractions_updated", handleUpdate);
  }, []);

  // Filter only Hot Deals (discounted items)
  const hotDealsList = useMemo(() => {
    return POPULAR_ATTRACTIONS.filter(
      (attr) => attr.discountPrice && attr.discountPrice < attr.price,
    );
  }, [rev]);

  // Extract categories, regions and cities specifically from hot deals
  const categories = useMemo(() => {
    const cats = new Set(hotDealsList.map((a) => a.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [hotDealsList]);

  const regions = useMemo(() => {
    const regs = new Set(hotDealsList.map((a) => a.region).filter(Boolean));
    return ["All", ...Array.from(regs)];
  }, [hotDealsList]);

  const cities = useMemo(() => {
    const filteredByRegion =
      selectedRegion === "All"
        ? hotDealsList
        : hotDealsList.filter((a) => a.region === selectedRegion);
    const cits = new Set(filteredByRegion.map((a) => a.city).filter(Boolean));
    return ["All", ...Array.from(cits)];
  }, [hotDealsList, selectedRegion]);

  // Ticket limits/stock remaining keyed deterministically by attraction ID
  const ticketLimits = useMemo(() => {
    const map: Record<string, number> = {};
    hotDealsList.forEach((attr) => {
      const num = 2 + (attr.id.charCodeAt(0) % 6);
      map[attr.id] = num;
    });
    return map;
  }, [hotDealsList]);

  // Filter & sort
  const filteredAndSortedDeals = useMemo(() => {
    let result = [...hotDealsList];

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
      const savedA = a.price - priceA;
      const savedB = b.price - priceB;
      const ratioA = (savedA / a.price) * 100;
      const ratioB = (savedB / b.price) * 100;

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return b.rating - a.rating;
        case "discount-desc":
        default:
          return ratioB - ratioA; // Highest discount percentage first
      }
    });

    return result;
  }, [
    hotDealsList,
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedCity,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedCity("All");
    setSortBy("discount-desc");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-white pb-20 pt-8 transition-colors duration-300 relative overflow-hidden">
      {/* Golden/Orange Ambient glow backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] dark:bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-yellow-500/[0.03] dark:bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb & Back action */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm shadow-sm hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block mb-0.5">
              EXCLUSIVE DEALS
            </span>
            <span className="text-sm font-black text-slate-500 dark:text-zinc-400">
              Save up to 50% On Entry Passes
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50 dark:from-zinc-900/80 dark:via-amber-950/15 dark:to-zinc-900 border border-amber-100/70 dark:border-amber-500/15 p-8 sm:p-12 md:p-16 mb-10 shadow-[0_10px_30px_rgba(245,158,11,0.03)] dark:shadow-[0_20px_50px_rgba(245,158,11,0.08)]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-10 dark:opacity-10" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/30 rounded-full text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-4">
              <Flame className="w-3.5 h-3.5 animate-bounce fill-amber-500 stroke-none" />
              <span>Limited Stock remaining</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 dark:from-amber-200 dark:via-amber-300 dark:to-yellow-400">
              Hot Deals & Special Offers
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base font-medium leading-relaxed mb-0">
              Instantly secure top attraction passes, historic tours, and
              skip-the-line entries. These special pricing deals are
              automatically compiled, loaded in real-time, and refreshed as new
              promotional inventory is released.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Filters Panel */}
        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-850 rounded-2xl p-5 mb-8 shadow-sm flex flex-col gap-5">
          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-zinc-500 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hot deals by name, tour description, city, or category..."
                className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl font-medium border border-slate-200 dark:border-zinc-800 focus:border-amber-500/40 dark:focus:border-amber-500/40 focus:outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer select-none"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest shrink-0 select-none">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Sort Deals:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-100 font-bold border border-slate-200 dark:border-zinc-800 rounded-xl focus:border-amber-500/40 dark:focus:border-amber-500/40 focus:outline-none transition-colors text-sm cursor-pointer"
              >
                <option value="discount-desc">Highest Discount First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated First</option>
              </select>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Region Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-0.5 flex items-center gap-1.5 select-none">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter by Region:</span>
              </span>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCity("All"); // Reset city when region changes
                }}
                className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-100 font-bold border border-slate-200 dark:border-zinc-800 rounded-xl focus:border-amber-500/40 dark:focus:border-amber-500/40 focus:outline-none transition-colors text-sm cursor-pointer w-full"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "All" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-0.5 flex items-center gap-1.5 select-none">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter by Destination:</span>
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-100 font-bold border border-slate-200 dark:border-zinc-800 rounded-xl focus:border-amber-500/40 dark:focus:border-amber-500/40 focus:outline-none transition-colors text-sm cursor-pointer w-full"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === "All" ? "All Destinations" : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-0.5 flex items-center gap-1.5 select-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Filter by Deal Category:</span>
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-100 font-bold border border-slate-200 dark:border-zinc-800 rounded-xl focus:border-amber-500/40 dark:focus:border-amber-500/40 focus:outline-none transition-colors text-sm cursor-pointer w-full"
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

        {/* Counter Bar & Reset */}
        <div className="flex items-center justify-between mb-6 select-none">
          <p className="text-slate-600 dark:text-zinc-400 font-bold text-sm">
            Found{" "}
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">
              {filteredAndSortedDeals.length}
            </span>{" "}
            hot deals out of{" "}
            <span className="text-slate-800 dark:text-zinc-200 font-extrabold">
              {hotDealsList.length}
            </span>{" "}
            listed offers
          </p>
          {(searchQuery ||
            selectedCategory !== "All" ||
            selectedRegion !== "All" ||
            selectedCity !== "All") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer select-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Deals Grid with animations */}
        <AnimatePresence mode="popLayout">
          {filteredAndSortedDeals.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAndSortedDeals.map((attr, idx) => {
                const discountRatio = attr.discountPrice
                  ? Math.round(
                      ((attr.price - attr.discountPrice) / attr.price) * 100,
                    )
                  : 0;
                const savedAmount = attr.discountPrice
                  ? attr.price - attr.discountPrice
                  : 0;
                const limit = ticketLimits[attr.id] || 4;

                return (
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
                    className="group relative bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-850 hover:border-amber-500/30 dark:hover:border-amber-500/30 rounded-2xl overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-[0_15px_30px_rgba(245,158,11,0.06)] transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Top image & sticker badges */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={attr.imageUrl}
                        alt={attr.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />

                      {/* Percent Tag */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                        <Percent className="w-2.5 h-2.5 text-black" />
                        <span>SAVE {discountRatio}%</span>
                      </div>

                      {/* Heart Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(attr);
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center border border-slate-100 dark:border-zinc-800 hover:bg-rose-500 hover:border-transparent text-slate-600 dark:text-zinc-300 transition-all active:scale-90"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isWishlisted(attr.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          className={`w-4 h-4 ${isWishlisted(attr.id) ? "text-rose-500 fill-rose-500 stroke-none" : ""}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Info Card block */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Sub headers */}
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500/80 mb-1">
                          <span>{attr.city}</span>
                          <span>•</span>
                          <span>{attr.category}</span>
                        </div>

                        {/* Heading */}
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 h-[2.5rem]">
                          {attr.name}
                        </h3>

                        {/* Rating block */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-2 mb-3">
                          <div className="flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                            <span>{attr.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">
                            ({attr.reviewsCount?.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Divider and price / action row */}
                      <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest line-through">
                            Reg. {formatPrice(attr.price, attr.currency)}
                          </span>
                          <span className="text-base font-black text-amber-600 dark:text-amber-400 leading-none mt-1">
                            {formatPrice(attr.discountPrice || attr.price, attr.currency)}
                          </span>
                        </div>

                        <button
                          onClick={() => onViewAttraction(attr.id)}
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          Unlock Deal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-12 text-center max-w-md mx-auto mt-12 shadow-sm"
            >
              <Flame className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-black text-slate-700 dark:text-zinc-300 mb-2">
                No active discount offers found
              </h3>
              <p className="text-slate-500 dark:text-zinc-500 text-sm mb-6 leading-relaxed">
                Try adjusting your search query or choosing another destination
                or activity category.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
