import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
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
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!config.isEnabled || activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleActionClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentSlide) return;

    const { destinationType, destinationUrl } = currentSlide;
    if (!destinationUrl) return;

    if (destinationType === 'destination') {
      if (onSelectDestination) {
        onSelectDestination(destinationUrl);
      } else {
        const el = document.getElementById('destinations');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (destinationType === 'activity') {
      if (onViewAttraction) {
        onViewAttraction(destinationUrl);
      } else if (onNavigate) {
        onNavigate(`/attraction/${destinationUrl}`);
      }
    } else if (destinationType === 'section') {
      const targetId = destinationUrl.replace('#', '');
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (destinationType === 'custom') {
      if (destinationUrl.startsWith('http://') || destinationUrl.startsWith('https://')) {
        window.open(destinationUrl, '_blank', 'noopener,noreferrer');
      } else if (onNavigate) {
        onNavigate(destinationUrl);
      }
    }
  };

  // Render title with stylized line break (First word large, following words punchy second line)
  const renderTitle = (titleText: string, textStyle?: string) => {
    let line1 = '';
    let line2 = '';

    if (titleText.includes('\n')) {
      const lines = titleText.split('\n');
      line1 = lines[0].trim();
      line2 = lines.slice(1).join(' ').trim();
    } else {
      const upper = titleText.trim();
      if (upper.startsWith('NEW YORK')) {
        line1 = 'NEW YORK';
        line2 = upper.replace(/^NEW YORK\s*/i, '').trim();
      } else {
        const parts = upper.split(/\s+/);
        if (parts.length >= 2) {
          line1 = parts[0];
          line2 = parts.slice(1).join(' ');
        } else {
          line1 = upper;
        }
      }
    }

    // Default clean ivory & pure white styling matching reference image_9595294f.png
    let line1Color = 'text-[#faf5ee]';
    let line2Color = 'text-white';
    let line1DropShadow = 'drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]';
    let line2DropShadow = 'drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]';

    if (textStyle === 'golden-glow') {
      line1Color = 'text-transparent bg-clip-text bg-gradient-to-b from-[#fff7d6] via-[#ffd677] to-[#d69527]';
      line2Color = 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffe8b3] via-[#ffc857] to-[#b87314]';
      line1DropShadow = 'drop-shadow-[0_4px_18px_rgba(245,158,11,0.5)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
      line2DropShadow = 'drop-shadow-[0_4px_18px_rgba(245,158,11,0.4)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    } else if (textStyle === 'brand-red') {
      line1Color = 'text-white';
      line2Color = 'text-transparent bg-clip-text bg-gradient-to-b from-rose-100 via-rose-300 to-[#e3000f]';
      line2DropShadow = 'drop-shadow-[0_4px_18px_rgba(227,0,15,0.65)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    } else if (textStyle === 'sunset-amber') {
      line1Color = 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffe8b3] via-[#ff9a3c] to-[#e65100]';
      line2Color = 'text-white';
      line1DropShadow = 'drop-shadow-[0_4px_18px_rgba(230,81,0,0.6)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]';
    }

    if (line2) {
      return (
        <div className="text-left font-black tracking-tight leading-[0.88] uppercase select-none">
          <span className={`block text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-black tracking-tight ${line1Color} ${line1DropShadow}`}>
            {line1}
          </span>
          <span className={`block text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-tight mt-1 sm:mt-2 ${line2Color} ${line2DropShadow}`}>
            {line2}
          </span>
        </div>
      );
    }

    return (
      <div className="text-left font-black tracking-tight leading-[0.9] uppercase select-none">
        <span className={`block text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-black tracking-tight ${line1Color} ${line1DropShadow}`}>
          {line1}
        </span>
      </div>
    );
  };

  // Parse partner logos text into badges with red shield icon for Tiqsey Verified
  const renderPartnerBadges = (partnerText?: string) => {
    if (!config.showPartnerBadges || !partnerText) return null;
    const items = partnerText.split('|').map(s => s.trim()).filter(Boolean);

    return (
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-white text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase mb-2.5 sm:mb-3.5 select-none drop-shadow-sm">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-white/35 font-light px-0.5 select-none">|</span>}
            <div className="flex items-center gap-2">
              {idx === 0 && (
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#e3000f] fill-[#e3000f] drop-shadow-sm shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2L4 5.5v6c0 5.25 3.4 10.15 8 11.5 4.6-1.35 8-6.25 8-11.5v-6L12 2z" />
                  <path d="M9 12.2l2 2 4.5-4.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
              <span className={idx === 0 ? 'font-black text-white' : 'font-semibold text-white/95'}>
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
        
        {/* Banner Card Container with wide cinematic panoramic aspect ratio and rounded corners */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-800/40 dark:border-slate-800/80 bg-[#050f18] group cursor-pointer aspect-[2.1/1] sm:aspect-[2.6/1] md:aspect-[3/1] lg:aspect-[3/1] min-h-[280px] sm:min-h-[320px] md:min-h-[350px] lg:min-h-[380px]"
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

          {/* Deep rich dark gradient overlay on the left to ensure high typographic legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030b14]/95 via-[#030b14]/75 via-45% to-transparent to-75% z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030b14]/60 via-transparent to-transparent z-10 pointer-events-none" />

          {/* Left-Aligned Overlaid Hero Content */}
          <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 max-w-xl sm:max-w-2xl lg:max-w-3xl">
            
            {/* Top Partner Logos / Badges with Red Shield Checkmark */}
            {renderPartnerBadges(currentSlide.partnerLogosText)}

            {/* Optional Promotional Pill Badge */}
            {currentSlide.badgeText && (
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e3000f] text-white text-[10px] font-black uppercase tracking-wider shadow-md w-fit mb-2">
                <span>{currentSlide.badgeText}</span>
              </div>
            )}

            {/* Hero Grand Title */}
            <div>
              {renderTitle(currentSlide.title, currentSlide.textStyle)}
            </div>

            {/* Subtitle / Tagline */}
            {currentSlide.subtitle && (
              <p className="text-white/95 font-medium text-sm sm:text-base md:text-lg lg:text-[18px] tracking-normal drop-shadow-md mt-2.5 sm:mt-4">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Call To Action Button (matching reference styling with crimson red arrow) */}
            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={(e) => handleActionClick(e)}
                className="group/btn inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-950 px-6 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm md:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <span>{currentSlide.ctaText || 'Explore Rome'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#e3000f] stroke-[3] transition-transform duration-200 group-hover/btn:translate-x-1" />
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
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-slate-800 stroke-[2.8]" />
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
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-slate-800 stroke-[2.8]" />
            </button>
          )}

          {/* Bottom Pagination Dots / Indicators (housed in translucent dark capsule) */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/10">
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
                      ? 'w-7 sm:w-8 h-2 bg-[#e3000f] shadow-xs'
                      : 'w-2 h-2 bg-white/70 hover:bg-white'
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
