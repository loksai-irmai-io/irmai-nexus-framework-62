
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Link, 
  AlertTriangle, 
  Shield, 
  Layers, 
  BrainCircuit, 
  CheckCircle2,
  Edit2,
  UserCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink 
} from 'lucide-react';
import { mockRiskData } from './mockData';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RiskFactorEditor from './RiskFactorEditor';
import DualGaugeDisplay from './DualGaugeDisplay';

interface RiskDetailViewProps {
  riskId: string;
  onBack: () => void;
}

const RiskDetailView: React.FC<RiskDetailViewProps> = ({ riskId, onBack }) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingFactor, setEditingFactor] = useState<any>(null);
  const [factorsOverridden, setFactorsOverridden] = useState<Record<string, boolean>>({});
  const [insightValidated, setInsightValidated] = useState<boolean | null>(null);

  // Find risk by ID or use a synthetic ID (like 'critical' or 'high')
  let risks = mockRiskData;
  if (riskId === 'critical') {
    risks = mockRiskData.filter(r => r.severity === 'critical');
  } else if (riskId === 'high') {
    risks = mockRiskData.filter(r => r.severity === 'high');
  }
  
  // For demo purposes, either use the real risk or the first critical/high risk
  const risk = risks.find(r => r.id === riskId) || risks[0];
  
  // If no risk found, show a message
  if (!risk) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Risk Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested risk could not be found or has been removed.
        </p>
        <Button onClick={onBack}>Return to Risk Overview</Button>
      </div>
    );
  }
  
  // Generate failure modes for this risk (would come from API in a real app)
  const failureModes = [
    {
      id: 'fm1',
      name: 'Data Input Error',
      description: 'Incorrect or invalid data is entered into the system',
      severity: 4,
      likelihood: 3,
      detectability: 2,
      controls: ['Input validation', 'User training'],
      isAiSuggested: true
    },
    {
      id: 'fm2',
      name: 'System Processing Failure',
      description: 'System fails to process data correctly or completely',
      severity: 5,
      likelihood: 2,
      detectability: 3,
      controls: ['System monitoring', 'Automated testing'],
      isAiSuggested: false
    },
    {
      id: 'fm3',
      name: 'Regulatory Non-Compliance',
      description: 'Process does not meet regulatory requirements',
      severity: 5,
      likelihood: 2,
      detectability: 4,
      controls: ['Compliance checks', 'Regular audits'],
      isAiSuggested: true
    }
  ];
  
  // Calculate RPN for each failure mode
  const failureModesWithRPN = failureModes.map(mode => ({
    ...mode,
    rpn: mode.severity * mode.likelihood * mode.detectability,
    isOverridden: factorsOverridden[mode.id] || false
  }));
  
  // Calculate the overall inherent and residual risk scores
  const inherentRiskScore = Math.round(failureModesWithRPN.reduce((acc, mode) => acc + mode.rpn, 0) / failureModesWithRPN.length);
  const controlEffectiveness = 68; // percentage, would be calculated based on control assessments
  const residualRiskScore = Math.round(inherentRiskScore * (1 - controlEffectiveness / 100));
  
  const handleEditFactor = (factor: any) => {
    setEditingFactor(factor);
    setShowEditor(true);
  };
  
  const handleSaveFactor = (factorId: string, updatedValues: any) => {
    console.log('Saving updated factor:', factorId, updatedValues);
    // In a real app, you would update the factor in the database
    setFactorsOverridden(prev => ({ ...prev, [factorId]: true }));
    setShowEditor(false);
  };
  
  const handleValidateInsight = (isApproved: boolean) => {
    setInsightValidated(isApproved);
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Risk Details – {risk.name}</h2>
          <p className="text-muted-foreground text-sm">{risk.category} risk • Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Risk Description</h3>
                <p className="text-sm">{risk.description || "This risk relates to potential failures in the operational process that could lead to financial losses, compliance issues, or reputational damage."}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Associated Process</h3>
                <div className="flex items-center">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    Payment Processing
                  </Badge>
                  <Button variant="link" size="sm" className="text-xs ml-2">
                    View in Process Discovery
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Risk Scores</h3>
                  <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                    <BrainCircuit className="h-3 w-3" />
                    AI Calculated
                  </Badge>
                </div>
                
                <DualGaugeDisplay 
                  inherentScore={inherentRiskScore} 
                  residualScore={residualRiskScore} 
                  controlEffectiveness={controlEffectiveness} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Severity</span>
                  <Badge 
                    className={
                      risk.severityScore > 4 ? 'bg-red-100 text-red-800' : 
                      risk.severityScore > 2 ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'
                    }
                  >
                    {risk.severityScore}/5
                  </Badge>
                </div>
                <Progress value={risk.severityScore * 20} 
                  className={
                    risk.severityScore > 4 ? 'bg-red-100' : 
                    risk.severityScore > 2 ? 'bg-amber-100' : 
                    'bg-green-100'
                  } 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Likelihood</span>
                  <Badge 
                    className={
                      risk.likelihoodScore > 4 ? 'bg-red-100 text-red-800' : 
                      risk.likelihoodScore > 2 ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'
                    }
                  >
                    {risk.likelihoodScore}/5
                  </Badge>
                </div>
                <Progress value={risk.likelihoodScore * 20} 
                  className={
                    risk.likelihoodScore > 4 ? 'bg-red-100' : 
                    risk.likelihoodScore > 2 ? 'bg-amber-100' : 
                    'bg-green-100'
                  } 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Detectability</span>
                  <Badge 
                    className={
                      risk.detectabilityScore > 3 ? 'bg-red-100 text-red-800' : 
                      risk.detectabilityScore > 2 ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'
                    }
                  >
                    {risk.detectabilityScore || 3}/5
                  </Badge>
                </div>
                <Progress value={(risk.detectabilityScore || 3) * 20} 
                  className={
                    risk.detectabilityScore > 3 ? 'bg-red-100' : 
                    risk.detectabilityScore > 2 ? 'bg-amber-100' : 
                    'bg-green-100'
                  } 
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Control Effectiveness</h4>
                    <p className="text-xs text-muted-foreground">Based on current controls</p>
                  </div>
                  <Badge 
                    className={
                      controlEffectiveness > 80 ? 'bg-green-100 text-green-800' : 
                      controlEffectiveness > 50 ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }
                  >
                    {controlEffectiveness}%
                  </Badge>
                </div>
                <Progress value={controlEffectiveness} className="mt-2" />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Control Count</h4>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Preventive: 4</span>
                  <span>Detective: 2</span>
                  <span>Corrective: 1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">FMEA Breakdown</CardTitle>
            <Badge variant="outline">
              {failureModesWithRPN.length} Failure Modes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Failure Mode</TableHead>
                  <TableHead className="w-[80px] text-center">Severity (S)</TableHead>
                  <TableHead className="w-[80px] text-center">Likelihood (L)</TableHead>
                  <TableHead className="w-[80px] text-center">Detect. (D)</TableHead>
                  <TableHead className="w-[80px] text-center">RPN</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failureModesWithRPN.map((mode) => {
                  const rpnClass = 
                    mode.rpn > 60 ? 'text-red-600 font-bold' :
                    mode.rpn > 30 ? 'text-amber-600 font-bold' :
                    'text-green-600';
                  
                  return (
                    <TableRow key={mode.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{mode.name}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                        <div className="flex gap-1 mt-1">
                          {mode.isAiSuggested && (
                            <Badge variant="outline" className="text-xs bg-purple-50 flex items-center gap-0.5">
                              <BrainCircuit className="h-2.5 w-2.5" />
                              <span>AI Suggested</span>
                            </Badge>
                          )}
                          {mode.isOverridden && (
                            <Badge variant="outline" className="text-xs bg-blue-50 flex items-center gap-0.5">
                              <UserCircle className="h-2.5 w-2.5" />
                              <span>Human Verified</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{mode.severity}</TableCell>
                      <TableCell className="text-center">{mode.likelihood}</TableCell>
                      <TableCell className="text-center">{mode.detectability}</TableCell>
                      <TableCell className={`text-center ${rpnClass}`}>{mode.rpn}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleEditFactor(mode)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit risk factor – your input helps refine the AI suggestion</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">AI Recommendation</CardTitle>
              <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" />
                AI Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50 rounded-md border border-purple-100">
                      <p className="text-sm">
                        <strong>AI recommends reviewing control "Input Validation"</strong> based on recent incident data. 
                        The current implementation has shown a 23% failure rate in the last month, significantly above the 5% threshold.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs">1</span>
                          </div>
                          <span>Implement additional validation rules for numeric fields</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs">2</span>
                          </div>
                          <span>Add automated testing for edge cases in the validation process</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs">3</span>
                          </div>
                          <span>Enhance error logging to capture validation failures more effectively</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center">
                        <BrainCircuit className="h-4 w-4 text-purple-600 mr-2" />
                        <h4 className="text-sm font-medium">AI Analysis Basis:</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This recommendation is based on analysis of 142 validation events, 6 reported incidents, 
                        and patterns observed in similar processes across the organization.
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>AI-generated recommendation – please confirm or modify</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Human-in-the-Loop Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm">
                  Your feedback ensures that automated risk assessments are manually reviewed and validated before being used for decision-making.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Validation Status:</h4>
                {insightValidated === null ? (
                  <div className="flex items-center p-2 bg-amber-50 text-amber-800 rounded">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Pending validation</span>
                  </div>
                ) : insightValidated ? (
                  <div className="flex items-center p-2 bg-green-50 text-green-800 rounded">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Insight approved</span>
                  </div>
                ) : (
                  <div className="flex items-center p-2 bg-red-50 text-red-800 rounded">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm">Insight overridden</span>
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-3">Validate AI Insight:</h4>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={() => handleValidateInsight(true)}
                    disabled={insightValidated === true}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700" 
                    onClick={() => handleValidateInsight(false)}
                    disabled={insightValidated === false}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Override
                  </Button>
                </div>
              </div>
              
              {insightValidated === false && (
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Provide Feedback:</h4>
                  <textarea 
                    className="w-full min-h-[80px] p-2 text-sm border rounded"
                    placeholder="Please explain why you're overriding the AI recommendation..."
                  />
                  <Button size="sm" className="mt-2">
                    Submit Feedback
                  </Button>
                </div>
              )}
              
              <div className="text-xs flex items-center justify-end text-blue-600 pt-2">
                <span>View validation history</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showEditor && editingFactor && (
        <RiskFactorEditor 
          factor={editingFactor}
          onSave={handleSaveFactor}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default RiskDetailView;
