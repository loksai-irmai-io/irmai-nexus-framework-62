
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DualGaugeDisplayProps {
  inherentScore: number;
  residualScore: number;
  controlEffectiveness: number;
}

const DualGaugeDisplay: React.FC<DualGaugeDisplayProps> = ({ 
  inherentScore, 
  residualScore,
  controlEffectiveness 
}) => {
  const getScoreColor = (score: number) => {
    if (score > 60) return 'text-red-500';
    if (score > 30) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getScoreBackground = (score: number) => {
    if (score > 60) return 'bg-red-100';
    if (score > 30) return 'bg-amber-100';
    return 'bg-green-100';
  };
  
  // Calculate the angle for the gauge needles (0 to 180 degrees)
  const inherentAngle = Math.min(180, Math.max(0, (inherentScore / 100) * 180));
  const residualAngle = Math.min(180, Math.max(0, (residualScore / 100) * 180));
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="text-center mb-2">
            <h4 className="text-sm font-medium">Inherent Risk</h4>
            <p className="text-xs text-muted-foreground">Before controls</p>
          </div>
          
          <div className="relative h-[120px] flex items-center justify-center">
            {/* Gauge background */}
            <div className="absolute h-[120px] w-[120px]">
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="h-[120px] w-[120px] rounded-full border-[8px] border-slate-200"></div>
              </div>
              
              {/* Gauge segments */}
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[120deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-green-200 border-t-green-400 border-r-green-400"></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[60deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-amber-200 border-t-amber-400 border-r-amber-400"></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[0deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-red-200 border-t-red-400 border-r-red-400"></div>
                </div>
              </div>
              
              {/* Gauge needle */}
              <div 
                className="absolute bottom-0 left-[60px] w-[2px] h-[55px] bg-slate-800 origin-bottom transition-transform duration-500 ease-in-out"
                style={{ transform: `rotate(${inherentAngle - 90}deg)` }}
              ></div>
              <div className="absolute bottom-0 left-[56px] w-[10px] h-[10px] rounded-full bg-slate-800"></div>
            </div>
            
            {/* Score display */}
            <div className={cn(
              "absolute bottom-[-10px] text-lg font-bold rounded-full w-[40px] h-[40px] flex items-center justify-center",
              getScoreBackground(inherentScore)
            )}>
              <span className={getScoreColor(inherentScore)}>{inherentScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="text-center mb-2">
            <h4 className="text-sm font-medium">Residual Risk</h4>
            <p className="text-xs text-muted-foreground">After controls</p>
          </div>
          
          <div className="relative h-[120px] flex items-center justify-center">
            {/* Gauge background */}
            <div className="absolute h-[120px] w-[120px]">
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="h-[120px] w-[120px] rounded-full border-[8px] border-slate-200"></div>
              </div>
              
              {/* Gauge segments */}
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[120deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-green-200 border-t-green-400 border-r-green-400"></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[60deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-amber-200 border-t-amber-400 border-r-amber-400"></div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden rotate-[0deg] origin-bottom">
                  <div className="h-[120px] w-[120px] rounded-full border-[8px] border-red-200 border-t-red-400 border-r-red-400"></div>
                </div>
              </div>
              
              {/* Gauge needle */}
              <div 
                className="absolute bottom-0 left-[60px] w-[2px] h-[55px] bg-slate-800 origin-bottom transition-transform duration-500 ease-in-out"
                style={{ transform: `rotate(${residualAngle - 90}deg)` }}
              ></div>
              <div className="absolute bottom-0 left-[56px] w-[10px] h-[10px] rounded-full bg-slate-800"></div>
            </div>
            
            {/* Score display */}
            <div className={cn(
              "absolute bottom-[-10px] text-lg font-bold rounded-full w-[40px] h-[40px] flex items-center justify-center",
              getScoreBackground(residualScore)
            )}>
              <span className={getScoreColor(residualScore)}>{residualScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="col-span-2 px-4 pt-2 border-t">
        <div className="flex justify-between text-sm">
          <span>Risk Reduction:</span>
          <span className="font-medium text-green-600">{Math.round((inherentScore - residualScore) / inherentScore * 100)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Control Effectiveness:</span>
          <span className="font-medium">{controlEffectiveness}%</span>
        </div>
      </div>
    </div>
  );
};

export default DualGaugeDisplay;
