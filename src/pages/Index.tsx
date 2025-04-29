
import React, { useState } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import AIRiskSummary from '@/components/dashboard/AIRiskSummary';
import { Separator } from '@/components/ui/separator';
import ProfileCard from '@/components/dashboard/ProfileCard';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import AnnouncementsList from '@/components/dashboard/AnnouncementsList';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const { 
    dataLoaded, 
    announcements, 
    infoWidgetData,
    loading, 
    setLoading 
  } = useDashboardData();
  
  return (
    <Layout>
      <div className="container py-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time insights and analytics for operational risk management
        </p>
        
        {/* User profile and subscription card */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 md:col-span-3">
              <ProfileCard />
            </div>
            <div className="col-span-1 md:col-span-1">
              <SubscriptionCard />
            </div>
          </div>
        )}
        
        <DashboardMetrics dataLoaded={dataLoaded} loading={loading} />
        
        <DashboardWidgets infoWidgetData={infoWidgetData} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            {dataLoaded ? (
              <AIRiskSummary isLoading={loading} />
            ) : null}
          </div>
        </div>
        
        <div className="grid grid-cols-1 mb-6">
          <div className="bg-white dark:bg-gray-950 border rounded-lg p-6">
            <h3 className="font-medium mb-4">Process Knowledge Graph</h3>
            <KnowledgeGraph animate={dataLoaded} />
          </div>
        </div>
        
        <div className="mb-6">
          <AnnouncementsList announcements={announcements} dataLoaded={dataLoaded} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
