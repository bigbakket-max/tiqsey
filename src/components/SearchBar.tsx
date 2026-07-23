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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { POPULAR_ATTRACTIONS, DESTINATIONS } from "../data/mockData";
import { getDisplayProductId } from "../utils/productIdGenerator";
import { useSettings } from "../contexts/SettingsContext";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isCompact?: boolean;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  realTime?: boolean;
  isPageFilter?: boolean;
  currentDestination?: string;
}

export default function SearchBar({
  onSearch,
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
        // setShowSuggestions(false); // don't close, show popular activities
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
    }, 300);

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
        // Optional: blur the active element if it's our input
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

  const handleBookingRedirect = (id: string) => {
    window.open(
      `${window.location.origin}/activities/${encodeURIComponent(id)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      saveRecentSearch(trimmed);
    }

    // Check if we selected something via keyboard
    if (selectedIndex >= 0 && suggestions.length > 0) {
      const selected = suggestions[selectedIndex];
      handleSuggestionClick(selected);
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
    onSearch(item.name);
  };

  const handlePopularActivityClick = (item: any) => {
    saveRecentSearch(item.name);
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(item.name);
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
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-brand font-extrabold bg-brand/5">
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

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <form
        onSubmit={handleSearch}
        className={`relative z-30 group w-full flex items-center ${
          isCompact
            ? `${
                isPageFilter
                  ? "bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 border-[#e3000f]/40 dark:border-[#e3000f]/30 hover:border-[#e3000f] focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#e3000f] focus-within:ring-2 focus-within:ring-[#e3000f]/10 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-[#e3000f]/40 dark:border-[#e3000f]/30 focus-within:border-[#e3000f] focus-within:ring-2 focus-within:ring-[#e3000f]/10 shadow-sm"
              } rounded-xl h-10 border transition-all overflow-hidden pr-2`
            : "bg-white dark:bg-slate-900 rounded-full p-1.5 pl-6 md:pl-8 h-14 border border-[#e3000f]/40 dark:border-[#e3000f]/30 hover:border-[#e3000f] focus-within:border-[#e3000f] focus-within:ring-4 focus-within:ring-[#e3000f]/5 shadow-sm transition-all duration-300"
        }`}
      >
        {isCompact ? (
          <Search
            className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-3.5 mr-1.5 shrink-0"
            strokeWidth={2.25}
          />
        ) : (
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
              ? "search..."
              : "Search destinations, activities, tours, attractions...")
          }
          autoFocus={autoFocus}
          className={`focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 transition-all duration-300 ease-in-out font-sans leading-normal ${
            isCompact
              ? "text-[14px] flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-1 py-0 h-full font-medium"
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
          <>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer mr-1 bg-transparent"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
            {/* Info icon removed as requested */}
          </>
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full mt-2 bg-white dark:bg-slate-900 shadow-[0_24px_50px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800/80 overflow-hidden z-[999999] ${
              isCompact
                ? "right-0 w-[calc(100vw-32px)] md:w-[540px] rounded-xl"
                : "left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] sm:w-[500px] md:w-[580px] lg:w-[640px] rounded-[20px]"
            }`}
          >
            {isSearching ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-100 dark:border-slate-800 border-t-brand rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 mt-4 font-medium">
                  Searching amazing experiences...
                </p>
              </div>
            ) : searchQuery.trim().length < 2 ? (
              <div className="max-h-[500px] overflow-y-auto">
                {recentSearches.length > 0 && (
                  <div className="mb-2">
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
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
                        className="text-[11px] font-bold text-slate-400 hover:text-brand dark:hover:text-brand transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear All
                      </button>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                      {recentSearches.map((item, index) => (
                        <div
                          key={`recent-${index}`}
                          className="w-full flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all duration-200 px-5 py-2.5 group cursor-pointer"
                          onClick={() => {
                            onSearch(item);
                            setSearchQuery(item);
                            saveRecentSearch(item);
                            setShowSuggestions(false);
                            setIsFocused(false);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-brand dark:group-hover:text-brand transition-colors truncate">
                              {item}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(item);
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
                {suggestions.map((item, index) => {
                  const absoluteIndex = suggestions.findIndex(
                    (s) => s === item,
                  );
                  return (
                    <button
                      key={`suggestion-${index}`}
                      onClick={() => handleSuggestionClick(item)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 transition-colors text-left group ${
                        absoluteIndex === selectedIndex
                          ? "bg-slate-50 dark:bg-slate-800/40"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
                      }`}
                    >
                      <div className="shrink-0 flex items-center justify-center">
                        {item.type === "destination" ? (
                          <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
                        ) : (
                          <Landmark className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors truncate">
                          {highlightText(item.name, searchQuery)}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                          {item.type === "destination"
                            ? "Popular Destination"
                            : item.location || item.city || "Activity"}
                        </p>
                      </div>
                    </button>
                  );
                })}
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
