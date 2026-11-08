import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Landmark,
  X,
  Clock,
  Trash2,
  Star,
  MapPin,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { POPULAR_ATTRACTIONS, DESTINATIONS, deduplicateAttractions } from "../data/mockData";
import { getDisplayProductId } from "../utils/productIdGenerator";
import { useSettings } from "../contexts/SettingsContext";
import { calculateMatchScore } from "../utils/fuzzySearch";
import { Attraction, Destination } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectAttraction?: (id: string) => void;
  isCompact?: boolean;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  realTime?: boolean;
  isPageFilter?: boolean;
  currentDestination?: string;
}

type CategoryTab = "all" | "attractions" | "cities" | "activities";

const TRENDING_SEARCHES = [
  "Andamanda Waterpark",
  "Acropolis Fast Track",
  "Eiffel Tower",
  "Amsterdam Canal",
  "Ramayana Water Park",
  "Sagrada Familia",
];

const POPULAR_CITIES = [
  "Phuket",
  "Tokyo",
  "Paris",
  "Rome",
  "London",
  "Amsterdam",
  "Barcelona",
];

function SuggestionImage({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  className = "",
}: {
  src?: string;
  alt?: string;
  fallbackIcon?: any;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const Icon = FallbackIcon || Landmark;
    return (
      <div
        className={`bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 ${className}`}
      >
        <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" strokeWidth={2} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      onError={() => setError(true)}
      className={`object-cover shrink-0 ${className}`}
      loading="lazy"
    />
  );
}

export default function SearchBar({
  onSearch,
  onSelectAttraction,
  isCompact = false,
  className = "",
  placeholder,
  autoFocus = false,
  realTime = false,
  isPageFilter = false,
  currentDestination = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);
  const { formatPrice, t } = useSettings();

  // Trigger real-time search if enabled
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (realTime) {
      onSearch(searchQuery);
    }
  }, [searchQuery, realTime, onSearch]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tiqsey_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Error reading recent searches:", e);
      }
    } else {
      const defaults = ["Phuket", "Tokyo", "Paris", "Acropolis"];
      setRecentSearches(defaults);
      localStorage.setItem("tiqsey_recent_searches", JSON.stringify(defaults));
    }
  }, []);

  const saveRecentSearch = (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const updated = [
        cleaned,
        ...prev.filter((q) => q.toLowerCase() !== cleaned.toLowerCase()),
      ].slice(0, 6);
      localStorage.setItem("tiqsey_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter(
        (q) => q.toLowerCase() !== query.toLowerCase(),
      );
      if (updated.length > 0) {
        localStorage.setItem("tiqsey_recent_searches", JSON.stringify(updated));
      } else {
        localStorage.removeItem("tiqsey_recent_searches");
      }
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("tiqsey_recent_searches");
  };

  // Fuzzy-filtered Destinations
  const matchedDestinations = useMemo(() => {
    if (isPageFilter || searchQuery.trim().length < 2) return [];
    const query = searchQuery.trim();

    return DESTINATIONS.map((d) => {
      const nameScore = calculateMatchScore(query, d.name);
      return {
        ...d,
        type: "destination" as const,
        score: nameScore.score,
        matched: nameScore.matched,
      };
    })
      .filter((d) => d.matched)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery, isPageFilter]);

  // Fuzzy-filtered Attractions
  const matchedAttractions = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const query = searchQuery.trim();
    const cleanList = deduplicateAttractions(POPULAR_ATTRACTIONS);

    return cleanList
      .map((a) => {
        const prodId = getDisplayProductId(a);
        const nameScore = calculateMatchScore(query, a.name, `${a.city} ${a.location}`);
        const categoryScore = calculateMatchScore(query, a.category);
        const prodIdScore = prodId.includes(query) ? 95 : 0;
        const bestScore = Math.max(nameScore.score, categoryScore.score, prodIdScore);
        const isMatch = nameScore.matched || categoryScore.matched || prodIdScore > 0;

        // Check activity classification
        const isActivityType =
          /tour|cruise|boat|outdoor|safari|adventure|food|cooking|walk|kayak|snorkel|dive/i.test(
            `${a.category} ${a.name}`,
          );

        return {
          ...a,
          type: "attraction" as const,
          subType: isActivityType ? ("activity" as const) : ("attraction" as const),
          score: bestScore,
          matched: isMatch,
        };
      })
      .filter((a) => {
        if (!a.matched) return false;
        if (isPageFilter && currentDestination) {
          const destLower = currentDestination.toLowerCase();
          return (
            a.city.toLowerCase() === destLower ||
            a.location.toLowerCase().includes(destLower) ||
            destLower.includes(a.city.toLowerCase())
          );
        }
        return true;
      })
      .sort((a, b) => b.score - a.score || (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }, [searchQuery, isPageFilter, currentDestination]);

  // Tab counts
  const counts = useMemo(() => {
    const citiesCount = matchedDestinations.length;
    const attractionsOnlyCount = matchedAttractions.filter((a) => a.subType === "attraction").length;
    const activitiesCount = matchedAttractions.filter((a) => a.subType === "activity").length;
    const totalCount = citiesCount + matchedAttractions.length;

    return {
      all: totalCount,
      attractions: attractionsOnlyCount,
      cities: citiesCount,
      activities: activitiesCount,
    };
  }, [matchedDestinations, matchedAttractions]);

  // Filtered list based on active category tab
  const displayedSuggestions = useMemo(() => {
    if (activeTab === "cities") {
      return matchedDestinations.slice(0, 10);
    }
    if (activeTab === "attractions") {
      return matchedAttractions.filter((a) => a.subType === "attraction").slice(0, 10);
    }
    if (activeTab === "activities") {
      return matchedAttractions.filter((a) => a.subType === "activity").slice(0, 10);
    }
    // "all": Top mixed results
    return [...matchedDestinations.slice(0, 3), ...matchedAttractions.slice(0, 7)];
  }, [activeTab, matchedDestinations, matchedAttractions]);

  // Debounced search indicator
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Click outside and escape handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      saveRecentSearch(trimmed);
    }

    if (selectedIndex >= 0 && displayedSuggestions.length > 0) {
      const selected = displayedSuggestions[selectedIndex];
      handleSuggestionClick(selected);
      return;
    }

    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(trimmed);
  };

  const handleSuggestionClick = (item: any) => {
    saveRecentSearch(item.name);
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setIsFocused(false);

    if (item.type === "destination") {
      onSearch(item.name);
    } else if (onSelectAttraction && item.id) {
      onSelectAttraction(item.id);
    } else {
      onSearch(item.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < displayedSuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const highlightText = (text: string | undefined, query: string) => {
    if (!text) return null;
    if (!query || !query.trim()) return text;
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <span
              key={i}
              className="text-[#e3000f] dark:text-red-400 font-extrabold bg-[#e3000f]/10 dark:bg-red-500/20 px-1 py-0.5 rounded-sm"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <form
        onSubmit={handleSearch}
        className={`relative z-30 group w-full flex items-center ${
          isCompact
            ? `${
                isPageFilter
                  ? "bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-250 dark:border-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800/80 border-slate-300/90 dark:border-slate-700 hover:border-[#e3000f]/50 dark:hover:border-[#e3000f]/50 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#e3000f] dark:focus-within:border-[#e3000f] focus-within:ring-2 focus-within:ring-[#e3000f]/15 shadow-2xs"
              } rounded-full h-10 border transition-all overflow-hidden`
            : "bg-white dark:bg-slate-900 rounded-full p-1.5 pl-6 md:pl-8 h-14 border border-[#e3000f]/40 dark:border-[#e3000f]/30 hover:border-[#e3000f] focus-within:border-[#e3000f] focus-within:ring-4 focus-within:ring-[#e3000f]/5 shadow-sm transition-all duration-300"
        }`}
      >
        {!isCompact && (
          <Search
            className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0"
            strokeWidth={2.5}
          />
        )}
        <input
          ref={inputRef}
          id={isCompact ? "compact-search-input" : "global-search-input"}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (isCompact
              ? t("searchActivitiesPlaceholder", "Search attractions, cities or activities.")
              : t("searchPlaceholder", "Search destinations, activities, tours, attractions..."))
          }
          autoFocus={autoFocus}
          className={`focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 transition-all duration-300 ease-in-out font-sans leading-normal ${
            isCompact
              ? "text-[13px] xl:text-[14px] flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-4 pr-1 py-0 h-full font-medium"
              : "w-full text-slate-900 dark:text-white text-sm md:text-base bg-transparent border-none p-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-4 font-medium"
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              onSearch("");
              inputRef.current?.focus();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-1 shrink-0"
            title="Clear search"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
        {isCompact ? (
          <div className="flex items-center pr-3 shrink-0 gap-1">
            <button
              type="submit"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5"
            >
              <Search className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="h-11 px-7 flex items-center justify-center gap-2 text-sm text-white rounded-full font-bold hover:brightness-110 transition-all bg-[#e3000f] shrink-0 shadow-md cursor-pointer"
          >
            <span>Search</span>
          </motion.button>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && (isSearching || searchQuery.trim().length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full mt-2.5 bg-white dark:bg-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-slate-200/90 dark:border-slate-800 overflow-hidden z-[999999] ${
              isCompact
                ? "right-0 w-[calc(100vw-32px)] md:w-[580px] lg:w-[620px] rounded-2xl"
                : "left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] sm:w-[540px] md:w-[640px] lg:w-[700px] rounded-[24px]"
            }`}
          >
            {isSearching ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-slate-100 dark:border-slate-800 border-t-[#e3000f] rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3.5 tracking-wide">
                  Searching live experiences...
                </p>
              </div>
            ) : searchQuery.trim().length < 2 ? (
              /* EMPTY STATE: Recent Searches & Trending / Popular Chips */
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAllRecentSearches();
                        }}
                        className="text-[11px] font-bold text-slate-400 hover:text-[#e3000f] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item, index) => (
                        <span
                          key={`recent-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer group"
                          onClick={() => {
                            setSearchQuery(item);
                            saveRecentSearch(item);
                            onSearch(item);
                            setShowSuggestions(false);
                            setIsFocused(false);
                          }}
                        >
                          <Clock className="w-3 h-3 text-slate-400 group-hover:text-[#e3000f] transition-colors" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(item);
                            }}
                            className="p-0.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-600 transition-all cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches Chips */}
                <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/20">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5 px-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#e3000f]" />
                    Trending Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((query) => (
                      <button
                        key={query}
                        type="button"
                        onClick={() => {
                          setSearchQuery(query);
                          saveRecentSearch(query);
                          onSearch(query);
                          setShowSuggestions(false);
                          setIsFocused(false);
                        }}
                        className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-[#e3000f]/60 hover:bg-[#e3000f]/5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#e3000f] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{query}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Destinations Quick Chips */}
                <div className="p-4 sm:p-5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5 px-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Popular Destinations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setSearchQuery(city);
                          saveRecentSearch(city);
                          onSearch(city);
                          setShowSuggestions(false);
                          setIsFocused(false);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-all cursor-pointer shadow-2xs"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE RESULTS STATE: Category Tabs & Rich Item Previews */
              <div>
                {/* Category Filter Tabs Bar */}
                <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "all"
                        ? "bg-[#e3000f] text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <span>All</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                      {counts.all}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("attractions")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "attractions"
                        ? "bg-[#e3000f] text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <Landmark className="w-3 h-3" />
                    <span>Attractions</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "attractions" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                      {counts.attractions}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("cities")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "cities"
                        ? "bg-[#e3000f] text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Cities</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "cities" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                      {counts.cities}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("activities")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === "activities"
                        ? "bg-[#e3000f] text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <Compass className="w-3 h-3" />
                    <span>Activities</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "activities" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                      {counts.activities}
                    </span>
                  </button>
                </div>

                {/* Suggestions List */}
                {displayedSuggestions.length > 0 ? (
                  <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                    {displayedSuggestions.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      const isDestination = (item as any).type === "destination";

                      if (isDestination) {
                        const dest = item as unknown as (Destination & { score?: number });
                        const countryName = dest.name.includes(",")
                          ? dest.name.split(",").slice(1).join(",").trim()
                          : null;

                        return (
                          <button
                            key={`dest-${dest.id || dest.name}`}
                            type="button"
                            onClick={() => handleSuggestionClick(dest)}
                            className={`w-full flex items-center justify-between px-5 py-3 transition-colors text-left group cursor-pointer ${
                              isSelected
                                ? "bg-slate-100 dark:bg-slate-800"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <SuggestionImage
                                src={dest.imageUrl}
                                alt={dest.name}
                                fallbackIcon={MapPin}
                                className="w-12 h-12 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs group-hover:scale-105 transition-transform"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200/60 dark:border-teal-800/60">
                                    Destination
                                  </span>
                                  {countryName && (
                                    <span className="text-[11px] text-slate-400 font-medium">
                                      {countryName}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors truncate">
                                  {highlightText(dest.name, searchQuery)}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                  {dest.attractionsCount
                                    ? `${dest.attractionsCount} Experiences available`
                                    : "Explore top attractions & tours"}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200/60 dark:border-teal-800/60 shrink-0 ml-3 flex items-center gap-1 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                              <span>Explore</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                        );
                      }

                      // Attraction Item
                      const attr = item as unknown as Attraction;
                      const displayPrice = attr.discountPrice || attr.price;
                      const hasDiscount = Boolean(
                        attr.discountPrice &&
                        attr.price &&
                        attr.discountPrice < attr.price
                      );

                      return (
                        <button
                          key={`attraction-${attr.id}`}
                          type="button"
                          onClick={() => handleSuggestionClick(attr)}
                          className={`w-full flex items-center justify-between px-5 py-3 transition-colors text-left group cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                            <SuggestionImage
                              src={attr.imageUrl}
                              alt={attr.name}
                              fallbackIcon={Landmark}
                              className="w-14 h-14 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs group-hover:scale-102 transition-transform"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-[11px] font-medium mb-0.5">
                                <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                  {attr.category || "Experience"}
                                </span>
                                {attr.rating && (
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>{attr.rating}</span>
                                    {attr.reviewsCount && (
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        ({attr.reviewsCount.toLocaleString()})
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors line-clamp-1 leading-snug">
                                {highlightText(attr.name, searchQuery)}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{highlightText(attr.location || attr.city, searchQuery)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                              From
                            </span>
                            <span className="text-[14px] font-black text-slate-900 dark:text-white group-hover:text-[#e3000f] transition-colors block">
                              {formatPrice(displayPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] line-through text-slate-400 block">
                                {formatPrice(attr.price)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center dark:bg-slate-900">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No matching {activeTab !== "all" ? activeTab : "results"} found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try selecting another tab or checking for spelling
                    </p>
                  </div>
                )}

                {/* Bottom CTA to open full search results page */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-3.5 px-5 bg-slate-50/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#e3000f]" />
                    <span>Open full search results with filters for <strong className="text-[#e3000f]">"{searchQuery}"</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#e3000f] font-extrabold group-hover:translate-x-1 transition-transform">
                    <span>View all ({counts.all})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
