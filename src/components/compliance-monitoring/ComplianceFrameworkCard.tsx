
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComplianceFramework } from './types';
import { TrendingUp, TrendingDown, ShieldCheck, ShieldAlert, CalendarClock, ExternalLink } from 'lucide-react';

interface ComplianceFrameworkCardProps {
  framework: ComplianceFramework;
  onClick: () => void;
}

export const ComplianceFrameworkCard: React.FC<ComplianceFrameworkCardProps> = ({ 
  framework, 
  onClick 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getTrendIcon = () => {
    switch (framework.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = () => {
    switch (framework.priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
              {framework.name}
            </h3>
            <p className="text-sm text-muted-foreground">{framework.description}</p>
          </div>
          {getPriorityBadge()}
        </div>
        
        <div className="mt-4 flex items-end">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
            <div className="flex items-center">
              <span className={`text-3xl font-bold ${getScoreColor(framework.complianceScore)}`}>
                {framework.complianceScore}%
              </span>
              
              {framework.trend !== 'neutral' && (
                <div className="flex items-center ml-2 text-xs">
                  {getTrendIcon()}
                  <span className={framework.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                    {Math.abs(framework.complianceScore - framework.previousScore)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center text-sm">
              <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
              <span>{framework.passedControls} Passing</span>
            </div>
            <div className="flex items-center text-sm">
              <ShieldAlert className="h-4 w-4 mr-1 text-red-600" />
              <span>{framework.failedControls} Failing</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              <span>Next assessment: {new Date(framework.nextAssessment).toLocaleDateString()}</span>
            </div>
            <span>Owner: {framework.owners.join(', ')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <div className="text-xs text-blue-600 flex items-center mt-1">
          <ExternalLink className="h-3 w-3 mr-1" />
          <span>View details</span>
        </div>
      </CardFooter>
    </Card>
  );
};
