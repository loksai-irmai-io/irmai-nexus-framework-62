
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSystemHealth } from '@/hooks/useAdminData';
import SystemOverview from './SystemOverview';
import DependencyGraph from './DependencyGraph';
import ServiceMonitor from './ServiceMonitor';
import LogViewer from './LogViewer';
import TroubleshootingGuide from './TroubleshootingGuide';
import AdminHeader from './AdminHeader';
import SystemAlerts from './SystemAlerts';
import TabSection from './TabSection';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: healthData, isLoading, isError, error, refetch } = useSystemHealth();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <AdminHeader 
        status={healthData?.overall.status || 'unknown'} 
        isLoading={isLoading} 
        onRefresh={refetch} 
      />

      <SystemAlerts 
        healthData={healthData} 
        error={error} 
        isError={isError} 
      />

      <TabSection 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      <div className="space-y-4">
        {activeTab === 'overview' && <SystemOverview />}
        {activeTab === 'dependencies' && <DependencyGraph />}
        {activeTab === 'services' && <ServiceMonitor />}
        {activeTab === 'logs' && <LogViewer />}
        {activeTab === 'troubleshooting' && <TroubleshootingGuide />}
      </div>

      <div className="text-xs text-muted-foreground text-center pt-4">
        Last updated: {healthData?.lastUpdated ? new Date(healthData.lastUpdated).toLocaleString() : 'Unknown'}
      </div>
    </div>
  );
};

export default AdminDashboard;
