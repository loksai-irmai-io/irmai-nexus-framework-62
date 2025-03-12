
import { processService, EventLogResponse } from '@/services/processService';
import { toast } from 'sonner';

export const processFileUpload = async (file: File): Promise<EventLogResponse> => {
  try {
    const response = await processService.uploadEventLog(file);
    
    if (response.status_code === 'success') {
      toast.success(response.message);
      
      // The event dispatch is now handled in the processService
      // Both processDataUpdated and digitalTwinActivated events are triggered there
    } else {
      toast.error(response.message);
    }
    
    return response;
  } catch (error) {
    console.error('Error handling file upload:', error);
    const errorResponse: EventLogResponse = {
      status_code: 'failed',
      message: 'Failed uploading file: Could not connect to the server. Please try again later.'
    };
    toast.error(errorResponse.message);
    return errorResponse;
  }
};
