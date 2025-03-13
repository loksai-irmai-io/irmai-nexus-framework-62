
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chart from '@/components/dashboard/Chart';
import { ChevronRight, ExternalLink, TrendingUp, TrendingDown, Info, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CompactMetric from '@/components/dashboard/CompactMetric';

type MetricType = {
  label: string;
  value: string;
  tooltip?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
  icon?: string;
  drilldownHint?: string;
};

interface InfoWidgetProps {
  data: {
    id: string;
    title: string;
    subtitle: string;
    metrics: MetricType[];
    insights: string[];
    chartData: any[];
    chartSeries: {
      name: string;
      dataKey: string;
      color: string;
    }[];
    chartType: 'pie' | 'bar' | 'line' | 'composed';
    status: 'success' | 'warning' | 'error' | 'info';
    actionText: string;
    actionHref: string;
    icon: React.ReactNode;
  };
  onMetricClick?: (label: string) => void;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({ data, onMetricClick }) => {
  const statusColors = {
    success: 'border-green-500',
    warning: 'border-amber-500',
    error: 'border-red-500',
    info: 'border-blue-500',
  };
  
  const statusBg = {
    success: 'bg-green-50',
    warning: 'bg-amber-50',
    error: 'bg-red-50',
    info: 'bg-blue-50',
  };
  
  return (
    <Card className={`overflow-hidden ${statusColors[data.status]}`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${statusBg[data.status]}`}>
        <div className="flex items-center">
          <div className="mr-2">
            {data.icon}
          </div>
          <div>
            <h3 className="font-semibold text-base">{data.title}</h3>
            <p className="text-xs text-muted-foreground">{data.subtitle}</p>
          </div>
        </div>
        
        {data.chartType === 'line' && (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {data.metrics.map((metric, index) => (
            <CompactMetric 
              key={index}
              label={metric.label}
              value={metric.value}
              icon={metric.icon as any}
              tooltip={metric.tooltip}
              trend={metric.trend}
              variant="minimal"
              drilldownHint={metric.drilldownHint}
              onClick={metric.drilldownHint && onMetricClick ? () => onMetricClick(metric.label) : undefined}
            />
          ))}
        </div>
        
        {/* Updated chart container with better sizing constraints */}
        <div className="mt-4 h-[200px] w-full overflow-hidden">
          {data.chartData && data.chartData.length > 0 ? (
            <Chart 
              title=""
              data={data.chartData}
              series={data.chartSeries}
              type={data.chartType}
              xAxisKey="name"
              height={180}
              width="100%"
              showPercentages={data.chartType === 'pie'}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              No chart data available
            </div>
          )}
        </div>
        
        {/* Added a defined height container for insights to prevent overlap */}
        {data.insights && data.insights.length > 0 && (
          <div className="mt-4 pt-3 border-t max-h-[120px] overflow-y-auto">
            <div className="text-xs text-muted-foreground uppercase mb-2 flex items-center">
              <span>Key Insights</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">AI-generated insights based on your data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <ul className="space-y-1 text-sm">
              {data.insights.map((insight, index) => (
                <li key={index} className="flex items-start group transition-colors hover:bg-muted/20 p-1 rounded cursor-pointer">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span className="flex-1">{insight}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          className="w-full mt-4 flex items-center justify-between p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
        >
          <span>{data.actionText}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
};

