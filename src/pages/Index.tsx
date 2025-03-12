import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import MetricCard from '@/components/dashboard/MetricCard';
import InfoWidget, { InfoWidgetData } from '@/components/dashboard/InfoWidget';
import Chart from '@/components/dashboard/Chart';
import RibbonNav from '@/components/dashboard/RibbonNav';
import AIRiskSummary from '@/components/dashboard/AIRiskSummary';
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
  BarChart4,
  FileText,
  Building,
  Users,
  Zap,
  Target,
  Briefcase,
  Database,
  Bell,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const emptyLossEventsData = [
  { name: 'Jan 2025', value: 0, amount: 0, events: 0 },
  { name: 'Feb 2025', value: 0, amount: 0, events: 0 },
  { name: 'Mar 2025', value: 0, amount: 0, events: 0 },
  { name: 'Apr 2025', value: 0, amount: 0, events: 0 },
  { name: 'May 2025', value: 0, amount: 0, events: 0 },
  { name: 'Jun 2025', value: 0, amount: 0, events: 0 },
];

const populatedLossEventsData = [
  { name: 'Jan 2025', value: 4, amount: 100000, events: 2 },
  { name: 'Feb 2025', value: 5, amount: 150000, events: 3 },
  { name: 'Mar 2025', value: 3, amount: 250000, events: 3 },
  { name: 'Apr 2025', value: 6, amount: 180000, events: 4 },
  { name: 'May 2025', value: 4, amount: 120000, events: 2 },
  { name: 'Jun 2025', value: 3, amount: 80000, events: 1 },
];

const emptyRiskDistributionData = [
  { name: 'Operational', value: 0, count: 0, color: '#f97316' },
  { name: 'Credit', value: 0, count: 0, color: '#8b5cf6' },
  { name: 'Market', value: 0, count: 0, color: '#06b6d4' },
  { name: 'Compliance', value: 0, count: 0, color: '#10b981' },
  { name: 'Strategic', value: 0, count: 0, color: '#f59e0b' },
];

const populatedRiskDistributionData = [
  { name: 'Operational', value: 35, count: 16, color: '#f97316' },
  { name: 'Credit', value: 25, count: 12, color: '#8b5cf6' },
  { name: 'Market', value: 15, count: 7, color: '#06b6d4' },
  { name: 'Compliance', value: 15, count: 7, color: '#10b981' },
  { name: 'Strategic', value: 10, count: 4, color: '#f59e0b' },
];

const emptyIncidentSeverityData = [
  { name: 'Critical', value: 0 },
  { name: 'High', value: 0 },
  { name: 'Medium', value: 0 },
  { name: 'Low', value: 0 },
];

const populatedIncidentSeverityData = [
  { name: 'Critical', value: 2 },
  { name: 'High', value: 5 },
  { name: 'Medium', value: 12 },
  { name: 'Low', value: 28 },
];

const emptyControlsHealthData = [{ name: 'No Data', value: 100 }];
const populatedControlsHealthData = [{ name: 'Passing', value: 85 }, { name: 'Failing', value: 15 }];

const emptyProcessDiscoveryData = [{ name: 'No Processes', value: 0 }];
const populatedProcessDiscoveryData = [
  { name: 'Payment Processing', value: 32 },
  { name: 'Customer Onboarding', value: 24 },
  { name: 'Loan Applications', value: 18 },
  { name: 'Account Management', value: 16 },
  { name: 'Reporting', value: 10 },
];

const emptyOutlierAnalysisData = Array(6).fill(0).map((_, idx) => ({ 
  name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx], 
  count: 0, 
  rate: 0 
}));

const populatedOutlierAnalysisData = [
  { name: 'Jan', count: 5, rate: 1.2 },
  { name: 'Feb', count: 8, rate: 1.8 },
  { name: 'Mar', count: 12, rate: 2.5 },
  { name: 'Apr', count: 7, rate: 1.5 },
  { name: 'May', count: 15, rate: 3.0 },
  { name: 'Jun', count: 10, rate: 2.0 },
];

const emptyPredictiveRiskData = [
  { name: 'Fraud', probability: 0, impact: 0 },
  { name: 'Data Breach', probability: 0, impact: 0 },
  { name: 'System Failure', probability: 0, impact: 0 },
  { name: 'Compliance', probability: 0, impact: 0 },
  { name: 'Operations', probability: 0, impact: 0 },
];

