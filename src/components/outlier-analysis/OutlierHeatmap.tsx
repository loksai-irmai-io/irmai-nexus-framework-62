
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ZoomIn, Filter, Download, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeatmapNode {
  id: string;
  label: string;
  anomalyCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface OutlierHeatmapProps {
  onDrillDown: (categoryId: string, count: number) => void;
}

const OutlierHeatmap: React.FC<OutlierHeatmapProps> = ({ onDrillDown }) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'process' | 'activity'>('process');
  
  // Generate random heatmap nodes for the demo
  const generateHeatmapNodes = (count: number, view: 'process' | 'activity'): HeatmapNode[] => {
    const processes = ['Loan Application', 'Customer Onboarding', 'Claims Processing', 'Payment Verification', 'Fraud Detection'];
    const activities = ['Data Entry', 'Validation', 'Approval', 'Customer Verification', 'Document Upload', 'Review', 'Payment Confirmation'];
    
    const nodeLabels = view === 'process' ? processes : activities;
    
    return Array.from({ length: count }).map((_, i) => {
      const anomalyCount = Math.floor(Math.random() * 30) + 1;
      let severity: 'critical' | 'high' | 'medium' | 'low';
      
      if (anomalyCount > 20) severity = 'critical';
      else if (anomalyCount > 12) severity = 'high';
      else if (anomalyCount > 5) severity = 'medium';
      else severity = 'low';
      
      // Create some patterns, like making specific nodes always critical
      if (view === 'process' && i === 1) severity = 'critical'; // Onboarding is always critical
      if (view === 'activity' && i === 3) severity = 'critical'; // Customer Verification is always critical
      
      const nodeLabel = nodeLabels[i % nodeLabels.length];
      return {
        id: `node-${i}`,
        label: nodeLabel,
        anomalyCount,
        severity,
        description: `${nodeLabel} has ${anomalyCount} anomalies detected, representing a deviation of ${anomalyCount * 3}% from expected patterns.`
      };
    });
  };
  
  const handleNodeClick = (node: HeatmapNode) => {
    toast({
      title: `Analyzing anomalies in ${node.label}`,
      description: `Loading ${node.anomalyCount} anomalies with severity: ${node.severity}`,
    });
    onDrillDown('process', node.anomalyCount);
  };
  
  const processNodes = generateHeatmapNodes(15, 'process');
  const activityNodes = generateHeatmapNodes(20, 'activity');
  
  const nodes = viewMode === 'process' ? processNodes : activityNodes;
  
  // A function to get grid layout for nodes to create better a better visualization
  const getGridLayout = (totalNodes: number) => {
    // Calculate an efficient grid layout
    const sqrt = Math.sqrt(totalNodes);
    const cols = Math.ceil(sqrt);
    const rows = Math.ceil(totalNodes / cols);
    return { cols, rows };
  };
  
  const { cols, rows } = getGridLayout(nodes.length);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Process Anomaly Heatmap</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Visual representation of where anomalies are occurring in your processes. Brighter areas indicate higher anomaly concentration.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-2">
            <Tabs value={viewMode} onValueChange={(value: 'process' | 'activity') => setViewMode(value)} className="mr-2">
              <TabsList className="h-8">
                <TabsTrigger value="process" className="text-xs h-7 px-3">Process View</TabsTrigger>
                <TabsTrigger value="activity" className="text-xs h-7 px-3">Activity View</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-xs">Filter</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="text-xs">Export</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          Identifies hotspots and patterns in your process anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[350px] bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border">
          {/* This would normally be a proper heatmap visualization */}
          {/* For now, we'll create a better grid representation */}
          <div 
            className="absolute inset-0 p-3 grid gap-2"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
            }}
          >
            {nodes.map((node) => {
              const intensity = node.anomalyCount / 30; // Normalize to 0-1
              let bgColor, textColor;
              
              switch (node.severity) {
                case 'critical':
                  bgColor = `rgba(239, 68, 68, ${0.5 + intensity * 0.5})`;
                  textColor = 'text-white';
                  break;
                case 'high':
                  bgColor = `rgba(249, 115, 22, ${0.5 + intensity * 0.5})`;
                  textColor = 'text-white';
                  break;
                case 'medium':
                  bgColor = `rgba(234, 179, 8, ${0.5 + intensity * 0.5})`;
                  textColor = 'text-black';
                  break;
                case 'low':
                  bgColor = `rgba(34, 197, 94, ${0.5 + intensity * 0.5})`;
                  textColor = 'text-white';
                  break;
                default:
                  bgColor = `rgba(34, 197, 94, ${0.5 + intensity * 0.5})`;
                  textColor = 'text-white';
              }
              
              return (
                <TooltipProvider key={node.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`rounded-md flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${textColor}`}
                        style={{ backgroundColor: bgColor }}
                        onClick={() => handleNodeClick(node)}
                      >
                        <span className="text-xs font-medium truncate max-w-full px-2">
                          {node.label}
                        </span>
                        <span className="text-sm font-bold">
                          {node.anomalyCount}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm p-3">
                      <div className="space-y-1.5">
                        <div className="font-medium">{node.label}</div>
                        <div className="text-sm">{node.description}</div>
                        <div className="flex justify-between text-xs pt-1 mt-1 border-t">
                          <span>Severity:</span>
                          <span className={`font-medium ${
                            node.severity === 'critical' ? 'text-red-500' :
                            node.severity === 'high' ? 'text-orange-500' :
                            node.severity === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            {node.severity.toUpperCase()}
                          </span>
                        </div>
                        <Button size="sm" variant="default" className="w-full mt-1 text-xs h-7">
                          View Details
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          <div className="absolute bottom-3 right-3 flex gap-1">
            <Button size="sm" variant="secondary" className="opacity-90 h-8">
              <ZoomIn className="h-4 w-4 mr-1" />
              <span>Expand</span>
            </Button>
            <Button size="sm" variant="secondary" className="opacity-90 h-8">
              <Share2 className="h-4 w-4 mr-1" />
              <span>Share</span>
            </Button>
          </div>
          
          <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-700 rounded p-2 opacity-90 text-xs">
            <div className="flex items-center space-x-2">
              <span className="block w-3 h-3 bg-red-500 rounded-sm"></span>
              <span>Critical (15-30)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-orange-500 rounded-sm"></span>
              <span>High (8-14)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-yellow-500 rounded-sm"></span>
              <span>Medium (4-7)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="block w-3 h-3 bg-green-500 rounded-sm"></span>
              <span>Low (1-3)</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground flex justify-between items-center">
          <span>Click on any node to view detailed anomalies for that {viewMode}</span>
          <Button variant="link" size="sm" className="h-6 p-0">
            About heatmap analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlierHeatmap;
