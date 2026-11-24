import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { ADMIN_EASE, AnimatedCheckmark, AnimatedErrorIcon } from '../components/AdminMotion';

export type AdminToastKind = 'success' | 'error' | 'warning' | 'info';

export interface AdminToastItem {
  id: string;
  kind: AdminToastKind;
  title?: string;
  message: string;
  durationMs: number;
}

interface AdminToastContextValue {
  notify: (kind: AdminToastKind, message: string, options?: { title?: string; durationMs?: number }) => string;
  dismiss: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

const AdminToastContext = createContext<AdminToastContextValue | undefined>(undefined);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (
      kind: AdminToastKind,
      message: string,
      options?: { title?: string; durationMs?: number }
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const durationMs = options?.durationMs ?? (kind === 'error' ? 6000 : 4200);
      setToasts((prev) => [...prev.slice(-3), { id, kind, title: options?.title, message, durationMs }]);

      const timer = setTimeout(() => {
        dismiss(id);
      }, durationMs);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  const success = useCallback((message: string, title?: string) => notify('success', message, { title }), [notify]);
  const error = useCallback((message: string, title?: string) => notify('error', message, { title }), [notify]);
  const warning = useCallback((message: string, title?: string) => notify('warning', message, { title }), [notify]);
  const info = useCallback((message: string, title?: string) => notify('info', message, { title }), [notify]);

  return (
    <AdminToastContext.Provider value={{ notify, dismiss, success, error, warning, info }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-[140] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((item) => {
            const palette =
              item.kind === 'success'
                ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/70 text-slate-900 dark:text-slate-100'
                : item.kind === 'error'
                ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/70 text-slate-900 dark:text-slate-100'
                : item.kind === 'warning'
                ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/70 text-slate-900 dark:text-slate-100'
                : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/70 text-slate-900 dark:text-slate-100';

            const barColor =
              item.kind === 'success'
                ? 'bg-emerald-500'
                : item.kind === 'error'
                ? 'bg-rose-500'
                : item.kind === 'warning'
                ? 'bg-amber-500'
                : 'bg-blue-500';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ duration: 0.2, ease: ADMIN_EASE }}
                className={`pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg px-4 py-3 flex items-start gap-3 ${palette}`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.kind === 'success' && <AnimatedCheckmark size={22} />}
                  {item.kind === 'error' && <AnimatedErrorIcon size={22} />}
                  {item.kind === 'warning' && (
                    <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {item.kind === 'info' && (
                    <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-xs leading-relaxed">
                  {item.title && (
                    <p className="font-bold text-slate-900 dark:text-white mb-0.5">{item.title}</p>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 font-medium break-words">
                    {item.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Auto-dismiss countdown progress line */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: item.durationMs / 1000, ease: 'linear' }}
                  style={{ transformOrigin: 'left center' }}
                  className={`absolute bottom-0 left-0 right-0 h-[2.5px] opacity-80 ${barColor}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return ctx;
}
