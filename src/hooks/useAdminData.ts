
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { adminService, SystemHealth, LogEntry, ServiceStatus } from '@/services/adminService';
import { toast } from 'sonner';

// Query key factory for better type safety and consistency
export const adminKeys = {
  all: ['admin'] as const,
  health: () => [...adminKeys.all, 'health'] as const,
  logs: (filters?: Record<string, any>) => [...adminKeys.all, 'logs', filters] as const,
  service: (id: string) => [...adminKeys.all, 'service', id] as const,
};

// Enhanced hook for system health with automatic refresh and error handling
export const useSystemHealth = (autoRefresh = true) => {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: adminService.getSystemHealth,
    refetchInterval: autoRefresh ? 30000 : false, // Refetch every 30 seconds if enabled
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch system health: ${error.message || 'Unknown error'}`);
      },
    },
  });
};

// Enhanced hook for service status with automatic refresh and error handling
export const useServiceStatus = (serviceId: string, autoRefresh = true) => {
  return useQuery({
    queryKey: adminKeys.service(serviceId),
    queryFn: () => adminService.getServiceStatus(serviceId),
    enabled: Boolean(serviceId),
    refetchInterval: autoRefresh ? 15000 : false, // Refetch every 15 seconds if enabled
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch service status: ${error.message || 'Unknown error'}`);
      },
    },
  });
};

// Enhanced hook for endpoint testing with better error handling
export const useTestEndpoint = () => {
  return useMutation({
    mutationFn: adminService.testEndpoint,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Test successful - ${data.responseTime}ms`);
      } else {
        toast.error(`Test failed: ${data.message || 'Unknown error'}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Error testing endpoint: ${error.message || 'Unknown error'}`);
    }
  });
};

// Type definition for log filters
export interface LogFilter {
  level?: string;
  source?: string;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

// Enhanced hook for system logs with better filtering, caching, and error handling
export const useSystemLogs = (filter?: LogFilter) => {
  return useQuery({
    queryKey: adminKeys.logs(filter),
    queryFn: () => adminService.getLogs(filter),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch logs: ${error.message || 'Unknown error'}`);
      },
    },
  });
};

// Enhanced hook for service restart with optimistic updates and better error handling
export const useRestartService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminService.restartService,
    onMutate: async (serviceId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: adminKeys.service(serviceId) });
      await queryClient.cancelQueries({ queryKey: adminKeys.health() });
      
      // Save the previous value
      const previousServiceData = queryClient.getQueryData(adminKeys.service(serviceId));
      
      // Optimistically update the UI
      queryClient.setQueryData(adminKeys.service(serviceId), (old: ServiceStatus | undefined) => {
        if (!old) return undefined;
        return {
          ...old,
          status: 'unknown', // Set to unknown during restart
        };
      });
      
      // Return the previous data for rollback
      return { previousServiceData, serviceId };
    },
    onSuccess: (data, serviceId, context) => {
      if (data.success) {
        toast.success(data.message || `Service ${serviceId} restarted successfully`);
        // Invalidate and refetch to get the latest data
        queryClient.invalidateQueries({ queryKey: adminKeys.health() });
        queryClient.invalidateQueries({ queryKey: adminKeys.service(serviceId) });
      } else {
        // If the backend reports failure, revert optimistic update
        if (context?.previousServiceData) {
          queryClient.setQueryData(
            adminKeys.service(serviceId),
            context.previousServiceData
          );
        }
        toast.error(data.message || `Failed to restart service ${serviceId}`);
      }
    },
    onError: (error: Error, serviceId, context) => {
      // On error, revert the optimistic update
      if (context?.previousServiceData) {
        queryClient.setQueryData(
          adminKeys.service(serviceId),
          context.previousServiceData
        );
      }
      toast.error(`Error restarting service: ${error.message || 'Unknown error'}`);
    },
    onSettled: (_, __, serviceId) => {
      // Always refetch after error or success to ensure UI is in sync with server state
      queryClient.invalidateQueries({ queryKey: adminKeys.service(serviceId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.health() });
    }
  });
};

// Export a function to clear admin data from cache (useful for logout or reset)
export const clearAdminCache = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: adminKeys.all });
};
