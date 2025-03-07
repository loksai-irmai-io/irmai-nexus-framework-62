
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Chart from '@/components/dashboard/Chart';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  Download, 
  Sparkles,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScenarioModelingProps {
  selectedRole: string;
}

const ScenarioModeling: React.FC<ScenarioModelingProps> = ({ selectedRole }) => {
  const [controlEffectiveness, setControlEffectiveness] = useState<number[]>([70]);
  const [threatLikelihood, setThreatLikelihood] = useState<number[]>([30]);
  const [businessImpact, setBusinessImpact] = useState<number[]>([50]);
  const [riskAppetite, setRiskAppetite] = useState<number[]>([40]);
  const [simulationRun, setSimulationRun] = useState<boolean>(false);
  
  const runSimulation = () => {
    setSimulationRun(true);
  };
  
  const resetSimulation = () => {
    setControlEffectiveness([70]);
    setThreatLikelihood([30]);
    setBusinessImpact([50]);
    setRiskAppetite([40]);
    setSimulationRun(false);
  };
  
  // Generate simulation data based on slider values
  const generateSimulationData = () => {
    const baseRisk = (100 - controlEffectiveness[0]) * (threatLikelihood[0] / 100) * (businessImpact[0] / 50);
    
    return [
      { month: 'Aug', bestCase: Math.max(5, baseRisk * 0.7), mostLikely: baseRisk, worstCase: baseRisk * 1.2, appetite: riskAppetite[0] },
      { month: 'Sep', bestCase: Math.max(5, baseRisk * 0.65), mostLikely: baseRisk * 1.05, worstCase: baseRisk * 1.3, appetite: riskAppetite[0] },
      { month: 'Oct', bestCase: Math.max(5, baseRisk * 0.6), mostLikely: baseRisk * 1.1, worstCase: baseRisk * 1.4, appetite: riskAppetite[0] },
      { month: 'Nov', bestCase: Math.max(5, baseRisk * 0.55), mostLikely: baseRisk * 1.15, worstCase: baseRisk * 1.5, appetite: riskAppetite[0] },
      { month: 'Dec', bestCase: Math.max(5, baseRisk * 0.5), mostLikely: baseRisk * 1.2, worstCase: baseRisk * 1.6, appetite: riskAppetite[0] },
      { month: 'Jan', bestCase: Math.max(5, baseRisk * 0.45), mostLikely: baseRisk * 1.25, worstCase: baseRisk * 1.7, appetite: riskAppetite[0] },
    ];
  };
  
  const simulationData = generateSimulationData();
  
  const simulationSeries = [
    { name: 'Best Case', dataKey: 'bestCase', color: '#10b981' },
    { name: 'Most Likely', dataKey: 'mostLikely', color: '#f59e0b' },
    { name: 'Worst Case', dataKey: 'worstCase', color: '#ef4444' },
    { name: 'Risk Appetite', dataKey: 'appetite', color: '#8b5cf6' }
  ];
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">Scenario Modeling & Simulation</h2>
        <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent maxWidth="sm">
              <p>Adjust the variables below to run "what-if" scenarios and see how they affect risk projections. The AI model will simulate risk trajectories under different conditions.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <span>Simulation Variables</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adjust these variables to see how they impact projected risk levels</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Control Effectiveness</label>
                  <span className="text-sm font-bold">{controlEffectiveness[0]}%</span>
                </div>
                <Slider 
                  value={controlEffectiveness} 
                  onValueChange={setControlEffectiveness} 
                  max={100} 
                  step={1}
                />
                <p className="text-xs text-muted-foreground">How well controls mitigate risks</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Threat Likelihood</label>
                  <span className="text-sm font-bold">{threatLikelihood[0]}%</span>
                </div>
                <Slider 
                  value={threatLikelihood} 
                  onValueChange={setThreatLikelihood} 
                  max={100} 
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Probability of threat events occurring</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Business Impact</label>
                  <span className="text-sm font-bold">{businessImpact[0]}%</span>
                </div>
                <Slider 
                  value={businessImpact} 
                  onValueChange={setBusinessImpact} 
                  max={100} 
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Severity of impact if risk materializes</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Risk Appetite</label>
                  <span className="text-sm font-bold">{riskAppetite[0]}</span>
                </div>
                <Slider 
                  value={riskAppetite} 
                  onValueChange={setRiskAppetite} 
                  max={100} 
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Organization's tolerance for risk</p>
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <Button onClick={runSimulation} className="flex-1 gap-2">
                  <Play className="h-4 w-4" />
                  Run Simulation
                </Button>
                <Button variant="outline" onClick={resetSimulation} size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Simulation Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {simulationRun ? (
                <>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Predicted Risk Level</div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                        <div 
                          className="h-3 w-1 bg-black rounded-full" 
                          style={{ marginLeft: `${simulationData[2].mostLikely}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{Math.round(simulationData[2].mostLikely)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {simulationData[2].mostLikely > riskAppetite[0] 
                        ? "Exceeds risk appetite threshold" 
                        : "Within risk appetite threshold"}
                    </p>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    <Badge className="bg-blue-100 text-blue-800">AI Analysis</Badge>
                    <p className="text-sm">
                      {simulationData[2].mostLikely > 70 
                        ? "Critical exposure projected. Immediate action recommended to enhance controls or reduce impact."
                        : simulationData[2].mostLikely > 50
                        ? "Moderate to high exposure projected. Consider strengthening controls in key areas."
                        : "Low to moderate exposure projected. Current controls appear effective."}
                    </p>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    <div className="text-sm font-medium">Key Drivers</div>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span>Control effectiveness is the primary factor</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        <span>Business impact severity is {businessImpact[0] > 70 ? "critically high" : businessImpact[0] > 40 ? "moderately high" : "manageable"}</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span>Threat landscape shows {threatLikelihood[0] > 60 ? "concerning" : threatLikelihood[0] > 30 ? "moderate" : "low"} activity</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Sparkles className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium">Adjust variables and run the simulation</p>
                  <p className="text-xs text-muted-foreground mt-1">AI will analyze and project risk trajectories</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Risk Projection Simulation</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="monte">Monte Carlo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="m-0">
                  <div className="h-[400px]">
                    <Chart 
                      title="Projected Risk Trajectories"
                      description="Based on current simulation parameters"
                      data={simulationData}
                      series={simulationSeries}
                      type="line"
                      xAxisKey="month"
                      height={380}
                      tooltip="Lines show different risk projections based on the simulation parameters"
                    />
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-blue-600" />
                      AI Scenario Analysis
                    </h4>
                    <p className="mt-1 text-sm">
                      {simulationRun ? (
                        <>
                          Based on your parameters, risk levels are projected to 
                          {simulationData[5].mostLikely > simulationData[0].mostLikely 
                            ? ` increase by approximately ${Math.round((simulationData[5].mostLikely - simulationData[0].mostLikely) / simulationData[0].mostLikely * 100)}% over the next 6 months.`
                            : ` decrease by approximately ${Math.round((simulationData[0].mostLikely - simulationData[5].mostLikely) / simulationData[0].mostLikely * 100)}% over the next 6 months.`}
                          {simulationData[5].mostLikely > riskAppetite[0] 
                            ? ` This exceeds your risk appetite threshold by ${Math.round(simulationData[5].mostLikely - riskAppetite[0])} points.`
                            : ` This remains within your defined risk appetite threshold.`}
                        </>
                      ) : (
                        "Run the simulation to get AI-powered analysis of risk projections."
                      )}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="table" className="m-0">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2 text-sm font-medium">Month</th>
                          <th className="text-left p-2 text-sm font-medium">Best Case</th>
                          <th className="text-left p-2 text-sm font-medium">Most Likely</th>
                          <th className="text-left p-2 text-sm font-medium">Worst Case</th>
                          <th className="text-left p-2 text-sm font-medium">Risk Appetite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationData.map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2 text-sm">{row.month}</td>
                            <td className="p-2 text-sm">{Math.round(row.bestCase)}</td>
                            <td className="p-2 text-sm font-medium">{Math.round(row.mostLikely)}</td>
                            <td className="p-2 text-sm">{Math.round(row.worstCase)}</td>
                            <td className="p-2 text-sm">{row.appetite}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="monte" className="m-0">
                  <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg border">
                    <div className="text-center p-6">
                      <Sparkles className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                      <h3 className="text-lg font-medium">Monte Carlo Simulation</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        Run advanced Monte Carlo simulations to model thousands of potential scenarios and understand probability distributions of risk outcomes.
                      </p>
                      <Button className="mt-4">
                        <Play className="h-4 w-4 mr-2" />
                        Run Monte Carlo Simulation
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModeling;
