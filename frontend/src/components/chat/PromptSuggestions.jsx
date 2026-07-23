import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function PromptSuggestions({ suggestions = [], onSelect }) {
  const defaultSuggestions = [
    { title: 'Analyze sales by category', desc: 'Break down your top performing segments' },
    { title: 'Inventory priority status', desc: 'Find high-risk out-of-stock items' },
    { title: 'Compare revenue trends', desc: 'Identify month-over-month performance changes' },
    { title: 'Draft executive summary', desc: 'Generate a short summary for your business reports' }
  ];

  const list = suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto font-sans">
      {list.map((sug, index) => (
        <button
          key={index}
          onClick={() => onSelect && onSelect(sug.title)}
          className="text-left p-4 border border-gray-200 rounded hover:border-gray-400 hover:bg-gray-50/50 transition duration-150 flex items-start justify-between group cursor-pointer"
        >
          <div>
            <p className="text-xs font-semibold text-gray-900 group-hover:text-black">{sug.title}</p>
            <p className="text-[10px] text-gray-400 mt-1">{sug.desc}</p>
          </div>
          <ArrowUpRight size={12} className="text-gray-300 group-hover:text-black transition shrink-0 ml-2 mt-0.5" />
        </button>
      ))}
    </div>
  );
}
