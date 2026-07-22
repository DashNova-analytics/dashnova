import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization, useOrganizationList, useUser, CreateOrganization } from '@clerk/clerk-react';
import KPICard from '../components/dashboard/KPICard';
import ChartCard from '../components/dashboard/ChartCard';
import InsightCard from '../components/dashboard/InsightCard';
import { dashboardService } from '../services/dashboardService';
import { UploadCloud, Clock, ChevronRight, BarChart3, HelpCircle, FileSpreadsheet, Building2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { getDbState } from '../services/dbStore';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { organization } = useOrganization();
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  useEffect(() => {
    if (!organization) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const data = await dashboardService.getDashboardData();
        if (active) {
          setDashboardData(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [organization?.id]);

  // Color palette matching DashNova's minimal monochrome design
  const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB'];

  const getRelativeSyncTime = () => {
    const dbState = getDbState();
    if (!dbState.hasData) {
      return "Never synced";
    }
    if (!dbState.lastSyncTime) {
      return "2 hours ago"; // Default fallback matching prompt
    }
    const syncDate = new Date(dbState.lastSyncTime);
    const now = new Date();
    const diffMs = now - syncDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (!organization) {
    const hasOrgs = userMemberships?.data?.length > 0;
    return (
      <div id="empty-org-view" className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4 py-12">
        <div className="w-full max-w-md text-center mb-8">
          <div className="w-16 h-16 bg-neutral-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Building2 size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {hasOrgs ? 'Select an Organization' : 'No Active Organization'}
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto">
            {hasOrgs
              ? 'Use the organization switcher in the top bar to select a workspace.'
              : 'Create an organization to unlock your DashNova analytical dashboard.'}
          </p>
        </div>

        {!hasOrgs && (
          <div id="create-org-container" className="w-full max-w-md flex justify-center">
            <CreateOrganization afterCreateOrganizationUrl="/dashboard" routing="hash" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Header with Welcome Profile */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Welcome back, {user?.fullName || 'Demo User'}👋
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-gray-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Organization:</span>
            <span className="text-sm font-semibold text-gray-900 block">{organization?.name}</span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last data sync:</span>
            <span className="text-sm font-semibold text-gray-700 block">{getRelativeSyncTime()}</span>
          </div>
          <div className="flex items-center md:justify-end">
            <button
              id="sync-ledger-button"
              onClick={() => navigate('/upload')}
              className="h-8 px-4 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <UploadCloud size={13} />
              Sync Ledger Data
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Gross Revenue"
          value={dashboardData?.kpis?.totalRevenue}
          trend={dashboardData?.hasData ? "+14.2%" : null}
          trendType="positive"
          description="Gross earnings compiled across all uploaded business ledger sales and receipt invoices."
          loading={loading}
        />
        <KPICard
          title="Total Sales Volume"
          value={dashboardData?.kpis?.salesCount}
          trend={dashboardData?.hasData ? "+8.5%" : null}
          trendType="positive"
          description="Total number of transaction line items processed from uploaded billing reports."
          loading={loading}
        />
        <KPICard
          title="Average Order Value"
          value={dashboardData?.kpis?.averageOrderValue}
          trend={dashboardData?.hasData ? "+5.1%" : null}
          trendType="positive"
          description="Calculated average basket value: Total Gross Revenue divided by Total Sales Volume."
          loading={loading}
        />
        <KPICard
          title="Active Customer Base"
          value={dashboardData?.kpis?.activeCustomers}
          trend={dashboardData?.hasData ? "+12.3%" : null}
          trendType="positive"
          description="Unique customer list identified across transaction receipts and customer ledgers."
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Over Time"
          subtitle="Monthly gross revenue statistics compiled from database invoices"
          loading={loading}
          hasData={!!dashboardData?.hasData}
        >
          {dashboardData?.hasData && (
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.revenueOverTime}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Gross Revenue']}
                    contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#000000"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Sales Volume Distribution"
          subtitle="Frequency of invoice items categorized by volume"
          loading={loading}
          hasData={!!dashboardData?.hasData}
        >
          {dashboardData?.hasData && (
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.salesDistribution}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 9 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Distribution']}
                    contentStyle={{ background: '#ffffff', borderColor: '#e5e7eb', borderRadius: 4, fontSize: 11 }}
                  />
                  <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {dashboardData.salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Grid: Recent Activity & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ingestion Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[300px] lg:col-span-2 hover:border-gray-300 transition duration-150">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              Recent Ledger Ingestions
            </h3>

            {dashboardData?.hasData && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                {dashboardData.recentActivity.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border border-gray-100 rounded bg-gray-50/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-black/5 flex items-center justify-center text-black">
                        <FileSpreadsheet size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-950 truncate max-w-[200px] sm:max-w-[340px]">{file.filename}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{file.recordsDiscovered} rows ingested · {file.uploadedAt}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold uppercase tracking-wider">
                      Synced
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-md p-8 text-center bg-gray-50/20 flex flex-col items-center justify-center min-h-[180px]">
                <UploadCloud size={20} className="text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">No Business Logs Uploaded</p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                  Import sales logs, QuickBooks sheets, or standard ledger CSV tables to populate activity tracking.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="text-[11px] text-gray-500 hover:text-black font-bold flex items-center gap-1 mt-4 focus:outline-none cursor-pointer w-fit"
          >
            Review data files
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[300px] hover:border-gray-300 transition duration-150">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
              <BarChart3 size={14} className="text-gray-400" />
              Top Catalog Performers
            </h3>

            {dashboardData?.hasData && dashboardData.topProducts.length > 0 ? (
              <div className="space-y-3.5">
                {dashboardData.topProducts.map((p, idx) => (
                  <div key={p.sku} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-950">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.sku} · {p.soldCount} units sold</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900 font-mono">{p.revenue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-md p-8 text-center bg-gray-50/20 flex flex-col items-center justify-center min-h-[180px]">
                <span className="text-xs font-semibold text-gray-700">Catalog Empty</span>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  SKU listings populate dynamically once billing registers are uploaded.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/products')}
            className="text-[11px] text-gray-500 hover:text-black font-bold flex items-center gap-1 mt-4 focus:outline-none cursor-pointer w-fit"
          >
            View product inventory
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* AI Insights Segment */}
      <InsightCard
        insights={dashboardData?.aiInsights || []}
        loading={loading}
        onGenerate={() => navigate('/ai')}
      />
    </div>
  );
}
