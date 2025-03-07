
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import OutlierDashboard from '../components/outlier-analysis/OutlierDashboard';
import OutlierDetailView from '../components/outlier-analysis/OutlierDetailView';
import { OutlierEvent } from '../components/outlier-analysis/types';

const OutlierAnalysis = () => {
  const [selectedOutlier, setSelectedOutlier] = useState<OutlierEvent | null>(null);
  
  return (
    <Layout>
      <div className="p-4 md:p-6">
        {selectedOutlier ? (
          <OutlierDetailView 
            outlier={selectedOutlier} 
            onBack={() => setSelectedOutlier(null)} 
          />
        ) : (
          <OutlierDashboard onSelectOutlier={setSelectedOutlier} />
        )}
      </div>
    </Layout>
  );
};

export default OutlierAnalysis;
