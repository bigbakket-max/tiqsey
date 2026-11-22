import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedDestinations from "./components/FeaturedDestinations";
import PopularAttractions from "./components/PopularAttractions";
import AdBanner from "./components/AdBanner";
import LargeFeaturedBanner from "./components/LargeFeaturedBanner";
import TrustBar from "./components/TrustBar";
import RecentlyViewed from "./components/RecentlyViewed";
import HotDeals from "./components/HotDeals";
import Footer from "./components/Footer";
import ActivitiesPage from "./components/ActivitiesPage";
import AttractionDetailModal from "./components/AttractionDetailModal";
import WishlistSidebar from "./components/WishlistSidebar";
import { ScrollReveal } from "./components/ScrollReveal";
import { useSettings } from "./contexts/SettingsContext";
import { useAuth } from "./contexts/AuthContext";
import { POPULAR_ATTRACTIONS, DESTINATIONS } from "./data/mockData";
import { getDisplayProductId } from "./utils/productIdGenerator";
import { Attraction } from "./types";
import AttractionsAndMuseumsPage from "./components/AttractionsAndMuseumsPage";
import HotDealsPage from "./components/HotDealsPage";
import BlogPage from "./components/BlogPage";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import WishlistPage from "./components/WishlistPage";
import MyBookingsPage from "./components/MyBookingsPage";
import ProfilePage from "./components/ProfilePage";
import AboutPage from "./components/AboutPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import CookiePolicyPage from "./components/CookiePolicyPage";
import TermsAndConditionsPage from "./components/TermsAndConditionsPage";
import LanguageDetectionBanner from "./components/LanguageDetectionBanner";
import MobileBottomNav from "./components/MobileBottomNav";

import ErrorBoundary from "./components/ErrorBoundary";

type AppPage =
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

