
import React from 'react';
import { GitBranch, AlertTriangle, Shield, DollarSign, CheckCheck, Gauge, BarChart4 } from 'lucide-react';
import MetricCard from './MetricCard';
import RibbonNav from './RibbonNav';

interface MetricsRibbonProps {
  isLoading: boolean;
  onMetricClick: (title: string) => void;
  onNavigate: (module: string) => void;
}

const MetricsRibbon: React.FC<MetricsRibbonProps> = ({ 
  isLoading, 
  onMetricClick,
  onNavigate
}) => {
  return (
    <RibbonNav className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <MetricCard
        title="Process Discovery"
        value="24"
        severity="medium"
        icon={<GitBranch className="h-5 w-5" />}
        tooltip="Active processes being monitored in the system"
        trend={3}
        isLoading={isLoading}
        onClick={() => onNavigate('process-discovery')}
      />
      <MetricCard
        title="Open Risks"
        value="46"
        severity="medium"
        icon={<AlertTriangle className="h-5 w-5" />}
        tooltip="Total number of open risk items across all categories"
        trend={8}
        isLoading={isLoading}
        onClick={() => onMetricClick("Risk Management")}
      />
      <MetricCard
        title="High-Severity Risks"
        value="5"
        severity="critical"
        icon={<Shield className="h-5 w-5" />}
        tooltip="Risks with critical or high severity ratings"
        trend={-2}
        isLoading={isLoading}
        onClick={() => onMetricClick("High-Severity Risks")}
      />
      <MetricCard
        title="Total Potential Loss"
        value="963K"
        prefix="$"
        severity="high"
        icon={<DollarSign className="h-5 w-5" />}
        tooltip="Estimated financial impact of all identified risks"
        trend={12}
        isLoading={isLoading}
        onClick={() => onMetricClick("Potential Loss")}
      />
      <MetricCard
        title="Compliance Score"
        value="85%"
        severity="low"
        icon={<CheckCheck className="h-5 w-5" />}
        tooltip="Overall compliance score across all regulatory frameworks"
        trend={5}
        isLoading={isLoading}
        onClick={() => onMetricClick("Compliance")}
      />
      <MetricCard
        title="Control Model Failures"
        value="15%"
        severity="medium"
        icon={<Gauge className="h-5 w-5" />}
        tooltip="Percentage of control models that have failed testing"
        trend={-3}
        isLoading={isLoading}
        onClick={() => onNavigate('controls-testing')}
      />
      <MetricCard
        title="Scenario Analysis"
        value="3.2M"
        prefix="$"
        severity="high"
        icon={<BarChart4 className="h-5 w-5" />}
        tooltip="Projected loss based on current scenario analysis"
        trend={8}
        isLoading={isLoading}
        onClick={() => onNavigate('scenario-analysis')}
      />
    </RibbonNav>
  );
};

export default MetricsRibbon;
