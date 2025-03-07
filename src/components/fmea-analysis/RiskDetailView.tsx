import React, { useState } from 'react';
import { ArrowLeft, BarChart4, Calendar, Clock, Edit, ExternalLink, FileCheck, Flag, Info, Layers, List, MapPin, MoreHorizontal, Shield, Sparkles, UserCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Chart from '@/components/dashboard/Chart';
import { Progress } from "@/components/ui/progress";
import { mockRiskData } from './mockData';

interface RiskDetailViewProps {
  riskId: string;
  onBack: () => void;
}

const RiskDetailView: React.FC<RiskDetailViewProps> = ({ riskId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getRisk = () => {
    if (riskId === 'critical') {
      return mockRiskData.find(risk => risk.severity === 'critical');
    } 
    if (riskId === 'high') {
      return mockRiskData.find(risk => risk.severity === 'high');
    }
    if (riskId.startsWith('severity-')) {
      const parts = riskId.split('-');
      const severityValue = parseInt(parts[1]);
      const probabilityValue = parseInt(parts[3]);
      
      return mockRiskData.find(r => 
        Math.floor(r.severityScore / 2) === severityValue - 1 && 
        Math.floor(r.likelihoodScore / 2) === probabilityValue - 1
      );
    }
    return mockRiskData.find(risk => risk.id === riskId);
  };
  
  const risk = getRisk() || mockRiskData[0];
  
  const trendData = [
    { month: 'Jan', score: 52 },
    { month: 'Feb', score: 48 },
    { month: 'Mar', score: 50 },
    { month: 'Apr', score: 57 },
    { month: 'May', score: 62 },
    { month: 'Jun', score: 65 },
    { month: 'Jul', score: 68 }
  ];
  
  const trendSeries = [
    { name: 'Risk Score', dataKey: 'score', color: '#f43f5e' }
  ];
  
  const controlData = [
    { name: 'Preventive', value: 65 },
    { name: 'Detective', value: 20 },
    { name: 'Corrective', value: 15 }
  ];
  
  const controlSeries = [
    { name: 'Controls', dataKey: 'value', color: '#8b5cf6' }
  ];
  
  const relatedRisks = mockRiskData
    .filter(r => r.id !== risk.id)
    .filter(r => r.category === risk.category)
    .slice(0, 3);
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Overview
        </Button>
        <span className="text-muted-foreground">|</span>
        <Badge variant="outline">{risk.category}</Badge>
        <Badge 
          className={
            risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
            risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
            risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
            'bg-green-100 text-green-800'
          }
        >
          {risk.severity}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 mr-2 text-red-500" />
                    <CardTitle>{risk.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Severity</span>
                  <div className="flex items-center">
                    <Badge 
                      className={
                        risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {risk.severity}
                    </Badge>
                    <span className="ml-2 text-sm font-medium">{risk.severityScore}/10</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Likelihood</span>
                  <div className="flex items-center">
                    <Badge 
                      className={
                        risk.likelihood === 'high' ? 'bg-red-100 text-red-800' :
                        risk.likelihood === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {risk.likelihood}
                    </Badge>
                    <span className="ml-2 text-sm font-medium">{risk.likelihoodScore}/10</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Impact Score</span>
                  <span className="text-sm font-medium">{risk.impactScore}/10</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Control Effectiveness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={risk.controlEffectiveness} className="h-2" />
                    <span className="text-sm font-medium">{risk.controlEffectiveness}%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-2 border-t border-b">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground">Owner</span>
                    <p className="text-sm">{risk.owner}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground">Last Updated</span>
                    <p className="text-sm">{risk.lastUpdated}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <p className="text-sm capitalize">{risk.status}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 h-9">
                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="controls" className="text-xs">Controls</TabsTrigger>
                    <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
                    <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <BarChart4 className="h-4 w-4 mr-2" />
                            Risk Trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Chart 
                            title="Risk Trend" 
                            data={trendData}
                            series={trendSeries}
                            type="line"
                            xAxisKey="month"
                            height={150}
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Control Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Chart 
                            title="Control Breakdown"
                            data={controlData}
                            series={controlSeries}
                            type="pie"
                            xAxisKey="name"
                            height={150}
                          />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Key Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-medium">Mitigation Strategy</h4>
                            <p className="text-muted-foreground">{risk.mitigation}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Risk Indicators</h4>
                            <ul className="list-disc pl-5 text-muted-foreground">
                              <li>Control effectiveness trend: {risk.trendDirection}</li>
                              <li>Related incidents: {risk.relatedIncidents} in the last quarter</li>
                              <li>Process maturity: Medium</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium flex items-center">
                              <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                              AI Insights
                            </h4>
                            <div className="p-2 bg-purple-50 text-purple-800 rounded-sm text-xs">
                              Based on current trends, this risk is likely to {risk.trendDirection === 'increasing' ? 'continue increasing' : risk.trendDirection === 'decreasing' ? 'stabilize at a lower level' : 'remain stable'} for the next quarter. Consider {risk.trendDirection === 'increasing' ? 'enhancing controls and monitoring frequency' : 'maintaining the current control strategy'}.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="controls" className="pt-4">
                    <div className="text-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Risk Controls ({risk.controlCount})</h3>
                        <Button variant="outline" className="text-xs h-8">
                          <FileCheck className="h-3 w-3 mr-1" />
                          Add Control
                        </Button>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-10 bg-muted p-2 text-xs font-medium">
                          <div className="col-span-3">Control Name</div>
                          <div className="col-span-1">Type</div>
                          <div className="col-span-2">Owner</div>
                          <div className="col-span-2">Last Tested</div>
                          <div className="col-span-1">Status</div>
                          <div className="col-span-1">Effectiveness</div>
                        </div>
                        
                        <div className="divide-y">
                          <div className="grid grid-cols-10 p-2 text-xs hover:bg-muted/50">
                            <div className="col-span-3 font-medium">Access Control System</div>
                            <div className="col-span-1">Preventive</div>
                            <div className="col-span-2">IT Security</div>
                            <div className="col-span-2">2023-05-15</div>
                            <div className="col-span-1">
                              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                            </div>
                            <div className="col-span-1">
                              <Badge className="bg-green-100 text-green-800">High</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-10 p-2 text-xs hover:bg-muted/50">
                            <div className="col-span-3 font-medium">Data Encryption</div>
                            <div className="col-span-1">Preventive</div>
                            <div className="col-span-2">IT Security</div>
                            <div className="col-span-2">2023-06-10</div>
                            <div className="col-span-1">
                              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                            </div>
                            <div className="col-span-1">
                              <Badge className="bg-green-100 text-green-800">High</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-10 p-2 text-xs hover:bg-muted/50">
                            <div className="col-span-3 font-medium">Security Monitoring</div>
                            <div className="col-span-1">Detective</div>
                            <div className="col-span-2">Security Ops</div>
                            <div className="col-span-2">2023-06-22</div>
                            <div className="col-span-1">
                              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                            </div>
                            <div className="col-span-1">
                              <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-10 p-2 text-xs hover:bg-muted/50">
                            <div className="col-span-3 font-medium">Incident Response</div>
                            <div className="col-span-1">Corrective</div>
                            <div className="col-span-2">IT Operations</div>
                            <div className="col-span-2">2023-05-05</div>
                            <div className="col-span-1">
                              <Badge variant="outline" className="text-amber-600 bg-amber-50">Review</Badge>
                            </div>
                            <div className="col-span-1">
                              <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Showing 4 of {risk.controlCount} controls</span>
                        <Button variant="link" className="h-auto p-0 text-xs">View All Controls</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Risk History & Changes</h3>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3 text-sm">
                          <div className="w-24 text-muted-foreground">2023-06-15</div>
                          <div className="w-28 text-muted-foreground">System</div>
                          <div>Risk score increased from 65 to 68 based on updated threat intelligence.</div>
                        </div>
                        
                        <div className="flex gap-3 text-sm">
                          <div className="w-24 text-muted-foreground">2023-05-20</div>
                          <div className="w-28 text-muted-foreground">John Doe</div>
                          <div>Updated risk description and added new mitigation strategy.</div>
                        </div>
                        
                        <div className="flex gap-3 text-sm">
                          <div className="w-24 text-muted-foreground">2023-04-10</div>
                          <div className="w-28 text-muted-foreground">System</div>
                          <div>Control effectiveness decreased from 80% to 72% based on testing results.</div>
                        </div>
                        
                        <div className="flex gap-3 text-sm">
                          <div className="w-24 text-muted-foreground">2023-03-15</div>
                          <div className="w-28 text-muted-foreground">Sarah Johnson</div>
                          <div>Risk initially identified and assessed as HIGH severity.</div>
                        </div>
                      </div>
                      
                      <Button variant="link" className="h-auto p-0 text-xs">View Complete History</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Available Reports</h3>
                        <Button variant="outline" className="text-xs h-8">
                          <List className="h-3 w-3 mr-1" />
                          Generate Report
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Card className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                          <div>
                            <h4 className="text-sm font-medium">Risk Detail Report</h4>
                            <p className="text-xs text-muted-foreground">Comprehensive assessment of risk factors and controls</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Card>
                        
                        <Card className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                          <div>
                            <h4 className="text-sm font-medium">Control Effectiveness Report</h4>
                            <p className="text-xs text-muted-foreground">Analysis of control performance and test results</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Card>
                        
                        <Card className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                          <div>
                            <h4 className="text-sm font-medium">Historical Trend Analysis</h4>
                            <p className="text-xs text-muted-foreground">Risk score and factor changes over time</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Risk Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Combined Risk Score</span>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">{risk.severityScore * risk.likelihoodScore / 2}</span>
                    <span className="text-xs text-muted-foreground ml-1">/50</span>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Combined score = (Severity x Likelihood) / 2</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Badge 
                      className={`ml-2 ${
                        risk.trendDirection === 'increasing' ? 'bg-red-100 text-red-800' : 
                        risk.trendDirection === 'decreasing' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {risk.trendDirection === 'increasing' ? '+' : risk.trendDirection === 'decreasing' ? '-' : ''}
                      {risk.trendPercentage}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Inherent Risk</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Residual Risk</span>
                    <span className="font-medium">{risk.severity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Risk Velocity</span>
                    <span className="font-medium">Medium-High</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Risk Appetite</span>
                    <span className="font-medium">Low</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-medium mb-1">Position on Risk Heatmap</h4>
                  <div className="grid grid-cols-5 gap-1">
                    {Array(5).fill(0).map((_, row) => (
                      Array(5).fill(0).map((_, col) => {
                        const isActive = 4 - row === Math.floor(risk.likelihoodScore / 2) - 1 && 
                                        col === Math.floor(risk.severityScore / 2) - 1;
                        return (
                          <div 
                            key={`${row}-${col}`}
                            className={`w-full aspect-square rounded 
                              ${isActive ? 'bg-red-500' : 
                                (row < 2 && col > 2) || (row < 1 && col > 1) ? 'bg-red-100' :
                                (row < 3 && col > 1) || (row < 4 && col > 3) ? 'bg-amber-100' :
                                'bg-green-100'
                              }`}
                          />
                        );
                      })
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Low Impact</span>
                    <span>High Impact</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-medium">Key Risk Indicators</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Security Incidents</span>
                        <Badge variant="outline" className="text-xs">Above Threshold</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Control Testing</span>
                        <Badge variant="outline" className="text-xs">Within Range</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Staff Training</span>
                        <Badge variant="outline" className="text-xs">Below Target</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Related Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {relatedRisks.map((relatedRisk, index) => (
                  <div key={index} className="p-2 border rounded hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{relatedRisk.name}</h4>
                      <Badge 
                        className={
                          relatedRisk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          relatedRisk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          relatedRisk.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {relatedRisk.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{relatedRisk.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Upcoming Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 border rounded hover:bg-muted/50">
                  <div className="text-xs text-center px-2 py-1 bg-blue-50 text-blue-800 rounded min-w-10">
                    <div className="font-bold">10</div>
                    <div>Aug</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Control Assessment</h4>
                    <p className="text-xs text-muted-foreground">Quarterly review of data privacy controls</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 border rounded hover:bg-muted/50">
                  <div className="text-xs text-center px-2 py-1 bg-purple-50 text-purple-800 rounded min-w-10">
                    <div className="font-bold">24</div>
                    <div>Aug</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Risk Review Meeting</h4>
                    <p className="text-xs text-muted-foreground">Monthly risk review with stakeholders</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskDetailView;
