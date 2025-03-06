
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import MetricCard from '@/components/dashboard/MetricCard';
import ModuleSummary from '@/components/dashboard/ModuleSummary';
import Chart from '@/components/dashboard/Chart';
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  CheckCheck, 
  GitBranch, 
  SearchX, 
  TestTube, 
  Presentation 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Sample data for charts
const lossEventsData = [
  { name: 'Jan', value: 4, amount: 100 },
  { name: 'Feb', value: 5, amount: 150 },
  { name: 'Mar', value: 3, amount: 250 },
  { name: 'Apr', value: 6, amount: 180 },
  { name: 'May', value: 4, amount: 120 },
  { name: 'Jun', value: 3, amount: 80 },
];

const riskDistributionData = [
  { name: 'Operational', value: 35 },
  { name: 'Credit', value: 25 },
  { name: 'Market', value: 15 },
  { name: 'Compliance', value: 15 },
  { name: 'Strategic', value: 10 },
];

const incidentSeverityData = [
  { name: 'Critical', value: 2 },
  { name: 'High', value: 5 },
  { name: 'Medium', value: 12 },
  { name: 'Low', value: 28 },
];

const controlsHealthData = [
  { name: 'Passing', value: 85 },
  { name: 'Failing', value: 15 },
];

// Process Discovery Data
const processDiscoveryData = [
  { name: 'Payment Processing', value: 32 },
  { name: 'Customer Onboarding', value: 24 },
  { name: 'Loan Applications', value: 18 },
  { name: 'Account Management', value: 16 },
  { name: 'Reporting', value: 10 },
];

// Outlier Analysis Data
const outlierAnalysisData = [
  { name: 'Jan', count: 5, rate: 1.2 },
  { name: 'Feb', count: 8, rate: 1.8 },
  { name: 'Mar', count: 12, rate: 2.5 },
  { name: 'Apr', count: 7, rate: 1.5 },
  { name: 'May', count: 15, rate: 3.0 },
  { name: 'Jun', count: 10, rate: 2.0 },
];

// Predictive Risk Analytics Data
const predictiveRiskData = [
  { name: 'Fraud', probability: 0.7, impact: 85 },
  { name: 'Data Breach', probability: 0.4, impact: 95 },
  { name: 'System Failure', probability: 0.3, impact: 80 },
  { name: 'Compliance', probability: 0.5, impact: 70 },
  { name: 'Operations', probability: 0.6, impact: 60 },
];

// Gap Analysis Data
const gapAnalysisData = [
  { name: 'PCI-DSS', current: 75, target: 100 },
  { name: 'GDPR', current: 85, target: 100 },
  { name: 'SOX', current: 90, target: 100 },
  { name: 'ISO 27001', current: 65, target: 100 },
  { name: 'Basel III', current: 70, target: 100 },
];

// Module summary data
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
    icon: <SearchX className="h-4 w-4" />,
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

// Placeholder module data
const placeholderModuleData = [
  {
    id: 'controls-testing',
    title: 'Controls Testing',
    description: 'Coming Soon: Automated controls testing and validation',
    icon: <TestTube className="h-4 w-4" />,
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
    icon: <Presentation className="h-4 w-4" />,
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
  
  // Simulate drill-down
  const handleMetricClick = (title: string) => {
    setLoading(true);
    
    toast.info(`Navigating to ${title} details...`);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  return (
    <Layout>
      <div className="container py-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Operational Risk Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time insights and analytics for operational risk management
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
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
        </div>
        
        {/* Enhanced Digital Twin Hub Section */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Digital Twin Overview</h2>
          <div className="p-1 border border-primary/20 rounded-lg bg-primary/5">
            <KnowledgeGraph className="h-[400px] rounded-lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            This is your central data hub – all insights and interdependencies are sourced here.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          Module Insights
        </h2>
        
        {/* Module-specific Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Process Discovery Visualization */}
          <Chart 
            title="Process Discovery: Activity Distribution"
            data={processDiscoveryData}
            series={[{ name: 'Activities', dataKey: 'value', color: '#22c55e' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Distribution of activities across business processes"
            onClick={(data) => handleMetricClick(`${data.name} Process Details`)}
          />
          
          {/* Outlier Analysis Visualization */}
          <Chart 
            title="Outlier Analysis: Anomaly Trends"
            data={outlierAnalysisData}
            series={[
              { name: 'Anomaly Count', dataKey: 'count', color: '#f97316' },
              { name: 'Anomaly Rate (%)', dataKey: 'rate', color: '#3b82f6' }
            ]}
            type="composed"
            xAxisKey="name"
            height={300}
            tooltip="Trend of detected anomalies over time"
            onClick={(data) => handleMetricClick(`Anomalies for ${data.name}`)}
          />
          
          {/* Predictive Risk Analytics Visualization */}
          <Chart 
            title="Predictive Risk Analytics: Heat Map"
            description="Bubble size represents risk severity (probability × impact)"
            data={predictiveRiskData.map(item => ({
              ...item,
              size: Math.round(item.probability * item.impact)
            }))}
            series={[
              { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
              { name: 'Impact', dataKey: 'impact', color: '#ef4444' },
              { name: 'Size', dataKey: 'size', color: '#d946ef' }
            ]}
            type="composed"
            xAxisKey="name"
            height={300}
            tooltip="Risk heat map showing probability vs impact"
            onClick={(data) => handleMetricClick(`${data.name} Risk Analysis`)}
          />
          
          {/* Gap Analysis Visualization */}
          <Chart 
            title="Compliance Monitoring: Gap Analysis"
            data={gapAnalysisData}
            series={[
              { name: 'Current Compliance', dataKey: 'current', color: '#0ea5e9' },
              { name: 'Target', dataKey: 'target', color: '#64748b' }
            ]}
            type="bar"
            xAxisKey="name"
            height={300}
            tooltip="Comparison of current vs. target compliance levels"
            onClick={(data) => handleMetricClick(`${data.name} Compliance Details`)}
          />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          Active Module Summaries
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          {moduleSummaryData.map(module => (
            <ModuleSummary key={module.id} data={module} isLoading={loading} />
          ))}
        </div>
        
        <Separator className="my-8 animate-fade-in" style={{ animationDelay: '700ms' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <Chart 
            title="Incidents by Severity"
            data={incidentSeverityData}
            series={[
              { name: 'Count', dataKey: 'value', color: '#f97316' }
            ]}
            type="bar"
            xAxisKey="name"
            height={300}
            tooltip="Distribution of incidents by severity level"
            onClick={(data) => handleMetricClick(`${data.name} Incidents`)}
          />
          <Chart 
            title="Controls Health"
            data={controlsHealthData}
            series={[{ name: 'Percentage', dataKey: 'value', color: '#4ade80' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Current health status of control mechanisms"
            onClick={(data) => handleMetricClick(`${data.name} Controls`)}
          />
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="font-semibold mb-3">Announcements & Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">New Feature</p>
                <p className="text-blue-700 dark:text-blue-400">Knowledge Graph now supports interactive drilling through relationships between risks and controls.</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Tip</p>
                <p className="text-yellow-700 dark:text-yellow-400">Use the Risk Catalog to drill into detailed risk descriptions and mitigations.</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">Training</p>
                <p className="text-purple-700 dark:text-purple-400">New training session on FMEA Analysis scheduled for next Friday.</p>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '900ms' }}>
          Upcoming Modules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          {placeholderModuleData.map(module => (
            <ModuleSummary key={module.id} data={module} isLoading={loading} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
