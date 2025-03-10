
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Define a base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Request timeout (in milliseconds)
const REQUEST_TIMEOUT = 120000; // Increased to 120 seconds for large file uploads

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
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle different error statuses appropriately
    if (error.response) {
      // Server responded with non-2xx status
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401 || status === 403) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      
      // Handle rate limiting
      if (status === 429) {
        console.warn('Rate limit exceeded. Please try again later.');
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error('Server error occurred. Our team has been notified.');
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error. Please check your connection.');
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
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  },
  
  uploadEventLog: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
    
    try {
      // Using the POST method directly instead of the api.post wrapper
      // This gives us more control over the request config
      const response = await apiClient.post('/processdiscovery/eventlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 180000, // 3 minutes timeout for large files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      });
      
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in uploadEventLog:', error);
      throw error;
    }
  }
};

export default apiClient;