const populatedPredictiveRiskData = [
  { name: 'Fraud', probability: 0.7, impact: 85 },
  { name: 'Data Breach', probability: 0.4, impact: 95 },
  { name: 'System Failure', probability: 0.3, impact: 80 },
  { name: 'Compliance', probability: 0.5, impact: 70 },
  { name: 'Operations', probability: 0.6, impact: 60 },
];

const createEmptyInfoWidgetData = (): InfoWidgetData[] => {
  return [
    {
      id: 'fmea-analysis',
      title: 'Predictive Risk Analytics',
      subtitle: 'Risk Assessment Insights',
      icon: <Shield className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Open Risks', value: '0', icon: 'alert-triangle' },
        { label: 'High Severity', value: '0', icon: 'trending-up' },
        { label: 'Medium Severity', value: '0', icon: 'trending-up' },
        { label: 'Low Severity', value: '0', icon: 'trending-down' },
      ],
      insights: [
        'No risk data available yet',
        'Upload a file to see risk insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Value', dataKey: 'value', color: '#8b5cf6' }],
      chartType: 'composed',
      status: 'info',
      actionText: 'View Risk Analytics',
      actionHref: '/fmea-analysis',
      chartHeight: 200,
    },
    {
      id: 'outlier-analysis',
      title: 'Outlier Analysis',
      subtitle: 'Risk Prediction & Forecasting',
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Risk Score', value: '0', icon: 'gauge' },
        { label: 'Critical Risks', value: '0', icon: 'alert-triangle' },
        { label: 'High Impacts', value: '0', icon: 'trending-up' },
        { label: 'Mitigations', value: '0', icon: 'shield' },
      ],
      insights: [
        'No risk analytics data available yet',
        'Upload a file to see risk predictions'
      ],
      chartData: [],
      chartSeries: [{ name: 'Value', dataKey: 'value', color: '#f43f5e' }],
      chartType: 'line',
      status: 'info',
      actionText: 'View Predictive Analytics',
      actionHref: '/risk-analytics',
      chartHeight: 200,
    },
    {
      id: 'compliance-monitoring',
      title: 'Compliance Monitoring',
      subtitle: 'Regulatory Framework Status',
      icon: <FileText className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Overall Score', value: '0%', icon: 'activity' },
        { label: 'Frameworks', value: '0', icon: 'layers' },
        { label: 'Open Issues', value: '0', icon: 'alert-triangle' },
        { label: 'Tests Passing', value: '0%', icon: 'check-circle' },
      ],
      insights: [
        'No compliance data available yet',
        'Upload a file to see compliance insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Compliance', dataKey: 'value', color: '#10b981' }],
      chartType: 'bar',
      status: 'info',
      actionText: 'View Compliance Dashboard',
      actionHref: '/compliance-monitoring',
      chartHeight: 200,
    },
    {
      id: 'process-discovery',
      title: 'Process Mining',
      subtitle: 'Process Flow Analysis',
      icon: <GitBranch className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Processes', value: '0', icon: 'git-branch' },
        { label: 'Activities', value: '0', icon: 'box' },
        { label: 'Variations', value: '0', icon: 'git-merge' },
        { label: 'Bottlenecks', value: '0', icon: 'alert-triangle' },
      ],
      insights: [
        'No process data available yet',
        'Upload a file to see process insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Value', dataKey: 'value', color: '#0ea5e9' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Process Maps',
      actionHref: '/process-discovery',
      chartHeight: 200,
    },
    {
      id: 'controls-testing',
      title: 'Controls Monitoring',
      subtitle: 'Control Testing Results',
      icon: <TestTube className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Controls', value: '0', icon: 'shield' },
        { label: 'Failing', value: '0', icon: 'x-circle' },
        { label: 'Passing', value: '0', icon: 'check-circle' },
        { label: 'Untested', value: '0', icon: 'help-circle' },
      ],
      insights: [
        'No control data available yet',
        'Upload a file to see control insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Controls', dataKey: 'value', color: '#0ea5e9' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Controls Testing',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'incident-management',
      title: 'Incident Management',
      subtitle: 'Incident Tracking & Response',
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Open Incidents', value: '0', icon: 'alert-triangle' },
        { label: 'Critical', value: '0', icon: 'alert-circle' },
        { label: 'Avg Response', value: '0h', icon: 'clock' },
        { label: 'Resolved', value: '0', icon: 'check-circle' },
      ],
      insights: [
        'No incident data available yet',
        'Upload a file to see incident insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Incidents', dataKey: 'value', color: '#f97316' }],
      chartType: 'bar',
      status: 'info',
      actionText: 'View Incident Dashboard',
      actionHref: '/incident-management',
      chartHeight: 200,
    },
    {
      id: 'scenario-analysis',
      title: 'Scenario Modeling',
      subtitle: 'Risk Simulation Analysis',
      icon: <Presentation className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Scenarios', value: '0', icon: 'copy' },
        { label: 'Avg. Loss', value: '$0', icon: 'dollar-sign' },
        { label: 'Worst Case', value: '$0', icon: 'trending-up' },
        { label: 'VaR', value: '$0', icon: 'bar-chart' },
      ],
      insights: [
        'No scenario data available yet',
        'Upload a file to see scenario insights'
      ],
      chartData: [],
      chartSeries: [{ name: 'Scenarios', dataKey: 'value', color: '#f97316' }],
      chartType: 'composed',
      status: 'info',
      actionText: 'View Scenario Analysis',
      actionHref: '/scenario-analysis',
      chartHeight: 200,
    },
  ];
};

