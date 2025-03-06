
import React from 'react';
import Chart from './Chart';
import { incidentSeverityData, controlsHealthData } from './data';

interface SummarySectionProps {
  onIncidentClick: (data: any) => void;
  onControlsClick: (data: any) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ 
  onIncidentClick, 
  onControlsClick 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
      <Chart 
        title="Incidents by Severity"
        data={incidentSeverityData}
        series={[
          { name: 'Count', dataKey: 'value', color: '#f97316' }
        ]}
        type="bar"
        xAxisKey="name"
        height={300}
        tooltip="Distribution of incidents by severity level"
        onClick={onIncidentClick}
      />
      <Chart 
        title="Controls Health"
        data={controlsHealthData}
        series={[{ name: 'Percentage', dataKey: 'value', color: '#4ade80' }]}
        type="pie"
        showPercentages={true}
        height={300}
        tooltip="Current health status of control mechanisms"
        onClick={onControlsClick}
      />
      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="font-semibold mb-3">Announcements & Tips</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">New Feature</p>
            <p className="text-blue-700 dark:text-blue-400">Knowledge Graph now supports interactive drilling through relationships between risks and controls.</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Tip</p>
            <p className="text-yellow-700 dark:text-yellow-400">Use the Risk Catalog to drill into detailed risk descriptions and mitigations.</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
            <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">Training</p>
            <p className="text-purple-700 dark:text-purple-400">New training session on FMEA Analysis scheduled for next Friday.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
