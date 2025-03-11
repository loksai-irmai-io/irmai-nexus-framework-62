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
  BarChart4
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const emptyLossEventsData = [
  { name: 'Jan 2025', value: 0, amount: 0, events: 0 },
  { name: 'Feb 2025', value: 0, amount: 0, events: 0 },
  { name: 'Mar 2025', value: 0, amount: 0, events: 0 },
  { name: 'Apr 2025', value: 0, amount: 0, events: 0 },
  { name: 'May 2025', value: 0, amount: 0, events: 0 },
  { name: 'Jun 2025', value: 0, amount: 0, events: 0 },
];

const emptyRiskDistributionData = [
  { name: 'Operational', value: 0, count: 0, color: '#f97316' },
  { name: 'Credit', value: 0, count: 0, color: '#8b5cf6' },
  { name: 'Market', value: 0, count: 0, color: '#06b6d4' },
  { name: 'Compliance', value: 0, count: 0, color: '#10b981' },
  { name: 'Strategic', value: 0, count: 0, color: '#f59e0b' },
];

const populatedLossEventsData = [
  { name: 'Jan 2025', value: 4, amount: 100000, events: 2 },
  { name: 'Feb 2025', value: 5, amount: 150000, events: 3 },
  { name: 'Mar 2025', value: 3, amount: 250000, events: 3 },
  { name: 'Apr 2025', value: 6, amount: 180000, events: 4 },
  { name: 'May 2025', value: 4, amount: 120000, events: 2 },
  { name: 'Jun 2025', value: 3, amount: 80000, events: 1 },
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

// Control Effectiveness Data
const emptyControlEffectivenessData = [
  { name: 'No Data', value: 100 }
];

const populatedControlEffectivenessData = [
  { name: 'Effective', value: 65 },
  { name: 'Partially Effective', value: 25 },
  { name: 'Ineffective', value: 10 }
];

// Risk Trend Analysis Data
const emptyRiskTrendData = Array(6).fill(0).map((_, idx) => ({
  name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx],
  high: 0,
  medium: 0,
  low: 0
}));

const populatedRiskTrendData = [
  { name: 'Jan', high: 3, medium: 7, low: 12 },
  { name: 'Feb', high: 5, medium: 8, low: 14 },
  { name: 'Mar', high: 4, medium: 10, low: 15 },
  { name: 'Apr', high: 3, medium: 9, low: 17 },
  { name: 'May', high: 5, medium: 11, low: 14 },
  { name: 'Jun', high: 4, medium: 10, low: 13 }
];

// Risk Maturity Assessment Data
const emptyRiskMaturityData = [
  { name: 'Risk Culture', value: 0 },
  { name: 'Risk Governance', value: 0 },
  { name: 'Risk Assessment', value: 0 },
  { name: 'Risk Response', value: 0 },
  { name: 'Risk Monitoring', value: 0 }
];

const populatedRiskMaturityData = [
  { name: 'Risk Culture', value: 3.2 },
  { name: 'Risk Governance', value: 4.1 },
  { name: 'Risk Assessment', value: 3.5 },
  { name: 'Risk Response', value: 2.8 },
  { name: 'Risk Monitoring', value: 3.7 }
];

// Risk Treatment Progress Data
const emptyRiskTreatmentData = [
  { name: 'No Data', value: 100 }
];