function parseInitialRoute(): { page: AppPage; destination: string | null; attractionId: string | null } {
  if (typeof window === "undefined") {
    return { page: "home", destination: null, attractionId: null };
  }
  const path = window.location.pathname || "/";
  const hash = window.location.hash || "";
  const hashBody = hash.startsWith("#") ? hash.slice(1) : hash;
  const [hashPathRaw = "", hashQueryRaw = ""] = hashBody.split("?");

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(hashQueryRaw);
  const getParam = (key: string): string | null =>
    searchParams.get(key) || hashParams.get(key);
  const hasParam = (key: string): boolean =>
    searchParams.has(key) || hashParams.has(key);

  const normalizeRoutePath = (raw: string): string => {
    if (!raw) return "/";
    const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
    return withLeading.length > 1 ? withLeading.replace(/\/+$/, "") : withLeading;
  };

  const normalizedPath = normalizeRoutePath(path);
  const normalizedHashPath = hashPathRaw ? normalizeRoutePath(hashPathRaw) : "";
  const effectivePath =
    normalizedPath !== "/"
      ? normalizedPath
      : normalizedHashPath && normalizedHashPath !== "/"
        ? normalizedHashPath
        : "/";

  let attrId = getParam("attraction") || getParam("activity") || getParam("productId");

  // 1. Check path & hash for attraction detail routes (/activities/, /attraction/, /attractions/, /activity/)
  if (!attrId) {
    const attrMatch = effectivePath.match(/^\/(?:activities|activity|attraction|attractions)\/([^/?#]+)/i);
    if (attrMatch?.[1]) {
      attrId = attrMatch[1].trim();
    }
  }

  const safeDecode = (val: string): string => {
    try {
      return decodeURIComponent(val);
    } catch {
      return val;
    }
  };

  if (attrId) {
    const rawAttrId = safeDecode(attrId).trim();
    // Resolve matching attraction ID if given slug or numeric product ID
    const matched = POPULAR_ATTRACTIONS.find(
      (a) =>
        a.id === rawAttrId ||
        a.productId === rawAttrId ||
        (a.customSlug && a.customSlug.toLowerCase() === rawAttrId.toLowerCase()) ||
        getDisplayProductId(a) === rawAttrId ||
        a.id.toLowerCase() === rawAttrId.toLowerCase()
    );
    const resolvedId = matched ? matched.id : rawAttrId;
    return { page: "home", destination: null, attractionId: resolvedId };
  }

  let dest: string | null = null;
  if (effectivePath.startsWith("/destinations/")) {
    const destId = effectivePath.split("/destinations/")[1]?.split("/")[0]?.split("?")[0]?.split("#")[0]?.trim();
    if (destId) {
      dest = safeDecode(destId)
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  if (dest) {
    return { page: "home", destination: dest, attractionId: null };
  }

  let page: AppPage = "home";
  const lowerPath = effectivePath.toLowerCase();
  if (lowerPath === "/blog" || lowerPath.startsWith("/blog/") || hasParam("post") || hasParam("postId")) {
    page = "blog";
  } else if (lowerPath === "/about") {
    page = "about";
  } else if (lowerPath === "/privacy" || lowerPath === "/privacy-policy") {
    page = "privacy-policy";
  } else if (lowerPath === "/cookies" || lowerPath === "/cookie-policy") {
    page = "cookie-policy";
  } else if (lowerPath === "/terms" || lowerPath === "/terms-and-conditions") {
    page = "terms-and-conditions";
  } else if (lowerPath === "/wishlist" || hasParam("items")) {
    page = "wishlist";
  } else if (lowerPath === "/my-bookings") {
    page = "my-bookings";
  } else if (lowerPath === "/profile") {
    page = "profile";
  } else if (lowerPath === "/login" || lowerPath === "/sign-in") {
    page = "sign-in";
  } else if (lowerPath === "/register" || lowerPath === "/sign-up") {
    page = "register";
  } else if (lowerPath === "/hot-deals") {
    page = "hot-deals";
  } else if (lowerPath === "/attractions-and-museums" || lowerPath === "/things-to-do") {
    page = "attractions-and-museums";
  }

  return { page, destination: null, attractionId: null };
}

export default function App() {
  const { t } = useSettings();
  const { user } = useAuth();
  
  const [currentPage, setCurrentPage] = useState<AppPage>(() => parseInitialRoute().page);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    () => parseInitialRoute().destination,
  );
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(
    () => parseInitialRoute().attractionId,
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const [attractionsRev, setAttractionsRev] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setAttractionsRev((prev) => prev + 1);
    };
    window.addEventListener("tiqsey_attractions_updated", handleUpdate);
    return () => window.removeEventListener("tiqsey_attractions_updated", handleUpdate);
  }, []);

  // Synchronize route when user clicks Browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = parseInitialRoute();
      setSelectedAttractionId(route.attractionId);
      setSelectedDestination(route.destination);
      setCurrentPage(route.page);
      setActiveCategoryFilter(null);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  // Ensure that if the user is on the home page view, the URL is always clean '/'
  useEffect(() => {
    if (currentPage === "home" && !selectedAttractionId && !selectedDestination) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "" &&
        !window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.startsWith("/secure-panel")
      ) {
        window.history.replaceState({}, "", "/");
      }
    }
  }, [currentPage, selectedAttractionId, selectedDestination]);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("recentlyViewed");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse recently viewed from local storage", e);
      return [];
    }
  });

  const recentlyViewedItems = React.useMemo(() => {
    try {
      return recentlyViewedIds
        .map((id) => POPULAR_ATTRACTIONS.find((a) => a.id === id))
        .filter((a): a is Attraction => !!a);
    } catch (e) {
      console.error("Error computing recently viewed items", e);
      return [];
    }
  }, [recentlyViewedIds, attractionsRev]);

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewedIds((prev) => {
      try {
        const filtered = prev.filter((item) => item !== id);
        const updated = [id, ...filtered].slice(0, 20);
        localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        return updated;
      } catch (e) {
        console.error("Failed to save recently viewed to local storage", e);
        return prev;
      }
    });
  };

  const clearRecentlyViewed = () => {
    try {
      setRecentlyViewedIds([]);
      localStorage.removeItem("recentlyViewed");
    } catch (e) {
      console.error("Failed to clear recently viewed from local storage", e);
    }
  };

  // Ensure initial attraction is tracked in recently viewed
  useEffect(() => {
    if (selectedAttractionId) {
      setRecentlyViewedIds((prev) => {
        const filtered = prev.filter((item) => item !== selectedAttractionId);
        const updated = [selectedAttractionId, ...filtered].slice(0, 20);
        try {
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
  }, [selectedAttractionId]);

  // Protect private pages with local session check
  useEffect(() => {
    const checkSession = () => {
      const privatePages = ["wishlist", "my-bookings", "profile"];
      if (privatePages.includes(currentPage)) {
        if (!user) {
          window.history.pushState({}, "", "/login");
          setCurrentPage("sign-in");
        }
      }
    };
    checkSession();
  }, [currentPage, user]);

  const navigateHome = () => {
    setSelectedDestination(null);
    setSelectedAttractionId(null);
    setActiveCategoryFilter(null);
    setGlobalSearchQuery("");
    setCurrentPage("home");
    if (
      typeof window !== "undefined" &&
      (window.location.pathname !== "/" || window.location.hash || window.location.search)
    ) {
      window.history.pushState({}, "", "/");
    }
    window.scrollTo(0, 0);
  };

  const handleCloseDetail = () => {
    navigateHome();
  };

  const handleViewAttraction = (id: string) => {
    addToRecentlyViewed(id);
    setSelectedAttractionId(id);
    window.history.pushState({}, "", `/activities/${encodeURIComponent(id)}`);
    window.scrollTo(0, 0);
  };

  const handleGlobalSearch = (q: string) => {
    const queryLower = q.trim().toLowerCase();
    if (!queryLower) return;

    // 1. Exact 8-digit Product ID or Exact ID match
    const exactIdMatch = POPULAR_ATTRACTIONS.find(
      (a) =>
        a.id.toLowerCase() === queryLower ||
        getDisplayProductId(a).toLowerCase() === queryLower
    );
    if (exactIdMatch && (/^\d{8}$/.test(queryLower) || exactIdMatch.id.toLowerCase() === queryLower)) {
      handleViewAttraction(exactIdMatch.id);
      return;
    }

    // 2. Open full search results page with filters and sorting pre-loaded
    setSelectedDestination(null);
    setSelectedAttractionId(null);
    setActiveCategoryFilter(null);
    setGlobalSearchQuery(q.trim());
    setCurrentPage("attractions-and-museums");
    window.history.pushState({}, "", `/attractions-and-museums?search=${encodeURIComponent(q.trim())}`);
    window.scrollTo(0, 0);
  };

  const mainContent = () => {
    if (selectedAttractionId) {
      return (
        <AttractionDetailModal
          attractionId={selectedAttractionId}
          onClose={handleCloseDetail}
          onViewAttraction={handleViewAttraction}
          onNavigateToDestination={(city, category) => {
            setSelectedAttractionId(null);
            setSelectedDestination(city);
            if (category) {
              setActiveCategoryFilter(category);
            } else {
              setActiveCategoryFilter(null);
            }
            // Update URL
            window.history.pushState(
              {},
              "",
              `/destinations/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, "-"))}`,
            );
            window.scrollTo(0, 0);
          }}
          onNavigateToHome={navigateHome}
        />
      );
    }

    if (selectedDestination) {
      return (
        <ActivitiesPage
          destination={selectedDestination}
          onBack={navigateHome}
          onViewAttraction={handleViewAttraction}
          initialCategory={activeCategoryFilter}
        />
      );
    }

    if (currentPage === "attractions-and-museums") {
      return (
        <AttractionsAndMuseumsPage
          onBackToHome={navigateHome}
          onViewAttraction={handleViewAttraction}
          initialSearchQuery={globalSearchQuery}
          initialCategory={activeCategoryFilter || undefined}
        />
      );
    }

    if (currentPage === "hot-deals") {
      return (
        <HotDealsPage
          onBackToHome={navigateHome}
          onViewAttraction={handleViewAttraction}
        />
      );
    }

    if (currentPage === "blog") {
      return (
        <BlogPage
          onBackToHome={navigateHome}
          onViewAttraction={handleViewAttraction}
        />
      );
    }

    if (currentPage === "sign-in") {
      return (
        <SignInPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
          onNavigateToRegister={() => {
            setCurrentPage("register");
            window.history.pushState({}, "", "/register");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "register") {
      return (
        <RegisterPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
            window.history.pushState({}, "", "/sign-in");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "wishlist") {
      return (
        <WishlistPage
          onBackToHome={navigateHome}
          onNavigateToAttractions={() => {
            setCurrentPage("attractions-and-museums");
            window.history.pushState({}, "", "/attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onViewAttraction={handleViewAttraction}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
            window.history.pushState({}, "", "/login");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "my-bookings") {
      return (
        <MyBookingsPage
          onBackToHome={navigateHome}
          onNavigateToAttractions={() => {
            setCurrentPage("attractions-and-museums");
            window.history.pushState({}, "", "/attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
            window.history.pushState({}, "", "/login");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "profile") {
      return (
        <ProfilePage
          onBackToHome={navigateHome}
        />
      );
    }

    const handleTrustNavigate = (
      page:
        | "about"
        | "privacy-policy"
        | "cookie-policy"
        | "terms-and-conditions"
    ) => {
      setSelectedDestination(null);
      setSelectedAttractionId(null);
      setActiveCategoryFilter(null);
      setCurrentPage(page);
      window.history.pushState({}, "", `/${page}`);
      window.scrollTo(0, 0);
    };

    if (currentPage === "about") {
      return (
        <AboutPage
          onBackToHome={navigateHome}
          onExploreActivities={() => {
            setCurrentPage("attractions-and-museums");
            window.history.pushState({}, "", "/attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onSelectAttraction={handleViewAttraction}
          onSelectDestination={(dest) => {
            setSelectedDestination(dest);
            window.history.pushState(
              {},
              "",
              `/destinations/${encodeURIComponent(
                dest.toLowerCase().replace(/\s+/g, "-")
              )}`
            );
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "privacy-policy") {
      return (
        <PrivacyPolicyPage
          onBackToHome={navigateHome}
          onNavigate={handleTrustNavigate}
        />
      );
    }

    if (currentPage === "cookie-policy") {
      return (
        <CookiePolicyPage
          onBackToHome={navigateHome}
          onNavigate={handleTrustNavigate}
        />
      );
    }

    if (currentPage === "terms-and-conditions") {
      return (
        <TermsAndConditionsPage
          onBackToHome={navigateHome}
          onNavigate={handleTrustNavigate}
        />
      );
    }

    return (
      <main>
        <Hero
          onSelectDestination={(dest) => {
            setSelectedDestination(dest);
            window.history.pushState(
              {},
              "",
              `/destinations/${encodeURIComponent(dest.toLowerCase().replace(/\s+/g, "-"))}`,
            );
            window.scrollTo(0, 0);
          }}
          onSearch={handleGlobalSearch}
        />
        <ScrollReveal>
          <FeaturedDestinations
            onSelectDestination={(dest) => {
              setSelectedDestination(dest);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(dest.toLowerCase().replace(/\s+/g, "-"))}`,
              );
              window.scrollTo(0, 0);
            }}
          />
        </ScrollReveal>
        <RecentlyViewed
          items={recentlyViewedItems}
          onSelect={handleViewAttraction}
          onClear={clearRecentlyViewed}
        />
        <ScrollReveal delay={0.1}>
          <HotDeals
            onViewAttraction={handleViewAttraction}
            onViewAll={() => {
              setCurrentPage("hot-deals");
              window.history.pushState({}, "", "/hot-deals");
              window.scrollTo(0, 0);
            }}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <AdBanner
            onSelectDestination={(dest) => {
              setSelectedDestination(dest);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(dest.toLowerCase().replace(/\s+/g, "-"))}`,
              );
              window.scrollTo(0, 0);
            }}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PopularAttractions onViewAttraction={handleViewAttraction} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <LargeFeaturedBanner
            onSelectDestination={(dest) => {
              setSelectedDestination(dest);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(dest.toLowerCase().replace(/\s+/g, "-"))}`,
              );
              window.scrollTo(0, 0);
            }}
            onViewAttraction={handleViewAttraction}
            onNavigate={(url) => {
              if (url.startsWith("/")) {
                window.history.pushState({}, "", url);
                const parsed = parseInitialRoute();
                setSelectedAttractionId(parsed.attractionId);
                setSelectedDestination(parsed.destination);
                setCurrentPage(parsed.page);
                setActiveCategoryFilter(null);
                window.scrollTo(0, 0);
              }
            }}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <TrustBar />
        </ScrollReveal>
      </main>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen max-w-full overflow-x-clip bg-[#f0f4f8] dark:bg-slate-950 font-sans selection:bg-brand/10 selection:text-brand transition-colors duration-300">
        <LanguageDetectionBanner />
        <Header
          activePage={currentPage}
          activeDestination={selectedDestination}
          onWishlistOpen={() => setWishlistOpen(true)}
          onViewAttraction={handleViewAttraction}
          onExplore={navigateHome}
          onNavigate={(page) => {
            if (page === "home") {
              navigateHome();
            } else {
              setSelectedDestination(null);
              setSelectedAttractionId(null);
              setActiveCategoryFilter(null);
              setCurrentPage(page);
              window.history.pushState({}, "", `/${page}`);
              window.scrollTo(0, 0);
            }
          }}
          onSearch={handleGlobalSearch}
        />
        {mainContent()}
        <Footer
          onExplore={navigateHome}
          onNavigate={(page) => {
            setSelectedDestination(null);
            setSelectedAttractionId(null);
            setCurrentPage(page);
            if (page === "home") {
              window.history.pushState({}, "", "/");
            } else {
              window.history.pushState({}, "", `/${page}`);
            }
            window.scrollTo(0, 0);
          }}
        />

        <AnimatePresence>
          {wishlistOpen && (
            <WishlistSidebar
              isOpen={wishlistOpen}
              onClose={() => setWishlistOpen(false)}
              onViewAttraction={handleViewAttraction}
              onViewFullWishlist={() => {
                setSelectedDestination(null);
                setSelectedAttractionId(null);
                setCurrentPage("wishlist");
                window.history.pushState({}, "", "/wishlist");
                window.scrollTo(0, 0);
              }}
            />
          )}
        </AnimatePresence>

        {!selectedAttractionId && !wishlistOpen && (
          <MobileBottomNav
            activePage={currentPage}
            activeDestination={selectedDestination}
            onExplore={navigateHome}
            onWishlistOpen={() => setWishlistOpen(true)}
            onNavigate={(page) => {
              if (page === "home") {
                navigateHome();
              } else {
                setSelectedDestination(null);
                setSelectedAttractionId(null);
                setActiveCategoryFilter(null);
                setCurrentPage(page);
                window.history.pushState({}, "", `/${page}`);
                window.scrollTo(0, 0);
              }
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
