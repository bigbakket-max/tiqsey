import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const AdminLoaderContext = createContext<AdminLoaderContextType | undefined>(undefined);

/**
 * Smart Top Progress Bar Provider.
 * Only displays the progress bar when an operation takes >140ms so instant navigations
 * never flash unnecessary spinners or loading bars.
 */
export function AdminLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = loadingCount > 0;
  const showLoader = useCallback(() => setLoadingCount((prev) => prev + 1), []);
  const hideLoader = useCallback(() => setLoadingCount((prev) => Math.max(0, prev - 1)), []);

  useEffect(() => {
    if (isLoading) {
      if (!visible && !delayTimerRef.current) {
        delayTimerRef.current = setTimeout(() => {
          setVisible(true);
          delayTimerRef.current = null;
        }, 140);
      }
    } else {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      setVisible(false);
    }
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [isLoading, visible]);

  return (
    <AdminLoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none select-none h-[3px] bg-slate-900/15 dark:bg-slate-100/10 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.65)] relative"
              initial={{ x: '-100%', width: '30%' }}
              animate={{
                x: ['-100%', '0%', '100%'],
                width: ['25%', '62%', '25%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/90 rounded-full blur-[1px]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLoaderContext.Provider>
  );
}

export function useAdminLoader() {
  const context = useContext(AdminLoaderContext);
  if (context === undefined) {
    throw new Error('useAdminLoader must be used within an AdminLoaderProvider');
  }
  return context;
}
