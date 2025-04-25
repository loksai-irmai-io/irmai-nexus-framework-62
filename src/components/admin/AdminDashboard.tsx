
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemOverview from './SystemOverview';
import DependencyGraph from './DependencyGraph';
import ServiceMonitor from './ServiceMonitor';
import LogViewer from './LogViewer';
import TroubleshootingGuide from './TroubleshootingGuide';
import { useSystemHealth } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ServerCrash } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: healthData, isLoading, isError, error, refetch } = useSystemHealth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-amber-500">Degraded</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin & Dependencies</h1>
          <p className="text-muted-foreground">System monitoring and troubleshooting tools</p>
        </div>

        <div className="flex items-center gap-2">
          {healthData && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">System Status:</span>
              {getStatusBadge(healthData.overall.status)}
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch system health data: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      {healthData?.overall.status === 'critical' && (
        <Alert variant="destructive" className="border-red-600 bg-red-50 text-red-900">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Critical System Alert</AlertTitle>
          <AlertDescription className="text-red-800">
            {healthData.overall.message}. Please check the troubleshooting guide immediately.
          </AlertDescription>
        </Alert>
      )}

      {healthData?.overall.status === 'degraded' && (
        <Alert variant="default" className="border-amber-500 bg-amber-50 text-amber-900">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Performance Degradation</AlertTitle>
          <AlertDescription className="text-amber-800">
            {healthData.overall.message}. Some services may be experiencing issues.
          </AlertDescription>
        </Alert>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Monitoring</CardTitle>
            <CardDescription>
              Track system health, service dependencies, and troubleshoot issues
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="mt-0">
          <SystemOverview />
        </TabsContent>
        
        <TabsContent value="dependencies" className="mt-0">
          <DependencyGraph />
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <ServiceMonitor />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-0">
          <LogViewer />
        </TabsContent>

        <TabsContent value="troubleshooting" className="mt-0">
          <TroubleshootingGuide />
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground text-center pt-4">
        Last updated: {healthData?.lastUpdated ? new Date(healthData.lastUpdated).toLocaleString() : 'Unknown'}
      </div>
    </div>
  );
};

export default AdminDashboard;

