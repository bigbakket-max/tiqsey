import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  Sparkles,
  Tag,
  Percent,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { useWishlist } from "../contexts/WishlistContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import { Attraction } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HotDealsProps {
  onViewAttraction: (id: string) => void;
  onViewAll?: () => void;
}

export default function HotDeals({
  onViewAttraction,
  onViewAll,
}: HotDealsProps) {
  const { t, formatPrice } = useSettings();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const [rev, setRev] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setRev(prev => prev + 1);
    };
    window.addEventListener("tiqsey_attractions_updated", handleUpdate);
    return () => window.removeEventListener("tiqsey_attractions_updated", handleUpdate);
  }, []);

  // Filter attractions that have a discount price
  const dealAttractions = useMemo(() => {
    return POPULAR_ATTRACTIONS.filter(
      (attr) => attr.discountPrice && attr.discountPrice < attr.price,
    );
  }, [rev]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [dealAttractions.length]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({
        left: -(cardWidth + 24),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  };

  // Save random tickets remaining for urgency simulation (keyed by attraction ID)
  const [ticketLimits] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    dealAttractions.forEach((attr) => {
      // Use id characters to deterministically/consistently seed a small number (e.g. 2 to 7)
      const num = 2 + (attr.id.charCodeAt(0) % 6);
      map[attr.id] = num;
    });
    return map;
  });

  return (
    <section
      className="py-8 md:py-9 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white relative overflow-hidden border-y border-amber-500/10 rounded-tr-3xl"
      id="hot-deals"
    >
      {/* Decorative Golden Ambient Glow Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Deal Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-md shadow-amber-500/10">
                <Flame className="w-2.5 h-2.5 fill-black stroke-none" />
                <span>Limited Time Offers</span>
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-[-0.04em] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500">
              Hot Deals on Experiences
            </h2>
            <p className="text-zinc-400 mt-1.5 text-xs md:text-sm font-medium max-w-2xl">
              Grab these handpicked travel experiences with premium price cuts
              before they disappear!
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="group self-start lg:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/30 hover:border-amber-400/60 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 select-none cursor-pointer"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Dynamic Horizontal Scroll Container wrapped in sliding controls */}
        <div className="relative group/slider">
          {/* Left Floating Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!showLeftScroll}
            className={`absolute left-2 md:-left-5 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-950/90 backdrop-blur-md border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:border-amber-400/50 active:scale-95 transition-all duration-300 select-none ${
              !showLeftScroll
                ? "opacity-0 pointer-events-none scale-90"
                : "opacity-100 hover:scale-105"
            }`}
            aria-label="Previous Deal"
          >
            <ChevronLeft className="w-6 h-6 text-amber-400" strokeWidth={3} />
          </button>

          {/* Right Floating Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            disabled={!showRightScroll}
            className={`absolute right-2 md:-right-5 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-950/90 backdrop-blur-md border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:border-amber-400/50 active:scale-95 transition-all duration-300 select-none ${
              !showRightScroll
                ? "opacity-0 pointer-events-none scale-90"
                : "opacity-100 hover:scale-105"
            }`}
            aria-label="Next Deal"
          >
            <ChevronRight className="w-6 h-6 text-amber-400" strokeWidth={3} />
          </button>

          <motion.div
            layout
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex flex-row overflow-x-auto pb-6 gap-5 md:gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="popLayout">
              {dealAttractions.map((attr) => {
                const discountRatio = attr.discountPrice
                  ? Math.round(
                      ((attr.price - attr.discountPrice) / attr.price) * 100,
                    )
                  : 0;
                const savedAmount = attr.discountPrice
                  ? attr.price - attr.discountPrice
                  : 0;
                const limit = ticketLimits[attr.id] || 4;

                return (
                  <motion.div
                    key={attr.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-zinc-950/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)] border border-amber-500/10 hover:border-amber-400/40 flex flex-col h-full transform hover:-translate-y-1.5 transition-all duration-300 w-[280px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
                  >
                    {/* Top image and badge overlay */}
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-amber-500/10">
                      <img
                        src={attr.imageUrl}
                        alt={attr.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark gradient vignette for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40 z-10" />

                      {/* Highly eye-catching deal sticker badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md">
                        <Percent className="w-2.5 h-2.5 text-black" />
                        <span>SAVE {discountRatio}%</span>
                      </div>

                      {/* Heart/Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(attr);
                        }}
                        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md border border-zinc-800 text-zinc-300 hover:bg-rose-500 hover:text-white hover:border-transparent transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isWishlisted(attr.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          className={`w-3.5 h-3.5 ${isWishlisted(attr.id) ? "text-rose-500 fill-rose-500 stroke-none" : ""}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Body Info block */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Location text label */}
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500/80 block mb-0.5">
                          {attr.city} • {attr.category}
                        </span>

                        {/* Deal title descriptor */}
                        <h3 className="font-extrabold text-xs sm:text-sm text-zinc-100 line-clamp-2 leading-tight group-hover:text-amber-300 transition-colors h-[2.1rem]">
                          {attr.name}
                        </h3>

                        {/* Brief description */}
                        {attr.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2 font-medium mt-1 mb-2 leading-normal">
                            {attr.description}
                          </p>
                        )}

                        {/* Deal stats bar */}
                        <div className="flex items-center gap-2.5 mb-2.5 text-xs font-semibold text-zinc-455 border-y border-zinc-90 w-full py-1.5">
                          <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-300 text-[10px] font-bold border border-amber-500/10">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{attr.rating}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            ({attr.reviewsCount?.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Footer pricing and action clicker button */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                            Original {formatPrice(attr.price)}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-lg font-black text-amber-400 leading-none">
                              {formatPrice(attr.discountPrice || attr.price)}
                            </span>
                            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-300 font-extrabold border border-amber-500/10">
                              Save {formatPrice(savedAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic CTA button */}
                        <button
                          onClick={() => onViewAttraction(attr.id)}
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg transition-all shadow-[0_3px_10px_rgba(245,158,11,0.15)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.3)] flex items-center gap-0.5"
                        >
                          <span>Book Deal</span>
                          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
