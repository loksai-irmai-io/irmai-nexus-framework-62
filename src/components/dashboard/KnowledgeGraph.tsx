import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Info, Minus, Filter, Move, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

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

export interface KnowledgeGraphProps {
  className?: string;
  isLoading?: boolean;
  animate?: boolean;
}

const generateMainNodes = (): GraphNode[] => {
  return [
    { id: 'bank', label: 'IRMAI Bank', type: 'product', level: 'main', x: 400, y: 250, radius: 50, expansionState: 'collapsed' },
  ];
};

const generateCategoryNodes = (): GraphNode[] => {
  return [
    { id: 'processes', label: 'Processes', type: 'process', level: 'category', x: 250, y: 150, radius: 40, parent: 'bank', children: ['onboarding', 'kyc', 'payment'], expansionState: 'collapsed' },
    { id: 'risks', label: 'Risks', type: 'risk', level: 'category', x: 400, y: 120, radius: 40, parent: 'bank', children: ['fraud', 'compliance', 'operational'], expansionState: 'collapsed' },
    { id: 'controls', label: 'Controls', type: 'control', level: 'category', x: 550, y: 150, radius: 40, parent: 'bank', children: ['authcontrol', 'monitoring', 'test1'], expansionState: 'collapsed' },
  ];
};

const generateDetailNodes = (): GraphNode[] => {
  return [
    { id: 'onboarding', label: 'Customer Onboarding', type: 'process', level: 'detail', x: 200, y: 280, radius: 35, parent: 'processes', module: 'process-discovery', details: 'Customer onboarding process includes KYC verification, document collection, and account setup.' },
    { id: 'kyc', label: 'KYC', type: 'process', level: 'detail', x: 150, y: 350, radius: 30, parent: 'processes', module: 'process-discovery', details: 'Know Your Customer verification ensures proper customer identification and risk assessment.' },
    { id: 'payment', label: 'Payment Processing', type: 'process', level: 'detail', x: 600, y: 280, radius: 35, parent: 'processes', module: 'process-discovery', details: 'Payment processing handles transactions, fraud detection, and settlement activities.' },
    
    { id: 'fraud', label: 'Fraud Risk', type: 'risk', level: 'detail', x: 300, y: 380, radius: 30, parent: 'risks', module: 'fmea-analysis', details: 'Risk of financial fraud including identity theft, transaction fraud, and account takeover.' },
    { id: 'compliance', label: 'Compliance Risk', type: 'risk', level: 'detail', x: 500, y: 380, radius: 32, parent: 'risks', module: 'fmea-analysis', details: 'Risk of non-compliance with regulatory requirements including PCI-DSS, GDPR, and AML regulations.' },
    { id: 'operational', label: 'Operational Risk', type: 'risk', level: 'detail', x: 400, y: 330, radius: 32, parent: 'risks', module: 'fmea-analysis', details: 'Risk of losses due to inadequate or failed internal processes, people, and systems.' },
    
    { id: 'authcontrol', label: 'Auth Controls', type: 'control', level: 'detail', x: 350, y: 450, radius: 30, parent: 'controls', module: 'compliance-monitoring', details: 'Authentication controls include multi-factor authentication, password policies, and access management.' },
    { id: 'monitoring', label: 'Transaction Monitoring', type: 'control', level: 'detail', x: 450, y: 450, radius: 35, parent: 'controls', module: 'compliance-monitoring', details: 'Continuous monitoring of transactions to detect suspicious activities and prevent fraud.' },
    { id: 'test1', label: 'Control Tests', type: 'testing', level: 'detail', x: 175, y: 450, radius: 30, parent: 'controls', module: 'controls-testing', details: 'Regular testing of controls to ensure their effectiveness and identify potential gaps.' },
  ];
};

