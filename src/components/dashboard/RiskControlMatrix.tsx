
import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';

interface RiskControlMatrixProps {
  onViewClick: () => void;
  onCellClick: (severity: string, effectiveness: string) => void;
}

const RiskControlMatrix: React.FC<RiskControlMatrixProps> = ({ onViewClick, onCellClick }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Risk Control Matrix
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Heatmap of risk coverage by control effectiveness</p>
      </div>
      
      <div className="p-4">
        <div className="h-[220px] flex justify-center items-center">
          <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full h-full">
            {/* Top Labels */}
            <div className="col-start-2 col-span-4 flex justify-between items-center text-xs text-muted-foreground pb-1">
              <span>Low</span>
              <span>Control Effectiveness</span>
              <span>High</span>
            </div>
            
            {/* Left Label - Risk Impact */}
            <div className="row-start-2 row-span-4 flex flex-col justify-between items-center text-xs text-muted-foreground pr-1 writing-mode-vertical">
              <span className="transform -rotate-90 origin-bottom-left translate-y-6 whitespace-nowrap">High</span>
              <span className="transform -rotate-90 origin-center whitespace-nowrap">Risk Impact</span>
              <span className="transform -rotate-90 origin-top-left -translate-y-6 whitespace-nowrap">Low</span>
            </div>
            
            {/* Heatmap Cells */}
            {/* Critical zone */}
            <div className="bg-red-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('critical', 'low')}>
              3
            </div>
            <div className="bg-red-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('critical', 'medium-low')}>
              2
            </div>
            <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('critical', 'medium')}>
              1
            </div>
            <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('critical', 'high')}>
              0
            </div>
            
            {/* High zone */}
            <div className="bg-red-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('high', 'low')}>
              4
            </div>
            <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('high', 'medium-low')}>
              5
            </div>
            <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('high', 'medium')}>
              3
            </div>
            <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('high', 'high')}>
              1
            </div>
            
            {/* Medium zone */}
            <div className="bg-amber-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('medium', 'low')}>
              7
            </div>
            <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('medium', 'medium-low')}>
              6
            </div>
            <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('medium', 'medium')}>
              4
            </div>
            <div className="bg-green-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('medium', 'high')}>
              2
            </div>
            
            {/* Low zone */}
            <div className="bg-yellow-500 rounded flex items-center justify-center text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('low', 'low')}>
              5
            </div>
            <div className="bg-green-500 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('low', 'medium-low')}>
              3
            </div>
            <div className="bg-green-600 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('low', 'medium')}>
              2
            </div>
            <div className="bg-green-700 rounded flex items-center justify-center text-white text-xs hover:opacity-80 cursor-pointer"
              onClick={() => onCellClick('low', 'high')}>
              1
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Critical Area</div>
            <div className="font-medium">9 High Impact Risks</div>
            <div className="text-xs text-red-600">Low Control Coverage</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Well Controlled</div>
            <div className="font-medium">11 Risks</div>
            <div className="text-xs text-green-600">Strong Controls</div>
          </div>
        </div>
        
        <div 
          className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
          onClick={onViewClick}
        >
          <span>View Risk Analysis</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default RiskControlMatrix;
