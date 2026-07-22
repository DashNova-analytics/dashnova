import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'An error occurred',
  message = 'We could not load this segment. Check your network or connection and try again.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`w-full p-6 border border-gray-200 border-l-red-500 border-l-2 rounded bg-white flex items-start gap-4 font-sans ${className}`}>
      <div className="text-red-500 mt-0.5">
        <AlertCircle size={18} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-black focus:outline-none cursor-pointer"
          >
            <RotateCcw size={12} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