const createPopulatedInfoWidgetData = (): InfoWidgetData[] => {
  return [
    {
      id: 'fmea-analysis',
      title: 'Predictive Risk Analytics',
      subtitle: 'Risk Assessment Insights',
      icon: <Shield className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Open Risks', 
          value: '46', 
          icon: 'alert-triangle',
          tooltip: 'Total number of open risk items',
          trend: { direction: 'up', value: 5 }
        },
        { 
          label: 'High Severity', 
          value: '5', 
          icon: 'alert-triangle',
          tooltip: 'Number of high severity risks',
          trend: { direction: 'down', value: 2 }
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
        }
      ],
      insights: [
        'Payment fraud risk increased by 12% this month',
        'Data privacy risks require immediate attention'
      ],
      chartData: [
        { name: 'Fraud', probability: 0.3, impact: 85, size: 25 },
        { name: 'Data Breach', probability: 0.4, impact: 95, size: 38 },
        { name: 'System Failure', probability: 0.3, impact: 80, size: 24 },
        { name: 'Compliance', probability: 0.2, impact: 70, size: 14 },
        { name: 'Operations', probability: 0.1, impact: 60, size: 6 }
      ],
      chartSeries: [
        { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
        { name: 'Impact', dataKey: 'impact', color: '#ef4444' },
        { name: 'Size', dataKey: 'size', color: '#d946ef' }
      ],
      chartType: 'line',
      status: 'error',
      actionText: 'View Risk Analytics',
      actionHref: '/fmea-analysis',
      chartHeight: 200,
    },
    {
      id: 'outlier-analysis',
      title: 'Outlier Analysis',
      subtitle: 'Anomaly Detection and Unusual Patterns',
      icon: <SearchX className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Sequence Fails', 
          value: '18', 
          icon: 'activity',
          tooltip: 'Number of sequence failures',
          trend: { direction: 'up', value: 12 }
        },
        { 
          label: 'Timing Fails', 
          value: '3', 
          icon: 'clock',
          tooltip: 'Number of timing failures'
        },
        { 
          label: 'Rework Fails', 
          value: '94%', 
          icon: 'repeat',
          tooltip: 'Percentage of rework failures',
          trend: { direction: 'up', value: 3 }
        },
        { 
          label: 'Resource Outliers', 
          value: '5,120', 
          icon: 'users',
          tooltip: 'Number of resource outliers'
        }
      ],
      insights: [
        '5 new anomalies detected in the payment process',
        'Loan approval has unusual timestamp patterns'
      ],
      chartData: populatedOutlierAnalysisData,
      chartSeries: [
        { name: 'Anomaly Count', dataKey: 'count', color: '#f97316' },
        { name: 'Anomaly Rate (%)', dataKey: 'rate', color: '#3b82f6' }
      ],
      chartType: 'line',
      status: 'warning',
      actionText: 'View Outlier Analysis',
      actionHref: '/outlier-analysis',
      chartHeight: 200,
    },
    {
      id: 'compliance-monitoring',
      title: 'Compliance Monitoring',
      subtitle: 'Regulatory, Industry & Internal Policy Gaps',
      icon: <FileText className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Compliance Score', 
          value: '85%', 
          icon: 'activity',
          tooltip: 'Overall compliance score',
          trend: { direction: 'up', value: 5 }
        },
        { 
          label: 'Critical Gaps', 
          value: '3', 
          icon: 'alert-triangle',
          tooltip: 'Number of critical gaps',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Controls', 
          value: '124', 
          icon: 'shield',
          tooltip: 'Total number of controls'
        },
        { 
          label: 'Frameworks', 
          value: '8', 
          icon: 'layers',
          tooltip: 'Number of compliance frameworks'
        }
      ],
      insights: [
        'GDPR compliance score improved by 5% this quarter',
        'PCI-DSS has 2 new gaps requiring immediate action'
      ],
      chartData: [
        { name: 'PCI-DSS', current: 75, target: 100 },
        { name: 'GDPR', current: 85, target: 100 },
        { name: 'SOX', current: 90, target: 100 },
        { name: 'ISO 27001', current: 65, target: 100 },
        { name: 'Basel III', current: 70, target: 100 }
      ],
      chartSeries: [
        { name: 'Current Compliance', dataKey: 'current', color: '#0ea5e9' },
        { name: 'Target', dataKey: 'target', color: '#64748b' }
      ],
      chartType: 'bar',
      status: 'warning',
      actionText: 'View Compliance Monitoring',
      actionHref: '/compliance-monitoring',
      chartHeight: 200,
    },
    {
      id: 'process-discovery',
      title: 'Process Discovery',
      subtitle: 'End-End Process Insights',
      icon: <GitBranch className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Processes', 
          value: '24', 
          icon: 'git-branch',
          tooltip: 'Total number of processes',
          trend: { direction: 'up', value: 8 }
        },
        { 
          label: 'Critical Activities', 
          value: '158', 
          icon: 'activity',
          tooltip: 'Number of critical activities'
        },
        { 
          label: 'Objects', 
          value: '42', 
          icon: 'box',
          tooltip: 'Number of process objects'
        },
        { 
          label: 'Cases', 
          value: '2,453', 
          icon: 'folder',
          tooltip: 'Total number of cases'
        }
      ],
      insights: [
        'Payment processing has 3 bottlenecks identified',
        'Customer onboarding has 2 automation opportunities'
      ],
      chartData: populatedProcessDiscoveryData,
      chartSeries: [
        { name: 'Process Steps', dataKey: 'value', color: '#10b981' }
      ],
      chartType: 'pie',
      status: 'warning',
      actionText: 'View Process Discovery',
      actionHref: '/process-discovery',
      chartHeight: 200,
    },
    {
      id: 'controls-testing',
      title: 'Controls Testing',
      subtitle: 'Automated Controls Testing and Validation',
      icon: <TestTube className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Total Controls', 
          value: '124', 
          icon: 'shield',
          tooltip: 'Total number of controls'
        },
        { 
          label: 'Tested', 
          value: '80', 
          icon: 'check-circle',
          tooltip: 'Number of tested controls'
        },
        { 
          label: 'Pass Rate', 
          value: '85%', 
          icon: 'trending-up',
          tooltip: 'Control test pass rate',
          trend: { direction: 'up', value: 3 }
        },
        { 
          label: 'Fail Rate', 
          value: '15%', 
          icon: 'trending-down',
          tooltip: 'Control test fail rate',
          trend: { direction: 'down', value: 3 }
        }
      ],
      insights: [
        'No new controls tested this week (awaiting scheduling)',
        'Evidence collection automation in progress'
      ],
      chartData: populatedControlsHealthData,
      chartSeries: [
        { name: 'Controls', dataKey: 'value', color: '#10b981' }
      ],
      chartType: 'pie',
      status: 'warning',
      actionText: 'View Controls Testing',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'incident-management',
      title: 'Incident Management',
      subtitle: 'Loss Events and Issue Tracking',
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Open Incidents', 
          value: '10', 
          icon: 'alert-triangle',
          tooltip: 'Number of open incidents',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Resolved', 
          value: '5', 
          icon: 'check-circle',
          tooltip: 'Number of resolved incidents'
        },
        { 
          label: 'Avg. Resolution', 
          value: '3.2 days', 
          icon: 'clock',
          tooltip: 'Average incident resolution time'
        },
        { 
          label: 'Critical Incidents', 
          value: '2', 
          icon: 'alert-circle',
          tooltip: 'Number of critical incidents',
          trend: { direction: 'up', value: 1 }
        }
      ],
      insights: [
        'Financial loss peaked in March 2025 ($260K)',
        'Major data breach incident resolved last week'
      ],
      chartData: populatedLossEventsData,
      chartSeries: [
        { name: 'Incident Count', dataKey: 'events', color: '#a855f7' },
        { name: 'Financial Loss ($K)', dataKey: 'amount', color: '#ef4444', type: 'line' }
      ],
      chartType: 'composed',
      status: 'warning',
      actionText: 'View Incident Management',
      actionHref: '/incident-management',
      chartHeight: 200,
    },
    {
      id: 'scenario-analysis',
      title: 'Scenario Analysis',
      subtitle: 'Risk Scenario Modeling and Simulation',
      icon: <Presentation className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Scenarios', 
          value: '5', 
          icon: 'copy',
          tooltip: 'Number of risk scenarios'
        },
        { 
          label: 'Simulations Run', 
          value: '12', 
          icon: 'refresh-cw',
          tooltip: 'Number of simulations run'
        },
        { 
          label: 'Coverage', 
          value: '60%', 
          icon: 'pie-chart',
          tooltip: 'Scenario coverage',
          trend: { direction: 'up', value: 10 }
        },
        { 
          label: 'Avg. Loss', 
          value: '$75K', 
          icon: 'dollar-sign',
          tooltip: 'Average loss per scenario'
        }
      ],
      insights: [
        'Disaster recovery scenario indicates 20% potential revenue impact',
        '3 new simulations pending for Q1 2026'
      ],
      chartData: [
        { name: 'Data Breach', probability: 0.8, impact: 85, size: 68 },
        { name: 'System Failure', probability: 0.6, impact: 65, size: 39 },
        { name: 'Compliance', probability: 0.4, impact: 75, size: 30 },
        { name: 'Disaster Recovery', probability: 0.2, impact: 95, size: 19 },
        { name: 'Fraud', probability: 0.5, impact: 55, size: 27.5 }
      ],
      chartSeries: [
        { name: 'Probability', dataKey: 'probability', color: '#0ea5e9' },
        { name: 'Impact', dataKey: 'impact', color: '#f97316' },
        { name: 'Size', dataKey: 'size', color: '#8b5cf6' }
      ],
      chartType: 'line',
      status: 'error',
      actionText: 'View Scenario Analysis',
      actionHref: '/scenario-analysis',
      chartHeight: 200,
    }
  ];
};

