import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Package, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function InsightFeed({ onActionClick }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedCards, setLikedCards] = useState({});
  const dbState = getDbState();

  const dynamicInsights = (dbState.aiInsights && dbState.aiInsights.length > 0)
    ? dbState.aiInsights.map((ins, idx) => ({
        id: `f_${idx}`,
        category: idx % 2 === 0 ? 'Trends' : 'Suggestions',
        badge: idx % 2 === 0 ? '📈 Sales Intelligence' : '💡 Strategic Finding',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        title: ins.title,
        content: ins.detail,
        actionText: 'Deep Dive Analysis',
        time: 'Just now'
      }))
    : [
        {
          id: 'f1',
          category: 'Trends',
          badge: '📈 Sales Intelligence',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          title: 'Dataset Ingestion Overview',
          content: 'Continuous insight engine is monitoring your uploaded spreadsheets.',
          actionText: 'Explore Dataset',
          time: 'Just now'
        }
      ];

  const items = dynamicInsights;

  const categories = ['All', 'Trends', 'Risks', 'Suggestions', 'Inventory'];

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const toggleLike = (id) => {
    setLikedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">AI Insight Feed</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Continuous social-style feed of business intelligence developments.</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-black hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-3 pt-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/40 hover:bg-gray-50 hover:border-gray-200 transition duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                {item.badge}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
            </div>

            <h4 className="text-xs font-bold text-gray-950 mb-1">{item.title}</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed mb-3">{item.content}</p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
              <button
                onClick={() => onActionClick && onActionClick(item.title)}
                className="text-xs font-bold text-black hover:underline flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                {item.actionText} →
              </button>

              <div className="flex items-center gap-3 text-gray-400">
                <button
                  onClick={() => toggleLike(item.id)}
                  className={`text-xs flex items-center gap-1 transition cursor-pointer ${likedCards[item.id] ? 'text-emerald-600 font-bold' : 'hover:text-black'}`}
                >
                  <ThumbsUp size={12} />
                  <span className="text-[10px]">{likedCards[item.id] ? 'Helpful' : 'Helpful'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
