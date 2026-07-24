import React from 'react';
import { Activity, CheckCircle2, Clock, Server, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'Gemini AI CEO Copilot Engine', status: 'Operational', uptime: '99.99%', latency: '180ms' },
    { name: 'Automated Ingestion Parser (CSV/JSON/PDF)', status: 'Operational', uptime: '99.98%', latency: '45ms' },
    { name: 'Real-time Analytics & KPI Aggregator', status: 'Operational', uptime: '100.0%', latency: '22ms' },
    { name: 'What-If Monte Carlo Simulation Engine', status: 'Operational', uptime: '99.95%', latency: '85ms' },
    { name: 'Database & Ledger Storage System', status: 'Operational', uptime: '99.99%', latency: '12ms' },
    { name: 'Voice Copilot Speech Synthesizer', status: 'Operational', uptime: '99.90%', latency: '110ms' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Activity size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">System Operational Status</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time status monitoring for DashNova platform services, API gateways, and AI inference backends.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition shadow-xs">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          Core Services & Infrastructure
        </h2>

        <div className="divide-y divide-gray-100">
          {services.map((svc, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-gray-900">{svc.name}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-gray-400 text-[10px]">Latency: <strong className="text-gray-700">{svc.latency}</strong></span>
                <span className="text-gray-400 text-[10px]">Uptime: <strong className="text-gray-700">{svc.uptime}</strong></span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Incidents */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Past 90 Days Incidents</h2>
        <p className="text-xs text-gray-500">No major incidents reported in the last 90 days.</p>
      </div>
    </div>
  );
}
