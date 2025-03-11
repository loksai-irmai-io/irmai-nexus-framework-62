
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
      
      const response = await fetch(`${BACKEND_URL}/app/process-discovery/upload-event`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading event log:', error);
      return {
        status: 'failure',
        msg: 'Failed uploading file: Could not connect to the server. Please try again later.'
      };
    }
  },
  
  getExampleData: async (): Promise<EventLogResponse> => {
    try {
      // No file uploaded means we get example data
      const response = await fetch(`${BACKEND_URL}/app/process-discovery/upload-event`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching example data:', error);
      return {
        status: 'failure',
        msg: 'Failed to connect to the server. Please try again later.'
      };
    }
  }
};
