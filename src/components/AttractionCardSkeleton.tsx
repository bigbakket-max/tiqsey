import React from 'react';

interface Props {
  size?: 'sm' | 'md';
}

export function AttractionCardSkeleton({ size = 'md' }: Props) {
  const isSm = size === 'sm';

  return (
    <div className="flex flex-col bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100/80 dark:border-slate-850 h-full animate-pulse select-none">
      {/* Top Image Box */}
      <div className="relative aspect-[1.5/1] bg-slate-200 dark:bg-slate-800/80 w-full">
        {/* Floating Heart Button placeholder */}
        <div className="absolute top-3 right-3 w-8.5 h-8.5 rounded-full bg-slate-300 dark:bg-slate-700/80" />
      </div>

      {/* Body Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* City & Category Row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="h-2.5 w-14 bg-slate-200 dark:bg-slate-800/80 rounded" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700/80" />
          <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800/80 rounded" />
        </div>

        {/* Title Lines */}
        <div className="space-y-2 mb-3">
          <div className="h-4.5 w-11/12 bg-slate-300 dark:bg-slate-700/80 rounded" />
          <div className="h-4.5 w-2/3 bg-slate-300 dark:bg-slate-700/80 rounded" />
        </div>

        {/* Description Lines */}
        <div className="space-y-1.5 mb-5 mt-1">
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800/80 rounded" />
          <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800/80 rounded" />
        </div>

        {/* Bottom Metadata Panel */}
        <div className="mt-auto flex items-end justify-between w-full pt-4 border-t border-slate-100 dark:border-slate-850">
          {/* Rating Badge Skeleton */}
          <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800/80" />

          {/* Price feed Skeleton */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="h-2 w-10 bg-slate-200 dark:bg-slate-800/80 rounded" />
            <div className="h-5.5 w-16 bg-slate-300 dark:bg-slate-700/80 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttractionCardSkeleton;
