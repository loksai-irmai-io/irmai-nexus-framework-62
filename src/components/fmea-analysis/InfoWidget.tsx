
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ExternalLink, Info, Maximize2, SlidersHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Chart from '@/components/dashboard/Chart';
import CompactMetric from '@/components/dashboard/CompactMetric';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

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
  drilldownFilter?: Record<string, any>;
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
    chartHeight?: number;
    xAxisKey?: string;
  };
  onMetricClick?: (label: string, filter?: Record<string, any>) => void;
  onChartElementClick?: (data: any) => void;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({ 
  data, 
  onMetricClick,
  onChartElementClick
}) => {
  const navigate = useNavigate();
  const [visibleSeries, setVisibleSeries] = React.useState<string[]>(data.chartSeries.map(s => s.name));
  const [timeRange, setTimeRange] = React.useState<string>("all");
  
  const statusColors = {
    success: 'border-green-500 dark:border-green-600',
    warning: 'border-amber-500 dark:border-amber-600',
    error: 'border-red-500 dark:border-red-600',
    info: 'border-blue-500 dark:border-blue-600',
  };
  
  const statusBg = {
    success: 'bg-green-50 dark:bg-green-950/20',
    warning: 'bg-amber-50 dark:bg-amber-950/20',
    error: 'bg-red-50 dark:bg-red-950/20',
    info: 'bg-blue-50 dark:bg-blue-950/20',
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.actionHref) {
      navigate(data.actionHref);
    }
  };

  const handleMetricClick = (label: string, filter?: Record<string, any>) => {
    if (onMetricClick) {
      onMetricClick(label, filter);
    }
  };

  const toggleSeries = (seriesName: string) => {
    setVisibleSeries(prev => 
      prev.includes(seriesName) 
        ? prev.filter(name => name !== seriesName)
        : [...prev, seriesName]
    );
  };
  
  // Filter chart series based on visibility selection
  const filteredChartSeries = React.useMemo(() => {
    return data.chartSeries.filter(series => visibleSeries.includes(series.name));
  }, [data.chartSeries, visibleSeries]);
  
  return (
    <div 
      className={cn(
        "rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-lg",
        "flex flex-col h-full w-full",
        statusColors[data.status],
        "hover:scale-[1.01] transition-transform duration-200"
      )}
    >
      <div className={cn("p-4 border-b flex items-center justify-between", statusBg[data.status])}>
        <div className="flex items-center">
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
        
        <div className="flex items-center space-x-2">
          {/* Time range filter */}
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger 
              className="w-[125px] h-8 text-xs border-blue-200 bg-blue-50/50 dark:bg-blue-900/10" 
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1d">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last Quarter</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Filter and visualization options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <button className="p-1.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" onClick={e => e.stopPropagation()}>
              <DropdownMenuLabel>Data Series</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2 flex flex-col gap-2">
                {data.chartSeries.map((series) => (
                  <div key={series.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${data.id}-${series.name}`} 
                      checked={visibleSeries.includes(series.name)} 
                      onCheckedChange={() => toggleSeries(series.name)}
                    />
                    <label htmlFor={`${data.id}-${series.name}`} className="text-sm cursor-pointer flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: series.color }}></span>
                      {series.name}
                    </label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5"
                  onClick={handleActionClick}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View full dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              drilldownHint={metric.drilldownHint}
              onClick={metric.drilldownHint && onMetricClick ? () => handleMetricClick(metric.label, metric.drilldownFilter) : undefined}
            />
          ))}
        </div>
        
        <div className="flex-1 min-h-[240px] relative group">
          <Chart 
            title={data.title + " Chart"}
            data={data.chartData}
            series={filteredChartSeries}
            type={data.chartType}
            xAxisKey={data.xAxisKey}
            height={data.chartHeight || 220}
            showPercentages={data.chartType === 'pie'}
            onClick={onChartElementClick}
          />
          
          {onChartElementClick && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-md px-3 py-2 text-xs flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>Click on chart elements for detailed analysis</span>
              </div>
            </div>
          )}
        </div>
        
        {data.insights && data.insights.length > 0 && (
          <div className="mt-4 pt-3 border-t">
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
                  <span>{insight}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
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
                  className="w-full flex items-center justify-between p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
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
    </div>
  );
};
