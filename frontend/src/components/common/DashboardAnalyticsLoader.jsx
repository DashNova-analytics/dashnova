import React, { useState, useEffect } from 'react';
import { Sparkles, FileSpreadsheet, BarChart3, Brain, CheckCircle2 } from 'lucide-react';
import { Skeleton, ChartSkeleton } from './Loader';

export default function DashboardAnalyticsLoader({ message = "Parsing dataset & compiling business analytics..." }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Parsing dataset schema & mapping revenue columns...", icon: FileSpreadsheet },
    { label: "Computing total revenue, order volume & AOV aggregates...", icon: BarChart3 },
    { label: "Generating sales trend graphs & customer distributions...", icon: Sparkles },
    { label: "Synthesizing AI business briefing & health score...", icon: Brain },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans py-6 animate-fade-in">
      {/* Analytics Generation Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center border border-white/10 shrink-0">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold mb-1 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Ingestion Engine
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {message}
              </h2>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Processing Records...</span>
          </div>
        </div>

        {/* Step Progress Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-white/10">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white/15 border border-white/20 text-white'
                    : isDone
                    ? 'bg-white/5 text-gray-300'
                    : 'opacity-40 text-gray-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <IconComp size={15} className={`shrink-0 ${isCurrent ? 'text-amber-400 animate-bounce' : ''}`} />
                )}
                <span className="text-[11px] font-medium leading-snug line-clamp-1">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Analytics Charts Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton titleWidth="w-48" height="h-[280px]" />
        </div>
        <div>
          <ChartSkeleton titleWidth="w-36" height="h-[280px]" />
        </div>
      </div>
    </div>
  );
}
