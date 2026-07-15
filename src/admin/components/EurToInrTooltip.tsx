import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

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
      console.error('Error fetching exchange rate:', err);
      setError('Failed to load rate');
      delete pendingRequests[cacheKey];
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (e.buttons > 0) return; // Don't show if mouse button is pressed (selecting text)
    if (show) return;
    // Set timer to show after 500ms
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      fetchRate();
    }, 500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons > 0) {
      // User is selecting text
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShow(false);
      return;
    }
    if (show) return;
    // Reset timer as long as mouse is moving (meaning cursor is not stationary yet)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      fetchRate();
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShow(false);
  };

  const handleMouseDown = () => {
    // Hide immediately when clicking/selecting
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
        <span className="absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 p-3 bg-slate-900 dark:bg-slate-950 text-white text-[11px] rounded-lg shadow-xl border border-slate-800/80 pointer-events-none transition-all duration-150 block">
          <span className="font-semibold text-slate-300 mb-1 border-b border-slate-800 pb-1 text-center block">
            Historical INR Conversion
          </span>
          <span className="space-y-1 mt-1.5 font-mono block">
            <span className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span>{formattedDate}</span>
            </span>
            <span className="flex justify-between">
              <span className="text-slate-400">Rate ({currency}/INR):</span>
              <span className="text-sky-400 font-bold">
                {loading ? '...' : error ? 'Error' : rate !== null ? rate.toFixed(4) : 'N/A'}
              </span>
            </span>
            <span className="flex justify-between border-t border-slate-800/80 pt-1 mt-1">
              <span className="text-slate-400 font-sans">INR Value:</span>
              <span className="text-emerald-400 font-bold font-sans text-xs">
                {loading ? 'Calculating...' : error ? 'Error' : formattedInr}
              </span>
            </span>
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-[5px] border-transparent border-t-slate-900 dark:border-t-slate-950 block" />
        </span>
      )}
    </span>
  );
};
