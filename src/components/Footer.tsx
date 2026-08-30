import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Video,
  ChevronDown, 
  Mail, 
  Home, 
  Flame, 
  Ticket, 
  MapPin, 
  BookOpen, 
  User, 
  Briefcase, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  ArrowRight, 
  Globe, 
  Check,
  Newspaper,
  Cookie,
  Landmark
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from './SettingsModal';
import { getCurrencyCountryCode, getCurrencyFlag } from '../utils/currencyFlags';

const SafeFlag = ({ src, alt, fallbackEmoji, className }: { src: string; alt: string; fallbackEmoji: string; className?: string }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <span className="text-[12px] select-none leading-none shrink-0" role="img" aria-label={alt}>{fallbackEmoji}</span>;
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
  const { user } = useAuth();
  const isAdmin = user && (user.email.toLowerCase() === 'admin@tiqsey.com' || user.role === 'admin');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { currency, language } = useSettings();

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#040a17] text-white pt-12 pb-8 border-t border-slate-800/60 relative overflow-hidden font-sans">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[400px] bg-red-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <div className="bg-[#071124] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800/80 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-10 border-b border-slate-800/80">
            
            {/* Column 1: Brand & Support Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-3xl md:text-4xl font-black tracking-tight text-white block">
                  Tiqsey<span className="text-[#ff3b30]">.</span>
                </span>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mt-3 max-w-xs">
                  Making culture accessible to everyone. We help you find and book the best tickets for museums and attractions worldwide.
                </p>
              </div>

              {/* Social Media Icon Row - Facebook, Instagram, Gmail */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://www.facebook.com/people/Tiqsy/61581389273998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0e1d38] hover:bg-[#ff3b30] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-800/80 shadow-xs"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
                <a
                  href="https://www.instagram.com/tiqsey_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0e1d38] hover:bg-[#ff3b30] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-800/80 shadow-xs"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@tiqsey.com"
                  className="w-9 h-9 rounded-full bg-[#0e1d38] hover:bg-[#ff3b30] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-800/80 shadow-xs"
                  aria-label="Gmail / Email Support"
                  title="Email Us (support@tiqsey.com)"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>


            </div>

            {/* Column 2: Platform (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Platform</h4>
                <div className="w-5 h-[2px] bg-[#ff3b30] rounded-full mt-2" />
              </div>
              <ul className="space-y-3.5 text-sm font-medium text-slate-300 pt-1">
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('home'); }}>
                    <Home className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 text-[#ff3b30] font-bold hover:text-red-400 transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('hot-deals'); }}>
                    <Flame className="w-4 h-4 text-[#ff3b30] fill-current" />
                    <span>Hot Deals</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('attractions-and-museums'); }}>
                    <Ticket className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Things To Do</span>
                  </a>
                </li>

                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('blog'); }}>
                    <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Travel Blog</span>
                  </a>
                </li>
                {isAdmin && (
                  <li>
                    <a href="/admin" className="flex items-center gap-2.5 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
                      <ShieldCheck className="w-4 h-4 text-indigo-400 fill-indigo-400/10 group-hover:text-indigo-300 transition-colors" />
                      <span>Admin Command Center</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: About & Policies (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">About & Policies</h4>
                <div className="w-5 h-[2px] bg-[#ff3b30] rounded-full mt-2" />
              </div>
              <ul className="space-y-3.5 text-sm font-medium text-slate-300 pt-1">
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('about'); }}>
                    <User className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>About Tiqsey</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('cookie-policy'); }}>
                    <Cookie className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Cookie Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('privacy-policy'); }}>
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('terms-and-conditions'); }}>
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Terms & Conditions</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Support & Media + Newsletter (4 cols in lg) */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Support & Media</h4>
                <div className="w-5 h-[2px] bg-[#ff3b30] rounded-full mt-2" />
              </div>

              <ul className="space-y-3 text-sm font-medium text-slate-300 pt-1">
                <li>
                  <a href="mailto:support@tiqsey.com" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#ff3b30] transition-colors" />
                    <span className="truncate">support@tiqsey.com</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/people/Tiqsy/61581389273998" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group">
                    <Facebook className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/tiqsey_official/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#ff3b30] transition-colors group">
                    <Instagram className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#ff3b30] transition-colors" />
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>

              {/* Newsletter subscription box */}
              <div className="pt-4 border-t border-slate-800/40 lg:border-t-0 lg:pt-2">
                <h5 className="text-sm font-bold text-white tracking-tight">Subscribe to our newsletter</h5>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5 mb-3.5">
                  Get the latest travel deals and inspiration straight to your inbox.
                </p>

                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#0d1a33]/90 text-white text-sm px-4 py-2.5 rounded-full border border-slate-800/80 focus:outline-none focus:border-[#ff3b30] placeholder:text-slate-500 pr-12 font-medium transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 w-8 h-8 rounded-full bg-[#ff3b30] hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
                    title="Subscribe"
                  >
                    {subscribed ? <Check className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </form>
                {subscribed && (
                  <p className="text-xs text-emerald-400 font-semibold mt-1.5">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Bar Section */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400/90 font-medium">
            {/* Copyright & Security Badge */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span>© {currentYear} Tiqsey. All rights reserved.</span>
              <span className="text-slate-850 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Trusted & Secure</span>
              </div>
            </div>

            {/* Payment Logos */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <span className="text-xs text-slate-400 font-bold tracking-wide uppercase mr-1 self-center">We Accept</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {/* Visa */}
                <div className="h-6 px-2.5 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <span className="font-extrabold italic text-blue-700 text-[11px] tracking-tight">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#eb001b]" />
                    <div className="w-3 h-3 rounded-full bg-[#ff5f00] -ml-1.2 opacity-95" />
                  </div>
                </div>
                {/* AMEX */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <span className="font-black text-[#006fcf] text-[9px] tracking-tighter">AMEX</span>
                </div>
                {/* Discover */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <div className="flex items-center text-[#0f3460] font-black text-[8px] tracking-tighter">
                    <span>DISC</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-[0.5px]" />
                    <span>VER</span>
                  </div>
                </div>
                {/* RuPay */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <div className="flex items-center font-black text-slate-900 text-[9px] italic">
                    <span>RuPay</span>
                    <span className="text-amber-500 font-normal ml-0.5">›</span>
                  </div>
                </div>
                {/* UPI */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <div className="flex items-center font-black text-[9px] tracking-tight">
                    <span className="text-slate-800">U</span>
                    <span className="text-emerald-600">P</span>
                    <span className="text-amber-500">I</span>
                  </div>
                </div>
                {/* Apple Pay */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                  <div className="flex items-center gap-0.5 text-slate-900 font-bold text-[10px]">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.03-7.72-7.83-12.08-14.38-7.39-11.13-13.1-23.75-17.13-37.88-4.03-14.12-6.05-27.56-6.05-40.31 0-15.64 3.86-28.78 11.58-39.42 7.72-10.64 17.57-16.03 29.56-16.18 4.8 0 10.02 1.25 15.66 3.75 5.64 2.5 9.77 3.81 12.39 3.94 2.13-.13 6.32-1.44 12.58-3.94 6.26-2.5 11.29-3.69 15.09-3.56 11.18.52 20.31 4.54 27.38 12.06-9.98 6.04-14.86 14.53-14.65 25.48.2 10.95 5.25 19.64 15.15 26.07-4.13 11.87-9.84 22.95-17.13 33.24zm-22.38-111.89c0 7.37-2.7 14.32-8.1 20.84-5.4 6.53-12.08 10.39-20.03 11.58-.26-.92-.39-1.97-.39-3.15 0-7.36 2.76-14.39 8.28-21.08 5.52-6.69 12.23-10.57 20.13-11.64.06.8.11 1.95.11 3.45z"/>
                    </svg>
                    <span>Pay</span>
                  </div>
                </div>
                {/* Net Banking / Bank */}
                <div className="h-6 px-2 bg-white border border-slate-200 rounded-md flex items-center justify-center shadow-xs hover:scale-105 transition-transform" title="Net Banking">
                  <Landmark className="w-3.5 h-3.5 text-[#0f3460]" />
                </div>
              </div>
            </div>

            {/* Language & Currency Selectors */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#0d1a33] hover:bg-[#122240] text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="uppercase">{language.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => setSettingsModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#0d1a33] hover:bg-[#122240] text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <div className="w-4 h-3 select-none shrink-0 rounded-xs overflow-hidden flex items-center justify-center border border-slate-700">
                  <SafeFlag
                    src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                    alt={`${currency.code} flag`}
                    fallbackEmoji={getCurrencyFlag(currency.code)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{currency.code.toUpperCase()} {currency.symbol}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

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
