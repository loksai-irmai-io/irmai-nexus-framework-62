
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Knowledge graph data types
type NodeType = 'product' | 'process' | 'risk' | 'control' | 'incident' | 'policy' | 'regulation' | 'framework' | 'issue' | 'testing';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  radius: number;
  module?: string;
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
    { id: 'bank', label: 'IRMAI Bank', type: 'product', x: 400, y: 230, radius: 45 },
    
    // Products
    { id: 'mortgage', label: 'Mortgage', type: 'product', x: 250, y: 130, radius: 28, module: 'process-discovery' },
    { id: 'creditcard', label: 'Credit Card', type: 'product', x: 400, y: 100, radius: 28, module: 'process-discovery' },
    { id: 'savings', label: 'Savings', type: 'product', x: 550, y: 130, radius: 28, module: 'process-discovery' },
    
    // Processes
    { id: 'onboarding', label: 'Customer Onboarding', type: 'process', x: 200, y: 280, radius: 28, module: 'process-discovery' },
    { id: 'kyc', label: 'KYC', type: 'process', x: 150, y: 350, radius: 22, module: 'process-discovery' },
    { id: 'payment', label: 'Payment Processing', type: 'process', x: 600, y: 280, radius: 28, module: 'process-discovery' },
    
    // Risks
    { id: 'fraud', label: 'Fraud Risk', type: 'risk', x: 300, y: 380, radius: 25, module: 'fmea-analysis' },
    { id: 'compliance', label: 'Compliance Risk', type: 'risk', x: 500, y: 380, radius: 25, module: 'fmea-analysis' },
    { id: 'operational', label: 'Operational Risk', type: 'risk', x: 400, y: 330, radius: 25, module: 'fmea-analysis' },
    
    // Controls
    { id: 'authcontrol', label: 'Auth Controls', type: 'control', x: 350, y: 450, radius: 20, module: 'compliance-monitoring' },
    { id: 'monitoring', label: 'Transaction Monitoring', type: 'control', x: 450, y: 450, radius: 20, module: 'compliance-monitoring' },
    
    // Regulations
    { id: 'gdpr', label: 'GDPR', type: 'regulation', x: 250, y: 500, radius: 20, module: 'compliance-monitoring' },
    { id: 'pci', label: 'PCI-DSS', type: 'regulation', x: 550, y: 500, radius: 20, module: 'compliance-monitoring' },
    
    // Testing
    { id: 'test1', label: 'Control Tests', type: 'testing', x: 175, y: 450, radius: 18, module: 'controls-testing' },
    
    // Incidents
    { id: 'incident1', label: 'Security Breach', type: 'incident', x: 650, y: 380, radius: 22, module: 'incident-management' },
    
    // Issues
    { id: 'issue1', label: 'Gap: PCI-DSS', type: 'issue', x: 650, y: 450, radius: 18, module: 'compliance-monitoring' },
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
    { id: 'e11', source: 'bank', target: 'operational' },
    
    // Risks to controls
    { id: 'e12', source: 'fraud', target: 'authcontrol' },
    { id: 'e13', source: 'fraud', target: 'monitoring' },
    { id: 'e14', source: 'compliance', target: 'monitoring' },
    
    // Controls to regulations
    { id: 'e15', source: 'authcontrol', target: 'pci' },
    { id: 'e16', source: 'monitoring', target: 'gdpr' },
    
    // Testing relationships
    { id: 'e17', source: 'test1', target: 'authcontrol' },
    
    // Incident relationships
    { id: 'e18', source: 'incident1', target: 'fraud' },
    
    // Issue relationships
    { id: 'e19', source: 'issue1', target: 'pci' },
  ];
  
  return { nodes, edges };
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ className }) => {
  const [data, setData] = useState(() => generateSampleData());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get node color based on type
  const getNodeColor = (type: NodeType, isSelected: boolean, isHovered: boolean) => {
    const baseColorMap = {
      product: 'blue',
      process: 'green',
      risk: 'red',
      control: 'purple',
      incident: 'orange',
      policy: 'gray',
      regulation: 'yellow',
      framework: 'indigo',
      issue: 'pink',
      testing: 'cyan',
    };
    
    const shade = isSelected ? '200' : isHovered ? '100' : '50';
    
    const color = baseColorMap[type];
    return `fill-${color}-${shade}`;
  };
  
  // Get node border color based on type
  const getNodeBorderColor = (type: NodeType, isSelected: boolean) => {
    const baseColorMap = {
      product: 'blue',
      process: 'green',
      risk: 'red',
      control: 'purple',
      incident: 'orange',
      policy: 'gray',
      regulation: 'yellow',
      framework: 'indigo',
      issue: 'pink',
      testing: 'cyan',
    };
    
    const shade = isSelected ? '500' : '300';
    
    const color = baseColorMap[type];
    return `stroke-${color}-${shade}`;
  };
  
  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    const node = findNode(nodeId);
    setSelectedNode(prevSelected => prevSelected === nodeId ? null : nodeId);
    
    if (node?.module) {
      toast.info(`Navigating to ${node.label} in ${node.module.replace('-', ' ')}...`);
    }
  };
  
  // Toggle zoom
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Filter nodes by type
  const filterNodesByType = (type: NodeType) => {
    // Reset selection first
    setSelectedNode(null);
    
    // Highlight all nodes of this type
    const nodeIds = data.nodes.filter(node => node.type === type).map(node => node.id);
    if (nodeIds.length > 0) {
      setSelectedNode(nodeIds[0]);
    }
    
    toast.info(`Showing ${type} nodes`);
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
      <div className="p-4 border-b bg-card flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-primary">Digital Twin Hub</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-primary/70 hover:text-primary transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                This is your central data hub – all insights and interdependencies between IRMAI Bank's products, processes, risks, controls, regulations, incidents, and other elements are sourced here.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['product', 'process', 'risk', 'control', 'regulation', 'incident'].map((type) => (
              <button 
                key={type}
                onClick={() => filterNodesByType(type as NodeType)}
                className={`text-xs px-2 py-1 rounded-full border capitalize hover:bg-secondary transition-colors`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleZoomToggle}
            className="text-xs px-2 py-1 rounded-full border hover:bg-secondary transition-colors"
          >
            {isZoomed ? 'Reset View' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div className={cn(
        "relative bg-[#FAFBFC] dark:bg-gray-900 overflow-hidden transition-all",
        isZoomed ? "aspect-auto h-[600px]" : "aspect-[16/9]"
      )}>
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
                
                return (
                  <g key={edge.id}>
                    <path
                      d={getEdgePath(source, target)}
                      className={cn(
                        "edge transition-all duration-300",
                        isRelated ? "stroke-primary/80 stroke-[1.5px]" : "stroke-gray-200 dark:stroke-gray-700",
                        selectedNode && !isRelated ? "opacity-30" : "opacity-100"
                      )}
                      markerEnd="url(#arrowhead)"
                    />
                    {edge.label && isRelated && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2}
                        dy="-5"
                        className="text-[10px] fill-gray-500 text-center pointer-events-none font-medium"
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
                const isRelated = selectedNode ? 
                  data.edges.some(edge => 
                    (edge.source === selectedNode && edge.target === node.id) || 
                    (edge.source === node.id && edge.target === selectedNode)
                  ) || node.id === selectedNode : true;
                
                return (
                  <g 
                    key={node.id}
                    className={cn(
                      "node cursor-pointer transition-all duration-300",
                      isSelected ? "scale-110" : "",
                      isHovered ? "scale-105" : "",
                      selectedNode && !isRelated && node.id !== selectedNode ? "opacity-30" : "opacity-100"
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
                        getNodeBorderColor(node.type, isSelected),
                        isSelected ? "stroke-2" : "stroke-1"
                      )}
                    />
                    <text
                      dy="0.3em"
                      className={cn(
                        "node-label text-xs text-center pointer-events-none font-medium",
                        isSelected ? "font-semibold" : ""
                      )}
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                    
                    {/* Module indicator for selected nodes */}
                    {isSelected && node.module && (
                      <text
                        dy={`${node.radius + 15}px`}
                        className="text-[10px] fill-primary text-center pointer-events-none italic"
                        textAnchor="middle"
                      >
                        {node.module.replace('-', ' ')}
                      </text>
                    )}
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
        
        {/* Legend Panel */}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm border rounded-md p-2 text-xs">
          <div className="font-medium mb-1">Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
              <span>Product</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
              <span>Process</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
              <span>Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
              <span>Control</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></div>
              <span>Regulation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></div>
              <span>Incident</span>
            </div>
          </div>
        </div>
        
        {/* Overlay instruction */}
        <div className="absolute bottom-0 left-0 p-2 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
          Click any node to drill down to related details
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
