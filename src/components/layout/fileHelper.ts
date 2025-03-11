
import { processService, EventLogResponse } from '@/services/processService';
import { toast } from 'sonner';

export const handleFileUpload = async (file: File): Promise<EventLogResponse> => {
  try {
    const response = await processService.uploadEventLog(file);
    
    if (response.status === 'success') {
      toast.success(response.msg);
    } else {
      toast.error(response.msg);
    }
    
    return response;
  } catch (error) {
    console.error('Error handling file upload:', error);
    const errorResponse: EventLogResponse = {
      status: 'failure',
      msg: 'Failed to upload and process the file. Please try again.'
    };
    toast.error(errorResponse.msg);
    return errorResponse;
  }
};
