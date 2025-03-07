
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  Check, 
  Eye, 
  Filter, 
  UploadCloud, 
  Workflow,
  Activity,
  FileText,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data for the process visualization
const mockInsights = [
  { 
    id: 1, 
    text: 'Unusual delay after "Review Invoice" – 20% longer than average', 
    severity: 'warning',
    validated: false 
  },
  { 
    id: 2, 
    text: 'Potential compliance violation: "Process Payment" sometimes skips "Manager Approval"', 
    severity: 'error',
    validated: false 
  },
  { 
    id: 3, 
    text: '30% of cases bypass "Document Verification" after initial rejection', 
    severity: 'warning',
    validated: true 
  },
  { 
    id: 4, 
    text: 'Process bottleneck identified in "Compliance Check" - avg waiting time 3.5 days', 
    severity: 'info',
    validated: false 
  },
  { 
    id: 5, 
    text: 'Duplicate processing detected in "Data Entry" and "Update Records" steps', 
    severity: 'warning',
    validated: false 
  },
];

const mockEventLogs = [
  { id: 1, timestamp: '2023-06-15 09:13:22', activity: 'Receive Invoice', caseid: 'INV-2023-12345', performer: 'System', duration: '0 mins' },
  { id: 2, timestamp: '2023-06-15 09:14:05', activity: 'Extract Data', caseid: 'INV-2023-12345', performer: 'AI Bot', duration: '1 min' },
  { id: 3, timestamp: '2023-06-15 09:20:18', activity: 'Validate Invoice', caseid: 'INV-2023-12345', performer: 'John Smith', duration: '6 mins' },
  { id: 4, timestamp: '2023-06-15 09:45:33', activity: 'Approval Request', caseid: 'INV-2023-12345', performer: 'System', duration: '0 mins' },
  { id: 5, timestamp: '2023-06-15 11:30:45', activity: 'Manager Approval', caseid: 'INV-2023-12345', performer: 'Sarah Johnson', duration: '105 mins' },
  { id: 6, timestamp: '2023-06-15 13:10:12', activity: 'Process Payment', caseid: 'INV-2023-12345', performer: 'Finance System', duration: '10 mins' },
  { id: 7, timestamp: '2023-06-15 13:15:27', activity: 'Send Confirmation', caseid: 'INV-2023-12345', performer: 'System', duration: '0 mins' },
  { id: 8, timestamp: '2023-06-15 13:15:28', activity: 'Archive Invoice', caseid: 'INV-2023-12345', performer: 'System', duration: '0 mins' },
];

