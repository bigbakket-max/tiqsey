import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Search, Globe, Coins, Check, Clock, TrendingUp } from 'lucide-react';
import { useSettings, CURRENCIES } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrencyFlag } from '../utils/currencyFlags';
import { Currency, Language, WorldRegion } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'language' | 'currency';
}

const REGION_LABELS: Record<WorldRegion, string> = {
  popular: 'Popular & Suggested',
  europe: 'Europe',
  americas: 'Americas',
  asia_pacific: 'Asia & Pacific',
  middle_east_africa: 'Middle East & Africa',
};

export default function SettingsModal({
  isOpen,
  onClose,
  defaultTab = 'language',
}: SettingsModalProps) {
  const {
    currency,
    setCurrency,
    detectedLocalCurrency,
    language,
    languages,
    setLanguage,
    t,
    exchangeRatesTimestamp,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'language' | 'currency'>(defaultTab);
  const [activeRegion, setActiveRegion] = useState<WorldRegion | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setActiveRegion('all');
      setSearchQuery('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, defaultTab]);

  // Keyboard controls: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectCurrency = (curr: Currency) => {
    setCurrency(curr);
    onClose();
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  // Filtered Languages
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return languages;
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  // Grouped Currencies
  const topCurrencies = useMemo(() => {
    const topCodes = [
      detectedLocalCurrency.code,
      'EUR',
      'USD',
      'GBP',
      'INR',
      'AED',
      'SGD',
    ];
    const uniqueCodes = Array.from(new Set(topCodes));
    return uniqueCodes
      .map((code) => CURRENCIES.find((c) => c.code === code))
      .filter((c): c is Currency => !!c);
  }, [detectedLocalCurrency]);

  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CURRENCIES.filter((curr) => {
      const matchesSearch =
        !q ||
        curr.code.toLowerCase().includes(q) ||
        curr.name.toLowerCase().includes(q) ||
        curr.symbol.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (activeRegion === 'all') return true;
      if (activeRegion === 'popular') {
        return topCurrencies.some((t) => t.code === curr.code);
      }
      return curr.region === activeRegion;
    });
  }, [searchQuery, activeRegion, topCurrencies]);

  const isSearching = searchQuery.trim() !== '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[3px]"
            id="settings-modal-backdrop"
          />

          {/* Centered Modal Overlay Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4">
            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-[840px] h-[670px] max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans border border-slate-200/80 dark:border-slate-800 transition-colors duration-300"
              id="settings-modal-container"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* STICKY TOP CONTROL PANEL */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 z-20 shrink-0 flex flex-col border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
                {/* Tab Switcher & Close */}
                <div className="flex items-center justify-between px-6 sm:px-8 pt-5">
                  <div className="flex gap-6 sm:gap-8" id="modal-title">
                    {/* Language Tab */}
                    <button
                      onClick={() => {
                        setActiveTab('language');
                        setSearchQuery('');
                      }}
                      className={`pb-3.5 text-base sm:text-[17px] font-bold tracking-tight relative cursor-pointer outline-none select-none transition-colors duration-200 flex items-center gap-2 ${
                        activeTab === 'language'
                          ? 'text-slate-950 dark:text-white font-extrabold'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                      id="tab-language"
                    >
                      <Globe className="w-4.5 h-4.5" />
                      <span>{t('language', 'Language')}</span>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                        {languages.length}
                      </span>
                      {activeTab === 'language' && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e3000f] rounded-full z-10"
                          transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                        />
                      )}
                    </button>

                    {/* Currency Tab */}
                    <button
                      onClick={() => {
                        setActiveTab('currency');
                        setSearchQuery('');
                      }}
                      className={`pb-3.5 text-base sm:text-[17px] font-bold tracking-tight relative cursor-pointer outline-none select-none transition-colors duration-200 flex items-center gap-2 ${
                        activeTab === 'currency'
                          ? 'text-slate-950 dark:text-white font-extrabold'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                      id="tab-currency"
                    >
                      <Coins className="w-4.5 h-4.5" />
                      <span>{t('currency', 'Currency')}</span>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                        {CURRENCIES.length}
                      </span>
                      {activeTab === 'currency' && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e3000f] rounded-full z-10"
                          transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                        />
                      )}
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer flex items-center justify-center"
                    title="Close"
                    aria-label="Close settings"
                    id="close-settings-modal"
                  >
                    <X className="w-5 h-5" strokeWidth={2.4} />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 sm:px-8 pt-3 pb-3">
                  <div className="relative flex items-center group">
                    <span className="absolute left-3.5 text-slate-400 dark:text-slate-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        activeTab === 'language'
                          ? 'Search 16+ languages (e.g. Hindi, English, Español)...'
                          : 'Search 48+ currencies (e.g. INR, EUR, USD, Yen, Dirham)...'
                      }
                      className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 text-[13.5px] font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-[#e3000f] focus:outline-none focus:ring-2 focus:ring-[#e3000f]/15 transition-all"
                    />
                    {isSearching && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Regional Filter Tabs for Currency */}
                {activeTab === 'currency' && !isSearching && (
                  <div className="px-6 sm:px-8 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActiveRegion('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        activeRegion === 'all'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      All Currencies
                    </button>
                    <button
                      onClick={() => setActiveRegion('popular')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                        activeRegion === 'popular'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 text-[#e3000f]" />
                      <span>Suggested</span>
                    </button>
                    {(['europe', 'americas', 'asia_pacific', 'middle_east_africa'] as WorldRegion[]).map(
                      (reg) => (
                        <button
                          key={reg}
                          onClick={() => setActiveRegion(reg)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                            activeRegion === reg
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {REGION_LABELS[reg]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* SCROLLABLE BODY */}
              <div
                className="p-6 sm:p-8 overflow-y-auto flex-1 scroll-smooth bg-white dark:bg-slate-900/60"
                id="settings-modal-content-container"
              >
                {activeTab === 'language' ? (
                  /* LANGUAGES GRID */
                  filteredLanguages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredLanguages.map((lang) => {
                        const isSelected = language.code === lang.code;
                        return (
                          <button
                            key={`lang-${lang.code}`}
                            onClick={() => handleSelectLanguage(lang)}
                            className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer outline-none flex items-center justify-between group select-none ${
                              isSelected
                                ? 'bg-red-50/70 dark:bg-red-950/30 border-2 border-[#e3000f] shadow-xs'
                                : 'bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="text-2xl select-none shrink-0" role="img" aria-label={lang.name}>
                                {lang.flag}
                              </span>
                              <div className="flex flex-col min-w-0">
                                <span
                                  className={`text-[14px] font-bold truncate ${
                                    isSelected
                                      ? 'text-[#e3000f] dark:text-red-400'
                                      : 'text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors'
                                  }`}
                                >
                                  {lang.nativeName}
                                </span>
                                <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                  {lang.name}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#e3000f] flex items-center justify-center shrink-0 ml-2">
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                      <p className="text-sm font-semibold">No languages found matching "{searchQuery}"</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 px-3 py-1 text-xs font-bold text-[#e3000f] hover:underline cursor-pointer"
                      >
                        Reset search
                      </button>
                    </div>
                  )
                ) : (
                  /* CURRENCIES GRID */
                  filteredCurrencies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {filteredCurrencies.map((curr) => {
                        const isSelected = currency.code === curr.code;
                        const flag = getCurrencyFlag(curr.code);
                        return (
                          <button
                            key={`curr-${curr.code}`}
                            onClick={() => handleSelectCurrency(curr)}
                            className={`p-3 rounded-2xl text-left transition-all cursor-pointer outline-none flex items-center justify-between group select-none ${
                              isSelected
                                ? 'bg-red-50/70 dark:bg-red-950/30 border-2 border-[#e3000f] shadow-xs'
                                : 'bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="text-xl select-none shrink-0" role="img" aria-label={curr.code}>
                                {flag}
                              </span>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <strong
                                    className={`text-[13.5px] font-black ${
                                      isSelected
                                        ? 'text-[#e3000f] dark:text-red-400'
                                        : 'text-slate-900 dark:text-slate-100 group-hover:text-[#e3000f] transition-colors'
                                    }`}
                                  >
                                    {curr.code}
                                  </strong>
                                  <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">
                                    ({curr.symbol})
                                  </span>
                                </div>
                                <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                  {curr.name}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-[#e3000f] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  1€={curr.rate >= 100 ? curr.rate.toFixed(0) : curr.rate.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                      <p className="text-sm font-semibold">No currencies found matching "{searchQuery}"</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveRegion('all');
                        }}
                        className="mt-3 px-3 py-1 text-xs font-bold text-[#e3000f] hover:underline cursor-pointer"
                      >
                        Reset search
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* FOOTER: Live Exchange Rate Transparency */}
              <div className="px-6 sm:px-8 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exchangeRatesTimestamp}</span>
                </div>
                <div className="text-[10.5px] text-slate-400">
                  {activeTab === 'language'
                    ? 'Changing language translates supported titles, features, and tickets.'
                    : '100% transparent pricing · Base checkout processed at live ECB parity.'}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
