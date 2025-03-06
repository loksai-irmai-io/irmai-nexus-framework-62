
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MetricCard from '@/components/dashboard/MetricCard';
import ModuleSummary from '@/components/dashboard/ModuleSummary';
import RibbonNav from '@/components/dashboard/RibbonNav';
import ModuleInsightsInfographic from '@/components/dashboard/ModuleInsightsInfographic';
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  CheckCheck, 
  GitBranch, 
  Gauge,
  BarChart4
} from 'lucide-react';
import { toast } from 'sonner';

const moduleSummaryData = [
  {
    id: 'process-discovery',
    title: 'Process Discovery',
    description: 'Process mining and discovery insights',
    icon: <GitBranch className="h-4 w-4" />,
    metrics: [
      { label: 'Processes', value: '24' },
      { label: 'Activities', value: '158' },
      { label: 'Variants', value: '42' },
      { label: 'Cases', value: '2,453' },
    ],
    insights: [
      'Payment processing has 3 bottlenecks identified',
      'Customer onboarding has 2 automation opportunities'
    ],
    status: 'info' as const,
    actionText: 'View Process Discovery',
    actionHref: '/process-discovery',
  },
  {
    id: 'outlier-analysis',
    title: 'Outlier Analysis',
    description: 'Anomaly detection and unusual patterns',
    icon: <GitBranch className="h-4 w-4" />,
    metrics: [
      { label: 'Outliers', value: '18' },
      { label: 'False Positives', value: '3' },
      { label: 'Accuracy', value: '94%' },
      { label: 'Cases Analyzed', value: '5,120' },
    ],
    insights: [
      '5 new anomalies detected in the payment process',
      'Loan approval has unusual timestamp patterns'
    ],
    status: 'warning' as const,
    actionText: 'View Outlier Analysis',
    actionHref: '/outlier-analysis',
  },
  {
    id: 'fmea-analysis',
    title: 'Predictive Risk Analytics',
    description: 'Risk assessment and failure mode analysis',
    icon: <Shield className="h-4 w-4" />,
    metrics: [
      { label: 'Open Risks', value: '46' },
      { label: 'High Severity', value: '5' },
      { label: 'Medium Severity', value: '18' },
      { label: 'Low Severity', value: '23' },
    ],
    insights: [
      'Payment fraud risk increased by 12% this month',
      'Data privacy risks require immediate attention'
    ],
    status: 'error' as const,
    actionText: 'View Risk Analytics',
    actionHref: '/fmea-analysis',
  },
  {
    id: 'compliance-monitoring',
    title: 'Compliance Monitoring',
    description: 'Regulatory compliance and gap analysis',
    icon: <CheckCheck className="h-4 w-4" />,
    metrics: [
      { label: 'Compliance Score', value: '85%' },
      { label: 'Critical Gaps', value: '3' },
      { label: 'Controls', value: '124' },
      { label: 'Frameworks', value: '8' },
    ],
    insights: [
      'GDPR compliance score improved by 5% this quarter',
      'PCI-DSS has 2 new gaps requiring immediate action'
    ],
    status: 'warning' as const,
    actionText: 'View Compliance Monitoring',
    actionHref: '/compliance-monitoring',
  }
];

const placeholderModuleData = [
  {
    id: 'controls-testing',
    title: 'Controls Testing',
    description: 'Coming Soon: Automated controls testing and validation',
    icon: <GitBranch className="h-4 w-4" />,
    metrics: [
      { label: 'Controls', value: '124' },
      { label: 'Tested', value: '0' },
      { label: 'Passing', value: '-' },
      { label: 'Failing', value: '-' },
    ],
    status: 'info' as const,
    actionText: 'Module Coming Soon',
    actionHref: '#',
  },
  {
    id: 'scenario-analysis',
    title: 'Scenario Analysis',
    description: 'Coming Soon: Risk scenario modeling and simulation',
    icon: <GitBranch className="h-4 w-4" />,
    metrics: [
      { label: 'Scenarios', value: '0' },
      { label: 'Simulations', value: '0' },
      { label: 'Coverage', value: '-' },
      { label: 'Avg. Loss', value: '-' },
    ],
    status: 'info' as const,
    actionText: 'Module Coming Soon',
    actionHref: '#',
  }
];

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
  
  const handleChartClick = (data: any, moduleType: string) => {
    let navigationData = {};
    
    switch (moduleType) {
      case 'process-discovery':
        navigationData = { process: data.name };
        break;
      case 'outlier-analysis':
        navigationData = { month: data.name };
        break;
      case 'fmea-analysis':
        navigationData = { risk: data.name };
        break;
      case 'compliance-monitoring':
        navigationData = { framework: data.name };
        break;
      default:
        break;
    }
    
    handleNavigate(moduleType, navigationData);
  };
  
  return (
    <Layout>
      <div className="container py-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Operational Risk Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time insights and analytics for operational risk management
        </p>
        
        <RibbonNav className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <MetricCard
            title="Process Discovery"
            value="24"
            severity="medium"
            icon={<GitBranch className="h-5 w-5" />}
            tooltip="Active processes being monitored in the system"
            trend={3}
            isLoading={loading}
            onClick={() => handleNavigate('process-discovery')}
          />
          <MetricCard
            title="Open Risks"
            value="46"
            severity="medium"
            icon={<AlertTriangle className="h-5 w-5" />}
            tooltip="Total number of open risk items across all categories"
            trend={8}
            isLoading={loading}
            onClick={() => handleMetricClick("Risk Management")}
          />
          <MetricCard
            title="High-Severity Risks"
            value="5"
            severity="critical"
            icon={<Shield className="h-5 w-5" />}
            tooltip="Risks with critical or high severity ratings"
            trend={-2}
            isLoading={loading}
            onClick={() => handleMetricClick("High-Severity Risks")}
          />
          <MetricCard
            title="Total Potential Loss"
            value="963K"
            prefix="$"
            severity="high"
            icon={<DollarSign className="h-5 w-5" />}
            tooltip="Estimated financial impact of all identified risks"
            trend={12}
            isLoading={loading}
            onClick={() => handleMetricClick("Potential Loss")}
          />
          <MetricCard
            title="Compliance Score"
            value="85%"
            severity="low"
            icon={<CheckCheck className="h-5 w-5" />}
            tooltip="Overall compliance score across all regulatory frameworks"
            trend={5}
            isLoading={loading}
            onClick={() => handleMetricClick("Compliance")}
          />
          <MetricCard
            title="Control Model Failures"
            value="15%"
            severity="medium"
            icon={<Gauge className="h-5 w-5" />}
            tooltip="Percentage of control models that have failed testing"
            trend={-3}
            isLoading={loading}
            onClick={() => handleNavigate('controls-testing')}
          />
          <MetricCard
            title="Scenario Analysis"
            value="3.2M"
            prefix="$"
            severity="high"
            icon={<BarChart4 className="h-5 w-5" />}
            tooltip="Projected loss based on current scenario analysis"
            trend={8}
            isLoading={loading}
            onClick={() => handleNavigate('scenario-analysis')}
          />
        </RibbonNav>
        
        {/* Infographic replacing multiple chart sections */}
        <ModuleInsightsInfographic 
          className="animate-fade-in mb-8" 
          onChartClick={handleChartClick} 
        />
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          Upcoming Modules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
          {placeholderModuleData.map(module => (
            <ModuleSummary key={module.id} data={module} isLoading={loading} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
