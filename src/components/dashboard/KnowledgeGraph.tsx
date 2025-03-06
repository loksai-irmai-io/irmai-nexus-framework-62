
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Info, Plus, Minus, Filter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Knowledge graph data types
type NodeType = 'product' | 'process' | 'risk' | 'control' | 'incident' | 'policy' | 'regulation' | 'framework' | 'issue' | 'testing';
type NodeLevel = 'main' | 'category' | 'detail';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  level: NodeLevel;
  x: number;
  y: number;
  radius: number;
  module?: string;
  children?: string[];
  parent?: string;
  details?: string;
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

// Main sample data
const generateMainNodes = (): GraphNode[] => {
  return [
    { id: 'bank', label: 'IRMAI Bank', type: 'product', level: 'main', x: 400, y: 250, radius: 60 },
  ];
};

// Category level nodes - these appear when a main node is clicked
const generateCategoryNodes = (): GraphNode[] => {
  return [
    { id: 'processes', label: 'Processes', type: 'process', level: 'category', x: 250, y: 150, radius: 45, parent: 'bank', children: ['onboarding', 'kyc', 'payment'] },
    { id: 'risks', label: 'Risks', type: 'risk', level: 'category', x: 400, y: 120, radius: 45, parent: 'bank', children: ['fraud', 'compliance', 'operational'] },
    { id: 'controls', label: 'Controls', type: 'control', level: 'category', x: 550, y: 150, radius: 45, parent: 'bank', children: ['authcontrol', 'monitoring', 'test1'] },
  ];
};

// Detail level nodes - these appear when a category node is clicked
const generateDetailNodes = (): GraphNode[] => {
  return [
    // Process nodes
    { id: 'onboarding', label: 'Customer Onboarding', type: 'process', level: 'detail', x: 200, y: 280, radius: 35, parent: 'processes', module: 'process-discovery', details: 'Customer onboarding process includes KYC verification, document collection, and account setup.' },
    { id: 'kyc', label: 'KYC', type: 'process', level: 'detail', x: 150, y: 350, radius: 30, parent: 'processes', module: 'process-discovery', details: 'Know Your Customer verification ensures proper customer identification and risk assessment.' },
    { id: 'payment', label: 'Payment Processing', type: 'process', level: 'detail', x: 600, y: 280, radius: 35, parent: 'processes', module: 'process-discovery', details: 'Payment processing handles transactions, fraud detection, and settlement activities.' },
    
    // Risk nodes
    { id: 'fraud', label: 'Fraud Risk', type: 'risk', level: 'detail', x: 300, y: 380, radius: 32, parent: 'risks', module: 'fmea-analysis', details: 'Risk of financial fraud including identity theft, transaction fraud, and account takeover.' },
    { id: 'compliance', label: 'Compliance Risk', type: 'risk', level: 'detail', x: 500, y: 380, radius: 32, parent: 'risks', module: 'fmea-analysis', details: 'Risk of non-compliance with regulatory requirements including PCI-DSS, GDPR, and AML regulations.' },
    { id: 'operational', label: 'Operational Risk', type: 'risk', level: 'detail', x: 400, y: 330, radius: 32, parent: 'risks', module: 'fmea-analysis', details: 'Risk of losses due to inadequate or failed internal processes, people, and systems.' },
    
    // Control nodes
    { id: 'authcontrol', label: 'Auth Controls', type: 'control', level: 'detail', x: 350, y: 450, radius: 32, parent: 'controls', module: 'compliance-monitoring', details: 'Authentication controls include multi-factor authentication, password policies, and access management.' },
    { id: 'monitoring', label: 'Transaction Monitoring', type: 'control', level: 'detail', x: 450, y: 450, radius: 32, parent: 'controls', module: 'compliance-monitoring', details: 'Continuous monitoring of transactions to detect suspicious activities and prevent fraud.' },
    { id: 'test1', label: 'Control Tests', type: 'testing', level: 'detail', x: 175, y: 450, radius: 25, parent: 'controls', module: 'controls-testing', details: 'Regular testing of controls to ensure their effectiveness and identify potential gaps.' },
  ];
};

