import React, { useState, useEffect } from "react";
import {
  Smartphone,
  BadgeCheck,
  Sparkles,
  Star,
  Clock,
  Ticket,
} from "lucide-react";
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
import { Attraction } from "./types";
import AttractionsAndMuseumsPage from "./components/AttractionsAndMuseumsPage";
import HotDealsPage from "./components/HotDealsPage";
import BlogPage from "./components/BlogPage";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import WishlistPage from "./components/WishlistPage";
import MyBookingsPage from "./components/MyBookingsPage";
import ProfilePage from "./components/ProfilePage";

import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const { t } = useSettings();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    "home" | "attractions-and-museums" | "hot-deals" | "blog" | "sign-in" | "register" | "wishlist" | "my-bookings" | "profile"
  >("home");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null,
  );
  const [selectedAttractionId, setSelectedAttractionId] = useState<
    string | null
  >(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

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
  }, [recentlyViewedIds]);

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

  // Handle loading attraction from URL (path or query params)
  useEffect(() => {
    try {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      let attrId = params.get("attraction");

      if (path.startsWith("/activities/")) {
        attrId = path.split("/activities/")[1];
      } else if (path.startsWith("/destinations/")) {
        const destId = path.split("/destinations/")[1];
        if (destId) {
          const formattedDest = destId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          setSelectedDestination(formattedDest);
        }
      } else if (path === "/blog" || path.startsWith("/blog/") || params.has("post")) {
        setCurrentPage("blog");
      } else if (path === "/wishlist" || params.has("items")) {
        setCurrentPage("wishlist");
      }

      if (attrId) {
        setSelectedAttractionId(attrId);
        // Ensure it is in recently viewed
        setRecentlyViewedIds((prev) => {
          const filtered = prev.filter((item) => item !== attrId);
          const updated = [attrId!, ...filtered].slice(0, 20);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error("Error handling initial attraction from URL", e);
    }
  }, []);

  const handleCloseDetail = () => {
    setSelectedAttractionId(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("attraction")) {
        url.searchParams.delete("attraction");
      }
      if (url.pathname.startsWith("/activities/")) {
        url.pathname = "/";
      }
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      console.error("Error rewriting URL on detail close", e);
    }
  };

  const handleViewAttraction = (id: string) => {
    addToRecentlyViewed(id);

    // Always open the activity booking page in a new window/tab using SEO-friendly URL
    try {
      const url = `${window.location.origin}/activities/${encodeURIComponent(id)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error("Failed to open booking page in a new tab", e);
      // Fallback to state-based detail box if window.open fails
      setSelectedAttractionId(id);
      window.history.pushState({}, "", `/activities/${encodeURIComponent(id)}`);
      window.scrollTo(0, 0);
    }
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
          onNavigateToHome={() => {
            setSelectedAttractionId(null);
            setSelectedDestination(null);
            setActiveCategoryFilter(null);
            setCurrentPage("home");
            // Update URL
            window.history.pushState({}, "", "/");
            window.scrollTo(0, 0);
          }}
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
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onViewAttraction={handleViewAttraction}
        />
      );
    }

    if (currentPage === "hot-deals") {
      return (
        <HotDealsPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onViewAttraction={handleViewAttraction}
        />
      );
    }

    if (currentPage === "blog") {
      return (
        <BlogPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onViewAttraction={handleViewAttraction}
        />
      );
    }

    if (currentPage === "sign-in") {
      return (
        <SignInPage
          onBackToHome={() => {
            setCurrentPage("home");
            window.scrollTo(0, 0);
          }}
          onNavigateToRegister={() => {
            setCurrentPage("register");
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
            window.scrollTo(0, 0);
          }}
          onNavigateToSignIn={() => {
            setCurrentPage("sign-in");
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
          onExplore={() => {
            setSelectedDestination(null);
            setSelectedAttractionId(null);
            setCurrentPage("home");
          }}
          onNavigate={(page) => {
            setSelectedDestination(null);
            setSelectedAttractionId(null);
            setCurrentPage(page);
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
            setCurrentPage("home");
            window.scrollTo(0, 0);
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
