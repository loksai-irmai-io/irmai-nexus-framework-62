
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircleAlert, ShieldAlert, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface RiskInsight {
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  trend: 'increasing' | 'decreasing' | 'stable';
  source: string;
  confidence: number;
}

interface AIRiskSummaryProps {
  className?: string;
}

const AIRiskSummary: React.FC<AIRiskSummaryProps> = ({ className }) => {
  const insights: RiskInsight[] = [
    {
      title: "Payment Fraud Risk",
      description: "12% increase in suspicious payment patterns detected in the last 30 days",
      impact: 'high',
      trend: 'increasing',
      source: 'anomaly detection',
      confidence: 87
    },
    {
      title: "Data Privacy Controls",
      description: "GDPR compliance improved but 3 critical gaps identified in customer data handling",
      impact: 'critical',
      trend: 'decreasing',
      source: 'compliance monitoring',
      confidence: 92
    },
    {
      title: "Operational Bottlenecks",
      description: "Customer onboarding efficiency improved by 15% after process redesign",
      impact: 'medium',
      trend: 'decreasing',
      source: 'process discovery',
      confidence: 85
    },
    {
      title: "Disaster Recovery Readiness",
      description: "System resilience tests show 94% recovery success rate, up from 89%",
      impact: 'high',
      trend: 'decreasing',
      source: 'scenario analysis',
      confidence: 90
    }
  ];
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />;
      default: return null;
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            AI Overall Risk Summary
          </CardTitle>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            AI-Generated
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Machine learning powered analysis of your risk landscape, based on integrated data from all modules.
        </p>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="relative">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <CircleAlert className={cn(
                    "h-5 w-5",
                    insight.impact === 'critical' ? "text-red-500" :
                    insight.impact === 'high' ? "text-orange-500" :
                    insight.impact === 'medium' ? "text-yellow-500" : "text-green-500"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(insight.trend)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className={getImpactColor(insight.impact)}>
                              {insight.impact}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Impact level: {insight.impact}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Source: {insight.source}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center">
                            <ShieldAlert className="h-3 w-3 mr-1" />
                            Confidence: {insight.confidence}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">AI confidence level in this insight</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              {index < insights.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRiskSummary;
