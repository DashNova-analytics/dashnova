import React, { useState } from 'react';
import { Users, ShoppingBag, Package, DollarSign, ArrowRight, Sparkles, Info, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { getDbState } from '../services/dbStore';
import OnboardingWorkspace from '../components/dashboard/OnboardingWorkspace';

export default function BusinessMapPage() {
  const [selectedNode, setSelectedNode] = useState('customers');
  const dbState = getDbState();

  if (!dbState?.hasData) {
    return <OnboardingWorkspace />;
  }

  const kpis = dbState.kpis || {};
  const products = dbState.products || [];
  const customers = dbState.customers || [];
  const salesCount = kpis.salesCount || '0';
  const activeCustomersCount = kpis.activeCustomers || '0';
  const totalRevenue = kpis.totalRevenue || 'Rs 0.00';
  const averageOrderValue = kpis.averageOrderValue || 'Rs 0.00';

  const nodes = [
    {
      id: 'customers',
      title: 'Customers',
      subtitle: `${activeCustomersCount} Active Accounts`,
      icon: Users,
      metrics: [
        { label: 'Active Base', value: String(activeCustomersCount) },
        { label: 'Avg Order Value', value: String(averageOrderValue) },
        { label: 'Top Customer', value: customers[0]?.name || 'N/A' },
      ],
      aiExplanation: customers.length > 0
        ? `The Customer node measures user retention and purchasing frequency across ${customers.length} unique customer accounts.`
        : 'Upload a dataset to track customer retention and purchase frequency.',
      connectedTo: ['orders']
    },
    {
      id: 'orders',
      title: 'Orders',
      subtitle: `${salesCount} Invoices Ingested`,
      icon: ShoppingBag,
      metrics: [
        { label: 'Orders Processed', value: String(salesCount) },
        { label: 'Avg Order Value', value: String(averageOrderValue) },
        { label: 'Total Revenue', value: String(totalRevenue) },
      ],
      aiExplanation: `Orders pipeline tracks transaction velocity across ${salesCount} processed order records.`,
      connectedTo: ['products']
    },
    {
      id: 'products',
      title: 'Products',
      subtitle: `${products.length} Catalog SKUs`,
      icon: Package,
      metrics: [
        { label: 'Active SKUs', value: String(products.length) },
        { label: 'Top Performer', value: products[0]?.name || 'N/A' },
        { label: 'Top Product Sales', value: products[0]?.soldCount ? `${products[0].soldCount} units` : '—' },
      ],
      aiExplanation: products.length > 0
        ? `Catalog telemetry shows ${products.length} SKUs led by top seller "${products[0].name}".`
        : 'Upload dataset to generate SKU performance telemetries.',
      connectedTo: ['revenue']
    },
    {
      id: 'revenue',
      title: 'Revenue & Cash Flow',
      subtitle: `${totalRevenue} Gross Revenue`,
      icon: DollarSign,
      metrics: [
        { label: 'Gross Revenue', value: String(totalRevenue) },
        { label: 'Avg Order Value', value: String(averageOrderValue) },
        { label: 'Transactions', value: String(salesCount) },
      ],
      aiExplanation: `Cash Flow node summarizes live revenue totaling ${totalRevenue} generated across uploaded ledger datasets.`,
      connectedTo: []
    }
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Interactive Business Map</h1>
            <span className="bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Node Telemetry</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Visual dependency pipeline mapping customer acquisition to order processing, product catalog, and revenue realization.
          </p>
        </div>
      </div>

      {/* Visual Flow Diagram Nodes */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNode(node.id)}
                  className={`flex-1 w-full p-4 rounded-xl border transition duration-200 cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-lg scale-102 ring-2 ring-black/20'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      isSelected ? 'bg-white text-black' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Node #{index + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold tracking-tight">{node.title}</h3>
                  <p className={`text-[11px] mt-0.5 font-mono ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {node.subtitle}
                  </p>
                </div>

                {index < nodes.length - 1 && (
                  <div className="hidden md:flex items-center text-gray-300 px-1">
                    <ArrowRight size={20} className="animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & AI Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Metrics Cards */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 hover:border-gray-300 transition shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Activity size={16} className="text-black" />
            <h3 className="text-sm font-bold text-gray-900">{activeNodeData.title} Node Telemetry</h3>
          </div>

          <div className="space-y-3">
            {activeNodeData.metrics.map((m, idx) => (
              <div key={idx} className="p-3 border border-gray-100 rounded-md bg-gray-50/50 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-semibold">{m.label}</span>
                <span className="text-sm font-bold text-gray-950 font-mono">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Node Explanation Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:border-gray-300 transition shadow-xs">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
              <Sparkles size={16} className="text-black" />
              <h3 className="text-sm font-bold text-gray-900">AI Node Diagnostics & Operational Impact</h3>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 border border-gray-200 rounded-lg">
              {activeNodeData.aiExplanation}
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">Live Ingestion Stream Active</span>
            <span className="text-xs font-bold text-black flex items-center gap-1">
              Connected Pipeline → Orders & Revenue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
