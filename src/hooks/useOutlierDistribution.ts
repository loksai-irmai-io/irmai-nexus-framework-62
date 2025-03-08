
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchOutlierDistribution, logOutlierClick, OutlierDistributionResponse } from '../services/outlierService';

export const useOutlierDistribution = (type: 'activity' | 'resource') => {
  const query = useQuery({
    queryKey: ['outlier-distribution', type],
    queryFn: () => fetchOutlierDistribution(type),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  const logClickMutation = useMutation({
    mutationFn: logOutlierClick,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    logClick: logClickMutation.mutate,
  };
};
