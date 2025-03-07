
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Clock, User, Filter } from 'lucide-react';
import { OutlierAlert } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for alerts
const mockAlerts: OutlierAlert[] = [
  {
    id: 1,
    title: 'Critical delay in approval process',
    description: 'Multiple instances detected where approval time exceeds threshold by 245%',
    timestamp: '2023-06-15T10:30:00Z',
    severity: 'critical',
    isNew: true,
    category: 'time_outlier'
  },
  {
    id: 2,
    title: 'Sequence violation in customer verification',
    description: 'Verification step being skipped or performed out of order in 23% of cases',
    timestamp: '2023-06-15T09:15:00Z',
    severity: 'high',
    isNew: true,
    category: 'sequence_violation'
  },
  {
    id: 3,
    title: 'Resource imbalance in claims processing',
    description: 'Significant workload disparity detected between processing agents',
    timestamp: '2023-06-15T08:45:00Z',
    severity: 'medium',
    isNew: false,
    category: 'resource_imbalance',
    assignedTo: 'Sarah Jones'
  },
  {
    id: 4,
    title: 'Compliance documentation missing',
    description: 'Required documentation missing in 5% of completed transactions',
    timestamp: '2023-06-14T16:20:00Z',
    severity: 'high',
    isNew: false,
    category: 'compliance_breach',
    assignedTo: 'Michael Chen'
  }
];

interface OutlierAlertCenterProps {
  onSelectOutlier: (id: number) => void;
}

const OutlierAlertCenter: React.FC<OutlierAlertCenterProps> = ({ onSelectOutlier }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Generate appropriate icon for alert
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Clock className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Generate appropriate severity badge
  const getSeverityBadge = (severity: string) => {
    let color = "";
    switch (severity) {
      case 'critical':
        color = "bg-red-500 text-white hover:bg-red-600";
        break;
      case 'high':
        color = "bg-orange-500 text-white hover:bg-orange-600";
        break;
      case 'medium':
        color = "bg-yellow-500 text-black hover:bg-yellow-600";
        break;
      case 'low':
        color = "bg-green-500 text-white hover:bg-green-600";
        break;
      default:
        color = "bg-blue-500 text-white hover:bg-blue-600";
    }
    
    return (
      <Badge className={color}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Outlier Alert Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`border rounded-md p-3 ${
                alert.isNew ? 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-200' : 'bg-white dark:bg-gray-800'
              } cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700`}
              onClick={() => onSelectOutlier(alert.id)}
            >
              <div className="flex gap-3">
                {getAlertIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      {alert.isNew && (
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-sm mt-1">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">
                      {alert.assignedTo ? (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>Assigned to: {alert.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400">Unassigned</span>
                      )}
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="link" className="h-auto p-0" onClick={(e) => {
                            e.stopPropagation();
                            onSelectOutlier(alert.id);
                          }}>
                            View details
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Click to view detailed information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierAlertCenter;
