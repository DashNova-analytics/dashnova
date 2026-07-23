import React from 'react';

/**
 * Clean, minimal spinner or skeleton loader.
 * No flashy elements.
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 stroke-[2.5]',
    md: 'h-6 w-6 stroke-[2]',
    lg: 'h-10 w-10 stroke-[1.5]',
  };

  return (
    <svg
      className={`animate-spin text-black ${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-10"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-64 border border-gray-200 rounded p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex-1 flex items-end gap-3 px-2">
        <Skeleton className="h-[20%] w-full" />
        <Skeleton className="h-[45%] w-full" />
        <Skeleton className="h-[30%] w-full" />
        <Skeleton className="h-[75%] w-full" />
        <Skeleton className="h-[60%] w-full" />
        <Skeleton className="h-[90%] w-full" />
        <Skeleton className="h-[40%] w-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full border border-gray-200 rounded divide-y divide-gray-200">
      <div className="bg-gray-50 h-10 px-4 flex items-center gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="h-12 px-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
