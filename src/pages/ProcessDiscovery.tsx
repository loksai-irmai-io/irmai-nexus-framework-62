
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter, ChevronLeft } from 'lucide-react';
import { toast } from "sonner";
import ProcessMap from '@/components/process-discovery/ProcessMap';
import ProcessDetailView from '@/components/process-discovery/ProcessDetailView';
import { InsightItem, ProcessData } from '@/components/process-discovery/types';
import { ProcessInsights } from '@/components/process-discovery/ProcessInsights';
import { ProcessStatistics } from '@/components/process-discovery/ProcessStatistics';
import { EventLogs } from '@/components/process-discovery/EventLogs';
import ApiResponseDisplay from '@/components/process-discovery/ApiResponseDisplay';
import { processService, EventLogResponse } from '@/services/processService';
import ProcessDiscoveryHeader from '@/components/process-discovery/ProcessDiscoveryHeader';
import ProcessFilters from '@/components/process-discovery/ProcessFilters';
import ProcessViewSelector from '@/components/process-discovery/ProcessViewSelector';

// Mock data imports
import { insights, eventLogs, processData as initialProcessData } from '@/components/process-discovery/mockData';

const ProcessDiscovery = () => {
  const [viewType, setViewType] = useState('bpmn');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [detailView, setDetailView] = useState(false);
  const [showRawEvents, setShowRawEvents] = useState(false);
  const [filteredLogs, setFilteredLogs] = useState(eventLogs);
  const [timeframe, setTimeframe] = useState("all");
  const [caseVariant, setCaseVariant] = useState("all");
  const [orgUnit, setOrgUnit] = useState("all");
  const [apiResponse, setApiResponse] = useState<EventLogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProcessData, setCurrentProcessData] = useState<ProcessData>(initialProcessData);
  
  useEffect(() => {
    const handleProcessDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.processData) {
        setCurrentProcessData(customEvent.detail.processData);
      }
    };
    
    window.addEventListener('processDataUpdated', handleProcessDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('processDataUpdated', handleProcessDataUpdate as EventListener);
    };
  }, []);
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setDetailView(true);
    
    const node = currentProcessData.nodes.find(n => n.id === nodeId);
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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await processService.uploadEventLog(file);
        setApiResponse(response);
        
        if (response.status_code === 'success' && response.data) {
          setCurrentProcessData(response.data);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error('Failed to process the file');
        setApiResponse({
          status_code: 'failed',
          message: 'Failed to process the file'
        });
      } finally {
        setIsLoading(false);
      }
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
          <ProcessDiscoveryHeader 
            onFileChange={onFileChange}
            isLoading={isLoading}
            apiResponse={apiResponse}
          />

          {apiResponse && (
            <ApiResponseDisplay 
              response={apiResponse} 
              isLoading={isLoading} 
            />
          )}

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
                processData={currentProcessData}
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
                      <Badge 
                        variant={showRawEvents ? "outline" : "secondary"} 
                        className="cursor-pointer" 
                        onClick={() => setShowRawEvents(!showRawEvents)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {showRawEvents ? "Hide" : "View"} Raw Events
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleFilterChange}>
                        <Filter className="h-3 w-3 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </div>
                  
                  <ProcessFilters 
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    caseVariant={caseVariant}
                    setCaseVariant={setCaseVariant}
                    orgUnit={orgUnit}
                    setOrgUnit={setOrgUnit}
                  />
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
                        processData={currentProcessData} 
                        selectedNode={selectedNode} 
                        onNodeClick={handleNodeClick} 
                      />
                    </TabsContent>
                    
                    <TabsContent value="petri">
                      <ProcessViewSelector viewType="petri" />
                    </TabsContent>
                    
                    <TabsContent value="tree">
                      <ProcessViewSelector viewType="tree" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <EventLogs 
                logs={filteredLogs} 
                selectedNode={selectedNode} 
                processNodes={currentProcessData.nodes} 
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
