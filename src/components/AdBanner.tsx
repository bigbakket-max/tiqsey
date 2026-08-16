import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Landmark, 
  Sun, 
  Sparkles, 
  Flame, 
  Copy, 
  CheckCircle2, 
  MousePointerClick,
  ArrowRight,
  Ticket,
  Compass,
  Gift
} from 'lucide-react';

interface AdBannerProps {
  onSelectDestination?: (dest: string) => void;
}

export default function AdBanner({ onSelectDestination }: AdBannerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleCardClick = (target: string) => {
    if (target === 'deals') {
      const el = document.getElementById('hot-deals');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'tournament') {
      const el = document.getElementById('popular-attractions') || document.getElementById('destinations');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'summer') {
      const el = document.getElementById('hot-deals');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'destinations') {
      if (onSelectDestination) {
        onSelectDestination('Kuala Lumpur');
      } else {
        const el = document.getElementById('destinations');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-4 overflow-hidden select-none" id="promotional-banner">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-6">
          <span className="text-[#e3000f] font-bold text-xs mb-1 block tracking-wide">Exclusive offers</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Activities Promotions
          </h2>
        </div>

        {/* Carousel Outer wrapper - Responsive Grid/Flex */}
        <div className="relative">
          
          {/* Horizontal Drag/Scroll Container Track */}
          <div 
            className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible scrollbar-none pb-3 md:pb-0 px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            
            {/* -------------------- CARD 1: Anne Frank House Bestseller Card -------------------- */}
            <div 
              onClick={() => handleCardClick('deals')}
              className="w-[280px] sm:w-[335px] md:w-full shrink-0 md:shrink aspect-[16/7.8] bg-[#fdfcff] dark:bg-[#130b24] rounded-[1.25rem] relative overflow-hidden flex flex-row cursor-pointer shadow-sm select-none snap-start group/card hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200 border border-purple-200/70 dark:border-purple-800/40"
            >
              {/* Left Column: Visual Media with Building, Historic Atmosphere & Golden Seal (40% width) */}
              <div className="relative w-[38%] sm:w-[40%] h-full overflow-hidden shrink-0 select-none bg-gradient-to-br from-[#120324] via-[#350a58] to-[#6a157e]">
                
                <img src="/Canva.png" alt="Canva Banner" className="absolute inset-0 w-full h-full object-cover object-left" />

                {/* 4. Watercolor Edge Feathering Mask to Right Side */}
                <div 
                  className="absolute top-0 bottom-0 right-0 w-12 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(253, 252, 255, 0.4) 30%, #fdfcff 100%)'
                  }}
                />
              </div>

              {/* Right Column: High-Impact Typography & Interactive Controls (60% width) */}
              <div className="relative flex-1 h-full flex flex-col justify-between items-center text-center p-2 sm:p-2.5 sm:py-2.5 z-20 overflow-hidden text-slate-900 dark:text-white">
                
                {/* Background ambient watercolor glow */}
                <div 
                  className="absolute inset-0 opacity-30 dark:opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 90% 10%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 10% 90%, #fbcfe8 0%, transparent 40%)',
                  }}
                />

                {/* Top Row: BESTSELLER Pill */}
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#5110d9] via-[#8e2de2] to-[#d81b60] text-white text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-sm mt-0.5">
                  <Flame className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                  <span>BESTSELLER</span>
                </div>

                {/* Script sub-heading */}
                <span className="block text-[#6200ea] dark:text-purple-300 font-extrabold text-[9.5px] sm:text-[11.5px] italic tracking-tight leading-none">
                  Grab all your
                </span>

                {/* Main Header with Action Speed Lines & Confetti */}
                <div className="relative my-0.5 flex items-center justify-center">
                  {/* Action speed lines on left */}
                  <div className="absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-80 pointer-events-none">
                    <div className="w-2.5 h-[2px] bg-[#6200ea] dark:bg-purple-400 rounded-full transform -rotate-12" />
                    <div className="w-3.5 h-[2px] bg-[#6200ea] dark:bg-purple-400 rounded-full transform -rotate-12" />
                  </div>

                  <h1 className="text-[14px] sm:text-[17px] md:text-[14.5px] lg:text-[18px] font-[1000] tracking-tight text-[#110738] dark:text-white uppercase leading-[0.92] select-none italic text-center -skew-x-[6deg]">
                    ANNE FRANK<br />HOUSE
                  </h1>

                  {/* Confetti flakes on right */}
                  <div className="absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 opacity-90 pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-xs transform rotate-45" />
                    <div className="w-2 h-1 bg-pink-500 rounded-full transform -rotate-15" />
                  </div>
                </div>

                {/* Hot Pink Brushstroke BESTSELLER Ribbon */}
                <div className="relative inline-flex items-center justify-center px-4 sm:px-5 py-0.5 my-0.5">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 36" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pinkBrushGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#ff007f" />
                        <stop offset="50%" stopColor="#f50057" />
                        <stop offset="100%" stopColor="#c51162" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 6,3 Q 1,18 5,33 L 15,32 Q 30,35 185,33 L 195,30 Q 199,16 194,4 L 180,5 Q 160,1 14,3 Z" 
                      fill="url(#pinkBrushGrad)" 
                    />
                  </svg>
                  <span className="relative z-10 text-white font-[1000] text-[9.5px] sm:text-[12px] italic uppercase tracking-wider select-none transform -rotate-1 drop-shadow-xs">
                    BESTSELLER!
                  </span>
                </div>

                {/* Experience Tag / Pill */}
                <div className="hidden xs:inline-flex items-center gap-1.5 bg-white dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 rounded-full px-2.5 py-0.5 text-[7px] sm:text-[8px] text-[#1e1035] dark:text-purple-200 font-semibold shadow-xs max-w-fit">
                  <div className="w-3 h-3 rounded-full bg-[#5110d9] flex items-center justify-center text-white text-[6.5px] shrink-0">
                    ★
                  </div>
                  <span className="truncate">Step into history. A must-visit experience.</span>
                </div>

                {/* Bottom Row: Promo Code & Action Buttons */}
                <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 mt-auto pt-0.5 px-0.5 z-30">
                  {/* Dashed Promo Code Pill */}
                  <div className="border border-dashed border-[#6200ea] bg-purple-50/95 dark:bg-purple-950/70 rounded-full px-1.5 sm:px-2 py-0.5 text-[6.5px] sm:text-[7.5px] font-bold text-[#1e1035] dark:text-purple-200 whitespace-nowrap flex items-center gap-0.5 shrink-0">
                    <Gift className="w-2.5 h-2.5 text-[#6200ea] shrink-0" />
                    <span>CODE: <strong className="font-mono text-[#d81b60] font-black">TIQSEYPLAY</strong></span>
                  </div>

                  {/* BOOK NOW Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick('deals');
                    }}
                    className="px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-[#5110d9] via-[#8e2de2] to-[#d81b60] hover:brightness-110 text-white text-[7px] sm:text-[8px] font-black tracking-wide flex items-center gap-1 shadow-sm transition-transform active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <span>BOOK NOW</span>
                    <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                  </button>

                  {/* Copy Code Button */}
                  <button
                    onClick={(e) => handleCopy(e, 'TIQSEYPLAY')}
                    title="Copy promo code"
                    className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white hover:bg-slate-50 border border-purple-200 text-[6.5px] sm:text-[7.5px] text-[#6200ea] dark:text-purple-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 flex items-center gap-0.5 font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
                  >
                    {copiedCode === 'TIQSEYPLAY' ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5 text-[#6200ea] dark:text-purple-400 shrink-0" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Floating 3D Yellow Ticket Badges with Discount % and stub notches */}
                {/* Ticket 1: Top Right */}
                <div className="absolute top-1.5 right-1.5 rotate-[15deg] pointer-events-none drop-shadow-sm z-10">
                  <svg viewBox="0 0 54 32" className="w-7 h-4 sm:w-9 sm:h-5">
                    <defs>
                      <linearGradient id="goldTicketGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffe259" />
                        <stop offset="100%" stopColor="#ffa751" />
                      </linearGradient>
                    </defs>
                    <path d="M 4,0 L 50,0 Q 54,0 54,4 L 54,11 Q 50,16 54,21 L 54,28 Q 54,32 50,32 L 4,32 Q 0,32 0,28 L 0,21 Q 4,16 0,11 L 0,4 Q 0,0 4,0 Z" fill="url(#goldTicketGrad1)" />
                    <text x="27" y="21" fontSize="16" fontWeight="900" fontStyle="italic" fill="#5c3800" textAnchor="middle" fontFamily="sans-serif">%</text>
                  </svg>
                </div>

                {/* Ticket 2: Middle Right with confetti */}
                <div className="absolute top-[42%] -right-0.5 rotate-[-15deg] pointer-events-none drop-shadow-sm z-10">
                  <svg viewBox="0 0 54 32" className="w-6 h-3.5 sm:w-8 sm:h-4.5">
                    <defs>
                      <linearGradient id="goldTicketGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffe259" />
                        <stop offset="100%" stopColor="#ffa751" />
                      </linearGradient>
                    </defs>
                    <path d="M 4,0 L 50,0 Q 54,0 54,4 L 54,11 Q 50,16 54,21 L 54,28 Q 54,32 50,32 L 4,32 Q 0,32 0,28 L 0,21 Q 4,16 0,11 L 0,4 Q 0,0 4,0 Z" fill="url(#goldTicketGrad2)" />
                    <text x="27" y="21" fontSize="16" fontWeight="900" fontStyle="italic" fill="#5c3800" textAnchor="middle" fontFamily="sans-serif">%</text>
                  </svg>
                </div>

                {/* Ticket 3: Bottom Right (Adjusted position so it never overlaps the buttons) */}
                <div className="absolute bottom-1 -right-1 rotate-[18deg] pointer-events-none drop-shadow-sm z-0 opacity-80 sm:opacity-100">
                  <svg viewBox="0 0 54 32" className="w-5 h-3 sm:w-7 sm:h-4">
                    <defs>
                      <linearGradient id="goldTicketGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffe259" />
                        <stop offset="100%" stopColor="#ffa751" />
                      </linearGradient>
                    </defs>
                    <path d="M 4,0 L 50,0 Q 54,0 54,4 L 54,11 Q 50,16 54,21 L 54,28 Q 54,32 50,32 L 4,32 Q 0,32 0,28 L 0,21 Q 4,16 0,11 L 0,4 Q 0,0 4,0 Z" fill="url(#goldTicketGrad3)" />
                    <text x="27" y="21" fontSize="16" fontWeight="900" fontStyle="italic" fill="#5c3800" textAnchor="middle" fontFamily="sans-serif">%</text>
                  </svg>
                </div>

              </div>
            </div>

            {/* -------------------- CARD 2: Teal World Football Tournament -------------------- */}
            <div 
              onClick={() => handleCardClick('tournament')}
              className="w-[280px] sm:w-[325px] md:w-full shrink-0 md:shrink aspect-[16/7.8] bg-gradient-to-tr from-[#022f36] via-[#055c63] to-[#01888f] rounded-[1.25rem] relative overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 cursor-pointer shadow-sm select-none snap-start group/card hover:shadow-md transition-all hover:-translate-y-0.5 duration-200"
            >
              {/* Left Top ribbon stamp banner exactly matching visual layout */}
              <div className="absolute top-0 left-0 bg-[#ffcdd2] text-[#c2185b] font-black px-2 py-1 rounded-br-lg shadow-sm flex items-center gap-0.5 z-10 text-[8px] sm:text-[8.5px] uppercase tracking-wider">
                <Ticket className="w-2.5 h-2.5" />
                <span>STADIUM PASS</span>
              </div>

              {/* Guided Tours Badge */}
              <div className="mt-1.5 self-center z-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/40 border border-white/10 text-white text-[9px] font-bold shadow-sm backdrop-blur-md">
                  <Globe className="w-3 h-3 text-[#00bfa5] animate-spin-slow" />
                  <span>Guided Tours</span>
                </div>
              </div>

              {/* Tournament stadium arcs simulated inside vector overlays */}
              <svg className="absolute inset-x-0 bottom-0 w-full h-1/2 opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M 0,200 Q 100,120 200,200 T 400,200" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="200" cy="180" r="50" fill="none" stroke="white" strokeWidth="1" />
              </svg>

              {/* Central text display */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-0.5">
                <div className="px-2 py-0.5 rounded-lg bg-[#ce183a] border border-[#fff5f6]/30 text-white text-[8px] sm:text-[9px] font-black tracking-widest uppercase shadow mb-1 italic rotate-1">
                  World Football Tournament
                </div>
                <h3 className="text-sm sm:text-base md:text-base lg:text-[17px] text-white font-[950] tracking-tight leading-none text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm">
                  Match-Day Tours
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mt-0.5">& Stadium Passes</span>
                </h3>
              </div>

              {/* Card Footer T&Cs apply */}
              <div className="z-10 flex items-center justify-between border-t border-white/5 pt-1.5 text-[8.5px]">
                <span className="text-white/50 font-semibold uppercase tracking-wider">
                  T&Cs apply
                </span>
                <span className="text-[#00bfa5] font-black uppercase flex items-center gap-0.5 group-hover/card:underline">
                  <span>Explore Tickets</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>

            </div>

            {/* -------------------- CARD 3: Green Summer Surf & Save -------------------- */}
            <div 
              onClick={() => handleCardClick('summer')}
              className="w-[280px] sm:w-[325px] md:w-full shrink-0 md:shrink aspect-[16/7.8] bg-gradient-to-br from-[#00b906] via-[#049408] to-[#015403] rounded-[1.25rem] relative overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 cursor-pointer shadow-sm select-none snap-start group/card hover:shadow-md transition-all hover:-translate-y-0.5 duration-200"
            >
              {/* Left Top Resort Ribbon Stamp */}
              <div className="absolute top-0 left-0 bg-[#ffe0b2] text-[#e65100] font-black px-2 py-1 rounded-br-lg shadow-sm flex items-center gap-0.5 z-10 text-[8px] sm:text-[8.5px] uppercase tracking-wider">
                <Compass className="w-2.5 h-2.5 text-orange-500 fill-orange-400" />
                <span>WATER PARKS</span>
              </div>

              {/* Layout splits into characters left and highlight promotion block right */}
              <div className="flex-1 flex items-center justify-between gap-2 mt-3 z-10">
                
                {/* Left graphics */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative bg-gradient-to-br from-amber-300 to-orange-400 text-orange-950 font-black px-2 py-1 rounded-lg border border-white shadow shadow-sm rotate-[-2deg]">
                    <span className="block text-[7px] uppercase tracking-tight text-center leading-none text-orange-100 font-bold">SUMMER</span>
                    <span className="block text-[9px] text-white uppercase font-black leading-none tracking-tighter drop-shadow-sm">Break</span>
                  </div>

                  {/* Character surfing graphics scaled down */}
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="relative flex flex-col items-center"
                    >
                      <div className="w-5 h-5 bg-red-500 rounded-full border border-white flex items-center justify-center shadow-sm">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black rounded-full" /></div>
                          <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black rounded-full" /></div>
                        </div>
                      </div>
                      <div className="w-7 h-1 bg-yellow-400 rounded-full border border-yellow-250 mt-0.5 transform rotate-[-3deg]" />
                    </motion.div>

                    <motion.div 
                      className="relative flex flex-col items-center"
                    >
                      <div className="w-4 h-6 bg-amber-400 rounded-full border border-white flex items-center justify-center shadow-sm">
                        <div className="w-3 h-1.5 bg-black rounded absolute top-1 border border-white/25" />
                      </div>
                      <div className="w-7 h-1 bg-sky-500 rounded-full border border-sky-300 mt-0.5 transform rotate-[3deg]" />
                    </motion.div>
                  </div>
                </div>

                {/* Right highlight block matching the glossy save box */}
                <div className="flex-1 bg-[#00600a]/95 backdrop-blur-sm border border-green-300/20 rounded-xl p-2 text-center max-w-[150px]">
                  <h4 className="text-[10px] sm:text-xs text-white font-black uppercase leading-tight tracking-wider transform group-hover/card:scale-105 transition-transform duration-300">
                    Swim, slide & save
                  </h4>
                  
                  {/* Highlight pill */}
                  <div className="bg-[#daff14] border border-white rounded-lg px-2 py-0.5 mt-1.5 text-[#014002] font-black text-[10px] sm:text-[11px] tracking-tight hover:brightness-105 shadow-sm">
                    Extra 15% off
                  </div>
                </div>

              </div>

              {/* Card Footer T&Cs apply */}
              <div className="z-10 flex items-center justify-between border-t border-white/5 pt-1.5 text-[8.5px] text-green-200">
                <span className="font-semibold uppercase tracking-wider">
                  T&Cs apply
                </span>
                <span className="font-extrabold uppercase flex items-center gap-0.5">
                  <span>Park Specials</span>
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
