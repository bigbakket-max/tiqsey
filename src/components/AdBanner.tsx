import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { PromotionalBanner } from '../types';
import { getStoredBanners, BANNER_UPDATE_EVENT, DEFAULT_PROMOTIONAL_BANNERS } from '../utils/bannerStorage';
import BannerCard from './BannerCard';

interface AdBannerProps {
  onSelectDestination?: (dest: string) => void;
  onNavigate?: (view: string) => void;
}

export default function AdBanner({ onSelectDestination, onNavigate }: AdBannerProps) {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);

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
        setBanners(activeBanners.slice(0, 6));
      } else {
        // If all are inactive, show default set or active ones
        const anyActive = all.filter(b => b.isActive);
        const toShow = anyActive.length > 0 ? anyActive : DEFAULT_PROMOTIONAL_BANNERS;
        setBanners(toShow.slice(0, 6));
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

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="py-6 overflow-hidden select-none" id="promotional-banner">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <span className="text-[#e3000f] font-bold text-xs mb-1 block tracking-wider uppercase">
              Exclusive Offers & Best Deals
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Activities Promotions
            </h2>
          </div>
        </div>

        {/* Promotions Grid (3 banners in a single row on desktop/tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {banners.map((banner) => (
            <BannerCard 
              key={banner.id} 
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
          ))}
        </div>

      </div>
    </section>
  );
}
