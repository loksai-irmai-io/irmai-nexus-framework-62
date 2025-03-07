
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ComplianceDashboard } from '@/components/compliance-monitoring/ComplianceDashboard';
import { ComplianceDetail } from '@/components/compliance-monitoring/ComplianceDetail';
import { ComplianceSettings } from '@/components/compliance-monitoring/ComplianceSettings';

const ComplianceMonitoring: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'detail' | 'settings'>('dashboard');
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'executive' | 'compliance-officer' | 'control-owner'>('compliance-officer');

  const handleViewChange = (newView: 'dashboard' | 'detail' | 'settings') => {
    setView(newView);
  };

  const handleFrameworkSelect = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    setView('detail');
  };

  const handleRoleChange = (role: 'executive' | 'compliance-officer' | 'control-owner') => {
    setUserRole(role);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        {view === 'dashboard' && (
          <ComplianceDashboard 
            onFrameworkSelect={handleFrameworkSelect} 
            onSettingsClick={() => handleViewChange('settings')}
            userRole={userRole}
            onRoleChange={handleRoleChange}
          />
        )}
        {view === 'detail' && selectedFramework && (
          <ComplianceDetail 
            frameworkId={selectedFramework} 
            onBack={() => handleViewChange('dashboard')}
            userRole={userRole}
          />
        )}
        {view === 'settings' && (
          <ComplianceSettings 
            onClose={() => handleViewChange('dashboard')}
          />
        )}
      </div>
    </Layout>
  );
};

export default ComplianceMonitoring;
