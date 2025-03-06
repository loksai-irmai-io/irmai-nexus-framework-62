import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Info, Plus, Minus, Filter, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Knowledge graph data types
type NodeType = 'product' | 'process' | 'risk' | 'control' | 'incident' | 'policy' | 'regulation' | 'framework' | 'issue' | 'testing';
type NodeLevel = 'main' | 'category' | 'detail';
type ExpansionState = 'collapsed' | 'expanded' | 'detailed';

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
  expansionState?: ExpansionState;
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
    { id: 'bank', label: 'IRMAI Bank', type: 'product', level: 'main', x: 400, y: 250, radius: 60, expansionState: 'collapsed' },
  ];
};

// Category level nodes - these appear when a main node is clicked
const generateCategoryNodes = (): GraphNode[] => {
  return [
    { id: 'processes', label: 'Processes', type: 'process', level: 'category', x: 250, y: 150, radius: 45, parent: 'bank', children: ['onboarding', 'kyc', 'payment'], expansionState: 'collapsed' },
    { id: 'risks', label: 'Risks', type: 'risk', level: 'category', x: 400, y: 120, radius: 45, parent: 'bank', children: ['fraud', 'compliance', 'operational'], expansionState: 'collapsed' },
    { id: 'controls', label: 'Controls', type: 'control', level: 'category', x: 550, y: 150, radius: 45, parent: 'bank', children: ['authcontrol', 'monitoring', 'test1'], expansionState: 'collapsed' },
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
  const [expandedNodes, setExpandedNodes] = useState<Record<string, ExpansionState>>({});
  const [currentLevel, setCurrentLevel] = useState<NodeLevel>('main');
  const [parentHistory, setParentHistory] = useState<string[]>([]);
  const [detailsPanel, setDetailsPanel] = useState<{node: GraphNode | null, visible: boolean}>({node: null, visible: false});
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NodeType | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Initialize graph
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: Math.max(width, 400), 
          height: Math.max(height, 300) 
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Helper to find a node by ID across all levels
  const findNodeById = (id: string): GraphNode | undefined => {
    return [...allNodes.main, ...allNodes.category, ...allNodes.detail].find(n => n.id === id);
  };

  // New function to handle node expansion/collapse
  const toggleNodeExpansion = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node) return;

    // Get current expansion state
    const currentState = expandedNodes[nodeId] || node.expansionState || 'collapsed';
    const newState: ExpansionState = currentState === 'collapsed' ? 'expanded' : 'collapsed';
    
    // Update expanded nodes state
    setExpandedNodes({
      ...expandedNodes,
      [nodeId]: newState
    });

    // If expanding a node
    if (newState === 'expanded') {
      let nodesToAdd: GraphNode[] = [];
      let edgesToAdd: GraphEdge[] = [];
      
      // Based on node level, add different child nodes
      if (node.level === 'main') {
        // Add category nodes connected to this main node
        nodesToAdd = allNodes.category;
        edgesToAdd = allEdges.filter(e => 
          (e.source === node.id && nodesToAdd.some(n => n.id === e.target)) ||
          (e.target === node.id && nodesToAdd.some(n => n.id === e.source))
        );
      } else if (node.level === 'category' && node.children) {
        // Add detail nodes that are children of this category
        nodesToAdd = allNodes.detail.filter(n => node.children?.includes(n.id));
        edgesToAdd = allEdges.filter(e => 
          (e.source === node.id && nodesToAdd.some(n => n.id === e.target)) ||
          (e.target === node.id && nodesToAdd.some(n => n.id === e.source))
        );
        
        // Also add edges between detail nodes if they exist
        const detailNodeIds = nodesToAdd.map(n => n.id);
        const interconnectionEdges = allEdges.filter(e => 
          detailNodeIds.includes(e.source) && detailNodeIds.includes(e.target)
        );
        edgesToAdd = [...edgesToAdd, ...interconnectionEdges];
      }
      
      // Add these nodes and edges to visible elements
      setVisibleNodes(prev => {
        // Filter out any duplicates
        const existingIds = new Set(prev.map(n => n.id));
        const newNodes = nodesToAdd.filter(n => !existingIds.has(n.id));
        return [...prev, ...newNodes];
      });
      
      setVisibleEdges(prev => {
        // Filter out any duplicates
        const existingIds = new Set(prev.map(e => e.id));
        const newEdges = edgesToAdd.filter(e => !existingIds.has(e.id));
        return [...prev, ...newEdges];
      });
    } else {
      // If collapsing, remove child nodes that are not needed
      // Find all descendants of this node
      let descendantIds: string[] = [];
      
      if (node.level === 'main') {
        // Get all category nodes that are children of this main node
        const categoryNodes = allNodes.category.filter(n => n.parent === node.id);
        descendantIds = categoryNodes.map(n => n.id);
        
        // Get all detail nodes that are children of these categories
        categoryNodes.forEach(catNode => {
          if (catNode.children) {
            descendantIds = [...descendantIds, ...catNode.children];
          }
        });
      } else if (node.level === 'category' && node.children) {
        // Just get direct children
        descendantIds = node.children;
      }
      
      // Only keep nodes that aren't descendants of the collapsed node, unless they're expanded themselves
      setVisibleNodes(prev => 
        prev.filter(n => {
          // Keep the node itself and nodes that aren't descendants
          if (n.id === node.id || !descendantIds.includes(n.id)) return true;
          
          // Or keep nodes that are explicitly expanded by the user
          return expandedNodes[n.id] === 'expanded';
        })
      );
      
      // Remove edges connected to removed nodes
      setVisibleEdges(prev => 
        prev.filter(e => {
          const sourceInVisible = visibleNodes.some(n => n.id === e.source);
          const targetInVisible = visibleNodes.some(n => n.id === e.target);
          return sourceInVisible && targetInVisible;
        })
      );
    }
  };
  
  // Handle level changes when a node is selected
  useEffect(() => {
    if (!selectedNode) return;
    
    const node = findNodeById(selectedNode);
    if (!node) return;

    // Handle showing details panel for detail nodes
    if (node.level === 'detail') {
      setDetailsPanel({node, visible: true});
      return;
    }
    
    // For main and category nodes, expand/collapse them
    toggleNodeExpansion(selectedNode);
    
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
  
  // Node position and sizing helper method - updated to use dynamic dimensions
  const adjustNodePositions = (nodes: GraphNode[], zoomFactor: number = 1) => {
    const center = { 
      x: dimensions.width / 2, 
      y: dimensions.height / 2 
    };
    
    // Get expansion states
    const expansionStates = {...expandedNodes};
    
    // Function to recursively adjust node positions based on parent's position
    const adjustPosition = (node: GraphNode, parentPosition?: {x: number, y: number}) => {
      let adjustedNode = {...node};
      const isExpanded = expansionStates[node.id] === 'expanded';
      
      // If node has a parent position specified, position it relative to parent
      if (parentPosition && node.parent) {
        const angle = Math.random() * Math.PI * 2; // Random angle around the parent
        const distance = isExpanded ? 150 : 100; // Distance from parent
        
        adjustedNode.x = parentPosition.x + Math.cos(angle) * distance;
        adjustedNode.y = parentPosition.y + Math.sin(angle) * distance;
      }
      
      // Scale original positions based on new dimensions
      const scaledX = (adjustedNode.x / 800) * dimensions.width;
      const scaledY = (adjustedNode.y / 600) * dimensions.height;
      
      // Adjust position based on zoom
      const adjustedX = center.x + (scaledX - center.x) * zoomFactor;
      const adjustedY = center.y + (scaledY - center.y) * zoomFactor;
      
      // Adjust radius based on node level, zoom, and container size
      let radiusMultiplier = Math.min(dimensions.width, dimensions.height) / 1000;
      if (adjustedNode.level === 'main') radiusMultiplier *= 1.2;
      else if (adjustedNode.level === 'category') radiusMultiplier *= 1;
      else radiusMultiplier *= 0.9;
      
      return {
        ...adjustedNode,
        x: adjustedX,
        y: adjustedY,
        radius: node.radius * radiusMultiplier * (isZoomed ? 1.2 : 1) * Math.max(1, Math.min(dimensions.width, dimensions.height) / 600)
      };
    };
    
    // Organize nodes by level (main -> category -> detail)
    const mainNodes = nodes.filter(n => n.level === 'main').map(n => adjustPosition(n));
    
    // For each main node, position its children around it
    const categoryNodes = nodes.filter(n => n.level === 'category').map(n => {
      const parentNode = mainNodes.find(m => m.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    // For each category node, position its children around it
    const detailNodes = nodes.filter(n => n.level === 'detail').map(n => {
      const parentNode = categoryNodes.find(c => c.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    // Combine all adjusted nodes
    return [...mainNodes, ...categoryNodes, ...detailNodes];
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
    setExpandedNodes({});
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
  
  // Check if a node is expanded
  const isNodeExpanded = (nodeId: string): boolean => {
    const node = findNodeById(nodeId);
    return (expandedNodes[nodeId] || node?.expansionState) === 'expanded';
  };
  
  // Get node color based on type
  const getNodeColor = (type: NodeType, isSelected: boolean, isHovered: boolean) => {
    const baseColorMap: Record<NodeType, string> = {
      product: 'bg-blue-600',
      process: 'bg-green-600',
      risk: 'bg-red-600',
      control: 'bg-purple-600',
      incident: 'bg-orange-600',
      policy: 'bg-slate-600',
      regulation: 'bg-yellow-600',
      framework: 'bg-indigo-600',
      issue: 'bg-pink-600',
      testing: 'bg-cyan-600',
    };
    
    const hoverState = isSelected ? 'opacity-90' : isHovered ? 'opacity-80' : 'opacity-80';
    
    return `${baseColorMap[type]} ${hoverState}`;
  };
  
  // Get node border color based on type
  const getNodeBorderColor = (type: NodeType, isSelected: boolean) => {
    const baseColorMap: Record<NodeType, string> = {
      product: 'stroke-blue-800',
      process: 'stroke-green-800',
      risk: 'stroke-red-800',
      control: 'stroke-purple-800',
      incident: 'stroke-orange-800',
      policy: 'stroke-slate-800',
      regulation: 'stroke-yellow-800',
      framework: 'stroke-indigo-800',
      issue: 'stroke-pink-800',
      testing: 'stroke-cyan-800',
    };
    
    const strokeWidth = isSelected ? 'stroke-[3px]' : 'stroke-[1.5px]';
    
    return `${baseColorMap[type]} ${strokeWidth}`;
  };
  
  // Get node text color based on type
  const getNodeTextColor = (type: NodeType) => {
    return 'fill-white font-semibold';
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
      issue: 'bg-pink-600',
      testing: 'bg-cyan-600',
    };
    return styles[type];
  };
  
  // Apply adjustments to node positions with dynamic dimensions
  const adjustedNodes = adjustNodePositions(visibleNodes, isZoomed ? 1.5 : 1);
  
  return (
    <div className={cn("rounded-lg border bg-card shadow-sm overflow-hidden relative", className)} ref={containerRef}>
      <div className="p-3 sm:p-4 border-b bg-card flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base sm:text-lg text-primary truncate">Digital Twin Hub</h3>
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
        
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1 mr-1 sm:mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentLevel === 'main'}
              className="text-xs h-7 sm:h-8 px-1 sm:px-2"
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={currentLevel === 'main'}
              className="text-xs h-7 sm:h-8 px-1 sm:px-2"
            >
              Reset
            </Button>
          </div>
          
          <div className="hidden sm:flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter === 'process' ? "default" : "ghost"}
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => handleFilterByType('process')}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter Processes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter === 'risk' ? "default" : "ghost"}
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => handleFilterByType('risk')}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter Risks</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter === 'control' ? "default" : "ghost"}
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => handleFilterByType('control')}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter Controls</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="sm:hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter ? "default" : "outline"}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setActiveFilter(activeFilter ? null : 'process')}
                  >
                    <Filter className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Filters</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomToggle}
            className="text-xs h-7 sm:h-8 px-1 sm:px-2 ml-1 sm:ml-2"
          >
            {isZoomed ? <Minus className="h-3 w-3 mr-0 sm:mr-1" /> : <Plus className="h-3 w-3 mr-0 sm:mr-1" />}
            <span className="hidden sm:inline">{isZoomed ? 'Zoom Out' : 'Zoom In'}</span>
          </Button>
        </div>
      </div>
      
      <div 
        className={cn(
          "relative bg-[#FAFBFC] dark:bg-gray-900 overflow-hidden transition-all",
          detailsPanel.visible ? "pr-0 md:pr-[300px]" : ""
        )}
        style={{
          height: isZoomed ? Math.max(400, dimensions.height) : Math.max(300, dimensions.height)
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="shimmer h-full w-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
        ) : (
          <svg 
            ref={svgRef}
            className="w-full h-full"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
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
                      stroke={isRelated ? '#94a3b8' : '#e2e8f0'}
                      strokeWidth={isRelated ? 1.5 : 1}
                      fill="none"
                      opacity={isRelated ? 0.6 : 0.3}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
            </g>
            
            <g>
              {adjustedNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isHovered = hoveredNode === node.id;
                const expandable = node.level === 'main' || node.level === 'category';
                const expanded = isNodeExpanded(node.id);
                
                return (
                  <g 
                    key={node.id}
                    transform={`translate(${node.x},${node.y})`}
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={node.radius}
                      className={cn(
                        getNodeColor(node.type, isSelected, isHovered),
                        getNodeBorderColor(node.type, isSelected)
                      )}
                    />
                    
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={getNodeTextColor(node.type)}
                      fontSize={node.level === 'main' ? 14 : 12}
                    >
                      {node.label}
                    </text>
                    
                    {expandable && (
                      <g transform={`translate(0, ${node.radius * 0.6})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r={node.radius * 0.2}
                          className={`fill-white/80 stroke-current ${getNodeBorderColor(node.type, false)}`}
                        />
                        {expanded ? (
                          <Minus className="h-2 w-2 stroke-current text-gray-700" />
                        ) : (
                          <Plus className="h-2 w-2 stroke-current text-gray-700" />
                        )}
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}
        
        {detailsPanel.visible && detailsPanel.node && (
          <div className="absolute top-0 right-0 bottom-0 w-full md:w-[300px] bg-card border-l overflow-y-auto p-4 dark:border-gray-800 shadow-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getBadgeStyle(detailsPanel.node.type)}>
                  {detailsPanel.node.type.charAt(0).toUpperCase() + detailsPanel.node.type.slice(1)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDetailsPanel({ node: null, visible: false })}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold">{detailsPanel.node.label}</h3>
              
              {detailsPanel.node.module && (
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Module: {detailsPanel.node.module.replace('-', ' ')}
                </div>
              )}
              
              {detailsPanel.node.details && (
                <p className="text-sm text-muted-foreground">
                  {detailsPanel.node.details}
                </p>
              )}
              
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast.info(`Navigating to ${detailsPanel.node?.label}...`);
                    setDetailsPanel({ node: null, visible: false });
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;
