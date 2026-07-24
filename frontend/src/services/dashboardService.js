import { getDbState } from "./dbStore";
import api from "./axios";

export const dashboardService = {
  async getDashboardData() {
    let backendSummary = null;
    try {
      const response = await api.get("/dashboard/summary");
      if (response.data) {
        backendSummary = response.data;
      }
    } catch (e) {
      console.warn("Backend dashboard fetch notice:", e);
    }

    const dbState = getDbState();

    const hasData = Boolean(dbState.hasData || backendSummary?.hasData);

    if (!hasData) {
      return {
        hasData: false,
        kpis: {
          totalRevenue: null,
          salesCount: null,
          averageOrderValue: null,
          activeCustomers: null,
        },
        revenueOverTime: [],
        salesDistribution: [],
        salesByChannel: [],
        newVsRecurring: [],
        stockVelocity: [],
        regionalAnalytics: [],
        forecast: { historical: [], predicted: [], confidence: [], canForecast: false },
        topProducts: [],
        products: [],
        customers: [],
        aiInsights: [],
        healthScore: null,
        recentActivity: [],
      };
    }

    if (backendSummary && backendSummary.hasData) {
      const { kpis, products = [], customers = [], uploads = [] } = backendSummary;
      
      return {
        hasData: true,
        kpis: {
          totalRevenue: kpis?.totalRevenue || dbState.kpis?.totalRevenue || "Rs 0.00",
          salesCount: String(kpis?.salesCount || dbState.kpis?.salesCount || "0"),
          averageOrderValue: kpis?.averageOrderValue || dbState.kpis?.averageOrderValue || "Rs 0.00",
          activeCustomers: String(kpis?.activeCustomers || dbState.kpis?.activeCustomers || "0"),
        },
        revenueOverTime: dbState.revenueOverTime || [],
        salesDistribution: dbState.salesDistribution || [],
        salesByChannel: dbState.salesByChannel || [],
        newVsRecurring: dbState.newVsRecurring || [],
        stockVelocity: dbState.stockVelocity || [],
        regionalAnalytics: dbState.regionalAnalytics || [],
        forecast: dbState.forecast || { historical: [], predicted: [], confidence: [], canForecast: false },
        healthScore: dbState.healthScore || null,
        topProducts: products.slice(0, 3).map((p, idx) => ({
          sku: p.sku || `SKU-P00${idx + 1}`,
          name: p.name,
          soldCount: p.soldCount || 0,
          revenue: `Rs ${((p.price || 0) * (p.soldCount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        })),
        products: products.map((p, idx) => ({
          id: p.id,
          sku: p.sku || `SKU-P00${idx + 1}`,
          name: p.name,
          category: p.category || 'General',
          stock: p.stock ?? 0,
          price: `Rs ${(p.price || 0).toFixed(2)}`,
          soldCount: p.soldCount || 0,
          revenue: `Rs ${((p.price || 0) * (p.soldCount || 0)).toFixed(2)}`
        })),
        customers: customers.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email || '—',
          sales: `Rs ${(c.sales || 0).toFixed(2)}`,
          orders: c.orders || 0,
          region: c.region || 'Global',
          status: c.status || 'Active'
        })),
        aiInsights: dbState.aiInsights || [],
        recentActivity: (uploads.length > 0 ? uploads : (dbState.uploadedFiles || [])).map((f) => ({
          id: f.id,
          filename: f.filename || f.name,
          recordsDiscovered: f.metadata ? JSON.parse(f.metadata)?.recordsDiscovered || 0 : (f.recordsDiscovered || 0),
          uploadedAt: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : (f.uploadedAt || 'Today'),
          status: 'Ready',
        })),
      };
    }

    return {
      hasData: dbState.hasData,
      kpis: dbState.kpis,
      revenueOverTime: dbState.revenueOverTime || [],
      salesDistribution: dbState.salesDistribution || [],
      salesByChannel: dbState.salesByChannel || [],
      newVsRecurring: dbState.newVsRecurring || [],
      stockVelocity: dbState.stockVelocity || [],
      regionalAnalytics: dbState.regionalAnalytics || [],
      forecast: dbState.forecast || { historical: [], predicted: [], confidence: [], canForecast: false },
      healthScore: dbState.healthScore || null,
      topProducts: (dbState.products || []).slice(0, 3),
      products: dbState.products || [],
      customers: dbState.customers || [],
      aiInsights: dbState.aiInsights || [],
      recentActivity: (dbState.uploadedFiles || []).map((f) => ({
        id: f.id,
        filename: f.name,
        recordsDiscovered: f.recordsDiscovered || 0,
        uploadedAt: f.uploadedAt || 'Today',
        status: f.status || 'Ready',
      })),
    };
  },
};
