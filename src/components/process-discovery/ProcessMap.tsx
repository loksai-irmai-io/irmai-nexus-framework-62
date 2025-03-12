
import React, { useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  DownloadCloud,
  Calendar,
  Users
} from 'lucide-react';
import { ProcessData } from './types';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
    waitTime?: string;
    resourceUtilization?: number;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
  };
}

interface ProcessMapProps {
  processData: ProcessData;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
  className?: string;
}

const ProcessMap: React.FC<ProcessMapProps> = ({ 
  processData, 
  selectedNode, 
  onNodeClick,
  className
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [viewType, setViewType] = useState<'default' | 'heatmap'>('default');
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const toggleFrequency = () => {
    setShowFrequency(prev => !prev);
  };
  
  const toggleDuration = () => {
    setShowDuration(prev => !prev);
  };
  
  const toggleViewType = () => {
    setViewType(prev => prev === 'default' ? 'heatmap' : 'default');
  };
  
  // Function to get node color based on view type
  const getNodeFill = (node: Node) => {
    if (viewType === 'heatmap') {
      // In heatmap view, color is based on frequency (mock implementation)
      const frequency = node.metrics?.frequency || 0;
      if (frequency > 400) return 'fill-red-200 dark:fill-red-900';
      if (frequency > 200) return 'fill-yellow-200 dark:fill-yellow-900';
      return 'fill-green-200 dark:fill-green-900';
    }
    
    // In default view, color is based on compliance
    return selectedNode === node.id 
      ? 'fill-blue-100 dark:fill-blue-900'
      : 'fill-white dark:fill-gray-800';
  };
  
  return (
    <div className={cn("relative w-full border border-muted rounded-lg p-4 overflow-hidden bg-muted/10", className)}>
      {/* Controls Panel */}
      <div className="absolute top-4 right-4 z-10 bg-card/90 backdrop-blur-sm border rounded-lg shadow-sm p-2 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={showFrequency ? "default" : "ghost"}
                onClick={toggleFrequency}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">{showFrequency ? "Hide" : "Show"} Frequency</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={showDuration ? "default" : "ghost"}
                onClick={toggleDuration}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">{showDuration ? "Hide" : "Show"} Duration</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={viewType === 'heatmap' ? "default" : "ghost"}
                onClick={toggleViewType}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Toggle Heatmap View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="border-t my-1"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Refresh Process Map</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Export Process Map</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Process Map Canvas */}
      <div 
        className="w-full h-[500px] overflow-auto" 
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.2s ease-out' }}
      >
        <svg width="1100" height="300" className="mx-auto">
          {/* Render edges first so they appear behind nodes */}
          {processData.edges.map(edge => {
            const source = processData.nodes.find(n => n.id === edge.source);
            const target = processData.nodes.find(n => n.id === edge.target);
            
            if (source && target) {
              return (
                <g key={edge.id} className={`edge ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'opacity-100' : 'opacity-70'} transition-opacity duration-200`}>
                  <line 
                    x1={source.position.x + 50} 
                    y1={source.position.y} 
                    x2={target.position.x - 50} 
                    y2={target.position.y}
                    className={`stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px] ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'stroke-blue-400 dark:stroke-blue-500 stroke-[2px]' : ''}`}
                    strokeDasharray={edge.id.includes('alternative') ? "5,5" : undefined}
                  />
                  {edge.label && (
                    <text 
                      x={(source.position.x + target.position.x) / 2} 
                      y={(source.position.y + target.position.y) / 2 - 10}
                      className="text-xs fill-muted-foreground text-center"
                    >
                      {edge.label}
                    </text>
                  )}
                  
                  {showFrequency && edge.metrics?.frequency && (
                    <text 
                      x={(source.position.x + target.position.x) / 2} 
                      y={(source.position.y + target.position.y) / 2 + 10}
                      className="text-xs fill-blue-500 text-center font-medium"
                    >
                      {edge.metrics.frequency}x
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}
          
          {/* Render nodes */}
          {processData.nodes.map(node => {
            // Different shape based on node type
            let shape;
            
            const nodeClasses = cn(
              node.compliant ? 'stroke-green-500' : 'stroke-red-500',
              selectedNode === node.id ? 'stroke-[3px]' : 'stroke-[1.5px]',
              getNodeFill(node),
              "transition-all duration-200"
            );
            
            if (node.type === 'event') {
              // Circle for events
              shape = (
                <circle 
                  cx={node.position.x} 
                  cy={node.position.y} 
                  r="30" 
                  className={nodeClasses}
                />
              );
            } else if (node.type === 'gateway') {
              // Diamond for gateways
              shape = (
                <polygon 
                  points={`${node.position.x},${node.position.y-30} ${node.position.x+30},${node.position.y} ${node.position.x},${node.position.y+30} ${node.position.x-30},${node.position.y}`}
                  className={nodeClasses}
                />
              );
            } else {
              // Rectangle for activities
              shape = (
                <rect 
                  x={node.position.x - 50} 
                  y={node.position.y - 25} 
                  width="100" 
                  height="50" 
                  rx="5"
                  className={nodeClasses}
                />
              );
            }
            
            return (
              <TooltipProvider key={node.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className={`node ${selectedNode === node.id ? 'selected' : ''} hover:opacity-90 transition-opacity`}
                      onClick={() => onNodeClick(node.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {shape}
                      <text 
                        x={node.position.x} 
                        y={node.position.y} 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        className="text-xs font-medium fill-foreground pointer-events-none"
                      >
                        {node.label}
                      </text>
                      
                      {/* Show frequency annotation if enabled */}
                      {showFrequency && node.metrics?.frequency && (
                        <text 
                          x={node.position.x} 
                          y={node.position.y + (node.type === 'activity' ? 40 : 35)}
                          textAnchor="middle"
                          className="text-[10px] fill-blue-500 dark:fill-blue-400 font-medium"
                        >
                          {node.metrics.frequency}x
                        </text>
                      )}
                      
                      {/* Show duration annotation if enabled */}
                      {showDuration && node.metrics?.avgDuration && (
                        <text 
                          x={node.position.x} 
                          y={node.position.y + (node.type === 'activity' ? (showFrequency ? 50 : 40) : (showFrequency ? 45 : 35))}
                          textAnchor="middle"
                          className="text-[10px] fill-orange-500 dark:fill-orange-400 font-medium"
                        >
                          {node.metrics.avgDuration}
                        </text>
                      )}
                      
                      {!node.compliant && (
                        <circle 
                          cx={node.position.x + 40} 
                          cy={node.position.y - 20} 
                          r="8" 
                          className="fill-red-500 animate-pulse"
                        />
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 max-w-xs">
                      <p className="font-medium">{node.label}</p>
                      <p className="text-xs text-muted-foreground">Type: {node.type}</p>
                      
                      {node.metrics && (
                        <>
                          {node.metrics.frequency !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              Frequency: {node.metrics.frequency} occurrences
                            </p>
                          )}
                          
                          {node.metrics.avgDuration && (
                            <p className="text-xs text-muted-foreground">
                              Avg. duration: {node.metrics.avgDuration}
                            </p>
                          )}
                          
                          {node.metrics.waitTime && (
                            <p className="text-xs text-muted-foreground">
                              Avg. wait time: {node.metrics.waitTime}
                            </p>
                          )}
                          
                          {node.metrics.resourceUtilization !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              Resource utilization: {node.metrics.resourceUtilization}%
                            </p>
                          )}
                        </>
                      )}
                      
                      <p className="text-xs font-medium mt-1 text-blue-500">
                        Click to view detailed analysis
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border rounded-md shadow-sm p-2 text-xs flex flex-col gap-1.5">
        <div className="font-medium">Legend</div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Compliant Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Non-Compliant Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-gray-400"></div>
          <span>Activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-gray-400"></div>
          <span>Event</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 transform rotate-45 border border-gray-400"></div>
          <span>Gateway</span>
        </div>
      </div>
      
      {/* Interactive instruction */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/80 p-2 rounded-md flex items-center">
        <button className="text-primary hover:underline focus:outline-none">Interactive</button>
        <span className="mx-1">•</span>
        Click on any process node to see detailed information
      </div>
    </div>
  );
};

export default ProcessMap;
