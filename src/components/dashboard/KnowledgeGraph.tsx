
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
    { id: 'bank', label: 'IRMAI Bank', type: 'product', level: 'main', x: 400, y: 250, radius: 70, expansionState: 'collapsed' },
  ];
};

// Category level nodes - these appear when a main node is clicked
const generateCategoryNodes = (): GraphNode[] => {
  return [
    { id: 'processes', label: 'Processes', type: 'process', level: 'category', x: 250, y: 150, radius: 55, parent: 'bank', children: ['onboarding', 'kyc', 'payment'], expansionState: 'collapsed' },
    { id: 'risks', label: 'Risks', type: 'risk', level: 'category', x: 400, y: 120, radius: 55, parent: 'bank', children: ['fraud', 'compliance', 'operational'], expansionState: 'collapsed' },
    { id: 'controls', label: 'Controls', type: 'control', level: 'category', x: 550, y: 150, radius: 55, parent: 'bank', children: ['authcontrol', 'monitoring', 'test1'], expansionState: 'collapsed' },
  ];
};

// Detail level nodes - these appear when a category node is clicked
const generateDetailNodes = (): GraphNode[] => {
  return [
    // Process nodes
    { id: 'onboarding', label: 'Customer Onboarding', type: 'process', level: 'detail', x: 200, y: 280, radius: 45, parent: 'processes', module: 'process-discovery', details: 'Customer onboarding process includes KYC verification, document collection, and account setup.' },
    { id: 'kyc', label: 'KYC', type: 'process', level: 'detail', x: 150, y: 350, radius: 35, parent: 'processes', module: 'process-discovery', details: 'Know Your Customer verification ensures proper customer identification and risk assessment.' },
    { id: 'payment', label: 'Payment Processing', type: 'process', level: 'detail', x: 600, y: 280, radius: 45, parent: 'processes', module: 'process-discovery', details: 'Payment processing handles transactions, fraud detection, and settlement activities.' },
    
    // Risk nodes
    { id: 'fraud', label: 'Fraud Risk', type: 'risk', level: 'detail', x: 300, y: 380, radius: 40, parent: 'risks', module: 'fmea-analysis', details: 'Risk of financial fraud including identity theft, transaction fraud, and account takeover.' },
    { id: 'compliance', label: 'Compliance Risk', type: 'risk', level: 'detail', x: 500, y: 380, radius: 42, parent: 'risks', module: 'fmea-analysis', details: 'Risk of non-compliance with regulatory requirements including PCI-DSS, GDPR, and AML regulations.' },
    { id: 'operational', label: 'Operational Risk', type: 'risk', level: 'detail', x: 400, y: 330, radius: 42, parent: 'risks', module: 'fmea-analysis', details: 'Risk of losses due to inadequate or failed internal processes, people, and systems.' },
    
    // Control nodes
    { id: 'authcontrol', label: 'Auth Controls', type: 'control', level: 'detail', x: 350, y: 450, radius: 40, parent: 'controls', module: 'compliance-monitoring', details: 'Authentication controls include multi-factor authentication, password policies, and access management.' },
    { id: 'monitoring', label: 'Transaction Monitoring', type: 'control', level: 'detail', x: 450, y: 450, radius: 45, parent: 'controls', module: 'compliance-monitoring', details: 'Continuous monitoring of transactions to detect suspicious activities and prevent fraud.' },
    { id: 'test1', label: 'Control Tests', type: 'testing', level: 'detail', x: 175, y: 450, radius: 40, parent: 'controls', module: 'controls-testing', details: 'Regular testing of controls to ensure their effectiveness and identify potential gaps.' },
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

  // Improved node position calculation for hierarchical layout
  const adjustNodePositions = (nodes: GraphNode[], zoomFactor: number = 1) => {
    const center = { 
      x: dimensions.width / 2, 
      y: dimensions.height / 2 
    };
    
    // Get expansion states
    const expansionStates = {...expandedNodes};
    
    // Check if any nodes are expanded
    const hasCategoryExpanded = Object.keys(expansionStates).some(nodeId => {
      const node = findNodeById(nodeId);
      return node?.level === 'category' && expansionStates[nodeId] === 'expanded';
    });
    
    const hasDetailExpanded = Object.keys(expansionStates).some(nodeId => {
      const node = findNodeById(nodeId);
      return node?.level === 'detail' && expansionStates[nodeId] === 'expanded';
    });
    
    // Cache to store calculated positions to maintain consistency
    const positionCache: Record<string, {x: number, y: number}> = {};
    
    // Function to calculate position deterministically based on level and parent
    const calculatePosition = (node: GraphNode, parentPosition?: {x: number, y: number}) => {
      // If this node already has a calculated position, use it
      if (positionCache[node.id]) {
        return positionCache[node.id];
      }
      
      let position: {x: number, y: number};
      
      // For main node, use the center but move up more when category or detail nodes are expanded
      if (node.level === 'main') {
        // Move the main node up more when nodes are expanded
        const yOffset = hasCategoryExpanded ? 0.4 : (hasDetailExpanded ? 0.3 : 0.8);
        position = { x: center.x, y: center.y * yOffset }; 
      }
      // For nodes with parents, position hierarchically (top to bottom)
      else if (parentPosition && node.parent) {
        const parentNode = findNodeById(node.parent);
        if (!parentNode) {
          position = { x: node.x, y: node.y };
        } else {
          // For category nodes, arrange horizontally under the main node
          if (node.level === 'category') {
            const siblings = allNodes.category.filter(n => n.parent === parentNode.id);
            const nodeIndex = siblings.findIndex(n => n.id === node.id);
            const totalSiblings = siblings.length;
            
            // Calculate horizontal spacing based on container width
            const horizontalSpacing = dimensions.width / (totalSiblings + 1);
            const horizontalPosition = horizontalSpacing * (nodeIndex + 1);
            
            position = {
              x: horizontalPosition,
              y: parentPosition.y + 150 // Increased vertical distance from parent
            };
          } 
          // For detail nodes, arrange in groups under their categories
          else {
            const siblings = allNodes.detail.filter(n => n.parent === parentNode.id);
            const nodeIndex = siblings.findIndex(n => n.id === node.id);
            const totalSiblings = siblings.length;
            
            // Find parent's horizontal position
            const parentX = positionCache[parentNode.id]?.x || parentPosition.x;
            
            // Calculate position in a grid-like pattern under the parent
            const columns = Math.ceil(Math.sqrt(totalSiblings));
            const row = Math.floor(nodeIndex / columns);
            const col = nodeIndex % columns;
            
            // Determine spacing based on container size and node count
            const horizontalSpacing = Math.min(140, dimensions.width / (columns * 1.5));
            const verticalSpacing = Math.min(140, dimensions.height / 8);
            
            position = {
              x: parentX + (col - Math.floor(columns/2)) * horizontalSpacing,
              y: parentPosition.y + 150 + (row * verticalSpacing) // Increased vertical spacing
            };
          }
        }
      } else {
        position = { x: node.x, y: node.y };
      }
      
      // Store in cache for consistency
      positionCache[node.id] = position;
      return position;
    };
    
    // Function to adjust a node's position and properties
    const adjustPosition = (node: GraphNode, parentPosition?: {x: number, y: number}) => {
      const calculatedPosition = calculatePosition(node, parentPosition);
      
      // Scale radius based on container size, node level, and label length
      let radiusMultiplier = Math.min(dimensions.width, dimensions.height) / 800;
      
      // Adjust radius based on node level
      if (node.level === 'main') radiusMultiplier *= 1.5;
      else if (node.level === 'category') radiusMultiplier *= 1.3;
      else radiusMultiplier *= 1.2;
      
      // Also adjust based on label length - longer labels get bigger circles
      const labelLengthFactor = Math.min(2.0, Math.max(1.2, node.label.length / 8));
      
      // Apply zoom factor to radius but not to position
      const scaledRadius = node.radius * radiusMultiplier * labelLengthFactor * 
                          (isZoomed ? 1.3 : 1.1) * 
                          Math.max(1, Math.min(dimensions.width, dimensions.height) / 600);
      
      return {
        ...node,
        x: calculatedPosition.x,
        y: calculatedPosition.y,
        radius: scaledRadius
      };
    };
    
    // Process nodes in hierarchy order: main -> category -> detail
    const mainNodes = nodes.filter(n => n.level === 'main').map(n => 
      adjustPosition(n)
    );
    
    // For each main node, position its children consistently
    const categoryNodes = nodes.filter(n => n.level === 'category').map(n => {
      const parentNode = mainNodes.find(m => m.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    // For each category node, position its children consistently
    const detailNodes = nodes.filter(n => n.level === 'detail').map(n => {
      const parentNode = categoryNodes.find(c => c.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    // Return nodes in the original order to maintain rendering consistency
    return [...mainNodes, ...categoryNodes, ...detailNodes];
  };
  
  // Improved function to handle node expansion/collapse
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
        nodesToAdd = allNodes.category.filter(n => n.parent === node.id);
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
      setVisibleEdges(prev => {
        const remainingNodeIds = new Set(visibleNodes.map(n => n.id));
        return prev.filter(e => remainingNodeIds.has(e.source) && remainingNodeIds.has(e.target));
      });
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
  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    // Prevent event propagation to ensure stable interaction
    event.stopPropagation();
    
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
  
  // Handle node hover with stable behavior
  const handleNodeHover = (nodeId: string | null, event: React.MouseEvent | null) => {
    if (event) {
      event.stopPropagation();
    }
    setHoveredNode(nodeId);
  };
  
  // Check if a node is expanded
  const isNodeExpanded = (nodeId: string): boolean => {
    const node = findNodeById(nodeId);
    return (expandedNodes[nodeId] || node?.expansionState) === 'expanded';
  };
  
  // Get node color based on type
  const getNodeColor = (type: NodeType, isSelected: boolean) => {
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
    
    return `${baseColorMap[type]}`;
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
  
  // Function to determine if an edge should be visible
  const isEdgeVisible = (edge: GraphEdge) => {
    // Always show edges connected to expanded nodes
    const isSourceExpanded = expandedNodes[edge.source] === 'expanded';
    const isTargetExpanded = expandedNodes[edge.target] === 'expanded';
    
    // Always show edges connected to the selected node
    const isSourceSelected = edge.source === selectedNode;
    const isTargetSelected = edge.target === selectedNode;
    
    // If any node on the edge is expanded or selected, show the edge
    return isSourceExpanded || isTargetExpanded || isSourceSelected || isTargetSelected;
  };
  
  // Enhanced path between nodes with better visibility
  const getEdgePath = (source: GraphNode, target: GraphNode) => {
    // For a hierarchical layout, use an appropriate curve type based on relationship
    if (source.level !== target.level) {
      // For lines connecting different levels, use Bezier curves with more visibility
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      
      // Adjust control points for clear visibility
      let controlPointX = midX;
      let controlPointY = midY;
      
      // For parent-child relationships, make the curve more pronounced
      if (target.parent === source.id || source.parent === target.id) {
        controlPointY = source.y < target.y ? 
                      source.y + (target.y - source.y) * 0.4 : 
                      target.y + (source.y - target.y) * 0.4;
      }
      
      return `M${source.x},${source.y} Q${controlPointX},${controlPointY} ${target.x},${target.y}`;
    }
    
    // For nodes on the same level, use straight lines
    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };
  
  // Get edge style based on connected nodes
  const getEdgeStyle = (edge: GraphEdge, isHovered: boolean) => {
    // Default styles
    let strokeWidth = "1.5";
    let opacity = "0.6";
    let dashArray = "";
    
    // Enhance edge visibility
    const isSourceExpanded = expandedNodes[edge.source] === 'expanded';
    const isTargetExpanded = expandedNodes[edge.target] === 'expanded';
    const isVisible = isEdgeVisible(edge);
    
    // If connected to expanded nodes, make the edge more visible
    if (isSourceExpanded || isTargetExpanded) {
      strokeWidth = "2";
      opacity = "0.9";
    }
    
    // If edge connects nodes on different levels, use solid line
    // If on same level, use dashed line 
    const sourceNode = findNodeById(edge.source);
    const targetNode = findNodeById(edge.target);
    
    if (sourceNode && targetNode && sourceNode.level === targetNode.level) {
      dashArray = "5,5";
    }
    
    // If the edge is hovered or connects to selected node, make it stand out
    if (isHovered || edge.source === selectedNode || edge.target === selectedNode) {
      strokeWidth = "2.5";
      opacity = "1";
      dashArray = "";
    }
    
    return {
      strokeWidth,
      opacity,
      strokeDasharray: dashArray
    };
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
  
  // Set up the render for the graph
  const renderedNodes = adjustNodePositions(visibleNodes);
  
  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full bg-white rounded-lg shadow-sm border overflow-hidden",
        className
      )}
      style={{ height: '700px' }}
    >
      {/* Interface Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white hover:bg-gray-100"
                onClick={handleBack} 
                disabled={parentHistory.length === 0} 
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Back to previous level
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white hover:bg-gray-100"
                onClick={handleReset}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Reset view
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white hover:bg-gray-100"
                onClick={handleZoomToggle}
              >
                {isZoomed ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isZoomed ? 'Zoom out' : 'Zoom in'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Filter Controls */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white hover:bg-gray-100"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" align="center" className="max-w-[220px]">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  <Badge 
                    onClick={() => handleFilterByType('process')} 
                    className={cn(
                      'bg-green-500 hover:bg-green-600 cursor-pointer',
                      activeFilter === 'process' && 'ring-2 ring-ring'
                    )}
                  >
                    Process
                  </Badge>
                  <Badge 
                    onClick={() => handleFilterByType('risk')} 
                    className={cn(
                      'bg-red-500 hover:bg-red-600 cursor-pointer',
                      activeFilter === 'risk' && 'ring-2 ring-ring'
                    )}
                  >
                    Risk
                  </Badge>
                  <Badge 
                    onClick={() => handleFilterByType('control')} 
                    className={cn(
                      'bg-purple-500 hover:bg-purple-600 cursor-pointer',
                      activeFilter === 'control' && 'ring-2 ring-ring'
                    )}
                  >
                    Control
                  </Badge>
                  <Badge 
                    onClick={() => handleFilterByType('testing')} 
                    className={cn(
                      'bg-cyan-500 hover:bg-cyan-600 cursor-pointer',
                      activeFilter === 'testing' && 'ring-2 ring-ring'
                    )}
                  >
                    Testing
                  </Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      )}
      
      {/* Graph visualization */}
      <svg 
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Graph Edges */}
        <g>
          {visibleEdges.map(edge => {
            const sourceNode = renderedNodes.find(n => n.id === edge.source);
            const targetNode = renderedNodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const isHovered = hoveredNode === edge.source || hoveredNode === edge.target;
            const edgeStyle = getEdgeStyle(edge, isHovered);
            
            return (
              <g key={edge.id}>
                <path
                  d={getEdgePath(sourceNode, targetNode)}
                  fill="none"
                  stroke="#666"
                  strokeWidth={edgeStyle.strokeWidth}
                  opacity={edgeStyle.opacity}
                  strokeDasharray={edgeStyle.strokeDasharray}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
        </g>
        
        {/* Graph Nodes */}
        <g>
          {renderedNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isExpanded = isNodeExpanded(node.id);
            
            // Calculate font size based on node radius
            const fontSize = Math.max(10, Math.min(14, node.radius / 3.5));
            
            // Calculate how many characters can fit in the node
            const maxChars = Math.floor(node.radius / (fontSize * 0.5));
            
            // Truncate label if needed
            let displayLabel = node.label;
            if (displayLabel.length > maxChars) {
              displayLabel = displayLabel.slice(0, maxChars - 3) + '...';
            }
            
            return (
              <g 
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseEnter={(e) => handleNodeHover(node.id, e)}
                onMouseLeave={(e) => handleNodeHover(null, e)}
                className="cursor-pointer"
              >
                {/* Node Circle */}
                <circle
                  r={node.radius}
                  className={cn(
                    getNodeColor(node.type, isSelected),
                    getNodeBorderColor(node.type, isSelected),
                    isHovered && !isSelected && 'stroke-[2.5px] opacity-90',
                    isSelected && 'opacity-100',
                    !isSelected && !isHovered && 'opacity-85'
                  )}
                />
                
                {/* Node Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={getNodeTextColor(node.type)}
                  fontSize={fontSize}
                  dy="0.1em"
                >
                  {displayLabel}
                </text>
                
                {/* Expansion Indicator */}
                {(node.level === 'main' || (node.level === 'category' && node.children && node.children.length > 0)) && (
                  <circle
                    r={Math.min(10, node.radius * 0.3)}
                    cy={node.radius * 0.7}
                    fill={isExpanded ? "#ffffff" : "#ffffff80"}
                    stroke="#00000055"
                    strokeWidth="1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNodeExpansion(node.id);
                    }}
                  >
                    <title>{isExpanded ? "Collapse" : "Expand"}</title>
                  </circle>
                )}
                
                {/* Expansion Icon */}
                {(node.level === 'main' || (node.level === 'category' && node.children && node.children.length > 0)) && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#555"
                    fontSize={Math.min(12, node.radius * 0.3)}
                    y={node.radius * 0.7}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNodeExpansion(node.id);
                    }}
                  >
                    {isExpanded ? "-" : "+"}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        
        {/* Arrow markers for edges */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>
      </svg>
      
      {/* Details Panel */}
      {detailsPanel.visible && detailsPanel.node && (
        <div className="absolute bottom-4 right-4 p-4 bg-white border rounded-lg shadow-lg max-w-md z-20">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                'w-3 h-3 rounded-full',
                getBadgeStyle(detailsPanel.node.type)
              )} />
              <h3 className="font-medium">{detailsPanel.node.label}</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setDetailsPanel({node: null, visible: false})}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{detailsPanel.node.details}</p>
          
          {detailsPanel.node.module && (
            <div className="mt-3 flex items-center justify-between">
              <Badge variant="outline" className="bg-secondary/10">
                {detailsPanel.node.module.replace('-', ' ')}
              </Badge>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs p-0 h-auto"
                onClick={() => {
                  toast.info(`Navigating to ${detailsPanel.node?.label} in ${detailsPanel.node?.module?.replace('-', ' ')}...`);
                }}
              >
                View details
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
