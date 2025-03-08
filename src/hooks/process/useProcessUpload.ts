
import { useMutation } from '@tanstack/react-query';
import { uploadEventLog } from '@/api/services/processService';
import { toast } from 'sonner';

export const useProcessUpload = () => {
  return useMutation({
    mutationFn: uploadEventLog,
    onSuccess: (data) => {
      toast.success(data.message || 'Event log uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload event log');
    },
  });
};
