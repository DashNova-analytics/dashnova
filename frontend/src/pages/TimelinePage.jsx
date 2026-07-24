import React, { useState } from 'react';
import { Calendar, TrendingUp, AlertTriangle, Sparkles, Filter, Tag, CheckCircle2 } from 'lucide-react';

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const events = [
    {
      id: 'e1',
      date: 'Jan 5, 2026',
      title: 'Revenue increased 20%',
      type: 'Milestone',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Enterprise subscription launch unlocked 20% revenue spike across Q1 billing accounts.',
    },
    {
      id: 'e2',
      date: 'Jan 12, 2026',
      title: 'New supplier added',
      type: 'Operations',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Secondary hardware supplier onboarded, reducing unit acquisition cost by 6.2%.',
    },
    {
      id: 'e3',
      date: 'Jan 20, 2026',
      title: 'Inventory shortage incident',
      type: 'Alert',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Velocity Cache Node stockout for 4 days resulted in an estimated Rs 48,200 lost sales opportunity.',
    },
    {
      id: 'e4',
      date: 'Feb 3, 2026',
      title: 'Marketing campaign launched',
      type: 'Campaign',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Mid-market email automation sequence deployed to 1,200 prospective leads.',
    },
    {
      id: 'e5',
      date: 'Feb 18, 2026',
      title: 'AI recommends restocking laptops & hardware nodes',
      type: 'AI Action',
      badgeClass: 'bg-black text-white border-black',
      description: 'Stock Velocity Model flagged depletion risk 3.2 days before complete warehouse inventory outage.',
    }
  ];

  const filters = ['All', 'Milestone', 'Operations', 'Alert', 'Campaign', 'AI Action'];

  const filtered = activeFilter === 'All' ? events : events.filter(e => e.type === activeFilter);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">AI Business Timeline</h1>
            <span className="bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Event Log</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Chronological log of major financial events, operational milestones, campaign deployments, and AI recommendations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer border ${
                activeFilter === f
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-black hover:border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-200 space-y-6 my-4">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-black border-4 border-white shadow-xs group-hover:scale-125 transition" />

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold text-gray-400">{item.date}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                  {item.type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-950 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
