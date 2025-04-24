
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload } from 'lucide-react';
import { toast } from "sonner";
import { EventLogResponse } from '@/services/processService';

interface ProcessDiscoveryHeaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isLoading: boolean;
  apiResponse: EventLogResponse | null;
}

const ProcessDiscoveryHeader: React.FC<ProcessDiscoveryHeaderProps> = ({
  onFileChange,
  isLoading,
  apiResponse
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Process Discovery</h1>
        <p className="text-muted-foreground">
          Visualize your end-to-end processes with AI insights
        </p>
      </div>
      
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.xes,.xml,text/csv,application/xml,text/xml,text/plain"
          onChange={onFileChange}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={triggerFileUpload}
                variant={isLoading ? "outline" : apiResponse?.status_code === "success" ? "success" : apiResponse?.status_code === "failed" ? "error" : "default"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin h-4 w-4 rounded-full border-2 border-current border-r-transparent mr-2"></span>
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Event Log
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isLoading 
                ? "Processing your event log..." 
                : apiResponse 
                  ? apiResponse.message 
                  : "Upload your event log to start process mining"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProcessDiscoveryHeader;
