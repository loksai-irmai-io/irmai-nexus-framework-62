
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, SystemHealth, LogEntry, ServiceStatus } from '@/services/adminService';
import { toast } from 'sonner';

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: adminService.getSystemHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

export const useServiceStatus = (serviceId: string) => {
  return useQuery({
    queryKey: ['serviceStatus', serviceId],
    queryFn: () => adminService.getServiceStatus(serviceId),
    enabled: !!serviceId,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useTestEndpoint = () => {
  return useMutation({
    mutationFn: adminService.testEndpoint,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Test successful - ${data.responseTime}ms`);
      } else {
        toast.error(`Test failed: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error(`Error testing endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};

export const useSystemLogs = (filter?: { level?: string; source?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['systemLogs', filter],
    queryFn: () => adminService.getLogs(filter),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useRestartService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminService.restartService,
    onSuccess: (data, serviceId) => {
      if (data.success) {
        toast.success(data.message);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['systemHealth'] });
        queryClient.invalidateQueries({ queryKey: ['serviceStatus', serviceId] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(`Error restarting service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
