
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockHeatmapData } from './mockData';

interface OutlierHeatmapProps {
  height?: number;
}

const OutlierHeatmap: React.FC<OutlierHeatmapProps> = ({ height = 300 }) => {
  // Get unique activities and resources for the heatmap
  const activities = Array.from(new Set(mockHeatmapData.map(item => item.activity)));
  const resources = Array.from(new Set(mockHeatmapData.map(item => item.resource)));
  
  // Find the max value for color intensity scaling
  const maxValue = Math.max(...mockHeatmapData.map(item => item.value));
  
  // Function to get color based on value (red intensity)
  const getColor = (value: number) => {
    const intensity = Math.floor((value / maxValue) * 100);
    return `rgba(220, 38, 38, ${intensity / 100})`;
  };
  
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Process Anomaly Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-4">
        <div className="overflow-x-auto flex-1">
          <div style={{ height: `${height}px`, width: '100%', minWidth: `${resources.length * 80}px` }}>
            {/* Y-axis labels (Activities) */}
            <div className="grid grid-cols-[120px_1fr] h-full">
              <div className="flex flex-col justify-between py-6">
                {activities.map((activity, index) => (
                  <div key={index} className="text-xs pl-2 truncate" title={activity}>
                    {activity}
                  </div>
                ))}
              </div>
              
              {/* Heatmap cells */}
              <div className="relative">
                {/* X-axis labels (Resources) */}
                <div className="flex absolute -top-6 left-0 right-0">
                  {resources.map((resource, index) => (
                    <div 
                      key={index} 
                      className="text-xs truncate -rotate-45 origin-bottom-left"
                      style={{ width: `${100 / resources.length}%` }}
                      title={resource}
                    >
                      {resource}
                    </div>
                  ))}
                </div>
                
                {/* Grid cells */}
                <div className="grid h-full" style={{ 
                  gridTemplateColumns: `repeat(${resources.length}, 1fr)`,
                  gridTemplateRows: `repeat(${activities.length}, 1fr)`
                }}>
                  {activities.flatMap((activity, activityIndex) => 
                    resources.map((resource, resourceIndex) => {
                      const dataPoint = mockHeatmapData.find(
                        item => item.activity === activity && item.resource === resource
                      );
                      
                      const value = dataPoint ? dataPoint.value : 0;
                      const bgColor = getColor(value);
                      
                      return (
                        <div
                          key={`${activityIndex}-${resourceIndex}`}
                          className="border border-gray-100 flex items-center justify-center transition-colors hover:brightness-90 cursor-pointer"
                          style={{ backgroundColor: bgColor }}
                          title={`${activity} × ${resource}: ${value} anomalies`}
                        >
                          {value > 0 && (
                            <span className={`text-xs font-medium ${value / maxValue > 0.5 ? 'text-white' : 'text-gray-800'}`}>
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="w-full h-2 max-w-xs bg-gradient-to-r from-white to-red-600 rounded"></div>
          <div className="flex justify-between w-full max-w-xs text-xs mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierHeatmap;
