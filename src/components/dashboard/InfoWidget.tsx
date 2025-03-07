
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import Chart from './Chart';
import CompactMetric from './CompactMetric';
import { useNavigate } from 'react-router-dom';

export interface InfoWidgetData {
  id: string;
  title: string;
  subtitle: string;
  metrics: {
    label: string;
    value: string;
    tooltip?: string;
    trend?: {
      direction: 'up' | 'down' | 'neutral';
      value: number;
    };
    icon?: string;
  }[];
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
  chartHeight?: number;
  xAxisKey?: string;
}

interface InfoWidgetProps {
  data: InfoWidgetData;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const InfoWidget: React.FC<InfoWidgetProps> = ({
  data,
  className,
  isLoading = false,
  onClick
}) => {
  const navigate = useNavigate();
  const statusColors = {
    success: 'border-green-500 dark:border-green-600',
    warning: 'border-yellow-500 dark:border-yellow-600',
    error: 'border-red-500 dark:border-red-600',
    info: 'border-blue-500 dark:border-blue-600',
  };
  
  const statusBg = {
    success: 'bg-green-50 dark:bg-green-950/20',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20',
    error: 'bg-red-50 dark:bg-red-950/20',
    info: 'bg-blue-50 dark:bg-blue-950/20',
  };
  
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.actionHref) {
      // Ensure we use navigate instead of direct URL changes to prevent full page reload
      navigate(data.actionHref);
      console.log("Navigating to:", data.actionHref);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={cn(
        "rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-lg",
        "flex flex-col h-full w-full", // Added w-full to ensure consistent width
        statusColors[data.status],
        "hover:scale-[1.01] transition-transform duration-200",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="p-4 space-y-4 h-full">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex flex-1 space-x-2">
            <div className="h-40 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-1/2 space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className={cn("p-4 border-b flex items-center", statusBg[data.status])}>
            <div className="mr-3">
              {data.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center">
                {data.title}
              </h3>
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-1">
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
                />
              ))}
            </div>
            
            <div className="flex-1 min-h-[240px]">
              <Chart 
                title={data.title + " Chart"}
                data={data.chartData}
                series={data.chartSeries}
                type={data.chartType}
                xAxisKey={data.xAxisKey}
                height={data.chartHeight || 220}
                showPercentages={data.chartType === 'pie'}
              />
            </div>
            
            {data.insights && data.insights.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="text-xs text-muted-foreground uppercase mb-2">Key Insights</div>
                <ul className="space-y-1 text-sm">
                  {data.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-0.5 text-primary">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="w-full flex items-center justify-between p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                      onClick={handleActionClick}
                    >
                      <span>{data.actionText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Click to see full analysis and drill-down data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoWidget;
