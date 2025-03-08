
import apiClient from './apiClient';
import { toast } from 'sonner';

// Upload event log file
export const uploadEventLog = async (file: File): Promise<boolean> => {
  try {
    const validFileTypes = ['text/csv', 'text/xml', 'application/xml', 'text/plain'];
    const fileType = file.type;
    
    if (!validFileTypes.includes(fileType) && !file.name.endsWith('.xes')) {
      toast.error("Invalid file type. Please upload a CSV, XES, or XML file.");
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 10MB.");
      return false;
    }
    
    const formData = new FormData();
    formData.append('eventLog', file);
    
    // Send to backend
    const response = await apiClient.post('/process/upload-event-log', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success(`Event log "${file.name}" uploaded successfully!`);
    console.log("Response from backend:", response.data);
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};

// Fetch process details
export const fetchProcessDetails = async (processId: string) => {
  const response = await apiClient.get(`/process/${processId}`);
  return response.data;
};
