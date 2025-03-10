
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Define a base URL for your API - will be overridden by environment variable if set
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Request timeout (in milliseconds)
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get auth token from a secure location
    const token = localStorage.getItem('auth_token');
    
    // Only add the token if it exists
    if (token) {
      // Set the Authorization header with the token
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add CSRF protection for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = localStorage.getItem('csrf_token') || '';
      config.headers.set('X-CSRF-TOKEN', csrfToken);
    }
    
    // Log all requests in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error: AxiosError) => {
    // Log request errors but don't expose details to console in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error statuses appropriately
    if (error.response) {
      // Server responded with non-2xx status
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401 || status === 403) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        toast.error('Authentication error. Please log in again.');
        window.location.href = '/login';
      }
      
      // Handle rate limiting
      if (status === 429) {
        toast.warning('Rate limit exceeded. Please try again later.');
      }
      
      // Handle server errors
      if (status >= 500) {
        toast.error('Server error occurred. Our team has been notified.');
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      toast.error('Network error. Please check your connection or ensure the backend server is running.');
      console.error('Network Error:', error.request);
    }
    
    // Only log detailed errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Export utility functions for common API operations
export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },
  
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },
  
  uploadFile: async <T>(url: string, formData: FormData): Promise<T> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await apiClient.post<T>(url, formData, config);
      return response.data;
    } catch (error) {
      console.error(`File upload to ${url} failed:`, error);
      throw error;
    }
  }
};

export default apiClient;
