
import { api } from '../apiClient';
import { ChartData } from '@/components/dashboard/Chart';
import { OutlierEvent } from '@/components/outlier-analysis/types';

export interface OutlierDistributionResponse {
  activityDistribution: {
    name: string;
    value: number;
    deviation: number;
  }[];
  resourceDistribution: {
    name: string;
    value: number;
    deviation: number;
  }[];
}

// Get outlier distribution data
export const getOutlierDistribution = () =>
  api.get<OutlierDistributionResponse>('/outliers/distribution');

// Get outlier events
export const getOutlierEvents = () =>
  api.get<OutlierEvent[]>('/outliers/events');

// Get detailed information for a specific outlier
export const getOutlierDetails = (id: string) =>
  api.get<OutlierEvent>(`/outliers/${id}`);

// Update outlier status
export const updateOutlierStatus = (id: string, status: string) =>
  api.put<OutlierEvent>(`/outliers/${id}/status`, { status });
