import React, { useState } from 'react';
import { Instagram, Facebook, ChevronDown, Mail } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import SettingsModal from './SettingsModal';
import { getCurrencyCountryCode, getCurrencyFlag } from '../utils/currencyFlags';

const SafeFlag = ({ src, alt, fallbackEmoji, className }: { src: string; alt: string; fallbackEmoji: string; className?: string }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <span className="text-[13px] select-none leading-none shrink-0" role="img" aria-label={alt}>{fallbackEmoji}</span>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
};

export default function Footer({ onExplore, onNavigate }: { onExplore?: () => void, onNavigate?: (page: 'home' | 'attractions-and-museums' | 'hot-deals' | 'blog' | 'wishlist' | 'about' | 'privacy-policy' | 'cookie-policy' | 'terms-and-conditions') => void }) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { currency, language } = useSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-10 pb-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4 block">
                Tiqsey<span className="text-brand">.</span>
              </span>
              <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm mb-4">
                Making culture accessible to everyone. We help you find and book the best tickets for museums and attractions worldwide.
              </p>
            </div>
            

          </div>

          {/* Links block */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mt-4 lg:mt-0 lg:pl-12 xl:pl-16">
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-2.5 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('home'); }}>Home</a></li>
                <li><a href="#" className="hover:text-brand transition-colors font-bold text-amber-400" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('hot-deals'); }}>Hot Deals 🔥</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('blog'); }}>Travel Blog 📖</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('attractions-and-museums'); }}>Things to do 🏛️</a></li>
                <li><a href="/admin" className="hover:text-brand transition-colors">Admin Panel ⚙️</a></li>
              </ul>
            </div>
          
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">About</h4>
              <ul className="space-y-2.5 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('about'); }}>About Tiqsey</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('privacy-policy'); }}>Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('cookie-policy'); }}>Cookie Policy</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('terms-and-conditions'); }}>Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Support & Media</h4>
              <ul className="space-y-3 font-semibold text-gray-400">
                <li>
                  <a href="mailto:support@tiqsey.com" className="flex items-center gap-2.5 hover:text-brand transition-colors text-[13px] sm:text-sm break-all sm:break-normal group">
                    <Mail className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors shrink-0" />
                    <span>support@tiqsey.com</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/people/Tiqsy/61581389273998" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#1877F2] transition-all group duration-200">
                    <Facebook className="w-4 h-4 text-gray-500 group-hover:text-[#1877F2] transition-colors shrink-0" />
                    <span className="text-sm">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/tiqsey_official/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#E4405F] transition-all group duration-200">
                    <Instagram className="w-4 h-4 text-gray-500 group-hover:text-[#E4405F] transition-colors shrink-0" />
                    <span className="text-sm">Instagram</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col border-t border-white/10 pt-6 md:flex-row justify-between items-center gap-6 text-xs font-bold text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Copyright */}
            <p>© {currentYear} Tiqsey. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-gray-700">•</span>
              <a href="/admin" className="hover:text-brand transition-colors">Admin Panel</a>
            </div>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto">
            <button 
              onClick={() => setSettingsModalOpen(true)}
              className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl transition-all border border-gray-200 text-slate-700 shadow-2xs w-full sm:w-auto font-sans"
              title={`${language.nativeName} | ${currency.code.toUpperCase()}`}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-3.5 select-none shrink-0 rounded-xs overflow-hidden flex items-center justify-center border border-slate-200">
                  <SafeFlag
                    src={`https://flagcdn.com/w40/${language.countryCode}.png`}
                    alt={language.name}
                    fallbackEmoji={language.flag}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                  {language.code}
                </span>
              </div>

              <span className="text-slate-300 font-bold">•</span>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-3.5 select-none shrink-0 rounded-xs overflow-hidden flex items-center justify-center border border-slate-200">
                  <SafeFlag
                    src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                    alt={`${currency.code} flag`}
                    fallbackEmoji={getCurrencyFlag(currency.code)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[13px] font-bold text-slate-800 tracking-wide">
                  {currency.code} {currency.symbol}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-500 ml-0.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />
    </footer>
  );
}
