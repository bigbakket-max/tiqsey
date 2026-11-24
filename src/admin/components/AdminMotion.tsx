import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  PauseCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const ADMIN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ADMIN_TRANSITION_FAST = {
  duration: 0.16,
  ease: ADMIN_EASE,
};

export const ADMIN_TRANSITION_SMOOTH = {
  duration: 0.24,
  ease: ADMIN_EASE,
};

/**
 * Signature 4-dot orbiting diamond loader inspired by modern SaaS upload micro-interactions.
 * Pure GPU-composited CSS transform/opacity animations, fully respects prefers-reduced-motion.
 */
export function DiamondDotsSpinner({
  size = 'md',
  tone = 'amber',
  className = '',
  label = 'Loading',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'amber' | 'blue' | 'emerald' | 'slate' | 'white';
  className?: string;
  label?: string;
}) {
  const boxSize =
    size === 'xs'
      ? 'w-4 h-4'
      : size === 'sm'
      ? 'w-5 h-5'
      : size === 'lg'
      ? 'w-9 h-9'
      : 'w-6 h-6';

  const dotSize =
    size === 'xs'
      ? 'w-1.5 h-1.5'
      : size === 'sm'
      ? 'w-[7px] h-[7px]'
      : size === 'lg'
      ? 'w-3 h-3'
      : 'w-2 h-2';

  const dotColor =
    tone === 'blue'
      ? 'bg-blue-500'
      : tone === 'emerald'
      ? 'bg-emerald-500'
      : tone === 'slate'
      ? 'bg-slate-600 dark:bg-slate-300'
      : tone === 'white'
      ? 'bg-white'
      : 'bg-[#f59e56]';

  return (
    <span
      role="status"
      aria-label={label}
      className={`relative inline-flex items-center justify-center shrink-0 tiqsey-diamond-orbit ${boxSize} ${className}`}
    >
      {/* Top */}
      <span
        className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${dotSize} ${dotColor} tiqsey-diamond-dot-1`}
      />
      {/* Right */}
      <span
        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full ${dotSize} ${dotColor} tiqsey-diamond-dot-2`}
      />
      {/* Bottom */}
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full ${dotSize} ${dotColor} tiqsey-diamond-dot-3`}
      />
      {/* Left */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full ${dotSize} ${dotColor} tiqsey-diamond-dot-4`}
      />
    </span>
  );
}

/**
 * Animated SVG success checkmark with crisp spring pop and stroke draw.
 */
export function AnimatedCheckmark({
  size = 22,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.68)}
        height={Math.round(size * 0.68)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.28, delay: 0.05, ease: ADMIN_EASE }}
        />
      </svg>
    </motion.span>
  );
}

/**
 * Animated error badge with subtle horizontal shake on mount.
 */
export function AnimatedErrorIcon({
  size = 22,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0, x: 0 }}
      animate={{ scale: 1, opacity: 1, x: [0, -4, 4, -2, 2, 0] }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <AlertCircle className="w-3.5 h-3.5" />
    </motion.span>
  );
}

/**
 * Smooth animated progress bar with real-time sheen while active and tabular percentage display.
 */
