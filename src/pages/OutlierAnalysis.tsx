
import React from 'react';
import Layout from '@/components/layout/Layout';
import OutlierDashboard from '@/components/outlier-analysis/OutlierDashboard';

const OutlierAnalysis = () => {
  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Outlier Analysis</h1>
              <p className="text-muted-foreground mt-1">
                Identify and investigate anomalies in your processes
              </p>
            </div>
          </div>
          
          <OutlierDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default OutlierAnalysis;
