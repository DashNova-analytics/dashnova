import { getDbState } from './dbStore';
import api from './axios';

/**
 * Service to manage products and inventory data.
 */
export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.warn('Backend product fetch notice:', e);
    }
    const dbState = getDbState();
    return dbState.products || [];
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  }
};

