import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Tag, Flame, ArrowRight } from 'lucide-react';
import { PromotionalBanner } from '../types';
import { getStoredBanners, BANNER_UPDATE_EVENT, DEFAULT_PROMOTIONAL_BANNERS } from '../utils/bannerStorage';
import { useSettings } from '../contexts/SettingsContext';
import BannerCard from './BannerCard';

interface AdBannerProps {
  onSelectDestination?: (dest: string) => void;
  onNavigate?: (view: string) => void;
}

export default function AdBanner({ onSelectDestination, onNavigate }: AdBannerProps) {
  const { t } = useSettings();
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadBanners = () => {
      const all = getStoredBanners();
      const now = new Date().toISOString();
      
      // Filter active and currently valid date-scheduled banners
      const activeBanners = all.filter(b => {
        if (!b.isActive) return false;
        if (b.startDate && b.startDate > now.substring(0, 10)) return false;
        if (b.endDate && b.endDate < now.substring(0, 10)) return false;
        return true;
      });

      if (activeBanners.length > 0) {
        setBanners(activeBanners);
      } else {
        const anyActive = all.filter(b => b.isActive);
        const toShow = anyActive.length > 0 ? anyActive : DEFAULT_PROMOTIONAL_BANNERS;
        setBanners(toShow);
      }
    };

    loadBanners();

    // Listen for real-time banner update events from admin panel
    const handleUpdate = () => {
      loadBanners();
    };

    window.addEventListener(BANNER_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(BANNER_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [banners]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  // Symmetrical, perfectly balanced grid columns on desktop:
  // 4 cards -> lg:grid-cols-4 (all 4 in 1 single row, 2x2 on tablet)
  // 3 cards -> lg:grid-cols-3
  // 2 cards -> sm:grid-cols-2 max-w-4xl
  // >4 cards -> lg:grid-cols-4 or scrollable
  const gridColsClass = 
    banners.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
    banners.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto' :
    banners.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="py-6 sm:py-8 overflow-hidden select-none bg-transparent" id="promotional-banner">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-[#e3000f] font-bold text-xs mb-1.5 uppercase tracking-wider border border-red-500/20">
              <Sparkles className="w-3 h-3 text-[#e3000f]" />
              <span>{t('exclusiveOffersDeals', 'Exclusive Offers & Best Deals')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('activitiesPromotions', 'Activities Promotions')}
              </h2>
              
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{banners.length} {t('deals', 'Offers')}</span>
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            {banners.length > 4 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    canScrollLeft 
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 shadow-xs active:scale-95 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Previous promotions"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    canScrollRight 
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 shadow-xs active:scale-95 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Next promotions"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/hot-deals');
                } else {
                  const el = document.getElementById('hot-deals');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#e3000f] hover:text-[#c7000d] transition-colors group cursor-pointer"
            >
              <span>{t('viewAllOffers', 'View all deals')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Promotions Balanced Grid & Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className={`grid ${gridColsClass} gap-4 sm:gap-5 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scroll-smooth no-scrollbar`}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full min-w-[260px] sm:min-w-0">
              <BannerCard 
                banner={banner} 
                onSelectDestination={onSelectDestination}
                onNavigateAction={(url) => {
                  if (onNavigate) {
                    onNavigate(url);
                  } else if (url.startsWith('#')) {
                    const targetId = url.replace('#', '');
                    const el = document.getElementById(targetId);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
