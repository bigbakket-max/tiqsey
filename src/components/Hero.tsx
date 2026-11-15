import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';

import SearchBar from './SearchBar';

interface HeroProps {
  onSelectDestination: (destination: string) => void;
  onSearch: (query: string) => void;
}

const COLLAGE_LEFT = [
  {
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80",
    style: { top: "5%", left: "5%", width: "70px", height: "70px" },
    className: "rounded-2xl z-20",
    label: "Dubai",
    delay: 0,
    yOffset: -6,
    rotate: -8
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&q=80",
    style: { top: "8%", left: "52%", width: "60px", height: "60px" },
    className: "rounded-xl z-10",
    label: "Paris",
    delay: 0.4,
    yOffset: -4,
    rotate: 12
  },
  {
    url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=200&q=80",
    style: { top: "30%", left: "70%", width: "64px", height: "64px" },
    className: "rounded-xl z-20",
    label: "Iceland",
    delay: 0.5,
    yOffset: 4,
    rotate: -6
  },
  {
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80",
    style: { top: "60%", left: "8%", width: "68px", height: "68px" },
    className: "rounded-xl z-20",
    label: "Alps",
    delay: 0.1,
    yOffset: 5,
    rotate: 10
  },
  {
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=200&q=80",
    style: { top: "42%", left: "35%", width: "80px", height: "80px" },
    className: "rounded-2xl z-30",
    label: "Zurich",
    delay: 0.2,
    yOffset: 6,
    rotate: -4
  },
  {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80",
    style: { top: "70%", left: "55%", width: "64px", height: "64px" },
    className: "rounded-xl z-10",
    label: "Kyoto",
    delay: 0.3,
    yOffset: -5,
    rotate: -12
  }
];

const COLLAGE_RIGHT = [
  {
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=200&q=80",
    style: { top: "5%", right: "5%", width: "70px", height: "70px" },
    className: "rounded-2xl z-20",
    label: "New York",
    delay: 0.15,
    yOffset: -6,
    rotate: 6
  },
  {
    url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=200&q=80",
    style: { top: "8%", right: "52%", width: "60px", height: "60px" },
    className: "rounded-xl z-10",
    label: "Agra",
    delay: 0.45,
    yOffset: -5,
    rotate: -10
  },
  {
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=200&q=80",
    style: { top: "30%", right: "70%", width: "64px", height: "64px" },
    className: "rounded-xl z-20",
    label: "Santorini",
    delay: 0.55,
    yOffset: 3,
    rotate: 8
  },
  {
    url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=200&q=80",
    style: { top: "60%", right: "8%", width: "68px", height: "68px" },
    className: "rounded-xl z-20",
    label: "Holland",
    delay: 0.25,
    yOffset: 4,
    rotate: -8
  },
  {
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=200&q=80",
    style: { top: "42%", right: "35%", width: "80px", height: "80px" },
    className: "rounded-2xl z-30",
    label: "Rome",
    delay: 0.3,
    yOffset: 5,
    rotate: 5
  },
  {
    url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=200&q=80",
    style: { top: "70%", right: "55%", width: "64px", height: "64px" },
    className: "rounded-xl z-10",
    label: "Sydney",
    delay: 0.35,
    yOffset: -4,
    rotate: 12
  }
];