// Generate all possible edges between nodes
const generateAllEdges = (): GraphEdge[] => {
  const edges: GraphEdge[] = [
    // Main to Category
    { id: 'e-bank-processes', source: 'bank', target: 'processes' },
    { id: 'e-bank-risks', source: 'bank', target: 'risks' },
    { id: 'e-bank-controls', source: 'bank', target: 'controls' },
    
    // Category to Detail - Processes
    { id: 'e-processes-onboarding', source: 'processes', target: 'onboarding' },
    { id: 'e-processes-kyc', source: 'processes', target: 'kyc' },
    { id: 'e-processes-payment', source: 'processes', target: 'payment' },
    
    // Category to Detail - Risks
    { id: 'e-risks-fraud', source: 'risks', target: 'fraud' },
    { id: 'e-risks-compliance', source: 'risks', target: 'compliance' },
    { id: 'e-risks-operational', source: 'risks', target: 'operational' },
    
    // Category to Detail - Controls
    { id: 'e-controls-authcontrol', source: 'controls', target: 'authcontrol' },
    { id: 'e-controls-monitoring', source: 'controls', target: 'monitoring' },
    { id: 'e-controls-test1', source: 'controls', target: 'test1' },
    
    // Cross connections between details
    { id: 'e-payment-fraud', source: 'payment', target: 'fraud' },
    { id: 'e-onboarding-compliance', source: 'onboarding', target: 'compliance' },
    { id: 'e-fraud-authcontrol', source: 'fraud', target: 'authcontrol' },
    { id: 'e-fraud-monitoring', source: 'fraud', target: 'monitoring' },
    { id: 'e-compliance-monitoring', source: 'compliance', target: 'monitoring' },
  ];
  
  return edges;
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ className }) => {
  // All possible nodes and edges
  const allNodes = {
    main: generateMainNodes(),
    category: generateCategoryNodes(),
    detail: generateDetailNodes(),
  };
  const allEdges = generateAllEdges();
  
  // Current visible nodes and edges
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>(allNodes.main);
  const [visibleEdges, setVisibleEdges] = useState<GraphEdge[]>([]);
  
  // State for interaction
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<NodeLevel>('main');
  const [parentHistory, setParentHistory] = useState<string[]>([]);
  const [detailsPanel, setDetailsPanel] = useState<{node: GraphNode | null, visible: boolean}>({node: null, visible: false});
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NodeType | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Initialize graph
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle level changes when a node is selected
  useEffect(() => {
    if (!selectedNode) return;
    
    const node = findNodeById(selectedNode);
    if (!node) return;
    
    // Handle drill down from main to category
    if (node.level === 'main') {
      // Show category nodes and connect them to the main node
      const categoryNodes = allNodes.category;
      const categoryEdges = allEdges.filter(e => e.source === node.id || e.target === node.id);
      
      setVisibleNodes([node, ...categoryNodes]);
      setVisibleEdges(categoryEdges);
      setCurrentLevel('category');
      setParentHistory([node.id]);
    }
    // Handle drill down from category to detail
    else if (node.level === 'category') {
      const detailNodes = allNodes.detail.filter(n => n.parent === node.id);
      
      // Find edges that connect this category to its details
      const directEdges = allEdges.filter(e => 
        (e.source === node.id && detailNodes.some(n => n.id === e.target)) ||
        (e.target === node.id && detailNodes.some(n => n.id === e.source))
      );
      
      // Also find edges that connect between these detail nodes
      const detailNodeIds = detailNodes.map(n => n.id);
      const interconnectionEdges = allEdges.filter(e => 
        detailNodeIds.includes(e.source) && detailNodeIds.includes(e.target)
      );
      
      // Combine all related nodes and edges
      const allRelatedNodes = [...visibleNodes.filter(n => n.id !== node.id), node, ...detailNodes];
      const allRelatedEdges = [...visibleEdges.filter(e => e.source === parentHistory[0] || e.target === parentHistory[0]), ...directEdges, ...interconnectionEdges];
      
      setVisibleNodes(allRelatedNodes);
      setVisibleEdges(allRelatedEdges);
      setCurrentLevel('detail');
      setParentHistory([...parentHistory, node.id]);
    }
    // When a detail node is clicked, show its details in the panel
    else if (node.level === 'detail') {
      setDetailsPanel({node, visible: true});
    }
  }, [selectedNode]);
  
  // Handle node filtering
  useEffect(() => {
    if (!activeFilter) return;
    
    // If we're on main view, don't filter
    if (currentLevel === 'main') return;
    
    // Filter nodes by type
    const filteredNodes = visibleNodes.filter(node => 
      node.level === 'main' || node.level === 'category' || node.type === activeFilter
    );
    
    // Filter edges to only include those connected to visible nodes
    const filteredNodeIds = filteredNodes.map(n => n.id);
    const filteredEdges = visibleEdges.filter(edge => 
      filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)
    );
    
    setVisibleNodes(filteredNodes);
    setVisibleEdges(filteredEdges);
  }, [activeFilter]);
  
  // Node position and sizing helper method
  const adjustNodePositions = (nodes: GraphNode[], zoomFactor: number = 1) => {
    const center = { x: 400, y: 300 };
    
    return nodes.map(node => {
      // Adjust position based on zoom
      const adjustedX = center.x + (node.x - center.x) * zoomFactor;
      const adjustedY = center.y + (node.y - center.y) * zoomFactor;
      
      // Adjust radius based on node level and zoom
      let radiusMultiplier = 1;
      if (node.level === 'main') radiusMultiplier = 1.2;
      else if (node.level === 'category') radiusMultiplier = 1;
      else radiusMultiplier = 0.9;
      
      return {
        ...node,
        x: adjustedX,
        y: adjustedY,
        radius: node.radius * radiusMultiplier * (isZoomed ? 1.2 : 1)
      };
    });
  };
  
  // Helper to find a node by ID across all levels
  const findNodeById = (id: string): GraphNode | undefined => {
    return [...allNodes.main, ...allNodes.category, ...allNodes.detail].find(n => n.id === id);
  };
  
  // Go back to previous level
  const handleBack = () => {
    if (parentHistory.length === 0) return;
    
    // Close details panel if open
    setDetailsPanel({node: null, visible: false});
    
    // If we're at detail level, go back to category
    if (currentLevel === 'detail') {
      const newParentHistory = [...parentHistory];
      newParentHistory.pop(); // Remove the last parent
      
      // Reset to the initial category view
      const mainNode = findNodeById(newParentHistory[0]);
      if (!mainNode) return;
      
      const categoryNodes = allNodes.category;
      const categoryEdges = allEdges.filter(e => e.source === mainNode.id || e.target === mainNode.id);
      
      setVisibleNodes([mainNode, ...categoryNodes]);
      setVisibleEdges(categoryEdges);
      setCurrentLevel('category');
      setParentHistory(newParentHistory);
      setSelectedNode(null);
    }
    // If we're at category level, go back to main
    else if (currentLevel === 'category') {
      setVisibleNodes(allNodes.main);
      setVisibleEdges([]);
      setCurrentLevel('main');
      setParentHistory([]);
      setSelectedNode(null);
    }
    
    // Clear any active filter
    setActiveFilter(null);
  };
  
  // Reset to initial state
  const handleReset = () => {
    setVisibleNodes(allNodes.main);
    setVisibleEdges([]);
    setCurrentLevel('main');
    setParentHistory([]);
    setSelectedNode(null);
    setDetailsPanel({node: null, visible: false});
    setActiveFilter(null);
  };
  
  // Toggle zoom state
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Filter nodes by type
  const handleFilterByType = (type: NodeType) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      
      // Reset to current level view
      if (currentLevel === 'category') {
        const mainNode = findNodeById(parentHistory[0]);
        if (!mainNode) return;
        
        const categoryNodes = allNodes.category;
        const categoryEdges = allEdges.filter(e => e.source === mainNode.id || e.target === mainNode.id);
        
        setVisibleNodes([mainNode, ...categoryNodes]);
        setVisibleEdges(categoryEdges);
      } else if (currentLevel === 'detail') {
        // Need to reconstruct the detail view
        const mainNode = findNodeById(parentHistory[0]);
        const categoryNode = findNodeById(parentHistory[1]);
        if (!mainNode || !categoryNode) return;
        
        const detailNodes = allNodes.detail.filter(n => n.parent === categoryNode.id);
        const categoryNodes = allNodes.category;
        
        const mainToCategory = allEdges.filter(e => e.source === mainNode.id || e.target === mainNode.id);
        const categoryToDetail = allEdges.filter(e => 
          (e.source === categoryNode.id && detailNodes.some(n => n.id === e.target)) ||
          (e.target === categoryNode.id && detailNodes.some(n => n.id === e.source))
        );
        
        const detailNodeIds = detailNodes.map(n => n.id);
        const interconnectionEdges = allEdges.filter(e => 
          detailNodeIds.includes(e.source) && detailNodeIds.includes(e.target)
        );
        
        setVisibleNodes([mainNode, ...categoryNodes, ...detailNodes]);
        setVisibleEdges([...mainToCategory, ...categoryToDetail, ...interconnectionEdges]);
      }
    } else {
      setActiveFilter(type);
    }
  };
  
  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node) return;
    
    // If node is already selected, deselect it
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      return;
    }
    
    setSelectedNode(nodeId);
    
    // Show toast for navigation (in a real app, this would actually navigate)
    if (node.module && node.level === 'detail') {
      toast.info(`Navigating to ${node.label} in ${node.module.replace('-', ' ')}...`);
    }
  };
  
  // Get node color based on type
  const getNodeColor = (type: NodeType, isSelected: boolean, isHovered: boolean) => {
    const baseColorMap: Record<NodeType, string> = {
      product: 'bg-blue-500',
      process: 'bg-green-500',
      risk: 'bg-red-500',
      control: 'bg-purple-500',
      incident: 'bg-orange-500',
      policy: 'bg-slate-500',
      regulation: 'bg-yellow-500',
      framework: 'bg-indigo-500',
      issue: 'bg-pink-500',
      testing: 'bg-cyan-500',
    };
    
    const hoverState = isSelected ? 'opacity-90' : isHovered ? 'opacity-80' : 'opacity-70';
    
    return `${baseColorMap[type]} ${hoverState}`;
  };
  
  // Get node border color based on type
  const getNodeBorderColor = (type: NodeType, isSelected: boolean) => {
    const baseColorMap: Record<NodeType, string> = {
      product: 'stroke-blue-700',
      process: 'stroke-green-700',
      risk: 'stroke-red-700',
      control: 'stroke-purple-700',
      incident: 'stroke-orange-700',
      policy: 'stroke-slate-700',
      regulation: 'stroke-yellow-700',
      framework: 'stroke-indigo-700',
      issue: 'stroke-pink-700',
      testing: 'stroke-cyan-700',
    };
    
    const strokeWidth = isSelected ? 'stroke-[3px]' : 'stroke-[1.5px]';
    
    return `${baseColorMap[type]} ${strokeWidth}`;
  };
  
  // Get node text color based on type
  const getNodeTextColor = (type: NodeType) => {
    return 'fill-white font-medium';
  };
  
  // Calculate if an edge is related to the selected node
  const isEdgeRelated = (edge: GraphEdge) => {
    if (!selectedNode) return true;
    return edge.source === selectedNode || edge.target === selectedNode;
  };
  
  // Draw path between nodes
  const getEdgePath = (source: GraphNode, target: GraphNode) => {
    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };
  
  // Get badge style for node type
  const getBadgeStyle = (type: NodeType) => {
    const styles: Record<NodeType, string> = {
      product: 'bg-blue-500',
      process: 'bg-green-500',
      risk: 'bg-red-500',
      control: 'bg-purple-500',
      incident: 'bg-orange-500',
      policy: 'bg-slate-500',
      regulation: 'bg-yellow-500',
      framework: 'bg-indigo-500',
      issue: 'bg-pink-500',
      testing: 'bg-cyan-500',
    };
    return styles[type];
  };
  
  // Apply adjustments to node positions
  const adjustedNodes = adjustNodePositions(visibleNodes, isZoomed ? 1.5 : 1);
  
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm overflow-hidden relative", className)}>
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
          {/* Navigation buttons */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentLevel === 'main'}
              className="text-xs h-8"
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={currentLevel === 'main'}
              className="text-xs h-8"
            >
              Reset
            </Button>
          </div>
          
          {/* Filter buttons for types */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleFilterByType('process')}
                  data-active={activeFilter === 'process'}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter Processes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleFilterByType('risk')}
                  data-active={activeFilter === 'risk'}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter Risks</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleFilterByType('control')}
                  data-active={activeFilter === 'control'}
                >
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter Controls</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Zoom toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomToggle}
            className="text-xs h-8 ml-2"
          >
            {isZoomed ? <Minus className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
            {isZoomed ? 'Zoom Out' : 'Zoom In'}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "relative bg-[#FAFBFC] dark:bg-gray-900 overflow-hidden transition-all",
        isZoomed ? "aspect-auto h-[550px]" : "aspect-[16/9]",
        detailsPanel.visible ? "pr-[300px]" : ""
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
              {visibleEdges.map(edge => {
                const source = adjustedNodes.find(node => node.id === edge.source);
                const target = adjustedNodes.find(node => node.id === edge.target);
                
                if (!source || !target) return null;
                
                const isRelated = isEdgeRelated(edge);
                
                return (
                  <g key={edge.id}>
                    <path
                      d={getEdgePath(source, target)}
                      className={cn(
                        "edge transition-all duration-300",
                        isRelated 
                          ? (source.type === 'risk' || target.type === 'risk')
                            ? "stroke-red-400 stroke-[2px]" 
                            : (source.type === 'process' || target.type === 'process')
                              ? "stroke-green-400 stroke-[2px]"
                              : (source.type === 'control' || target.type === 'control')
                                ? "stroke-purple-400 stroke-[2px]"
                                : "stroke-blue-400 stroke-[2px]"
                          : "stroke-gray-200 dark:stroke-gray-700",
                        selectedNode && !isRelated ? "opacity-30" : "opacity-90"
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
              {adjustedNodes.map(node => {
                const isNodeSelected = selectedNode === node.id;
                const isNodeHovered = hoveredNode === node.id;
                const isRelated = selectedNode ? 
                  visibleEdges.some(edge => 
                    (edge.source === selectedNode && edge.target === node.id) || 
                    (edge.source === node.id && edge.target === selectedNode)
                  ) || node.id === selectedNode : true;
                
                return (
                  <g 
                    key={node.id}
                    className={cn(
                      "node cursor-pointer transition-all duration-300",
                      isNodeSelected ? "scale-110" : "",
                      isNodeHovered ? "scale-105" : "",
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
                        getNodeColor(node.type, isNodeSelected, isNodeHovered),
                        getNodeBorderColor(node.type, isNodeSelected)
                      )}
                    />
                    
                    {/* Node label */}
                    <text
                      dy="0.3em"
                      className={cn(
                        "node-label pointer-events-none",
                        node.level === 'main' ? "text-base" : node.level === 'category' ? "text-sm" : "text-xs",
                        getNodeTextColor(node.type),
                        isNodeSelected ? "font-bold" : ""
                      )}
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                    
                    {/* Add a + indicator if node has children and is not a detail node */}
                    {node.level !== 'detail' && (
                      <text
                        dy={`${node.radius - 20}px`}
                        dx="0"
                        className="text-sm fill-white pointer-events-none font-bold"
                        textAnchor="middle"
                      >
                        {isNodeSelected ? "" : "⊕"}
                      </text>
                    )}
                    
                    {/* Module indicator for selected detail nodes */}
                    {isNodeSelected && node.level === 'detail' && node.module && (
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
                className="fill-blue-300 dark:fill-blue-600"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
          </svg>
        )}
        
        {/* Details Panel */}
        {detailsPanel.visible && detailsPanel.node && (
          <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-background/95 backdrop-blur-sm border-l shadow-md p-4 overflow-y-auto transition-all duration-300 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{detailsPanel.node.label}</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailsPanel({node: null, visible: false})}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Badge className={cn("mb-2", getBadgeStyle(detailsPanel.node.type))}>
                  {detailsPanel.node.type.charAt(0).toUpperCase() + detailsPanel.node.type.slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {detailsPanel.node.details || `Details about ${detailsPanel.node.label}`}
                </p>
              </div>
              
              {detailsPanel.node.module && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Module</h4>
                  <Badge variant="outline" className="capitalize">
                    {detailsPanel.node.module.replace('-', ' ')}
                  </Badge>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-1">Connected to</h4>
                <div className="space-y-1">
                  {visibleEdges
                    .filter(edge => edge.source === detailsPanel.node?.id || edge.target === detailsPanel.node?.id)
                    .map(edge => {
                      const connectedNodeId = edge.source === detailsPanel.node?.id ? edge.target : edge.source;
                      const connectedNode = findNodeById(connectedNodeId);
                      
                      if (!connectedNode) return null;
                      
                      return (
                        <div key={edge.id} className="flex items-center text-xs">
                          <div className={cn("w-2 h-2 rounded-full mr-2", getBadgeStyle(connectedNode.type))}></div>
                          <span>{connectedNode.label}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    toast.info(`Navigating to ${detailsPanel.node?.label} in ${detailsPanel.node?.module?.replace('-', ' ') || 'dashboard'}...`);
                    setDetailsPanel({node: null, visible: false});
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Legend Panel */}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm border rounded-md p-2 text-xs">
          <div className="font-medium mb-1">Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Product</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Process</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Control</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Regulation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
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
