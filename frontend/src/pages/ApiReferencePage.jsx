import React, { useState } from 'react';
import { Code2, Terminal, Copy, Check, Server, Key, Zap, Shield, Sparkles } from 'lucide-react';

export default function ApiReferencePage() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState('chat');

  const endpoints = [
    {
      id: 'chat',
      method: 'POST',
      path: '/api/ai/chat',
      description: 'Query DashNova AI CEO Copilot for data-backed business insights and strategic answers.',
      requestBody: `{
  "message": "Why did gross revenue drop this month?",
  "contextData": {
    "kpis": {
      "totalRevenue": "Rs 4,28,500",
      "salesCount": 154
    }
  }
}`,
      curlExample: `curl -X POST https://dashnova.app/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"message": "Why did gross revenue drop this month?"}'`
    },
    {
      id: 'kpis',
      method: 'GET',
      path: '/api/analytics/kpis',
      description: 'Retrieve real-time computed KPI metrics including total revenue, active customers, AOV, and health score.',
      curlExample: `curl -X GET https://dashnova.app/api/analytics/kpis \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    {
      id: 'ingest',
      method: 'POST',
      path: '/api/upload/parse',
      description: 'Ingest raw CSV, JSON, or ledger invoice streams directly into the active business ledger database.',
      curlExample: `curl -X POST https://dashnova.app/api/upload/parse \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@sales_invoices.csv"`
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentEp = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Code2 size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">DashNova API Reference</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          RESTful API specifications for programmatic integration with DashNova AI intelligence & ledger ingestion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Endpoints Sidebar */}
        <div className="space-y-1 bg-white p-3 border border-gray-200 rounded-lg h-fit">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 block">Endpoints</span>
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                selectedEndpoint === ep.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  ep.method === 'POST' ? 'bg-emerald-700 text-white' : 'bg-blue-700 text-white'
                }`}>
                  {ep.method}
                </span>
                <span className="truncate">{ep.path}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content Details */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              currentEp.method === 'POST' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {currentEp.method}
            </span>
            <code className="text-sm font-bold font-mono text-gray-950">{currentEp.path}</code>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">{currentEp.description}</p>

          {/* Request Body if POST */}
          {currentEp.requestBody && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-900 block">Sample Request Body (JSON):</span>
              <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                {currentEp.requestBody}
              </pre>
            </div>
          )}

          {/* cURL Example */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">cURL Example:</span>
              <button
                onClick={() => handleCopy(currentEp.curlExample, 1)}
                className="text-xs text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 1 ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-black text-gray-200 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              {currentEp.curlExample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
