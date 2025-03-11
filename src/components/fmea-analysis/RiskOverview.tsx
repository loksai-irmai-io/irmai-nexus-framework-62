
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoWidget } from './InfoWidget';
import Chart from '@/components/dashboard/Chart';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  BarChart4, 
  ShieldAlert,
  Layers,
  LineChart,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Info,
  Gauge as GaugeIcon,
  Filter
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockRiskData } from './mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopRiskCards from './TopRiskCards';

interface RiskOverviewProps {
  selectedRole: string;
  onDrilldown: (riskId: string) => void;
}

const RiskOverview: React.FC<RiskOverviewProps> = ({ selectedRole, onDrilldown }) => {
  const [businessUnit, setBusinessUnit] = useState<string>("all");
  const [process, setProcess] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("quarter");
  
  // Filter data based on role
  const filteredData = mockRiskData.filter(risk => {
    if (selectedRole === 'exec') return risk.severity === 'high' || risk.severity === 'critical';
    if (selectedRole === 'process') return risk.category === 'operational' || risk.category === 'process';
    return true; // Risk managers and analysts see all
  });
  
  // Calculate risk metrics
  const criticalRisks = filteredData.filter(risk => risk.severity === 'critical').length;
  const highRisks = filteredData.filter(risk => risk.severity === 'high').length;
  const riskExposureScore = Math.round((criticalRisks * 5 + highRisks * 3) / filteredData.length * 100);
  const riskChangePercent = 8; // Simulated percent change
  const predictedTrend = riskExposureScore > 50 ? 'up' as const : 'down' as const;
  
  // Chart data
  const riskByCategory = [
    { name: 'Operational', value: filteredData.filter(r => r.category === 'operational').length },
    { name: 'Financial', value: filteredData.filter(r => r.category === 'financial').length },
    { name: 'Compliance', value: filteredData.filter(r => r.category === 'compliance').length },
    { name: 'Strategic', value: filteredData.filter(r => r.category === 'strategic').length },
    { name: 'Process', value: filteredData.filter(r => r.category === 'process').length },
  ];
  
  const riskSeries = [
    { name: 'Risks', dataKey: 'value', color: '#8b5cf6' }
  ];
  
  const trendData = [
    { month: 'Jan', actual: 65, predicted: null },
    { month: 'Feb', actual: 58, predicted: null },
    { month: 'Mar', actual: 70, predicted: null },
    { month: 'Apr', actual: 84, predicted: null },
    { month: 'May', actual: 72, predicted: null },
    { month: 'Jun', actual: 76, predicted: null },
    { month: 'Jul', actual: riskExposureScore, predicted: null },
    { month: 'Aug', actual: null, predicted: riskExposureScore + 4 },
    { month: 'Sep', actual: null, predicted: riskExposureScore + 7 },
    { month: 'Oct', actual: null, predicted: riskExposureScore + 12 },
  ];
  
  const trendSeries = [
    { name: 'Actual Risk Score', dataKey: 'actual', color: '#8b5cf6' },
    { name: 'Predicted Risk Score', dataKey: 'predicted', color: '#f43f5e' }
  ];
  
  const riskWidgets = [
    {
      id: 'risk-exposure',
      title: 'Risk Exposure Score',
      subtitle: 'Overall risk exposure level',
      status: riskExposureScore > 75 ? 'error' as const : riskExposureScore > 50 ? 'warning' as const : 'success' as const,
      metrics: [
        {
          label: 'Current Score',
          value: `${riskExposureScore}`,
          trend: {
            direction: predictedTrend,
            value: riskChangePercent
          },
          tooltip: 'Aggregated score based on risk severity and likelihood'
        },
        {
          label: 'Critical Risks',
          value: criticalRisks.toString(),
          icon: 'alert-triangle' as const,
          drilldownHint: 'View critical risks'
        },
        {
          label: 'High Risks',
          value: highRisks.toString(),
          icon: 'trending-up' as const,
          drilldownHint: 'View high risks'
        },
        {
          label: 'Q3 Prediction',
          value: `${riskExposureScore + 12}`,
          icon: 'sparkles' as const,
          tooltip: 'AI-powered prediction based on current trends'
        }
      ],
      insights: [
        'Risk exposure increased 8% from previous quarter',
        'Process risks are driving most of the score increase',
        'External market factors contributing to financial risks'
      ],
      chartData: trendData,
      chartSeries: trendSeries,
      chartType: 'line' as 'line' | 'pie' | 'bar' | 'composed',
      actionText: 'View Risk Exposure Details',
      actionHref: '/fmea-analysis/exposure',
      icon: <GaugeIcon className="h-5 w-5 text-rose-500" />
    },
    {
      id: 'risk-distribution',
      title: 'Risk Distribution',
      subtitle: 'Breakdown by category',
      status: 'info' as const,
      metrics: [
        {
          label: 'Total Risks',
          value: filteredData.length.toString(),
          icon: 'chart-bar' as const
        },
        {
          label: 'Highest Category',
          value: 'Operational',
          icon: 'activity' as const,
          drilldownHint: 'View operational risks'
        },
        {
          label: 'Controls Coverage',
          value: '76%',
          icon: 'shield' as const,
          trend: {
            direction: 'up' as const,
            value: 4
          }
        },
        {
          label: 'Open Treatment Actions',
          value: '24',
          icon: 'list-checks' as const,
          drilldownHint: 'View open actions'
        }
      ],
      insights: [
        'Operational risks account for 42% of total risks',
        'Four new compliance risks identified this quarter',
        'Strategic risks decreasing with new controls'
      ],
      chartData: riskByCategory,
      chartSeries: riskSeries,
      chartType: 'pie' as 'line' | 'pie' | 'bar' | 'composed',
      actionText: 'Explore Risk Categories',
      actionHref: '/fmea-analysis/categories',
      icon: <PieChart className="h-5 w-5 text-blue-500" />
    },
  ];
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Risk Assessment – FMEA Analysis</h2>
        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
          {selectedRole === 'exec' ? 'Executive View' : selectedRole === 'riskmgr' ? 'Risk Manager View' : selectedRole === 'process' ? 'Process Owner View' : 'Analyst View'}
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter the risk list based on various parameters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex flex-wrap gap-2">
          <Select value={businessUnit} onValueChange={setBusinessUnit}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Business Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={process} onValueChange={setProcess}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              <SelectItem value="payment">Payment Processing</SelectItem>
              <SelectItem value="onboarding">Customer Onboarding</SelectItem>
              <SelectItem value="reporting">Financial Reporting</SelectItem>
              <SelectItem value="compliance">Compliance Verification</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
              <SelectItem value="prior">Prior Quarter</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <TopRiskCards risks={filteredData} onRiskClick={onDrilldown} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riskWidgets.map((widget) => (
          <InfoWidget 
            key={widget.id}
            data={widget}
            onMetricClick={(label) => {
              if (label === 'Critical Risks') {
                onDrilldown('critical');
              } else if (label === 'High Risks') {
                onDrilldown('high');
              }
            }}
          />
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">AI-Powered Risk Insights</h3>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Insights
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Risk Trend Analysis</h4>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI-generated analysis based on historical risk data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-2 text-sm">Operational risks are projected to increase by 12% next quarter based on current control effectiveness trends.</p>
              <div className="mt-2 text-xs text-blue-600 flex items-center cursor-pointer">
                <span>View detailed analysis</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-medium">Emerging Risk Alert</h4>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI-detected pattern indicating a potential new risk</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-2 text-sm">New regulatory changes may impact compliance scores in the next 60 days. Recommended action: review control framework.</p>
              <div className="mt-2 text-xs text-amber-600 flex items-center cursor-pointer">
                <span>View recommended actions</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Control Optimization</h4>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI recommendation for control optimization</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-2 text-sm">5 controls identified as redundant with 92% overlap. Potential for 15% efficiency gain through consolidation.</p>
              <div className="mt-2 text-xs text-green-600 flex items-center cursor-pointer">
                <span>View optimization plan</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Risk Exposure Breakdown</h3>
          <Badge variant="outline" className="cursor-pointer">View All Risks</Badge>
        </div>
        
        <Chart 
          title="Risk Exposure Trend"
          description="Historical and predicted risk exposure scores"
          data={trendData}
          series={trendSeries}
          type="line"
          xAxisKey="month"
          height={300}
          tooltip="Predicted values are calculated using machine learning models based on historical data and current risk indicators"
        />
      </div>
    </div>
  );
};

export default RiskOverview;

const PieChart = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
  );
};
