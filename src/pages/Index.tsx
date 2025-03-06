import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import MetricCard from '@/components/dashboard/MetricCard';
import InfoWidget, { InfoWidgetData } from '@/components/dashboard/InfoWidget';
import Chart from '@/components/dashboard/Chart';
import RibbonNav from '@/components/dashboard/RibbonNav';
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  CheckCheck, 
  GitBranch, 
  SearchX, 
  TestTube, 
  Presentation,
  Gauge,
  BarChart4
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const lossEventsData = [
  { name: 'Jan 2025', value: 4, amount: 100000, events: 2 },
  { name: 'Feb 2025', value: 5, amount: 150000, events: 3 },
  { name: 'Mar 2025', value: 3, amount: 250000, events: 3 },
  { name: 'Apr 2025', value: 6, amount: 180000, events: 4 },
  { name: 'May 2025', value: 4, amount: 120000, events: 2 },
  { name: 'Jun 2025', value: 3, amount: 80000, events: 1 },
];

const riskDistributionData = [
  { name: 'Operational', value: 35, count: 16, color: '#f97316' },
  { name: 'Credit', value: 25, count: 12, color: '#8b5cf6' },
  { name: 'Market', value: 15, count: 7, color: '#06b6d4' },
  { name: 'Compliance', value: 15, count: 7, color: '#10b981' },
  { name: 'Strategic', value: 10, count: 4, color: '#f59e0b' },
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

const processDiscoveryData = [
  { name: 'Payment Processing', value: 32 },
  { name: 'Customer Onboarding', value: 24 },
  { name: 'Loan Applications', value: 18 },
  { name: 'Account Management', value: 16 },
  { name: 'Reporting', value: 10 },
];

const outlierAnalysisData = [
  { name: 'Jan', count: 5, rate: 1.2 },
  { name: 'Feb', count: 8, rate: 1.8 },
  { name: 'Mar', count: 12, rate: 2.5 },
  { name: 'Apr', count: 7, rate: 1.5 },
  { name: 'May', count: 15, rate: 3.0 },
  { name: 'Jun', count: 10, rate: 2.0 },
];

const predictiveRiskData = [
  { name: 'Fraud', probability: 0.7, impact: 85 },
  { name: 'Data Breach', probability: 0.4, impact: 95 },
  { name: 'System Failure', probability: 0.3, impact: 80 },
  { name: 'Compliance', probability: 0.5, impact: 70 },
  { name: 'Operations', probability: 0.6, impact: 60 },
];

const gapAnalysisData = [
  { name: 'PCI-DSS', current: 75, target: 100 },
  { name: 'GDPR', current: 85, target: 100 },
  { name: 'SOX', current: 90, target: 100 },
  { name: 'ISO 27001', current: 65, target: 100 },
  { name: 'Basel III', current: 70, target: 100 },
];

const moduleSummaryData = [
  {
    id: 'process-discovery',
    title: 'Process Discovery',
    subtitle: 'Process mining and discovery insights',
    icon: <GitBranch className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Processes', 
        value: '24', 
        icon: 'chart-bar',
        tooltip: 'Total number of processes discovered through process mining',
        trend: { direction: 'up' as const, value: 8 }
      },
      { 
        label: 'Activities', 
        value: '158', 
        icon: 'activity',
        tooltip: 'Total unique activities identified across all processes'
      },
      { 
        label: 'Variants', 
        value: '42', 
        icon: 'git-branch',
        tooltip: 'Number of process variants or alternative paths identified'
      },
      { 
        label: 'Cases', 
        value: '2,453', 
        icon: 'info',
        tooltip: 'Total number of cases analyzed'
      },
    ],
    insights: [
      'Payment processing has 3 bottlenecks identified',
      'Customer onboarding has 2 automation opportunities'
    ],
    chartData: processDiscoveryData,
    chartSeries: [{ name: 'Activities', dataKey: 'value', color: '#22c55e' }],
    chartType: 'pie' as const,
    status: 'info' as const,
    actionText: 'View Process Discovery',
    actionHref: '/process-discovery',
    chartHeight: 200,
  },
  {
    id: 'outlier-analysis',
    title: 'Outlier Analysis',
    subtitle: 'Anomaly detection and unusual patterns',
    icon: <SearchX className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Outliers', 
        value: '18', 
        icon: 'search-x',
        tooltip: 'Total number of outliers detected',
        trend: { direction: 'up' as const, value: 12 }
      },
      { 
        label: 'False Positives', 
        value: '3', 
        icon: 'info',
        tooltip: 'Number of outliers determined to be false positives'
      },
      { 
        label: 'Accuracy', 
        value: '94%', 
        icon: 'check',
        tooltip: 'Accuracy rate of anomaly detection',
        trend: { direction: 'up' as const, value: 3 }
      },
      { 
        label: 'Cases Analyzed', 
        value: '5,120', 
        icon: 'activity',
        tooltip: 'Total number of cases analyzed for anomalies'
      },
    ],
    insights: [
      '5 new anomalies detected in the payment process',
      'Loan approval has unusual timestamp patterns'
    ],
    chartData: outlierAnalysisData,
    chartSeries: [
      { name: 'Anomaly Count', dataKey: 'count', color: '#f97316' },
      { name: 'Anomaly Rate (%)', dataKey: 'rate', color: '#3b82f6' }
    ],
    chartType: 'composed' as const,
    xAxisKey: 'name',
    status: 'warning' as const,
    actionText: 'View Outlier Analysis',
    actionHref: '/outlier-analysis',
    chartHeight: 200,
  },
  {
    id: 'fmea-analysis',
    title: 'Predictive Risk Analytics',
    subtitle: 'Risk assessment and failure mode analysis',
    icon: <Shield className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Open Risks', 
        value: '46', 
        icon: 'alert-triangle',
        tooltip: 'Total number of open risk items',
        trend: { direction: 'up' as const, value: 5 }
      },
      { 
        label: 'High Severity', 
        value: '5', 
        icon: 'trending-up',
        tooltip: 'Number of high severity risks',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Medium Severity', 
        value: '18', 
        icon: 'trending-up',
        tooltip: 'Number of medium severity risks'
      },
      { 
        label: 'Low Severity', 
        value: '23', 
        icon: 'trending-down',
        tooltip: 'Number of low severity risks'
      },
    ],
    insights: [
      'Payment fraud risk increased by 12% this month',
      'Data privacy risks require immediate attention'
    ],
    chartData: predictiveRiskData.map(item => ({
      ...item,
      size: Math.round(item.probability * item.impact)
    })),
    chartSeries: [
      { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
      { name: 'Impact', dataKey: 'impact', color: '#ef4444' },
      { name: 'Size', dataKey: 'size', color: '#d946ef' }
    ],
    chartType: 'composed' as const,
    xAxisKey: 'name',
    status: 'error' as const,
    actionText: 'View Risk Analytics',
    actionHref: '/fmea-analysis',
    chartHeight: 200,
  },
  {
    id: 'compliance-monitoring',
    title: 'Compliance Monitoring',
    subtitle: 'Regulatory compliance and gap analysis',
    icon: <CheckCheck className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Compliance Score', 
        value: '85%', 
        icon: 'chart-line',
        tooltip: 'Overall compliance score across all frameworks',
        trend: { direction: 'up' as const, value: 5 }
      },
      { 
        label: 'Critical Gaps', 
        value: '3', 
        icon: 'alert-triangle',
        tooltip: 'Number of critical compliance gaps',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Controls', 
        value: '124', 
        icon: 'circle-check',
        tooltip: 'Total number of controls implemented'
      },
      { 
        label: 'Frameworks', 
        value: '8', 
        icon: 'check',
        tooltip: 'Number of compliance frameworks monitored'
      },
    ],
    insights: [
      'GDPR compliance score improved by 5% this quarter',
      'PCI-DSS has 2 new gaps requiring immediate action'
    ],
    chartData: gapAnalysisData,
    chartSeries: [
      { name: 'Current Compliance', dataKey: 'current', color: '#0ea5e9' },
      { name: 'Target', dataKey: 'target', color: '#64748b' }
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    status: 'warning' as const,
    actionText: 'View Compliance Monitoring',
    actionHref: '/compliance-monitoring',
    chartHeight: 200,
  }
];

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