const emptyAnnouncementsData = [];

const populatedAnnouncementsData = [
  {
    id: 'ann-1',
    title: 'New Compliance Framework Released',
    date: '2025-04-15',
    priority: 'high',
    category: 'compliance',
    description: 'A new compliance framework for banking regulations has been published. All processes should be reviewed for compliance.',
    link: '/compliance-monitoring'
  },
  {
    id: 'ann-2',
    title: 'Risk Assessment Schedule Update',
    date: '2025-04-10',
    priority: 'medium',
    category: 'risk',
    description: 'The quarterly risk assessment schedule has been updated. Please review the new deadlines.',
    link: '/fmea-analysis'
  },
  {
    id: 'ann-3',
    title: 'System Maintenance Notice',
    date: '2025-04-20',
    priority: 'low',
    category: 'system',
    description: 'Scheduled system maintenance will occur on April 20, 2025. The system will be unavailable from 2:00 AM to 4:00 AM EST.',
    link: '#'
  },
  {
    id: 'ann-4',
    title: 'New Controls Testing Procedure',
    date: '2025-04-05',
    priority: 'medium',
    category: 'controls',
    description: 'Updated testing procedures for operational controls have been published. Training sessions will be scheduled next week.',
    link: '/controls-testing'
  }
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [lossEventsData, setLossEventsData] = useState(emptyLossEventsData);
  const [riskDistributionData, setRiskDistributionData] = useState(emptyRiskDistributionData);
  const [incidentSeverityData, setIncidentSeverityData] = useState(emptyIncidentSeverityData);
  const [controlsHealthData, setControlsHealthData] = useState(emptyControlsHealthData);
  const [processDiscoveryData, setProcessDiscoveryData] = useState(emptyProcessDiscoveryData);
  const [outlierAnalysisData, setOutlierAnalysisData] = useState(emptyOutlierAnalysisData);
  const [predictiveRiskData, setPredictiveRiskData] = useState(emptyPredictiveRiskData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [announcements, setAnnouncements] = useState(emptyAnnouncementsData);
  
  const [infoWidgetData, setInfoWidgetData] = useState(createEmptyInfoWidgetData());
  
  useEffect(() => {
    const handleProcessDataUpdated = () => {
      setLossEventsData(populatedLossEventsData);
      setRiskDistributionData(populatedRiskDistributionData);
      setIncidentSeverityData(populatedIncidentSeverityData);
      setControlsHealthData(populatedControlsHealthData);
      setProcessDiscoveryData(populatedProcessDiscoveryData);
      setOutlierAnalysisData(populatedOutlierAnalysisData);
      setPredictiveRiskData(populatedPredictiveRiskData);
      setInfoWidgetData(createPopulatedInfoWidgetData());
      setAnnouncements(populatedAnnouncementsData);
      setDataLoaded(true);
      
      toast.success("Dashboard updated with process mining insights");
    };
    
    window.addEventListener('processDataUpdated', handleProcessDataUpdated);
    
    return () => {
      window.removeEventListener('processDataUpdated', handleProcessDataUpdated);
    };
  }, []);
  
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
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Real-time insights and analytics for operational risk management
        </p>
        
        <RibbonNav className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <MetricCard
            title="Severity Risks"
            value={dataLoaded ? "5" : "0"}
            severity="critical"
            icon={<Shield className="h-5 w-5" />}
            tooltip="Risks with critical or high severity ratings"
            trend={dataLoaded ? -2 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("High-Severity Risks")}
          />
          <MetricCard
            title="Open Risks"
            value={dataLoaded ? "46" : "0"}
            severity="medium"
            icon={<AlertTriangle className="h-5 w-5" />}
            tooltip="Total number of open risk items across all categories"
            trend={dataLoaded ? 8 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Open Risks")}
          />
          <MetricCard
            title="Compliance Score"
            value={dataLoaded ? "85%" : "0%"}
            severity="low"
            icon={<CheckCheck className="h-5 w-5" />}
            tooltip="Overall compliance score across all regulatory frameworks"
            trend={dataLoaded ? 5 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Compliance Score")}
          />
          <MetricCard
            title="Critical Process Steps"
            value={dataLoaded ? "24" : "0"}
            severity="medium"
            icon={<GitBranch className="h-5 w-5" />}
            tooltip="Active processes being monitored in the system"
            trend={dataLoaded ? 3 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Critical Process Steps")}
          />
          <MetricCard
            title="Total Potential Loss"
            value={dataLoaded ? "963K" : "0"}
            prefix="$"
            severity="high"
            icon={<DollarSign className="h-5 w-5" />}
            tooltip="Estimated financial impact of identified risks"
            trend={dataLoaded ? 15 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Total Potential Loss")}
          />
          <MetricCard
            title="Control Failures"
            value={dataLoaded ? "15%" : "0%"}
            severity="medium"
            icon={<TestTube className="h-5 w-5" />}
            tooltip="Percentage of control tests that failed"
            trend={dataLoaded ? -4 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Control Failures")}
          />
          <MetricCard
            title="Scenario Analysis"
            value={dataLoaded ? "14" : "0"}
            severity="low"
            icon={<Presentation className="h-5 w-5" />}
            tooltip="Number of risk scenarios modeled"
            trend={dataLoaded ? 6 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Scenario Analysis")}
          />
        </RibbonNav>
        
        <h2 className="text-xl font-semibold mb-4">Risk Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {infoWidgetData.map((widget) => (
            <InfoWidget 
              key={widget.id}
              data={widget}
              onClick={() => handleNavigate(widget.actionHref.replace('/', ''))}
              isLoading={loading}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            <AIRiskSummary isLoading={loading} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 mb-6">
          <div className="bg-white dark:bg-gray-950 border rounded-lg p-6">
            <h3 className="font-medium mb-4">Process Knowledge Graph</h3>
            <KnowledgeGraph animate={dataLoaded} />
          </div>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-primary mr-2" />
                  <CardTitle>Announcements</CardTitle>
                </div>
                <Badge variant="outline" className="font-normal">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>
              <CardDescription>Important updates and notices</CardDescription>
            </CardHeader>
            <CardContent>
              {dataLoaded ? (
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div 
                        key={announcement.id} 
                        className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={`ml-2 text-xs ${
                                  announcement.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                                  announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                  'bg-blue-100 text-blue-800 border-blue-300'
                                }`}
                              >
                                {announcement.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{announcement.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(announcement.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => navigate(announcement.link)}
                          >
                            View Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <p>No announcements at this time.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

