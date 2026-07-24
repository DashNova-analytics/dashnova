import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, BookOpen, ShieldAlert, Sparkles, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does DashNova calculate the Business Health Score?',
      a: 'The Business Health Score (0-100) is a multi-dimensional weighted composite that evaluates Sales Velocity (30%), Profit Margin Stability (25%), Inventory Depletion Risk (25%), and Customer Retention / Churn Risk (20%).'
    },
    {
      q: 'Can I upload custom CSV or JSON ledger spreadsheets?',
      a: 'Yes! Navigate to "Upload Data" from the main menu or click the Upload icon in the header. You can drop CSVs, XLSX sheets, or JSON invoices, and our ingestion parser will automatically extract metrics.'
    },
    {
      q: 'Is my enterprise data kept private and secure?',
      a: 'Absolutely. DashNova employs 256-bit AES encryption at rest and TLS 1.3 in transit. Your raw data is never used to train global public AI models.'
    },
    {
      q: 'How do I use the Voice CEO Copilot?',
      a: 'Click the "Voice Copilot" button in the top navigation header. Grant microphone access when prompted, speak your query, and hear immediate executive speech synthesis.'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <HelpCircle size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Help Center & Knowledge Base</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Search frequently asked questions, user guides, or reach out to DashNova support.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-black shadow-2xs"
        />
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/ai')}
          className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg cursor-pointer transition shadow-2xs group"
        >
          <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center mb-2">
            <MessageSquare size={14} />
          </div>
          <h3 className="text-xs font-bold text-gray-900 group-hover:underline">Ask CEO Copilot</h3>
          <p className="text-[11px] text-gray-500 mt-1">Get immediate answers about your data from our AI Assistant.</p>
        </div>

        <div
          onClick={() => navigate('/docs')}
          className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg cursor-pointer transition shadow-2xs group"
        >
          <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center mb-2">
            <BookOpen size={14} />
          </div>
          <h3 className="text-xs font-bold text-gray-900 group-hover:underline">Read Documentation</h3>
          <p className="text-[11px] text-gray-500 mt-1">Explore complete operational and developer guides.</p>
        </div>

        <div
          onClick={() => navigate('/contact')}
          className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg cursor-pointer transition shadow-2xs group"
        >
          <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center mb-2">
            <Mail size={14} />
          </div>
          <h3 className="text-xs font-bold text-gray-900 group-hover:underline">Submit Support Ticket</h3>
          <p className="text-[11px] text-gray-500 mt-1">Contact our 24/7 technical support engineering team.</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Frequently Asked Questions</h2>

        <div className="divide-y divide-gray-100">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left font-bold text-xs text-gray-950 flex items-center justify-between cursor-pointer py-1"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openFaq === idx && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2 bg-gray-50 p-3 rounded border border-gray-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
