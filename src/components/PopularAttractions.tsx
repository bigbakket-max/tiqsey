import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ApiService } from '../services/apiService';
import { Attraction } from '../types';
import ErrorMessage from './ErrorMessage';
import AttractionCard from './AttractionCard';
import AttractionCardSkeleton from './AttractionCardSkeleton';

const MAX_TOTAL_ATTRACTIONS = 20;

export default function PopularAttractions({ onViewAttraction }: { onViewAttraction?: (id: string) => void }) {
  const { t } = useSettings();
  
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            {Array.from({ length: 8 }).map((_, i) => (
              <AttractionCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {attractions.map((attr) => (
              <AttractionCard key={attr.id} attr={attr} onClick={onViewAttraction} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
