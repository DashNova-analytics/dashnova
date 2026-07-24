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

export function ChartSkeleton({ titleWidth = "w-36", height = "h-[220px]" }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 flex flex-col font-sans animate-pulse">
      {/* Title & Subtitle Skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className={`h-4 ${titleWidth} bg-gray-200 rounded-md`} />
          <div className="h-3 w-56 bg-gray-100 rounded" />
        </div>
        <div className="h-4 w-4 bg-gray-100 rounded-full" />
      </div>

      {/* Recharts Area / Bar Skeleton Simulation */}
      <div className={`w-full ${height} flex flex-col justify-end pt-4`}>
        {/* Y-Axis Lines Skeleton */}
        <div className="relative w-full h-full flex flex-col justify-between border-b border-gray-100 pb-2">
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between items-center text-[10px] text-gray-200">
            <div className="h-2 w-8 bg-gray-100 rounded" />
          </div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between items-center text-[10px] text-gray-200">
            <div className="h-2 w-8 bg-gray-100 rounded" />
          </div>
          <div className="w-full border-b border-dashed border-gray-100 flex justify-between items-center text-[10px] text-gray-200">
            <div className="h-2 w-8 bg-gray-100 rounded" />
          </div>

          {/* Bars / Wave Skeleton */}
          <div className="absolute inset-x-8 bottom-2 top-4 flex items-end justify-between gap-3 px-2">
            <div className="h-[35%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[55%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[40%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[75%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[60%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[85%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[50%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
            <div className="h-[95%] w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-sm" />
          </div>
        </div>

        {/* X-Axis Month Labels Skeleton */}
        <div className="flex justify-between items-center pt-2 px-8">
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
          <div className="h-2 w-6 bg-gray-100 rounded" />
        </div>
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
