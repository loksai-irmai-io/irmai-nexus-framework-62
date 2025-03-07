
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  ChevronRight,
  Eye 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopRiskCardsProps {
  risks: any[];
  onRiskClick: (riskId: string) => void;
}

const TopRiskCards: React.FC<TopRiskCardsProps> = ({ risks, onRiskClick }) => {
  // Calculate RPN scores (Severity x Likelihood x Detectability)
  const risksWithRPN = risks.map(risk => {
    const severityScore = risk.severityScore || 3;
    const likelihoodScore = risk.likelihoodScore || 2;
    const detectabilityScore = risk.detectabilityScore || 2;
    
    return {
      ...risk,
      rpn: severityScore * likelihoodScore * detectabilityScore,
      detectabilityLevel: detectabilityScore <= 1 ? 'High' : detectabilityScore <= 3 ? 'Medium' : 'Low',
      severityLevel: risk.severity === 'critical' ? 'Critical' : 
                    risk.severity === 'high' ? 'High' : 
                    risk.severity === 'medium' ? 'Medium' : 'Low',
      likelihoodLevel: likelihoodScore <= 1 ? 'Low' : likelihoodScore <= 3 ? 'Medium' : 'High'
    };
  });
  
  // Sort risks by RPN (highest first) and take top 5
  const topRisks = risksWithRPN
    .sort((a, b) => b.rpn - a.rpn)
    .slice(0, 4);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Top Risks by RPN Score</h3>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                What is RPN?
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Risk Priority Number (RPN) = Severity × Likelihood × Detectability.
                <br />
                Higher numbers indicate higher risk priority.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRisks.map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`
                    hover:shadow-md transition-all cursor-pointer border-l-4
                    ${risk.rpn > 75 ? 'border-l-red-500' : 
                      risk.rpn > 40 ? 'border-l-orange-500' : 
                      risk.rpn > 20 ? 'border-l-amber-500' : 'border-l-green-500'}
                  `}
                  onClick={() => onRiskClick(risk.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{risk.name}</h4>
                      {risk.severity === 'critical' && (
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 ml-1" />
                      )}
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">RPN Score:</span>
                        <Badge 
                          className={`
                            ${risk.rpn > 75 ? 'bg-red-100 text-red-800' : 
                              risk.rpn > 40 ? 'bg-orange-100 text-orange-800' : 
                              risk.rpn > 20 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}
                          `}
                        >
                          {risk.rpn}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Severity:</span>
                        <Badge variant="outline" className="text-xs">
                          {risk.severityLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Likelihood:</span>
                        <Badge variant="outline" className="text-xs">
                          {risk.likelihoodLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Detectability:</span>
                        <Badge variant="outline" className="text-xs">
                          {risk.detectabilityLevel}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-end text-xs text-blue-600">
                      <span>View details</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Click a risk card for detailed analysis</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TopRiskCards;
