
import React, { useState } from 'react';
import Chart, { ChartDataSeries } from '@/components/dashboard/Chart';
import { OutlierTimelineData, OutlierTimeframe } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for the timeline
const getTimelineData = (timeframe: OutlierTimeframe): OutlierTimelineData[] => {
  // Generate different data based on the timeframe
  const count = timeframe === 'day' ? 24 : timeframe === 'week' ? 7 : 30;
  
  return Array.from({ length: count }).map((_, i) => {
    const baseCount = Math.floor(Math.random() * 15) + 2;
    const criticalCount = Math.floor(Math.random() * 3);
    const highCount = Math.floor(Math.random() * 5);
    const mediumCount = Math.floor(Math.random() * 7);
    const lowCount = baseCount - criticalCount - highCount - mediumCount;
    
    let date;
    if (timeframe === 'day') {
      date = `${i}:00`;
    } else if (timeframe === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      date = days[i % 7];
    } else {
      date = `Day ${i + 1}`;
    }

    return {
      date,
      count: baseCount,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount > 0 ? lowCount : 0
    };
  });
};

interface OutlierTimelineProps {
  onDrillDown: (categoryId: string, count: number) => void;
  timeframe: OutlierTimeframe;
}

const OutlierTimeline: React.FC<OutlierTimelineProps> = ({ onDrillDown, timeframe }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Generate timeline data based on the current timeframe
  const timelineData = getTimelineData(timeframe);
  
  // Define the chart series
  const series: ChartDataSeries[] = [
    { name: 'Critical', dataKey: 'critical', color: '#FF4D4F' }, // Red for critical
    { name: 'High', dataKey: 'high', color: '#FF7A45' }, // Orange for high
    { name: 'Medium', dataKey: 'medium', color: '#FFC53D' }, // Yellow for medium
    { name: 'Low', dataKey: 'low', color: '#52C41A' }, // Green for low
  ];

  // Handle chart click
  const handleChartClick = (data: any) => {
    if (data && data.date) {
      onDrillDown('time_outlier', data.count || 0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Anomaly Timeline</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Shows anomalies detected over time. Click on any point for details.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm text-right text-muted-foreground">
            <div className="font-medium">
              {timelineData.reduce((sum, day) => sum + day.count, 0)} anomalies
            </div>
            <div className="text-xs">
              <span className="text-red-500 font-medium">{timelineData.reduce((sum, day) => sum + day.critical, 0)} critical</span>
            </div>
          </div>
        </div>
        <CardDescription>
          Outlier events across your processes by {timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          title="Anomaly Timeline" // Added the required title property
          type="composed"
          data={timelineData}
          series={series}
          xAxisKey="date"
          height={300}
          showLegend={true}
          onClick={handleChartClick}
          tooltip="Click on any point to view detailed outlier events for that time period"
        />
      </CardContent>
    </Card>
  );
};

export default OutlierTimeline;
