import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedDestinations from "./components/FeaturedDestinations";
import PopularAttractions from "./components/PopularAttractions";
import AdBanner from "./components/AdBanner";
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
import { POPULAR_ATTRACTIONS } from "./data/mockData";
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
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  let attrId = params.get("attraction");

  if (path.startsWith("/activities/")) {
    attrId = path.split("/activities/")[1]?.split("/")[0]?.split("?")[0]?.split("#")[0]?.trim() || null;
  }

  if (attrId) {
    return { page: "home", destination: null, attractionId: attrId };
  }

  let dest: string | null = null;
  if (path.startsWith("/destinations/")) {
    const destId = path.split("/destinations/")[1]?.split("/")[0]?.split("?")[0]?.split("#")[0]?.trim();
    if (destId) {
      dest = destId
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  if (dest) {
    return { page: "home", destination: dest, attractionId: null };
  }

  let page: AppPage = "home";
  if (path === "/blog" || path.startsWith("/blog/") || params.has("post")) {
    page = "blog";
  } else if (path === "/about") {
    page = "about";
  } else if (path === "/privacy" || path === "/privacy-policy") {
    page = "privacy-policy";
  } else if (path === "/cookies" || path === "/cookie-policy") {
    page = "cookie-policy";
  } else if (path === "/terms" || path === "/terms-and-conditions") {
    page = "terms-and-conditions";
  } else if (path === "/wishlist" || params.has("items")) {
    page = "wishlist";
  } else if (path === "/my-bookings") {
    page = "my-bookings";
  } else if (path === "/profile") {
    page = "profile";
  } else if (path === "/login" || path === "/sign-in") {
    page = "sign-in";
  } else if (path === "/hot-deals") {
    page = "hot-deals";
  } else if (path === "/attractions-and-museums" || path === "/things-to-do") {
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
    return () => window.removeEventListener("popstate", handlePopState);
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
    setCurrentPage("home");
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
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
          onBack={() => {
            setSelectedDestination(null);
            setActiveCategoryFilter(null);
            window.scrollTo(0, 0);
          }}
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
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onNavigateToAttractions={() => {
            setCurrentPage("attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onViewAttraction={handleViewAttraction}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "my-bookings") {
      return (
        <MyBookingsPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onNavigateToAttractions={() => {
            setCurrentPage("attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "profile") {
      return (
        <ProfilePage
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "about") {
      return (
        <AboutPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
          onExploreActivities={() => {
            setCurrentPage("attractions-and-museums");
            window.history.pushState({}, "", "/attractions-and-museums");
            window.scrollTo(0, 0);
          }}
          onSelectAttraction={(id) => {
            setSelectedAttractionId(id);
          }}
        />
      );
    }

    if (currentPage === "privacy-policy") {
      return (
        <PrivacyPolicyPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "cookie-policy") {
      return (
        <CookiePolicyPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (currentPage === "terms-and-conditions") {
      return (
        <TermsAndConditionsPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
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
          onSearch={(q) => {
            const queryLower = q.toLowerCase().trim();
            const matchingAttraction = POPULAR_ATTRACTIONS.find(
              (a) =>
                a.name.toLowerCase() === queryLower ||
                a.id.toLowerCase() === queryLower,
            );
            if (matchingAttraction) {
              setSelectedDestination(matchingAttraction.city);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(matchingAttraction.city.toLowerCase().replace(/\s+/g, "-"))}`,
              );
            } else {
              setSelectedDestination(q);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}`,
              );
            }
            setSelectedAttractionId(null);
            window.scrollTo(0, 0);
          }}
        />
        <ScrollReveal>
          <FeaturedDestinations onSelectDestination={setSelectedDestination} />
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
              window.scrollTo(0, 0);
            }}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <AdBanner onSelectDestination={setSelectedDestination} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PopularAttractions onViewAttraction={handleViewAttraction} />
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
          onSearch={(q) => {
            const queryLower = q.toLowerCase().trim();
            const matchingAttraction = POPULAR_ATTRACTIONS.find(
              (a) =>
                a.name.toLowerCase() === queryLower ||
                a.id.toLowerCase() === queryLower ||
                getDisplayProductId(a).toLowerCase() === queryLower ||
                a.name.toLowerCase().includes(queryLower)
            );
            if (matchingAttraction) {
              handleViewAttraction(matchingAttraction.id);
            } else {
              setSelectedDestination(q);
              window.history.pushState(
                {},
                "",
                `/destinations/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}`,
              );
              setSelectedAttractionId(null);
              setCurrentPage("home");
              window.scrollTo(0, 0);
            }
          }}
        />
        {mainContent()}
        <Footer
          onExplore={() => {
            setSelectedDestination(null);
            setSelectedAttractionId(null);
            setCurrentPage("home");
          }}
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
                window.scrollTo(0, 0);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
