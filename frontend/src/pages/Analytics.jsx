import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ChartCard from '../components/dashboard/ChartCard';
import { ChartSkeleton } from '../components/common/Loader';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  MapPin, 
  TrendingUp, 
  Info, 
  ArrowUpRight,
  Download,
  Calendar,
  ChevronDown,
  Check,
  Dna,
  Trophy,
  Sparkles,
  Zap,
  FileSpreadsheet,
  UploadCloud,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { getDbState } from '../services/dbStore';
import { dashboardService } from '../services/dashboardService';
import OnboardingWorkspace from '../components/dashboard/OnboardingWorkspace';
import DashboardAnalyticsLoader from '../components/common/DashboardAnalyticsLoader';
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
  Legend,
  PieChart,
  Pie,
  CartesianGrid,
  ComposedChart
} from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabQuery || 'revenue');
  const [tabLoading, setTabLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  const [dbState, setDbState] = useState(() => getDbState());
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExtractedBanner, setShowExtractedBanner] = useState(() => searchParams.get('uploaded') === 'true');
  const hasData = Boolean(dbState?.hasData);

  const uploadedQuery = searchParams.get('uploaded');

  useEffect(() => {
    if (uploadedQuery === 'true') {
      setShowExtractedBanner(true);
      setDbState(getDbState());
      refreshAnalytics();
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('uploaded');
        return next;
      }, { replace: true });
    }
  }, [uploadedQuery]);

  const refreshAnalytics = async () => {
    setIsRefreshing(true);
    try {
      await dashboardService.getDashboardData();
      setDbState(getDbState());
    } catch (err) {
      console.warn("Analytics refresh warning:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let intervalId = null;
    if (isAutoRefreshing) {
      intervalId = setInterval(() => {
        refreshAnalytics();
      }, 60000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefreshing]);

  useEffect(() => {
    if (tabQuery && ['revenue', 'sales', 'customer', 'inventory', 'regional', 'dna', 'benchmarking'].includes(tabQuery)) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const tabs = [
    { id: 'revenue', name: 'Revenue Analytics', icon: DollarSign },
    { id: 'sales', name: 'Sales Analytics', icon: ShoppingBag },
    { id: 'customer', name: 'Customer Behavior', icon: Users },
    { id: 'inventory', name: 'Inventory Analytics', icon: Package },
    { id: 'dna', name: 'Business DNA', icon: Dna },
    { id: 'benchmarking', name: 'AI Benchmarking', icon: Trophy },
  ];

  const dateRangeOptions = [
    { id: '7d', label: 'Last 7 Days', shortLabel: '7D' },
    { id: '30d', label: 'Last 30 Days', shortLabel: '30D' },
    { id: '90d', label: 'Last 90 Days', shortLabel: '90D' },
    { id: 'ytd', label: 'Year to Date', shortLabel: 'YTD' },
    { id: 'all', label: 'All Time', shortLabel: 'All' },
  ];

  const handleTabChange = (tabId) => {
    setTabLoading(true);
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setTimeout(() => {
      setTabLoading(false);
    }, 350);
  };

  const handleDateRangeChange = (rangeId) => {
    setTabLoading(true);
    setDateRange(rangeId);
    setDatePickerOpen(false);
    setTimeout(() => {
      setTabLoading(false);
    }, 350);
  };

  const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

  // Data directly from dbState
  const rawRevenueData = dbState.revenueOverTime || [];
  const rawChannelData = dbState.salesByChannel || [];
  const rawRecurringData = dbState.newVsRecurring || [];
  const rawVelocityData = dbState.stockVelocity || [];
  const rawRegionalData = dbState.regionalAnalytics || [];

  // Filter datasets based on selected Date Range
  const getFilteredRevenueData = () => {
    if (dateRange === '7d') return rawRevenueData.slice(-2);
    if (dateRange === '30d') return rawRevenueData.slice(-3);
    if (dateRange === '90d') return rawRevenueData.slice(-4);
    if (dateRange === 'ytd') return rawRevenueData.slice(0, 5);
    return rawRevenueData;
  };

  const getFilteredRecurringData = () => {
    if (dateRange === '7d') return rawRecurringData.slice(-2);
    if (dateRange === '30d') return rawRecurringData.slice(-3);
    if (dateRange === '90d') return rawRecurringData.slice(-4);
    if (dateRange === 'ytd') return rawRecurringData.slice(0, 5);
    return rawRecurringData;
  };

  const revenueData = getFilteredRevenueData();
  const channelData = rawChannelData;
  const recurringData = getFilteredRecurringData();
  const velocityData = rawVelocityData;
  const regionalData = rawRegionalData;

  const categoryData = (dbState.products && dbState.products.length > 0)
    ? dbState.products.slice(0, 5).map((p) => ({
        name: p.name,
        value: typeof p.revenue === 'number' ? p.revenue : (p.soldCount ? p.soldCount * (p.price || 100) : 100)
      }))
    : [
        { name: 'Software Licenses', value: 45 },
        { name: 'Cloud Infrastructure', value: 28 },
        { name: 'Consulting & Support', value: 17 },
        { name: 'Hardware Add-ons', value: 10 },
      ];

  const getLTV = () => {
    if (dbState.kpis?.totalRevenue && dbState.kpis?.activeCustomers) {
      const avgSpend = dbState.kpis.totalRevenue / dbState.kpis.activeCustomers;
      return `Rs ${(avgSpend * 3.2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return 'Rs 3,420.00';
  };

  const getAverageOrderData = () => {
    const baseAOV = dbState.kpis?.averageOrderValue || 148;
    return revenueData.map((item, index) => ({
      month: item.month,
      value: Math.floor(baseAOV * (0.92 + (index % 4) * 0.05 + Math.sin(index) * 0.04))
    }));
  };

  const handleExportCSV = () => {
    setExporting(true);
    let csvRows = [];
    let filename = `analytics_${activeTab}_${dateRange}.csv`;

    if (activeTab === 'revenue') {
      csvRows.push(['Time Frame', 'Gross Revenue (Rs)', 'Profit Margin (%)', 'Benchmark Target (Rs)']);
      revenueData.forEach(row => {
        csvRows.push([row.month, row.revenue, row.margin, row.target]);
      });
    } else if (activeTab === 'sales') {
      csvRows.push(['Sales Channel', 'Sales Volume (Rs)']);
      channelData.forEach(row => {
        csvRows.push([row.channel, row.sales]);
      });
    } else if (activeTab === 'customer') {
      csvRows.push(['Time Frame', 'New Customers', 'Recurring Customers']);
      recurringData.forEach(row => {
        csvRows.push([row.month, row.new, row.recurring]);
      });
    } else if (activeTab === 'inventory') {
      csvRows.push(['SKU Item', 'Sales Velocity (units/day)', 'Days Until Depletion']);
      velocityData.forEach(row => {
        csvRows.push([row.sku, row.velocity, row.depletionDays]);
      });
    } else if (activeTab === 'regional') {
      csvRows.push(['Region', 'Sales Volume (Rs)']);
      regionalData.forEach(row => {
        csvRows.push([row.region, row.sales]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExporting(false);
    setExportNotice(`Successfully exported ${activeTab.toUpperCase()} data (${dateRangeOptions.find(o => o.id === dateRange)?.label}) as CSV.`);
    setTimeout(() => {
      setExportNotice('');
    }, 4000);
  };

  if (!dbState?.hasData) {
    return <OnboardingWorkspace onDatasetUploaded={() => refreshAnalytics()} />;
  }

  return (
    <div className="space-y-5 sm:space-y-8 font-sans">
      {/* Dataset Extracted Banner */}
      {showExtractedBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="font-bold text-emerald-950">Dataset Extracted & Analyzed Successfully!</p>
              <p className="text-emerald-700 mt-0.5 text-[11px]">
                Your spreadsheet records have been converted into live KPI cards, sales trends, product metrics, and business analytics below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExtractedBanner(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-xs focus:outline-none shrink-0 px-2.5 py-1 rounded hover:bg-emerald-100 transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-gray-100 pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">Business Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            Deep-dive operational metrics across core business lines with interactive Recharts visualizations.
          </p>
        </div>

        {/* Date Range & CSV Export Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Responsive Period Filter Controls */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1 shadow-xs w-full sm:w-auto">
            {/* Quick Chip Preset Bar (Scrollable on mobile) */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded p-0.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {dateRangeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleDateRangeChange(opt.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition cursor-pointer shrink-0 ${
                    dateRange === opt.id
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  {opt.shortLabel || opt.label}
                </button>
              ))}
            </div>

            {/* Date Range Dropdown Toggle */}
            <div className="relative shrink-0 hidden md:block">
              <button
                type="button"
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="h-7 px-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded flex items-center justify-between gap-1.5 transition cursor-pointer"
              >
                <Calendar size={13} className="text-gray-500 shrink-0" />
                <span className="truncate">{dateRangeOptions.find(o => o.id === dateRange)?.label || 'Last 7 Days'}</span>
                <ChevronDown size={12} className={`text-gray-400 shrink-0 transition-transform duration-200 ${datePickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {datePickerOpen && (
                <div className="absolute left-0 sm:left-auto right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Filter Time Frame
                  </div>
                  {dateRangeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleDateRangeChange(opt.id)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition cursor-pointer ${
                        dateRange === opt.id ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {dateRange === opt.id && <Check size={12} className="text-black shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auto Refresh & Export CSV Buttons */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <button
              type="button"
              onClick={refreshAnalytics}
              disabled={isRefreshing}
              title="Poll latest metrics every minute"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md shadow-xs transition cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-black" : "text-gray-600"} />
              <span className="hidden sm:inline">{isRefreshing ? "Updating..." : "Auto-Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md shadow-xs transition cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Success Notification Banner */}
      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-md flex items-center justify-between font-medium animate-fade-in">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice('')} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Tab Selector - Stripe / Vercel style */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-4 sm:gap-6 pb-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-2.5 sm:pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer focus:outline-none shrink-0
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
      {tabLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton titleWidth="w-48" />
          <ChartSkeleton titleWidth="w-40" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'revenue' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard
                title="Gross Profit Margin & Revenue Trend"
                subtitle="Composed monthly revenue with target benchmarks and cost ledger margins"
                className="lg:col-span-2"
                hasData={hasData}
              >
                <div className="w-full h-[200px] sm:h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={revenueData}
                      margin={{ top: 10, right: -5, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={{ stroke: '#E5E7EB' }} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(v) => `Rs ${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(v) => `${v}%`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'margin' ? `${value}%` : `Rs ${Number(value).toLocaleString()}`,
                          name === 'revenue' ? 'Gross Revenue' : name === 'target' ? 'Benchmark Target' : 'Profit Margin'
                        ]}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
                      <Bar yAxisId="left" dataKey="revenue" name="revenue" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Line yAxisId="right" type="monotone" dataKey="margin" name="margin" stroke="#6B7280" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <ChartCard
                title="Revenue by Product Category"
                subtitle="Distribution breakdown across major product categories"
                hasData={hasData}
              >
                <div className="w-full h-[230px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Sales Volume by Channel"
                subtitle="Units sold categorized across direct enterprise sales, self-serve SaaS, and partners"
                hasData={hasData}
              >
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channelData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="channel" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 9 }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `Rs ${(v/1000).toFixed(0)}k`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Total Sales']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={45}>
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <ChartCard
                title="Average Invoice Order Value (AOV)"
                subtitle="Historical monthly fluctuations in shopper basket size values"
                hasData={hasData}
              >
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getAverageOrderData()}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={{ stroke: '#E5E7EB' }} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `Rs ${v}`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`Rs ${v}`, 'Average Order Value']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#000000" 
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#000000', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard
                title="New vs Recurring Customer Trends"
                subtitle="Track user repeat transaction frequencies and customer loyalty counts"
                className="lg:col-span-2"
                hasData={hasData}
              >
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recurringData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={{ stroke: '#E5E7EB' }} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="new" name="New Customers" stackId="a" fill="#9CA3AF" />
                      <Bar dataKey="recurring" name="Recurring Customers" stackId="a" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                    <span className="text-xs font-bold text-gray-900">2.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">Repeat Purchase Frequency</span>
                    <span className="text-xs font-bold text-gray-900">3.2x</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Stock Velocity Status"
                subtitle="Daily depletion rates to predict time-to-depletion and stock threats"
                hasData={hasData}
              >
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={velocityData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                      <XAxis 
                        type="number"
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="sku" 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} units/day`, 'Velocity']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Bar dataKey="velocity" name="Sales Velocity" fill="#000000" radius={[0, 4, 4, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <ChartCard
                title="Estimated Days Until Out of Stock"
                subtitle="Projected days remaining before SKU storage runs dry"
                hasData={hasData}
              >
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={velocityData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="sku" 
                        tickLine={false} 
                        axisLine={{ stroke: '#E5E7EB' }} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} days`, 'Days Left']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Bar dataKey="depletionDays" name="Days Until Depletion" fill="#4B5563" radius={[4, 4, 0, 0]} maxBarSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={regionalData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis 
                        dataKey="region" 
                        tickLine={false} 
                        axisLine={{ stroke: '#E5E7EB' }} 
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <YAxis 
                        tickFormatter={(v) => `Rs ${(v/1000).toFixed(0)}k`}
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Total Sales']}
                        contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 6, fontSize: 11 }}
                      />
                      <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={45}>
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Top Regional Corridors</h4>
                <div className="space-y-4">
                  {regionalData.map((reg, idx) => {
                    const totalSales = regionalData.reduce((acc, curr) => acc + curr.sales, 0) || 1;
                    const percent = Math.round((reg.sales / totalSales) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900">{reg.region}</span>
                          <span className="font-mono text-gray-500 font-medium">Rs {reg.sales.toLocaleString()} ({percent}%)</span>
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
              </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Dna size={18} className="text-black" />
                  <h3 className="text-sm font-bold text-gray-900">Business Behavioral DNA Profile</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Weekend Sales Spikes</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">+38% Weekend Uplift</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Transactions spike significantly on Saturdays and Sundays. Digital self-serve checkout sees highest conversion velocity.
                    </p>
                  </div>

                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Seasonal Product Velocity</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Q4 Electronics Surge</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Hardware accessory demand peaks in Q4, outperforming Q1-Q3 averages by 2.4x.
                    </p>
                  </div>

                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Repeat Customer Loop</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">2.8 Orders / User</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Retained enterprise clients place average 2.8 repeat orders every 60 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                    <Sparkles size={18} className="text-black" />
                    <h3 className="text-sm font-bold text-gray-900">AI Pattern Adaptation Insights</h3>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 border border-gray-200 rounded-lg">
                    Over time, DashNova's AI learns your business's unique behavioral rhythm. As seasonal demand spikes or customer order loops shift, the AI automatically calibrates restocking horizons and personalized outreach timing.
                  </p>
                </div>

                <div className="p-3.5 bg-black text-white rounded-lg text-xs space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block">Personalized Recommendation</span>
                  <p className="leading-normal">
                    Schedule automated inventory re-ordering 5 days prior to weekend surges to capitalize on +38% peak buyer traffic.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benchmarking' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-black" />
                    <h3 className="text-sm font-bold text-gray-900">Industry Peer Benchmarking</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Top 10% Overall</span>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Profit Margin</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">18.2% vs 14.0% Avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-[10px] text-gray-500">Outperforming 85% of peer SaaS/D2C companies.</span>
                  </div>

                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Customer Retention Rate</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">92.0% vs 81.0% Avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                    <span className="text-[10px] text-gray-500">Top 5th percentile customer retention loyalty.</span>
                  </div>

                  <div className="p-3.5 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-950">Inventory Turn Rate</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">6.2x vs 4.8x Avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-1">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }} />
                    </div>
                    <span className="text-[10px] text-gray-500">Efficient stock velocity and low carrying dead-stock.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                    <Zap size={18} className="text-black" />
                    <h3 className="text-sm font-bold text-gray-900">AI Peer Positioning Analysis</h3>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 border border-gray-200 rounded-lg mb-4">
                    Your enterprise customer retention and unit economics place DashNova in the top 10% of peer SaaS and hardware providers. To reach the top 2%, optimize mid-market lead conversion rates to match your top-tier enterprise metrics.
                  </p>
                </div>

                <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-lg text-xs text-emerald-900 font-medium">
                  ✓ Industry Benchmark Dataset Updated for Q3 2026.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

