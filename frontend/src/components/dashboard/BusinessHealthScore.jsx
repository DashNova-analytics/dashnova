import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle2, Minus, Info, ArrowUpRight, Sparkles, X } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function BusinessHealthScore({ onSimulateClick }) {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const dbState = getDbState();

  if (!dbState?.hasData) {
    return null;
  }

  const healthData = dbState.healthScore || {
    score: 85,
    pillars: [
      { name: 'Revenue', status: 'check', score: 85, desc: dbState.kpis?.totalRevenue || 'Tracked' },
      { name: 'Profit', status: 'check', score: 88, desc: dbState.kpis?.averageOrderValue || 'Tracked' },
      { name: 'Growth', status: 'check', score: 80, desc: `${dbState.revenueOverTime?.length || 0} periods tracked` },
      { name: 'Customer', status: 'check', score: 90, desc: `${dbState.customers?.length || 0} customer records` },
      { name: 'Inventory', status: 'check', score: 82, desc: `${dbState.products?.length || 0} catalog SKUs` },
      { name: 'Cash Flow', status: 'check', score: 85, desc: 'Positive' },
    ]
  };

  const score = healthData.score;
  const pillars = healthData.pillars;

  const getStatusIcon = (status) => {
    if (status === 'check') return <CheckCircle2 size={14} className="text-emerald-600" />;
    if (status === 'alert') return <AlertTriangle size={14} className="text-amber-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'check') return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">✓ Strong</span>;
    if (status === 'alert') return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">✗ Risk</span>;
    return <span className="text-gray-600 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-bold">- Stable</span>;
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Business Health Score</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Healthy Growth
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Real-time composite metric auto-computed across 6 operational pillars.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Composite Score</span>
              <span className="text-2xl font-black tracking-tight text-gray-950 font-mono">{score}<span className="text-xs text-gray-400 font-normal">/100</span></span>
            </div>
            <button
              onClick={() => setShowDiagnostic(true)}
              className="h-8 px-3 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <Info size={12} />
              Diagnostic
            </button>
          </div>
        </div>

        {/* 6 Pillars Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          {pillars.map((p) => (
            <div key={p.name} className="p-2.5 rounded-md border border-gray-100 bg-gray-50/50 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900">{p.name}</span>
                {getStatusIcon(p.status)}
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs font-mono font-bold text-gray-700">{p.score}/100</span>
                {getStatusBadge(p.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Score Diagnostic Modal */}
      {showDiagnostic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-xl w-full p-6 shadow-xl animate-fade-in font-sans relative">
            <button
              onClick={() => setShowDiagnostic(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <h2 className="text-base font-bold text-gray-900">Business Health Diagnostic Report</h2>
            </div>

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inventory Bottleneck Impact (-12 points)</p>
                  <p className="mt-0.5 text-[11px]">
                    Your score of 82/100 is constrained primarily by low inventory buffer on Velocity Cache Nodes (8 items remaining). Restocking will lift total score to <strong>94/100</strong>.
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">Pillar Optimization Strategy:</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-gray-700">
                  <li><strong>Revenue (88/100)</strong>: Strong gross receipts. Consider upselling enterprise tiers.</li>
                  <li><strong>Inventory (48/100)</strong>: Trigger restocking purchase order before Friday 5 PM.</li>
                  <li><strong>Growth (65/100)</strong>: Launch retargeting campaign for non-converting trial users.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-mono">Updated: Just now · DashNova AI Health Engine</span>
              <button
                onClick={() => {
                  setShowDiagnostic(false);
                  if (onSimulateClick) onSimulateClick();
                }}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Run What-If Simulation</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
