
import React from 'react';
import RibbonNav from '@/components/dashboard/RibbonNav';
import MetricCard from '@/components/dashboard/MetricCard';
import { Shield, AlertTriangle, CheckCheck, GitBranch, DollarSign, TestTube, Presentation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardMetricsProps {
  dataLoaded: boolean;
  loading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ dataLoaded, loading }) => {
  const navigate = useNavigate();

  const handleMetricClick = (title: string) => {
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
      navigate(`/${route}`);
    }, 500);
  };

  return (
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
  );
};

export default DashboardMetrics;
