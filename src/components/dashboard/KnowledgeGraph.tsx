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
      // Generate sample graph data
      const nodes = [
        { id: 'payment-process', name: 'Payment Process', group: 1, size: 15 },
        { id: 'customer-onboarding', name: 'Customer Onboarding', group: 1, size: 12 },
        { id: 'fraud-detection', name: 'Fraud Detection', group: 2, size: 10 },
        { id: 'kyc-verification', name: 'KYC Verification', group: 2, size: 8 },
        { id: 'transaction-monitoring', name: 'Transaction Monitoring', group: 2, size: 10 },
        { id: 'risk-assessment', name: 'Risk Assessment', group: 3, size: 12 },
        { id: 'compliance-check', name: 'Compliance Check', group: 3, size: 10 },
        { id: 'data-privacy', name: 'Data Privacy', group: 4, size: 8 },
        { id: 'audit-trail', name: 'Audit Trail', group: 4, size: 6 },
        { id: 'reporting', name: 'Reporting', group: 5, size: 8 },
        { id: 'approval-workflow', name: 'Approval Workflow', group: 5, size: 7 },
        { id: 'exception-handling', name: 'Exception Handling', group: 6, size: 9 },
        { id: 'customer-data', name: 'Customer Data', group: 7, size: 11 },
        { id: 'transaction-data', name: 'Transaction Data', group: 7, size: 10 },
        { id: 'regulatory-requirements', name: 'Regulatory Requirements', group: 8, size: 9 },
      ];
      
      const links = [
        { source: 'payment-process', target: 'fraud-detection', value: 5 },
        { source: 'payment-process', target: 'transaction-monitoring', value: 5 },
        { source: 'payment-process', target: 'approval-workflow', value: 3 },
        { source: 'payment-process', target: 'transaction-data', value: 4 },
        { source: 'customer-onboarding', target: 'kyc-verification', value: 5 },
        { source: 'customer-onboarding', target: 'risk-assessment', value: 4 },
        { source: 'customer-onboarding', target: 'compliance-check', value: 4 },
        { source: 'customer-onboarding', target: 'customer-data', value: 5 },
        { source: 'fraud-detection', target: 'transaction-monitoring', value: 4 },
        { source: 'fraud-detection', target: 'risk-assessment', value: 3 },
        { source: 'fraud-detection', target: 'exception-handling', value: 3 },
        { source: 'kyc-verification', target: 'compliance-check', value: 4 },
        { source: 'kyc-verification', target: 'data-privacy', value: 3 },
        { source: 'kyc-verification', target: 'regulatory-requirements', value: 4 },
        { source: 'transaction-monitoring', target: 'audit-trail', value: 3 },
        { source: 'transaction-monitoring', target: 'reporting', value: 3 },
        { source: 'risk-assessment', target: 'compliance-check', value: 4 },
        { source: 'risk-assessment', target: 'reporting', value: 3 },
        { source: 'compliance-check', target: 'regulatory-requirements', value: 5 },
        { source: 'compliance-check', target: 'audit-trail', value: 3 },
        { source: 'data-privacy', target: 'customer-data', value: 4 },
        { source: 'data-privacy', target: 'regulatory-requirements', value: 4 },
        { source: 'audit-trail', target: 'reporting', value: 3 },
        { source: 'approval-workflow', target: 'exception-handling', value: 3 },
        { source: 'customer-data', target: 'transaction-data', value: 3 },
      ];
      
      setGraphData({ nodes, links });
    } else {
      setGraphData({
        nodes: [
          { id: 'process', name: 'Process', group: 1, size: 10 },
          { id: 'risk', name: 'Risk', group: 2, size: 10 },
          { id: 'control', name: 'Control', group: 3, size: 10 },
        ],
        links: [
          { source: 'process', target: 'risk', value: 3 },
          { source: 'risk', target: 'control', value: 3 },
        ]
      });
    }
  }, [animate]);
  
  const getNodeColor = (node: any) => {
    const groupColors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
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
