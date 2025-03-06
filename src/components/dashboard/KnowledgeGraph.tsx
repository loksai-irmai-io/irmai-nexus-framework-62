
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Knowledge graph data types
type NodeType = 'product' | 'process' | 'risk' | 'control' | 'incident' | 'policy' | 'regulation' | 'framework';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  radius: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface KnowledgeGraphProps {
  className?: string;
}

// Sample data
const generateSampleData = () => {
  const nodes: GraphNode[] = [
    { id: 'bank', label: 'IRMAI Bank', type: 'product', x: 400, y: 250, radius: 40 },
    
    // Products
    { id: 'mortgage', label: 'Mortgage', type: 'product', x: 250, y: 150, radius: 25 },
    { id: 'creditcard', label: 'Credit Card', type: 'product', x: 400, y: 120, radius: 25 },
    { id: 'savings', label: 'Savings', type: 'product', x: 550, y: 150, radius: 25 },
    
    // Processes
    { id: 'onboarding', label: 'Customer Onboarding', type: 'process', x: 200, y: 300, radius: 25 },
    { id: 'kyc', label: 'KYC', type: 'process', x: 150, y: 370, radius: 20 },
    { id: 'payment', label: 'Payment Processing', type: 'process', x: 600, y: 300, radius: 25 },
    
    // Risks
    { id: 'fraud', label: 'Fraud Risk', type: 'risk', x: 300, y: 400, radius: 22 },
    { id: 'compliance', label: 'Compliance Risk', type: 'risk', x: 500, y: 400, radius: 22 },
    
    // Controls
    { id: 'authcontrol', label: 'Auth Controls', type: 'control', x: 350, y: 470, radius: 18 },
    { id: 'monitoring', label: 'Transaction Monitoring', type: 'control', x: 450, y: 470, radius: 18 },
    
    // Regulations
    { id: 'gdpr', label: 'GDPR', type: 'regulation', x: 250, y: 520, radius: 18 },
    { id: 'pci', label: 'PCI-DSS', type: 'regulation', x: 550, y: 520, radius: 18 },
  ];
  
  const edges: GraphEdge[] = [
    // Bank to products
    { id: 'e1', source: 'bank', target: 'mortgage' },
    { id: 'e2', source: 'bank', target: 'creditcard' },
    { id: 'e3', source: 'bank', target: 'savings' },
    
    // Bank to processes
    { id: 'e4', source: 'bank', target: 'onboarding' },
    { id: 'e5', source: 'bank', target: 'payment' },
    
    // Process relationships
    { id: 'e6', source: 'onboarding', target: 'kyc' },
    
    // Product to process
    { id: 'e7', source: 'creditcard', target: 'payment' },
    { id: 'e8', source: 'mortgage', target: 'onboarding' },
    
    // Process to risks
    { id: 'e9', source: 'payment', target: 'fraud' },
    { id: 'e10', source: 'onboarding', target: 'compliance' },
    
    // Risks to controls
    { id: 'e11', source: 'fraud', target: 'authcontrol' },
    { id: 'e12', source: 'fraud', target: 'monitoring' },
    { id: 'e13', source: 'compliance', target: 'monitoring' },
    
    // Controls to regulations
    { id: 'e14', source: 'authcontrol', target: 'pci' },
    { id: 'e15', source: 'monitoring', target: 'gdpr' },
  ];
  
  return { nodes, edges };
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ className }) => {
  const [data, setData] = useState(() => generateSampleData());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get node color based on type
  const getNodeColor = (type: NodeType, isSelected: boolean, isHovered: boolean) => {
    const colorMap = {
      product: isSelected ? 'fill-blue-200' : isHovered ? 'fill-blue-100' : 'fill-blue-50',
      process: isSelected ? 'fill-green-200' : isHovered ? 'fill-green-100' : 'fill-green-50',
      risk: isSelected ? 'fill-red-200' : isHovered ? 'fill-red-100' : 'fill-red-50',
      control: isSelected ? 'fill-purple-200' : isHovered ? 'fill-purple-100' : 'fill-purple-50',
      incident: isSelected ? 'fill-orange-200' : isHovered ? 'fill-orange-100' : 'fill-orange-50',
      policy: isSelected ? 'fill-gray-200' : isHovered ? 'fill-gray-100' : 'fill-gray-50',
      regulation: isSelected ? 'fill-yellow-200' : isHovered ? 'fill-yellow-100' : 'fill-yellow-50',
      framework: isSelected ? 'fill-indigo-200' : isHovered ? 'fill-indigo-100' : 'fill-indigo-50',
    };
    
    return colorMap[type];
  };
  
  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(prevSelected => prevSelected === nodeId ? null : nodeId);
  };
  
  // Calculate if an edge is related to the selected node
  const isEdgeRelated = (edge: GraphEdge) => {
    if (!selectedNode) return false;
    return edge.source === selectedNode || edge.target === selectedNode;
  };
  
  // Draw center lines path between nodes
  const getEdgePath = (source: GraphNode, target: GraphNode) => {
    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };
  
  // Find a node by id
  const findNode = (id: string) => {
    return data.nodes.find(node => node.id === id);
  };
  
  // Main render
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm overflow-hidden", className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-card-foreground">Digital Twin Hub</h3>
      </div>
      <div className="relative bg-[#FAFBFC] dark:bg-gray-900 aspect-[16/9] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="shimmer h-full w-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
        ) : (
          <svg 
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw edges */}
            <g>
              {data.edges.map(edge => {
                const source = findNode(edge.source);
                const target = findNode(edge.target);
                
                if (!source || !target) return null;
                
                const isRelated = isEdgeRelated(edge);
                const isSourceSelected = selectedNode === edge.source;
                const isTargetSelected = selectedNode === edge.target;
                
                return (
                  <g key={edge.id}>
                    <path
                      d={getEdgePath(source, target)}
                      className={cn(
                        "edge transition-all",
                        isRelated ? "stroke-primary stroke-[1.5px]" : "stroke-gray-200 dark:stroke-gray-700"
                      )}
                      markerEnd="url(#arrowhead)"
                    />
                    {edge.label && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2}
                        dy="-5"
                        className="text-[10px] fill-gray-500 text-center pointer-events-none"
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
            
            {/* Draw nodes */}
            <g>
              {data.nodes.map(node => {
                const isSelected = selectedNode === node.id;
                const isHovered = hoveredNode === node.id;
                
                return (
                  <g 
                    key={node.id}
                    className={cn(
                      "node cursor-pointer transition-transform",
                      isSelected ? "scale-110" : "",
                      isHovered ? "scale-105" : ""
                    )}
                    transform={`translate(${node.x},${node.y})`}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle
                      r={node.radius}
                      className={cn(
                        "transition-all",
                        getNodeColor(node.type, isSelected, isHovered),
                        isSelected ? "stroke-primary stroke-2" : "stroke-gray-300 dark:stroke-gray-600"
                      )}
                    />
                    <text
                      dy="0.3em"
                      className="node-label text-xs text-center pointer-events-none"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
            
            {/* Arrowhead marker for edges */}
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
                className="fill-gray-300 dark:fill-gray-600"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
          </svg>
        )}
        
        {/* Overlay text */}
        <div className="absolute bottom-0 left-0 p-2 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
          Click any node to drill down to related details
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
