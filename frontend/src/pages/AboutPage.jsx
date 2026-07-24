import React from 'react';
import { Building2, Sparkles, Target, Users, Shield, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 text-center space-y-2">
        <span className="bg-black text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded tracking-wider">
          About DashNova
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
          Intelligence Beyond Dashboards
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          DashNova was built to replace static dashboards with continuous, proactive AI strategic support. We empower business leaders to understand the "why" behind their numbers and model what-if outcomes in seconds.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Target size={18} />
          </div>
          <h3 className="text-sm font-bold text-gray-950">Actionable Decision Support</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Rather than forcing executives to decode complex multi-axis charts, DashNova synthesizes plain-language strategic answers backed by verified transaction ledgers.
          </p>
        </div>

        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <h3 className="text-sm font-bold text-gray-950">Proactive Anomaly Alerts</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our autonomous analyst works 24/7 in the background, identifying revenue drop-offs, stockout dangers, and churn risks before they impact your P&L.
          </p>
        </div>

        <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Shield size={18} />
          </div>
          <h3 className="text-sm font-bold text-gray-950">Enterprise Data Privacy</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Built with bank-grade encryption and isolated multi-tenant data storage. Your sensitive ledgers and strategy stay strictly private.
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-base font-bold text-gray-900">Our Mission</h2>
        <p className="text-xs text-gray-700 leading-relaxed">
          Modern companies sit on gigabytes of valuable sales and customer data, yet making executive decisions often requires waiting days for manual BI reports. DashNova bridges this gap by unifying ingestion, AI reasoning, and Monte Carlo scenario modeling into a unified command center.
        </p>
      </div>
    </div>
  );
}
