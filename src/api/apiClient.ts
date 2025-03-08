
import axios from 'axios';
import { toast } from 'sonner';

// Define the base API URL - should come from environment variables in production
const API_URL = 'https://api.example.com'; // Replace with your actual API URL

// Create an axios instance with common configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    // Show error toast
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Generic API request methods
export const api = {
  get: <T>(url: string, params?: object) => 
    apiClient.get<T>(url, { params }).then(response => response.data),
  
  post: <T>(url: string, data: any) => 
    apiClient.post<T>(url, data).then(response => response.data),
  
  put: <T>(url: string, data: any) => 
    apiClient.put<T>(url, data).then(response => response.data),
  
  delete: <T>(url: string) => 
    apiClient.delete<T>(url).then(response => response.data),
  
  upload: <T>(url: string, formData: FormData) => 
    apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data),
};
