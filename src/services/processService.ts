
import { apiClient } from './apiClient';
import { ProcessData, ApiResponse } from '@/components/process-discovery/types';

export const processService = {
  /**
   * Upload an event log file to the backend
   */
  uploadEventLog: async (file: File): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/upload-event-log', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading event log:', error);
      return {
        status: 'failure',
        message: error instanceof Error ? error.message : 'Unknown error occurred during upload'
      };
    }
  },

  /**
   * Get sample FX trade log data
   */
  getSampleFxData: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('http://localhost:8000/api/sample-fx-data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting sample FX data:', error);
      return {
        status: 'failure',
        message: error instanceof Error ? error.message : 'Unknown error occurred while fetching sample data'
      };
    }
  }
};
