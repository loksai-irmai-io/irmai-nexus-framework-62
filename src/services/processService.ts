
import { api } from './apiClient';
import { ProcessData } from '@/components/process-discovery/types';

export interface EventLogResponse {
  status: 'success' | 'failure';
  msg: string;
  bpmn?: ProcessData;
}

const BACKEND_URL = 'http://localhost:8000';

export const processService = {
  uploadEventLog: async (file: File): Promise<EventLogResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${BACKEND_URL}/upload-event-log/`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading event log:', error);
      return {
        status: 'failure',
        msg: 'Failed to connect to the server. Please try again later.'
      };
    }
  },
  
  getFxTradeExample: async (): Promise<EventLogResponse> => {
    try {
      const response = await fetch(`${BACKEND_URL}/fx-trade-example/`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching FX trade example:', error);
      return {
        status: 'failure',
        msg: 'Failed to connect to the server. Please try again later.'
      };
    }
  }
};
