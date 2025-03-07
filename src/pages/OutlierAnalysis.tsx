
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import OutlierDashboard from '../components/outlier-analysis/OutlierDashboard';
import OutlierDetailView from '../components/outlier-analysis/OutlierDetailView';
import OutlierSettings from '../components/outlier-analysis/OutlierSettings';
import { OutlierEvent } from '../components/outlier-analysis/types';
import { Toaster } from '../components/ui/toaster';

const OutlierAnalysis = () => {
  const [selectedOutlier, setSelectedOutlier] = useState<OutlierEvent | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  return (
    <Layout>
      <div className="p-4 md:p-6">
        {showSettings ? (
          <OutlierSettings onClose={() => setShowSettings(false)} />
        ) : selectedOutlier ? (
          <OutlierDetailView 
            outlier={selectedOutlier} 
            onBack={() => setSelectedOutlier(null)} 
          />
        ) : (
          <OutlierDashboard 
            onSelectOutlier={setSelectedOutlier} 
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </div>
      <Toaster />
    </Layout>
  );
};

export default OutlierAnalysis;
