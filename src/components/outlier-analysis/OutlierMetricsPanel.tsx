
import React from 'react';
import { AlertTriangle, Clock, Share2, Activity } from 'lucide-react';
import CompactMetric from '../dashboard/CompactMetric';

interface OutlierMetricsPanelProps {
  onCardClick: (category: string) => void;
}

const OutlierMetricsPanel: React.FC<OutlierMetricsPanelProps> = ({ onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CompactMetric
        label="Total Outliers Detected"
        value="42"
        icon="activity"
        trend={{ direction: 'up', value: 15 }}
        variant="default"
        tooltip="Click to view detailed outlier events"
        onClick={() => onCardClick('all')}
        className="hover:shadow-md transition-shadow hover:border-blue-300"
      />
      
      <CompactMetric
        label="Sequence Violations"
        value="18"
        icon="chart-line"
        trend={{ direction: 'up', value: 12 }}
        variant="default"
        tooltip="Click to view detailed sequence violation events"
        onClick={() => onCardClick('sequence')}
        className="hover:shadow-md transition-shadow hover:border-orange-300"
      />
      
      <CompactMetric
        label="Time-based Outliers"
        value="15"
        icon="chart-line"
        trend={{ direction: 'down', value: 8 }}
        variant="default"
        tooltip="Click to view detailed time-based outlier events"
        onClick={() => onCardClick('time')}
        className="hover:shadow-md transition-shadow hover:border-blue-300"
      />
      
      <CompactMetric
        label="Resource Imbalances"
        value="9"
        icon="chart-bar"
        trend={{ direction: 'neutral', value: 0 }}
        variant="default"
        tooltip="Click to view detailed resource imbalance events"
        onClick={() => onCardClick('resource')}
        className="hover:shadow-md transition-shadow hover:border-purple-300"
      />
    </div>
  );
};

export default OutlierMetricsPanel;
