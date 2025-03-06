
import React from 'react';
import { Database, ChevronRight } from 'lucide-react';

interface AnomalyDetectionProps {
  onViewClick: () => void;
  onAnomalyClick: (type: string, severity?: string, position?: string) => void;
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ 
  onViewClick, 
  onAnomalyClick 
}) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-card-hover">
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center">
            <Database className="mr-2 h-5 w-5 text-primary" />
            Anomaly Detection
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Real-time process anomalies and outlier analysis</p>
      </div>
      
      <div className="p-4">
        <div className="h-[220px] flex justify-center items-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Timeline with Anomalies */}
            <div className="flex flex-col justify-between h-full">
              {/* Process Flow Line */}
              <div className="flex-1 flex items-center">
                <div className="w-full h-px bg-gray-300 dark:bg-gray-600 relative">
                  {/* Normal Events */}
                  <div 
                    className="absolute -top-1.5 left-[10%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '10%')}
                  ></div>
                  <div 
                    className="absolute -top-1.5 left-[20%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '20%')}
                  ></div>
                  <div 
                    className="absolute -top-1.5 left-[30%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '30%')}
                  ></div>
                  <div 
                    className="absolute -top-1.5 left-[50%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '50%')}
                  ></div>
                  <div 
                    className="absolute -top-1.5 left-[70%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '70%')}
                  ></div>
                  <div 
                    className="absolute -top-1.5 left-[85%] w-3 h-3 bg-green-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                    onClick={() => onAnomalyClick('normal', undefined, '85%')}
                  ></div>
                  
                  {/* Anomalies */}
                  <div 
                    className="absolute -top-3 left-[40%] w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                    onClick={() => onAnomalyClick('anomaly', 'high', '40%')}
                  >!</div>
                  
                  <div 
                    className="absolute -top-3 left-[60%] w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                    onClick={() => onAnomalyClick('anomaly', 'medium', '60%')}
                  >!</div>
                  
                  <div 
                    className="absolute -top-3 left-[90%] w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:scale-150 transition-transform cursor-pointer z-10"
                    onClick={() => onAnomalyClick('anomaly', 'high', '90%')}
                  >!</div>
                </div>
              </div>
              
              {/* Process Steps */}
              <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
                <span>Start</span>
                <span>KYC</span>
                <span>Risk Check</span>
                <span>Approval</span>
                <span>End</span>
              </div>
              
              {/* Anomaly Details */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border">
                <div className="text-xs font-medium mb-2">Detected Anomalies</div>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="flex-1">Risk Check - Bypass Detected (5 cases)</span>
                    <span className="text-red-500 font-medium">High</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="flex-1">Approval - Unusually Fast (12 cases)</span>
                    <span className="text-amber-500 font-medium">Medium</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="flex-1">End - Missing Documentation (8 cases)</span>
                    <span className="text-red-500 font-medium">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Critical Anomaly</div>
            <div className="font-medium">Risk Check Bypass</div>
            <div className="text-xs text-red-600">Potential Fraud</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            <div className="text-xs text-muted-foreground">Trend</div>
            <div className="font-medium">18 New Outliers</div>
            <div className="text-xs text-blue-600">This month</div>
          </div>
        </div>
        
        <div 
          className="w-full flex items-center justify-between p-2 mt-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
          onClick={onViewClick}
        >
          <span>View Anomaly Detection</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
