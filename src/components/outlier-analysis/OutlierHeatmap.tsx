
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ZoomIn } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutlierHeatmapProps {
  onDrillDown: (categoryId: string, count: number) => void;
}

const OutlierHeatmap: React.FC<OutlierHeatmapProps> = ({ onDrillDown }) => {
  // In a real implementation, this would render a heatmap visualization
  // For this example, we'll create a simplified grid representation
  
  const handleNodeClick = (nodeId: string, anomalyCount: number) => {
    onDrillDown('process', anomalyCount);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Process Anomaly Heatmap</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Visual representation of where anomalies are occurring in your processes. Brighter areas indicate higher anomaly concentration.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>
          Identifies hotspots and patterns in your process anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          {/* This would normally be a proper heatmap visualization */}
          {/* For now, we'll create a simplified representation */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 gap-1 p-3">
            {Array.from({ length: 20 }).map((_, i) => {
              const intensity = Math.random();
              const anomalyCount = Math.floor(intensity * 20);
              const bgColor = intensity > 0.7 
                ? 'bg-red-500/80' 
                : intensity > 0.4 
                  ? 'bg-orange-400/70' 
                  : intensity > 0.2 
                    ? 'bg-yellow-300/60' 
                    : 'bg-green-300/50';
              
              return (
                <div 
                  key={i}
                  className={`rounded-md ${bgColor} flex items-center justify-center cursor-pointer transition-all hover:scale-105`}
                  onClick={() => handleNodeClick(`node-${i}`, anomalyCount)}
                >
                  <span className="text-xs font-medium text-white">
                    {anomalyCount}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="absolute bottom-3 right-3">
            <Button size="sm" variant="secondary" className="opacity-90">
              <ZoomIn className="h-4 w-4 mr-1" />
              <span>Expand</span>
            </Button>
          </div>
          
          <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-700 rounded p-2 opacity-90 text-xs">
            <div className="flex items-center space-x-2">
              <span className="block w-3 h-3 bg-red-500 rounded-sm"></span>
              <span>High Anomaly (15-20)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-orange-400 rounded-sm"></span>
              <span>Medium Anomaly (8-14)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-yellow-300 rounded-sm"></span>
              <span>Low Anomaly (4-7)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-green-300 rounded-sm"></span>
              <span>Normal (0-3)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierHeatmap;
