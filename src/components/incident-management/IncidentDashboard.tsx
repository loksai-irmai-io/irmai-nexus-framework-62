
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertCircle, Clock } from "lucide-react";

const IncidentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Incident Management</h1>
          <p className="text-muted-foreground">Monitor and respond to security and operational incidents</p>
        </div>
      </div>

      <Alert variant="default" className="border-blue-500 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-500" />
        <AlertTitle>Active Incidents: 2</AlertTitle>
        <AlertDescription>
          There are currently 2 active incidents that require attention.
        </AlertDescription>
      </Alert>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Incident Management Console</CardTitle>
            <CardDescription>
              Track, respond to, and analyze incidents across your organization
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="overview">Dashboard</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="reporting">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Summary</CardTitle>
                <CardDescription>
                  Overview of all incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Active Incidents</span>
                    <span className="font-bold text-red-500">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pending Review</span>
                    <span className="font-bold text-amber-500">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Resolved This Month</span>
                    <span className="font-bold text-green-500">7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent incident activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium">New Critical Alert</p>
                      <p className="text-sm text-muted-foreground">API Authentication Failure</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 10 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-medium">Warning Alert</p>
                      <p className="text-sm text-muted-foreground">Database Performance Degradation</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>
                Currently active incidents requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-center text-muted-foreground">Active incidents will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Incidents</CardTitle>
              <CardDescription>
                Previously resolved incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-center text-muted-foreground">Resolved incidents history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>
                Generate and view incident reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-center text-muted-foreground">Reporting tools will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Incident Management Settings</CardTitle>
              <CardDescription>
                Configure notification preferences and response protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-center text-muted-foreground">Settings configuration will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentDashboard;
