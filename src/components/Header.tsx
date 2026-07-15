import React, { useState, useEffect } from "react";
import {
  Globe,
  User,
  X,
  ChevronDown,
  Sun,
  Moon,
  Smartphone,
  Home,
  Flame,
  Ticket,
  Map,
  LogOut,
  Search,
  FerrisWheel,
  Heart,
  Compass,
  MapPin,
  Landmark,
  Gift,
  BookOpen,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../contexts/SettingsContext";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import SettingsModal from "./SettingsModal";
import SearchBar from "./SearchBar";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import {
  getCurrencyFlag,
  getCurrencyCountryCode,
} from "../utils/currencyFlags";

const POPULAR_REGIONS = [
  {
    name: "Europe",
    query: "Europe",
    image:
      "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Asia",
    query: "Asia",
    image:
      "https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "North America",
    query: "North America",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Oceania",
    query: "Oceania",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Middle East",
    query: "Middle East",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=120&h=120&q=80",
  },
];

const POPULAR_DESTINATIONS = [
  {
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Osaka",
    image:
      "https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Istanbul",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "London",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Amsterdam",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Lisbon",
    image:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Singapore",
    image:
      "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Sydney",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Bangkok",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Zurich",
    image:
      "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    name: "Florence",
    image:
      "https://images.unsplash.com/photo-1528114039593-4366cc08227d?auto=format&fit=crop&w=120&h=120&q=80",
  },
];

export default function Header({
  onExplore,
  onSearch,
  onNavigate,
  onWishlistOpen,
  onViewAttraction,
  activePage = "home",
  activeDestination = null,
}: {
  onExplore?: () => void;
  onSearch?: (q: string) => void;
  onNavigate?: (page: "home" | "attractions-and-museums" | "hot-deals" | "blog" | "sign-in" | "register" | "wishlist" | "my-bookings" | "profile") => void;
  onWishlistOpen?: () => void;
  onViewAttraction?: (id: string) => void;
  activePage?: "home" | "attractions-and-museums" | "hot-deals" | "blog" | "sign-in" | "register" | "wishlist" | "my-bookings" | "profile";
  activeDestination?: string | null;
}) {
  const { user, setAuthModalOpen, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDestinationsOpen, setMobileDestinationsOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { currency, theme, setTheme, t } = useSettings();

  const [scrolled, setScrolled] = useState(false);
  const pageName = activePage as
    | "home"
    | "attractions-and-museums"
    | "hot-deals"
    | "blog";

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 150);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const headerActive = true;

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 ${!scrolled && pageName === "home" && !activeDestination ? "bg-[#F4F7F9] dark:bg-slate-950 shadow-none" : "bg-white dark:bg-slate-900 shadow-sm"}`}
      >
        <div
          className={`h-[46px] sm:h-[52px] relative z-50 backdrop-blur-md transition-colors ${!scrolled && pageName === "home" && !activeDestination ? "bg-[#F4F7F9]/95 dark:bg-slate-950/95 border-b border-gray-200/60 dark:border-slate-800/50 md:border-b-transparent" : "bg-white/95 dark:bg-slate-900/95 border-b border-gray-100/80 dark:border-slate-850/80"}`}
        >
          <div className="max-w-[1400px] mx-auto pl-1.5 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 h-full flex items-center justify-between gap-3 sm:gap-4 md:gap-8">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 mr-2 sm:mr-4 md:mr-6">
              <div
                className="flex items-center cursor-pointer shrink-0 transition-all duration-300 hover:opacity-90 active:scale-95 select-none"
                onClick={() => {
                  if (onExplore) onExplore();
                  window.scrollTo(0, 0);
                }}
              >
                <span className="font-black tracking-tight text-[26px] sm:text-[31px] text-brand dark:text-brand transition-colors leading-none">
                  Tiqsey
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 h-full min-w-0 ml-4 xl:ml-8">
              <nav
                className="flex items-center h-full relative select-none gap-2 lg:gap-4 xl:gap-[20px]"
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {[
                  {
                    name: "Home",
                    label: t("navHome"),
                    active: pageName === "home" && !activeDestination,
                    type: undefined as string | undefined,
                  },
                  {
                    name: "Hot Deals",
                    label: "Hot Deals 🔥",
                    active: (pageName as string) === "hot-deals",
                    type: undefined as string | undefined,
                  },
                  {
                    name: "Attractions & Museums",
                    label: "Attractions & Museums",
                    active: (pageName as string) === "attractions-and-museums",
                    type: undefined as string | undefined,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative h-full flex items-center px-2.5 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                  >
                    {hoveredIdx === idx && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-x-0.5 inset-y-2 rounded-full bg-slate-100/80 dark:bg-slate-800/60 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                    {item.active && (
                      <motion.div
                        layoutId="nav-active-underline"
                        className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-brand dark:bg-brand rounded-full z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.name === "Home") {
                          if (onExplore) onExplore();
                          if (onNavigate) onNavigate("home");
                        } else if (item.name === "Attractions & Museums") {
                          if (onNavigate) onNavigate("attractions-and-museums");
                        } else if (item.name === "Hot Deals") {
                          if (onNavigate) onNavigate("hot-deals");
                        } else if (item.name === "Blog") {
                          if (onNavigate) onNavigate("blog");
                        }
                      }}
                      className={`text-[14px] xl:text-[15px] font-semibold tracking-tight whitespace-nowrap transition-colors flex items-center gap-1.5 h-full ${
                        item.active
                          ? "text-brand"
                          : "text-slate-600 dark:text-slate-300 group-hover:text-brand dark:group-hover:text-brand"
                      }`}
                    >
                      <span>{item.label}</span>
                    </a>

                    {item.type === "region" && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6 w-[860px] transform origin-top scale-95 group-hover:scale-100 transition-all duration-200 grid grid-cols-3 gap-4">
                          {POPULAR_REGIONS.map((region, rIdx) => (
                            <a
                              key={rIdx}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (onSearch) onSearch(region.query);
                              }}
                              className="flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2.5 rounded-xl transition-all group/subitem"
                            >
                              <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-850">
                                <img
                                  src={region.image}
                                  alt={region.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/subitem:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                                  Things to do in
                                </span>
                                <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors group-hover/subitem:text-brand leading-normal">
                                  {region.name}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.type === "destination" && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6 w-[860px] transform origin-top scale-95 group-hover:scale-100 transition-all duration-200 grid grid-cols-4 gap-4">
                          {POPULAR_DESTINATIONS.map((dest, dIdx) => (
                            <a
                              key={dIdx}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (onSearch) onSearch(dest.name);
                              }}
                              className="flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all group/subitem"
                            >
                              <div className="w-16 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-850">
                                <img
                                  src={dest.image}
                                  alt={dest.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/subitem:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                                  Things to do in
                                </span>
                                <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors group-hover/subitem:text-brand leading-normal">
                                  {dest.name}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center justify-end gap-1.5 lg:gap-2.5 shrink-0">
              {/* Desktop Search Bar */}
              <div className="w-[140px] lg:w-[160px] xl:w-[220px] 2xl:w-[280px] relative hidden lg:block transition-all duration-300">
                <SearchBar
                  isCompact={true}
                  onSearch={(query) => {
                    if (onSearch) onSearch(query);
                  }}
                  placeholder="Search..."
                  className="w-full"
                />
              </div>

              {/* Desktop Wishlist Button */}
              <motion.button
                onClick={onWishlistOpen}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="relative flex items-center justify-center p-2.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand hover:bg-brand/[0.06] dark:hover:bg-brand/[0.08] transition-all select-none cursor-pointer shrink-0"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${wishlist.length > 0 ? "text-brand fill-brand scale-110" : "text-current group-hover:text-brand"}`}
                  strokeWidth={wishlist.length > 0 ? 2 : 2.25}
                />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      key="wishlist-badge"
                      className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[9.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 select-none shadow-sm"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Combined Settings Trigger */}
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all active:scale-95 select-none cursor-pointer shrink-0 border border-transparent font-sans"
                title={`${currency.code.toUpperCase()}`}
              >
                <div className="w-6 h-4.5 select-none shrink-0 border border-slate-200 dark:border-slate-800 rounded overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm flex items-center justify-center">
                  <img
                    src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                    alt={`${currency.code} flag`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 tracking-wide flex items-center gap-1 font-sans">
                  {currency.code} {currency.symbol}
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                  strokeWidth={2.5}
                />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-brand p-[1px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[55]" onClick={() => setUserDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full mt-3 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-[60]"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              if (onNavigate) onNavigate("profile");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors text-left mb-1"
                          >
                            <User className="w-4 h-4 text-brand" />
                            My Profile
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              if (onNavigate) onNavigate("my-bookings");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors text-left mb-1"
                          >
                            <Ticket className="w-4 h-4 text-brand" />
                            My Bookings
                          </button>
                          {user && user.email.toLowerCase() === 'admin@tiqsey.com' && (
                            <a
                              href="/admin"
                              onClick={() => {
                                setUserDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors text-left mb-1"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              Admin Portal
                            </a>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-sm transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("sign-in");
                    }}
                    className="px-4 py-2 text-sm font-bold text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle & Wishlist button */}
            <div className="flex lg:hidden items-center gap-1 px-1">
              {/* Compact Settings Trigger */}
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="flex items-center gap-1.5 h-8 px-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 transition-all active:scale-95 select-none cursor-pointer shrink-0 bg-white/80 dark:bg-slate-900/80 shadow-sm"
                title={`${currency.code.toUpperCase()}`}
              >
                <div className="w-5 h-3.5 select-none shrink-0 border border-slate-100 dark:border-slate-800 rounded-[2px] overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <img
                    src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                    alt={`${currency.code} flag`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              </button>

              <motion.button
                onClick={onWishlistOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand hover:bg-brand/[0.06] dark:hover:bg-brand/[0.08] transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${wishlist.length > 0 ? "text-brand fill-brand scale-105" : "text-current"}`}
                  strokeWidth={wishlist.length > 0 ? 2 : 2.25}
                />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      key="wishlist-badge-mobile"
                      className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 select-none shadow-sm"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-brand hover:bg-brand/[0.06] dark:hover:bg-brand/[0.08] transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Menu"
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="8" y1="12" x2="20" y2="12"></line>
                  <line x1="14" y1="17" x2="20" y2="17"></line>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-3 pt-1">
          <SearchBar
            isCompact={true}
            onSearch={(query) => {
              if (onSearch) onSearch(query);
            }}
            placeholder="Find places, tours, things to do..."
          />
        </div>

        {/* Universal Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-[#1A2B48]/40 dark:bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[360px] bg-white dark:bg-slate-950 z-[70] shadow-2xl flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-black tracking-tight text-3xl text-brand dark:text-brand select-none">
                      Tiqsey
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col p-6 gap-6 flex-1">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-2">
                          <div className="w-10 h-10 rounded-full border-2 border-brand p-[1px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                              src={user.avatarUrl} 
                              alt={user.name} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          </div>
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                            <span className="text-xs text-slate-500 truncate">{user.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            if (onNavigate) onNavigate("profile");
                          }}
                          className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 rounded-xl transition-colors text-left"
                        >
                          <User className="w-5 h-5 text-brand" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            if (onNavigate) onNavigate("my-bookings");
                          }}
                          className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 rounded-xl transition-colors text-left"
                        >
                          <Ticket className="w-5 h-5 text-brand" />
                          <span>My Bookings</span>
                        </button>
                        {user && user.email.toLowerCase() === 'admin@tiqsey.com' && (
                          <a
                            href="/admin"
                            onClick={() => {
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 rounded-xl transition-colors text-left"
                          >
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span>Admin Portal</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 text-lg font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 py-3 px-4 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 mb-2">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            if (onNavigate) onNavigate("sign-in");
                          }}
                          className="w-full flex items-center justify-center gap-3 text-base font-bold text-white bg-brand hover:bg-brand-dark py-3 px-4 rounded-xl transition-colors shadow-sm"
                        >
                          Sign in
                        </button>
                      </div>
                    )}

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B48] dark:text-slate-400 px-1 mb-2">
                      {t("explore")}
                    </span>
                    {[
                      {
                        name: "Home",
                        label: t("navHome"),
                        active: pageName === "home" && !activeDestination,
                        icon: Home,
                      },
                      {
                        name: "Hot Deals",
                        label: "Hot Deals 🔥",
                        active: (pageName as string) === "hot-deals",
                        icon: Flame,
                      },
                      {
                        name: "Attractions & Museums",
                        label: "Attractions & Museums",
                        active:
                          (pageName as string) === "attractions-and-museums",
                        icon: FerrisWheel,
                      },
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (item.name === "Home") {
                            if (onExplore) onExplore();
                            if (onNavigate) onNavigate("home");
                          } else if (item.name === "Attractions & Museums") {
                            if (onNavigate)
                              onNavigate("attractions-and-museums");
                          } else if (item.name === "Hot Deals") {
                            if (onNavigate) onNavigate("hot-deals");
                          } else if (item.name === "Blog") {
                            if (onNavigate) onNavigate("blog");
                          }
                        }}
                        className={`flex items-center justify-between text-left gap-3 text-lg font-bold py-3 px-4 rounded-xl transition-colors ${
                          item.active
                            ? "bg-brand/5 text-brand dark:bg-brand/10"
                            : "text-gray-900 hover:bg-gray-50 dark:text-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon className="w-5 h-5 text-current" />
                          )}
                          <span>{item.label}</span>
                        </div>
                      </button>
                    ))}
                    {/* Browse Destinations Collapsible */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => setMobileDestinationsOpen(!mobileDestinationsOpen)}
                        className={`flex items-center justify-between text-left gap-3 text-lg font-bold py-3 px-4 rounded-xl transition-colors text-gray-900 hover:bg-gray-50 dark:text-slate-100 dark:hover:bg-slate-900`}
                      >
                        <div className="flex items-center gap-3">
                          <Compass className="w-5 h-5 text-current" />
                          <span>Browse Destinations</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileDestinationsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDestinationsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 pr-2 flex flex-col gap-4 mt-1.5"
                          >
                            {/* Regions Section */}
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B48] dark:text-slate-400 px-2 mb-2">
                                {t("navRegions")}
                              </span>
                              <div className="flex flex-col gap-1">
                                {POPULAR_REGIONS.map((region, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      if (onSearch) onSearch(region.query);
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 text-left w-full transition-all cursor-pointer"
                                  >
                                    <img
                                      src={region.image}
                                      alt={region.name}
                                      className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-[9px] text-slate-400 uppercase font-medium">
                                        Explore region
                                      </span>
                                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {region.name}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Cities Section */}
                            <div className="flex flex-col border-t border-slate-100 dark:border-slate-800/60 pt-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B48] dark:text-slate-400 px-2 mb-2">
                                {t("navCities")}
                              </span>
                              <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto scrollbar-thin pr-1">
                                {POPULAR_DESTINATIONS.map((dest, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      if (onSearch) onSearch(dest.name);
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 text-left w-full transition-all cursor-pointer"
                                  >
                                    <img
                                      src={dest.image}
                                      alt={dest.name}
                                      className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-[9px] text-slate-400 uppercase font-medium">
                                        Explore city
                                      </span>
                                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {dest.name}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>


                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B48] dark:text-slate-400 px-1 mb-2">
                      Currency
                    </span>
                    <button
                      onClick={() => {
                        setSettingsModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-900 dark:text-slate-100 py-3 px-4 rounded-xl transition-colors"
                    >
                      <div className="w-7 h-5 select-none shrink-0 border border-slate-200 dark:border-slate-800 rounded overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm flex items-center justify-center">
                        <img
                          src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                          alt={`${currency.code} flag`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                      <span className="uppercase font-semibold">
                        {currency.code}
                      </span>
                    </button>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                    <a
                      href="#"
                      className="flex items-center gap-3 text-lg font-bold text-[#1A2B48] hover:bg-gray-50 dark:hover:bg-slate-900 dark:text-slate-100 py-3 px-4 rounded-xl transition-colors"
                    >
                      Support
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
}
