import { getDbState } from './dbStore';
import api from './axios';

/**
 * Service to manage customer metrics and listings.
 */
export const customerService = {
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/customers');
      const payload = response?.data;
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.customers)
            ? payload.customers
            : [];

      if (normalized.length > 0) {
        return normalized;
      }
    } catch (e) {
      console.warn('Backend customer fetch notice:', e);
    }
    const dbState = getDbState();
    return dbState.customers || [];
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  }
};

