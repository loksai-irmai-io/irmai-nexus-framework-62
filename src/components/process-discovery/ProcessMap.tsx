
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface ProcessData {
  nodes: Node[];
  edges: Edge[];
}

interface ProcessMapProps {
  processData: ProcessData;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

const ProcessMap: React.FC<ProcessMapProps> = ({ processData, selectedNode, onNodeClick }) => {
  return (
    <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
      <svg width="1100" height="300" className="mx-auto">
        {/* Render edges first so they appear behind nodes */}
        {processData.edges.map(edge => {
          const source = processData.nodes.find(n => n.id === edge.source);
          const target = processData.nodes.find(n => n.id === edge.target);
          
          if (source && target) {
            // Simple straight line for demo (in a real app, would use path with bezier curves)
            return (
              <g key={edge.id} className={`edge ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'selected' : ''}`}>
                <line 
                  x1={source.position.x + 50} 
                  y1={source.position.y} 
                  x2={target.position.x - 50} 
                  y2={target.position.y}
                  className="stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px]" 
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
              </g>
            );
          }
          return null;
        })}
        
        {/* Render nodes */}
        {processData.nodes.map(node => {
          // Different shape based on node type
          let shape;
          
          if (node.type === 'event') {
            // Circle for events
            shape = (
              <circle 
                cx={node.position.x} 
                cy={node.position.y} 
                r="30" 
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
              />
            );
          } else if (node.type === 'gateway') {
            // Diamond for gateways
            shape = (
              <polygon 
                points={`${node.position.x},${node.position.y-30} ${node.position.x+30},${node.position.y} ${node.position.x},${node.position.y+30} ${node.position.x-30},${node.position.y}`}
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
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
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
              />
            );
          }
          
          return (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g 
                    className={`node ${selectedNode === node.id ? 'selected' : ''}`}
                    onClick={() => onNodeClick(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {shape}
                    <text 
                      x={node.position.x} 
                      y={node.position.y} 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-foreground"
                    >
                      {node.label}
                    </text>
                    {!node.compliant && (
                      <circle 
                        cx={node.position.x + 40} 
                        cy={node.position.y - 20} 
                        r="8" 
                        className="fill-red-500"
                      />
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{node.label}</p>
                    <p className="text-xs text-muted-foreground">Type: {node.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Frequency: {Math.floor(Math.random() * 200) + 50} occurrences
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg. duration: {Math.floor(Math.random() * 10) + 1}m {Math.floor(Math.random() * 50) + 10}s
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </svg>
      
      {/* Annotation for interactivity */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 p-2 rounded-md">
        [Interactive] Click on any process node to see detailed information
      </div>
    </div>
  );
};

export default ProcessMap;
