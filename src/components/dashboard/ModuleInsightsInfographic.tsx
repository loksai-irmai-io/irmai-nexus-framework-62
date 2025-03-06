
import React from 'react';
import { cn } from '@/lib/utils';
import Chart from '@/components/dashboard/Chart';
import KnowledgeGraph from '@/components/dashboard/KnowledgeGraph';
import { 
  Activity, 
  SearchX, 
  Shield, 
  CheckCheck, 
  Network,
  Zap,
  Radar,
  FileCheck
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

// Sample data for the charts
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
  { name: 'Fraud', probability: 0.7, impact: 85, size: 60 },
  { name: 'Data Breach', probability: 0.4, impact: 95, size: 38 },
  { name: 'System Failure', probability: 0.3, impact: 80, size: 24 },
  { name: 'Compliance', probability: 0.5, impact: 70, size: 35 },
  { name: 'Operations', probability: 0.6, impact: 60, size: 36 },
];

const gapAnalysisData = [
  { name: 'PCI-DSS', current: 75, target: 100 },
  { name: 'GDPR', current: 85, target: 100 },
  { name: 'SOX', current: 90, target: 100 },
  { name: 'ISO 27001', current: 65, target: 100 },
  { name: 'Basel III', current: 70, target: 100 },
];

interface ModuleInsightsInfographicProps {
  className?: string;
  onChartClick?: (data: any, moduleType: string) => void;
}

const ModuleInsightsInfographic: React.FC<ModuleInsightsInfographicProps> = ({ 
  className,
  onChartClick 
}) => {
  const handleChartClick = (data: any, moduleType: string) => {
    if (onChartClick) {
      onChartClick(data, moduleType);
    }
  };

  return (
    <div className={cn("animate-fade-in space-y-6", className)}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-6 border border-blue-100 dark:border-blue-900/50 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
            <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Operational Risk Insights
          </h2>
        </div>
        
        <p className="text-blue-700 dark:text-blue-400 mb-6">
          Comprehensive view of your organization's risk landscape across key operational domains
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Process Discovery */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-green-800 dark:text-green-300">Process Discovery: Activity Distribution</h3>
              </div>
            </div>
            <div className="p-3">
              <Chart 
                title=""
                data={processDiscoveryData}
                series={[{ name: 'Activities', dataKey: 'value', color: '#22c55e' }]}
                type="pie"
                showPercentages={true}
                height={260}
                tooltip="Distribution of activities across business processes"
                onClick={(data) => handleChartClick(data, 'process-discovery')}
              />
            </div>
          </div>
          
          {/* Outlier Analysis */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-orange-100 dark:border-orange-900/30 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-orange-100 dark:border-orange-900/30 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
              <div className="flex items-center gap-2">
                <SearchX className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-orange-800 dark:text-orange-300">Outlier Analysis: Anomaly Trends</h3>
              </div>
            </div>
            <div className="p-3">
              <Chart 
                title=""
                data={outlierAnalysisData}
                series={[
                  { name: 'Anomaly Count', dataKey: 'count', color: '#f97316' },
                  { name: 'Anomaly Rate (%)', dataKey: 'rate', color: '#3b82f6' }
                ]}
                type="composed"
                xAxisKey="name"
                height={260}
                tooltip="Trend of detected anomalies over time"
                onClick={(data) => handleChartClick(data, 'outlier-analysis')}
              />
            </div>
          </div>
          
          {/* Predictive Risk Analytics */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-purple-100 dark:border-purple-900/30 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30">
              <div className="flex items-center gap-2">
                <Radar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Predictive Risk Analytics: Heat Map</h3>
              </div>
            </div>
            <div className="p-3">
              <Chart 
                title=""
                description="Bubble size represents risk severity (probability × impact)"
                data={predictiveRiskData}
                series={[
                  { name: 'Probability', dataKey: 'probability', color: '#8b5cf6' },
                  { name: 'Impact', dataKey: 'impact', color: '#ef4444' },
                  { name: 'Size', dataKey: 'size', color: '#d946ef' }
                ]}
                type="composed"
                xAxisKey="name"
                height={260}
                tooltip="Risk heat map showing probability vs impact"
                onClick={(data) => handleChartClick(data, 'fmea-analysis')}
              />
            </div>
          </div>
          
          {/* Compliance Monitoring */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-cyan-100 dark:border-cyan-900/30 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-cyan-100 dark:border-cyan-900/30 bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-semibold text-cyan-800 dark:text-cyan-300">Compliance Monitoring: Gap Analysis</h3>
              </div>
            </div>
            <div className="p-3">
              <Chart 
                title=""
                data={gapAnalysisData}
                series={[
                  { name: 'Current Compliance', dataKey: 'current', color: '#0ea5e9' },
                  { name: 'Target', dataKey: 'target', color: '#64748b' }
                ]}
                type="bar"
                xAxisKey="name"
                height={260}
                tooltip="Comparison of current vs. target compliance levels"
                onClick={(data) => handleChartClick(data, 'compliance-monitoring')}
              />
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-blue-100 dark:bg-blue-900/50" />
        
        {/* Digital Twin Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Digital Twin Overview</h3>
          </div>
          
          <p className="text-sm text-blue-700 dark:text-blue-400">
            This is your central data hub – all insights and interdependencies are sourced here.
          </p>
          
          <div className="p-1 border border-primary/20 rounded-lg bg-primary/5 overflow-hidden">
            <KnowledgeGraph className="h-[360px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleInsightsInfographic;
