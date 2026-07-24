import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_URL || '/api').trim();
const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, '');
const baseURL = normalizedBaseUrl.includes('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

// Create configured axios instance
const api = axios.create({
  baseURL,
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
    const isRateLimit = error.response?.status === 429;
    const customError = {
      message: isRateLimit
        ? 'High traffic volume detected. Retrying request automatically...'
        : (error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred'),
      status: error.response?.status,
      data: error.response?.data,
      isRateLimit
    };
    return Promise.reject(customError);
  }
);

export default api;
