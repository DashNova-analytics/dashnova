import React from 'react';
import { Skeleton } from '../common/Loader';
import { HelpCircle } from 'lucide-react';

export default function KPICard({
  title,
  value,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  description,
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 h-[115px] flex flex-col justify-between font-sans">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
        </div>
        <Skeleton className="h-6 w-32 mt-2" />
        <Skeleton className="h-3 w-40 mt-1" />
      </div>
    );
  }

  // Determine trend color
  const trendBgColor = {
    positive: 'bg-green-50 text-green-600',
    negative: 'bg-red-50 text-red-600',
    neutral: 'bg-gray-50 text-gray-500'
  }[trendType];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 font-sans flex flex-col justify-between min-h-[115px]">
      <div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
          <div className="group relative">
            <HelpCircle size={12} className="text-gray-300 hover:text-gray-600 cursor-help transition" />
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-48 bg-black text-white text-[10px] p-2 rounded shadow-md leading-relaxed z-10 normal-case font-normal">
              {description || 'This metric reflects actual compiled ledger statistics.'}
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
          {value !== null && value !== undefined ? value : '—'}
        </div>
      </div>
      
      <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-2">
        {trend ? (
          <span className={`font-bold px-1.5 py-0.5 rounded ${trendBgColor}`}>{trend}</span>
        ) : (
          <span className="inline-block bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded font-semibold">—</span>
        )}
        <span>vs prior period</span>
      </div>
    </div>
  );
}
