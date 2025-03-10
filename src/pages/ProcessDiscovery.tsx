import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
} from 'lucide-react';
import ProcessMap from '@/components/process-discovery/ProcessMap';
import ProcessDetailView from '@/components/process-discovery/ProcessDetailView';
import { InsightItem } from '@/components/process-discovery/types';
import { ProcessInsights } from '@/components/process-discovery/ProcessInsights';
import { ProcessStatistics } from '@/components/process-discovery/ProcessStatistics';
import { EventLogs } from '@/components/process-discovery/EventLogs';
import { handleFileUpload } from '@/components/layout/Header';

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

const insights: InsightItem[] = [
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
  const [detailView, setDetailView] = useState(false);
  const [showRawEvents, setShowRawEvents] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState(eventLogs);
  const [timeframe, setTimeframe] = useState("all");
  const [caseVariant, setCaseVariant] = useState("all");
  const [orgUnit, setOrgUnit] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setDetailView(true);
    
    const node = processData.nodes.find(n => n.id === nodeId);
    if (node) {
      const nodeLabel = node.label;
      const filtered = eventLogs.filter(log => log.activity.includes(nodeLabel));
      setFilteredLogs(filtered);
    }
  };
  
  const handleValidateInsight = (insightId: number) => {
    toast.success("Insight validated successfully");
  };
  
  const handleInsightClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    toast.info(`Highlighting node: ${nodeId}`);
  };
  
  const handleFilterChange = () => {
    toast.info("Filters applied");
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBackToMap = () => {
    setDetailView(false);
    setSelectedNode(null);
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Process Discovery</h1>
              <p className="text-muted-foreground">
                Visualize your end-to-end processes with AI insights
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.xes,.xml,text/csv,application/xml,text/xml,text/plain"
              onChange={onFileChange}
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={triggerFileUpload}>
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

          {detailView ? (
            <>
              <div className="flex items-center mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToMap}
                  className="flex items-center text-sm font-medium text-muted-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Process Map
                </Button>
              </div>

              <ProcessDetailView 
                nodeId={selectedNode || ''} 
                processData={processData}
                insights={insights.filter(i => i.nodeId === selectedNode)}
                eventLogs={filteredLogs}
              />
            </>
          ) : (
            <>
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
                      <ProcessMap 
                        processData={processData} 
                        selectedNode={selectedNode} 
                        onNodeClick={handleNodeClick} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="petri">
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
                    </TabsContent>
                    
                    <TabsContent value="tree">
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <EventLogs 
                logs={filteredLogs} 
                selectedNode={selectedNode} 
                processNodes={processData.nodes} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProcessInsights 
                  insights={insights} 
                  onInsightClick={handleInsightClick} 
                  onValidateInsight={handleValidateInsight} 
                />
                
                <ProcessStatistics />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProcessDiscovery;