const ProcessDiscovery: React.FC = () => {
  const [activeNotation, setActiveNotation] = useState('bpmn');
  const [timeframe, setTimeframe] = useState('all');
  const [department, setDepartment] = useState('all');
  const [showEvents, setShowEvents] = useState(false);
  const [insights, setInsights] = useState(mockInsights);

  const handleValidateInsight = (id: number) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, validated: !insight.validated } : insight
    ));
  };

  const getSeverityIcon = (severity: string, validated: boolean) => {
    if (validated) return <Check className="w-5 h-5 text-green-500" />;
    
    switch(severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Process Discovery</h1>
          <p className="text-muted-foreground">
            Visualize your end-to-end processes with AI insights.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Process Visualization */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle>Process Map</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline">
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Upload Event Log
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload your event log to start process mining</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex justify-between items-center">
                  <Tabs value={activeNotation} onValueChange={setActiveNotation}>
                    <TabsList>
                      <TabsTrigger value="bpmn">
                        <Workflow className="h-4 w-4 mr-2" />
                        BPMN
                      </TabsTrigger>
                      <TabsTrigger value="petri">
                        <Activity className="h-4 w-4 mr-2" />
                        Petri Net
                      </TabsTrigger>
                      <TabsTrigger value="tree">
                        <FileText className="h-4 w-4 mr-2" />
                        Process Tree
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="flex space-x-2">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="last-week">Last week</SelectItem>
                          <SelectItem value="last-month">Last month</SelectItem>
                          <SelectItem value="last-quarter">Last quarter</SelectItem>
                          <SelectItem value="last-year">Last year</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All departments</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More filter options</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="bpmn" className="m-0">
                  <div className="bg-muted/30 border rounded-md flex items-center justify-center p-4 h-[500px] relative">
                    <div className="text-center max-w-lg">
                      <img
                        src="/placeholder.svg"
                        alt="BPMN Diagram"
                        className="mx-auto w-full max-w-[400px] opacity-75"
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        [Interactive] This area displays the BPMN diagram generated from your event logs. 
                        Hover over nodes to see details and click to drill down.
                      </p>
                    </div>

                    {/* Process nodes would be mapped here in a real implementation */}
                    <div className="absolute left-1/4 top-1/3 bg-green-100 border border-green-500 rounded-md p-2 hover:shadow-md hover:bg-green-50 cursor-pointer transition-all">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center text-sm">
                            <Activity className="h-4 w-4 mr-2 text-green-600" />
                            <span>Approve Payment</span>
                          </TooltipTrigger>
                          <TooltipContent className="w-72">
                            <div className="space-y-2">
                              <p className="font-medium">Task: Approve Payment</p>
                              <div className="grid grid-cols-2 gap-x-4 text-xs">
                                <div>Frequency:</div>
                                <div>120 occurrences</div>
                                <div>Avg Duration:</div>
                                <div>3 mins</div>
                                <div>Compliance:</div>
                                <div className="text-green-600 font-medium">✓ Compliant</div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="absolute right-1/4 top-1/2 bg-red-100 border border-red-500 rounded-md p-2 hover:shadow-md hover:bg-red-50 cursor-pointer transition-all">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center text-sm">
                            <Activity className="h-4 w-4 mr-2 text-red-600" />
                            <span>Process Payment</span>
                          </TooltipTrigger>
                          <TooltipContent className="w-72">
                            <div className="space-y-2">
                              <p className="font-medium">Task: Process Payment</p>
                              <div className="grid grid-cols-2 gap-x-4 text-xs">
                                <div>Frequency:</div>
                                <div>85 occurrences</div>
                                <div>Avg Duration:</div>
                                <div>12 mins</div>
                                <div>Compliance:</div>
                                <div className="text-red-600 font-medium">✗ Non-compliant</div>
                                <div className="col-span-2 pt-1 text-red-600">
                                  Issue: Approval step sometimes skipped
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Dialog open={showEvents} onOpenChange={setShowEvents}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Raw Events
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Raw Event Log Data</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="border px-4 py-2 text-left">Timestamp</th>
                                <th className="border px-4 py-2 text-left">Activity</th>
                                <th className="border px-4 py-2 text-left">Case ID</th>
                                <th className="border px-4 py-2 text-left">Performer</th>
                                <th className="border px-4 py-2 text-left">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockEventLogs.map(log => (
                                <tr key={log.id} className="hover:bg-muted/30">
                                  <td className="border px-4 py-2">{log.timestamp}</td>
                                  <td className="border px-4 py-2">{log.activity}</td>
                                  <td className="border px-4 py-2">{log.caseid}</td>
                                  <td className="border px-4 py-2">{log.performer}</td>
                                  <td className="border px-4 py-2">{log.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Data source: SAP ERP Event Logs (Last updated: Today, 10:45 AM)
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="petri" className="m-0">
                  <div className="bg-muted/30 border rounded-md flex items-center justify-center p-4 h-[500px]">
                    <div className="text-center max-w-lg">
                      <img
                        src="/placeholder.svg"
                        alt="Petri Net Diagram"
                        className="mx-auto w-full max-w-[400px] opacity-75"
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        [Interactive] This area displays the Petri Net representation of your process.
                        This notation is useful for formal verification of process properties.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tree" className="m-0">
                  <div className="bg-muted/30 border rounded-md flex items-center justify-center p-4 h-[500px]">
                    <div className="text-center max-w-lg">
                      <img
                        src="/placeholder.svg"
                        alt="Process Tree Diagram"
                        className="mx-auto w-full max-w-[400px] opacity-75"
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        [Interactive] This area displays the Process Tree view, showing the hierarchical
                        structure of your process with operators like sequence, choice, and parallel execution.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Panel - AI Insights */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Process Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-260px)]">
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={`p-3 rounded-md border hover:bg-muted/30 cursor-pointer transition-all ${
                          insight.severity === 'error' ? 'border-red-200 bg-red-50/30' : 
                          insight.severity === 'warning' ? 'border-yellow-200 bg-yellow-50/30' : 
                          'border-blue-200 bg-blue-50/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getSeverityIcon(insight.severity, insight.validated)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{insight.text}</p>
                            <div className="flex justify-end mt-2">
                              <Button 
                                variant={insight.validated ? "outline" : "secondary"} 
                                size="sm"
                                className="text-xs"
                                onClick={() => handleValidateInsight(insight.id)}
                              >
                                {insight.validated ? 'Validated ✓' : 'Validate'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Separator className="my-6" />
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        All insights have been analyzed based on the selected process data.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <span>Generate More Insights</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProcessDiscovery;
