
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Chart from './Chart';
import { Badge } from '@/components/ui/badge';
import WidgetMetric from './WidgetMetric';
import { Skeleton } from '@/components/ui/skeleton';

export interface InfoWidgetData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  metrics: Array<{
    label: string;
    value: string;
    icon: string;
    tooltip?: string;
    trend?: {
      direction: 'up' | 'down' | 'neutral';
      value: number;
    };
  }>;
  insights: string[];
  chartData: any[];
  chartSeries: Array<{
    name: string;
    dataKey: string;
    color: string;
  }>;
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'composed';
  xAxisKey?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  actionText: string;
  actionHref: string;
  chartHeight?: number;
}

interface InfoWidgetProps {
  data: InfoWidgetData;
  onClick?: () => void;
  isLoading?: boolean;
}

const InfoWidget: React.FC<InfoWidgetProps> = ({ data, onClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-[180px] w-full rounded" />
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <Skeleton className="h-9 w-full rounded" />
        </CardFooter>
      </Card>
    );
  }

  const hasChartData = data.chartData && data.chartData.length > 0 && data.chartSeries && data.chartSeries.length > 0;
  const chartProps = hasChartData ? {
    data: data.chartData,
    series: data.chartSeries,
    type: data.chartType,
    xAxisKey: data.xAxisKey || 'name',
    height: data.chartHeight || 200,
    showGrid: false,
    showLegend: false
  } : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800';
      case 'warning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'error': return 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-800';
      case 'info': 
      default: return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800';
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.icon}
            <h3 className="font-medium">{data.title}</h3>
          </div>
          <Badge variant="outline" className={cn("text-xs font-normal", getStatusColor(data.status))}>
            {data.status === 'success' ? 'Healthy' : 
             data.status === 'warning' ? 'Attention' : 
             data.status === 'error' ? 'Critical' : 'Info'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{data.subtitle}</p>
      </CardHeader>
      
      <CardContent className="pb-2 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          {data.metrics.map((metric, idx) => (
            <WidgetMetric
              key={idx}
              label={metric.label}
              value={metric.value}
              iconName={metric.icon}
              tooltip={metric.tooltip}
              trend={metric.trend}
            />
          ))}
        </div>
        
        {hasChartData && chartProps && (
          <div className="mb-4">
            <Chart {...chartProps} />
          </div>
        )}
        
        {data.insights && data.insights.length > 0 && (
          <div className="space-y-1">
            {data.insights.map((insight, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">{insight}</p>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-between hover:bg-muted/50"
          onClick={onClick}
        >
          {data.actionText}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InfoWidget;
