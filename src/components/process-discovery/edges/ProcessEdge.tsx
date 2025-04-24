
import React from 'react';
import { ProcessEdge as ProcessEdgeType } from '../types';

interface ProcessEdgeProps {
  edge: ProcessEdgeType;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  selectedNode: string | null;
  showFrequency: boolean;
}

const ProcessEdge: React.FC<ProcessEdgeProps> = ({
  edge,
  sourcePosition,
  targetPosition,
  selectedNode,
  showFrequency,
}) => {
  return (
    <g className={`edge ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'opacity-100' : 'opacity-70'} transition-opacity duration-200`}>
      <line 
        x1={sourcePosition.x + 50} 
        y1={sourcePosition.y} 
        x2={targetPosition.x - 50} 
        y2={targetPosition.y}
        className={`stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px] ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'stroke-blue-400 dark:stroke-blue-500 stroke-[2px]' : ''}`}
        strokeDasharray={edge.id.includes('alternative') ? "5,5" : undefined}
      />
      {edge.label && (
        <text 
          x={(sourcePosition.x + targetPosition.x) / 2} 
          y={(sourcePosition.y + targetPosition.y) / 2 - 10}
          className="text-xs fill-muted-foreground text-center"
        >
          {edge.label}
        </text>
      )}
      
      {showFrequency && edge.metrics?.frequency && (
        <text 
          x={(sourcePosition.x + targetPosition.x) / 2} 
          y={(sourcePosition.y + targetPosition.y) / 2 + 10}
          className="text-xs fill-blue-500 text-center font-medium"
        >
          {edge.metrics.frequency}x
        </text>
      )}
    </g>
  );
};

export default ProcessEdge;
