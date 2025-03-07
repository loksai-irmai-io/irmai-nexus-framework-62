
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Activity,
  ArrowDown,
  ArrowUp,
  ChartBar,
  ChartLine,
  Check,
  Circle,
  CircleCheck,
  Gauge,
  Info,
  TrendingDown,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

type MetricTrend = 'up' | 'down' | 'neutral';
type MetricVariant = 'default' | 'alt' | 'minimal' | 'card';

interface CompactMetricProps {
  label: string;
  value: string | number;
  icon?: 'activity' | 'chart-bar' | 'chart-line' | 'check' | 'circle' | 'circle-check' | 'info' | 'gauge' | 'trending-up' | 'trending-down';
  trend?: {
    direction: MetricTrend;
    value: number;
  };
  variant?: MetricVariant;
  tooltip?: string;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  drilldownHint?: string;
}

const CompactMetric: React.FC<CompactMetricProps> = ({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  tooltip,
  accentColor,
  onClick,
  className,
  isLoading = false,
  drilldownHint
}) => {
  // Icon mapping
  const IconComponent = icon ? {
    'activity': Activity,
    'chart-bar': ChartBar,
    'chart-line': ChartLine,
    'check': Check,
    'circle': Circle,
    'circle-check': CircleCheck,
    'info': Info,
    'gauge': Gauge,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown
  }[icon] : null;

  // Color mapping for trends
  const getTrendColor = (direction: MetricTrend) => {
    return {
      'up': 'text-emerald-500',
      'down': 'text-rose-500',
      'neutral': 'text-slate-500'
    }[direction];
  };

  // Variant styling
  const variantStyles = {
    'default': "bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg border",
    'alt': "bg-gray-50 dark:bg-gray-900 shadow-sm p-4 rounded-lg border-l-4",
    'minimal': "p-3",
    'card': "bg-white dark:bg-gray-800 shadow p-5 rounded-xl"
  };

  const getAccentStyles = () => {
    if (!accentColor || variant !== 'alt') return '';
    return `border-l-[${accentColor}]`;
  };

  const getTrendIcon = (direction: MetricTrend) => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="h-3 w-3" />;
      case 'down':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        getAccentStyles(),
        onClick && "cursor-pointer hover:shadow-md transition-shadow transform hover:translate-y-[-2px] duration-200",
        className
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {IconComponent && (
                <IconComponent className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-1 text-gray-400 dark:text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs text-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <span className="text-xl font-semibold">{value}</span>
            
            {trend && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                getTrendColor(trend.direction)
              )}>
                {getTrendIcon(trend.direction)}
                <span className="ml-1">{trend.value}%</span>
              </div>
            )}
          </div>
          
          {onClick && drilldownHint && (
            <div className="mt-2 flex items-center text-xs text-blue-500 dark:text-blue-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span>{drilldownHint}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompactMetric;
