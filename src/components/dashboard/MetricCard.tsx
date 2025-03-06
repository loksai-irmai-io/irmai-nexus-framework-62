
import React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

type MetricSeverity = 'low' | 'medium' | 'high' | 'critical' | 'success';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  severity?: MetricSeverity;
  tooltip?: string;
  trend?: number;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  prefix,
  suffix,
  icon,
  severity = 'low',
  tooltip,
  trend,
  onClick,
  className,
  isLoading = false
}) => {
  const getSeverityClass = (severity: MetricSeverity) => {
    const severityMap = {
      low: 'border-risk-low',
      medium: 'border-risk-medium',
      high: 'border-risk-high',
      critical: 'border-risk-critical',
      success: 'border-green-500'
    };
    
    return severityMap[severity];
  };
  
  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return (
        <span className="text-risk-high text-xs flex items-center">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-1"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
          {trend}%
        </span>
      );
    } else if (trend < 0) {
      return (
        <span className="text-risk-low text-xs flex items-center">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-1"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
          {Math.abs(trend)}%
        </span>
      );
    }
    return (
      <span className="text-gray-400 text-xs flex items-center">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-1"
        >
          <path d="M5 12h14"/>
        </svg>
        0%
      </span>
    );
  };
  
  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card shadow-sm p-4 transition-all",
        "hover:shadow-card-hover cursor-pointer transform hover:-translate-y-0.5",
        getSeverityClass(severity),
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1">
                      <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs text-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="flex items-baseline">
            {prefix && <span className="text-muted-foreground mr-1 text-sm">{prefix}</span>}
            {isLoading ? (
              <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold">
                {value}
              </div>
            )}
            {suffix && <span className="text-muted-foreground ml-1 text-sm">{suffix}</span>}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
          
          {trend !== undefined && (
            <div className="mt-1">
              {getTrendIcon(trend)}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
