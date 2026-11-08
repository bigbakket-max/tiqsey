import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Check } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function LanguageDetectionBanner() {
  const {
    detectedBrowserLanguage,
    showLanguagePrompt,
    dismissLanguagePrompt,
    applyDetectedLanguage,
    language,
  } = useSettings();

  if (!showLanguagePrompt || !detectedBrowserLanguage) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Language change proposal"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-slate-900 text-white border-b border-slate-800 text-xs relative z-40 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-base select-none shrink-0" role="img" aria-label="Globe">
              {detectedBrowserLanguage.flag}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-300">
                We noticed your device is set to
              </span>
              <strong className="text-white font-bold">
                {detectedBrowserLanguage.nativeName} ({detectedBrowserLanguage.name})
              </strong>
              <span className="text-slate-300 hidden sm:inline">
                · Would you like to switch?
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={applyDetectedLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#e3000f] hover:bg-[#c5000d] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Switch to {detectedBrowserLanguage.nativeName}</span>
            </button>
            <button
              onClick={dismissLanguagePrompt}
              className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-medium"
            >
              Keep {language.name}
            </button>
            <button
              onClick={dismissLanguagePrompt}
              aria-label="Close language suggestion"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
