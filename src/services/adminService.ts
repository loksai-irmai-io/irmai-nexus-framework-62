
import { AxiosResponse } from 'axios';
import apiClient from './apiClient';

export type ServiceStatus = {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  responseTime: number;
  lastChecked: string;
  uptime: number;
  endpoint: string;
  errorCount: number;
  description: string;
};

export type DependencyLink = {
  source: string;
  target: string;
  status: 'active' | 'inactive' | 'degraded' | 'unknown';
  latency: number;
  requestCount: number;
  errorRate: number;
  lastError?: string;
};

export type SystemHealth = {
  overall: {
    status: 'healthy' | 'degraded' | 'critical' | 'unknown';
    score: number;
    message: string;
  };
  services: ServiceStatus[];
  dependencies: DependencyLink[];
  lastUpdated: string;
};

export type LogEntry = {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  details?: any;
};

// Mock data for development purposes
const mockSystemHealth: SystemHealth = {
  overall: {
    status: 'healthy',
    score: 98,
    message: 'System is operating normally'
  },
  services: [
    {
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'online',
      responseTime: 42,
      lastChecked: new Date().toISOString(),
      uptime: 99.98,
      endpoint: '/api/health',
      errorCount: 0,
      description: 'Main API gateway service'
    },
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'online',
      responseTime: 63,
      lastChecked: new Date().toISOString(),
      uptime: 99.95,
      endpoint: '/auth/health',
      errorCount: 2,
      description: 'User authentication and authorization service'
    },
    {
      id: 'process-analyzer',
      name: 'Process Analytics Engine',
      status: 'online',
      responseTime: 128,
      lastChecked: new Date().toISOString(),
      uptime: 99.87,
      endpoint: '/analytics/process/health',
      errorCount: 0,
      description: 'Process discovery and analysis service'
    },
    {
      id: 'outlier-detector',
      name: 'Outlier Detection Service',
      status: 'online',
      responseTime: 217,
      lastChecked: new Date().toISOString(),
      uptime: 99.91,
      endpoint: '/analytics/outliers/health',
      errorCount: 0,
      description: 'Anomaly and outlier detection service'
    },
    {
      id: 'risk-analyzer',
      name: 'Risk Analysis Engine',
      status: 'degraded',
      responseTime: 356,
      lastChecked: new Date().toISOString(),
      uptime: 98.76,
      endpoint: '/risk/health',
      errorCount: 12,
      description: 'Predictive risk analytics service'
    },
    {
      id: 'compliance-checker',
      name: 'Compliance Service',
      status: 'online',
      responseTime: 85,
      lastChecked: new Date().toISOString(),
      uptime: 99.93,
      endpoint: '/compliance/health',
      errorCount: 1,
      description: 'Compliance monitoring and reporting service'
    },
    {
      id: 'database',
      name: 'Main Database',
      status: 'online',
      responseTime: 18,
      lastChecked: new Date().toISOString(),
      uptime: 99.99,
      endpoint: '/db/health',
      errorCount: 0,
      description: 'Primary database for all services'
    },
    {
      id: 'notification',
      name: 'Notification Service',
      status: 'online',
      responseTime: 45,
      lastChecked: new Date().toISOString(),
      uptime: 99.85,
      endpoint: '/notify/health',
      errorCount: 3,
      description: 'User notification and alerting service'
    }
  ],
  dependencies: [
    {
      source: 'frontend',
      target: 'api-gateway',
      status: 'active',
      latency: 51,
      requestCount: 12568,
      errorRate: 0.02
    },
    {
      source: 'api-gateway',
      target: 'auth-service',
      status: 'active',
      latency: 23,
      requestCount: 8754,
      errorRate: 0.03
    },
    {
      source: 'api-gateway',
      target: 'process-analyzer',
      status: 'active',
      latency: 48,
      requestCount: 4532,
      errorRate: 0.01
    },
    {
      source: 'api-gateway',
      target: 'outlier-detector',
      status: 'active',
      latency: 65,
      requestCount: 3211,
      errorRate: 0.00
    },
    {
      source: 'api-gateway',
      target: 'risk-analyzer',
      status: 'degraded',
      latency: 187,
      requestCount: 2876,
      errorRate: 0.87,
      lastError: 'Connection timeout after 5000ms'
    },
    {
      source: 'api-gateway',
      target: 'compliance-checker',
      status: 'active',
      latency: 42,
      requestCount: 1987,
      errorRate: 0.05
    },
    {
      source: 'auth-service',
      target: 'database',
      status: 'active',
      latency: 12,
      requestCount: 9876,
      errorRate: 0.00
    },
    {
      source: 'process-analyzer',
      target: 'database',
      status: 'active',
      latency: 14,
      requestCount: 6543,
      errorRate: 0.01
    },
    {
      source: 'outlier-detector',
      target: 'database',
      status: 'active',
      latency: 15,
      requestCount: 4231,
      errorRate: 0.00
    },
    {
      source: 'risk-analyzer',
      target: 'database',
      status: 'degraded',
      latency: 238,
      requestCount: 3456,
      errorRate: 0.78,
      lastError: 'Query timeout after 3000ms'
    },
    {
      source: 'compliance-checker',
      target: 'database',
      status: 'active',
      latency: 13,
      requestCount: 2345,
      errorRate: 0.02
    },
    {
      source: 'api-gateway',
      target: 'notification',
      status: 'active',
      latency: 38,
      requestCount: 1243,
      errorRate: 0.04
    }
  ],
  lastUpdated: new Date().toISOString()
};

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    level: 'error',
    source: 'risk-analyzer',
    message: 'Connection timeout to database',
    details: {
      error: 'Connection timeout after 5000ms',
      endpoint: '/risk/analytics',
      traceId: 'trace-123456'
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    level: 'warning',
    source: 'auth-service',
    message: 'High number of failed login attempts',
    details: {
      count: 25,
      timeWindow: '5 minutes',
      ipRange: '192.168.1.x'
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    level: 'info',
    source: 'api-gateway',
    message: 'API rate limit increased',
    details: {
      oldLimit: 100,
      newLimit: 150,
      reason: 'Expected traffic increase'
    }
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    level: 'warning',
    source: 'risk-analyzer',
    message: 'Slow query performance',
    details: {
      query: 'SELECT * FROM risk_factors WHERE...',
      duration: '2.8s',
      threshold: '1.0s'
    }
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    level: 'error',
    source: 'notification',
    message: 'Failed to send email notifications',
    details: {
      count: 13,
      reason: 'SMTP server connection refused',
      retryScheduled: true
    }
  }
];

