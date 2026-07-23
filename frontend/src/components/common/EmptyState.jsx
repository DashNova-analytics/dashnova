import React from 'react';
import { Database } from 'lucide-react';

export default function EmptyState({
  title = 'No data available',
  description = 'Upload your business data to generate visualizations and AI insights.',
  icon: Icon = Database,
  actionText,
  onAction,
  className = ''
}) {
  return (
    <div className={`w-full min-h-[320px] bg-white border border-gray-200 rounded flex flex-col items-center justify-center text-center p-8 font-sans ${className}`}>
      <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
        <Icon size={18} className="text-gray-500" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="h-8 px-4 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
