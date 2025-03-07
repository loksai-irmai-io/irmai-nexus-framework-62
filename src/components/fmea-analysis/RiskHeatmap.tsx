
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Filter, 
  ZoomIn, 
  Info, 
  Layers,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockRiskData } from './mockData';

interface RiskHeatmapProps {
  selectedRole: string;
  onDrilldown: (riskId: string) => void;
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ selectedRole, onDrilldown }) => {
  const [timeFrame, setTimeFrame] = useState<string>('current');
  const [filter, setFilter] = useState<string>('all');
  const [viewType, setViewType] = useState<string>('heatmap');
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  
  // Filter risks data based on role and selected filter
  const filteredRisks = mockRiskData.filter(risk => {
    if (filter === 'critical') return risk.severity === 'critical';
    if (filter === 'high') return risk.severity === 'high';
    if (filter === 'financial') return risk.category === 'financial';
    if (filter === 'operational') return risk.category === 'operational';
    if (filter === 'compliance') return risk.category === 'compliance';
    return true;
  });
  
  // Mapping for the 5x5 heatmap
  const severityLevels = ['Minimal', 'Minor', 'Moderate', 'Major', 'Severe'];
  const probabilityLevels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
  
  const getCellColor = (severity: number, probability: number) => {
    const riskScore = severity * probability;
    if (riskScore >= 20) return 'bg-red-100 hover:bg-red-200 text-red-800';
    if (riskScore >= 12) return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
    if (riskScore >= 8) return 'bg-amber-100 hover:bg-amber-200 text-amber-800';
    if (riskScore >= 4) return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
    return 'bg-green-100 hover:bg-green-200 text-green-800';
  };
  
  // Count risks in each cell for the heatmap
  const heatmapData = Array(5).fill(0).map(() => Array(5).fill(0));
  filteredRisks.forEach(risk => {
    const severityIndex = Math.min(Math.floor(risk.severityScore / 2), 4);
    const probabilityIndex = Math.min(Math.floor(risk.likelihoodScore / 2), 4);
    heatmapData[4 - probabilityIndex][severityIndex]++; // Inverting Y-axis to show high probability at the top
  });
  
  const handleHeatmapCellClick = (severity: number, probability: number) => {
    // Generate a synthetic ID for this category of risks
    const riskCategory = `severity-${severity}-probability-${probability}`;
    onDrilldown(riskCategory);
  };
  
  const handleToggleTrend = () => {
    setTimeFrame(prev => prev === 'current' ? 'trend' : 'current');
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Risk Heatmap Analysis</h2>
          <p className="text-muted-foreground">Interactive visualization of risk severity vs. likelihood</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Risks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="critical">Critical Risks</SelectItem>
              <SelectItem value="high">High Risks</SelectItem>
              <SelectItem value="financial">Financial Risks</SelectItem>
              <SelectItem value="operational">Operational Risks</SelectItem>
              <SelectItem value="compliance">Compliance Risks</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleToggleTrend}>
            {timeFrame === 'current' ? <Layers className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="icon">
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  Risk Heatmap {timeFrame === 'trend' && '- Trend Analysis'}
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
                    <TabsList className="grid grid-cols-3 h-8">
                      <TabsTrigger value="heatmap" className="text-xs">Heatmap</TabsTrigger>
                      <TabsTrigger value="bowtie" className="text-xs">Bow-Tie</TabsTrigger>
                      <TabsTrigger value="matrix" className="text-xs">Matrix</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-sm">
                          {viewType === 'heatmap' 
                            ? 'Heatmap shows risk distribution based on severity (impact) and likelihood. Click any cell to view detailed risks.'
                            : viewType === 'bowtie' 
                            ? 'Bow-tie visualization shows causes, controls, and consequences for each risk category.'
                            : 'Risk matrix shows detailed classification based on multiple dimensions.'
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewType === 'heatmap' && (
                <>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="flex mb-2">
                        <div className="w-1/6"></div>
                        <div className="w-5/6">
                          <div className="grid grid-cols-5 text-center">
                            {severityLevels.map((label, index) => (
                              <div key={index} className="text-xs font-medium py-1">{label}</div>
                            ))}
                          </div>
                          <div className="text-xs text-center font-medium mt-1">Impact Severity</div>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="w-1/6 flex flex-col justify-between items-center py-2">
                          <div className="h-full flex flex-col justify-between">
                            {probabilityLevels.map((label, index) => (
                              <div key={index} className="text-xs font-medium p-1 text-right">{label}</div>
                            ))}
                          </div>
                          <div className="text-xs font-medium mt-2 transform -rotate-90 origin-center whitespace-nowrap">Likelihood</div>
                        </div>
                        
                        <div className="w-5/6">
                          <div className="grid grid-cols-5 gap-1">
                            {heatmapData.map((row, rowIndex) => (
                              <>
                                {row.map((count, colIndex) => {
                                  const severity = colIndex + 1;
                                  const probability = 5 - rowIndex;
                                  return (
                                    <div 
                                      key={`${rowIndex}-${colIndex}`}
                                      className={`aspect-square rounded p-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${getCellColor(severity, probability)}`}
                                      onClick={() => handleHeatmapCellClick(severity, probability)}
                                    >
                                      <span className="text-lg font-bold">{count}</span>
                                      <span className="text-xs">Risks</span>
                                      {timeFrame === 'trend' && (
                                        <span className="mt-1 flex items-center text-xs">
                                          {Math.random() > 0.5 ? (
                                            <ArrowUp className="h-3 w-3 text-red-600 mr-1" />
                                          ) : (
                                            <ArrowDown className="h-3 w-3 text-green-600 mr-1" />
                                          )}
                                          {Math.floor(Math.random() * 20) + 1}%
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 space-x-4">
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-green-100 rounded mr-1"></div>
                        <span className="text-xs">Low</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-yellow-100 rounded mr-1"></div>
                        <span className="text-xs">Medium</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-amber-100 rounded mr-1"></div>
                        <span className="text-xs">Elevated</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-orange-100 rounded mr-1"></div>
                        <span className="text-xs">High</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-red-100 rounded mr-1"></div>
                        <span className="text-xs">Critical</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Click on any cell to view detailed risks
                    </div>
                  </div>
                </>
              )}
              
              {viewType === 'bowtie' && (
                <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg border">
                  <div className="text-center p-6">
                    <div className="mx-auto mb-4 w-[500px] h-[200px] relative">
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3">
                        <div className="border rounded-lg p-3 bg-blue-50">
                          <h4 className="text-sm font-medium mb-2">Causes</h4>
                          <ul className="text-xs space-y-1 text-left">
                            <li>• Market volatility</li>
                            <li>• Regulatory changes</li>
                            <li>• Technology failures</li>
                            <li>• Process deviations</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3">
                        <div className="border rounded-lg p-3 bg-red-50">
                          <h4 className="text-sm font-medium mb-2">Consequences</h4>
                          <ul className="text-xs space-y-1 text-left">
                            <li>• Financial loss</li>
                            <li>• Regulatory penalties</li>
                            <li>• Reputational damage</li>
                            <li>• Operational disruption</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4">
                        <div className="border rounded-lg p-3 bg-amber-50 text-amber-800">
                          <h4 className="text-sm font-medium">Risk Event</h4>
                          <p className="text-xs mt-1">Compliance breach</p>
                        </div>
                        
                        <div className="mt-4 border-t border-b py-2">
                          <h4 className="text-xs font-medium mb-1">Preventive Controls</h4>
                          <div className="flex justify-between text-xs text-green-700">
                            <span>Effective: 75%</span>
                            <span>Coverage: 80%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute left-[37%] top-1/3 w-[10%] border-t border-dashed"></div>
                      <div className="absolute left-[37%] top-2/3 w-[10%] border-t border-dashed"></div>
                      <div className="absolute right-[37%] top-1/3 w-[10%] border-t border-dashed"></div>
                      <div className="absolute right-[37%] top-2/3 w-[10%] border-t border-dashed"></div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4">
                      Interactive bow-tie visualization is currently in preview mode. 
                      <br />Select a specific risk for a detailed bow-tie analysis.
                    </p>
                  </div>
                </div>
              )}
              
              {viewType === 'matrix' && (
                <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg border">
                  <div className="text-center p-6">
                    <h3 className="text-lg font-medium">3D Risk Matrix</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      The advanced risk matrix with multiple dimensions is currently in development. 
                      It will visualize risks across impact, likelihood, and control effectiveness dimensions.
                    </p>
                    <Button className="mt-4">
                      Request Early Access
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Risk Details</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {selectedRiskId ? (
                <div>
                  <h3 className="font-medium mb-2">Selected Risk Details</h3>
                  {/* Risk details would go here */}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm">Select a cell in the heatmap to view risks in that category.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Top Risks by Exposure</h4>
                    {filteredRisks.slice(0, 5).map((risk, index) => (
                      <div 
                        key={index} 
                        className="p-2 rounded border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => onDrilldown(risk.id)}
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="text-sm font-medium">{risk.name}</h5>
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
                        <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs">{risk.category}</span>
                          <div className="flex items-center text-xs text-blue-600">
                            <span>Details</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Risk Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Critical</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${filteredRisks.filter(r => r.severity === 'critical').length / filteredRisks.length * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {filteredRisks.filter(r => r.severity === 'critical').length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs">High</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${filteredRisks.filter(r => r.severity === 'high').length / filteredRisks.length * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {filteredRisks.filter(r => r.severity === 'high').length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Medium</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full" 
                            style={{ width: `${filteredRisks.filter(r => r.severity === 'medium').length / filteredRisks.length * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {filteredRisks.filter(r => r.severity === 'medium').length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Low</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${filteredRisks.filter(r => r.severity === 'low').length / filteredRisks.length * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {filteredRisks.filter(r => r.severity === 'low').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
