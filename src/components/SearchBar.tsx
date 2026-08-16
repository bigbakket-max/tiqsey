import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Navigation,
  Landmark,
  X,
  Clock,
  Trash2,
  Star,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { POPULAR_ATTRACTIONS, DESTINATIONS } from "../data/mockData";
import { getDisplayProductId } from "../utils/productIdGenerator";
import { useSettings } from "../contexts/SettingsContext";

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem("tiqsey_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed nice default recent searches so the dropdown isn't empty initially
      const defaults = ["France", "Spain", "Italy"];
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
      ].slice(0, 5);
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

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSuggestions([]);
    }
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const isMatch = (target: string | undefined, query: string) => {
          if (!target) return false;
          const cleanTarget = target.toLowerCase().replace(/[^a-z0-9]/g, "");
          const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, "");
          return (
            cleanTarget.includes(cleanQuery) ||
            target.toLowerCase().includes(query.toLowerCase())
          );
        };

        const filteredDestinations = isPageFilter
          ? []
          : DESTINATIONS.filter((d) =>
              isMatch(d.name, searchQuery),
            ).map((d) => ({ ...d, type: "destination" }));

        const filteredAttractions = POPULAR_ATTRACTIONS.filter((a) => {
          const queryMatch =
            isMatch(a.name, searchQuery) ||
            isMatch(a.city, searchQuery) ||
            isMatch(a.description, searchQuery) ||
            getDisplayProductId(a).toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.id.toLowerCase().includes(searchQuery.toLowerCase());
          if (!queryMatch) return false;
          if (isPageFilter && currentDestination) {
            const destLower = currentDestination.toLowerCase();
            return (
              a.city.toLowerCase() === destLower ||
              a.location.toLowerCase().includes(destLower) ||
              destLower.includes(a.city.toLowerCase())
            );
          }
          return true;
        }).map((a) => ({ ...a, type: "attraction" }));

        setSuggestions(
          [...filteredDestinations, ...filteredAttractions].slice(0, 8),
        );
        setShowSuggestions(true);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        if (isFocused) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
        setIsSearching(false);
      }
      setSelectedIndex(-1); // reset selection
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, isFocused, isPageFilter, currentDestination]);

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
    const handleScroll = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
        setIsFocused(false);
        if (
          document.activeElement instanceof HTMLElement &&
          dropdownRef.current?.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDownGlobal);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDownGlobal);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showSuggestions]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      saveRecentSearch(trimmed);
    }

    if (selectedIndex >= 0 && suggestions.length > 0) {
      const selected = suggestions[selectedIndex];
      handleSuggestionClick(selected);
      return;
    }

    // Check if the query matches an attraction directly
    const queryLower = trimmed.toLowerCase();
    const exactMatch = POPULAR_ATTRACTIONS.find(
      (a) =>
        a.name.toLowerCase() === queryLower ||
        a.id.toLowerCase() === queryLower ||
        getDisplayProductId(a).toLowerCase() === queryLower
    );

    if (exactMatch) {
      setShowSuggestions(false);
      setIsFocused(false);
      if (onSelectAttraction) {
        onSelectAttraction(exactMatch.id);
      } else {
        window.history.pushState({}, "", `/activities/${encodeURIComponent(exactMatch.id)}`);
        window.location.href = `/activities/${encodeURIComponent(exactMatch.id)}`;
      }
      return;
    }

    // If there is only one suggestion and it's an activity, navigate to it
    const attractionMatch = suggestions.find((s) => s.type === "attraction" || s.id);
    if (attractionMatch && suggestions.length === 1) {
      handleSuggestionClick(attractionMatch);
      return;
    }

    onSearch(trimmed);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleSuggestionClick = (item: any) => {
    saveRecentSearch(item.name);
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setIsFocused(false);

    if (item.type === "attraction" || item.id) {
      if (onSelectAttraction) {
        onSelectAttraction(item.id);
      } else {
        window.history.pushState({}, "", `/activities/${encodeURIComponent(item.id)}`);
        window.location.href = `/activities/${encodeURIComponent(item.id)}`;
      }
    } else {
      onSearch(item.name);
    }
  };

  const handlePopularActivityClick = (item: any) => {
    saveRecentSearch(item.name);
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setIsFocused(false);

    if (item.id) {
      if (onSelectAttraction) {
        onSelectAttraction(item.id);
      } else {
        window.history.pushState({}, "", `/activities/${encodeURIComponent(item.id)}`);
        window.location.href = `/activities/${encodeURIComponent(item.id)}`;
      }
    } else {
      onSearch(item.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
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
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span
              key={i}
              className="text-[#e3000f] dark:text-red-400 font-bold bg-[#e3000f]/10 dark:bg-red-500/20 px-1 py-0.5 rounded-sm"
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

  const [selectedDestForActivities, setSelectedDestForActivities] = useState<string>(DESTINATIONS[0]?.name || "Tokyo, Japan");

  useEffect(() => {
    if (currentDestination) {
      const match = DESTINATIONS.find(
        (d) =>
          d.name.toLowerCase().includes(currentDestination.toLowerCase()) ||
          currentDestination.toLowerCase().includes(d.name.toLowerCase()),
      );
      if (match) {
        setSelectedDestForActivities(match.name);
      } else {
        setSelectedDestForActivities(currentDestination);
      }
    }
  }, [currentDestination]);

  const popularActivities = React.useMemo(() => {
    const city = selectedDestForActivities.split(",")[0].trim();
    const filtered = POPULAR_ATTRACTIONS.filter(
      (a) => a.city.toLowerCase() === city.toLowerCase()
    );
    if (filtered.length > 0) {
      return filtered.slice(0, 4);
    }
    return POPULAR_ATTRACTIONS.slice(0, 4);
  }, [selectedDestForActivities]);

  const destinationSuggestions = suggestions.filter((s) => s.type === "destination");
  const attractionSuggestions = suggestions.filter((s) => s.type === "attraction");

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
          id={isCompact ? "compact-search-input" : undefined}
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
              ? "Search attractions, cities or activities."
              : "Search destinations, activities, tours, attractions...")
          }
          autoFocus={autoFocus}
          className={`focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 transition-all duration-300 ease-in-out font-sans leading-normal ${
            isCompact
              ? "text-[13px] xl:text-[14px] flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-4 pr-1 py-0 h-full font-medium"
              : "w-full text-slate-900 dark:text-white text-sm md:text-base bg-transparent border-none p-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-4 font-medium"
          }`}
        />
        {searchQuery && !isCompact && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              onSearch("");
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-2 shrink-0"
            title="Clear search"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
        {isCompact ? (
          <div className="flex items-center pr-3 shrink-0 gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer bg-transparent"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
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
            className="h-11 px-7 flex items-center justify-center gap-2 text-sm text-white rounded-full font-bold hover:brightness-110 transition-all bg-brand shrink-0 shadow-md cursor-pointer"
          >
            <span>Search</span>
          </motion.button>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && (isSearching || suggestions.length > 0 || searchQuery.trim().length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full mt-2 bg-white dark:bg-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.14)] border border-slate-200/80 dark:border-slate-800 overflow-hidden z-[999999] ${
              isCompact
                ? "right-0 w-[calc(100vw-32px)] md:w-[540px] rounded-2xl"
                : "left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] sm:w-[500px] md:w-[580px] lg:w-[640px] rounded-[22px]"
            }`}
          >
            {isSearching ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-slate-100 dark:border-slate-800 border-t-[#e3000f] rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3.5 tracking-wide">
                  Searching amazing experiences...
                </p>
              </div>
            ) : searchQuery.trim().length < 2 ? (
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2 px-1">
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
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((item, index) => (
                        <span
                          key={`recent-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer group"
                          onClick={() => {
                            onSearch(item);
                            setSearchQuery(item);
                            saveRecentSearch(item);
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
                            className="p-0.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Destinations Quick Chips */}
                <div className="p-4">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5 px-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Popular Destinations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Paris", "Rome", "Barcelona", "Amsterdam", "Tokyo", "London", "Lisbon"].map((city) => (
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
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-[#e3000f]/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#e3000f] transition-all cursor-pointer shadow-2xs"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Experiences Preview */}
                <div className="p-4">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3 px-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Top Experiences
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {popularActivities.slice(0, 4).map((attraction) => (
                      <button
                        key={`top-${attraction.id}`}
                        type="button"
                        onClick={() => handlePopularActivityClick(attraction)}
                        className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 text-left group transition-all cursor-pointer"
                      >
                        <SuggestionImage
                          src={attraction.imageUrl}
                          alt={attraction.name}
                          fallbackIcon={Landmark}
                          className="w-10 h-10 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-2xs group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#e3000f] transition-colors truncate">
                            {attraction.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-medium">
                            From {formatPrice(attraction.discountPrice || attraction.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {/* Destination Suggestions Section */}
                {destinationSuggestions.length > 0 && (
                  <div className="py-2">
                    <div className="px-5 py-2 flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Destinations</span>
                    </div>
                    {destinationSuggestions.map((item) => {
                      const globalIdx = suggestions.findIndex((s) => s === item);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={`dest-${item.id || item.name}`}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors text-left group cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <SuggestionImage
                              src={item.imageUrl}
                              alt={item.name}
                              fallbackIcon={MapPin}
                              className="w-11 h-11 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors truncate">
                                {highlightText(item.name, searchQuery)}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                {item.attractionsCount
                                  ? `${item.attractionsCount} Experiences available`
                                  : "Popular Destination"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200/60 dark:border-teal-800/60 shrink-0 ml-3">
                            Explore City
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Attraction Suggestions Section */}
                {attractionSuggestions.length > 0 && (
                  <div className="py-2">
                    <div className="px-5 py-2 flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <Landmark className="w-3.5 h-3.5 text-[#e3000f]" />
                      <span>Activities & Experiences</span>
                    </div>
                    {attractionSuggestions.map((item) => {
                      const globalIdx = suggestions.findIndex((s) => s === item);
                      const isSelected = globalIdx === selectedIndex;
                      const displayPrice = item.discountPrice || item.price;

                      return (
                        <button
                          key={`attraction-${item.id}`}
                          type="button"
                          onClick={() => handleSuggestionClick(item)}
                          className={`w-full flex items-center justify-between px-5 py-3 transition-colors text-left group cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                            <SuggestionImage
                              src={item.imageUrl}
                              alt={item.name}
                              fallbackIcon={Landmark}
                              className="w-14 h-14 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs group-hover:scale-102 transition-transform"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
                                <span className="font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                  {item.category || "Activity"}
                                </span>
                                {item.rating && (
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {item.rating}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors line-clamp-1 leading-snug">
                                {highlightText(item.name, searchQuery)}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{highlightText(item.location || item.city, searchQuery)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block uppercase tracking-wider">From</span>
                            <span className="text-[14px] font-extrabold text-slate-900 dark:text-white group-hover:text-[#e3000f] transition-colors">
                              {formatPrice(displayPrice)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* View All Footer */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-3.5 px-5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#e3000f]" />
                    <span>See all results for <strong className="text-[#e3000f]">"{searchQuery}"</strong></span>
                  </span>
                  <span className="flex items-center gap-1 text-[#e3000f] font-bold group-hover:translate-x-1 transition-transform">
                    Search ({suggestions.length}) →
                  </span>
                </button>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-10 text-center dark:bg-slate-900">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  No activities found
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Try searching for something else like "Paris" or "Louvre"
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

