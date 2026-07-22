import { getDbState } from './dbStore';

/**
 * Service to manage business analytics.
 * Dynamic implementation connected to the central client-side database.
 */
export const analyticsService = {
  getRevenueAnalytics: async (timeframe = 'monthly') => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return { 
      data: dbState.revenueOverTime, 
      metadata: { timeframe },
      hasData: dbState.hasData
    };
  },

  getSalesAnalytics: async (timeframe = 'monthly') => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return { 
      data: dbState.salesDistribution, 
      channels: dbState.salesByChannel,
      metadata: { timeframe },
      hasData: dbState.hasData
    };
  },

  getCustomerAnalytics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return { 
      data: dbState.newVsRecurring, 
      metadata: {},
      hasData: dbState.hasData
    };
  },

  getInventoryAnalytics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return { 
      data: dbState.stockVelocity, 
      metadata: {},
      hasData: dbState.hasData
    };
  },

  getRegionalAnalytics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return { 
      data: dbState.regionalAnalytics, 
      metadata: {},
      hasData: dbState.hasData
    };
  }
};