const infoWidgetData: InfoWidgetData[] = [
  {
    id: 'process-discovery',
    title: 'Process Discovery',
    subtitle: 'Process mining and discovery insights',
    icon: <GitBranch className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Processes', 
        value: '24', 
        icon: 'chart-bar',
        tooltip: 'Total number of processes discovered through process mining',
        trend: { direction: 'up' as const, value: 8 }
      },
      { 
        label: 'Activities', 
        value: '158', 
        icon: 'activity',
        tooltip: 'Total unique activities identified across all processes'
      },
      { 
        label: 'Variants', 
        value: '42', 
        icon: 'git-branch',
        tooltip: 'Number of process variants or alternative paths identified'
      },
      { 
        label: 'Cases', 
        value: '2,453', 
        icon: 'info',
        tooltip: 'Total number of cases analyzed'
      },
    ],
    insights: [
      'Payment processing has 3 bottlenecks identified',
      'Customer onboarding has 2 automation opportunities'
    ],
    chartData: processDiscoveryData,
    chartSeries: [{ name: 'Activities', dataKey: 'value', color: '#22c55e' }],
    chartType: 'pie',
    status: 'info',
    actionText: 'View Process Discovery',
    actionHref: '/process-discovery',
    chartHeight: 200,
  },
  {
    id: 'outlier-analysis',
    title: 'Outlier Analysis',
    subtitle: 'Anomaly detection and unusual patterns',
    icon: <SearchX className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Outliers', 
        value: '18', 
        icon: 'search-x',
        tooltip: 'Total number of outliers detected',
        trend: { direction: 'up' as const, value: 12 }
      },
      { 
        label: 'False Positives', 
        value: '3', 
        icon: 'info',
        tooltip: 'Number of outliers determined to be false positives'
      },
      { 
        label: 'Accuracy', 
        value: '94%', 
        icon: 'check',
        tooltip: 'Accuracy rate of anomaly detection',
        trend: { direction: 'up' as const, value: 3 }
      },
      { 
        label: 'Cases Analyzed', 
        value: '5,120', 
        icon: 'activity',
        tooltip: 'Total number of cases analyzed for anomalies'
      },
    ],
    insights: [
      '5 new anomalies detected in the payment process',
      'Loan approval has unusual timestamp patterns'
    ],
    chartData: outlierAnalysisData,
    chartSeries: [
      { name: 'Anomaly Count', dataKey: 'count', color: '#f97316' },
      { name: 'Anomaly Rate (%)', dataKey: 'rate', color: '#3b82f6' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'warning',
    actionText: 'View Outlier Analysis',
    actionHref: '/outlier-analysis',
    chartHeight: 200,
  },
  {
    id: 'fmea-analysis',
    title: 'Predictive Risk Analytics',
    subtitle: 'Risk assessment and failure mode analysis',
    icon: <Shield className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Open Risks', 
        value: '46', 
        icon: 'alert-triangle',
        tooltip: 'Total number of open risk items',
        trend: { direction: 'up' as const, value: 5 }
      },
      { 
        label: 'High Severity', 
        value: '5', 
        icon: 'trending-up',
        tooltip: 'Number of high severity risks',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Medium Severity', 
        value: '18', 
        icon: 'trending-up',
        tooltip: 'Number of medium severity risks'
      },
      { 
        label: 'Low Severity', 
        value: '23', 
        icon: 'trending-down',
        tooltip: 'Number of low severity risks'
      },
    ],
    insights: [
      'Payment fraud risk increased by 12% this month',
      'Data privacy risks require immediate attention'
    ],
    chartData: predictiveRiskData.map(item => ({
      ...item,
      size: Math.round(item.probability * item.impact)
    })),
    chartSeries: [
      { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
      { name: 'Impact', dataKey: 'impact', color: '#ef4444' },
      { name: 'Size', dataKey: 'size', color: '#d946ef' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'error',
    actionText: 'View Risk Analytics',
    actionHref: '/fmea-analysis',
    chartHeight: 200,
  },
  {
    id: 'compliance-monitoring',
    title: 'Compliance Monitoring',
    subtitle: 'Regulatory compliance and gap analysis',
    icon: <CheckCheck className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Compliance Score', 
        value: '85%', 
        icon: 'chart-line',
        tooltip: 'Overall compliance score across all frameworks',
        trend: { direction: 'up' as const, value: 5 }
      },
      { 
        label: 'Critical Gaps', 
        value: '3', 
        icon: 'alert-triangle',
        tooltip: 'Number of critical compliance gaps',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Controls', 
        value: '124', 
        icon: 'circle-check',
        tooltip: 'Total number of controls implemented'
      },
      { 
        label: 'Frameworks', 
        value: '8', 
        icon: 'check',
        tooltip: 'Number of compliance frameworks monitored'
      },
    ],
    insights: [
      'GDPR compliance score improved by 5% this quarter',
      'PCI-DSS has 2 new gaps requiring immediate action'
    ],
    chartData: gapAnalysisData,
    chartSeries: [
      { name: 'Current Compliance', dataKey: 'current', color: '#0ea5e9' },
      { name: 'Target', dataKey: 'target', color: '#64748b' }
    ],
    chartType: 'bar',
    xAxisKey: 'name',
    status: 'warning',
    actionText: 'View Compliance Monitoring',
    actionHref: '/compliance-monitoring',
    chartHeight: 200,
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
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          Module Insights
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Chart 
            title="Process Discovery: Activity Distribution"
            data={processDiscoveryData}
            series={[{ name: 'Activities', dataKey: 'value', color: '#22c55e' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Distribution of activities across business processes"
            onClick={(data) => handleNavigate('process-discovery', { process: data.name })}
          />
          
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
            onClick={(data) => handleNavigate('outlier-analysis', { month: data.name })}
          />
          
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
            onClick={(data) => handleNavigate('fmea-analysis', { risk: data.name })}
          />
          
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
            onClick={(data) => handleNavigate('compliance-monitoring', { framework: data.name })}
          />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          Core Module Summaries
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '700ms' }}>
          {infoWidgetData.map(module => (
            <InfoWidget 
              key={module.id} 
              data={module} 
              isLoading={loading}
              onClick={() => handleNavigate(module.actionHref.replace('/', ''))} 
            />
          ))}
        </div>
        
        <Separator className="my-8 animate-fade-in" style={{ animationDelay: '800ms' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
          <Chart 
            title="Controls Health"
            data={controlsHealthData}
            series={[{ name: 'Percentage', dataKey: 'value', color: '#4ade80' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Current health status of control mechanisms"
            onClick={(data) => handleNavigate('controls-testing', { status: String(data.name).toLowerCase() })}
          />
          
          <Chart 
            title="Loss Events Over Time"
            description="Trend of financial impact and event count by month"
            data={lossEventsData}
            series={[
              { name: 'Financial Loss ($K)', dataKey: 'amount', color: '#ef4444' },
              { name: 'Event Count', dataKey: 'events', color: '#8b5cf6' }
            ]}
            type="composed"
            xAxisKey="name"
            height={300}
            tooltip="Click on any month to see detailed incident reports for that period"
            onClick={handleLossEventClick}
          />
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-4 mb-6 animate-fade-in" style={{ animationDelay: '1000ms' }}>
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
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1200ms' }}>
          Digital Twin Overview
        </h2>
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '1300ms' }}>
          <div className="p-1 border border-primary/20 rounded-lg bg-primary/5">
            <div className="relative w-full aspect-video sm:aspect-[16/9] xl:aspect-[21/9] overflow-hidden rounded-lg">
              <KnowledgeGraph className="w-full h-full" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            <span>This is your central data hub – all insights and interdependencies are sourced here.</span>
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
          Upcoming Modules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
          {placeholderModuleData.map(module => (
            <InfoWidget 
              key={module.id} 
              data={module as any} 
              isLoading={loading} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