// API functions that will eventually connect to a real backend
export const adminService = {
  getSystemHealth: async (): Promise<SystemHealth> => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiClient.get('/admin/system-health');
      // return response.data;
      
      // For now, return mock data
      return mockSystemHealth;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },
  
  getServiceStatus: async (serviceId: string): Promise<ServiceStatus> => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiClient.get(`/admin/services/${serviceId}`);
      // return response.data;
      
      // For now, return mock data
      const service = mockSystemHealth.services.find(s => s.id === serviceId);
      if (!service) {
        throw new Error(`Service with ID ${serviceId} not found`);
      }
      return service;
    } catch (error) {
      console.error(`Error fetching service status for ${serviceId}:`, error);
      throw error;
    }
  },
  
  testEndpoint: async (endpoint: string): Promise<{ success: boolean; responseTime: number; message?: string }> => {
    try {
      // In a real implementation, this would call the API
      // const startTime = Date.now();
      // const response = await apiClient.get(`/admin/test-endpoint?url=${encodeURIComponent(endpoint)}`);
      // const responseTime = Date.now() - startTime;
      // return { ...response.data, responseTime };
      
      // For now, simulate endpoint testing
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = Math.random() > 0.2;
      return {
        success,
        responseTime: Math.floor(Math.random() * 300) + 20,
        message: success ? 'Endpoint is reachable' : 'Connection timed out'
      };
    } catch (error) {
      console.error(`Error testing endpoint ${endpoint}:`, error);
      return {
        success: false,
        responseTime: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  
  getLogs: async (filter?: { level?: string; source?: string; limit?: number }): Promise<LogEntry[]> => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiClient.get('/admin/logs', { params: filter });
      // return response.data;
      
      // For now, return mock data
      let filteredLogs = [...mockLogs];
      
      if (filter?.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      
      if (filter?.source) {
        filteredLogs = filteredLogs.filter(log => log.source === filter.source);
      }
      
      const limit = filter?.limit || filteredLogs.length;
      return filteredLogs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },
  
  restartService: async (serviceId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // In a real implementation, this would call the API
      // const response = await apiClient.post(`/admin/services/${serviceId}/restart`);
      // return response.data;
      
      // For now, simulate service restart
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: true,
        message: `Service ${serviceId} restarted successfully`
      };
    } catch (error) {
      console.error(`Error restarting service ${serviceId}:`, error);
      return {
        success: false,
        message: `Failed to restart service: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};
