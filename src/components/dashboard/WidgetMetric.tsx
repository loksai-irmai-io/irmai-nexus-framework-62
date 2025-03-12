
import React from 'react';
import { 
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  LineChart,
  CheckCircle,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  Users
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface WidgetMetricProps {
  label: string;
  value: string | number;
  iconName: string;
  tooltip?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
}

const WidgetMetric: React.FC<WidgetMetricProps> = ({
  label,
  value,
  iconName,
  tooltip,
  trend
}) => {
  // Map icon names to components
  const getIcon = () => {
    const iconMap: Record<string, React.ReactNode> = {
      'activity': <Activity className="h-4 w-4 text-gray-500" />,
      'bar-chart': <BarChart3 className="h-4 w-4 text-gray-500" />,
      'line-chart': <LineChart className="h-4 w-4 text-gray-500" />,
      'check-circle': <CheckCircle className="h-4 w-4 text-gray-500" />,
      'credit-card': <CreditCard className="h-4 w-4 text-gray-500" />,
      'calendar': <Calendar className="h-4 w-4 text-gray-500" />,
      'clock': <Clock className="h-4 w-4 text-gray-500" />,
      'dollar-sign': <DollarSign className="h-4 w-4 text-gray-500" />,
      'file-text': <FileText className="h-4 w-4 text-gray-500" />,
      'alert-circle': <AlertCircle className="h-4 w-4 text-gray-500" />,
      'users': <Users className="h-4 w-4 text-gray-500" />
    };
    
    return iconMap[iconName] || <Activity className="h-4 w-4 text-gray-500" />;
  };

  // Determine trend color and icon
  const getTrendDisplay = () => {
    if (!trend) return null;
    
    const { direction, value } = trend;
    
    const colorClass = 
      direction === 'up' ? 'text-green-500' : 
      direction === 'down' ? 'text-red-500' : 
      'text-gray-500';
    
    return (
      <div className={`flex items-center ${colorClass} text-xs`}>
        {direction === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : 
         direction === 'down' ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
        <span>{value}%</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-1">
        {getIcon()}
        <span className="text-xs text-muted-foreground ml-1">{label}</span>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{value}</span>
        {getTrendDisplay()}
      </div>
    </div>
  );
};

export default WidgetMetric;
