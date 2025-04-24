
import React from 'react';
import { cn } from '@/lib/utils';
import { ProcessNode as ProcessNodeType } from '../types';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ProcessNodeProps {
  node: ProcessNodeType;
  selected: boolean;
  onNodeClick: (nodeId: string) => void;
  showFrequency: boolean;
  showDuration: boolean;
  viewType: 'default' | 'heatmap';
}

const ProcessNode: React.FC<ProcessNodeProps> = ({
  node,
  selected,
  onNodeClick,
  showFrequency,
  showDuration,
  viewType,
}) => {
  const getNodeFill = () => {
    if (viewType === 'heatmap') {
      const frequency = node.metrics?.frequency || 0;
      if (frequency > 400) return 'fill-red-200 dark:fill-red-900';
      if (frequency > 200) return 'fill-yellow-200 dark:fill-yellow-900';
      return 'fill-green-200 dark:fill-green-900';
    }
    return selected 
      ? 'fill-blue-100 dark:fill-blue-900'
      : 'fill-white dark:fill-gray-800';
  };

  // Different shape based on node type
  let shape;
  const nodeClasses = cn(
    node.compliant ? 'stroke-green-500' : 'stroke-red-500',
    selected ? 'stroke-[3px]' : 'stroke-[1.5px]',
    getNodeFill(),
    "transition-all duration-200"
  );

  if (node.type === 'event') {
    shape = (
      <circle 
        cx={node.position.x} 
        cy={node.position.y} 
        r="30" 
        className={nodeClasses}
      />
    );
  } else if (node.type === 'gateway') {
    shape = (
      <polygon 
        points={`${node.position.x},${node.position.y-30} ${node.position.x+30},${node.position.y} ${node.position.x},${node.position.y+30} ${node.position.x-30},${node.position.y}`}
        className={nodeClasses}
      />
    );
  } else {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <g 
            className={`node ${selected ? 'selected' : ''} hover:opacity-90 transition-opacity`}
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
};

export default ProcessNode;
