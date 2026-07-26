import React from 'react';

/**
 * Standard card loading placeholder skeleton
 */
export default function Skeleton({ count = 1, className = '', variant = 'card' }) {
  // Generic single shimmer block if className is provided
  if (className && count === 1 && variant === 'card') {
    return <div className={`shimmer-bg rounded ${className}`} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-6 flex flex-col h-full bg-white dark:bg-slate-900 animate-pulse">
          <div className="w-full aspect-[4/3] rounded-xl shimmer-bg mb-6"></div>
          <div className="h-4 w-1/4 shimmer-bg rounded mb-3"></div>
          <div className="h-6 w-3/4 shimmer-bg rounded mb-4"></div>
          <div className="h-4 w-full shimmer-bg rounded mb-2"></div>
          <div className="h-4 w-5/6 shimmer-bg rounded mb-6"></div>
          <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="h-3 w-16 shimmer-bg rounded mb-1"></div>
              <div className="h-5 w-24 shimmer-bg rounded"></div>
            </div>
            <div className="h-8 w-24 shimmer-bg rounded-full"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 shimmer-bg rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
