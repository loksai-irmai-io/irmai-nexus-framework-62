
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, CheckCircle, XCircle, AlertTriangle, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { OutlierInsight } from './types';
import { useToast } from '@/hooks/use-toast';

// Mock insights for the demo
const mockInsights: OutlierInsight[] = [
  {
    id: 1,
    type: 'anomaly',
    description: 'Approval process shows 245% delay compared to normal patterns',
    status: 'pending',
    severity: 'critical',
    nodeId: 'approval-node',
    recommendation: 'Consider reallocating resources to reduce bottlenecks in the approval workflow',
    validated: false,
    overridden: false,
    impact: 85
  },
  {
    id: 2,
    type: 'anomaly',
    description: 'Customer verification is being skipped in 23% of recent transactions',
    status: 'pending',
    severity: 'high',
    nodeId: 'verification-node',
    recommendation: 'Implement mandatory checks and update team training on customer verification importance',
    validated: false,
    overridden: false,
    impact: 72
  },
  {
    id: 3,
    type: 'anomaly',
    description: 'Resource utilization for claims processing shows significant imbalance',
    status: 'pending',
    severity: 'medium',
    nodeId: 'claims-node',
    recommendation: 'Redistribute workload among available resources based on capacity and expertise',
    validated: false,
    overridden: false,
    impact: 56
  },
  {
    id: 4,
    type: 'anomaly',
    description: 'Duplicate data entry detected in customer onboarding',
    status: 'validated',
    severity: 'low',
    nodeId: 'onboarding-node',
    recommendation: 'Update data integration between CRM and onboarding systems to prevent duplicate entries',
    validated: true,
    overridden: false,
    impact: 35
  }
];

const OutlierAIInsights: React.FC = () => {
  const { toast } = useToast();
  
  const handleValidate = (id: number) => {
    toast({
      title: "Insight validated",
      description: "The AI insight has been validated and added to your action items",
    });
  };
  
  const handleOverride = (id: number) => {
    toast({
      title: "Insight overridden",
      description: "The AI insight has been marked as a false positive",
    });
  };
  
  // Generate the severity badge with appropriate color
  const getSeverityBadge = (severity: string) => {
    let color = "";
    switch (severity) {
      case 'critical':
        color = "bg-red-500 text-white hover:bg-red-600";
        break;
      case 'high':
        color = "bg-orange-500 text-white hover:bg-orange-600";
        break;
      case 'medium':
        color = "bg-yellow-500 text-black hover:bg-yellow-600";
        break;
      case 'low':
        color = "bg-green-500 text-white hover:bg-green-600";
        break;
      default:
        color = "bg-blue-500 text-white hover:bg-blue-600";
    }
    
    return (
      <Badge className={color}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };
  
  // Display the appropriate icon based on severity
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-5 w-5 text-blue-500" />
          AI-Guided Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Predictive alert */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Predictive Alert</p>
                <p className="text-sm mt-1">Outliers trending upward – 15 predicted in next 24 hours in the approval process.</p>
              </div>
            </div>
          </div>
          
          {/* Insights list */}
          <div>
            <div className="text-sm font-medium mb-2">Anomaly Insights & Recommendations</div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {mockInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className="border rounded-md p-3 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(insight.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(insight.severity)}
                        <Badge variant="outline" className="bg-blue-50/50 text-xs">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Insight
                        </Badge>
                      </div>
                      
                      <p className="text-sm font-medium mt-2">
                        {insight.description}
                      </p>
                      
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong className="font-medium text-foreground">Recommendation:</strong> {insight.recommendation}
                      </div>
                      
                      {insight.validated ? (
                        <div className="mt-2 text-sm flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Validated
                        </div>
                      ) : insight.overridden ? (
                        <div className="mt-2 text-sm flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Overridden
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="success" 
                            className="h-8"
                            onClick={() => handleValidate(insight.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Validate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8"
                            onClick={() => handleOverride(insight.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Override
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="link" className="w-full mt-3">
              View All Insights
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierAIInsights;
