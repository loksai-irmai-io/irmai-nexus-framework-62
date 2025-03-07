
import React from 'react';
import { Clock, GitBranch, Scale, Users, AlertTriangle, FileWarning, Shield } from 'lucide-react';
import { OutlierCategory } from './types';
import CompactMetric from '@/components/dashboard/CompactMetric';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OutlierMetricsPanelProps {
  onCategoryClick: (category: OutlierCategory, count: number) => void;
}

const OutlierMetricsPanel: React.FC<OutlierMetricsPanelProps> = ({ onCategoryClick }) => {
  const { toast } = useToast();
  
  // Enhanced metrics data with proper icons and better tooltips
  const metrics = [
    {
      id: 'total_outliers',
      label: 'Total Outliers Detected',
      value: 87,
      icon: 'alert-triangle',
      trend: { direction: 'up' as const, value: 12 },
      tooltip: 'Total number of outlier events detected across all processes. Click to view all outliers.',
      category: null,
      drilldownHint: 'View all outliers',
      className: 'border-l-4 border-l-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
    },
    {
      id: 'sequence_violations',
      label: 'Sequence Violations',
      value: 23,
      icon: 'git-branch',
      trend: { direction: 'up' as const, value: 8 },
      tooltip: 'Activities performed out of expected sequence or order. These may indicate process compliance issues.',
      category: 'sequence_violation' as OutlierCategory,
      drilldownHint: 'View sequence violations',
      className: 'border-l-4 border-l-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
    },
    {
      id: 'time_outliers',
      label: 'Time-based Outliers',
      value: 36,
      icon: 'clock',
      trend: { direction: 'up' as const, value: 15 },
      tooltip: 'Activities that took significantly longer or shorter than expected. May indicate bottlenecks or inefficiencies.',
      category: 'time_outlier' as OutlierCategory,
      drilldownHint: 'View time outliers',
      className: 'border-l-4 border-l-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10'
    },
    {
      id: 'resource_imbalances',
      label: 'Resource Imbalances',
      value: 18,
      icon: 'scale',
      trend: { direction: 'down' as const, value: 5 },
      tooltip: 'Uneven distribution of work among resources or teams. May indicate staffing or allocation issues.',
      category: 'resource_imbalance' as OutlierCategory,
      drilldownHint: 'View resource imbalances',
      className: 'border-l-4 border-l-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10'
    },
    {
      id: 'data_quality',
      label: 'Data Quality Issues',
      value: 7,
      icon: 'file-warning',
      trend: { direction: 'down' as const, value: 12 },
      tooltip: 'Missing, incorrect, or inconsistent data in process execution. May lead to compliance or reporting issues.',
      category: 'data_quality' as OutlierCategory,
      drilldownHint: 'View data quality issues',
      className: 'border-l-4 border-l-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
    },
    {
      id: 'compliance_breaches',
      label: 'Compliance Breaches',
      value: 3,
      icon: 'shield',
      trend: { direction: 'down' as const, value: 25 },
      tooltip: 'Violations of compliance rules or regulatory requirements. Require immediate attention.',
      category: 'compliance_breach' as OutlierCategory,
      drilldownHint: 'View compliance breaches',
      className: 'border-l-4 border-l-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
    }
  ];

  const handleClick = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (metric && metric.category) {
      onCategoryClick(metric.category, metric.value);
    } else if (metricId === 'total_outliers') {
      // Handle click on total outliers
      toast({
        title: "Loading all outliers",
        description: `Loading ${metrics[0].value} outliers across all categories`,
      });
      onCategoryClick('time_outlier', metrics[0].value); // For demo, just use time_outlier
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric) => (
        <CompactMetric
          key={metric.id}
          label={metric.label}
          value={metric.value}
          icon={metric.icon as any}
          trend={metric.trend}
          tooltip={metric.tooltip}
          variant="card"
          className={cn(
            "hover:border-primary hover:shadow-md transition-all duration-200 animate-fade-in",
            metric.className
          )}
          onClick={() => handleClick(metric.id)}
          drilldownHint={metric.drilldownHint}
        />
      ))}
    </div>
  );
};

export default OutlierMetricsPanel;
