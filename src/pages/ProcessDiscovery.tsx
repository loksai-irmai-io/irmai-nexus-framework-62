
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner";
import { 
  FileUp, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Info, 
  CheckCheck, 
  XCircle, 
  FileText, 
  Upload,
  BarChart,
  Network,
  GitBranch,
  ChevronRight,
} from 'lucide-react';

// Sample process data
const processData = {
  nodes: [
    { id: 'start', type: 'event', label: 'Start', position: { x: 100, y: 150 }, compliant: true },
    { id: 'checkout', type: 'activity', label: 'Checkout Cart', position: { x: 250, y: 150 }, compliant: true },
    { id: 'gateway1', type: 'gateway', label: 'Payment Method?', position: { x: 400, y: 150 }, compliant: true },
    { id: 'credit', type: 'activity', label: 'Process Credit Card', position: { x: 550, y: 100 }, compliant: false },
    { id: 'bank', type: 'activity', label: 'Process Bank Transfer', position: { x: 550, y: 200 }, compliant: true },
    { id: 'gateway2', type: 'gateway', label: 'Payment Successful?', position: { x: 700, y: 150 }, compliant: true },
    { id: 'confirm', type: 'activity', label: 'Confirm Order', position: { x: 850, y: 150 }, compliant: true },
    { id: 'error', type: 'activity', label: 'Handle Payment Error', position: { x: 700, y: 250 }, compliant: false },
    { id: 'end', type: 'event', label: 'End', position: { x: 1000, y: 150 }, compliant: true },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'checkout' },
    { id: 'e2', source: 'checkout', target: 'gateway1' },
    { id: 'e3', source: 'gateway1', target: 'credit', label: 'Credit Card' },
    { id: 'e4', source: 'gateway1', target: 'bank', label: 'Bank Transfer' },
    { id: 'e5', source: 'credit', target: 'gateway2' },
    { id: 'e6', source: 'bank', target: 'gateway2' },
    { id: 'e7', source: 'gateway2', target: 'confirm', label: 'Yes' },
    { id: 'e8', source: 'gateway2', target: 'error', label: 'No' },
    { id: 'e9', source: 'confirm', target: 'end' },
    { id: 'e10', source: 'error', target: 'checkout', label: 'Retry' },
  ]
};

const insights = [
  {
    id: 1,
    type: 'anomaly',
    description: 'Credit Card processing takes 45% longer than average',
    status: 'pending',
    severity: 'high',
    nodeId: 'credit'
  },
  {
    id: 2,
    type: 'compliance',
    description: 'Required verification step skipped in 8% of Credit Card transactions',
    status: 'validated',
    severity: 'critical',
    nodeId: 'credit'
  },
  {
    id: 3,
    type: 'optimization',
    description: 'Bank Transfer has 30% fewer errors than Credit Card payments',
    status: 'pending',
    severity: 'medium',
    nodeId: 'bank'
  },
  {
    id: 4,
    type: 'anomaly',
    description: 'Unusual delay between Checkout and Payment Method selection',
    status: 'pending',
    severity: 'low',
    nodeId: 'checkout'
  },
  {
    id: 5,
    type: 'compliance',
    description: 'Error handling procedure not following compliance guidelines',
    status: 'pending',
    severity: 'high',
    nodeId: 'error'
  }
];

const eventLogs = [
  { id: 1, timestamp: '2025-02-15T09:14:22', activity: 'Checkout Cart', caseId: 'C-1001', user: 'john.doe', duration: '2m 15s' },
  { id: 2, timestamp: '2025-02-15T09:16:45', activity: 'Process Credit Card', caseId: 'C-1001', user: 'system', duration: '1m 53s' },
  { id: 3, timestamp: '2025-02-15T09:18:40', activity: 'Payment Error', caseId: 'C-1001', user: 'system', duration: '0m 2s' },
  { id: 4, timestamp: '2025-02-15T09:20:15', activity: 'Checkout Cart', caseId: 'C-1001', user: 'john.doe', duration: '1m 45s' },
  { id: 5, timestamp: '2025-02-15T09:22:05', activity: 'Process Bank Transfer', caseId: 'C-1001', user: 'john.doe', duration: '3m 10s' },
  { id: 6, timestamp: '2025-02-15T09:25:20', activity: 'Confirm Order', caseId: 'C-1001', user: 'system', duration: '0m 45s' },
  { id: 7, timestamp: '2025-02-15T10:30:10', activity: 'Checkout Cart', caseId: 'C-1002', user: 'jane.smith', duration: '1m 50s' },
  { id: 8, timestamp: '2025-02-15T10:32:05', activity: 'Process Credit Card', caseId: 'C-1002', user: 'system', duration: '4m 35s' },
  { id: 9, timestamp: '2025-02-15T10:36:45', activity: 'Confirm Order', caseId: 'C-1002', user: 'system', duration: '0m 30s' },
  { id: 10, timestamp: '2025-02-15T11:45:15', activity: 'Checkout Cart', caseId: 'C-1003', user: 'robert.jones', duration: '2m 5s' },
];