const generateAllEdges = (): GraphEdge[] => {
  const edges: GraphEdge[] = [
    { id: 'e-bank-processes', source: 'bank', target: 'processes' },
    { id: 'e-bank-risks', source: 'bank', target: 'risks' },
    { id: 'e-bank-controls', source: 'bank', target: 'controls' },
    
    { id: 'e-processes-onboarding', source: 'processes', target: 'onboarding' },
    { id: 'e-processes-kyc', source: 'processes', target: 'kyc' },
    { id: 'e-processes-payment', source: 'processes', target: 'payment' },
    
    { id: 'e-risks-fraud', source: 'risks', target: 'fraud' },
    { id: 'e-risks-compliance', source: 'risks', target: 'compliance' },
    { id: 'e-risks-operational', source: 'risks', target: 'operational' },
    
    { id: 'e-controls-authcontrol', source: 'controls', target: 'authcontrol' },
    { id: 'e-controls-monitoring', source: 'controls', target: 'monitoring' },
    { id: 'e-controls-test1', source: 'controls', target: 'test1' },
    
    { id: 'e-payment-fraud', source: 'payment', target: 'fraud' },
    { id: 'e-onboarding-compliance', source: 'onboarding', target: 'compliance' },
    { id: 'e-fraud-authcontrol', source: 'fraud', target: 'authcontrol' },
    { id: 'e-fraud-monitoring', source: 'fraud', target: 'monitoring' },
    { id: 'e-compliance-monitoring', source: 'compliance', target: 'monitoring' },
  ];
  
  return edges;
};

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  className,
  isLoading = false,
  animate = false
}) => {
  const allNodes = {
    main: generateMainNodes(),
    category: generateCategoryNodes(),
    detail: generateDetailNodes(),
  };
  const allEdges = generateAllEdges();
  
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>(allNodes.main);
  const [visibleEdges, setVisibleEdges] = useState<GraphEdge[]>([]);
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, ExpansionState>>({});
  const [currentLevel, setCurrentLevel] = useState<NodeLevel>('main');
  const [parentHistory, setParentHistory] = useState<string[]>([]);
  const [detailsPanel, setDetailsPanel] = useState<{node: GraphNode | null, visible: boolean}>({node: null, visible: false});
  const [isGraphLoading, setIsGraphLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NodeType | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    if (animate) {
      const mainNode = allNodes.main[0];
      if (mainNode) {
        setExpandedNodes({
          [mainNode.id]: 'expanded',
          'processes': 'expanded',
          'risks': 'expanded',
          'controls': 'expanded'
        });
        
        setVisibleNodes([
          ...allNodes.main,
          ...allNodes.category,
          ...allNodes.detail
        ]);
        
        setVisibleEdges(allEdges);
        
        setCurrentLevel('category');
        setParentHistory([mainNode.id]);
      }
    } else {
      setVisibleNodes(allNodes.main);
      setVisibleEdges([]);
      setExpandedNodes({});
      setCurrentLevel('main');
      setParentHistory([]);
    }
  }, [animate]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGraphLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  const findNodeById = (id: string): GraphNode | undefined => {
    return [...allNodes.main, ...allNodes.category, ...allNodes.detail].find(n => n.id === id);
  };

  const adjustNodePositions = (nodes: GraphNode[], zoomFactor: number = 1) => {
    const center = { 
      x: dimensions.width / 2, 
      y: dimensions.height / 2 
    };
    
    const expansionStates = {...expandedNodes};
    
    const hasCategoryExpanded = Object.keys(expansionStates).some(nodeId => {
      const node = findNodeById(nodeId);
      return node?.level === 'category' && expansionStates[nodeId] === 'expanded';
    });
    
    const hasDetailExpanded = Object.keys(expansionStates).some(nodeId => {
      const node = findNodeById(nodeId);
      return node?.level === 'detail' && expansionStates[nodeId] === 'expanded';
    });
    
    const positionCache: Record<string, {x: number, y: number}> = {};
    
    const calculatePosition = (node: GraphNode, parentPosition?: {x: number, y: number}) => {
      if (positionCache[node.id]) {
        return positionCache[node.id];
      }
      
      let position: {x: number, y: number};
      
      if (node.level === 'main') {
        const yOffset = hasCategoryExpanded ? 0.4 : (hasDetailExpanded ? 0.3 : 0.8);
        position = { x: center.x, y: center.y * yOffset }; 
      } else if (parentPosition && node.parent) {
        const parentNode = findNodeById(node.parent);
        if (!parentNode) {
          position = { x: node.x, y: node.y };
        } else {
          if (node.level === 'category') {
            const siblings = allNodes.category.filter(n => n.parent === parentNode.id);
            const nodeIndex = siblings.findIndex(n => n.id === node.id);
            const totalSiblings = siblings.length;
            
            const horizontalSpacing = dimensions.width / (totalSiblings + 1);
            const horizontalPosition = horizontalSpacing * (nodeIndex + 1);
            
            position = {
              x: horizontalPosition,
              y: parentPosition.y + 130
            };
          } else {
            const siblings = allNodes.detail.filter(n => n.parent === parentNode.id);
            const nodeIndex = siblings.findIndex(n => n.id === node.id);
            const totalSiblings = siblings.length;
            
            const parentX = positionCache[parentNode.id]?.x || parentPosition.x;
            
            const columns = Math.ceil(Math.sqrt(totalSiblings));
            const row = Math.floor(nodeIndex / columns);
            const col = nodeIndex % columns;
            
            const horizontalSpacing = Math.min(120, dimensions.width / (columns * 1.5));
            const verticalSpacing = Math.min(120, dimensions.height / 8);
            
            position = {
              x: parentX + (col - Math.floor(columns/2)) * horizontalSpacing,
              y: parentPosition.y + 130 + (row * verticalSpacing)
            };
          }
        }
      } else {
        position = { x: node.x, y: node.y };
      }
      
      positionCache[node.id] = position;
      return position;
    };
    
    const adjustPosition = (node: GraphNode, parentPosition?: {x: number, y: number}) => {
      const calculatedPosition = calculatePosition(node, parentPosition);
      
      let radiusMultiplier = Math.min(dimensions.width, dimensions.height) / 1000;
      
      if (node.level === 'main') radiusMultiplier *= 1.3;
      else if (node.level === 'category') radiusMultiplier *= 1.1;
      else radiusMultiplier *= 1.0;
      
      const labelLengthFactor = Math.min(1.8, Math.max(1.0, node.label.length / 10));
      
      const scaledRadius = node.radius * radiusMultiplier * labelLengthFactor * 
                          (isZoomed ? 1.2 : 1.0) * 
                          Math.max(1, Math.min(dimensions.width, dimensions.height) / 700);
      
      return {
        ...node,
        x: calculatedPosition.x,
        y: calculatedPosition.y,
        radius: scaledRadius
      };
    };
    
    const mainNodes = nodes.filter(n => n.level === 'main').map(n => 
      adjustPosition(n)
    );
    
    const categoryNodes = nodes.filter(n => n.level === 'category').map(n => {
      const parentNode = mainNodes.find(m => m.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    const detailNodes = nodes.filter(n => n.level === 'detail').map(n => {
      const parentNode = categoryNodes.find(c => c.id === n.parent);
      return adjustPosition(n, parentNode ? {x: parentNode.x, y: parentNode.y} : undefined);
    });
    
    return [...mainNodes, ...categoryNodes, ...detailNodes];
  };
  
  const toggleNodeExpansion = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (!node) return;

    const currentState = expandedNodes[nodeId] || node.expansionState || 'collapsed';
    const newState: ExpansionState = currentState === 'collapsed' ? 'expanded' : 'collapsed';
    
    setExpandedNodes({
      ...expandedNodes,
      [nodeId]: newState
    });

    if (newState === 'expanded') {
      let nodesToAdd: GraphNode[] = [];
      let edgesToAdd: GraphEdge[] = [];
      
      if (node.level === 'main') {
        nodesToAdd = allNodes.category.filter(n => n.parent === node.id);
        edgesToAdd = allEdges.filter(e => 
          (e.source === node.id && nodesToAdd.some(n => n.id === e.target)) ||
          (e.target === node.id && nodesToAdd.some(n => n.id === e.source))
        );
      } else if (node.level === 'category' && node.children) {
        nodesToAdd = allNodes.detail.filter(n => node.children?.includes(n.id));
        edgesToAdd = allEdges.filter(e => 
          (e.source === node.id && nodesToAdd.some(n => n.id === e.target)) ||
          (e.target === node.id && nodesToAdd.some(n => n.id === e.source))
        );
        
        const detailNodeIds = nodesToAdd.map(n => n.id);
        const interconnectionEdges = allEdges.filter(e => 
          detailNodeIds.includes(e.source) && detailNodeIds.includes(e.target)
        );
        edgesToAdd = [...edgesToAdd, ...interconnectionEdges];
      }
      
      setVisibleNodes(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newNodes = nodesToAdd.filter(n => !existingIds.has(n.id));
        return [...prev, ...newNodes];
      });
      
      setVisibleEdges(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const newEdges = edgesToAdd.filter(e => !existingIds.has(e.id));
        return [...prev, ...newEdges];
      });
    } else {
      let descendantIds: string[] = [];
      
      if (node.level === 'main') {
        const categoryNodes = allNodes.category.filter(n => n.parent === node.id);
        descendantIds = categoryNodes.map(n => n.id);
        
        categoryNodes.forEach(catNode => {
          if (catNode.children) {
            descendantIds = [...descendantIds, ...catNode.children];
          }
        });
      } else if (node.level === 'category' && node.children) {
        descendantIds = node.children;
      }
      
      setVisibleNodes(prev => 
        prev.filter(n => {
          if (n.id === node.id || !descendantIds.includes(n.id)) return true;
          return expandedNodes[n.id] === 'expanded';
        })
      );
      
      setVisibleEdges(prev => {
        const remainingNodeIds = new Set(visibleNodes.map(n => n.id));
        return prev.filter(e => remainingNodeIds.has(e.source) && remainingNodeIds.has(e.target));
      });
    }
  };
  
  useEffect(() => {
    if (!selectedNode) return;
    
    const node = findNodeById(selectedNode);
    if (!node) return;

    if (node.level === 'detail') {
      setDetailsPanel({node, visible: true});
      return;
    }
    
    toggleNodeExpansion(selectedNode);
  }, [selectedNode]);
  
  useEffect(() => {
    if (!activeFilter) return;
    
    if (currentLevel === 'main') return;
    
    const filteredNodes = visibleNodes.filter(node => 
      node.level === 'main' || node.level === 'category' || node.type === activeFilter
    );
    
    const filteredNodeIds = filteredNodes.map(n => n.id);
    const filteredEdges = visibleEdges.filter(edge => 
      filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)
    );
    
    setVisibleNodes(filteredNodes);
    setVisibleEdges(filteredEdges);
  }, [activeFilter]);
  
  const handleBack = () => {
    if (parentHistory.length === 0) return;
    
    setDetailsPanel({node: null, visible: false});
    
    if (currentLevel === 'detail') {
      const newParentHistory = [...parentHistory];
      newParentHistory.pop();
      
      const mainNode = findNodeById(newParentHistory[0]);
      if (!mainNode) return;
      
      const categoryNodes = allNodes.category;
      const categoryEdges = allEdges.filter(e => e.source === mainNode.id || e.target === mainNode.id);
      
      setVisibleNodes([mainNode, ...categoryNodes]);
      setVisibleEdges(categoryEdges);
      setCurrentLevel('category');
      setParentHistory(newParentHistory);
      setSelectedNode(null);
    } else if (currentLevel === 'category') {
      setVisibleNodes(allNodes.main);
      setVisibleEdges([]);
      setCurrentLevel('main');
      setParentHistory([]);
      setSelectedNode(null);
    }
    
    setActiveFilter(null);
  };
  
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
  
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleFilterByType = (type: NodeType) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      
      if (currentLevel === 'category') {
        const mainNode = findNodeById(parentHistory[0]);
        if (!mainNode) return;
        
        const categoryNodes = allNodes.category;
        const categoryEdges = allEdges.filter(e => e.source === mainNode.id || e.target === mainNode.id);
        
        setVisibleNodes([mainNode, ...categoryNodes]);
        setVisibleEdges(categoryEdges);
      } else if (currentLevel === 'detail') {
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
  
  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const node = findNodeById(nodeId);
    if (!node) return;
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      return;
    }
    
    setSelectedNode(nodeId);
    
    if (node.module && node.level === 'detail') {
      toast.info(`Navigating to ${node.label} in ${node.module.replace('-', ' ')}...`);
    }
  };
  
  const handleNodeHover = (nodeId: string | null, event: React.MouseEvent | null) => {
    if (event) {
      event.stopPropagation();
    }
    setHoveredNode(nodeId);
  };
  
  const isNodeExpanded = (nodeId: string): boolean => {
    const node = findNodeById(nodeId);
    return (expandedNodes[nodeId] || node?.expansionState) === 'expanded';
  };
  
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
    
    const strokeWidth = isSelected ? 'stroke-[2px]' : 'stroke-[1px]';
    
    return `${baseColorMap[type]} ${strokeWidth}`;
  };
  
  const getNodeTextColor = (type: NodeType) => {
    return 'fill-white font-semibold';
  };
  
  const isEdgeVisible = (edge: GraphEdge) => {
    const isSourceExpanded = expandedNodes[edge.source] === 'expanded';
    const isTargetExpanded = expandedNodes[edge.target] === 'expanded';
    
    const isSourceSelected = edge.source === selectedNode;
    const isTargetSelected = edge.target === selectedNode;
    
    return isSourceExpanded || isTargetExpanded || isSourceSelected || isTargetSelected;
  };
  
  const getEdgePath = (source: GraphNode, target: GraphNode) => {
    if (source.level !== target.level) {
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      
      let controlPointX = midX;
      let controlPointY = midY;
      
      if (target.parent === source.id || source.parent === target.id) {
        controlPointY = source.y < target.y ? 
                      source.y + (target.y - source.y) * 0.4 : 
                      target.y + (source.y - target.y) * 0.4;
      }
      
      return `M${source.x},${source.y} Q${controlPointX},${controlPointY} ${target.x},${target.y}`;
    }
    
    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };
  
  const getEdgeStyle = (edge: GraphEdge, isHovered: boolean) => {
    let strokeWidth = "1";
    let opacity = "0.5";
    let dashArray = "";
    
    const isSourceExpanded = expandedNodes[edge.source] === 'expanded';
    const isTargetExpanded = expandedNodes[edge.target] === 'expanded';
    const isVisible = isEdgeVisible(edge);
    
    if (isSourceExpanded || isTargetExpanded) {
      strokeWidth = "1.5";
      opacity = "0.7";
    }
    
    const sourceNode = findNodeById(edge.source);
    const targetNode = findNodeById(edge.target);
    
    if (sourceNode && targetNode && sourceNode.level === targetNode.level) {
      dashArray = "4,4";
    }
    
    if (isHovered || edge.source === selectedNode || edge.target === selectedNode) {
      strokeWidth = "2";
      opacity = "0.9";
      dashArray = "";
    }
    
    return {
      strokeWidth,
      opacity,
      strokeDasharray: dashArray
    };
  };
  
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
  
  const getNodeTextSize = (radius: number) => {
    const fontSize = Math.max(8, Math.min(14, radius / 4));
    return `${fontSize}px`;
  };
  
  const formatNodeLabel = (label: string, radius: number) => {
    if (radius < 20) {
      return label.length > 3 ? `${label.substring(0, 3)}...` : label;
    }
    
    if (radius < 30) {
      return label.length > 8 ? `${label.substring(0, 8)}...` : label;
    }
    
    if (radius < 40) {
      return label.length > 15 ? `${label.substring(0, 15)}...` : label;
    }
    
    return label.length > 30 ? `${label.substring(0, 30)}...` : label;
  };
  
  const adjustedNodes = adjustNodePositions(visibleNodes);
  
  if (isLoading || isGraphLoading) {
    return (
      <div className={cn("relative w-full h-[300px]", className)} ref={containerRef}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  return (
    <div className={cn("relative w-full h-[300px]", className)} ref={containerRef}>
      <svg 
        ref={svgRef}
        width={dimensions.width} 
        height={dimensions.height}
        className="overflow-visible"
        onClick={() => setSelectedNode(null)}
      >
        {visibleEdges.map(edge => {
          const source = adjustedNodes.find(n => n.id === edge.source);
          const target = adjustedNodes.find(n => n.id === edge.target);
          
          if (!source || !target) return null;
          
          const isHovered = hoveredNode === source.id || hoveredNode === target.id;
          const { strokeWidth, opacity, strokeDasharray } = getEdgeStyle(edge, isHovered);
          
          return (
            <g key={edge.id}>
              <path
                d={getEdgePath(source, target)}
                fill="none"
                stroke="#888"
                strokeWidth={strokeWidth}
                opacity={opacity}
                strokeDasharray={strokeDasharray}
              />
            </g>
          );
        })}
        
        {adjustedNodes.map(node => {
          const isSelected = selectedNode === node.id;
          const isHovered = hoveredNode === node.id;
          const isExpanded = isNodeExpanded(node.id);
          
          return (
            <g 
              key={node.id}
              onClick={e => handleNodeClick(node.id, e)}
              onMouseEnter={e => handleNodeHover(node.id, e)}
              onMouseLeave={e => handleNodeHover(null, e)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                className={cn(
                  getNodeColor(node.type, isSelected),
                  getNodeBorderColor(node.type, isSelected),
                  isSelected ? 'opacity-90' : 'opacity-80',
                  isHovered && 'opacity-100'
                )}
                strokeWidth={isSelected ? 2 : 1}
              />
              
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={getNodeTextColor(node.type)}
                style={{ fontSize: getNodeTextSize(node.radius) }}
              >
                {formatNodeLabel(node.label, node.radius)}
              </text>
            </g>
          );
        })}
      </svg>
      
      {detailsPanel.visible && detailsPanel.node && (
        <div className="absolute bottom-4 right-4 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Badge className={getBadgeStyle(detailsPanel.node.type)}>
                {detailsPanel.node.type}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={() => setDetailsPanel({node: null, visible: false})}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <h3 className="text-base font-semibold mb-1">{detailsPanel.node.label}</h3>
          
          {detailsPanel.node.details && (
            <p className="text-sm text-muted-foreground mb-2">{detailsPanel.node.details}</p>
          )}
          
          {detailsPanel.node.module && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {detailsPanel.node.module.replace('-', ' ')}
              </Badge>
            </div>
          )}
          
          <Button 
            size="sm" 
            className="w-full mt-3"
            onClick={() => {
              toast.info(`Navigating to ${detailsPanel.node!.label}...`);
              setDetailsPanel({node: null, visible: false});
            }}
          >
            View Details
          </Button>
        </div>
      )}
      
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 bg-background"
                onClick={handleReset}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {parentHistory.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 bg-background"
                  onClick={handleBack}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn("h-8 w-8 bg-background", isZoomed && "border-primary")}
                onClick={handleZoomToggle}
              >
                {isZoomed ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isZoomed ? "Zoom Out" : "Zoom In"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 bg-background"
                onClick={() => {
                  toast.info("Click on nodes to expand/collapse categories and view details.");
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="absolute top-2 right-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn("h-8 w-8 bg-background", activeFilter && "border-primary")}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="end" alignOffset={-40}>
              <div className="flex flex-col gap-1 min-w-[150px]">
                <p className="text-xs font-medium mb-1">Filter by Type</p>
                {(['process', 'risk', 'control', 'incident', 'policy'] as NodeType[]).map((type) => (
                  <Badge 
                    key={type}
                    className={cn(
                      "cursor-pointer justify-start mb-1",
                      getBadgeStyle(type),
                      activeFilter === type ? "opacity-100" : "opacity-70"
                    )}
                    onClick={() => handleFilterByType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default KnowledgeGraph;

