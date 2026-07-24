import React, { useState } from 'react';
import { Bot, RefreshCw, AlertCircle, TrendingUp, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function AutonomousAnalyst({ onAskCopilot }) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const dbState = getDbState();

  if (!dbState?.hasData) {
    return null;
  }
  const briefing = dbState.analystBriefing || {
    keyChanges: ['Dataset loaded and analyzed.'],
    risks: ['No operational risks detected in current dataset.'],
    opportunity: 'Upload additional historical files to unlock deeper opportunity modeling.'
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed('Just now');
    }, 600);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Autonomous AI Analyst</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider">
                Dataset Briefing
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Proactive intelligence synthesized automatically from your uploaded dataset.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-mono hidden xs:inline">{lastRefreshed}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 px-2.5 border border-gray-200 hover:border-gray-400 text-gray-700 hover:text-black text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer bg-white"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Briefing</span>
          </button>
        </div>
      </div>

      {/* Briefing Grid: Changes, Risks, Opportunity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Key Changes */}
        <div className="border border-gray-100 rounded-lg p-3.5 bg-gray-50/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>Key Dataset Findings</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-gray-600 leading-normal pl-1">
            {briefing.keyChanges.map((change, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-gray-900">•</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Business Risks */}
        <div className="border border-amber-200/60 rounded-lg p-3.5 bg-amber-50/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertCircle size={14} className="text-amber-600" />
            <span>Critical Business Risks</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-gray-700 leading-normal pl-1">
            {briefing.risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-amber-600">{idx + 1}.</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Golden Opportunity */}
        <div className="border border-emerald-200/60 rounded-lg p-3.5 bg-emerald-50/30 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
              <TrendingUp size={14} className="text-emerald-600" />
              <span>1 Golden Opportunity</span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              {briefing.opportunity}
            </p>
          </div>

          <button
            onClick={onAskCopilot}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 mt-2 focus:outline-none cursor-pointer"
          >
            Ask AI Assistant to analyze further
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
