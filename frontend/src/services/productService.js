import { getDbState } from './dbStore';

/**
 * Service to manage products and inventory data.
 * Dynamic implementation connected to the central client-side database.
 */
export const productService = {
  getProducts: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dbState = getDbState();
    return dbState.products || [];
  }
};

