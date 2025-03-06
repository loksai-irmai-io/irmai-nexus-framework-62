
import React from 'react';
import Chart from './Chart';
import { lossEventsData, riskDistributionData } from './data';

interface ChartSectionProps {
  onLossEventClick: (data: any) => void;
  onRiskCategoryClick: (data: any) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
  onLossEventClick,
  onRiskCategoryClick
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
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
        onClick={onLossEventClick}
      />
      
      <Chart 
        title="Risk Distribution by Category"
        description="Breakdown of risks by category or business unit"
        data={riskDistributionData}
        series={[{ name: 'Percentage', dataKey: 'value', color: '#0ea5e9' }]}
        type="pie"
        showPercentages={true}
        showLegend={true}
        height={300}
        tooltip="Click on any category to see detailed risk analysis for that segment"
        onClick={onRiskCategoryClick}
      />
    </div>
  );
};

export default ChartSection;
