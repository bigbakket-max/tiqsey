import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { ApiService } from "../services/apiService";
import { Destination } from "../types";
import ErrorMessage from "./ErrorMessage";

interface FeaturedDestinationsProps {
  onSelectDestination: (destination: string) => void;
}

const DEFAULT_POPULAR_DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    attractionsCount: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dubai",
    name: "Dubai",
    attractionsCount: 320,
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "london",
    name: "London",
    attractionsCount: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rome",
    name: "Rome",
    attractionsCount: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bali",
    name: "Bali",
    attractionsCount: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    attractionsCount: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prague",
    name: "Prague",
    attractionsCount: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "santorini",
    name: "Santorini",
    attractionsCount: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "new-york",
    name: "New York",
    attractionsCount: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    attractionsCount: 160,
    imageUrl:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
  },
];

export default function FeaturedDestinations({
  onSelectDestination,
}: FeaturedDestinationsProps) {
  const { t } = useSettings();
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_POPULAR_DESTINATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchDestinations() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ApiService.getDestinations();
        if (isMounted) {
          if (data && data.length >= 10) {
            setDestinations(data.slice(0, 10));
          } else {
            setDestinations(DEFAULT_POPULAR_DESTINATIONS);
          }
        }
      } catch (err) {
        if (isMounted) {
          setDestinations(DEFAULT_POPULAR_DESTINATIONS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchDestinations();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ErrorMessage
            onRetry={() => window.location.reload()}
            message={error}
          />
        </div>
      </section>
    );
  }

  const itemsToDisplay = destinations.length > 0 ? destinations.slice(0, 10) : DEFAULT_POPULAR_DESTINATIONS;

  return (
    <section className="py-8 md:py-10 bg-transparent" id="destinations">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <span className="text-brand font-bold text-xs uppercase tracking-wider mb-2 block">
            Take a look
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            {t("popularDestinations")}
          </h2>
        </div>

        {/* 2 Rows x 5 Columns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="aspect-[4/4] rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col items-start gap-1.5">
                    <div className="h-5 w-2/3 bg-gray-300 dark:bg-slate-700 rounded-md"></div>
                    <div className="h-3 w-1/2 bg-gray-300/80 dark:bg-slate-700/80 rounded-md"></div>
                  </div>
                </div>
              ))
            : itemsToDisplay.map((dest) => (
                <div
                  key={dest.id}
                  className="group relative aspect-[4/4] rounded-2xl sm:rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 select-none"
                  onClick={() => onSelectDestination(dest.name)}
                >
                  {/* Full bleed cover image */}
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                  {/* Card Content at bottom left */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 text-left z-10">
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-black leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {dest.name}
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-xs font-medium mt-0.5 sm:mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {dest.attractionsCount || "150+"} Experiences
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

