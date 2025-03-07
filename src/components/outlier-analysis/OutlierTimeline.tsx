
import React, { useState } from 'react';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import { mockTimelineData } from './mockData';
import type { ChartData } from '../dashboard/Chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface OutlierTimelineProps {
  height?: number;
}

const OutlierTimeline: React.FC<OutlierTimelineProps> = ({ height = 300 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartData | null>(null);
  
  // Convert the mock data to the format expected by the Chart component
  const chartData: ChartData[] = mockTimelineData.map(item => ({
    name: item.date,
    count: item.count,
    sequenceViolations: item.sequenceViolations,
    timeOutliers: item.timeOutliers,
    resourceImbalances: item.resourceImbalances
  }));

  const series: ChartDataSeries[] = [
    {
      name: 'Sequence Violations',
      color: '#f97316', // Orange
      dataKey: 'sequenceViolations'
    },
    {
      name: 'Time Outliers',
      color: '#3b82f6', // Blue
      dataKey: 'timeOutliers'
    },
    {
      name: 'Resource Imbalances',
      color: '#8b5cf6', // Purple
      dataKey: 'resourceImbalances'
    }
  ];

  const handleDataClick = (data: any) => {
    console.log('Timeline data clicked:', data);
  };

  const handleDataHover = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const item = data.activePayload[0].payload;
      setHoveredPoint(item);
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Anomaly Timeline
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This chart displays the distribution of different types of anomalies over time. Hover over any point to see detailed statistics.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          title=""
          description="Distribution of outlier events over time"
          type="composed"
          data={chartData}
          series={series}
          xAxisKey="name"
          height={height}
          showLegend={true}
          onClick={handleDataClick}
          onMouseMove={handleDataHover}
          onMouseLeave={() => setHoveredPoint(null)}
          tooltip="This chart displays the distribution of different types of anomalies over time. Click on any point to explore details."
        />
        
        {hoveredPoint && (
          <div className="mt-2 p-2 border border-border rounded-md bg-muted/30 text-sm animate-fade-in">
            <p className="font-medium">{hoveredPoint.name}</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <span className="text-orange-500">Sequence:</span> {hoveredPoint.sequenceViolations}
              </div>
              <div>
                <span className="text-blue-500">Time:</span> {hoveredPoint.timeOutliers}
              </div>
              <div>
                <span className="text-purple-500">Resource:</span> {hoveredPoint.resourceImbalances}
              </div>
            </div>
            <div className="mt-1">
              <span className="text-muted-foreground">Total:</span> {hoveredPoint.count}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutlierTimeline;