const populatedRiskTreatmentData = [
  { name: 'Completed', value: 35 },
  { name: 'In Progress', value: 45 },
  { name: 'Not Started', value: 20 }
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
      chartSeries: [],
      chartType: 'composed',
      status: 'info',
      actionText: 'View Risk Analytics',
      actionHref: '/fmea-analysis',
      chartHeight: 200,
    },
    {
      id: 'control-effectiveness',
      title: 'Control Effectiveness',
      subtitle: 'Control Performance Overview',
      icon: <CheckCheck className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Effective', value: '0%', icon: 'circle-check' },
        { label: 'Partially', value: '0%', icon: 'trending-up' },
        { label: 'Ineffective', value: '0%', icon: 'trending-down' },
        { label: 'Total Controls', value: '0', icon: 'gauge' },
      ],
      insights: [
        'No control data available yet',
        'Upload a file to see control insights'
      ],
      chartData: emptyControlEffectivenessData,
      chartSeries: [{ name: 'Percentage', dataKey: 'value', color: '#4ade80' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Control Details',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'risk-trend-analysis',
      title: 'Risk Trend Analysis',
      subtitle: 'Risk Level Trends Over Time',
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'High Risks', value: '0', icon: 'trending-up' },
        { label: 'Medium Risks', value: '0', icon: 'trending-up' },
        { label: 'Low Risks', value: '0', icon: 'trending-down' },
        { label: 'Risk Score', value: '0', icon: 'gauge' },
      ],
      insights: [
        'No trend data available yet',
        'Upload a file to see risk trends'
      ],
      chartData: emptyRiskTrendData,
      chartSeries: [
        { name: 'High', dataKey: 'high', color: '#ef4444' },
        { name: 'Medium', dataKey: 'medium', color: '#f97316' },
        { name: 'Low', dataKey: 'low', color: '#22c55e' },
      ],
      chartType: 'line',
      xAxisKey: 'name',
      status: 'info',
      actionText: 'View Trend Details',
      actionHref: '/fmea-analysis',
      chartHeight: 200,
    },
    {
      id: 'risk-maturity',
      title: 'Risk Maturity Assessment',
      subtitle: 'Maturity Level by Category',
      icon: <Gauge className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Overall Score', value: '0', icon: 'gauge' },
        { label: 'Highest Area', value: 'N/A', icon: 'trending-up' },
        { label: 'Lowest Area', value: 'N/A', icon: 'trending-down' },
        { label: 'Target Score', value: '4.0', icon: 'check' },
      ],
      insights: [
        'No maturity data available yet',
        'Upload a file to see maturity assessment'
      ],
      chartData: emptyRiskMaturityData,
      chartSeries: [{ name: 'Score', dataKey: 'value', color: '#8b5cf6' }],
      chartType: 'bar',
      xAxisKey: 'name',
      status: 'info',
      actionText: 'View Maturity Details',
      actionHref: '/gap-analysis',
      chartHeight: 200,
    },
    {
      id: 'risk-treatment',
      title: 'Risk Treatment Progress',
      subtitle: 'Status of Mitigation Actions',
      icon: <TestTube className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Completed', value: '0%', icon: 'check' },
        { label: 'In Progress', value: '0%', icon: 'trending-up' },
        { label: 'Not Started', value: '0%', icon: 'circle' },
        { label: 'Total Actions', value: '0', icon: 'activity' },
      ],
      insights: [
        'No treatment data available yet',
        'Upload a file to see treatment progress'
      ],
      chartData: emptyRiskTreatmentData,
      chartSeries: [{ name: 'Percentage', dataKey: 'value', color: '#06b6d4' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Treatment Details',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'incident-severity',
      title: 'Incident Severity Distribution',
      subtitle: 'Breakdown by Impact Level',
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Critical', value: '0', icon: 'trending-up' },
        { label: 'High', value: '0', icon: 'trending-up' },
        { label: 'Medium', value: '0', icon: 'trending-up' },
        { label: 'Low', value: '0', icon: 'trending-down' },
      ],
      insights: [
        'No incident data available yet',
        'Upload a file to see incident insights'
      ],
      chartData: emptyIncidentSeverityData,
      chartSeries: [{ name: 'Count', dataKey: 'value', color: '#f97316' }],
      chartType: 'bar',
      xAxisKey: 'name',
      status: 'info',
      actionText: 'View Incident Details',
      actionHref: '/incident-management',
      chartHeight: 200,
    },
    {
      id: 'process-discovery',
      title: 'Process Discovery',
      subtitle: 'Discovered Process Analysis',
      icon: <GitBranch className="h-5 w-5 text-primary" />,
      metrics: [
        { label: 'Processes', value: '0', icon: 'git-branch' },
        { label: 'Activities', value: '0', icon: 'activity' },
        { label: 'Critical Paths', value: '0', icon: 'alert-triangle' },
        { label: 'Bottlenecks', value: '0', icon: 'trending-down' },
      ],
      insights: [
        'No process data available yet',
        'Upload a file to see process insights'
      ],
      chartData: emptyProcessDiscoveryData,
      chartSeries: [{ name: 'Count', dataKey: 'value', color: '#8b5cf6' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Process Analysis',
      actionHref: '/process-discovery',
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
          icon: 'trending-up',
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
        },
      ],
      insights: [
        'Payment fraud risk increased by 12% this month',
        'Data privacy risks require immediate attention'
      ],
      chartData: [
        { name: 'Fraud', probability: 70, impact: 85, size: 60 },
        { name: 'Data Breach', probability: 40, impact: 95, size: 38 },
        { name: 'System Failure', probability: 30, impact: 80, size: 24 },
        { name: 'Compliance', probability: 50, impact: 70, size: 35 },
        { name: 'Operations', probability: 60, impact: 60, size: 36 }
      ],
      chartSeries: [
        { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
        { name: 'Impact', dataKey: 'impact', color: '#ef4444' }
      ],
      chartType: 'bar',
      status: 'error',
      actionText: 'View Risk Analytics',
      actionHref: '/fmea-analysis',
      xAxisKey: 'name'
    },
    {
      id: 'control-effectiveness',
      title: 'Control Effectiveness',
      subtitle: 'Control Performance Overview',
      icon: <CheckCheck className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Effective', 
          value: '65%', 
          icon: 'circle-check',
          tooltip: 'Percentage of fully effective controls',
          trend: { direction: 'up', value: 3 }
        },
        { 
          label: 'Partially', 
          value: '25%', 
          icon: 'trending-up',
          tooltip: 'Percentage of partially effective controls',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Ineffective', 
          value: '10%', 
          icon: 'trending-down',
          tooltip: 'Percentage of ineffective controls',
          trend: { direction: 'down', value: 5 }
        },
        { 
          label: 'Total Controls', 
          value: '124', 
          icon: 'gauge',
          tooltip: 'Total number of controls'
        },
      ],
      insights: [
        'Control effectiveness up 3% from previous quarter',
        'IT controls show highest improvement rate'
      ],
      chartData: populatedControlEffectivenessData,
      chartSeries: [{ name: 'Percentage', dataKey: 'value', color: '#4ade80' }],
      chartType: 'pie',
      status: 'success',
      actionText: 'View Control Details',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'risk-trend-analysis',
      title: 'Risk Trend Analysis',
      subtitle: 'Risk Level Trends Over Time',
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'High Risks', 
          value: '5', 
          icon: 'trending-up',
          tooltip: 'Current high severity risks',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Medium Risks', 
          value: '18', 
          icon: 'trending-up',
          tooltip: 'Current medium severity risks',
          trend: { direction: 'up', value: 3 }
        },
        { 
          label: 'Low Risks', 
          value: '23', 
          icon: 'trending-down',
          tooltip: 'Current low severity risks',
          trend: { direction: 'up', value: 1 }
        },
        { 
          label: 'Risk Score', 
          value: '3.2', 
          icon: 'gauge',
          tooltip: 'Overall weighted risk score'
        },
      ],
      insights: [
        'High severity risks are trending down',
        'June showed decrease in overall risk exposure'
      ],
      chartData: populatedRiskTrendData,
      chartSeries: [
        { name: 'High', dataKey: 'high', color: '#ef4444' },
        { name: 'Medium', dataKey: 'medium', color: '#f97316' },
        { name: 'Low', dataKey: 'low', color: '#22c55e' },
      ],
      chartType: 'line',
      xAxisKey: 'name',
      status: 'warning',
      actionText: 'View Trend Details',
      actionHref: '/fmea-analysis',
      chartHeight: 200,
    },
    {
      id: 'risk-maturity',
      title: 'Risk Maturity Assessment',
      subtitle: 'Maturity Level by Category',
      icon: <Gauge className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Overall Score', 
          value: '3.5', 
          icon: 'gauge',
          tooltip: 'Average maturity score (1-5)',
          trend: { direction: 'up', value: 10 }
        },
        { 
          label: 'Highest Area', 
          value: 'Governance', 
          icon: 'trending-up',
          tooltip: 'Category with highest maturity'
        },
        { 
          label: 'Lowest Area', 
          value: 'Response', 
          icon: 'trending-down',
          tooltip: 'Category with lowest maturity'
        },
        { 
          label: 'Target Score', 
          value: '4.0', 
          icon: 'check',
          tooltip: 'Target maturity level'
        },
      ],
      insights: [
        'Risk governance has highest maturity score',
        'Risk response processes need improvement'
      ],
      chartData: populatedRiskMaturityData,
      chartSeries: [{ name: 'Score', dataKey: 'value', color: '#8b5cf6' }],
      chartType: 'bar',
      xAxisKey: 'name',
      status: 'warning',
      actionText: 'View Maturity Details',
      actionHref: '/gap-analysis',
      chartHeight: 200,
    },
    {
      id: 'risk-treatment',
      title: 'Risk Treatment Progress',
      subtitle: 'Status of Mitigation Actions',
      icon: <TestTube className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Completed', 
          value: '35%', 
          icon: 'check',
          tooltip: 'Percentage of completed actions',
          trend: { direction: 'up', value: 5 }
        },
        { 
          label: 'In Progress', 
          value: '45%', 
          icon: 'trending-up',
          tooltip: 'Percentage of in-progress actions',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Not Started', 
          value: '20%', 
          icon: 'circle',
          tooltip: 'Percentage of not started actions',
          trend: { direction: 'down', value: 3 }
        },
        { 
          label: 'Total Actions', 
          value: '84', 
          icon: 'activity',
          tooltip: 'Total mitigation actions'
        },
      ],
      insights: [
        'Completion rate increased 5% since last month',
        'High-risk issues being addressed with priority'
      ],
      chartData: populatedRiskTreatmentData,
      chartSeries: [{ name: 'Percentage', dataKey: 'value', color: '#06b6d4' }],
      chartType: 'pie',
      status: 'warning',
      actionText: 'View Treatment Details',
      actionHref: '/controls-testing',
      chartHeight: 200,
    },
    {
      id: 'incident-severity',
      title: 'Incident Severity Distribution',
      subtitle: 'Breakdown by Impact Level',
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Critical', 
          value: '2', 
          icon: 'trending-up',
          tooltip: 'Critical severity incidents',
          trend: { direction: 'neutral', value: 0 }
        },
        { 
          label: 'High', 
          value: '5', 
          icon: 'trending-up',
          tooltip: 'High severity incidents',
          trend: { direction: 'down', value: 2 }
        },
        { 
          label: 'Medium', 
          value: '12', 
          icon: 'trending-up',
          tooltip: 'Medium severity incidents',
          trend: { direction: 'up', value: 1 }
        },
        { 
          label: 'Low', 
          value: '28', 
          icon: 'trending-down',
          tooltip: 'Low severity incidents',
          trend: { direction: 'up', value: 3 }
        },
      ],
      insights: [
        'Critical incidents require immediate action',
        'Incident reporting compliance at 94%'
      ],
      chartData: populatedIncidentSeverityData,
      chartSeries: [{ name: 'Count', dataKey: 'value', color: '#f97316' }],
      chartType: 'bar',
      xAxisKey: 'name',
      status: 'error',
      actionText: 'View Incident Details',
      actionHref: '/incident-management',
      chartHeight: 200,
    },
    {
      id: 'process-discovery',
      title: 'Process Discovery',
      subtitle: 'Discovered Process Analysis',
      icon: <GitBranch className="h-5 w-5 text-primary" />,
      metrics: [
        { 
          label: 'Processes', 
          value: '5', 
          icon: 'git-branch',
          tooltip: 'Discovered core processes'
        },
        { 
          label: 'Activities', 
          value: '32', 
          icon: 'activity',
          tooltip: 'Total process activities'
        },
        { 
          label: 'Critical Paths', 
          value: '3', 
          icon: 'alert-triangle',
          tooltip: 'High-risk process paths'
        },
        { 
          label: 'Bottlenecks', 
          value: '4', 
          icon: 'trending-down',
          tooltip: 'Identified process bottlenecks'
        },
      ],
      insights: [
        'Payment processing has most automation potential',
        'Customer onboarding has highest exception rate'
      ],
      chartData: populatedProcessDiscoveryData,
      chartSeries: [{ name: 'Count', dataKey: 'value', color: '#8b5cf6' }],
      chartType: 'pie',
      status: 'info',
      actionText: 'View Process Analysis',
      actionHref: '/process-discovery',
      chartHeight: 200,
    },
  ];
};

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
  const [infoWidgetData, setInfoWidgetData] = useState(createEmptyInfoWidgetData());
  const [dataLoaded, setDataLoaded] = useState(false);
  
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
            title="High-Severity Risks"
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
            tooltip="Estimated financial impact of all identified risks"
            trend={dataLoaded ? 12 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Potential Loss")}
          />
          <MetricCard
            title="Control Failures"
            value={dataLoaded ? "15%" : "0%"}
            severity="medium"
            icon={<Gauge className="h-5 w-5" />}
            tooltip="Percentage of control models that have failed testing"
            trend={dataLoaded ? -3 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Control Failures")}
          />
          <MetricCard
            title="Scenario Analysis"
            value={dataLoaded ? "3.2M" : "0"}
            prefix="$"
            severity="high"
            icon={<BarChart4 className="h-5 w-5" />}
            tooltip="Projected loss based on current scenario analysis"
            trend={dataLoaded ? 8 : undefined}
            isLoading={loading}
            onClick={() => handleMetricClick("Scenario Analysis")}
          />
        </RibbonNav>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          Risk Insights
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
          <AIRiskSummary />
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
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
          Digital Twin Overview
        </h2>
        <div className="grid grid-cols-1 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '1300ms' }}>
          <div className="w-full">
            <div className="p-1 border border-primary/20 rounded-lg bg-primary/5">
              <div className="relative w-full aspect-video sm:aspect-[16/9] xl:aspect-[21/9] overflow-hidden rounded-lg">
                <KnowledgeGraph className="w-full h-full" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 italic">
              <span>This is your central data hub – all insights and interdependencies are sourced here.</span>
            </p>
          </div>
        </div>
        
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '1100ms' }}>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 animate-fade-in">
            Announcements & Tips
          </h2>
          <div className="bg-card rounded-lg border shadow-sm p-4">
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
      </div>
    </Layout>
  );
};

export default Index;

