import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Lock size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Last updated: January 2026. How DashNova protects, encrypts, and processes your business data.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-xs text-xs text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
            <Database size={16} className="text-black" />
            1. Data Collection & Processing
          </h2>
          <p>
            DashNova processes customer transaction data, uploaded invoices, inventory logs, and user queries strictly to provide real-time business intelligence and AI Copilot responses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
            <ShieldCheck size={16} className="text-black" />
            2. AI Data Isolation Commitment
          </h2>
          <p>
            Your business ledgers and strategic queries are isolated per organization. <strong>We DO NOT sell, lease, or use your proprietary company data to train public foundation models.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-950 flex items-center gap-2">
            <Lock size={16} className="text-black" />
            3. Encryption Standards
          </h2>
          <p>
            All data in transit is protected using TLS 1.3 encryption. All data stored at rest in DashNova database partitions utilizes AES-256 bit hardware-level encryption.
          </p>
        </section>
      </div>
    </div>
  );
}