export default function Hero({ onSelectDestination, onSearch }: HeroProps) {
  const { t } = useSettings();

  return (
    <div 
      className="relative z-40 p-0 py-7 sm:py-8 md:py-10 min-h-[320px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[490px] flex flex-col items-center justify-center transition-colors duration-300 rounded-bl-[16px] md:rounded-bl-[24px] overflow-hidden shadow-xs bg-gradient-to-b from-[#e3f2fb] via-[#f4f9fd] to-[#d5eaf8] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      
      {/* Subtle soft atmospheric background ambient glow */}
      <div className="absolute top-[-15%] left-[5%] sm:left-[20%] w-[240px] sm:w-[400px] h-[240px] sm:h-[400px] bg-sky-200/40 dark:bg-blue-900/15 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[5%] sm:right-[20%] w-[260px] sm:w-[450px] h-[260px] sm:h-[450px] bg-blue-100/40 dark:bg-indigo-900/15 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Three-Column Responsive Guard Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[210px] sm:min-h-[240px] md:min-h-[320px] lg:min-h-[380px] relative z-10">
        
        {/* Left Column: Left Collage (strictly fits Columns 1-3) */}
        <div className="hidden lg:block lg:col-span-3 h-[340px] relative pointer-events-none">
          {COLLAGE_LEFT.map((img, i) => {
            const leftValue = img.style.left;
            const cardWidth = parseInt(img.style.width);
            const cardTop = img.style.top;
            return (
              <React.Fragment key={`left-${i}`}>
                {/* Hanging Cord */}
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 0.65, scaleY: 1 }}
                  transition={{ duration: 0.8, delay: img.delay }}
                  style={{
                    left: `calc(${leftValue} + ${cardWidth / 2}px)`,
                    top: "-150px",
                    height: `calc(150px + ${cardTop})`,
                    transformOrigin: "top",
                  }}
                  className="absolute w-[1.5px] bg-gradient-to-b from-[#8b5a2b]/30 via-[#a0522d]/70 to-[#5c3a21] z-0 pointer-events-none"
                />
                
                {/* Knot connector */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: img.delay }}
                  style={{
                    left: `calc(${leftValue} + ${cardWidth / 2 - 4}px)`,
                    top: `calc(${cardTop} - 4px)`,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#5c3a21] border border-[#3d2514] z-30 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                />

                {/* Card */}
                <motion.div
                  style={{ ...img.style, willChange: 'transform' }}
                  className={`absolute overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border-2 border-white dark:border-slate-800 dark:bg-slate-900 cursor-pointer pointer-events-auto transition-shadow duration-300 ${img.className}`}
                  initial={{ opacity: 0, y: 15, rotate: img.rotate }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotate: img.rotate 
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: img.delay
                  }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: img.rotate * 0.3,
                    zIndex: 50, 
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onSelectDestination(img.label)}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover select-none" 
                    alt={img.label} 
                    decoding="async"
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Center Column: Title & Search Bar (Guaranteed cols 4-9) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center text-center px-1 sm:px-2 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Eyebrow Accent */}
            <span className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-teal-600 dark:text-teal-400 mb-2 select-none">
              {t('heroEyebrow', 'DISCOVER. DREAM. EXPLORE.')}
            </span>

            <h1 className="text-[30px] sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-[700px] mx-auto mb-2">
              <span className="block font-black text-slate-900 dark:text-white">
                {t('heroTitle1', 'Explore')}
              </span>
              <span className="block font-black text-slate-900 dark:text-white">
                {t('heroTitle2', 'unforgettable')}
              </span>
              <span className="block font-black text-brand">
                {t('heroTitle3', 'experiences')}
              </span>
              <span className="inline-flex items-center justify-center flex-wrap gap-x-2 font-['Caveat',cursive] font-bold text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] tracking-normal leading-tight mt-0.5 max-w-full">
                <span className="relative inline-block text-amber-500 dark:text-amber-400">
                  {t('heroTitle4', 'around the world')}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 text-amber-500 dark:text-amber-400 pointer-events-none"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8.5C28 2.5 75 1.5 98 6.5C70 4.5 35 6 10 9"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subtitle Caption */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto mt-2.5 leading-relaxed px-2">
              {t('heroSubtitle', 'Handpicked destinations, unique activities and memories that last a lifetime.')}
            </p>
          </motion.div>
        </div>

        {/* Right Column: Right Collage (strictly fits Columns 10-12) */}
        <div className="hidden lg:block lg:col-span-3 h-[340px] relative pointer-events-none">
          {COLLAGE_RIGHT.map((img, i) => {
            const rightValue = img.style.right;
            const cardWidth = parseInt(img.style.width);
            const cardTop = img.style.top;
            return (
              <React.Fragment key={`right-${i}`}>
                {/* Hanging Cord */}
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 0.65, scaleY: 1 }}
                  transition={{ duration: 0.8, delay: img.delay }}
                  style={{
                    right: `calc(${rightValue} + ${cardWidth / 2}px)`,
                    top: "-150px",
                    height: `calc(150px + ${cardTop})`,
                    transformOrigin: "top",
                  }}
                  className="absolute w-[1.5px] bg-gradient-to-b from-[#8b5a2b]/30 via-[#a0522d]/70 to-[#5c3a21] z-0 pointer-events-none"
                />
                
                {/* Knot connector */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: img.delay }}
                  style={{
                    right: `calc(${rightValue} + ${cardWidth / 2 - 4}px)`,
                    top: `calc(${cardTop} - 4px)`,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#5c3a21] border border-[#3d2514] z-30 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                />

                {/* Card */}
                <motion.div
                  style={{ ...img.style, willChange: 'transform' }}
                  className={`absolute overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border-2 border-white dark:border-slate-800 dark:bg-slate-900 cursor-pointer pointer-events-auto transition-shadow duration-300 ${img.className}`}
                  initial={{ opacity: 0, y: 15, rotate: img.rotate }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    rotate: img.rotate
                  }}
                  transition={{
                    duration: 0.6,
                    delay: img.delay
                  }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: img.rotate * 0.3,
                    zIndex: 50, 
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onSelectDestination(img.label)}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover select-none" 
                    alt={img.label} 
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

      </div>

    </div>
  );
}
