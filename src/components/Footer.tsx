import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, ChevronDown, Server } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import SettingsModal from './SettingsModal';
import { getCurrencyCountryCode } from '../utils/currencyFlags';

export default function Footer({ onExplore, onNavigate }: { onExplore?: () => void, onNavigate?: (page: 'home' | 'attractions-and-museums' | 'hot-deals' | 'blog' | 'wishlist') => void }) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { currency } = useSettings();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => {
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-10 pb-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-between">
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
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm mt-4 lg:mt-0 lg:pl-16">
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#" onClick={(e) => { e.preventDefault(); if (onExplore) onExplore(); }} className="hover:text-brand transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-brand transition-colors font-bold text-amber-400" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('hot-deals'); }}>Hot Deals 🔥</a></li>
                <li><a href="#" className="hover:text-brand transition-colors" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('blog'); }}>Travel Blog 📖</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Gift Cards</a></li>
              </ul>
            </div>
          
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-brand transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Partners</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-brand transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Cancellation</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Social Media</h4>
              <ul className="space-y-3 font-semibold text-gray-400">
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-[#1877F2] transition-all group duration-200">
                    <Facebook className="w-5.5 h-5.5 text-gray-500 group-hover:text-[#1877F2] transition-colors" />
                    <span className="text-sm">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-[#E4405F] transition-all group duration-200">
                    <Instagram className="w-5.5 h-5.5 text-gray-500 group-hover:text-[#E4405F] transition-colors" />
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
            <p>© {currentYear} Tiqsey. All rights reserved.</p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Server className="w-3.5 h-3.5" />
              <span className="text-gray-400">Backend:</span>
              {backendStatus === 'checking' && <span className="text-gray-500 animate-pulse">Checking...</span>}
              {backendStatus === 'online' && <span className="text-emerald-400">Online</span>}
              {backendStatus === 'offline' && <span className="text-rose-400">Offline</span>}
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto">
            <button 
              onClick={() => setSettingsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg transition-all border border-gray-200 text-slate-700 shadow-sm w-full sm:w-auto font-sans"
            >
              <div className="w-6 h-4.5 select-none shrink-0 rounded-sm overflow-hidden flex items-center justify-center">
                <img
                  src={`https://flagcdn.com/w40/${getCurrencyCountryCode(currency.code)}.png`}
                  alt={`${currency.code} flag`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <span className="text-[14px] font-semibold tracking-wide flex items-center gap-1 ml-0.5">
                {currency.code} {currency.symbol}
              </span>
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
