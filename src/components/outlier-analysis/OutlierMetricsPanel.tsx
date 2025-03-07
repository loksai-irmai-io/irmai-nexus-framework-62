
import React from 'react';
import { ArrowRight, Clock, GitBranch, Scale, Users, AlertTriangle } from 'lucide-react';
import { OutlierCategory } from './types';
import CompactMetric from '@/components/dashboard/CompactMetric';
import { useToast } from '@/hooks/use-toast';

interface OutlierMetricsPanelProps {
  onCategoryClick: (category: OutlierCategory, count: number) => void;
}

const OutlierMetricsPanel: React.FC<OutlierMetricsPanelProps> = ({ onCategoryClick }) => {
  const { toast } = useToast();
  
  // Mock metrics data
  const metrics = [
    {
      id: 'total_outliers',
      label: 'Total Outliers Detected',
      value: 87,
      icon: 'trending-up',
      trend: { direction: 'up' as const, value: 12 },
      tooltip: 'Total number of outlier events detected across all processes',
      category: null,
      drilldownHint: 'Click to view all outliers'
    },
    {
      id: 'sequence_violations',
      label: 'Sequence Violations',
      value: 23,
      icon: 'chart-bar',
      trend: { direction: 'up' as const, value: 8 },
      tooltip: 'Activities performed out of expected sequence or order',
      category: 'sequence_violation' as OutlierCategory,
      drilldownHint: 'Click to view sequence violations'
    },
    {
      id: 'time_outliers',
      label: 'Time-based Outliers',
      value: 36,
      icon: 'gauge',
      trend: { direction: 'up' as const, value: 15 },
      tooltip: 'Activities that took significantly longer or shorter than expected',
      category: 'time_outlier' as OutlierCategory,
      drilldownHint: 'Click to view time outliers'
    },
    {
      id: 'resource_imbalances',
      label: 'Resource Imbalances',
      value: 18,
      icon: 'activity',
      trend: { direction: 'down' as const, value: 5 },
      tooltip: 'Uneven distribution of work among resources or teams',
      category: 'resource_imbalance' as OutlierCategory,
      drilldownHint: 'Click to view resource imbalances'
    },
    {
      id: 'data_quality',
      label: 'Data Quality Issues',
      value: 7,
      icon: 'info',
      trend: { direction: 'down' as const, value: 12 },
      tooltip: 'Missing, incorrect, or inconsistent data in process execution',
      category: 'data_quality' as OutlierCategory,
      drilldownHint: 'Click to view data quality issues'
    },
    {
      id: 'compliance_breaches',
      label: 'Compliance Breaches',
      value: 3,
      icon: 'circle-check',
      trend: { direction: 'down' as const, value: 25 },
      tooltip: 'Violations of compliance rules or regulatory requirements',
      category: 'compliance_breach' as OutlierCategory,
      drilldownHint: 'Click to view compliance breaches'
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
          className="hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => handleClick(metric.id)}
          drilldownHint={metric.drilldownHint}
        />
      ))}
    </div>
  );
};

export default OutlierMetricsPanel;
