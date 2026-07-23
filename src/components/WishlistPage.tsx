import React, { useState, useMemo } from "react";
import {
  Heart,
  Trash2,
  ArrowLeft,
  Share2,
  Sparkles,
  MapPin,
  Flame,
  Clock,
  Compass,
  Check,
  Tag,
  Grid,
  ChevronDown,
  Copy,
  Link,
  Plus,
  Globe,
  Map,
  Lock,
} from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { getDisplayProductId } from "../utils/productIdGenerator";
import { useSettings } from "../contexts/SettingsContext";
import { useAuth } from "../contexts/AuthContext";
import { Attraction } from "../types";
import AttractionCard from "./AttractionCard";
import AttractionCardSkeleton from "./AttractionCardSkeleton";
import { motion, AnimatePresence } from "motion/react";
import { POPULAR_ATTRACTIONS } from "../data/mockData";

interface WishlistPageProps {
  onBackToHome: () => void;
  onNavigateToAttractions: () => void;
  onViewAttraction: (id: string) => void;
  onNavigateToSignIn: () => void;
}

export default function WishlistPage({
  onBackToHome,
  onNavigateToAttractions,
  onViewAttraction,
  onNavigateToSignIn,
}: WishlistPageProps) {
  const { user } = useAuth();
  const { wishlist, clearWishlist, toggleWishlist } = useWishlist();
  const { formatPrice, t } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "rating">("name");
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, selectedCategory, selectedRegion, selectedDestination, sortBy]);

  // Check if viewing a shared wishlist via URL query parameters
  const sharedItemsParam = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("items");
    } catch (e) {
      return null;
    }
  }, []);

  // Compute shared attractions list from global attraction data
  const sharedAttractions = useMemo(() => {
    if (!sharedItemsParam) return [];
    const ids = sharedItemsParam.split(",");
    return ids
      .map((id) => POPULAR_ATTRACTIONS.find((a) => a.id === id))
      .filter((a): a is Attraction => !!a);
  }, [sharedItemsParam]);

  // Track if we are viewing the shared list or our own
  const [isViewingShared, setIsViewingShared] = useState(!!sharedItemsParam && sharedAttractions.length > 0);

  // Toggle active wishlist source
  const activeWishlist = isViewingShared ? sharedAttractions : wishlist;

  // Helpers to safely extract region and destination from an attraction
  const getItemRegion = (item: Attraction): string => {
    if (item.region) return item.region;
    const country = item.location.split(',').pop()?.trim() || "";
    if (["Netherlands", "Portugal", "Spain", "Italy", "France", "United Kingdom", "UK", "Germany", "Switzerland"].includes(country)) {
      return "Europe";
    }
    if (["Singapore", "Thailand", "Japan", "Vietnam", "United Arab Emirates", "UAE", "Dubai"].includes(country)) {
      return "Asia";
    }
    if (["Australia", "New Zealand"].includes(country)) {
      return "Oceania";
    }
    if (["USA", "United States", "Canada", "Brazil", "Peru", "Mexico"].includes(country)) {
      return "The Americas";
    }
    if (["Egypt", "South Africa", "Morocco", "Kenya"].includes(country)) {
      return "Africa";
    }
    return "Other";
  };

  const getItemDestination = (item: Attraction): string => {
    return item.location.split(',').pop()?.trim() || "Other";
  };

  // Dynamically extract unique values for filters from active wishlist items
  const regions = useMemo(() => {
    const list = activeWishlist.map((item) => getItemRegion(item));
    return ["All", ...Array.from(new Set(list))];
  }, [activeWishlist]);

  const destinations = useMemo(() => {
    const list = activeWishlist.map((item) => getItemDestination(item));
    return ["All", ...Array.from(new Set(list))];
  }, [activeWishlist]);

  const cities = useMemo(() => {
    const list = activeWishlist.map((item) => item.city);
    return ["All", ...Array.from(new Set(list))];
  }, [activeWishlist]);

  const categories = useMemo(() => {
    const list = activeWishlist.map((item) => item.category);
    return ["All", ...Array.from(new Set(list))];
  }, [activeWishlist]);

  // Calculations for Saved Stats Panel
  const stats = useMemo(() => {
    let totalOriginal = 0;
    let totalDiscounted = 0;
    let savings = 0;
    let hotDealsCount = 0;

    activeWishlist.forEach((item) => {
      totalOriginal += item.price;
      if (item.discountPrice) {
        totalDiscounted += item.discountPrice;
        savings += item.price - item.discountPrice;
        hotDealsCount++;
      } else {
        totalDiscounted += item.price;
      }
    });

    return {
      totalOriginal,
      totalDiscounted,
      savings,
      hotDealsCount,
    };
  }, [activeWishlist]);

  // Fallback copying function for browser/iframe security restrictions
  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  // Construct URL with actual saved attraction IDs and copy to clipboard
  const handleShare = () => {
    try {
      const ids = wishlist.map((item) => item.id).join(",");
      const shareUrl = `${window.location.origin}/wishlist?items=${encodeURIComponent(ids)}`;
      
      setShareLink(shareUrl);
      setShowShareModal(true);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          })
          .catch((err) => {
            console.warn("Clipboard API blocked, running fallback", err);
            fallbackCopy(shareUrl);
          });
      } else {
        fallbackCopy(shareUrl);
      }
    } catch (e) {
      console.error("Failed to share wishlist", e);
    }
  };

  // Save all shared items to local wishlist and switch to local view
  const handleImportShared = () => {
    sharedAttractions.forEach((item) => {
      if (!wishlist.some((w) => w.id === item.id)) {
        toggleWishlist(item);
      }
    });
    setIsViewingShared(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("items");
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Dismiss shared view and view own local wishlist
  const handleViewOwn = () => {
    setIsViewingShared(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("items");
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...activeWishlist];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
          getDisplayProductId(item).toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }

    // Region filter
    if (selectedRegion !== "All") {
      items = items.filter((item) => getItemRegion(item) === selectedRegion);
    }

    // Destination filter
    if (selectedDestination !== "All") {
      items = items.filter((item) => getItemDestination(item) === selectedDestination);
    }

    // City filter
    if (selectedCity !== "All") {
      items = items.filter((item) => item.city === selectedCity);
    }

    // Category filter
    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Sort
    items.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

    return items;
  }, [activeWishlist, searchQuery, selectedCity, selectedCategory, selectedRegion, selectedDestination, sortBy]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] dark:bg-slate-950 transition-colors duration-300 font-sans pb-16 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-[#e3000f] rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In Required
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Please sign in to your Tiqsey account to access and sync your saved wishlist items across all devices.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={onNavigateToSignIn}
              className="w-full py-3 px-5 bg-[#e3000f] hover:bg-[#c2000d] text-white font-bold rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
              id="wishlist-signin-btn"
            >
              Sign In
            </button>
            <button
              onClick={onBackToHome}
              className="w-full py-3 px-5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
              id="wishlist-back-btn"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-slate-950 transition-colors duration-300 font-sans pb-16">
      {/* Header section with ambient glow */}
      <div className="relative bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 pt-8 pb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-[300px] h-[200px] bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToHome}
              className="group flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 uppercase tracking-widest transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </button>

            {wishlist.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-xs cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share List</span>
                    </>
                  )}
                </button>

                {!isViewingShared && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-[#e3000f] dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all border border-rose-100/60 dark:border-rose-900/40 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100/50 dark:border-rose-900/30">
                  <Heart className="w-5 h-5 text-[#e3000f] fill-[#e3000f]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#e3000f] bg-rose-50/60 dark:bg-rose-950/20 px-2.5 py-1 rounded-md">
                  {isViewingShared ? "Shared Collection" : "Saved Collections"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                {isViewingShared ? "Shared Wishlist" : "Your Saved Wishlist"}
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                {isViewingShared
                  ? "Compare and explore these amazing tours, museum tickets, and adventure activities shared with you."
                  : "Compare and keep track of your favorite tours, museum tickets, and adventure activities across the globe."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-850 select-none">
              <div className="flex flex-col items-end pr-3 border-r border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Saved
                </span>
                <span className="text-xl font-black text-slate-850 dark:text-slate-150">
                  {activeWishlist.length} Items
                </span>
              </div>
              <div className="flex flex-col pl-1.5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Unique Cities
                </span>
                <span className="text-xl font-black text-[#e3000f]">
                  {Math.max(0, cities.length - 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mt-10">
        <AnimatePresence>
          {activeWishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-16 text-center shadow-sm border border-slate-100 dark:border-slate-850 flex flex-col items-center max-w-3xl mx-auto mt-6"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
                  <Heart className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                </div>
                <div className="absolute -top-1 -right-1 bg-brand text-white p-1.5 rounded-full shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-slate-150 tracking-tight">
                Your wishlist is waiting to be filled
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 max-w-md leading-relaxed">
                Unlock unforgettable experiences. Tap the heart icon on attractions and we'll save them right here so you can plan, book, and compare side-by-side.
              </p>

              <button
                onClick={onNavigateToAttractions}
                className="mt-8 px-6 h-12 bg-brand text-white text-[13.5px] font-black uppercase tracking-wider rounded-xl hover:bg-opacity-95 shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Top Attractions</span>
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Shared Wishlist Welcome Banner */}
              {isViewingShared && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-850 dark:text-slate-150 uppercase tracking-wider">
                        📬 Shared Wishlist Received
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        A friend has shared this list of <span className="font-extrabold text-amber-600 dark:text-amber-400">{sharedAttractions.length} hand-picked activities</span> with you. You can compare them, save them to your own list, or search your own.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    <button
                      onClick={handleImportShared}
                      className="flex-1 md:flex-none h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#e3000f] hover:bg-opacity-90 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save to My Wishlist</span>
                    </button>
                    <button
                      onClick={handleViewOwn}
                      className="flex-1 md:flex-none h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                    >
                      <span>View My Own List</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Statistics Banner */}
              {stats.savings > 0 && (
                <div className="bg-[#e3000f] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl shrink-0">
                      <Flame className="w-6 h-6 fill-white stroke-none animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block">
                        Potential Discount Savings
                      </span>
                      <span className="text-3xl sm:text-4xl font-black mt-0.5 block">
                        {formatPrice(stats.savings, "EUR")}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 font-medium max-w-xl relative z-10 leading-relaxed">
                    You saved money on <span className="font-extrabold text-white underline decoration-2 decoration-white/55 underline-offset-4">{stats.hotDealsCount} hot deals</span> in your list! Book today before these exclusive discounts expire.
                  </p>
                </div>
              )}

              {/* Horizontal Filters Panel */}
              <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/60 shadow-xs select-none">
                {/* Row 1: Search Input + Sorting */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-2">
                  <div className="w-full md:flex-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      SEARCH SAVED
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type city or attraction name..."
                      className="w-full h-11 px-4 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                    />
                  </div>

                  <div className="flex flex-col w-full md:w-auto md:min-w-[240px]">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      SORT BY
                    </label>
                    <div className="relative h-11">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="appearance-none w-full h-full pl-4 pr-10 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 cursor-pointer transition-all"
                      >
                        <option value="name">Name (A-Z)</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Rating: High to Low</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-4" />

                {/* Row 2: Secondary Dropdown Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Region filter */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      FILTER BY REGIONS
                    </label>
                    <div className="relative h-11">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full h-full pl-10 pr-10 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 cursor-pointer appearance-none transition-all"
                      >
                        {regions.map((region, idx) => (
                          <option key={idx} value={region} className="font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                            {region === "All" ? "All Regions" : region}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Destination filter */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      FILTER BY DESTINATIONS
                    </label>
                    <div className="relative h-11">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Map className="w-4 h-4" />
                      </div>
                      <select
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        className="w-full h-full pl-10 pr-10 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 cursor-pointer appearance-none transition-all"
                      >
                        {destinations.map((dest, idx) => (
                          <option key={idx} value={dest} className="font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                            {dest === "All" ? "All Destinations" : dest}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      FILTER BY CATEGORY
                    </label>
                    <div className="relative h-11">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Tag className="w-4 h-4" />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-full pl-10 pr-10 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 cursor-pointer appearance-none transition-all"
                      >
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat} className="font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                            {cat === "All" ? "All Categories" : cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* City filter */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      FILTER BY CITY
                    </label>
                    <div className="relative h-11">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full h-full pl-10 pr-10 text-xs font-bold bg-[#e3000f]/5 border border-[#e3000f]/10 dark:bg-slate-950 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-slate-800 dark:text-slate-100 cursor-pointer appearance-none transition-all"
                      >
                        {cities.map((city, idx) => (
                          <option key={idx} value={city} className="font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                            {city === "All" ? "All Cities" : city}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Grid and Status Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Showing {filteredAndSortedItems.length} of {wishlist.length} saved items
                  </span>

                  {(selectedCity !== "All" || selectedCategory !== "All" || selectedRegion !== "All" || selectedDestination !== "All" || searchQuery.trim()) && (
                    <button
                      onClick={() => {
                        setSelectedCity("All");
                        setSelectedCategory("All");
                        setSelectedRegion("All");
                        setSelectedDestination("All");
                        setSearchQuery("");
                      }}
                      className="text-xs font-black text-brand uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
                    {Array.from({ length: Math.max(4, filteredAndSortedItems.length || 4) }).map((_, i) => (
                      <AttractionCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredAndSortedItems.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-850">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      No saved items match your active search filters.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCity("All");
                        setSelectedCategory("All");
                        setSelectedRegion("All");
                        setSelectedDestination("All");
                        setSearchQuery("");
                      }}
                      className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#e3000f]/10 hover:text-[#e3000f] transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedItems.map((item) => (
                      <div key={item.id} className="h-full">
                        <AttractionCard
                          attr={item}
                          onClick={onViewAttraction}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal for Clearing All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div
            onClick={() => setShowClearConfirm(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn font-sans">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Clear saved favorites?
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              This will remove all items currently saved in your catalog. You won't be able to recover them unless you re-add them.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearWishlist();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#e3000f] hover:bg-opacity-90 shadow-sm transition-all cursor-pointer"
              >
                Clear Entire List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 animate-fadeIn">
          <div
            onClick={() => setShowShareModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 font-sans z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e3000f]/10 dark:bg-red-950/40 text-[#e3000f] rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                    Share Your Wishlist
                  </h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    Curated travel collection
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              Anyone with this link can view your hand-picked selection of activities and attractions in real-time. Copy and share it via your favorite chat apps or social media!
            </p>

            {/* Input field with Copy Button */}
            <div className="relative flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl">
              <div className="flex items-center gap-1.5 pl-2 text-slate-400 shrink-0 select-none">
                <Link className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={shareLink}
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                className="w-full bg-transparent border-none text-xs font-mono font-medium text-slate-600 dark:text-slate-350 focus:outline-none py-1 select-all"
              />
              <button
                onClick={() => {
                  fallbackCopy(shareLink);
                }}
                className="h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#e3000f] hover:bg-opacity-95 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Hint message */}
            <div className="flex items-start gap-2 bg-[#e3000f]/5 border border-[#e3000f]/10 p-3.5 rounded-2xl mt-4">
              <Sparkles className="w-4 h-4 text-[#e3000f] shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-normal">
                <span className="font-bold text-[#e3000f]">Pro-Tip:</span> Opening this link on any device will allow instant comparison of prices, reviews, and duration, with one-tap backup to that device's local wishlist.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
