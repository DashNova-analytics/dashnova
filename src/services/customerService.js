import { getDbState } from './dbStore';

/**
 * Service to manage customer metrics and listings.
 * Dynamic implementation connected to the central client-side database.
 */
export const customerService = {
  getCustomers: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return dbState.customers || [];
  }
};