export function AnimatedProgressBar({
  progress,
  state = 'active',
  heightClass = 'h-2',
  className = '',
}: {
  progress: number;
  state?: 'active' | 'verifying' | 'success' | 'error';
  heightClass?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  const fillColor =
    state === 'error'
      ? 'bg-gradient-to-r from-rose-500 to-rose-600'
      : state === 'success'
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
      : state === 'verifying'
      ? 'bg-gradient-to-r from-blue-500 via-sky-500 to-emerald-500'
      : 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500';

  return (
    <div
      className={`relative w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ${heightClass} ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`relative h-full rounded-full ${fillColor} overflow-hidden`}
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.25, ease: ADMIN_EASE }}
      >
        {(state === 'active' || state === 'verifying') && clamped > 0 && clamped < 100 && (
          <div className="absolute inset-0 tiqsey-progress-sheen bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        )}
      </motion.div>
    </div>
  );
}

/**
 * Animated Status Badge for Pending, Active, Inactive, Completed, Confirmed, Cancelled, Failed, Draft, Published.
 * Always pairs semantic color with explicit text label and crisp icon for WCAG accessibility.
 */
export type AdminStatusVariant =
  | 'pending'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'confirmed'
  | 'cancelled'
  | 'failed'
  | 'draft'
  | 'published';

const STATUS_CONFIG: Record<
  AdminStatusVariant,
  {
    bg: string;
    text: string;
    border: string;
    dot?: string;
    pulse?: boolean;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  active: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
    pulse: true,
    Icon: CheckCircle2,
  },
  published: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
    Icon: CheckCircle2,
  },
  completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/60',
    Icon: CheckCircle2,
  },
  confirmed: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-800/60',
    dot: 'bg-blue-500',
    Icon: Sparkles,
  },
  pending: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-800/60',
    dot: 'bg-amber-500',
    pulse: true,
    Icon: Clock,
  },
  draft: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    Icon: PauseCircle,
  },
  inactive: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    Icon: PauseCircle,
  },
  cancelled: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-800/60',
    Icon: XCircle,
  },
  failed: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-800/60',
    Icon: AlertCircle,
  },
};

export function normalizeStatusVariant(status?: string | null): AdminStatusVariant {
  const s = String(status || '').toLowerCase().trim();
  if (s === 'active' || s === 'live' || s === 'connected') return 'active';
  if (s === 'published') return 'published';
  if (s === 'completed' || s === 'paid' || s === 'settled' || s === 'success') return 'completed';
  if (s === 'confirmed' || s === 'booked') return 'confirmed';
  if (s === 'pending' || s === 'processing' || s === 'in_progress' || s === 'scheduled') return 'pending';
  if (s === 'draft' || s === 'paused') return 'draft';
  if (s === 'inactive' || s === 'disabled' || s === 'archived' || s === 'expired') return 'inactive';
  if (s === 'cancelled' || s === 'canceled' || s === 'refunded') return 'cancelled';
  if (s === 'failed' || s === 'error' || s === 'rejected' || s === 'disconnected') return 'failed';
  return 'inactive';
}

export function AdminStatusBadge({
  status,
  label,
  className = '',
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const variant = normalizeStatusVariant(status);
  const cfg = STATUS_CONFIG[variant];
  const Icon = cfg.Icon;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <motion.span
      key={variant + displayLabel}
      initial={{ opacity: 0.7, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={ADMIN_TRANSITION_FAST}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border} ${className}`}
    >
      {cfg.pulse && cfg.dot ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
        </span>
      ) : (
        <Icon className="w-3 h-3 shrink-0" />
      )}
      <span>{displayLabel}</span>
    </motion.span>
  );
}

/**
 * Reusable Animated Modal Backdrop + Panel Wrapper
 */
export function AdminModalShell({
  open,
  onClose,
  children,
  maxWidthClass = 'max-w-lg',
  zIndexClass = 'z-[95]',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  zIndexClass?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={ADMIN_TRANSITION_SMOOTH}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidthClass}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Shimmer Skeleton Primitives for Tables, Cards, Media Grids, and Dashboards
 */
export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-200/75 dark:bg-slate-800/80 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
    </div>
  );
}

export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <SkeletonBox className="aspect-[4/3] w-full rounded-2xl" />
          <div className="px-0.5 space-y-1.5">
            <SkeletonBox className="h-3.5 w-3/4 rounded-md" />
            <SkeletonBox className="h-2.5 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full divide-y divide-slate-100 dark:divide-slate-800/80">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          <SkeletonBox className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(2, cols - 1)}, minmax(0, 1fr))` }}>
            {Array.from({ length: Math.max(2, cols - 1) }).map((__, c) => (
              <SkeletonBox
                key={c}
                className={`h-3.5 rounded-md ${c === 0 ? 'w-4/5' : c === cols - 2 ? 'w-1/2 ml-auto' : 'w-2/3'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-3.5 w-24" />
              <SkeletonBox className="h-8 w-8 rounded-xl" />
            </div>
            <SkeletonBox className="h-7 w-28" />
            <SkeletonBox className="h-3 w-36" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <SkeletonBox className="h-4 w-40" />
          <SkeletonBox className="h-56 w-full rounded-xl" />
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <SkeletonBox className="h-4 w-32" />
          <TableSkeleton rows={4} cols={2} />
        </div>
      </div>
    </div>
  );
}
