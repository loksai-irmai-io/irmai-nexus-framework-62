
import React from 'react';
import { ClipboardList, ChevronRight } from 'lucide-react';

interface RegulatoryComplianceProps {
  onViewClick: () => void;
  onFrameworkClick: (framework: string) => void;
}

const RegulatoryCompliance: React.FC<RegulatoryComplianceProps> = ({ 
  onViewClick,
  onFrameworkClick
}) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-primary" />
            Regulatory Compliance
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Compliance status across key regulatory frameworks</p>
      </div>
      
      <div className="p-4">
        <div className="h-[220px] flex flex-col justify-around">
          {/* Compliance Bar Chart */}
          <div className="flex items-end h-[140px] justify-around">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => onFrameworkClick('PCI-DSS')}>
              <div className="h-[75px] w-12 bg-amber-500 rounded-t hover:bg-amber-400"></div>
              <div className="mt-1 text-xs">PCI-DSS</div>
              <div className="text-xs font-semibold">75%</div>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer" onClick={() => onFrameworkClick('GDPR')}>
              <div className="h-[85px] w-12 bg-green-500 rounded-t hover:bg-green-400"></div>
              <div className="mt-1 text-xs">GDPR</div>
              <div className="text-xs font-semibold">85%</div>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer" onClick={() => onFrameworkClick('SOX')}>
              <div className="h-[90px] w-12 bg-green-600 rounded-t hover:bg-green-500"></div>
              <div className="mt-1 text-xs">SOX</div>
              <div className="text-xs font-semibold">90%</div>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer" onClick={() => onFrameworkClick('ISO-27001')}>
              <div className="h-[65px] w-12 bg-amber-500 rounded-t hover:bg-amber-400"></div>
              <div className="mt-1 text-xs">ISO</div>
              <div className="text-xs font-semibold">65%</div>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer" onClick={() => onFrameworkClick('Basel-III')}>
              <div className="h-[70px] w-12 bg-amber-500 rounded-t hover:bg-amber-400"></div>
              <div className="mt-1 text-xs">Basel</div>
              <div className="text-xs font-semibold">70%</div>
            </div>
          </div>
          
          {/* Target Line */}
          <div className="flex items-center w-full">
            <div className="w-full h-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="whitespace-nowrap text-xs ml-2 text-muted-foreground">Target: 100%</div>
          </div>
          
          {/* Overall Score */}
          <div className="flex justify-center mt-2">
            <div className="flex items-center px-4 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-sm">Overall Score:</span>
              <span className="text-sm font-bold ml-2">85%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Critical Gaps</div>
            <div className="font-medium">ISO 27001: 3 Controls</div>
            <div className="text-xs text-red-600">Due in 14 days</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Improvement</div>
            <div className="font-medium">GDPR: +5%</div>
            <div className="text-xs text-green-600">This quarter</div>
          </div>
        </div>
        
        <div 
          className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
          onClick={onViewClick}
        >
          <span>View Compliance Details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default RegulatoryCompliance;
