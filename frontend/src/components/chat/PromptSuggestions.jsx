import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, Package, Users, FileText, Sparkles, Lightbulb } from 'lucide-react';

export default function PromptSuggestions({ suggestions = [], onSelect }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Future Ideas', icon: Lightbulb },
    { name: 'Revenue', icon: TrendingUp },
    { name: 'Inventory', icon: Package },
    { name: 'Customers', icon: Users },
    { name: 'Reports', icon: FileText }
  ];

  const allSuggestions = [
    { category: 'Future Ideas', title: 'Suggest 5 future business enhancement ideas', desc: 'Predictive growth levers derived from dataset' },
    { category: 'Future Ideas', title: 'Recommend pricing & product bundling strategy', desc: 'AOV expansion and cross-selling roadmap' },
    { category: 'Future Ideas', title: 'Analyze revenue concentration & diversification', desc: 'Mitigate client risk and unlock new market tiers' },
    { category: 'Revenue', title: 'Analyze sales revenue by category', desc: 'Break down your top performing segments' },
    { category: 'Revenue', title: 'Compare revenue month-over-month', desc: 'Identify growth trends and profit margins' },
    { category: 'Inventory', title: 'Inventory priority status & risks', desc: 'Find high-risk out-of-stock items' },
    { category: 'Inventory', title: 'Top velocity product SKUs', desc: 'Rank catalog items by depletion rate' },
    { category: 'Customers', title: 'Customer retention & churn report', desc: 'Inspect active vs churn-risk client accounts' },
    { category: 'Customers', title: 'Identify top enterprise accounts', desc: 'Analyze lifetime value and purchase volume' },
    { category: 'Reports', title: 'Draft executive summary report', desc: 'Generate a short summary for management' },
    { category: 'Reports', title: 'Forecast next quarter sales demand', desc: 'Run predictive model on historical receipts' }
  ];

  const filtered = activeCategory === 'All' 
    ? allSuggestions.slice(0, 6) 
    : allSuggestions.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-4 max-w-3xl mx-auto font-sans">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                isActive
                  ? 'bg-black border-black text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:border-gray-300'
              }`}
            >
              <Icon size={11} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((sug, index) => (
          <button
            key={index}
            onClick={() => onSelect && onSelect(sug.title)}
            className="text-left p-3.5 border border-gray-200 rounded-md bg-white hover:border-gray-400 hover:shadow-xs transition duration-150 flex items-start justify-between group cursor-pointer"
          >
            <div>
              <p className="text-xs font-semibold text-gray-900 group-hover:text-black">{sug.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sug.desc}</p>
            </div>
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-black transition shrink-0 ml-2 mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

