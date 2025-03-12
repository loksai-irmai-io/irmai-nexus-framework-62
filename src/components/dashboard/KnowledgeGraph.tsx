
import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface KnowledgeGraphProps {
  isLoading?: boolean;
  animate?: boolean;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  isLoading = false,
  animate = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const [graphData, setGraphData] = useState<any>({
    nodes: [],
    links: []
  });
  
  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height: 300 });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 300 });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (animate) {
      // Detailed graph with multiple layers based on the image
      const nodes = [
        { id: 'irmai-bank', name: 'IRMAI Bank', group: 1, size: 18 },
        
        // Main categories
        { id: 'processes', name: 'Processes', group: 2, size: 14 },
        { id: 'risks', name: 'Risks', group: 3, size: 14 },
        { id: 'controls', name: 'Controls', group: 4, size: 14 },
        
        // Process subcategories
        { id: 'customer-onboarding', name: 'Customer Onboarding', group: 2, size: 12 },
        { id: 'payment-process', name: 'Payment Process', group: 2, size: 12 },
        { id: 'kyc', name: 'KYC', group: 2, size: 10 },
        
        // Risk subcategories
        { id: 'fraud', name: 'Fraud', group: 3, size: 10 },
        { id: 'compliance', name: 'Compliance', group: 3, size: 12 },
        { id: 'operational', name: 'Operational', group: 3, size: 11 },
        
        // Control subcategories
        { id: 'audit', name: 'Audit', group: 4, size: 10 },
        { id: 'transaction-monitoring', name: 'Transaction Monitoring', group: 4, size: 12 },
        { id: 'control-validation', name: 'Control Validation', group: 4, size: 9 },
      ];
      
      const links = [
        // Connect IRMAI Bank to main categories
        { source: 'irmai-bank', target: 'processes', value: 5 },
        { source: 'irmai-bank', target: 'risks', value: 5 },
        { source: 'irmai-bank', target: 'controls', value: 5 },
        
        // Connect Processes to subcategories
        { source: 'processes', target: 'customer-onboarding', value: 4 },
        { source: 'processes', target: 'payment-process', value: 4 },
        { source: 'processes', target: 'kyc', value: 3 },
        
        // Connect Risks to subcategories
        { source: 'risks', target: 'fraud', value: 3 },
        { source: 'risks', target: 'compliance', value: 4 },
        { source: 'risks', target: 'operational', value: 3 },
        
        // Connect Controls to subcategories
        { source: 'controls', target: 'audit', value: 3 },
        { source: 'controls', target: 'transaction-monitoring', value: 4 },
        { source: 'controls', target: 'control-validation', value: 3 },
        
        // Cross-connections between categories
        { source: 'payment-process', target: 'fraud', value: 2 },
        { source: 'customer-onboarding', target: 'compliance', value: 2 },
        { source: 'kyc', target: 'compliance', value: 2 },
        { source: 'fraud', target: 'transaction-monitoring', value: 2 },
        { source: 'compliance', target: 'audit', value: 2 },
        { source: 'operational', target: 'control-validation', value: 2 },
      ];
      
      setGraphData({ nodes, links });
    } else {
      setGraphData({
        nodes: [
          { id: 'irmai-bank', name: 'IRMAI Bank', group: 1, size: 15 },
          { id: 'risk', name: 'Risk', group: 2, size: 12 },
          { id: 'process', name: 'Process', group: 3, size: 12 },
          { id: 'control', name: 'Controls', group: 4, size: 12 },
        ],
        links: [
          { source: 'irmai-bank', target: 'risk', value: 4 },
          { source: 'irmai-bank', target: 'process', value: 4 },
          { source: 'irmai-bank', target: 'control', value: 4 },
          { source: 'risk', target: 'process', value: 3 },
          { source: 'process', target: 'control', value: 3 },
          { source: 'control', target: 'risk', value: 3 },
        ]
      });
    }
  }, [animate]);
  
  const getNodeColor = (node: any) => {
    const groupColors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#ef4444', // red
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#6366f1', // indigo
    ];
    
    return groupColors[(node.group - 1) % groupColors.length];
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className={cn(
        "w-full h-[300px] transition-opacity duration-500",
        animate ? "opacity-100" : "opacity-70"
      )}
    >
      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeRelSize={6}
          nodeVal={node => node.size}
          nodeLabel={node => node.name}
          nodeColor={getNodeColor}
          linkWidth={link => link.value * 0.5}
          linkColor={() => "#aaa"}
          cooldownTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={link => link.value * 0.5}
          d3VelocityDecay={0.3}
        />
      )}
    </div>
  );
};

export default KnowledgeGraph;
