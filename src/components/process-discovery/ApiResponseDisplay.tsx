
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check, AlertTriangle } from 'lucide-react';
import { EventLogResponse } from '@/services/processService';

interface ApiResponseDisplayProps {
  response: EventLogResponse | null;
  isLoading: boolean;
}

const ApiResponseDisplay: React.FC<ApiResponseDisplayProps> = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <Alert className="bg-blue-50 border-blue-300 text-blue-700 mb-4 animate-pulse">
        <AlertTitle className="flex items-center">
          <span className="mr-2 animate-spin h-4 w-4 rounded-full border-2 border-blue-500 border-r-transparent"></span>
          Processing Event Log
        </AlertTitle>
        <AlertDescription>
          Please wait while we process your event log...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!response) return null;
  
  const isSuccess = response.status_code === 'success';
  
  return (
    <Alert 
      className={`${isSuccess ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'} mb-4`}
    >
      <AlertTitle className="flex items-center">
        {isSuccess ? (
          <Check className="h-4 w-4 mr-2 text-green-500" />
        ) : (
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
        )}
        {isSuccess ? 'Success' : 'Error'}
      </AlertTitle>
      <AlertDescription>
        {response.message}
      </AlertDescription>
    </Alert>
  );
};

export default ApiResponseDisplay;
