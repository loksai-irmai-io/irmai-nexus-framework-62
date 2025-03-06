
import React from 'react';
import { Network, ChevronRight } from 'lucide-react';

interface ProcessRiskLandscapeProps {
  onViewClick: () => void;
}

const ProcessRiskLandscape: React.FC<ProcessRiskLandscapeProps> = ({ onViewClick }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center">
            <Network className="mr-2 h-5 w-5 text-primary" />
            Process Risk Landscape
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Unified view of business processes and associated risks</p>
      </div>
      
      <div className="p-4">
        <div className="h-[220px] flex justify-center items-center relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary z-20">
              <span className="font-bold text-lg">Core Banking</span>
            </div>
            
            {/* Process Nodes */}
            <div className="absolute left-1/4 -translate-x-1/2 top-1/3 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-400 z-10">
              <span className="text-sm text-center">Payment Processing</span>
            </div>
            
            <div className="absolute right-1/4 translate-x-1/2 top-1/3 -translate-y-1/2 w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-400 z-10">
              <span className="text-sm text-center">Customer Onboarding</span>
            </div>
            
            <div className="absolute left-1/3 -translate-x-1/2 bottom-6 w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-400 z-10">
              <span className="text-sm text-center">Transaction Monitoring</span>
            </div>
            
            <div className="absolute right-1/3 translate-x-1/2 bottom-6 w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-2 border-orange-400 z-10">
              <span className="text-sm text-center">Loan Approval</span>
            </div>
            
            {/* Risk Tags */}
            <div className="absolute left-[20%] top-[20%] bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs border border-red-400">
              Fraud Risk
            </div>
            
            <div className="absolute right-[20%] top-[20%] bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-400">
              Data Security
            </div>
            
            <div className="absolute left-[25%] bottom-[15%] bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs border border-red-400">
              AML Risk
            </div>
            
            <div className="absolute right-[25%] bottom-[15%] bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs border border-yellow-400">
              Credit Risk
            </div>
            
            {/* Connection Lines - We use borders to create lines */}
            <div className="absolute w-[40%] h-[1px] bg-gray-300 dark:bg-gray-600 left-[30%] top-[50%]"></div>
            <div className="absolute w-[1px] h-[30%] bg-gray-300 dark:bg-gray-600 left-[30%] top-[50%]"></div>
            <div className="absolute w-[1px] h-[30%] bg-gray-300 dark:bg-gray-600 right-[30%] top-[50%]"></div>
            <div className="absolute w-[15%] h-[1px] bg-gray-300 dark:bg-gray-600 left-[35%] bottom-[30%]"></div>
            <div className="absolute w-[15%] h-[1px] bg-gray-300 dark:bg-gray-600 right-[35%] bottom-[30%]"></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Top Process</div>
            <div className="font-medium">Payment Processing</div>
            <div className="text-xs text-red-600">5 High Risks</div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Critical Risk</div>
            <div className="font-medium">Fraud Detection</div>
            <div className="text-xs text-amber-600">3 Controls Failing</div>
          </div>
        </div>
        
        <div 
          className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
          onClick={onViewClick}
        >
          <span>View Process Risk Map</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ProcessRiskLandscape;
