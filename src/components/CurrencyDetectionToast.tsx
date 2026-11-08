import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, X, Check, ArrowRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { getCurrencyFlag } from '../utils/currencyFlags';

interface CurrencyDetectionToastProps {
  onOpenCurrencySettings?: () => void;
}

export default function CurrencyDetectionToast({ onOpenCurrencySettings }: CurrencyDetectionToastProps) {
  const {
    currency,
    detectedLocalCurrency,
    showCurrencyToast,
    dismissCurrencyToast,
    exchangeRatesTimestamp,
  } = useSettings();

  if (!showCurrencyToast) return null;

  const flag = getCurrencyFlag(currency.code);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 text-slate-800 dark:text-slate-100 font-sans"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/40">
              <span className="text-xl select-none" role="img" aria-label="Currency Flag">
                {flag}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Prices shown in {currency.code} ({currency.symbol})
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically converted using live interbank rates
              </p>
            </div>
          </div>
          <button
            onClick={dismissCurrencyToast}
            aria-label="Dismiss currency notification"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={dismissCurrencyToast}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Keep {currency.code}
          </button>

          <button
            onClick={() => {
              dismissCurrencyToast();
              if (onOpenCurrencySettings) onOpenCurrencySettings();
            }}
            className="flex items-center gap-1 font-bold text-[#e3000f] hover:text-[#c5000d] transition-colors cursor-pointer"
          >
            <span>Change currency</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
