
import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  DownloadCloud,
  Calendar,
  Users,
  Filter 
} from 'lucide-react';

interface ProcessControlsProps {
  showFrequency: boolean;
  showDuration: boolean;
  viewType: 'default' | 'heatmap';
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFrequency: () => void;
  onToggleDuration: () => void;
  onToggleViewType: () => void;
}

const ProcessControls: React.FC<ProcessControlsProps> = ({
  showFrequency,
  showDuration,
  viewType,
  onZoomIn,
  onZoomOut,
  onToggleFrequency,
  onToggleDuration,
  onToggleViewType,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 bg-card/90 backdrop-blur-sm border rounded-lg shadow-sm p-2 flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={onZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={onZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Zoom Out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={showFrequency ? "default" : "ghost"}
              onClick={onToggleFrequency}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">{showFrequency ? "Hide" : "Show"} Frequency</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={showDuration ? "default" : "ghost"}
              onClick={onToggleDuration}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">{showDuration ? "Hide" : "Show"} Duration</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant={viewType === 'heatmap' ? "default" : "ghost"}
              onClick={onToggleViewType}
            >
              <Users className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Toggle Heatmap View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="border-t my-1"></div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Refresh Process Map</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <DownloadCloud className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Export Process Map</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProcessControls;
