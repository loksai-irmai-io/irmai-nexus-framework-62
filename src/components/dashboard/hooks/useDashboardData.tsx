
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertCircle, 
  Gauge,
  TrendingUp
} from 'lucide-react';
import { InfoWidgetData } from '@/components/dashboard/InfoWidget';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [infoWidgetData, setInfoWidgetData] = useState<InfoWidgetData[]>(getInitialInfoWidgetData());

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setDataLoaded(true);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return {
    dataLoaded,
    announcements,
    infoWidgetData,
    loading,
    setLoading
  };
};

function getInitialInfoWidgetData(): InfoWidgetData[] {
  return [
    {
      id: 'operational-risk',
      title: 'Operational Risk',
      subtitle: 'Overall risk score and trends',
      icon: () => <AlertCircle className="h-5 w-5 text-orange-500" />,
      metrics: [
        {
          label: 'Risk Score',
          value: '68/100',
          icon: 'alert-triangle',
          trend: {
            direction: 'up',
            value: 12
          }
        },
        {
          label: 'Open Items',
          value: '24',
          icon: 'flag',
        },
        {
          label: 'Mitigation Rate',
          value: '67%',
          icon: 'shield',
          trend: {
            direction: 'up',
            value: 5
          }
        },
        {
          label: 'Compliance',
          value: '89%',
          icon: 'check-circle',
          trend: {
            direction: 'down',
            value: 2
          }
        }
      ],
      insights: [
        'Process vulnerability increased in financial reporting',
        'Control effectiveness trending downward since Q1'
      ],
      chartData: [
        { name: 'Jan', value: 65 },
        { name: 'Feb', value: 59 },
        { name: 'Mar', value: 80 },
        { name: 'Apr', value: 81 },
        { name: 'May', value: 56 },
        { name: 'Jun', value: 68 },
      ],
      chartSeries: [
        { name: 'Risk Score', dataKey: 'value', color: '#f97316', type: 'line' }
      ],
      chartType: 'line',
      status: 'warning',
      actionText: 'View Details',
      actionHref: '/fmea-analysis'
    },
    {
      id: 'process-compliance',
      title: 'Process Compliance',
      subtitle: 'Framework adherence and gaps',
      icon: () => <ShieldCheck className="h-5 w-5 text-green-500" />,
      metrics: [
        {
          label: 'Compliant',
          value: '86%',
          icon: 'check',
          trend: {
            direction: 'up',
            value: 4
          }
        },
        {
          label: 'At Risk',
          value: '9',
          icon: 'alert-circle',
        },
        {
          label: 'Non-Compliant',
          value: '3',
          icon: 'x-circle',
        },
        {
          label: 'Not Assessed',
          value: '5',
          icon: 'help-circle'
        }
      ],
      insights: [
        'Data privacy compliance gap identified in marketing processes',
        'Improved compliance in financial controls'
      ],
      chartData: [
        { name: 'Compliant', value: 86 },
        { name: 'At Risk', value: 9 },
        { name: 'Non-Compliant', value: 3 },
        { name: 'Not Assessed', value: 2 },
      ],
      chartSeries: [
        { name: 'Status', dataKey: 'value', color: '#22c55e' }
      ],
      chartType: 'pie',
      status: 'success',
      actionText: 'View Compliance',
      actionHref: '/compliance-monitoring'
    },
    {
      id: 'process-insights',
      title: 'Process Performance',
      subtitle: 'Efficiency and throughput metrics',
      icon: () => <Gauge className="h-5 w-5 text-blue-500" />,
      metrics: [
        {
          label: 'Efficiency',
          value: '76%',
          icon: 'percent',
          trend: {
            direction: 'up',
            value: 8
          }
        },
        {
          label: 'Bottlenecks',
          value: '7',
          icon: 'git-merge',
          trend: {
            direction: 'down',
            value: 2
          }
        },
        {
          label: 'Automation',
          value: '42%',
          icon: 'zap',
          trend: {
            direction: 'up',
            value: 15
          }
        },
        {
          label: 'Errors',
          value: '2.3%',
          icon: 'x',
          trend: {
            direction: 'down',
            value: 0.5
          }
        }
      ],
      insights: [
        'Approval process taking 24% longer than benchmark',
        'Data entry automation reduced errors by 15%'
      ],
      chartData: [
        { name: 'Mon', value: 70 },
        { name: 'Tue', value: 68 },
        { name: 'Wed', value: 74 },
        { name: 'Thu', value: 72 },
        { name: 'Fri', value: 78 },
        { name: 'Sat', value: 82 },
        { name: 'Sun', value: 76 },
      ],
      chartSeries: [
        { name: 'Efficiency', dataKey: 'value', color: '#3b82f6' }
      ],
      chartType: 'bar',
      status: 'info',
      actionText: 'View Processes',
      actionHref: '/process-discovery'
    },
    {
      id: 'outlier-detection',
      title: 'Outlier Detection',
      subtitle: 'Anomalies and potential risks',
      icon: () => <TrendingUp className="h-5 w-5 text-purple-500" />,
      metrics: [
        {
          label: 'Outliers',
          value: '14',
          icon: 'activity',
          trend: {
            direction: 'up',
            value: 3
          }
        },
        {
          label: 'Processing',
          value: '3,241',
          icon: 'loader',
        },
        {
          label: 'False Positives',
          value: '3.1%',
          icon: 'filter',
          trend: {
            direction: 'down',
            value: 0.8
          }
        },
        {
          label: 'Accuracy',
          value: '94.7%',
          icon: 'check-circle',
          trend: {
            direction: 'up',
            value: 1.2
          }
        }
      ],
      insights: [
        'Unusual transaction pattern detected in procurement',
        'Process timing variance increased in customer onboarding'
      ],
      chartData: [
        { name: 'Week 1', outliers: 8, threshold: 10 },
        { name: 'Week 2', outliers: 12, threshold: 10 },
        { name: 'Week 3', outliers: 7, threshold: 10 },
        { name: 'Week 4', outliers: 14, threshold: 10 },
      ],
      chartSeries: [
        { name: 'Outliers', dataKey: 'outliers', color: '#a855f7', type: 'bar' },
        { name: 'Threshold', dataKey: 'threshold', color: '#ef4444', type: 'line' }
      ],
      chartType: 'composed',
      status: 'error',
      actionText: 'View Outliers',
      actionHref: '/outlier-analysis'
    },
  ];
}
