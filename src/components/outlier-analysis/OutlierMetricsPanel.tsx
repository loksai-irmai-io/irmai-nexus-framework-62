
import React from 'react';
import { AlertTriangle, Clock, Share2, Activity } from 'lucide-react';
import CompactMetric from '../dashboard/CompactMetric';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OutlierMetricsPanelProps {
  onCardClick: (category: string) => void;
}

const OutlierMetricsPanel: React.FC<OutlierMetricsPanelProps> = ({ onCardClick }) => {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CompactMetric
                label="Total Outliers Detected"
                value="42"
                icon="activity"
                trend={{ direction: 'up', value: 15 }}
                variant="default"
                onClick={() => onCardClick('all')}
                className="hover:shadow-md transition-shadow hover:border-blue-300"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view detailed outlier events</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CompactMetric
                label="Sequence Violations"
                value="18"
                icon="chart-line"
                trend={{ direction: 'up', value: 12 }}
                variant="default"
                onClick={() => onCardClick('sequence')}
                className="hover:shadow-md transition-shadow hover:border-orange-300"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view detailed sequence violation events</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CompactMetric
                label="Time-based Outliers"
                value="15"
                icon="chart-line"
                trend={{ direction: 'down', value: 8 }}
                variant="default"
                onClick={() => onCardClick('time')}
                className="hover:shadow-md transition-shadow hover:border-blue-300"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view detailed time-based outlier events</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CompactMetric
                label="Resource Imbalances"
                value="9"
                icon="chart-bar"
                trend={{ direction: 'neutral', value: 0 }}
                variant="default"
                onClick={() => onCardClick('resource')}
                className="hover:shadow-md transition-shadow hover:border-purple-300"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view detailed resource imbalance events</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default OutlierMetricsPanel;
