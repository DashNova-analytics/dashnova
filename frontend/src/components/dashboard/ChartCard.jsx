import React from 'react';
import { ChartSkeleton } from '../common/Loader';
import { BarChart3, Info } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  children,
  loading = false,
  hasData = false,
  className = ''
}) {
  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col font-sans hover:border-gray-300 transition duration-150 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="group relative">
          <Info size={14} className="text-gray-300 hover:text-gray-600 transition cursor-help" />
          <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-52 bg-black text-white text-[10px] p-2 rounded shadow-md leading-relaxed z-10 font-normal">
            This visualization updates dynamically as new CSV/Excel tables are ingested.
          </div>
        </div>
      </div>

      {/* Chart body */}
      <div className="flex-1 min-h-[220px] flex flex-col justify-center relative">
        {hasData && children ? (
          children
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded bg-gray-50/30 p-4">
            <BarChart3 size={24} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-700">No Chart Data Available</span>
            <span className="text-[10px] text-gray-400 text-center mt-1 max-w-[200px] leading-normal">
              Connect your data sources or upload a CSV to generate your first trend analysis.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
