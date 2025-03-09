
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth } from '@/hooks/useAdminData';
import { Progress } from '@/components/ui/progress';
import { Check, AlertTriangle, XCircle, Clock } from 'lucide-react';
import CompactMetric from '@/components/dashboard/CompactMetric';
import { cn } from '@/lib/utils';

const SystemOverview: React.FC = () => {
  const { data: healthData, isLoading } = useSystemHealth();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getLatencyClass = (time: number) => {
    if (time < 100) return 'text-green-500';
    if (time < 300) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const countServicesByStatus = () => {
    if (!healthData) return { online: 0, degraded: 0, offline: 0, unknown: 0 };
    
    return healthData.services.reduce(
      (acc, service) => {
        acc[service.status] = (acc[service.status] || 0) + 1;
        return acc;
      },
      { online: 0, degraded: 0, offline: 0, unknown: 0 } as Record<string, number>
    );
  };
  
  const serviceStatusCounts = countServicesByStatus();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CompactMetric
          label="System Health Score"
          value={`${healthData?.overall.score || 0}%`}
          trend={healthData?.overall.score > 90 
            ? { direction: 'up', value: 2 } 
            : { direction: 'down', value: 3 }}
          icon="gauge"
          variant="card"
          isLoading={isLoading}
        />
        
        <CompactMetric
          label="Services Online"
          value={serviceStatusCounts.online}
          icon="circle-check"
          variant="card"
          isLoading={isLoading}
        />
        
        <CompactMetric
          label="Services Degraded"
          value={serviceStatusCounts.degraded}
          icon="activity"
          variant="card"
          isLoading={isLoading}
        />
        
        <CompactMetric
          label="Services Offline"
          value={serviceStatusCounts.offline}
          icon="trending-down"
          variant="card"
          isLoading={isLoading}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-300 rounded-full" />
                    <div className="h-4 w-40 bg-gray-300 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {healthData?.services.map(service => (
                <div key={service.id} 
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-md",
                    service.status === 'degraded' && "border-amber-300 bg-amber-50",
                    service.status === 'offline' && "border-red-300 bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-sm", getLatencyClass(service.responseTime))}>
                      {service.responseTime}ms
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {service.uptime.toFixed(2)}% uptime
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                      <div className="h-4 w-10 bg-gray-300 rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded">
                      <div className="h-2 w-20 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service Availability</span>
                    <span className="text-sm">{(serviceStatusCounts.online / healthData!.services.length * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={serviceStatusCounts.online / healthData!.services.length * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className="text-sm">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-start gap-3 p-3 border rounded-md">
                    <div className="h-5 w-5 mt-1 bg-gray-300 rounded-full" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 w-full bg-gray-300 rounded" />
                      <div className="h-3 w-24 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-red-300 bg-red-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 mt-1 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Risk analyzer experiencing high latency</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border border-amber-300 bg-amber-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 mt-1 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Authentication service reported 2 errors</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <Check className="h-5 w-5 mt-1 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Database maintenance completed successfully</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemOverview;
