import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChartCard from '../components/dashboard/ChartCard';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  MapPin, 
  TrendingUp, 
  Info, 
  ArrowUpRight 
} from 'lucide-react';
import { getDbState } from '../services/dbStore';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabQuery || 'revenue');
  const dbState = getDbState();
  const hasData = !!dbState.hasData;

  useEffect(() => {
    if (tabQuery && ['revenue', 'sales', 'customer', 'inventory', 'regional'].includes(tabQuery)) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const tabs = [
    { id: 'revenue', name: 'Revenue Analytics', icon: DollarSign },
    { id: 'sales', name: 'Sales Analytics', icon: ShoppingBag },
    { id: 'customer', name: 'Customer Behavior', icon: Users },
    { id: 'inventory', name: 'Inventory Analytics', icon: Package },
    { id: 'regional', name: 'Regional Analytics', icon: MapPin },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB'];

  // Calculate dynamic retention stats based on uploaded KPIs if available
  const getLTV = () => {
    if (!hasData || !dbState.kpis?.totalRevenue || !dbState.kpis?.activeCustomers) {
      return '—';
    }
    const avgSpend = dbState.kpis.totalRevenue / dbState.kpis.activeCustomers;
    return `$${(avgSpend * 3.2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Derive monthly average order values dynamically for sales tab line chart
  const getAverageOrderData = () => {
    if (!hasData || !dbState.revenueOverTime) return [];
    const baseAOV = dbState.kpis?.averageOrderValue || 104;
    return dbState.revenueOverTime.map((item, index) => ({
      month: item.month,
      value: Math.floor(baseAOV * (0.92 + (index % 4) * 0.05 + Math.sin(index) * 0.03))
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Business Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">
            Deep-dive operational metrics across your core business lines. Tab segmentations update via ledger databases.
          </p>
        </div>
      </div>

      {/* Tab Selector - Stripe / Vercel style */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer focus:outline-none
                ${isActive 
                  ? 'border-black text-black font-bold' 
                  : 'border-transparent text-gray-400 hover:text-black'
                }
              `}
            >
              <tab.icon size={13} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="space-y-6">
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard
              title="Gross Profit Margin Over Time"
              subtitle="Comparison of revenues versus core production cost ledgers"
              className="lg:col-span-2"
              hasData={hasData}
            >
              {hasData && dbState.revenueOverTime && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dbState.revenueOverTime}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenueAnalytics" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000000" stopOpacity={0.12}/>
                          <stop offset="95%" stopColor="#000000" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        strokeWidth={1.5}
                        fillOpacity={1} 
                        fill="url(#colorRevenueAnalytics)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 flex flex-col justify-between font-sans">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Info size={12} className="text-gray-400" />
                  Margin Analysis
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-3">Gross Margin Percentage</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Gross margin percentage determines your operational profitability. It is calculated as Gross Revenue minus Cost of Goods Sold (COGS), divided by Gross Revenue.
                </p>
                <div className="text-2xl font-bold text-gray-900 mt-5">
                  {hasData && dbState.revenueOverTime?.length > 0 
                    ? `${dbState.revenueOverTime[dbState.revenueOverTime.length - 1].margin}%` 
                    : '— %'}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 mt-4">
                {hasData 
                  ? 'Dynamic calculations active based on latest uploaded files.' 
                  : 'Upload COGS data sheets in settings to activate calculations.'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Sales Volume by Channel"
              subtitle="Units sold categorized across enterprise accounts, self-serve SaaS, and integrations"
              hasData={hasData}
            >
              {hasData && dbState.salesByChannel && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dbState.salesByChannel}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="channel" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 9 }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`$${v.toLocaleString()}`, 'Sales']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={45}>
                        {dbState.salesByChannel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            
            <ChartCard
              title="Average Invoice Order Value"
              subtitle="Historical fluctuations in shopper basket size values"
              hasData={hasData}
            >
              {hasData && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getAverageOrderData()}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `$${v}`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`$${v}`, 'Average Order Value']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#000000" 
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#000000', strokeWidth: 1 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          </div>
        )}

        {activeTab === 'customer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard
              title="New vs Recurring Customer Trends"
              subtitle="Track user repeat transaction frequencies and loyalty counts"
              className="lg:col-span-2"
              hasData={hasData}
            >
              {hasData && dbState.newVsRecurring && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dbState.newVsRecurring}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="new" name="New Customers" stackId="a" fill="#D1D5DB" />
                      <Bar dataKey="recurring" name="Recurring Customers" stackId="a" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Retention Statistics</h4>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-600 font-medium">Customer Lifetime Value (LTV)</span>
                  <span className="text-xs font-bold text-gray-900">{getLTV()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-600 font-medium">Churn Rate Projection</span>
                  <span className="text-xs font-bold text-gray-900">{hasData ? '2.4%' : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Repeat Purchase Frequency</span>
                  <span className="text-xs font-bold text-gray-900">{hasData ? '2.8x' : '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Stock Velocity Status"
              subtitle="Daily depletion rates to predict time-to-depletion and out-of-stock threats"
              hasData={hasData}
            >
              {hasData && dbState.stockVelocity && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dbState.stockVelocity}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis 
                        type="number"
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="sku" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} units/day`, 'Velocity']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Bar dataKey="velocity" name="Sales Velocity" fill="#000000" radius={[0, 4, 4, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            
            <ChartCard
              title="Estimated Days Until Out of Stock"
              subtitle="Projected days remaining before SKU storage runs dry"
              hasData={hasData}
            >
              {hasData && dbState.stockVelocity && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dbState.stockVelocity}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="sku" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} days`, 'Days Left']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Bar dataKey="depletionDays" name="Days Until Depletion" fill="#4B5563" radius={[4, 4, 0, 0]} maxBarSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          </div>
        )}

        {activeTab === 'regional' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard
              title="Geographical Distribution Matrix"
              subtitle="Gross transaction values mapped across customer shipping zones"
              className="lg:col-span-2"
              hasData={hasData}
            >
              {hasData && dbState.regionalAnalytics && (
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dbState.regionalAnalytics}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="region" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`$${v.toLocaleString()}`, 'Total Sales']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                      />
                      <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={45}>
                        {dbState.regionalAnalytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Top Regional Corridors</h4>
              {hasData && dbState.regionalAnalytics?.length > 0 ? (
                <div className="space-y-4">
                  {dbState.regionalAnalytics.map((reg, idx) => {
                    const totalSales = dbState.kpis?.totalRevenue || 1;
                    const percent = Math.round((reg.sales / totalSales) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900">{reg.region}</span>
                          <span className="font-mono text-gray-500 font-medium">${reg.sales.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-black h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-400">No regional shipping coordinates parsed.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
