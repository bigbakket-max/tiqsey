import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Lock, Globe } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// Character 1: Cute Green Ball Traveler sitting on suitcase looking at phone
function StarTravelerCharacter() {
  return (
    <motion.div 
      className="relative w-11 h-11 flex items-center justify-center shrink-0 select-none cursor-pointer"
      whileHover={{ 
        y: -2.5,
        rotate: 1.5,
        transition: { duration: 0.25 }
      }}
    >
      <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full" />
      <svg viewBox="0 0 100 100" className="w-9.5 h-9.5 drop-shadow-md z-10 overflow-visible">
        <defs>
          <radialGradient id="greenBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
          <linearGradient id="suitcaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* 1. Backpack on the Left */}
        <g id="backpack">
          <rect x="8" y="58" width="15" height="20" rx="3" fill="url(#backpackGrad)" stroke="#1e3a8a" strokeWidth="1.5" />
          <path d="M 8,62 Q 15.5,65 23,62 L 23,58 L 8,58 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1" />
          <rect x="11" y="66" width="9" height="9" rx="1.5" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1" />
          <path d="M 7,59 Q 5,68 8,76" fill="none" stroke="#1e3a8a" strokeWidth="1.2" />
        </g>

        {/* 2. Suitcase (Gold / Yellow) */}
        <g id="suitcase">
          <rect x="33" y="81" width="4" height="2" fill="#374151" />
          <rect x="63" y="81" width="4" height="2" fill="#374151" />
          <rect x="28" y="60" width="44" height="22" rx="4" fill="url(#suitcaseGrad)" stroke="#92400e" strokeWidth="1.8" />
          <line x1="36" y1="60" x2="36" y2="82" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="64" y1="60" x2="64" y2="82" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 44,60 Q 50,54 56,60" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <rect x="47" y="65" width="6" height="4" rx="1" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        </g>

        {/* 3. Limbs - grey legs dangling */}
        <g id="legs" stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 44,56 C 44,68 40,70 42,86" />
          <path d="M 56,56 C 56,66 60,68 58,84" />
        </g>

        {/* 4. Green Body Sphere */}
        <circle cx="50" cy="38" r="21" fill="url(#greenBallGrad)" stroke="#047857" strokeWidth="1.5" />

        {/* 5. Gray Arms */}
        <g stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 31,43 C 25,48 27,58 35,59" />
          <path d="M 69,43 C 74,48 72,36 67,31" />
        </g>

        {/* 6. Phone held in Left Hand */}
        <g id="phone" transform="rotate(8, 66, 28)">
          <rect x="63" y="19" width="8" height="13" rx="1.5" fill="#1f2937" stroke="#9ca3af" strokeWidth="0.8" />
          <rect x="64" y="20.5" width="6" height="10" rx="0.5" fill="#10b981" />
          <circle cx="67" cy="20" r="0.5" fill="#111827" />
        </g>

        {/* 7. Cute Face */}
        <g id="face">
          <g id="sunglasses" transform="translate(0, -2)">
            <ellipse cx="40" cy="24" rx="7" ry="5" fill="#111827" stroke="#4b5563" strokeWidth="1.2" />
            <path d="M 35,23 C 35,23 37,21 42,21" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <ellipse cx="58" cy="24" rx="7" ry="5" fill="#111827" stroke="#4b5563" strokeWidth="1.2" />
            <path d="M 53,23 C 53,23 55,21 60,21" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <path d="M 47,24 Q 49,22 51,24" fill="none" stroke="#111827" strokeWidth="1.8" />
            <path d="M 33,24 C 30,24 28,26 28,26" fill="none" stroke="#111827" strokeWidth="1.2" />
            <path d="M 65,24 C 68,24 70,26 70,26" fill="none" stroke="#111827" strokeWidth="1.2" />
          </g>

          <circle cx="45" cy="38" r="4" fill="white" stroke="#047857" strokeWidth="0.8" />
          <circle cx="57" cy="38" r="4" fill="white" stroke="#047857" strokeWidth="0.8" />
          
          <circle cx="46.5" cy="38" r="2" fill="#111827" />
          <circle cx="58.5" cy="38" r="2" fill="#111827" />

          <circle cx="39" cy="42" r="2.5" fill="#ff8a8a" opacity="0.6" />
          <circle cx="61" cy="42" r="2.5" fill="#ff8a8a" opacity="0.6" />

          <path d="M 48,44 Q 51,47 54,44" fill="none" stroke="#064e3b" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

// Character 2: Cute Red Ball Traveler walking happily with hat, green bag, and verified phone
function SightseeingOwlCharacter() {
  return (
    <motion.div 
      className="relative w-11 h-11 flex items-center justify-center shrink-0 select-none cursor-pointer"
      whileHover={{ 
        y: -2.5,
        transition: { duration: 0.25 }
      }}
    >
      <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full" />
      <svg viewBox="0 0 100 100" className="w-9.5 h-9.5 drop-shadow-md z-10 overflow-visible">
        <defs>
          <radialGradient id="redBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <linearGradient id="strawHatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="briefcaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* 1. Legs - running pose grey lines */}
        <g stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 42,62 L 32,78 L 24,76" />
          <path d="M 58,62 L 64,80 L 74,81" />
        </g>

        {/* 2. Red Body Sphere */}
        <circle cx="50" cy="42" r="21" fill="url(#redBallGrad)" stroke="#be123c" strokeWidth="1.5" />

        {/* 3. Straw Hat */}
        <g id="straw-hat" transform="rotate(-6, 50, 22)">
          <path d="M 34,22 C 34,10 66,10 66,22 Z" fill="url(#strawHatGrad)" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="50" cy="22" rx="23" ry="4" fill="url(#strawHatGrad)" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M 34.5,19.5 Q 50,22 65.5,19.5" fill="none" stroke="#991b1b" strokeWidth="2.5" />
        </g>

        {/* 4. Cute Face details */}
        <g id="red-face">
          <circle cx="43" cy="39" r="4.5" fill="white" stroke="#9f1239" strokeWidth="0.8" />
          <circle cx="57" cy="39" r="4.5" fill="white" stroke="#9f1239" strokeWidth="0.8" />
          
          <circle cx="43" cy="39" r="2.2" fill="#111827" />
          <circle cx="57" cy="39" r="2.2" fill="#111827" />

          <path d="M 46,47 Q 50,53 54,47 Z" fill="#991b1b" stroke="#991b1b" strokeWidth="1" />
          <path d="M 48,50 Q 50,52 52,50" fill="none" stroke="#f43f5e" strokeWidth="1" />
          
          <circle cx="36" cy="43" r="2" fill="#f43f5e" opacity="0.4" />
          <circle cx="64" cy="43" r="2" fill="#f43f5e" opacity="0.4" />
        </g>

        {/* 5. Left Arm carrying Green Briefcase with Sticker */}
        <g id="left-arm-and-briefcase">
          <path d="M 31,46 C 24,50 20,58 25,64" fill="none" stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" />
          
          <g id="briefcase" transform="translate(10, 58) rotate(-4)">
            <rect x="0" y="4" width="18" height="13" rx="2.5" fill="url(#briefcaseGrad)" stroke="#065f46" strokeWidth="1.5" />
            <path d="M 5,4 Q 9,0 13,4" fill="none" stroke="#065f46" strokeWidth="1.5" />
            <rect x="3" y="7" width="6" height="5" rx="0.5" fill="#f8fafc" stroke="#3b82f6" strokeWidth="0.5" />
            <polygon points="3.5,11.5 5.5,9.5 7.5,11.5" fill="#10b981" />
            <rect x="11" y="9" width="3" height="3" rx="0.5" fill="#f59e0b" />
          </g>
        </g>

        {/* 6. Right Arm holding Phone + Shield */}
        <g id="right-arm-and-phone-shield">
          <motion.path 
            d="M 69,46 C 76,46 76,34 74,28" 
            fill="none" 
            stroke="#4b5563" 
            strokeWidth="4.5" 
            strokeLinecap="round"
            style={{ originX: '69px', originY: '46px' }}
          />

          <g id="secure-phone" transform="translate(73, 14)">
            <rect x="0" y="2" width="9" height="14" rx="1.5" fill="#fcfcfc" stroke="#94a3b8" strokeWidth="0.8" />
            <rect x="0.8" y="3.5" width="7.4" height="11.2" rx="0.5" fill="#f1f5f9" />
            
            <g id="shield" transform="translate(3, 4)">
              <path 
                d="M 4,-2 C 4,-2 8,-2 9,1 C 9,8 6,12 4,14 C 2,12 -1,8 -1,1 C 0,-2 4,-2 4,-2 Z" 
                fill="#22c55e" 
                stroke="#15803d" 
                strokeWidth="1" 
              />
              <path d="M 2.2,5.5 L 3.5,7 L 6.2,3.5" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

// Character 3: Cute Orange Ball leaning on purple rolling suitcase, waving at plane, with cap
function VaultBuddyCharacter() {
  return (
    <motion.div 
      className="relative w-11 h-11 flex items-center justify-center shrink-0 select-none cursor-pointer"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.25 }
      }}
    >
      <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full" />
      <svg viewBox="0 0 100 100" className="w-9.5 h-9.5 drop-shadow-md z-10 overflow-visible">
        <defs>
          <radialGradient id="orangeBallGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
          <linearGradient id="purpleSuitcaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* 1. Airplane flying in the upper left background */}
        <g id="bg-airplane">
          <path d="M 5,28 Q 15,24 24,14" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          
          <g transform="translate(22, 10) rotate(-15)">
            <ellipse cx="4" cy="2" rx="4" ry="1.5" fill="#8b5cf6" />
            <polygon points="3.5,2 -1,5 -3,5 1.5,2" fill="#a78bfa" />
            <polygon points="3.5,2 7,-3 5,-3 1.5,2" fill="#a78bfa" />
            <polygon points="-2.5,2 -4,-1 -4.5,-1 -3.5,2" fill="#8b5cf6" />
          </g>
        </g>

        {/* 2. Purple Rolling Suitcase */}
        <g id="rolling-suitcase">
          <circle cx="21" cy="80" r="2.5" fill="#1f2937" />
          <circle cx="31" cy="80" r="2.5" fill="#1f2937" />
          
          <path d="M 23,54 L 23,38 L 29,38 L 29,54" fill="none" stroke="#4b5563" strokeWidth="1.8" />
          <rect x="21.5" y="36.5" width="9" height="2" fill="#1f2937" rx="0.5" />
          
          <rect x="16" y="50" width="16" height="29" rx="3" fill="url(#purpleSuitcaseGrad)" stroke="#6d28d9" strokeWidth="1.5" />
          
          <line x1="20" y1="56" x2="20" y2="73" stroke="#6d28d9" strokeWidth="1.2" />
          <line x1="24" y1="54" x2="24" y2="75" stroke="#6d28d9" strokeWidth="1.2" />
          <line x1="28" y1="56" x2="28" y2="73" stroke="#6d28d9" strokeWidth="1.2" />
        </g>

        {/* 3. Limbs - Orange character standing on legs */}
        <g stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M 48,64 L 46,81" />
          <path d="M 60,64 L 62,81" />
          <path d="M 42,48 C 34,51 32,54 33,59" />
        </g>

        {/* 4. Orange Body Sphere */}
        <circle cx="54" cy="44" r="20" fill="url(#orangeBallGrad)" stroke="#c2410c" strokeWidth="1.5" />

        {/* 5. Right Arm - waving happily at the plane */}
        <motion.path 
          d="M 72,40 C 78,38 84,24 81,18" 
          fill="none" 
          stroke="#4b5563" 
          strokeWidth="4.5" 
          strokeLinecap="round"
          style={{ originX: '72px', originY: '40px' }}
        />

        {/* 6. Cap on its Head */}
        <g id="baseball-cap" transform="translate(4, 2) rotate(10, 54, 24)">
          <path d="M 37,24 C 37,13 65,13 65,24 Z" fill="white" stroke="#94a3b8" strokeWidth="1.2" />
          <circle cx="51" cy="14" r="1.5" fill="#1d4ed8" />
          <path d="M 37,24 C 37,24 28,24 27,27 C 27,27 34,28 39,25" fill="#1d4ed8" stroke="#172554" strokeWidth="1" />
        </g>

        {/* 7. Expressive Face looking up-left */}
        <g id="orange-face">
          <circle cx="46" cy="40" r="4" fill="white" stroke="#7c2d12" strokeWidth="0.8" />
          <circle cx="58" cy="40" r="4" fill="white" stroke="#7c2d12" strokeWidth="0.8" />
          
          <circle cx="44.5" cy="38.5" r="2" fill="#111827" />
          <circle cx="56.5" cy="38.5" r="2" fill="#111827" />

          <circle cx="39" cy="44" r="2" fill="#f97316" opacity="0.5" />
          <circle cx="63" cy="44" r="2" fill="#f97316" opacity="0.5" />

          <path d="M 49,46 Q 52,49 55,46" fill="none" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

export default function TrustBar() {
  const { t } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const trustItems = [
    {
      isTrustpilot: true,
      title: t('mobileTickets'),
      subtitle: t('mobileTicketsSub'),
    },
    {
      title: t('unbeatableValue'),
      subtitle: t('unbeatableValueSub'),
    },
    {
      title: t('securePayments'),
      subtitle: t('securePaymentsSub'),
    },
  ];

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (scrollTimeoutRef.current) return;
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) {
        scrollTimeoutRef.current = null;
        return;
      }
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollWidth <= clientWidth) {
        scrollTimeoutRef.current = null;
        return;
      }
      
      const maxScroll = scrollWidth - clientWidth;
      const pct = scrollLeft / maxScroll;
      const index = Math.round(pct * (trustItems.length - 1));
      setActiveIndex(index);
      scrollTimeoutRef.current = null;
    }, 100);
  };

  const scrollToItem = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardElements = container.querySelectorAll('.snap-center');
    if (cardElements && cardElements[index]) {
      const targetElement = cardElements[index] as HTMLElement;
      container.scrollTo({
        left: targetElement.offsetLeft - container.offsetLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative w-full bg-white dark:bg-slate-950/20 py-8 md:py-10" id="trust-bar-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-start gap-5 w-full">
          
          {/* Left-Aligned Title */}
          <div className="text-left w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <span>{t('whyBook')} <span className="text-brand">Tiqsey</span>?</span>
            </h2>
          </div>

          {/* Trust Items Columns (Slideable horizontally on mobile, Grid on desktop) */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="w-full flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {trustItems.map((item, index) => {
              const characterElement = index === 0 ? (
                <StarTravelerCharacter />
              ) : index === 1 ? (
                <SightseeingOwlCharacter />
              ) : (
                <VaultBuddyCharacter />
              );

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="flex flex-col items-start gap-3.5 p-5 md:p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/60 rounded-2xl w-[80vw] sm:w-[280px] md:w-auto shrink-0 snap-center hover:-translate-y-1 hover:shadow-xs transition-all duration-300"
                >
                  <div className="flex items-start justify-start w-full pointer-events-none">
                    {characterElement}
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-left">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    {item.isTrustpilot && (
                      <div className="flex items-center gap-1.5 mt-0.5 mb-0.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="w-3 h-3 bg-[#00b67a] flex items-center justify-center rounded-[2px] shadow-xs">
                              <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none">4.8</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Page Dot Indicators (Mobile Only) */}
          <div className="flex md:hidden items-center justify-center -gap-1 mt-1 w-full">
            {trustItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToItem(idx)}
                className="w-10 h-10 flex items-center justify-center outline-none select-none transition-transform active:scale-95"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-5 bg-brand' : 'w-1.5 bg-slate-300 dark:bg-slate-700/60'
                  }`}
                />
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

