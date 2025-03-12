import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chart from '@/components/dashboard/Chart';
import { ChevronRight, ExternalLink, Info, Sparkles } from 'lucide-react';
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
          {/* No metrics displayed for privacy reasons */}
        </div>
        
        {/* Charts removed for data privacy */}
        
        <div className="mt-4 p-3 border rounded-md bg-blue-50 text-blue-800">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 mr-2" />
            <p className="text-sm font-medium">Data Privacy Notice</p>
          </div>
          <p className="text-xs">
            Risk insights data is not displayed publicly for security and compliance reasons.
            Please access this information through secure authorized channels.
          </p>
        </div>
        
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
