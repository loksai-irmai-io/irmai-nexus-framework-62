
import React from 'react';

const ProcessLegend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border rounded-md shadow-sm p-2 text-xs flex flex-col gap-1.5">
      <div className="font-medium">Legend</div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Compliant Node</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span>Non-Compliant Node</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded border border-gray-400"></div>
        <span>Activity</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full border border-gray-400"></div>
        <span>Event</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 transform rotate-45 border border-gray-400"></div>
        <span>Gateway</span>
      </div>
    </div>
  );
};

export default ProcessLegend;
