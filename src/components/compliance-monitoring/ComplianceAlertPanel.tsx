
import React, { useState } from 'react';
import { ComplianceAlert } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Check, 
  X, 
  Calendar, 
  CircleAlert, 
  FileText, 
  MessagesSquare,
  LightbulbIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComplianceAlertPanelProps {
  alerts: ComplianceAlert[];
  onAlertClick: (frameworkId?: string) => void;
}

export const ComplianceAlertPanel: React.FC<ComplianceAlertPanelProps> = ({ 
  alerts,
  onAlertClick
}) => {
  const [hoveredAlertId, setHoveredAlertId] = useState<string | null>(null);
  
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'failed-control':
        return <CircleAlert className="h-4 w-4 text-red-600" />;
      case 'upcoming-deadline':
        return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'gap-identified':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'evidence-needed':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Check className="h-10 w-10 mx-auto mb-2 text-green-600" />
          <p>No active alerts at this time</p>
        </div>
      ) : (
        alerts.map(alert => (
          <div 
            key={alert.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
            onMouseEnter={() => setHoveredAlertId(alert.id)}
            onMouseLeave={() => setHoveredAlertId(null)}
            onClick={() => alert.relatedFrameworkId && onAlertClick(alert.relatedFrameworkId)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {getAlertTypeIcon(alert.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{alert.title}</h4>
                  {getSeverityBadge(alert.severity)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                
                {alert.aiRecommendation && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md mb-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start">
                      <LightbulbIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="flex items-center mb-1">
                          <Badge variant="info" className="bg-blue-600 text-[10px] h-4 mr-2">AI Insight</Badge>
                          <span className="text-xs text-blue-700 dark:text-blue-400">Confidence: High</span>
                        </div>
                        <p className="text-sm text-blue-900 dark:text-blue-300">{alert.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reported: {formatDate(alert.timestamp)}</span>
                  <span>Status: {alert.status}</span>
                </div>
              </div>
            </div>
            
            {hoveredAlertId === alert.id && (
              <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Acknowledge
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mark this alert as acknowledged</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8">
                        <MessagesSquare className="h-3.5 w-3.5 mr-1" />
                        Comment
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add a comment to this alert</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 text-muted-foreground">
                        <X className="h-3.5 w-3.5 mr-1" />
                        Dismiss
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Dismiss this alert</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
