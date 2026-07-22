import { getDbState } from "./dbStore";

export const dashboardService = {
  async getDashboardData() {
    // Small delay for loading animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const dbState = getDbState();

    return {
      // Dashboard state
      hasData: dbState.hasData,

      // KPI Cards
      kpis: dbState.kpis,

      // Charts
      revenueOverTime: dbState.revenueOverTime,
      salesDistribution: dbState.salesDistribution,
      salesByChannel: dbState.salesByChannel,
      newVsRecurring: dbState.newVsRecurring,
      stockVelocity: dbState.stockVelocity,
      regionalAnalytics: dbState.regionalAnalytics,

      // ⭐ NEW Forecast data
      forecast: dbState.forecast,

      // Tables
      topProducts: dbState.products.slice(0, 3),
      products: dbState.products,
      customers: dbState.customers,

      // AI
      aiInsights: dbState.aiInsights,

      // Upload Activity
      recentActivity: (dbState.uploadedFiles || []).map((f) => ({
        id: f.id,
        filename: f.name,
        recordsDiscovered: f.recordsDiscovered,
        uploadedAt: f.uploadedAt,
        status: f.status,
      })),
    };
  },
};