
import React from 'react';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import { mockTimelineData } from './mockData';
import type { ChartData } from '../dashboard/Chart';

interface OutlierTimelineProps {
  height?: number;
}

const OutlierTimeline: React.FC<OutlierTimelineProps> = ({ height = 300 }) => {
  // Convert the mock data to the format expected by the Chart component
  const chartData: ChartData[] = mockTimelineData.map(item => ({
    name: item.date,
    count: item.count,
    sequenceViolations: item.sequenceViolations,
    timeOutliers: item.timeOutliers,
    resourceImbalances: item.resourceImbalances
  }));

  const series: ChartDataSeries[] = [
    {
      name: 'Sequence Violations',
      color: '#f97316', // Orange
      dataKey: 'sequenceViolations'
    },
    {
      name: 'Time Outliers',
      color: '#3b82f6', // Blue
      dataKey: 'timeOutliers'
    },
    {
      name: 'Resource Imbalances',
      color: '#8b5cf6', // Purple
      dataKey: 'resourceImbalances'
    }
  ];

  const handleDataClick = (data: any) => {
    console.log('Timeline data clicked:', data);
  };

  return (
    <Chart
      title="Anomaly Timeline"
      description="Distribution of outlier events over time"
      type="composed"
      data={chartData}
      series={series}
      xAxisKey="name"
      height={height}
      showLegend={true}
      onClick={handleDataClick}
      tooltip="This chart displays the distribution of different types of anomalies over time. Click on any point to explore details."
    />
  );
};

export default OutlierTimeline;
