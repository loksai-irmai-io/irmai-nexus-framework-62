
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Info, Activity, CheckCheck, CheckCircle2, XCircle } from 'lucide-react';
import { InsightItem } from './types';

interface ProcessInsightsProps {
  insights: InsightItem[];
  onInsightClick: (nodeId: string) => void;
  onValidateInsight: (insightId: number) => void;
}

export const ProcessInsights: React.FC<ProcessInsightsProps> = ({ 
  insights, 
  onInsightClick, 
  onValidateInsight 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Insights</CardTitle>
        <CardDescription>AI-detected anomalies, optimization opportunities and compliance issues</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg border ${
                insight.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                insight.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                insight.severity === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => onInsightClick(insight.nodeId)}
                >
                  <div className="flex items-center mb-1">
                    {insight.type === 'anomaly' && <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />}
                    {insight.type === 'compliance' && <Info className="h-4 w-4 text-blue-500 mr-1" />}
                    {insight.type === 'optimization' && <Activity className="h-4 w-4 text-green-500 mr-1" />}
                    <span className="text-sm font-medium capitalize">{insight.type}</span>
                    <Badge 
                      variant="outline" 
                      className="ml-2 text-xs"
                    >
                      {insight.severity}
                    </Badge>
                  </div>
                  <p className="text-sm">{insight.description}</p>
                </div>
                
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => onValidateInsight(insight.id)}
                        >
                          {insight.status === 'validated' ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>
                          {insight.status === 'validated' 
                            ? 'This insight has been validated' 
                            : 'Click to validate this AI-generated insight'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Compliance Summary</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Compliance</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                <span>Compliant steps</span>
              </div>
              <span>7</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                <span>Non-compliant steps</span>
              </div>
              <span>2</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
