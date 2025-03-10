
import { api } from './apiClient';

export interface EventLogResponse {
  status: 'success' | 'failure';
  msg: string;
  bpmn?: any;  // Will contain the BPMN graph data
}

export const uploadEventLog = async (file: File): Promise<EventLogResponse> => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Make the API call to the backend
    const response = await fetch('http://localhost:8000/api/upload-event-log', {
      method: 'POST',
      body: formData,
    });
    
    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading event log:', error);
    return {
      status: 'failure',
      msg: 'Failed to upload event log. Please try again.'
    };
  }
};

export const getFxTradeData = async (): Promise<EventLogResponse> => {
  try {
    // Make the API call to the backend
    const response = await fetch('http://localhost:8000/api/fx-trade-data');
    
    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching FX trade data:', error);
    return {
      status: 'failure',
      msg: 'Failed to fetch FX trade data. Please try again.'
    };
  }
};
