
import { api } from '../apiClient';
import { ProcessData, InsightItem, EventLog } from '@/components/process-discovery/types';

// Get process map data
export const getProcessMap = () =>
  api.get<ProcessData>('/processes/map');

// Get process insights
export const getProcessInsights = () =>
  api.get<InsightItem[]>('/processes/insights');

// Get event logs
export const getEventLogs = () =>
  api.get<EventLog[]>('/processes/logs');

// Upload event log file
export const uploadEventLog = (file: File) => {
  const formData = new FormData();
  formData.append('eventLog', file);
  
  return api.upload<{ success: boolean; message: string }>('/processes/upload', formData);
};

// Validate insight
export const validateInsight = (insightId: number) =>
  api.put<InsightItem>(`/processes/insights/${insightId}/validate`, {});
