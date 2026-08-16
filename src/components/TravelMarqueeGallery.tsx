import React, { useState, useEffect } from "react";
import { Star, MapPin, Ticket, Flame } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import { Attraction } from "../types";

interface TravelMarqueeGalleryProps {
  onSelectAttraction?: (id: string) => void;
}

const MarqueeCard = ({ attraction, onClick }: { attraction: Attraction; onClick?: (id: string) => void }) => {
  const { formatPrice } = useSettings();
  const [imgSrc, setImgSrc] = useState(attraction.imageUrl);

  useEffect(() => {
    setImgSrc(attraction.imageUrl);
  }, [attraction.imageUrl]);

  const handleImageError = () => {
    const fallbacks: Record<string, string> = {
      Museum: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
      Adventure: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
      Landmark: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      Nature: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600",
      Show: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
      Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
      Cruise: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    };
    const key = attraction.category || "";
    setImgSrc(fallbacks[key] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600");
  };

  const discountPercent =
    attraction.discountPrice && attraction.price > 0
      ? Math.round(((attraction.price - attraction.discountPrice) / attraction.price) * 100)
      : 0;

  return (
    <div
      onClick={() => onClick?.(attraction.id)}
      className="w-[210px] sm:w-[240px] md:w-[260px] shrink-0 bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand/40 dark:hover:border-brand/40 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative flex flex-col"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />

        {/* Top Badges */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none">
          {discountPercent > 0 ? (
            <span className="bg-[#FF0000] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-white stroke-none" />
              -{discountPercent}%
            </span>
          ) : attraction.category ? (
            <span className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
              {attraction.category}
            </span>
          ) : (
            <div />
          )}

          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-black text-slate-900 dark:text-slate-100 flex items-center gap-1 shadow-md border border-slate-100 dark:border-slate-800">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 shrink-0" />
            <span>{attraction.rating ? attraction.rating.toFixed(1) : "4.8"}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-grow text-left">
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
          {attraction.name}
        </h4>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mt-1 font-medium">
          <MapPin className="w-3 h-3 shrink-0 text-brand dark:text-brand-light" />
          <span className="truncate">{attraction.location}</span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <Ticket className="w-2.5 h-2.5" />
            <span>Instant</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] block font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From</span>
            <span className="text-xs sm:text-sm font-black text-brand dark:text-brand-light leading-none">
              {formatPrice(attraction.discountPrice || attraction.price, attraction.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TravelMarqueeGallery({ onSelectAttraction }: TravelMarqueeGalleryProps) {
  // Extract real activity listing cards directly from website POPULAR_ATTRACTIONS data
  const attractions = POPULAR_ATTRACTIONS && POPULAR_ATTRACTIONS.length > 0 ? POPULAR_ATTRACTIONS : [];

  // Distribute real listing activity cards across 3 rows using modulo for a varied mix
  const row1 = attractions.filter((_, idx) => idx % 3 === 0);
  const row2 = attractions.filter((_, idx) => idx % 3 === 1);
  const row3 = attractions.filter((_, idx) => idx % 3 === 2);

  return (
    <div className="w-full overflow-hidden space-y-4 sm:space-y-5 py-2 select-none relative">
      {/* Row 1: Right to Left (Scrolls Left) */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 sm:gap-5 w-max animate-marquee-left hover:[animation-play-state:paused]">
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row1.map((item) => (
              <MarqueeCard key={`r1-a-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row1.map((item) => (
              <MarqueeCard key={`r1-b-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Left to Right (Scrolls Right) */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 sm:gap-5 w-max animate-marquee-right hover:[animation-play-state:paused]">
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row2.map((item) => (
              <MarqueeCard key={`r2-a-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row2.map((item) => (
              <MarqueeCard key={`r2-b-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Right to Left (Scrolls Left) */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 sm:gap-5 w-max animate-marquee-left hover:[animation-play-state:paused]">
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row3.map((item) => (
              <MarqueeCard key={`r3-a-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
          <div className="flex gap-4 sm:gap-5 shrink-0">
            {row3.map((item) => (
              <MarqueeCard key={`r3-b-${item.id}`} attraction={item} onClick={onSelectAttraction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
