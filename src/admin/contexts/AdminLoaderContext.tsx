import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const AdminLoaderContext = createContext<AdminLoaderContextType | undefined>(undefined);

export function AdminLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const isLoading = loadingCount > 0;
  const showLoader = () => setLoadingCount(prev => prev + 1);
  const hideLoader = () => setLoadingCount(prev => Math.max(0, prev - 1));

  return (
    <AdminLoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none select-none h-[4px] bg-slate-900/20 dark:bg-slate-100/10 overflow-hidden"
          >
            {/* High-visibility Cyan & Emerald Top Browser Loading Progress Bar */}
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 rounded-r-full shadow-[0_0_14px_#38bdf8,0_0_8px_#34d399] relative"
              initial={{ x: '-100%', width: '30%' }}
              animate={{
                x: ['-100%', '0%', '100%'],
                width: ['25%', '65%', '25%']
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {/* Glowing Lead Light Particle */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/95 rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
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


