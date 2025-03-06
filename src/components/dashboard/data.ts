
// Mock data for the dashboard components

export const lossEventsData = [
  { name: 'Jan 2025', value: 4, amount: 100000, events: 2 },
  { name: 'Feb 2025', value: 5, amount: 150000, events: 3 },
  { name: 'Mar 2025', value: 3, amount: 250000, events: 3 },
  { name: 'Apr 2025', value: 6, amount: 180000, events: 4 },
  { name: 'May 2025', value: 4, amount: 120000, events: 2 },
  { name: 'Jun 2025', value: 3, amount: 80000, events: 1 },
];

export const riskDistributionData = [
  { name: 'Operational', value: 35, count: 16, color: '#f97316' },
  { name: 'Credit', value: 25, count: 12, color: '#8b5cf6' },
  { name: 'Market', value: 15, count: 7, color: '#06b6d4' },
  { name: 'Compliance', value: 15, count: 7, color: '#10b981' },
  { name: 'Strategic', value: 10, count: 4, color: '#f59e0b' },
];

export const incidentSeverityData = [
  { name: 'Critical', value: 2 },
  { name: 'High', value: 5 },
  { name: 'Medium', value: 12 },
  { name: 'Low', value: 28 },
];

export const controlsHealthData = [
  { name: 'Passing', value: 85 },
  { name: 'Failing', value: 15 },
];

export const processDiscoveryData = [
  { name: 'Payment Processing', value: 32 },
  { name: 'Customer Onboarding', value: 24 },
  { name: 'Loan Applications', value: 18 },
  { name: 'Account Management', value: 16 },
  { name: 'Reporting', value: 10 },
];

export const outlierAnalysisData = [
  { name: 'Jan', count: 5, rate: 1.2 },
  { name: 'Feb', count: 8, rate: 1.8 },
  { name: 'Mar', count: 12, rate: 2.5 },
  { name: 'Apr', count: 7, rate: 1.5 },
  { name: 'May', count: 15, rate: 3.0 },
  { name: 'Jun', count: 10, rate: 2.0 },
];

export const predictiveRiskData = [
  { name: 'Fraud', probability: 0.7, impact: 85 },
  { name: 'Data Breach', probability: 0.4, impact: 95 },
  { name: 'System Failure', probability: 0.3, impact: 80 },
  { name: 'Compliance', probability: 0.5, impact: 70 },
  { name: 'Operations', probability: 0.6, impact: 60 },
];

export const gapAnalysisData = [
  { name: 'PCI-DSS', current: 75, target: 100 },
  { name: 'GDPR', current: 85, target: 100 },
  { name: 'SOX', current: 90, target: 100 },
  { name: 'ISO 27001', current: 65, target: 100 },
  { name: 'Basel III', current: 70, target: 100 },
];

export const moduleSummaryData = [
  {
    id: 'process-discovery',
    title: 'Process Discovery',
    description: 'Process mining and discovery insights',
    icon: 'GitBranch',
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
    icon: 'SearchX',
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
    icon: 'Shield',
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
    icon: 'CheckCheck',
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

export const placeholderModuleData = [
  {
    id: 'controls-testing',
    title: 'Controls Testing',
    description: 'Coming Soon: Automated controls testing and validation',
    icon: 'TestTube',
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
    icon: 'Presentation',
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
