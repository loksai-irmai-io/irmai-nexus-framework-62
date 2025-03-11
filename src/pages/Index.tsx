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
      chartData: populatedPredictiveRiskData.map(item => ({
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
  ];
};

// Add the new chart data for the Risk Insights section
const emptyControlEffectivenessData = [{ name: 'No Data', value: 100 }];
const populatedControlEffectivenessData = [
  { name: 'Fully Effective', value: 45 },
  { name: 'Partially Effective', value: 35 },
  { name: 'Needs Improvement', value: 20 }
];

const emptyRiskTrendData = Array(6).fill(0).map((_, idx) => ({ 
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx], 
  current: 0, 
  previous: 0 
}));

const populatedRiskTrendData = [
  { month: 'Jan', current: 65, previous: 70 },
  { month: 'Feb', current: 58, previous: 62 },
  { month: 'Mar', current: 70, previous: 65 },
  { month: 'Apr', current: 84, previous: 75 },
  { month: 'May', current: 72, previous: 80 },
  { month: 'Jun', current: 76, previous: 72 }
];

const emptyRiskMaturityData = [{ category: 'No Data', score: 0 }];
const populatedRiskMaturityData = [
  { category: 'Policy', score: 85 },
  { category: 'Process', score: 72 },
  { category: 'Technology', score: 68 },
  { category: 'People', score: 76 },
  { category: 'Governance', score: 82 }
];

const emptyRiskTreatmentData = [{ status: 'No Data', value: 100 }];
const populatedRiskTreatmentData = [
  { status: 'Completed', value: 45 },
  { status: 'In Progress', value: 35 },
  { status: 'Not Started', value: 20 }
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
  const [infoWidgetData, setInfoWidgetData] = useState(createEmptyInfoWidgetData());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [controlEffectivenessData, setControlEffectivenessData] = useState(emptyControlEffectivenessData);
  const [riskTrendData, setRiskTrendData] = useState(emptyRiskTrendData);
  const [riskMaturityData, setRiskMaturityData] = useState(emptyRiskMaturityData);
  const [riskTreatmentData, setRiskTreatmentData] = useState(emptyRiskTreatmentData);
  
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
      setControlEffectivenessData(populatedControlEffectivenessData);
      setRiskTrendData(populatedRiskTrendData);
      setRiskMaturityData(populatedRiskMaturityData);
      setRiskTreatmentData(populatedRiskTreatmentData);
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
          {infoWidgetData.slice(0, 7).map(module => (
            <InfoWidget 
              key={module.id} 
              data={module} 
              isLoading={loading}
              onClick={() => handleNavigate(module.actionHref.replace('/', ''))} 
            />
          ))}
          
          {infoWidgetData.slice(7, 8).map(module => (
            <InfoWidget 
              key={module.id} 
              data={module} 
              isLoading={loading}
              onClick={() => handleNavigate(module.actionHref.replace('/', ''))} 
            />
          ))}
          <AIRiskSummary />
        </div>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '800ms' }}>
          Risk Summary
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
          <Chart 
            title="Control Effectiveness"
            description="Distribution of control effectiveness ratings"
            data={controlEffectivenessData}
            series={[{ name: 'Controls', dataKey: 'value', color: '#10b981' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Status of control mechanisms across risk categories"
            onClick={(data) => handleNavigate('controls-testing', { status: String(data.name).toLowerCase() })}
          />
          
          <Chart 
            title="Risk Trend Analysis"
            description="Current vs Previous Period"
            data={riskTrendData}
            series={[
              { name: 'Current Period', dataKey: 'current', color: '#8b5cf6' },
              { name: 'Previous Period', dataKey: 'previous', color: '#94a3b8' }
            ]}
            type="line"
            xAxisKey="month"
            height={300}
            tooltip="Comparison of risk metrics between current and previous periods"
            onClick={(data) => handleNavigate('fmea-analysis', { month: data.month })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <Chart 
            title="Risk Maturity Assessment"
            description="Organizational risk maturity by category"
            data={riskMaturityData}
            series={[{ name: 'Maturity Score', dataKey: 'score', color: '#f59e0b' }]}
            type="bar"
            xAxisKey="category"
            height={300}
            tooltip="Maturity level of risk management capabilities across organization"
            onClick={(data) => handleNavigate('fmea-analysis', { category: data.category })}
          />
          
          <Chart 
            title="Risk Treatment Progress"
            description="Status of risk treatment actions"
            data={riskTreatmentData}
            series={[{ name: 'Actions', dataKey: 'value', color: '#6366f1' }]}
            type="pie"
            showPercentages={true}
            height={300}
            tooltip="Progress on implementing risk treatments and mitigation actions"
            onClick={(data) => handleNavigate('fmea-analysis', { status: String(data.status).toLowerCase() })}
          />
        </div>
        
        <Separator className="my-8 animate-fade-in" style={{ animationDelay: '1100ms' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '1200ms' }}>
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
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-8 animate-fade-in" style={{ animationDelay: '1300ms' }}>
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
