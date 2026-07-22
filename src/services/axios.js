import axios from 'axios';

// Create configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT to headers once real integration is added
api.interceptors.request.use(
  async (config) => {
    // In actual integration, you would retrieve the token:
    // const token = await window.Clerk?.session?.getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // For development/mock purposes:
    const mockToken = localStorage.getItem('dashnova_mock_token');
    if (mockToken) {
      config.headers.Authorization = `Bearer ${mockToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
