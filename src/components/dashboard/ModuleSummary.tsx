
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface ModuleSummaryData {
  id: string;
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string | number;
  }[];
  insights?: string[];
  status?: 'success' | 'warning' | 'error' | 'info';
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

interface ModuleSummaryProps {
  data: ModuleSummaryData;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const ModuleSummary: React.FC<ModuleSummaryProps> = ({
  data,
  className,
  isLoading = false,
  onClick
}) => {
  const statusClasses = {
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  };
  
  const statusClass = data.status ? statusClasses[data.status] : '';
  
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover",
        onClick ? "cursor-pointer" : "",
        statusClass,
        className
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="p-4 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4"></div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-card-foreground flex items-center">
                {data.icon && <span className="mr-2">{data.icon}</span>}
                {data.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.metrics.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <div className="text-lg font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
            
            {data.insights && data.insights.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="text-xs text-muted-foreground uppercase mb-2">Key Insights</div>
                <ul className="space-y-1 text-sm">
                  {data.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.actionText && data.actionHref && (
              <div className="mt-4">
                <div 
                  className="w-full flex items-center justify-between p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent double navigation
                    onClick && onClick();
                  }}
                >
                  <span>{data.actionText}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleSummary;
