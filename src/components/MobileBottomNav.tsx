import React from "react";
import { Home, Flame, Compass, Heart, Ticket, User } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";

export type StorefrontPage =
  | "home"
  | "attractions-and-museums"
  | "hot-deals"
  | "blog"
  | "sign-in"
  | "register"
  | "wishlist"
  | "my-bookings"
  | "profile"
  | "about"
  | "privacy-policy"
  | "cookie-policy"
  | "terms-and-conditions";

interface MobileBottomNavProps {
  activePage: StorefrontPage;
  activeDestination?: string | null;
  onNavigate: (page: StorefrontPage) => void;
  onWishlistOpen: () => void;
  onExplore: () => void;
}

export default function MobileBottomNav({
  activePage,
  activeDestination,
  onNavigate,
  onWishlistOpen,
  onExplore,
}: MobileBottomNavProps) {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const { t } = useSettings();

  const isHomeActive = activePage === "home" && !activeDestination;
  const isDealsActive = activePage === "hot-deals";
  const isThingsToDoActive =
    activePage === "attractions-and-museums" || Boolean(activeDestination);
  const isAccountActive =
    activePage === "my-bookings" ||
    activePage === "profile" ||
    activePage === "sign-in" ||
    activePage === "register";

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-safe"
    >
      <div className="grid grid-cols-5 h-[56px] max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => {
            onExplore();
            window.scrollTo(0, 0);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer select-none ${
            isHomeActive
              ? "text-brand"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={isHomeActive ? 2.4 : 2} />
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
            {t("navHome", "Explore")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("hot-deals")}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer select-none ${
            isDealsActive
              ? "text-brand"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Flame className="w-5 h-5" strokeWidth={isDealsActive ? 2.4 : 2} />
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
            {t("navHotDeals", "Deals")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("attractions-and-museums")}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer select-none ${
            isThingsToDoActive
              ? "text-brand"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Compass
            className="w-5 h-5"
            strokeWidth={isThingsToDoActive ? 2.4 : 2}
          />
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
            Activities
          </span>
        </button>

        <button
          type="button"
          onClick={onWishlistOpen}
          className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer select-none ${
            activePage === "wishlist"
              ? "text-brand"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                wishlist.length > 0 ? "text-brand fill-brand" : ""
              }`}
              strokeWidth={2}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[9px] font-black min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 tabular-nums">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
            Saved
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(user ? "my-bookings" : "sign-in")}
          className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer select-none ${
            isAccountActive
              ? "text-brand"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {user ? (
            <Ticket
              className="w-5 h-5"
              strokeWidth={isAccountActive ? 2.4 : 2}
            />
          ) : (
            <User className="w-5 h-5" strokeWidth={isAccountActive ? 2.4 : 2} />
          )}
          <span className="text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
            {user ? "Bookings" : "Sign in"}
          </span>
        </button>
      </div>
    </nav>
  );
}
