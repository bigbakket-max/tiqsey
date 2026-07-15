import React from 'react';
import { X, Heart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../contexts/WishlistContext';
import { useSettings } from '../contexts/SettingsContext';
import { Attraction } from '../types';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAttraction: (id: string) => void;
  onViewFullWishlist?: () => void;
}

export default function WishlistSidebar({ isOpen, onClose, onViewAttraction, onViewFullWishlist }: WishlistSidebarProps) {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { formatPrice, t } = useSettings();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark overlay backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-[120] backdrop-blur-[2px]"
        />
      )}

      {/* Slide-out Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={isOpen ? { x: 0 } : { x: '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-2xl z-[130] flex flex-col font-sans"
        id="wishlist-sidebar-container"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#e3000f] fill-[#e3000f]" />
            <h2 className="text-[17px] font-extrabold text-slate-800 dark:text-slate-150">
              Saved Wishlist
            </h2>
            <span className="bg-rose-50 dark:bg-rose-950/30 text-[#e3000f] dark:text-rose-400 text-xs font-black px-2.5 py-0.5 rounded-full select-none">
              {wishlist.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-350 dark:text-slate-650 mb-4 border border-dashed border-slate-200 dark:border-slate-800">
                <Heart className="w-7 h-7 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[280px] leading-relaxed">
                Start searching or exploring. Click the heart icon on any attraction card to catalog your favorites right here!
              </p>
              <button
                onClick={onClose}
                className="mt-6 flex items-center gap-2 text-xs font-black text-brand uppercase tracking-wider hover:underline"
              >
                <span>Find Attractions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 pb-1 uppercase tracking-widest">
                <span>Selected Items</span>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                      clearWishlist();
                    }
                  }}
                  className="text-[#e3000f]/80 hover:text-[#e3000f] transition-colors flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex gap-3 h-24 items-center group/item hover:bg-slate-50/30 dark:hover:bg-slate-900/10 rounded-xl transition-colors pr-2"
                  >
                    {/* Thumbnail Image */}
                    <div 
                      onClick={() => {
                        onViewAttraction(item.id);
                        onClose();
                      }}
                      className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer relative shrink-0 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Metadata */}
                    <div 
                      onClick={() => {
                        onViewAttraction(item.id);
                        onClose();
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        {item.city}
                      </span>
                      <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-800 dark:text-slate-200 leading-tight truncate mt-0.5 group-hover/item:text-brand transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs font-extrabold text-[#e3000f] mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-normal">From</span>
                        <span>{formatPrice(item.discountPrice || item.price)}</span>
                      </p>
                    </div>

                    {/* Trash remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-350 hover:text-[#e3000f] dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <button
              onClick={() => {
                onClose();
                if (onViewFullWishlist) {
                  onViewFullWishlist();
                } else {
                  // Fallback
                  const el = document.getElementById('discover-attractions-section') || document.getElementById('search-container');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="w-full h-11 bg-[#e3000f] text-white text-[13.5px] font-black uppercase tracking-wider rounded-xl hover:bg-opacity-95 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Saved Favorites</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
