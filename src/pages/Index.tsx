<lov-code>
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

const controlsTestingData = [
  { name: 'Passing', value: 85 },
  { name: 'Failing', value: 15 },
];

const incidentManagementData = [
  { name: 'Jan', count: 4, amount: 160000 },
  { name: 'Feb', count: 6, amount: 180000 },
  { name: 'Mar', count: 8, amount: 260000 },
  { name: 'Apr', count: 5, amount: 150000 },
  { name: 'May', count: 3, amount: 120000 },
  { name: 'Jun', count: 2, amount: 90000 },
];

const scenarioAnalysisData = [
  { name: 'Data Breach', probability: 0.3, impact: 85, size: 25 },
  { name: 'System Failure', probability: 0.5, impact: 65, size: 32 },
  { name: 'Compliance', probability: 0.2, impact: 75, size: 15 },
  { name: 'Disaster Recovery', probability: 0.1, impact: 95, size: 10 },
  { name: 'Fraud', probability: 0.6, impact: 55, size: 33 },
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
  },
  {
    id: 'controls-testing',
    title: 'Controls Testing',
    subtitle: 'Automated controls testing and validation',
    icon: <TestTube className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Total Controls', 
        value: '124', 
        icon: 'circle-check',
        tooltip: 'Total number of controls in the system'
      },
      { 
        label: 'Tested', 
        value: '80', 
        icon: 'check',
        tooltip: 'Number of controls that have been tested'
      },
      { 
        label: 'Pass Rate', 
        value: '85%', 
        icon: 'gauge',
        tooltip: 'Percentage of controls that passed testing',
        trend: { direction: 'up' as const, value: 3 }
      },
      { 
        label: 'Fail Rate', 
        value: '15%', 
        icon: 'alert-triangle',
        tooltip: 'Percentage of controls that failed testing',
        trend: { direction: 'down' as const, value: 3 }
      },
    ],
    insights: [
      'No new controls tested this week (awaiting scheduling)',
      'Evidence collection automation in progress'
    ],
    chartData: controlsTestingData,
    chartSeries: [
      { name: 'Percentage', dataKey: 'value', color: '#4ade80' }
    ],
    chartType: 'pie',
    status: 'info',
    actionText: 'View Controls Testing',
    actionHref: '/controls-testing',
    chartHeight: 200,
  },
  {
    id: 'incident-management',
    title: 'Incident Management',
    subtitle: 'Loss events and issue tracking',
    icon: <AlertTriangle className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Open Incidents', 
        value: '10', 
        icon: 'alert-triangle',
        tooltip: 'Number of currently open incidents',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Resolved', 
        value: '5', 
        icon: 'check',
        tooltip: 'Number of incidents resolved this month'
      },
      { 
        label: 'Avg. Resolution', 
        value: '3.2 days', 
        icon: 'clock',
        tooltip: 'Average time to resolve incidents'
      },
      { 
        label: 'Critical Incidents', 
        value: '2', 
        icon: 'alert-circle',
        tooltip: 'Number of critical incidents requiring immediate attention',
        trend: { direction: 'up' as const, value: 1 }
      },
    ],
    insights: [
      'Financial loss peaked in March 2025 ($260K)',
      'Major data breach incident resolved last week'
    ],
    chartData: incidentManagementData,
    chartSeries: [
      { name: 'Incident Count', dataKey: 'count', color: '#8b5cf6' },
      { name: 'Financial Loss ($K)', dataKey: 'amount', color: '#ef4444' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'warning',
    actionText: 'View Incident Management',
    actionHref: '/incident-management',
    chartHeight: 200,
  },
  {
    id: 'scenario-analysis',
    title: 'Scenario Analysis',
    subtitle: 'Risk scenario modeling and simulation',
    icon: <Presentation className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Scenarios', 
        value: '5', 
        icon: 'lightbulb',
        tooltip: 'Total number of risk scenarios modeled'
      },
      { 
        label: 'Simulations Run', 
        value: '12', 
        icon: 'repeat',
        tooltip: 'Total number of simulations executed'
      },
      { 
        label: 'Coverage', 
        value: '60%', 
        icon: 'percent',
        tooltip: 'Percentage of high-impact processes covered by scenarios',
        trend: { direction: 'up' as const, value: 10 }
      },
      { 
        label: 'Avg. Loss', 
        value: '$75K', 
        icon: 'dollar-sign',
        tooltip: 'Average potential financial loss across all scenarios'
      },
    ],
    insights: [
      'Disaster recovery scenario indicates 20% potential revenue impact',
      '3 new simulations pending for Q1 2026'
    ],
    chartData: scenarioAnalysisData,
    chartSeries: [
      { name: 'Probability', dataKey: 'probability', color: '#0ea5e9' },
      { name: 'Impact', dataKey: 'impact', color: '#f97316' },
      { name: 'Size', dataKey: 'size', color: '#d946ef' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'error',
    actionText: 'View Scenario Analysis',
    actionHref: '/scenario-analysis',
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
  },
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
    id: 'controls-testing',
    title: 'Controls Testing',
    subtitle: 'Automated controls testing and validation',
    icon: <TestTube className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Total Controls', 
        value: '124', 
        icon: 'circle-check',
        tooltip: 'Total number of controls in the system'
      },
      { 
        label: 'Tested', 
        value: '80', 
        icon: 'check',
        tooltip: 'Number of controls that have been tested'
      },
      { 
        label: 'Pass Rate', 
        value: '85%', 
        icon: 'gauge',
        tooltip: 'Percentage of controls that passed testing',
        trend: { direction: 'up' as const, value: 3 }
      },
      { 
        label: 'Fail Rate', 
        value: '15%', 
        icon: 'alert-triangle',
        tooltip: 'Percentage of controls that failed testing',
        trend: { direction: 'down' as const, value: 3 }
      },
    ],
    insights: [
      'No new controls tested this week (awaiting scheduling)',
      'Evidence collection automation in progress'
    ],
    chartData: controlsTestingData,
    chartSeries: [
      { name: 'Percentage', dataKey: 'value', color: '#4ade80' }
    ],
    chartType: 'pie',
    status: 'info',
    actionText: 'View Controls Testing',
    actionHref: '/controls-testing',
    chartHeight: 200,
  },
  {
    id: 'incident-management',
    title: 'Incident Management',
    subtitle: 'Loss events and issue tracking',
    icon: <AlertTriangle className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Open Incidents', 
        value: '10', 
        icon: 'alert-triangle',
        tooltip: 'Number of currently open incidents',
        trend: { direction: 'down' as const, value: 2 }
      },
      { 
        label: 'Resolved', 
        value: '5', 
        icon: 'check',
        tooltip: 'Number of incidents resolved this month'
      },
      { 
        label: 'Avg. Resolution', 
        value: '3.2 days', 
        icon: 'clock',
        tooltip: 'Average time to resolve incidents'
      },
      { 
        label: 'Critical Incidents', 
        value: '2', 
        icon: 'alert-circle',
        tooltip: 'Number of critical incidents requiring immediate attention',
        trend: { direction: 'up' as const, value: 1 }
      },
    ],
    insights: [
      'Financial loss peaked in March 2025 ($260K)',
      'Major data breach incident resolved last week'
    ],
    chartData: incidentManagementData,
    chartSeries: [
      { name: 'Incident Count', dataKey: 'count', color: '#8b5cf6' },
      { name: 'Financial Loss ($K)', dataKey: 'amount', color: '#ef4444' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'warning',
    actionText: 'View Incident Management',
    actionHref: '/incident-management',
    chartHeight: 200,
  },
  {
    id: 'scenario-analysis',
    title: 'Scenario Analysis',
    subtitle: 'Risk scenario modeling and simulation',
    icon: <Presentation className="h-5 w-5 text-primary" />,
    metrics: [
      { 
        label: 'Scenarios', 
        value: '5', 
        icon: 'lightbulb',
        tooltip: 'Total number of risk scenarios modeled'
      },
      { 
        label: 'Simulations Run', 
        value: '12', 
        icon: 'repeat',
        tooltip: 'Total number of simulations executed'
      },
      { 
        label: 'Coverage', 
        value: '60%', 
        icon: 'percent',
        tooltip: 'Percentage of high-impact processes covered by scenarios',
        trend: { direction: 'up' as const, value: 10 }
      },
      { 
        label: 'Avg. Loss', 
        value: '$75K', 
        icon: 'dollar-sign',
        tooltip: 'Average potential financial loss across all scenarios'
      },
    ],
    insights: [
      'Disaster recovery scenario indicates 20% potential revenue impact',
      '3 new simulations pending for Q1 2026'
    ],
    chartData: scenarioAnalysisData,
    chartSeries: [
      { name: 'Probability', dataKey: 'probability', color: '#0ea5e9' },
      { name: 'Impact', dataKey: 'impact', color: '#f97316' },
      { name: 'Size', dataKey: 'size', color: '#d946ef' }
    ],
    chartType: 'composed',
    xAxisKey: 'name',
    status: 'error',
    actionText: 'View Scenario Analysis',
    actionHref: '/scenario-analysis',
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
      "High-Severity Risks": "fmea-analysis",
      "Open Risks": "outlier-analysis",
      "Compliance Score": "gap-analysis",
      "Critical Process Steps": "process-discovery",
      "Total Potential Loss": "fmea-analysis?impact=financial",
      "Control Failures": "controls-testing",
      "Scenario Analysis": "scenario-analysis",
      "Risk Management": "fmea-analysis",
      "Potential Loss": "fmea-analysis?impact=financial",
      "Compliance": "compliance-monitoring",
    };
    
    const route = moduleMapping[title] || "fmea-analysis";
    
    toast.info(`Navigating to ${title} details...`);
    
    setTimeout(() => {
      
