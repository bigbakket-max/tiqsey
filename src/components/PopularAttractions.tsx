import React, { useState, useEffect } from 'react';
import { Star, Plus, Minus, Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { ApiService } from '../services/apiService';
import { Attraction } from '../types';
import ErrorMessage from './ErrorMessage';
import AttractionCard from './AttractionCard';
import AttractionCardSkeleton from './AttractionCardSkeleton';

const MAX_TOTAL_ATTRACTIONS = 20;
const INITIAL_VISIBLE_COUNT = 8; 

export default function PopularAttractions({ onViewAttraction }: { onViewAttraction?: (id: string) => void }) {
  const { t, formatPrice } = useSettings();
  
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    let isMounted = true;
    async function fetchAttractions() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ApiService.getPopularAttractions();
        if (isMounted) {
          // Filter out hot deals (attractions that have discountPrice < price)
          const nonDealData = data.filter(attr => !attr.discountPrice || attr.discountPrice >= attr.price);
          setAttractions(nonDealData.slice(0, MAX_TOTAL_ATTRACTIONS));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load attractions');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchAttractions();

    const handleUpdate = () => {
      fetchAttractions();
    };
    window.addEventListener('tiqsey_attractions_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('tiqsey_attractions_updated', handleUpdate);
    };
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, attractions.length));
  };

  const visibleAttractions = attractions.slice(0, visibleCount);
  const hasMore = visibleCount < attractions.length;

  if (error) {
    return (
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ErrorMessage 
            onRetry={() => window.location.reload()} 
            message={error}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 md:py-6 bg-transparent" id="popular-attractions">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-5 text-left">
          <span className="text-brand font-bold text-xs mb-3 block tracking-wide">{t('curatedSelection')}</span>
          <h2 className="text-2xl md:text-4xl font-black text-[#1a2b48] dark:text-white tracking-[-0.04em] leading-[1.1]">{t('topRatedAttractions')}</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 animate-fadeIn">
            {Array.from({ length: visibleCount || 8 }).map((_, i) => (
              <AttractionCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {visibleAttractions.map((attr) => (
                  <AttractionCard key={attr.id} attr={attr} onClick={onViewAttraction} />
                ))}
            </div>

            <div className="mt-6 flex justify-center">
              {hasMore ? (
                <button 
                  onClick={handleLoadMore}
                  className="w-full max-w-[180px] bg-white border border-brand text-brand text-[13px] font-black uppercase tracking-widest py-3 rounded-xl shadow-[0_2px_10px_rgba(227,0,15,0.12)] hover:shadow-[0_4px_20px_rgba(227,0,15,0.25)] transition-all active:scale-95 flex items-center justify-center"
                >
                   {t('discoverMore')}
                 </button>
              ) : visibleCount > INITIAL_VISIBLE_COUNT && (
                <button 
                  onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                  className="bg-[#1a2b48] text-white font-black px-12 py-3.5 rounded-[16px] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#1a2b48]/20 uppercase tracking-widest text-[11px]"
                >
                  Show Less <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
