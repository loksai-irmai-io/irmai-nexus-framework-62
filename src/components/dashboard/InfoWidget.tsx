import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Chart from './Chart';
import WidgetMetric from './WidgetMetric';

export interface InfoWidgetMetric {
  label: string;
  value: string;
  icon: string;
  tooltip?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
}

export interface InfoWidgetData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  metrics: InfoWidgetMetric[];
  insights: string[];
  chartData: any[];
  chartSeries: { name: string; dataKey: string; color: string; type?: 'line' | 'bar' | 'area' }[];
  chartType: 'line' | 'bar' | 'pie' | 'composed';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <Skeleton className="h-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer w-full h-full flex flex-col" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex flex-col h-full">
          {/* Title and Badge Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1.5">
              <div className="flex items-center">
                <span className="flex-shrink-0">{data.icon}</span>
                <h3 className="text-base font-medium ml-2">
                  {data.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                {data.subtitle}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`font-normal ${getStatusColor(data.status)}`}
            >
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </Badge>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {data.metrics.map((metric, index) => (
              <WidgetMetric
                key={`${data.id}-metric-${index}`}
                label={metric.label}
                value={metric.value}
                iconName={metric.icon}
                tooltip={metric.tooltip}
                trend={metric.trend}
              />
            ))}
          </div>

          {/* Chart Section with fixed height and proper containment */}
          {data.chartData.length > 0 && (
            <div className="flex-1 min-h-0 w-full">
              <div className="h-full w-full" style={{ minHeight: '180px', maxHeight: '200px' }}>
                <Chart
                  title=""
                  type={data.chartType}
                  data={data.chartData}
                  series={data.chartSeries}
                  xAxisKey="name"
                  height={data.chartHeight || "100%"}
                  showLegend={false}
                />
              </div>
            </div>
          )}

          {/* Insights Section */}
          {data.insights.length > 0 && (
            <div className="space-y-1 mt-3">
              {data.insights.map((insight, index) => (
                <p 
                  key={`${data.id}-insight-${index}`}
                  className="text-sm text-muted-foreground"
                >
                  {insight}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoWidget;
