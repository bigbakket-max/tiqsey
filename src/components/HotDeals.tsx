import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  Zap,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { useWishlist } from "../contexts/WishlistContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [rev, setRev] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setRev((prev) => prev + 1);
    };
    window.addEventListener("tiqsey_attractions_updated", handleUpdate);
    return () =>
      window.removeEventListener("tiqsey_attractions_updated", handleUpdate);
  }, []);

  // Filter attractions that have a discount price
  const dealAttractions = useMemo(() => {
    const list = POPULAR_ATTRACTIONS.filter(
      (attr) => attr.discountPrice && attr.discountPrice < attr.price,
    );
    // If list has fewer than 4 items, supplement with popular attractions with calculated discounts
    if (list.length < 4) {
      return POPULAR_ATTRACTIONS.slice(0, 6).map((attr) => ({
        ...attr,
        discountPrice:
          attr.discountPrice && attr.discountPrice < attr.price
            ? attr.discountPrice
            : Math.round(attr.price * 0.85),
      }));
    }
    return list;
  }, [rev]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);

      const cardWidth =
        scrollRef.current.firstElementChild?.clientWidth || 300;
      const index = Math.round(scrollLeft / (cardWidth + 20));
      setActiveSlideIndex(Math.max(0, Math.min(index, dealAttractions.length - 1)));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [dealAttractions.length]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth =
        scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({
        left: -(cardWidth + 24),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth =
        scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-12 md:py-16 bg-[#0c102a] text-white relative overflow-hidden border-y border-purple-500/20"
      id="hot-deals"
      style={{
        background:
          "radial-gradient(circle at 85% 15%, rgba(249, 115, 22, 0.35) 0%, rgba(147, 51, 234, 0.25) 35%, rgba(12, 16, 42, 0.95) 70%), linear-gradient(135deg, #090d23 0%, #15113d 50%, #0a0d24 100%)",
      }}
    >
      {/* Decorative Dot Matrix Pattern on Top Right */}
      <div
        className="absolute top-6 right-8 w-44 h-44 pointer-events-none opacity-30 hidden sm:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(251, 146, 60, 0.8) 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Radiant Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-orange-500/25 via-pink-600/20 to-purple-800/30 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[400px] bg-purple-700/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Deal Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-black uppercase tracking-wider mb-3 backdrop-blur-md shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{t("exploreMore", "EXPLORE MORE")}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Hot Deals on{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Experiences
              </span>
            </h2>
            <p className="text-slate-300/90 mt-2 text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
              Grab the best deals on your dream experiences and create memories you'll cherish forever.
            </p>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="group self-start md:self-auto flex items-center gap-2 px-6 py-2.5 rounded-full border border-orange-500/60 bg-white/5 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 font-bold text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-sm select-none cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95"
            >
              <span>{t("viewAllDeals", "VIEW ALL DEALS")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Dynamic Horizontal Scroll Container with floating arrows */}
        <div className="relative group/slider">
          {/* Left Floating Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!showLeftScroll}
            className={`absolute left-0 md:-left-5 top-[45%] -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#131938]/95 backdrop-blur-md border border-orange-500/40 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 shadow-[0_8px_20px_rgba(0,0,0,0.5)] active:scale-90 transition-all duration-300 select-none cursor-pointer ${
              !showLeftScroll
                ? "opacity-0 pointer-events-none scale-90"
                : "opacity-100 hover:scale-105"
            }`}
            aria-label="Previous Deal"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Right Floating Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            disabled={!showRightScroll}
            className={`absolute right-0 md:-right-5 top-[45%] -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#131938]/95 backdrop-blur-md border border-orange-500/40 flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 shadow-[0_8px_20px_rgba(0,0,0,0.5)] active:scale-90 transition-all duration-300 select-none cursor-pointer ${
              !showRightScroll
                ? "opacity-0 pointer-events-none scale-90"
                : "opacity-100 hover:scale-105"
            }`}
            aria-label="Next Deal"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Carousel Cards */}
          <motion.div
            layout
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex flex-row overflow-x-auto pb-4 gap-5 md:gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="popLayout">
              {dealAttractions.map((attr) => {
                const discountRatio = attr.discountPrice
                  ? Math.round(
                      ((attr.price - attr.discountPrice) / attr.price) * 100,
                    )
                  : 15;

                return (
                  <motion.div
                    key={attr.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group relative bg-[#131838]/85 hover:bg-[#181f45] backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)] border border-white/10 hover:border-orange-500/40 flex flex-col h-full transform hover:-translate-y-1.5 transition-all duration-300 w-[290px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
                  >
                    {/* Top image and badge overlay */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={attr.imageUrl}
                        alt={attr.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark gradient vignette for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131838] via-transparent to-black/30 z-10" />

                      {/* Deal sticker badge */}
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-md shadow-md">
                        <Zap className="w-3 h-3 fill-slate-950 stroke-none" />
                        <span>SAVE {discountRatio}%</span>
                      </div>

                      {/* Heart/Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(attr);
                        }}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center shadow-md border border-white/20 hover:bg-rose-950/40 text-zinc-300 transition-all active:scale-90 group/fav cursor-pointer"
                        title={
                          isWishlisted(attr.id)
                            ? "Remove from Wishlist"
                            : "Save to Wishlist"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isWishlisted(attr.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isWishlisted(attr.id)
                              ? "text-[#e3000f] fill-[#e3000f]"
                              : "text-white group-hover/fav:text-rose-400"
                          }`}
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
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Location text label */}
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">
                            {attr.city}
                            {attr.country ? `, ${attr.country}` : ""}
                          </span>
                        </div>

                        {/* Deal title descriptor */}
                        <h3 className="font-extrabold text-sm sm:text-[15px] text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors min-h-[42px]">
                          {attr.name}
                        </h3>

                        {/* Brief description */}
                        <p className="text-xs text-slate-300/80 line-clamp-2 font-normal mt-1.5 mb-3 leading-relaxed">
                          {attr.description ||
                            "Experience the magic with fast-track entry and an unforgettable tour."}
                        </p>

                        {/* Deal stats bar */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 border-t border-white/10 w-full py-2.5">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{attr.rating || "4.8"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{attr.duration || "1-2 hrs"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer pricing and action CTA button */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                        <div className="flex flex-col">
                          <div className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
                            {formatPrice(
                              attr.discountPrice || attr.price,
                              attr.currency,
                            )}
                          </div>
                          {attr.discountPrice && (
                            <span className="text-[11px] font-medium text-slate-400 line-through">
                              {formatPrice(attr.price, attr.currency)}
                            </span>
                          )}
                        </div>

                        {/* Dynamic CTA button */}
                        <button
                          onClick={() => onViewAttraction(attr.id)}
                          className="bg-gradient-to-r from-[#FF5500] via-[#FF6611] to-[#FF7733] hover:from-[#ff4400] hover:to-[#ff6622] text-white font-black text-xs uppercase tracking-wider px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95 transition-all flex items-center gap-1 select-none cursor-pointer"
                        >
                          <span>BOOK DEAL</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Dot Pagination indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {dealAttractions.slice(0, Math.min(6, dealAttractions.length)).map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth =
                      scrollRef.current.firstElementChild?.clientWidth || 300;
                    scrollRef.current.scrollTo({
                      left: i * (cardWidth + 24),
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlideIndex === i
                    ? "w-6 bg-amber-400"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

