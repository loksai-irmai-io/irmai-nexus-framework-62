
import axios from 'axios';

// Define a base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
