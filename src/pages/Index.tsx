
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Import refactored dashboard components
import MetricsRibbon from '@/components/dashboard/MetricsRibbon';
import DigitalTwinOverview from '@/components/dashboard/DigitalTwinOverview';
import ChartSection from '@/components/dashboard/ChartSection';
import ProcessRiskLandscape from '@/components/dashboard/ProcessRiskLandscape';
import RiskControlMatrix from '@/components/dashboard/RiskControlMatrix';
import RegulatoryCompliance from '@/components/dashboard/RegulatoryCompliance';
import AnomalyDetection from '@/components/dashboard/AnomalyDetection';
import SummarySection from '@/components/dashboard/SummarySection';
import UpcomingModules from '@/components/dashboard/UpcomingModules';
import { moduleSummaryData } from '@/components/dashboard/data';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleNavigate = (module: string, filter?: any) => {
    setLoading(true);
    
    if (filter) {
      sessionStorage.setItem(`${module}-filter`, JSON.stringify(filter));
    }
    
    toast.info(`Navigating to ${module}...`);
    
    setTimeout(() => {
      setLoading(false);
      navigate(`/${module}`);
    }, 500);
  };
  
  const handleMetricClick = (title: string) => {
    setLoading(true);
    
    const moduleMapping: Record<string, string> = {
      "Risk Management": "fmea-analysis",
      "High-Severity Risks": "fmea-analysis?severity=high",
      "Potential Loss": "fmea-analysis?impact=financial",
      "Compliance": "compliance-monitoring",
    };
    
    const route = moduleMapping[title] || "fmea-analysis";
    
    toast.info(`Navigating to ${title} details...`);
    
    setTimeout(() => {
      setLoading(false);
      navigate(`/${route}`);
    }, 500);
  };
  
  const handleLossEventClick = (data: any) => {
    const month = data.name;
    const amount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(data.amount);
    
    toast.info(`Navigating to Incident Management for ${month} (${data.events} events, ${amount})`);
    
    handleNavigate('incident-management', { 
      month: month,
      events: data.events,
      amount: data.amount
    });
  };
  
  const handleRiskCategoryClick = (data: any) => {
    toast.info(`Navigating to Risk Analysis filtered by ${data.name} risks (${data.count} items)`);
    
    handleNavigate('fmea-analysis', { 
      category: data.name,
      count: data.count 
    });
  };
  
  const handleRiskCellClick = (severity: string, effectiveness: string) => {
    handleNavigate('fmea-analysis', { severity, effectiveness });
  };
  
  const handleFrameworkClick = (framework: string) => {
    handleNavigate('compliance-monitoring', { framework });
  };
  
  const handleAnomalyClick = (type: string, severity?: string, position?: string) => {
    handleNavigate('outlier-analysis', { type, severity, position });
  };
  
  const handleIncidentClick = (data: any) => {
    handleNavigate('incident-management', { severity: String(data.name).toLowerCase() });
  };
  
  const handleControlsClick = (data: any) => {
    handleNavigate('controls-testing', { status: String(data.name).toLowerCase() });
  };

  return (
    <Layout>
      <div className="container py-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Operational Risk Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time insights and analytics for operational risk management
        </p>
        
        {/* Metrics Section */}
        <MetricsRibbon 
          isLoading={loading}
          onMetricClick={handleMetricClick}
          onNavigate={handleNavigate}
        />
        
        {/* Digital Twin Overview */}
        <DigitalTwinOverview />
        
        {/* Chart Section */}
        <ChartSection 
          onLossEventClick={handleLossEventClick}
          onRiskCategoryClick={handleRiskCategoryClick}
        />
        
        {/* Infographics Section */}
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          Operational Risk Infographics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <ProcessRiskLandscape onViewClick={() => handleNavigate('process-discovery')} />
          <RiskControlMatrix 
            onViewClick={() => handleNavigate('fmea-analysis')}
            onCellClick={handleRiskCellClick}
          />
          <RegulatoryCompliance 
            onViewClick={() => handleNavigate('compliance-monitoring')}
            onFrameworkClick={handleFrameworkClick}
          />
          <AnomalyDetection 
            onViewClick={() => handleNavigate('outlier-analysis')}
            onAnomalyClick={handleAnomalyClick}
          />
        </div>
        
        <Separator className="my-8 animate-fade-in" style={{ animationDelay: '800ms' }} />
        
        {/* Summary Section */}
        <SummarySection 
          onIncidentClick={handleIncidentClick}
          onControlsClick={handleControlsClick}
        />
        
        {/* Upcoming Modules */}
        <UpcomingModules isLoading={loading} />
      </div>
    </Layout>
  );
};

export default Index;
