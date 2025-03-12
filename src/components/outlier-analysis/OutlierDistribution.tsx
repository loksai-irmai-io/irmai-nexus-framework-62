
import React, { useState } from 'react';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import { mockActivityDistribution, mockResourceDistribution } from './mockData';
import type { ChartData } from '../dashboard/Chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface OutlierDistributionProps {
  type: 'activity' | 'resource';
  height?: number;
}

const OutlierDistribution: React.FC<OutlierDistributionProps> = ({ type, height = 250 }) => {
  const distributionData = type === 'activity' ? mockActivityDistribution : mockResourceDistribution;
  const [hoveredItem, setHoveredItem] = useState<ChartData | null>(null);
  
  // Convert the mock data to the format expected by the Chart component
  const chartData: ChartData[] = distributionData.map(item => ({
    name: item.name,
    value: item.value,
    deviation: item.deviation
  }));

  const series: ChartDataSeries[] = [
    {
      name: 'Frequency',
      color: '#3b82f6', // Blue
      dataKey: 'value'
    },
    {
      name: 'Deviation %',
      color: '#ef4444', // Red
      dataKey: 'deviation'
    }
  ];

  const handleDataClick = (data: any) => {
    console.log(`${type} distribution data clicked:`, data);
  };

  const handleDataHover = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const item = data.activePayload[0].payload;
      setHoveredItem(item);
    } else {
      setHoveredItem(null);
    }
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {type === 'activity' ? 'Activity Distribution' : 'Resource Distribution'}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  {type === 'activity' 
                    ? 'Visualizes event frequencies across different activities. Hover over bars to see detailed statistics.' 
                    : 'Analysis of workload and resource usage trends. Hover over bars to see detailed statistics.'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex-1 h-[220px]">
          <Chart
            title=""
            description=""
            type="bar"
            data={chartData}
            series={series}
            xAxisKey="name"
            height={220}
            showLegend={true}
            onClick={handleDataClick}
            onMouseMove={handleDataHover}
            onMouseLeave={() => setHoveredItem(null)}
            tooltip={`This chart shows the distribution of events and their deviation percentages across ${type === 'activity' ? 'different activities' : 'resource types'}. Click on any bar for more details.`}
          />
        </div>
        
        {hoveredItem && (
          <div className="mt-2 p-2 border border-border rounded-md bg-muted/30 text-sm animate-fade-in">
            <p className="font-medium">{hoveredItem.name}</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-muted-foreground">Occurrences:</span> {hoveredItem.value}
              </div>
              <div>
                <span className="text-muted-foreground">Deviation:</span> {hoveredItem.deviation}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutlierDistribution;
