import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { LargeHeroBannerConfig, LargeHeroBannerSlide } from '../types';
import { 
  getStoredLargeHeroBannerConfig, 
  LARGE_BANNER_UPDATE_EVENT,
  DEFAULT_LARGE_HERO_BANNER_CONFIG 
} from '../utils/bannerStorage';
import { useSettings } from '../contexts/SettingsContext';

interface LargeFeaturedBannerProps {
  onSelectDestination?: (dest: string) => void;
  onViewAttraction?: (id: string) => void;
  onNavigate?: (url: string) => void;
  previewConfig?: LargeHeroBannerConfig; // Optional for admin live preview
}

export default function LargeFeaturedBanner({
  onSelectDestination,
  onViewAttraction,
  onNavigate,
  previewConfig
}: LargeFeaturedBannerProps) {
  const { t } = useSettings();
  const [config, setConfig] = useState<LargeHeroBannerConfig>(previewConfig || DEFAULT_LARGE_HERO_BANNER_CONFIG);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load configuration from storage if not in preview mode
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      return;
    }

    const loadConfig = () => {
      const stored = getStoredLargeHeroBannerConfig();
      setConfig(stored);
    };

    loadConfig();
    window.addEventListener(LARGE_BANNER_UPDATE_EVENT, loadConfig);
    window.addEventListener('storage', loadConfig);

    return () => {
      window.removeEventListener(LARGE_BANNER_UPDATE_EVENT, loadConfig);
      window.removeEventListener('storage', loadConfig);
    };
  }, [previewConfig]);

  // Active slides filter
  const activeSlides = (config.slides || []).filter(s => s.isActive);

  // Ensure index stays in valid range when slides change
  useEffect(() => {
    if (currentIndex >= activeSlides.length && activeSlides.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1 || !config.autoPlayInterval || config.autoPlayInterval <= 0) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, config.autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, activeSlides.length, config.autoPlayInterval, handleNext]);

  // Handle touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // Swiped left -> Next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> Prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!config.isEnabled || activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleActionClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const { destinationType, destinationUrl } = currentSlide;
    if (!destinationUrl) return;

    if (destinationType === 'activity') {
      if (onViewAttraction) {
        onViewAttraction(destinationUrl);
      } else if (onNavigate) {
        onNavigate(`/activities/${encodeURIComponent(destinationUrl)}`);
      }
    } else if (destinationType === 'destination') {
      if (onSelectDestination) {
        onSelectDestination(destinationUrl);
      } else if (onNavigate) {
        onNavigate(`/destinations/${encodeURIComponent(destinationUrl.toLowerCase().replace(/\s+/g, '-'))}`);
      }
    } else if (destinationType === 'section') {
      const targetId = destinationUrl.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (destinationUrl.startsWith('http://') || destinationUrl.startsWith('https://')) {
        window.open(destinationUrl, '_blank', 'noopener,noreferrer');
      } else if (onNavigate) {
        onNavigate(destinationUrl);
      }
    }
  };

  // Render title with stylized line break if two words
  const renderTitle = (titleText: string, textStyle?: string) => {
    const parts = titleText.trim().split(/\s+/);
    
    // Glowing gradient classes based on text style
    let gradientClass = 'from-[#fff6d6] via-[#ffd277] to-[#d69527]';
    let filterClass = 'drop-shadow-[0_4px_18px_rgba(245,158,11,0.55)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';

    if (textStyle === 'modern-white') {
      gradientClass = 'from-white via-slate-100 to-slate-300';
      filterClass = 'drop-shadow-[0_4px_16px_rgba(255,255,255,0.4)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    } else if (textStyle === 'sunset-amber') {
      gradientClass = 'from-[#ffe8b3] via-[#ff9a3c] to-[#e65100]';
      filterClass = 'drop-shadow-[0_4px_18px_rgba(230,81,0,0.6)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    } else if (textStyle === 'neon-cyan') {
      gradientClass = 'from-[#e0f7fa] via-[#26c6da] to-[#00838f]';
      filterClass = 'drop-shadow-[0_4px_18px_rgba(0,188,212,0.6)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    }

    if (parts.length === 2) {
      return (
        <span className={`block font-[950] tracking-tight text-transparent bg-clip-text bg-gradient-to-b ${gradientClass} ${filterClass} leading-[0.92]`}>
          <span className="block">{parts[0]}</span>
          <span className="block">{parts[1]}</span>
        </span>
      );
    }

    return (
      <span className={`block font-[950] tracking-tight text-transparent bg-clip-text bg-gradient-to-b ${gradientClass} ${filterClass} leading-[0.95]`}>
        {titleText}
      </span>
    );
  };

  // Parse partner logos text into badges
  const renderPartnerBadges = (partnerText?: string) => {
    if (!config.showPartnerBadges || !partnerText) return null;
    const items = partnerText.split('|').map(s => s.trim()).filter(Boolean);

    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/90 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-white/40 font-light select-none">|</span>}
            <div className="flex items-center gap-1.5 drop-shadow-sm">
              {idx === 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 inline-block shadow-xs" />
              )}
              {idx === 1 && (
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 text-[8px] font-black text-white">
                  ★
                </span>
              )}
              {idx === 2 && (
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              )}
              <span className="tracking-wide uppercase text-[9px] sm:text-[11px] font-bold text-white/90">
                {item}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <section 
      className="w-full py-4 sm:py-6 overflow-hidden select-none"
      id="homepage-featured-banner"
      aria-label="Promotional Activities Banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Banner Card Container with exact panoramic aspect ratio and rounded corners */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-950 group cursor-pointer aspect-[2.4/1] sm:aspect-[3.1/1] md:aspect-[3.7/1] lg:aspect-[4.1/1] min-h-[250px] sm:min-h-[290px] md:min-h-[330px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleActionClick()}
        >
          {/* Background Images with smooth fade transition */}
          {activeSlides.map((slide, idx) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img 
                src={slide.imageUrl}
                alt={slide.title || 'Promotional Banner'}
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Deep dark gradient overlay on the left to ensure high typographic legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 z-10 pointer-events-none" />

          {/* Left-Aligned Overlaid Hero Content */}
          <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 max-w-xl sm:max-w-2xl">
            
            {/* Top Partner Logos / Badges */}
            {renderPartnerBadges(currentSlide.partnerLogosText)}

            {/* Optional Promotional Pill Badge */}
            {currentSlide.badgeText && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md w-fit mb-2">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>{currentSlide.badgeText}</span>
              </div>
            )}

            {/* Hero Grand Title */}
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif">
              {renderTitle(currentSlide.title, currentSlide.textStyle)}
            </div>

            {/* Subtitle / Tagline */}
            {currentSlide.subtitle && (
              <p className="text-white font-extrabold uppercase text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.18em] sm:tracking-[0.24em] drop-shadow-md mt-1.5 sm:mt-2.5">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Call To Action Button (matching the white pill button from reference) */}
            <div className="mt-3 sm:mt-4 md:mt-5">
              <button
                type="button"
                onClick={(e) => handleActionClick(e)}
                className="inline-flex items-center justify-center bg-white hover:bg-amber-400 text-stone-900 hover:text-stone-950 font-black px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{currentSlide.ctaText ? t(currentSlide.ctaText) : t('bookNow', 'BOOK NOW')}</span>
              </button>
            </div>

          </div>

          {/* Left Navigation Chevron Button (if multiple slides) */}
          {activeSlides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer backdrop-blur-xs"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Right Navigation Chevron Button (if multiple slides) */}
          {activeSlides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer backdrop-blur-xs"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Bottom Pagination Dots / Indicators (matching the reference styling with elongated active pill) */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-30">
              {activeSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(dotIdx);
                  }}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    dotIdx === currentIndex
                      ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-[#f97316] shadow-sm'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
