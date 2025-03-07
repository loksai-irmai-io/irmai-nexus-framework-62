
import React from 'react';
import { HeatmapCell, ComplianceFramework, BusinessUnit } from './types';
import { TrendingUp, TrendingDown, AlertTriangle, CircleAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComplianceHeatmapProps {
  data: HeatmapCell[];
  frameworks: ComplianceFramework[];
  businessUnits: BusinessUnit[];
  onCellClick: (frameworkId: string) => void;
}

export const ComplianceHeatmap: React.FC<ComplianceHeatmapProps> = ({ 
  data, 
  frameworks, 
  businessUnits,
  onCellClick
}) => {
  const getCellColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (score >= 70) return 'bg-amber-100 dark:bg-amber-900/30';
    if (score >= 60) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };
  
  const getScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-green-800 dark:text-green-300';
    if (score >= 80) return 'text-emerald-800 dark:text-emerald-300';
    if (score >= 70) return 'text-amber-800 dark:text-amber-300';
    if (score >= 60) return 'text-orange-800 dark:text-orange-300';
    return 'text-red-800 dark:text-red-300';
  };
  
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b font-medium text-left"></th>
            {frameworks.map(framework => (
              <th key={framework.id} className="p-2 border-b font-medium text-center min-w-[120px]">
                {framework.name}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {businessUnits.map(businessUnit => (
            <tr key={businessUnit.id}>
              <td className="p-2 border-b font-medium">
                <div>
                  <div>{businessUnit.name}</div>
                  <div className="text-xs text-muted-foreground">Lead: {businessUnit.head}</div>
                </div>
              </td>
              
              {frameworks.map(framework => {
                const cell = data.find(
                  item => item.frameworkId === framework.id && item.businessUnitId === businessUnit.id
                );
                
                if (!cell) return <td key={framework.id} className="p-2 border-b text-center">-</td>;
                
                return (
                  <td 
                    key={framework.id} 
                    className={`p-2 border-b text-center ${getCellColor(cell.complianceScore)} cursor-pointer transition-colors hover:opacity-80`}
                    onClick={() => onCellClick(framework.id)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className={`font-bold ${getScoreTextColor(cell.complianceScore)}`}>
                                {cell.complianceScore}%
                              </span>
                              {getTrendIcon(cell.trend)}
                            </div>
                            
                            {(cell.alertCount > 0 || cell.gapCount > 0) && (
                              <div className="flex items-center justify-center gap-2 mt-1 text-xs">
                                {cell.alertCount > 0 && (
                                  <div className="flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-0.5 text-amber-600" />
                                    <span>{cell.alertCount}</span>
                                  </div>
                                )}
                                
                                {cell.gapCount > 0 && (
                                  <div className="flex items-center">
                                    <CircleAlert className="h-3 w-3 mr-0.5 text-red-600" />
                                    <span>{cell.gapCount}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p><strong>{businessUnit.name}</strong> compliance with <strong>{framework.name}</strong></p>
                          <p className="text-xs">{cell.alertCount} alerts, {cell.gapCount} gaps identified</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