const ProcessDiscovery = () => {
  const [viewType, setViewType] = useState('bpmn');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showRawEvents, setShowRawEvents] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState(eventLogs);
  const [timeframe, setTimeframe] = useState("all");
  const [caseVariant, setCaseVariant] = useState("all");
  const [orgUnit, setOrgUnit] = useState("all");
  
  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    toast.info(`Selected node: ${nodeId}`);
    
    // Filter logs based on selected node
    const node = processData.nodes.find(n => n.id === nodeId);
    if (node) {
      const nodeLabel = node.label;
      const filtered = eventLogs.filter(log => log.activity.includes(nodeLabel));
      setFilteredLogs(filtered);
      setShowRawEvents(true);
    }
  };
  
  // Handle insight validation
  const handleValidateInsight = (insightId: number) => {
    toast.success("Insight validated successfully");
  };
  
  // Handle insight click (highlights corresponding node)
  const handleInsightClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    toast.info(`Highlighting node: ${nodeId}`);
  };
  
  // Handle filter change
  const handleFilterChange = () => {
    toast.info("Filters applied");
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    toast.success("Event log uploaded successfully");
  };
  
  // Simple BPMN diagram renderer
  const renderBPMN = () => (
    <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
      <svg width="1100" height="300" className="mx-auto">
        {/* Render edges first so they appear behind nodes */}
        {processData.edges.map(edge => {
          const source = processData.nodes.find(n => n.id === edge.source);
          const target = processData.nodes.find(n => n.id === edge.target);
          
          if (source && target) {
            // Simple straight line for demo (in a real app, would use path with bezier curves)
            return (
              <g key={edge.id} className={`edge ${selectedNode && (selectedNode === edge.source || selectedNode === edge.target) ? 'selected' : ''}`}>
                <line 
                  x1={source.position.x + 50} 
                  y1={source.position.y} 
                  x2={target.position.x - 50} 
                  y2={target.position.y}
                  className="stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px]" 
                />
                {edge.label && (
                  <text 
                    x={(source.position.x + target.position.x) / 2} 
                    y={(source.position.y + target.position.y) / 2 - 10}
                    className="text-xs fill-muted-foreground text-center"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          }
          return null;
        })}
        
        {/* Render nodes */}
        {processData.nodes.map(node => {
          // Different shape based on node type
          let shape;
          
          if (node.type === 'event') {
            // Circle for events
            shape = (
              <circle 
                cx={node.position.x} 
                cy={node.position.y} 
                r="30" 
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
              />
            );
          } else if (node.type === 'gateway') {
            // Diamond for gateways
            shape = (
              <polygon 
                points={`${node.position.x},${node.position.y-30} ${node.position.x+30},${node.position.y} ${node.position.x},${node.position.y+30} ${node.position.x-30},${node.position.y}`}
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
              />
            );
          } else {
            // Rectangle for activities
            shape = (
              <rect 
                x={node.position.x - 50} 
                y={node.position.y - 25} 
                width="100" 
                height="50" 
                rx="5"
                className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} ${selectedNode === node.id ? 'stroke-[3px] fill-blue-100 dark:fill-blue-900' : 'stroke-[1.5px] fill-white dark:fill-gray-800'}`}
              />
            );
          }
          
          return (
            <g 
              key={node.id} 
              className={`node ${selectedNode === node.id ? 'selected' : ''}`}
              onClick={() => handleNodeClick(node.id)}
              style={{ cursor: 'pointer' }}
            >
              {shape}
              <text 
                x={node.position.x} 
                y={node.position.y} 
                textAnchor="middle" 
                dominantBaseline="middle"
                className="text-xs font-medium fill-foreground"
              >
                {node.label}
              </text>
              {!node.compliant && (
                <circle 
                  cx={node.position.x + 40} 
                  cy={node.position.y - 20} 
                  r="8" 
                  className="fill-red-500"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Annotation for interactivity */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 p-2 rounded-md">
        [Interactive] Click on any process node to see detailed information
      </div>
    </div>
  );
  
  // Simpler Petri Net view 
  const renderPetriNet = () => (
    <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Petri Net View</h3>
          <p className="text-muted-foreground max-w-md">
            This view shows the process as a Petri net, with places (states) and transitions (activities).
            It's useful for analyzing concurrency and synchronization in processes.
          </p>
        </div>
      </div>
    </div>
  );
  
  // Simpler Process Tree view
  const renderProcessTree = () => (
    <div className="relative w-full h-[500px] border border-muted rounded-md p-4 overflow-auto bg-muted/20">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <GitBranch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Process Tree View</h3>
          <p className="text-muted-foreground max-w-md">
            This hierarchical view represents the process as a tree, showing sequential, parallel, and choice constructs.
            It's useful for understanding the hierarchical structure of the process.
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Process Discovery</h1>
              <p className="text-muted-foreground">
                Visualize your end-to-end processes with AI insights
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Event Log
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload your event log to start process mining</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Process Map (Full View) */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Process Map</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={showRawEvents ? "outline" : "secondary"} className="cursor-pointer" onClick={() => setShowRawEvents(!showRawEvents)}>
                    <FileText className="h-3 w-3 mr-1" />
                    {showRawEvents ? "Hide" : "View"} Raw Events
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleFilterChange}>
                          <Filter className="h-3 w-3 mr-1" />
                          Filter
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter processes by various criteria</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* Filter row that appears when filter button is clicked */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={caseVariant} onValueChange={setCaseVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Variants</SelectItem>
                    <SelectItem value="standard">Standard Flow</SelectItem>
                    <SelectItem value="credit">Credit Card Only</SelectItem>
                    <SelectItem value="bank">Bank Transfer Only</SelectItem>
                    <SelectItem value="error">With Errors</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={orgUnit} onValueChange={setOrgUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select org unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="customer">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Tabs defaultValue="bpmn" value={viewType} onValueChange={setViewType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="bpmn">BPMN Diagram</TabsTrigger>
                  <TabsTrigger value="petri">Petri Net</TabsTrigger>
                  <TabsTrigger value="tree">Process Tree</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bpmn">
                  {renderBPMN()}
                </TabsContent>
                
                <TabsContent value="petri">
                  {renderPetriNet()}
                </TabsContent>
                
                <TabsContent value="tree">
                  {renderProcessTree()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Raw Events Panel (conditionally displayed) */}
          {showRawEvents && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Raw Event Logs</CardTitle>
                  <Badge variant="outline">{filteredLogs.length} events</Badge>
                </div>
                {selectedNode && (
                  <CardDescription>
                    Showing events for: {processData.nodes.find(n => n.id === selectedNode)?.label}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-auto rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Case ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium">{log.activity}</td>
                          <td className="px-4 py-2 text-sm">{log.caseId}</td>
                          <td className="px-4 py-2 text-sm">{log.user}</td>
                          <td className="px-4 py-2 text-sm">{log.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Level 2: Process Insights and Process Statistics (side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Process Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Process Insights</CardTitle>
                <CardDescription>AI-detected anomalies, optimization opportunities and compliance issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <div 
                      key={insight.id} 
                      className={`p-3 rounded-lg border ${
                        insight.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                        insight.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                        insight.severity === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                        'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div 
                          className="flex-1 cursor-pointer" 
                          onClick={() => handleInsightClick(insight.nodeId)}
                        >
                          <div className="flex items-center mb-1">
                            {insight.type === 'anomaly' && <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />}
                            {insight.type === 'compliance' && <Info className="h-4 w-4 text-blue-500 mr-1" />}
                            {insight.type === 'optimization' && <Activity className="h-4 w-4 text-green-500 mr-1" />}
                            <span className="text-sm font-medium capitalize">{insight.type}</span>
                            <Badge 
                              variant="outline" 
                              className="ml-2 text-xs"
                            >
                              {insight.severity}
                            </Badge>
                          </div>
                          <p className="text-sm">{insight.description}</p>
                        </div>
                        
                        <div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => handleValidateInsight(insight.id)}
                                >
                                  {insight.status === 'validated' ? (
                                    <CheckCheck className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>
                                  {insight.status === 'validated' 
                                    ? 'This insight has been validated' 
                                    : 'Click to validate this AI-generated insight'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Compliance Summary</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Compliance</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        <span>Compliant steps</span>
                      </div>
                      <span>7</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span>Non-compliant steps</span>
                      </div>
                      <span>2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Process Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Process Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Activities</span>
                    </div>
                    <span className="font-medium">6</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <GitBranch className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Decision Points</span>
                    </div>
                    <span className="font-medium">2</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Avg. Process Duration</span>
                    </div>
                    <span className="font-medium">8m 20s</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Cases Analyzed</span>
                    </div>
                    <span className="font-medium">1,253</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm">Variant Coverage</span>
                    </div>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProcessDiscovery;
