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
  Tag,
  Gift,
  ExternalLink
} from 'lucide-react';
import { PromotionalBanner } from '../types';

interface BannerCardProps {
  banner: PromotionalBanner;
  onSelectDestination?: (dest: string) => void;
  mode?: 'live' | 'preview';
  onNavigateAction?: (url: string) => void;
}

export default function BannerCard({ 
  banner, 
  onSelectDestination, 
  mode = 'live',
  onNavigateAction
}: BannerCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleCardClick = () => {
    if (mode === 'preview') {
      return;
    }

    const dest = banner.destinationUrl || '';
    if (!dest) return;

    if (banner.destinationType === 'destination') {
      if (onSelectDestination) {
        onSelectDestination(dest);
      } else {
        const el = document.getElementById('destinations');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (banner.destinationType === 'section' || dest === 'deals' || dest === 'tournament' || dest === 'summer') {
      if (dest === 'deals' || dest === '#hot-deals' || dest === 'summer') {
        const el = document.getElementById('hot-deals');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (dest === 'tournament' || dest === '#popular-attractions') {
        const el = document.getElementById('popular-attractions') || document.getElementById('destinations');
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        const targetId = dest.replace('#', '');
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (banner.destinationType === 'activity') {
      if (onNavigateAction) {
        onNavigateAction(dest);
      } else {
        window.location.href = dest;
      }
    } else if (dest.startsWith('http://') || dest.startsWith('https://')) {
      window.open(dest, '_blank', 'noopener,noreferrer');
    } else {
      if (onNavigateAction) {
        onNavigateAction(dest);
      } else if (dest.startsWith('#')) {
        const targetId = dest.replace('#', '');
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = dest;
      }
    }
  };

  const renderBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-2.5 h-2.5 text-orange-600 fill-orange-500" />;
      case 'ticket':
        return <Ticket className="w-3 h-3 text-[#c2185b]" />;
      case 'compass':
        return <Compass className="w-3 h-3 text-orange-500 fill-orange-400" />;
      case 'landmark':
        return <Landmark className="w-3 h-3 text-orange-600" />;
      case 'globe':
        return <Globe className="w-3 h-3 text-cyan-400" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3 text-yellow-300" />;
      case 'gift':
        return <Gift className="w-3 h-3 text-rose-400" />;
      case 'tag':
        return <Tag className="w-3 h-3 text-emerald-400" />;
      default:
        return <Sparkles className="w-2.5 h-2.5 text-amber-400" />;
    }
  };

  // 0. Template: Ready-Made Image Graphic Banner (Direct Upload Artwork)
  if (banner.template === 'readymade-image' || banner.bannerType === 'readymade') {
    const hasImage = Boolean(banner.customImageUrl);
    const fitMode = banner.imageFit || 'cover';
    const aspectClass = 
      banner.aspectRatio === '16/9' ? 'aspect-[16/9]' :
      banner.aspectRatio === '4/3' ? 'aspect-[4/3]' :
      banner.aspectRatio === '21/9' ? 'aspect-[21/9]' :
      banner.aspectRatio === '3/2' ? 'aspect-[3/2]' :
      banner.aspectRatio === '1/1' ? 'aspect-square' :
      banner.aspectRatio === 'auto' ? 'aspect-auto min-h-[160px]' :
      'aspect-[16/10]';

    const fitClass = 
      fitMode === 'contain' ? 'object-contain' :
      fitMode === 'fill' ? 'object-fill' :
      fitMode === 'scale-down' ? 'object-scale-down' :
      fitMode === 'natural' ? 'object-contain h-auto max-h-full' :
      'object-cover'; // default 'cover' to fill card smoothly without borders

    return (
      <div 
        onClick={handleCardClick}
        style={{
          backgroundColor: banner.imageBgColor || banner.customBgColor || '#0a0d14'
        }}
        className={`w-full ${aspectClass} rounded-2xl relative overflow-hidden flex items-center justify-center cursor-pointer shadow-md group/card hover:shadow-2xl transition-all hover:-translate-y-1 duration-200 border border-slate-200/60 dark:border-slate-800/80 text-left`}
      >
        {hasImage ? (
          <>
            <img 
              src={banner.customImageUrl} 
              alt={banner.title || 'Promotional Banner'}
              referrerPolicy="no-referrer"
              className={`w-full h-full ${fitClass} object-center group-hover/card:scale-[1.015] transition-transform duration-300 rounded-2xl`}
            />
            {/* Subtle gloss hover highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-dashed border-slate-700 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
              <ExternalLink className="w-6 h-6 text-sky-400" />
            </div>
            <p className="text-xs font-bold text-slate-200">Ready-made Banner Artwork</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Upload or select a finished banner image</p>
          </div>
        )}
      </div>
    );
  }

  // 1. Template: Purple Play Passes Deal Card
  if (banner.template === 'play-passes') {
    return (
      <div 
        onClick={handleCardClick}
        style={{
          backgroundColor: banner.customBgColor || '#7700e6'
        }}
        className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-purple-500/30 text-left"
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

        {/* Floating Ticket elements styled as in reference photo */}
        <motion.div 
          animate={{ rotate: [10, 14, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 left-5 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none z-0"
        >
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
          <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
        </motion.div>

        <motion.div 
          animate={{ rotate: [-22, -18, -22] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-5 right-11 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none z-0"
        >
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
          <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
        </motion.div>

        <motion.div 
          animate={{ rotate: [-16, -12, -16] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-6 w-12 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none z-0"
        >
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
          <span className="font-black text-purple-950 text-sm italic mx-auto">%</span>
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
        </motion.div>

        <motion.div 
          animate={{ rotate: [26, 30, 26] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 right-10 w-11 aspect-[1.8/1] bg-gradient-to-r from-amber-300 to-yellow-400 rounded shadow border border-yellow-250/20 flex items-center justify-between px-1.5 pointer-events-none z-0"
        >
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -left-0.5 absolute" />
          <span className="font-black text-purple-950 text-xs italic mx-auto">%</span>
          <div className="w-1.5 h-1.5 bg-[#5c03c4] rounded-full -right-0.5 absolute" />
        </motion.div>

        {/* Top info row */}
        <div className="z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400 text-purple-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
            {renderBadgeIcon(banner.badgeIcon || 'flame')}
            <span>{banner.badgeText || 'PLAY DEAL'}</span>
          </div>
        </div>

        {/* Central Title Splash Block */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-1">
          {banner.subtitle && (
            <span className="block text-yellow-300 font-extrabold text-xs italic tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] transform -rotate-1">
              {banner.subtitle}
            </span>
          )}
          {banner.title && (
            <h4 className="text-2xl font-[1000] tracking-tighter text-white italic leading-none uppercase drop-shadow-[0_2.5px_0px_#1e004a] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] my-1 transform group-hover/card:scale-105 transition-transform duration-300">
              {banner.title}
            </h4>
          )}
          {banner.highlightText && (
            <div className="flex items-center justify-center gap-1 relative">
              <span className="block text-lg font-black text-[#ff22ab] drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] uppercase italic tracking-widest transform rotate-2">
                {banner.highlightText}
              </span>
              <div className="bg-slate-900/60 p-0.5 rounded-full border border-white/20 shadow">
                <MousePointerClick className="w-3.5 h-3.5 text-yellow-300 fill-yellow-200" strokeWidth={2.5} />
              </div>
            </div>
          )}
        </div>

        {/* Footer row containing interactive Code copiers */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-[10px] text-white/85 font-semibold uppercase tracking-wider">
            🎉 CODE: <span className="text-yellow-300 font-extrabold font-mono">{banner.promoCode || 'TIQSEYPLAY'}</span>
          </span>
          
          {banner.promoCode && (
            <button
              type="button"
              onClick={(e) => handleCopy(e, banner.promoCode || '')}
              title="Copy coupon code"
              className="px-2 py-0.5 rounded bg-slate-950/70 hover:bg-slate-950 border border-yellow-400/40 text-[10px] text-white flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              {copiedCode === banner.promoCode ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{banner.ctaText || 'Copy'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    );
  }

  // 2. Template: Stadium Pass Dark Teal
  if (banner.template === 'stadium-pass') {
    return (
      <div 
        onClick={handleCardClick}
        style={{
          backgroundColor: banner.customBgColor || '#055c63'
        }}
        className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-teal-500/20 text-left"
      >
        {/* Left Top ribbon stamp banner */}
        <div className="absolute top-0 left-0 bg-[#ffcdd2] text-[#c2185b] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-1 z-10 text-[9px] uppercase tracking-wider">
          {renderBadgeIcon(banner.badgeIcon || 'ticket')}
          <span>{banner.badgeText || 'STADIUM PASS'}</span>
        </div>

        {/* Guided Tours Badge */}
        {banner.secondaryBadge && (
          <div className="mt-1 self-end z-10">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/40 border border-white/10 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
              <Globe className="w-3 h-3 text-[#00bfa5]" />
              <span>{banner.secondaryBadge}</span>
            </div>
          </div>
        )}

        {/* Tournament stadium arcs simulated inside vector overlays */}
        <svg className="absolute inset-x-0 bottom-0 w-full h-1/2 opacity-15 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path d="M 0,200 Q 100,120 200,200 T 400,200" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="200" cy="180" r="50" fill="none" stroke="white" strokeWidth="1" />
        </svg>

        {/* Central text display */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-1">
          {banner.subtitle && (
            <div className="px-2 py-0.5 rounded-lg bg-[#ce183a] border border-[#fff5f6]/30 text-white text-[10px] font-black tracking-widest uppercase shadow mb-1.5 italic rotate-1">
              {banner.subtitle}
            </div>
          )}
          {(banner.title || banner.highlightText) && (
            <h4 className="text-base sm:text-lg text-white font-[950] tracking-tight leading-none text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm">
              {banner.title}
              {banner.highlightText && (
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mt-1">
                  {banner.highlightText}
                </span>
              )}
            </h4>
          )}
        </div>

        {/* Card Footer */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
          <span className="text-white/60 font-semibold uppercase tracking-wider">
            {banner.termsText || 'T&CS APPLY'}
          </span>
          <span className="text-[#00bfa5] font-black uppercase flex items-center gap-0.5 group-hover/card:underline">
            <span>{banner.ctaText || 'EXPLORE TICKETS'}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>
    );
  }

  // 3. Template: Water Parks Summer Break Green
  if (banner.template === 'water-parks') {
    return (
      <div 
        onClick={handleCardClick}
        style={{
          backgroundColor: banner.customBgColor || '#049408'
        }}
        className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-green-500/20 text-left"
      >
        {/* Left Top Resort Ribbon Stamp */}
        <div className="absolute top-0 left-0 bg-[#ffe0b2] text-[#e65100] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-1 z-10 text-[9px] uppercase tracking-wider">
          {renderBadgeIcon(banner.badgeIcon || 'compass')}
          <span>{banner.badgeText || 'WATER PARKS'}</span>
        </div>

        {/* Layout splits into characters left and highlight promotion block right */}
        <div className="flex-1 flex items-center justify-between gap-2 mt-4 z-10">
          
          {/* Left graphics */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative bg-gradient-to-br from-amber-300 to-orange-400 text-orange-950 font-black px-2 py-1 rounded-lg border border-white shadow-xs rotate-[-2deg]">
              <span className="block text-[8px] uppercase tracking-tight text-center leading-none text-orange-100 font-bold">
                {banner.secondaryBadge?.split(' ')[0] || 'SUMMER'}
              </span>
              <span className="block text-[10px] text-white uppercase font-black leading-none tracking-tighter drop-shadow-xs">
                {banner.secondaryBadge?.split(' ').slice(1).join(' ') || 'BREAK'}
              </span>
            </div>

            {/* Character graphics */}
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
            {banner.title && (
              <h4 className="text-[11px] text-white font-black uppercase leading-tight tracking-wider transform group-hover/card:scale-105 transition-transform duration-300">
                {banner.title}
              </h4>
            )}
            
            {/* Highlight pill */}
            {banner.highlightText && (
              <div className="bg-[#daff14] border border-white rounded-lg px-2 py-0.5 mt-1.5 text-[#014002] font-black text-[10px] tracking-tight hover:brightness-105 shadow-xs">
                {banner.highlightText}
              </div>
            )}
          </div>

        </div>

        {/* Card Footer */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-green-200">
          <span className="font-semibold uppercase tracking-wider">
            {banner.termsText || 'T&CS APPLY'}
          </span>
          <span className="font-extrabold uppercase flex items-center gap-0.5">
            <span>{banner.ctaText || 'PARK SPECIALS'}</span>
          </span>
        </div>

      </div>
    );
  }

  // 4. Template: City Guide Gradient Card
  if (banner.template === 'city-guide') {
    return (
      <div 
        onClick={handleCardClick}
        style={{
          background: banner.customGradientFrom && banner.customGradientTo 
            ? `linear-gradient(135deg, ${banner.customGradientFrom}, ${banner.customBgColor || '#e11d48'}, ${banner.customGradientTo})`
            : 'linear-gradient(135deg, #db2777, #e11d48, #f59e0b)'
        }}
        className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-rose-400/20 text-left"
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
        <div className="absolute top-0 left-0 bg-[#ffe0b2] text-[#e65100] font-black px-2.5 py-1 rounded-br-lg shadow-sm flex items-center gap-1 z-10 text-[9px] uppercase tracking-wider">
          {renderBadgeIcon(banner.badgeIcon || 'landmark')}
          <span>{banner.badgeText || 'CITY GUIDE'}</span>
        </div>

        {/* Featured destination badge */}
        {banner.secondaryBadge && (
          <div className="mt-1 self-end z-10">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
              <span>{banner.secondaryBadge}</span>
            </div>
          </div>
        )}

        {/* Central typography */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-1">
          {banner.subtitle && (
            <span className="block text-rose-100 font-extrabold text-[10px] uppercase tracking-widest drop-shadow-xs">
              {banner.subtitle}
            </span>
          )}
          {banner.title && (
            <h4 className="text-base text-white font-[1000] tracking-tighter leading-none text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm uppercase my-1">
              {banner.title}
            </h4>
          )}
          {banner.highlightText && (
            <span className="block text-[9px] text-amber-100 font-bold tracking-wide italic">
              {banner.highlightText}
            </span>
          )}
        </div>

        {/* Card Footer */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-rose-100">
          <span className="font-semibold uppercase tracking-wider opacity-90">
            {banner.termsText || 'BEST PRICE GUARANTEED'}
          </span>
          <span className="font-extrabold uppercase flex items-center gap-0.5 text-yellow-300 group-hover/card:underline">
            <span>{banner.ctaText || 'EXPLORE NOW'}</span>
            <ArrowRight className="w-2.5 h-2.5 text-yellow-300" />
          </span>
        </div>

      </div>
    );
  }

  // 5. Template: Custom Card (Custom image or background color)
  return (
    <div 
      onClick={handleCardClick}
      style={{
        background: banner.customImageUrl 
          ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.75)), url(${banner.customImageUrl}) center/cover no-repeat`
          : banner.customGradientFrom && banner.customGradientTo
            ? `linear-gradient(135deg, ${banner.customGradientFrom}, ${banner.customGradientTo})`
            : banner.customBgColor || '#1e293b'
      }}
      className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 cursor-pointer shadow-md group/card hover:shadow-xl transition-all hover:-translate-y-1 duration-200 border border-white/15 text-left"
    >
      {/* Top row */}
      <div className="z-10 flex items-center justify-between gap-2">
        {banner.badgeText && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
            {renderBadgeIcon(banner.badgeIcon)}
            <span>{banner.badgeText}</span>
          </div>
        )}
        {banner.secondaryBadge && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-bold shadow-sm backdrop-blur-md border border-white/10">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>{banner.secondaryBadge}</span>
          </div>
        )}
      </div>

      {/* Central content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10 my-1">
        {banner.subtitle && (
          <span className="block text-amber-200 font-extrabold text-[10px] uppercase tracking-widest drop-shadow-xs">
            {banner.subtitle}
          </span>
        )}
        {banner.title && (
          <h4 className="text-lg text-white font-[1000] tracking-tight leading-tight text-center transform group-hover/card:scale-[1.03] transition-transform duration-300 drop-shadow-sm uppercase my-1">
            {banner.title}
          </h4>
        )}
        {banner.highlightText && (
          <span className="block text-xs text-amber-300 font-bold tracking-wide italic">
            {banner.highlightText}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="z-10 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] text-white">
        <span className="text-white/80 font-semibold uppercase tracking-wider truncate max-w-[140px]">
          {banner.termsText || (banner.promoCode ? `CODE: ${banner.promoCode}` : 'LIMITED OFFER')}
        </span>
        <span className="font-extrabold uppercase flex items-center gap-1 text-amber-300 group-hover/card:underline shrink-0">
          <span>{banner.ctaText || 'EXPLORE'}</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
