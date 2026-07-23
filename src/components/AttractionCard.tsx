import React from 'react';
import { Star, Flame, Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Attraction } from '../types';
import { motion } from 'motion/react';

interface Props {
  attr: Attraction;
  onClick?: (id: string) => void;
  size?: 'sm' | 'md';
}

export default function AttractionCard({ attr, onClick, size = 'md' }: Props) {
  const { formatPrice } = useSettings();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [imgSrc, setImgSrc] = React.useState(attr.imageUrl);
  const isSm = size === 'sm';
  const isFav = isWishlisted(attr.id);

  React.useEffect(() => {
    setImgSrc(attr.imageUrl);
  }, [attr.imageUrl]);

  const handleImageError = () => {
    const fallbacks: Record<string, string> = {
      Museum: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
      Adventure: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
      Landmark: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      Nature: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800',
      Show: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
      Cruise: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    };
    const key = attr.category || '';
    setImgSrc(fallbacks[key] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800');
  };

  return (
    <div
      data-attraction-card={attr.id}
      className="group flex flex-col cursor-pointer bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 border border-slate-100/80 dark:border-slate-850 relative h-full animate-fadeIn"
      onClick={() => onClick?.(attr.id)}
    >
      <div className="relative aspect-[1.5/1] overflow-hidden rounded-t-2xl">
        <img 
          src={imgSrc} 
          alt={attr.name}
          onError={handleImageError}
          className={`relative z-10 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${attr.isAvailable === false ? 'grayscale opacity-70' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle hover gradient overlay */}
        <div className="absolute inset-0 z-15 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Wishlist Floating Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(attr);
          }}
          className="absolute top-3 right-3 z-25 flex items-center justify-center w-8.5 h-8.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-100/50 dark:border-slate-800/50 backdrop-blur-xs transition-colors cursor-pointer group/fav"
          title={isFav ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label={isFav ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <motion.div
            animate={isFav ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-200 ${
                isFav 
                  ? 'fill-[#e3000f] text-[#e3000f]' 
                  : 'text-slate-600 dark:text-slate-400 group-hover/fav:text-[#e3000f] dark:group-hover/fav:text-[#e3000f]'
              }`} 
            />
          </motion.div>
        </motion.button>
 
        {attr.isAvailable === false ? (
          <div className="absolute top-3 left-3 z-20 flex items-center bg-rose-950/90 text-rose-200 border border-rose-500/35 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-xs select-none">
            <span>Currently Unavailable</span>
          </div>
        ) : attr.discountPrice ? (
          <div className="absolute top-3 left-3 z-20 flex items-center bg-black/80 rounded-full p-0.5 shadow-md select-none border border-white/5">
            <div className="flex items-center gap-1 bg-[#FF0000] text-white rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
              <Flame className="w-2.5 h-2.5 fill-white stroke-none animate-pulse" />
              <span>Hot Deal</span>
            </div>
            <span className="text-white font-extrabold px-2 text-[10px] tracking-tight">
              -{Math.round(((attr.price - attr.discountPrice) / attr.price) * 100)}%
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 flex flex-col p-5">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span>{attr.city}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-700" />
          <span className="whitespace-nowrap">{attr.category}</span>
        </p>
        
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-brand transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">
          {attr.name}
        </h3>
        
        {attr.description && (
          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
            {attr.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between w-full pt-4 border-t border-slate-100 dark:border-slate-800/60">
          {/* Enhanced Golden Rating Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FFF9EB] dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 rounded-full h-7">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span className="text-[11px] font-black text-amber-900 dark:text-amber-200 leading-none">{attr.rating}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-none">({attr.reviewsCount?.toLocaleString()})</span>
          </div>
          
          {/* Stacked Modern Premium Price feed */}
          {attr.isAvailable === false ? (
            <div className="text-right flex flex-col items-end shrink-0 select-none">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">
                Status
              </span>
              <span className="text-[11px] sm:text-xs font-black text-rose-600 dark:text-rose-400 leading-none bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 px-2 py-1 rounded">
                Not Available
              </span>
            </div>
          ) : (
            <div className="text-right flex flex-col items-end shrink-0 select-none">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                From
              </span>
              {attr.discountPrice ? (
                <div className="flex flex-col items-end gap-0.5 select-none">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-bold leading-none">
                    {formatPrice(attr.price, attr.currency)}
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#FF0022] dark:text-[#FF3E4E] leading-none">
                    {formatPrice(attr.discountPrice, attr.currency)}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-none">
                  {formatPrice(attr.price, attr.currency)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
