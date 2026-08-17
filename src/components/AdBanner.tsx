import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Landmark, 
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
    }, 2500);
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

        {/* Promotions Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Purple Playful PLAY PASSES Card */}
          <div 
            onClick={() => handleCardClick('deals')}
            className="aspect-[16/10] bg-[#7700e6] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md select-none group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-purple-500/30"
          >
            {/* Halftone Dot pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1.5px)',
                backgroundSize: '14px 14px'
              }}
            />
            
            {/* Star sparks & lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30 pointer-events-none" />

            {/* Floating Ticket elements exactly styled as in image.png */}
            <motion.div 
              animate={{ rotate: [10, 14, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-5 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none"
            >
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
              <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
            </motion.div>

            <motion.div 
              animate={{ rotate: [-22, -18, -22] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-5 right-11 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none"
            >
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
              <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
            </motion.div>

            <motion.div 
              animate={{ rotate: [-16, -12, -16] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-6 w-12 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none"
            >
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
              <span className="font-black text-purple-950 text-sm italic mx-auto">%</span>
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
            </motion.div>

            <motion.div 
              animate={{ rotate: [26, 30, 26] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 right-10 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none"
            >
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
              <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
              <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
            </motion.div>

            {/* Top info row */}
            <div className="z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400 text-purple-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Flame className="w-2.5 h-2.5 text-orange-600 fill-orange-500" />
                <span>PLAY DEAL</span>
              </div>
            </div>

            {/* Central Title Splash Block */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
              <span className="block text-yellow-300 font-extrabold text-xs italic tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] transform -rotate-1">
                Grab all your
              </span>
              <h4 className="text-2xl font-[1000] tracking-tighter text-white italic leading-none select-none uppercase drop-shadow-[0_2.5px_0px_#1e004a] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] my-1 transform group-hover/card:scale-105 transition-transform duration-300">
                PLAY PASSES
              </h4>
              <div className="flex items-center justify-center gap-1 relative">
                <span className="block text-lg font-black text-[#ff22ab] drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] uppercase italic tracking-widest transform rotate-2">
                  HERE!
                </span>
                <div className="bg-slate-900/60 p-0.5 rounded-full border border-white/20 shadow">
                  <MousePointerClick className="w-3.5 h-3.5 text-yellow-300 fill-yellow-200" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Footer row containing interactive Code copiers */}
            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[10px] text-white/85 font-semibold uppercase tracking-wider">
                🎉 CODE: <span className="text-yellow-300 font-extrabold font-mono">TIQSEYPLAY</span>
              </span>
              
              <button
                type="button"
                onClick={(e) => handleCopy(e, 'TIQSEYPLAY')}
                title="Copy coupon code"
                className="px-2 py-0.5 rounded bg-slate-950/70 hover:bg-slate-950 border border-yellow-400/40 text-[10px] text-white flex items-center gap-1 font-bold transition-colors"
              >
                {copiedCode === 'TIQSEYPLAY' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Card 2: Teal World Football Tournament */}
          <div 
            onClick={() => handleCardClick('tournament')}
            className="aspect-[16/10] bg-[#055c63] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md select-none group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-teal-500/20"
          >
            {/* Left Top ribbon stamp banner */}
            <div className="absolute top-0 left-0 bg-[#ffcdd2] text-[#c2185b] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-0.5 z-10 text-[9px] uppercase tracking-wider">
              <Ticket className="w-3 h-3" />
              <span>STADIUM PASS</span>
            </div>

            {/* Guided Tours Badge */}
            <div className="mt-2 self-end z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/40 border border-white/10 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
                <Globe className="w-3 h-3 text-[#00bfa5]" />
                <span>Guided Tours</span>
              </div>
            </div>

            {/* Tournament stadium arcs simulated inside vector overlays */}
            <svg className="absolute inset-x-0 bottom-0 w-full h-1/2 opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path d="M 0,200 Q 100,120 200,200 T 400,200" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="200" cy="180" r="50" fill="none" stroke="white" strokeWidth="1" />
            </svg>

            {/* Central text display */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-1">
              <div className="px-2 py-0.5 rounded-lg bg-[#ce183a] border border-[#fff5f6]/30 text-white text-[10px] font-black tracking-widest uppercase shadow mb-1.5 italic rotate-1">
                World Football Tournament
              </div>
              <h4 className="text-base sm:text-lg text-white font-[950] tracking-tight leading-none text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm">
                Match-Day Tours
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mt-1">& Stadium Passes</span>
              </h4>
            </div>

            {/* Card Footer */}
            <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
              <span className="text-white/60 font-semibold uppercase tracking-wider">
                T&Cs apply
              </span>
              <span className="text-[#00bfa5] font-black uppercase flex items-center gap-0.5 group-hover/card:underline">
                <span>Explore Tickets</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

          </div>

          {/* Card 3: Green Summer Surf & Save */}
          <div 
            onClick={() => handleCardClick('summer')}
            className="aspect-[16/10] bg-[#049408] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md select-none group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-green-500/20"
          >
            {/* Left Top Resort Ribbon Stamp */}
            <div className="absolute top-0 left-0 bg-[#ffe0b2] text-[#e65100] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-0.5 z-10 text-[9px] uppercase tracking-wider">
              <Compass className="w-3 h-3 text-orange-500 fill-orange-400" />
              <span>WATER PARKS</span>
            </div>

            {/* Layout splits into characters left and highlight promotion block right */}
            <div className="flex-1 flex items-center justify-between gap-2 mt-4 z-10">
              
              {/* Left graphics */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative bg-gradient-to-br from-amber-300 to-orange-400 text-orange-950 font-black px-2 py-1 rounded-lg border border-white shadow-xs rotate-[-2deg]">
                  <span className="block text-[8px] uppercase tracking-tight text-center leading-none text-orange-100 font-bold">SUMMER</span>
                  <span className="block text-[10px] text-white uppercase font-black leading-none tracking-tighter drop-shadow-xs">Break</span>
                </div>

                {/* Character surfing graphics */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-red-500 rounded-full border border-white flex items-center justify-center shadow-xs">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black rounded-full" /></div>
                      <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black rounded-full" /></div>
                    </div>
                  </div>
                  <div className="w-4 h-5 bg-amber-400 rounded-full border border-white flex items-center justify-center shadow-xs relative">
                    <div className="w-2.5 h-1 bg-black rounded absolute top-1" />
                  </div>
                </div>
              </div>

              {/* Right highlight block */}
              <div className="flex-1 bg-[#00600a]/95 backdrop-blur-sm border border-green-300/20 rounded-xl p-2.5 text-center max-w-[150px]">
                <h4 className="text-[11px] text-white font-black uppercase leading-tight tracking-wider transform group-hover/card:scale-105 transition-transform duration-300">
                  Swim, slide & save
                </h4>
                
                {/* Highlight pill */}
                <div className="bg-[#daff14] border border-white rounded-lg px-2 py-0.5 mt-1.5 text-[#014002] font-black text-[10px] tracking-tight hover:brightness-105 shadow-xs">
                  Extra 15% off
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-green-200">
              <span className="font-semibold uppercase tracking-wider">
                T&Cs apply
              </span>
              <span className="font-extrabold uppercase flex items-center gap-0.5">
                <span>Park Specials</span>
              </span>
            </div>

          </div>

          {/* Card 4: Pink/Rose City Destinations */}
          <div 
            onClick={() => handleCardClick('destinations')}
            className="aspect-[16/10] bg-gradient-to-br from-pink-600 via-rose-500 to-amber-500 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md select-none group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-rose-400/20"
          >
            {/* Particle overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1.5px)',
                backgroundSize: '12px 12px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-black/20 pointer-events-none" />

            {/* Stamp on Top Left */}
            <div className="absolute top-0 left-0 bg-[#ffe0b2] text-[#e65100] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-0.5 z-10 text-[9px] uppercase tracking-wider">
              <Landmark className="w-3 h-3 text-orange-600" />
              <span>CITY GUIDE</span>
            </div>

            {/* Featured destination badge */}
            <div className="mt-2 self-end z-10">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
                <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                <span>Featured City</span>
              </div>
            </div>

            {/* Central typography */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-1">
              <span className="block text-rose-100 font-extrabold text-[10px] uppercase tracking-widest drop-shadow-xs">
                Discover top picks in
              </span>
              <h4 className="text-base text-white font-[1000] tracking-tighter leading-none text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm uppercase my-1">
                Kuala Lumpur
              </h4>
              <span className="block text-[9px] text-amber-100 font-bold tracking-wide italic">
                Explore iconic towers & culture
              </span>
            </div>

            {/* Card Footer */}
            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-rose-100">
              <span className="font-semibold uppercase tracking-wider opacity-90">
                Best price guaranteed
              </span>
              <span className="font-extrabold uppercase flex items-center gap-0.5 text-yellow-300 group-hover/card:underline">
                <span>Explore Now</span>
                <ArrowRight className="w-2.5 h-2.5 text-yellow-300" />
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
