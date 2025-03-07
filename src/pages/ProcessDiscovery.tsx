
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, Filter, List, Check, AlertTriangle, Star } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Sample process data for visualization
const processInsights = [
  {
    id: 'insight-1',
    type: 'warning',
    text: 'Unusual delay after "Review Invoice" – 20% longer than average',
    validated: false,
    nodeId: 'review-invoice'
  },
  {
    id: 'insight-2',
    type: 'compliance',
    text: 'Potential compliance violation: "Approve Payment" skips "Verify Vendor"',
    validated: false,
    nodeId: 'approve-payment'
  },
  {
    id: 'insight-3',
    type: 'anomaly',
    text: 'Process path from "Create PO" to "Goods Receipt" used only in 5% of cases',
    validated: true,
    nodeId: 'create-po'
  },
  {
    id: 'insight-4',
    type: 'warning',
    text: 'Bottleneck detected at "Finance Review" - average wait time of 48 hours',
    validated: false,
    nodeId: 'finance-review'
  },
  {
    id: 'insight-5',
    type: 'anomaly',
    text: 'Unusual process variant: 12% of cases skip "Quality Check"',
    validated: false,
    nodeId: 'quality-check'
  }
];

const ProcessDiscovery = () => {
  const [activeTab, setActiveTab] = useState('bpmn');
  const [insights, setInsights] = useState(processInsights);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [showRawEvents, setShowRawEvents] = useState(false);

  // Handle insight validation
  const handleValidateInsight = (id: string) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, validated: true } : insight
    ));
  };

  // Handle insight click - highlight corresponding node
  const handleInsightClick = (nodeId: string) => {
    setHighlightedNode(nodeId);
    console.log(`Highlighting node: ${nodeId}`);
    // In a real implementation, this would scroll/zoom to the node in the visualization
  };

  // Toggle raw events view
  const toggleRawEvents = () => {
    setShowRawEvents(!showRawEvents);
  };

  // Render icon based on insight type
  const renderInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'compliance':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'anomaly':
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="container px-6 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 border-b pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Process Discovery</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Visualize your end-to-end processes with AI insights
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Event Log
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload your event log to start process mining</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content Area - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Process Visualization Panel - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="bpmn">BPMN</TabsTrigger>
                  <TabsTrigger value="petri">Petri Net</TabsTrigger>
                  <TabsTrigger value="tree">Process Tree</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter processes by timeframe, variant, or department</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={toggleRawEvents}
                      >
                        <List className="h-4 w-4" />
                        View Raw Events
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View underlying event log entries</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Process Visualization Content */}
            <TabsContent value="bpmn" className="mt-0">
              <div className="bg-gray-50 dark:bg-gray-900 border border-dashed rounded-md p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">BPMN Process Visualization</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    [Interactive] Clicking a process node opens a detailed view with raw log data and feedback options.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="petri" className="mt-0">
              <div className="bg-gray-50 dark:bg-gray-900 border border-dashed rounded-md p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Petri Net Process Visualization</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    [Interactive] Clicking a process node opens a detailed view with raw log data and feedback options.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tree" className="mt-0">
              <div className="bg-gray-50 dark:bg-gray-900 border border-dashed rounded-md p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Process Tree Visualization</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    [Interactive] Clicking a process node opens a detailed view with raw log data and feedback options.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Raw Events Modal/Section - Conditionally rendered */}
            {showRawEvents && (
              <div className="mt-4 bg-white dark:bg-gray-800 border rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Raw Event Log Entries</h3>
                  <Button variant="ghost" size="sm" onClick={toggleRawEvents}>Close</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Case ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {[1, 2, 3, 4, 5].map((row) => (
                        <tr key={row} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">PO-{1000 + row}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Create Purchase Order</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">2023-06-{10 + row} 09:15:22</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">John Smith</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* AI Insights Sidebar - Takes 1/3 of the width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border">
              <h2 className="text-lg font-medium mb-4 border-b pb-2">Process Insights</h2>
              
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div 
                    key={insight.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      highlightedNode === insight.nodeId 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleInsightClick(insight.nodeId)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {renderInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">{insight.text}</p>
                        <div className="flex justify-between items-center">
                          {insight.validated ? (
                            <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                              <Check className="h-3 w-3 mr-1" /> Validated
                            </span>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleValidateInsight(insight.id);
                                    }}
                                  >
                                    Validate
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Confirm this insight if accurate, or provide feedback to adjust</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Click to highlight
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProcessDiscovery;
