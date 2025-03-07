
import React, { useState } from 'react';
import Chart, { ChartDataSeries } from '@/components/dashboard/Chart';
import { OutlierTimelineData, OutlierTimeframe } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertTriangle, Calendar, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Enhanced mock data for the timeline with more variance and patterns
const getTimelineData = (timeframe: OutlierTimeframe): OutlierTimelineData[] => {
  // Generate different data based on the timeframe
  const count = timeframe === 'day' ? 24 : timeframe === 'week' ? 7 : 30;
  
  // Create some patterns in the data
  const patternStart = Math.floor(count / 3);
  const patternEnd = Math.floor((count / 3) * 2);
  
  return Array.from({ length: count }).map((_, i) => {
    // Create a spike in anomalies during certain periods
    let multiplier = 1;
    if (i >= patternStart && i <= patternEnd) {
      multiplier = 1.75; // Midday or midweek spike
    }
    if (i === Math.floor(count / 2)) {
      multiplier = 2.5; // Major spike in the middle
    }
    
    const baseCount = Math.floor(Math.random() * 10 * multiplier) + 2;
    const criticalCount = Math.floor(Math.random() * 3 * (i === Math.floor(count / 2) ? 3 : 1));
    const highCount = Math.floor(Math.random() * 5 * multiplier);
    const mediumCount = Math.floor(Math.random() * 7 * multiplier);
    const lowCount = baseCount - criticalCount - highCount - mediumCount > 0 ? 
      baseCount - criticalCount - highCount - mediumCount : 1;
    
    let date;
    if (timeframe === 'day') {
      date = `${i}:00`;
    } else if (timeframe === 'week') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      date = days[i % 7];
    } else {
      date = `Day ${i + 1}`;
    }

    // Add some metadata for tooltips
    const processes = ['Loan Application', 'Customer Onboarding', 'Claims Processing', 'Payment Verification'];
    const topProcess = processes[Math.floor(Math.random() * processes.length)];
    const percentChange = Math.floor(Math.random() * 40) - 10; // Between -10% and +30%
    
    return {
      date,
      count: baseCount,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      topProcess,
      percentChange,
      hasAlert: i === Math.floor(count / 2) || criticalCount >= 2
    };
  });
};

interface OutlierTimelineProps {
  onDrillDown: (categoryId: string, count: number) => void;
  timeframe: OutlierTimeframe;
}

const OutlierTimeline: React.FC<OutlierTimelineProps> = ({ onDrillDown, timeframe }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewType, setViewType] = useState<'area' | 'bar'>('area');
  const { toast } = useToast();
  
  // Generate timeline data based on the current timeframe
  const timelineData = getTimelineData(timeframe);
  
  // Calculate total anomalies by severity
  const totals = {
    total: timelineData.reduce((sum, day) => sum + day.count, 0),
    critical: timelineData.reduce((sum, day) => sum + day.critical, 0),
    high: timelineData.reduce((sum, day) => sum + day.high, 0),
    medium: timelineData.reduce((sum, day) => sum + day.medium, 0),
    low: timelineData.reduce((sum, day) => sum + day.low, 0)
  };
  
  // Define the chart series with better colors
  const series: ChartDataSeries[] = [
    { name: 'Critical', dataKey: 'critical', color: '#ef4444' }, // Red for critical
    { name: 'High', dataKey: 'high', color: '#f97316' }, // Orange for high
    { name: 'Medium', dataKey: 'medium', color: '#eab308' }, // Yellow for medium
    { name: 'Low', dataKey: 'low', color: '#22c55e' }, // Green for low
  ];

  // Handle chart click
  const handleChartClick = (data: any) => {
    if (data && data.date) {
      toast({
        title: `Analyzing ${data.date} anomalies`,
        description: `Loading ${data.count} anomalies with ${data.critical} critical events`,
      });
      onDrillDown('time_outlier', data.count || 0);
    }
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 border">
          <p className="font-medium mb-1">{label}</p>
          <div className="space-y-1 text-sm">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex justify-between gap-3">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
            <div className="pt-1 mt-1 border-t">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{data.count}</span>
              </div>
              {data.topProcess && (
                <div className="flex justify-between text-xs mt-1">
                  <span>Top Process:</span>
                  <span>{data.topProcess}</span>
                </div>
              )}
              {data.percentChange && (
                <div className={`flex justify-between text-xs mt-1 ${data.percentChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  <span>Change:</span>
                  <span className="flex items-center">
                    {data.percentChange > 0 ? '+' : ''}{data.percentChange}%
                    {data.percentChange > 0 ? <TrendingUp className="h-3 w-3 ml-1" /> : null}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
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
          <div className="flex gap-2">
            <Select value={viewType} onValueChange={(value: 'area' | 'bar') => setViewType(value)}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center h-8"
              onClick={() => toast({
                title: "Generating anomaly report",
                description: `Creating a detailed report for ${timeframe} period with ${totals.total} anomalies`,
              })}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Generate Report
            </Button>
          </div>
        </div>
        <CardDescription className="flex justify-between">
          <span>Outlier events across your processes by {timeframe}</span>
          <div className="text-xs text-right">
            <div className="font-medium">
              {totals.total} anomalies
            </div>
            <div className="text-xs">
              <span className="text-red-500 font-medium">{totals.critical} critical</span>
              {' • '}
              <span className="text-orange-500">{totals.high} high</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Alert for spike periods */}
        {timelineData.some(data => data.hasAlert) && (
          <div className="mb-4 p-2 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Significant anomaly spike detected in this period. <Button variant="link" className="h-auto p-0 text-red-600 dark:text-red-400">View detailed analysis</Button></span>
          </div>
        )}
      
        <Chart
          title="Anomaly Timeline"
          type={viewType === 'area' ? 'composed' : 'bar'}
          data={timelineData}
          series={series}
          xAxisKey="date"
          height={300}
          showLegend={true}
          onClick={handleChartClick}
          tooltip={<CustomTooltip />}
          className="hover:cursor-pointer"
        />
        
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <div>Click on any point to analyze detailed outlier events for that time period</div>
          <Button variant="ghost" size="sm" className="h-6">
            <Filter className="h-3 w-3 mr-1" />
            Advanced Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierTimeline;
