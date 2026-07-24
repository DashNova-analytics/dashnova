import React from 'react';
import { FileText, Shield, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Effective Date: January 2026. Standard terms governing DashNova software subscription and API services.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-xs text-xs text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DashNova software, API endpoints, or AI Copilot services, you agree to be bound by these Terms of Service and all applicable operational guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950">2. Service Level Agreement (SLA)</h2>
          <p>
            DashNova targets a 99.9% uptime for core analytics dashboard interfaces and AI Copilot API endpoints, excluding scheduled maintenance windows.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950">3. AI Decision Disclaimer</h2>
          <p>
            DashNova provides automated recommendations and Monte Carlo projections based on uploaded data. Strategic executive decisions remain the sole responsibility of the subscriber.
          </p>
        </section>
      </div>
    </div>
  );
}
