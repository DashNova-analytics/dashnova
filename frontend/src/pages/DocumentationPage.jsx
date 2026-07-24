import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, FileText, Code2, Terminal, Layers, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DocumentationPage() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      id: 'getting-started',
      title: 'Getting Started with DashNova',
      sections: [
        {
          heading: 'Overview of DashNova',
          content: 'DashNova is an AI-driven decision support platform designed to go beyond static charts and dashboards. By combining continuous ledger ingestion with Gemini-powered AI CEO Copilots, DashNova delivers actionable strategic answers, proactive anomaly alerts, and what-if simulation models.'
        },
        {
          heading: 'Quick Start Guide',
          content: '1. Ingest Data: Navigate to "Upload Data" and drag-and-drop your sales CSV or JSON invoice ledgers.\n2. Business Health Score: Check your real-time composite score on the primary dashboard.\n3. CEO Copilot: Ask complex operational questions in plain language, such as "Why did revenue drop this month?"'
        }
      ]
    },
    {
      id: 'ai-copilot',
      title: 'AI CEO Copilot & Decision Engine',
      sections: [
        {
          heading: 'Prompting Strategy',
          content: 'The CEO Copilot analyzes your specific active ledger context. You can query financial variances, stockout predictions, churn risk accounts, or request what-if simulations.'
        },
        {
          heading: 'Voice Copilot Integration',
          content: 'DashNova includes Web Speech Synthesis and Voice Recognition. Click "Voice Copilot" in the header to speak questions directly and hear spoken executive summaries.'
        }
      ]
    },
    {
      id: 'data-ingestion',
      title: 'Data Ingestion & Invoices',
      sections: [
        {
          heading: 'Supported Formats',
          content: 'DashNova supports CSV, JSON, XLSX, and PDF invoices. The automated ingestion parser extracts customer accounts, SKU unit quantities, gross sales values, and dates automatically.'
        }
      ]
    },
    {
      id: 'what-if-simulator',
      title: 'What-If Stochastic Simulator',
      sections: [
        {
          heading: 'Monte Carlo Projections',
          content: 'Adjust pricing levers, employee headcount, marketing budgets, and inventory buffers to calculate projected revenue, net profit margin, and cash flow horizons.'
        }
      ]
    }
  ];

  const currentArticle = articles.find(a => a.id === activeCategory) || articles[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <BookOpen size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">DashNova Documentation</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Complete developer & executive guide to DashNova's AI decision support, ingestion engines, and API integrations.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-white p-3 border border-gray-200 rounded-lg h-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 block">Documentation Topics</span>
          {articles.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                activeCategory === item.id
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">{item.title}</span>
              <ChevronRight size={14} className={activeCategory === item.id ? 'text-white' : 'text-gray-400'} />
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-xs">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">{currentArticle.title}</h2>
            <span className="text-[10px] font-mono text-gray-400">Updated for v2.4</span>
          </div>

          <div className="space-y-6">
            {currentArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  {sec.heading}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 border border-gray-100 rounded-md">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
