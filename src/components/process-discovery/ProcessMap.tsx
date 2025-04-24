
import React, { useState } from 'react';
import { ProcessData } from './types';
import { cn } from '@/lib/utils';
import ProcessControls from './controls/ProcessControls';
import ProcessNode from './nodes/ProcessNode';
import ProcessEdge from './edges/ProcessEdge';
import ProcessLegend from './legend/ProcessLegend';

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

  return (
    <div className={cn("relative w-full border border-muted rounded-lg p-4 overflow-hidden bg-muted/10", className)}>
      <ProcessControls 
        showFrequency={showFrequency}
        showDuration={showDuration}
        viewType={viewType}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFrequency={() => setShowFrequency(prev => !prev)}
        onToggleDuration={() => setShowDuration(prev => !prev)}
        onToggleViewType={() => setViewType(prev => prev === 'default' ? 'heatmap' : 'default')}
      />
      
      <div 
        className="w-full h-[500px] overflow-auto" 
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.2s ease-out' }}
      >
        <svg width="1100" height="300" className="mx-auto">
          {/* Render edges first */}
          {processData.edges.map(edge => {
            const source = processData.nodes.find(n => n.id === edge.source);
            const target = processData.nodes.find(n => n.id === edge.target);
            
            if (source && target) {
              return (
                <ProcessEdge
                  key={edge.id}
                  edge={edge}
                  sourcePosition={source.position}
                  targetPosition={target.position}
                  selectedNode={selectedNode}
                  showFrequency={showFrequency}
                />
              );
            }
            return null;
          })}
          
          {/* Render nodes */}
          {processData.nodes.map(node => (
            <ProcessNode
              key={node.id}
              node={node}
              selected={selectedNode === node.id}
              onNodeClick={onNodeClick}
              showFrequency={showFrequency}
              showDuration={showDuration}
              viewType={viewType}
            />
          ))}
        </svg>
      </div>
      
      <ProcessLegend />
      
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
