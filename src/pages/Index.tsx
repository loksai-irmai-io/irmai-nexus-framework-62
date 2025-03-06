
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import MetricCard from '@/components/dashboard/MetricCard';
import ModuleSummary from '@/components/dashboard/ModuleSummary';
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
  BarChart4,
  Network,
  Activity,
  Database,
  FileBarChart,
  Workflow,
  ClipboardList,
  ChevronRight
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
        
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Digital Twin Overview</h2>
          <div className="p-1 border border-primary/20 rounded-lg bg-primary/5">
            <KnowledgeGraph className="h-[400px] rounded-lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            This is your central data hub – all insights and interdependencies are sourced here.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
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
          
          <Chart 
            title="Risk Distribution by Category"
            description="Breakdown of risks by category or business unit"
            data={riskDistributionData}
            series={[{ name: 'Percentage', dataKey: 'value', color: '#0ea5e9' }]}
            type="pie"
            showPercentages={true}
            showLegend={true}
            height={300}
            tooltip="Click on any category to see detailed risk analysis for that segment"
            onClick={handleRiskCategoryClick}
          />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          Operational Risk Infographics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          {/* Infographic 1: Process Risk Landscape */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground flex items-center">
                  <Network className="mr-2 h-5 w-5 text-primary" />
                  Process Risk Landscape
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Unified view of business processes and associated risks</p>
            </div>
            
            <div className="p-4">
              <div className="h-[220px] flex justify-center items-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary z-20">
                    <span className="font-bold text-lg">Core Banking</span>
                  </div>
                  
                  {/* Process Nodes */}
                  <div className="absolute left-1/4 -translate-x-1/2 top-1/3 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-400 z-10">
                    <span className="text-sm text-center">Payment Processing</span>
                  </div>
                  
                  <div className="absolute right-1/4 translate-x-1/2 top-1/3 -translate-y-1/2 w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-400 z-10">
                    <span className="text-sm text-center">Customer Onboarding</span>
                  </div>
                  
                  <div className="absolute left-1/3 -translate-x-1/2 bottom-6 w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-400 z-10">
                    <span className="text-sm text-center">Transaction Monitoring</span>
                  </div>
                  
                  <div className="absolute right-1/3 translate-x-1/2 bottom-6 w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-2 border-orange-400 z-10">
                    <span className="text-sm text-center">Loan Approval</span>
                  </div>
                  
                  {/* Risk Tags */}
                  <div className="absolute left-[20%] top-[20%] bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs border border-red-400">
                    Fraud Risk
                  </div>
                  
                  <div className="absolute right-[20%] top-[20%] bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-400">
                    Data Security
                  </div>
                  
                  <div className="absolute left-[25%] bottom-[15%] bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs border border-red-400">
                    AML Risk
                  </div>
                  
                  <div className="absolute right-[25%] bottom-[15%] bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-400">
                    Credit Risk
                  </div>
                  
                  {/* Connection Lines - We use borders to create lines */}
                  <div className="absolute w-[40%] h-[1px] bg-gray-300 dark:bg-gray-600 left-[30%] top-[50%]"></div>
                  <div className="absolute w-[1px] h-[30%] bg-gray-300 dark:bg-gray-600 left-[30%] top-[50%]"></div>
                  <div className="absolute w-[1px] h-[30%] bg-gray-300 dark:bg-gray-600 right-[30%] top-[50%]"></div>
                  <div className="absolute w-[15%] h-[1px] bg-gray-300 dark:bg-gray-600 left-[35%] bottom-[30%]"></div>
                  <div className="absolute w-[15%] h-[1px] bg-gray-300 dark:bg-gray-600 right-[35%] bottom-[30%]"></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Top Process</div>
                  <div className="font-medium">Payment Processing</div>
                  <div className="text-xs text-red-600">5 High Risks</div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Critical Risk</div>
                  <div className="font-medium">Fraud Detection</div>
                  <div className="text-xs text-amber-600">3 Controls Failing</div>
                </div>
              </div>
              
              <div className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                onClick={() => handleNavigate('process-discovery')}
              >
                <span>View Process Risk Map</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* Infographic 2: Risk Control Matrix */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Risk Control Matrix
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Heatmap of risk coverage by control effectiveness</p>
            </div>
            
            <div className="p-4">
              <div className="h-[220px] flex justify-center items-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full h-full">
                  {/* Top Labels */}
                  <div className="col-start-2 col-span-4 flex justify-between items-center text-xs text-muted-foreground pb-1">
                    <span>Low</span>
                    <span>Control Effectiveness</span>
                    <span>High</span>
                  </div>
                  
                  {/* Left Label - Risk Impact */}
                  <div className="row-start-2 row-span-4 flex flex-col justify-between items-center text-xs text-muted-foreground pr-1 writing-mode-vertical">
                    <span className="transform -rotate-90 origin-bottom-left translate-y-6 whitespace-nowrap">High</span>
                    <span className="transform -rotate-90 origin-center whitespace-nowrap">Risk Impact</span>
                    <span className="transform -rotate-90 origin-top-left -translate-y-6 whitespace-nowrap">Low</span>
                  </div>
                  
                  {/* Heatmap Cells */}
                  {/* Critical zone */}
                  <div className="bg-red-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'critical', effectiveness: 'low' })}>
                    3
                  </div>
                  <div className="bg-red-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'critical', effectiveness: 'medium-low' })}>
                    2
                  </div>
                  <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'critical', effectiveness: 'medium' })}>
                    1
                  </div>
                  <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'critical', effectiveness: 'high' })}>
                    0
                  </div>
                  
                  {/* High zone */}
                  <div className="bg-red-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'high', effectiveness: 'low' })}>
                    4
                  </div>
                  <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'high', effectiveness: 'medium-low' })}>
                    5
                  </div>
                  <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'high', effectiveness: 'medium' })}>
                    3
                  </div>
                  <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'high', effectiveness: 'high' })}>
                    1
                  </div>
                  
                  {/* Medium zone */}
                  <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'medium', effectiveness: 'low' })}>
                    7
                  </div>
                  <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'medium', effectiveness: 'medium-low' })}>
                    6
                  </div>
                  <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'medium', effectiveness: 'medium' })}>
                    4
                  </div>
                  <div className="bg-green-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'medium', effectiveness: 'high' })}>
                    2
                  </div>
                  
                  {/* Low zone */}
                  <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'low', effectiveness: 'low' })}>
                    5
                  </div>
                  <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'low', effectiveness: 'medium-low' })}>
                    3
                  </div>
                  <div className="bg-green-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'low', effectiveness: 'medium' })}>
                    2
                  </div>
                  <div className="bg-green-700 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
                    onClick={() => handleNavigate('fmea-analysis', { severity: 'low', effectiveness: 'high' })}>
                    1
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Critical Area</div>
                  <div className="font-medium">9 High Impact Risks</div>
                  <div className="text-xs text-red-600">Low Control Coverage</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Well Controlled</div>
                  <div className="font-medium">11 Risks</div>
                  <div className="text-xs text-green-600">Strong Controls</div>
                </div>
              </div>
              
              <div className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                onClick={() => handleNavigate('fmea-analysis')}
              >
                <span>View Risk Analysis</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* Infographic 3: Compliance Framework */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                  Regulatory Compliance
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Compliance status across key regulatory frameworks</p>
            </div>
            
            <div className="p-4">
              <div className="h-[220px] flex flex-col justify-around">
                {/* Compliance Bar Chart */}
                <div className="flex items-end h-[140px] justify-around">
                  <div className="flex flex-col items-center" onClick={() => handleNavigate('compliance-monitoring', { framework: 'PCI-DSS' })}>
                    <div className="h-[75px] w-12 bg-amber-500 rounded-t hover:bg-amber-400 cursor-pointer"></div>
                    <div className="mt-1 text-xs">PCI-DSS</div>
                    <div className="text-xs font-semibold">75%</div>
                  </div>
                  
                  <div className="flex flex-col items-center" onClick={() => handleNavigate('compliance-monitoring', { framework: 'GDPR' })}>
                    <div className="h-[85px] w-12 bg-green-500 rounded-t hover:bg-green-400 cursor-pointer"></div>
                    <div className="mt-1 text-xs">GDPR</div>
                    <div className="text-xs font-semibold">85%</div>
                  </div>
                  
                  <div className="flex flex-col items-center" onClick={() => handleNavigate('compliance-monitoring', { framework: 'SOX' })}>
                    <div className="h-[90px] w-12 bg-green-600 rounded-t hover:bg-green-500 cursor-pointer"></div>
                    <div className="mt-1 text-xs">SOX</div>
                    <div className="text-xs font-semibold">90%</div>
                  </div>
                  
                  <div className="flex flex-col items-center" onClick={() => handleNavigate('compliance-monitoring', { framework: 'ISO-27001' })}>
                    <div className="h-[65px] w-12 bg-amber-500 rounded-t hover:bg-amber-400 cursor-pointer"></div>
                    <div className="mt-1 text-xs">ISO</div>
                    <div className="text-xs font-semibold">65%</div>
                  </div>
                  
                  <div className="flex flex-col items-center" onClick={() => handleNavigate('compliance-monitoring', { framework: 'Basel-III' })}>
                    <div className="h-[70px] w-12 bg-amber-500 rounded-t hover:bg-amber-400 cursor-pointer"></div>
                    <div className="mt-1 text-xs">Basel</div>
                    <div className="text-xs font-semibold">70%</div>
                  </div>
                </div>
                
                {/* Target Line */}
                <div className="flex items-center w-full">
                  <div className="w-full h-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="whitespace-nowrap text-xs ml-2 text-muted-foreground">Target: 100%</div>
                </div>
                
                {/* Overall Score */}
                <div className="flex justify-center mt-2">
                  <div className="flex items-center px-4 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <span className="text-sm">Overall Score:</span>
                    <span className="text-sm font-bold ml-2">85%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Critical Gaps</div>
                  <div className="font-medium">ISO 27001: 3 Controls</div>
                  <div className="text-xs text-red-600">Due in 14 days</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Improvement</div>
                  <div className="font-medium">GDPR: +5%</div>
                  <div className="text-xs text-green-600">This quarter</div>
                </div>
              </div>
              
              <div className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                onClick={() => handleNavigate('compliance-monitoring')}
              >
                <span>View Compliance Details</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* Infographic 4: Process Anomaly Detection */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground flex items-center">
                  <Database className="mr-2 h-5 w-5 text-primary" />
                  Anomaly Detection
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Real-time process anomalies and outlier analysis</p>
            </div>
            
            <div className="p-4">
              <div className="h-[220px] flex justify-center items-center">
                <div className="relative w-full h-full flex flex-col">
                  {/* Timeline with Anomalies */}
                  <div className="flex flex-col justify-between h-full">
                    {/* Process Flow Line */}
                    <div className="flex-1 flex items-center">
                      <div className="w-full h-px bg-gray-300 dark:bg-gray-600 relative">
                        {/* Normal Events */}
                        <div className="absolute -top-1.5 left-[10%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '10%' })}></div>
                        <div className="absolute -top-1.5 left-[20%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '20%' })}></div>
                        <div className="absolute -top-1.5 left-[30%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '30%' })}></div>
                        <div className="absolute -top-1.5 left-[50%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '50%' })}></div>
                        <div className="absolute -top-1.5 left-[70%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '70%' })}></div>
                        <div className="absolute -top-1.5 left-[85%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'normal', position: '85%' })}></div>
                        
                        {/* Anomalies */}
                        <div className="absolute -top-3 left-[40%] w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'anomaly', severity: 'high', position: '40%' })}>!</div>
                        
                        <div className="absolute -top-3 left-[60%] w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'anomaly', severity: 'medium', position: '60%' })}>!</div>
                        
                        <div className="absolute -top-3 left-[90%] w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                          onClick={() => handleNavigate('outlier-analysis', { type: 'anomaly', severity: 'high', position: '90%' })}>!</div>
                      </div>
                    </div>
                    
                    {/* Process Steps */}
                    <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
                      <span>Start</span>
                      <span>KYC</span>
                      <span>Risk Check</span>
                      <span>Approval</span>
                      <span>End</span>
                    </div>
                    
                    {/* Anomaly Details */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border">
                      <div className="text-xs font-medium mb-2">Detected Anomalies</div>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="flex-1">Risk Check - Bypass Detected (5 cases)</span>
                          <span className="text-red-500 font-medium">High</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <span className="flex-1">Approval - Unusually Fast (12 cases)</span>
                          <span className="text-amber-500 font-medium">Medium</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="flex-1">End - Missing Documentation (8 cases)</span>
                          <span className="text-red-500 font-medium">High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Critical Anomaly</div>
                  <div className="font-medium">Risk Check Bypass</div>
                  <div className="text-xs text-red-600">Potential Fraud</div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Trend</div>
                  <div className="font-medium">18 New Outliers</div>
                  <div className="text-xs text-blue-600">This month</div>
                </div>
              </div>
              
              <div className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                onClick={() => handleNavigate('outlier-analysis')}
              >
                <span>View Anomaly Detection</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 animate-fade-in" style={{ animationDelay: '800ms' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
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
            onClick={(data) => handleNavigate('incident-management', { severity: String(data.name).toLowerCase() })}
          />
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
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
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
