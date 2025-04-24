
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
import { RefreshCw, AlertTriangle, ServerCrash, Users, ShieldAlert, Database } from 'lucide-react';
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System management, monitoring and user administration</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Users</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Admins</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Now</span>
                <span className="font-bold">12</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                User Management Console
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Security settings and access control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Security Level</span>
                <Badge variant="outline" className="bg-green-100">High</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">2FA Enabled Users</span>
                <span className="font-bold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Failed Logins (24h)</span>
                <span className="font-bold">3</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Security Console
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Database status and management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Database Status</span>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="font-bold">42%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="font-bold">2h ago</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Database Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
