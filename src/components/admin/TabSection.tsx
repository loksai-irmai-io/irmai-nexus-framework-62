
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabSectionProps {
  activeTab: string;
}

const TabSection: React.FC<TabSectionProps> = ({ activeTab }) => {
  return (
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
  );
};

export default TabSection;
