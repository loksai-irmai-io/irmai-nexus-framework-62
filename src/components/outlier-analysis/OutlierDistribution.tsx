
import React from 'react';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import { mockActivityDistribution, mockResourceDistribution } from './mockData';
import type { ChartData } from '../dashboard/Chart';

interface OutlierDistributionProps {
  type: 'activity' | 'resource';
  height?: number;
}

const OutlierDistribution: React.FC<OutlierDistributionProps> = ({ type, height = 300 }) => {
  const distributionData = type === 'activity' ? mockActivityDistribution : mockResourceDistribution;
  
  // Convert the mock data to the format expected by the Chart component
  const chartData: ChartData[] = distributionData.map(item => ({
    name: item.name,
    value: item.value,
    deviation: item.deviation
  }));

  const series: ChartDataSeries[] = [
    {
      name: 'Frequency',
      color: '#3b82f6', // Blue
      dataKey: 'value'
    },
    {
      name: 'Deviation %',
      color: '#ef4444', // Red
      dataKey: 'deviation'
    }
  ];

  const handleDataClick = (data: any) => {
    console.log(`${type} distribution data clicked:`, data);
  };

  return (
    <Chart
      title={type === 'activity' ? 'Activity Distribution' : 'Resource Distribution'}
      description={type === 'activity' 
        ? 'Visualization of event frequencies across different activities' 
        : 'Analysis of workload and resource usage trends'
      }
      type="bar"
      data={chartData}
      series={series}
      xAxisKey="name"
      height={height}
      showLegend={true}
      onClick={handleDataClick}
      tooltip={`This chart shows the distribution of events and their deviation percentages across ${type === 'activity' ? 'different activities' : 'resource types'}. Click on any bar for more details.`}
    />
  );
};

export default OutlierDistribution;
