import React, { useState, useRef, useEffect } from 'react';
import { Info, Calendar, TrendingUp, Wallet } from 'lucide-react';

// Global cache to avoid redundant API calls for the same date and currency
const rateCache: Record<string, number> = {};
const pendingRequests: Record<string, Promise<number>> = {};

interface EurToInrTooltipProps {
  amount: number;
  bookingDate: string; // Travel or creation date
  currency?: 'EUR' | 'USD' | string;
  children: React.ReactNode;
}

export const EurToInrTooltip: React.FC<EurToInrTooltipProps> = ({ 
  amount, 
  bookingDate, 
  currency = 'EUR', 
  children 
}) => {
  const [show, setShow] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const date = new Date(bookingDate || Date.now());
  const formattedDate = !isNaN(date.getTime()) 
    ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    : bookingDate || 'N/A';

  const fetchRate = async () => {
    if (rate !== null || loading) return;
    
    const apiDate = !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : 'latest';
    const cacheKey = `${apiDate}-${currency.toUpperCase()}`;

    if (rateCache[cacheKey]) {
      setRate(rateCache[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (!pendingRequests[cacheKey]) {
        pendingRequests[cacheKey] = fetch(`https://api.frankfurter.dev/v1/${apiDate}?base=${currency.toUpperCase()}&symbols=INR`)
          .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
          })
          .then(data => {
            if (data && data.rates && data.rates.INR) {
               return data.rates.INR;
            }
            throw new Error('Rate not found');
          });
      }

      const fetchedRate = await pendingRequests[cacheKey];
      rateCache[cacheKey] = fetchedRate;
      setRate(fetchedRate);
    } catch (err) {
      console.warn('Could not fetch live exchange rate from Frankfurter API, using market estimate fallback:', err);
      // Fallback conversion rate to prevent tooltip breaking
      const fallbackRate = currency.toUpperCase() === 'EUR' ? 90.5 : currency.toUpperCase() === 'USD' ? 83.8 : 90.0;
      setRate(fallbackRate);
      delete pendingRequests[cacheKey];
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (e.buttons > 0) return; // Don't show if mouse button is pressed (selecting text)
    if (show) return;
    // Set timer to show after 300ms
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      fetchRate();
    }, 300);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShow(false);
      return;
    }
    if (show) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      fetchRate();
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShow(false);
  };

  const handleMouseDown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShow(false);
  };

  const inrValue = rate !== null ? amount * rate : 0;
  
  const formattedInr = rate !== null ? inrValue.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }) : '₹...';

  return (
    <span 
      className="relative inline-flex items-center gap-1 group"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onCopy={() => setShow(false)}
      id={`inr-tooltip-${bookingDate}-${amount}`}
    >
      <span className="border-b border-dashed border-transparent md:group-hover:border-slate-400 transition-colors cursor-text md:cursor-help">
        {children}
      </span>
      <Info 
        className="w-3.5 h-3.5 text-slate-400 md:hidden cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const willShow = !show;
          setShow(willShow);
          if (willShow) fetchRate();
        }}
      />
      
      {show && (
        <span className="absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white text-[11px] rounded-2xl shadow-2xl border border-slate-700/60 pointer-events-none transition-all duration-200 block overflow-hidden">
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/60 flex items-center justify-between">
            <span className="font-extrabold text-slate-200 tracking-wide text-xs">
              Historical INR Conversion
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand/20 text-brand">
              {currency} → INR
            </span>
          </div>

          <div className="p-3 space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-brand" />
                Date:
              </span>
              <span className="font-bold font-mono">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                Rate ({currency}/INR):
              </span>
              <span className="font-bold font-mono text-sky-400">
                {loading ? 'Fetching...' : error ? 'Error' : rate !== null ? rate.toFixed(4) : 'N/A'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                INR Value:
              </span>
              <span className="font-black text-emerald-400 font-sans text-sm tracking-tight">
                {loading ? 'Calculating...' : error ? 'Error' : formattedInr}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-slate-900 dark:border-t-slate-950 block" />
        </span>
      )}
    </span>
  );
};
