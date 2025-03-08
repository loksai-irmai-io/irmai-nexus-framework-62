
import { useQuery } from '@tanstack/react-query';
import { getOutlierDistribution } from '@/api/services/outlierService';

export const useOutlierDistribution = (type: 'activity' | 'resource') => {
  return useQuery({
    queryKey: ['outlierDistribution', type],
    queryFn: async () => {
      const data = await getOutlierDistribution();
      return type === 'activity' ? data.activityDistribution : data.resourceDistribution;
    },
  });
};
