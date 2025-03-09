
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskOverview from './RiskOverview';
import ScenarioModeling from './ScenarioModeling';
import RiskHeatmap from './RiskHeatmap';
import RiskAlerts from './RiskAlerts';
import RiskDetailView from './RiskDetailView';
import DashboardSettings from './DashboardSettings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal, 
  Download, 
  BarChart, 
  Gauge, 
  ListFilter, 
  BrainCircuit, 
  UserCircle, 
  MapPin,
  Calendar,
  LayoutGrid,
  LayoutList,
  RotateCcw
} from 'lucide-react';
import useDraggableLayout from '@/hooks/useDraggableLayout';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const PredictiveRiskDashboard = () => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedRole, setSelectedRole] = useState<string>('riskmgr');
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [isCustomLayoutMode, setIsCustomLayoutMode] = useState<boolean>(false);
  
  // Define default layouts for overview section
  const defaultLayout = [
    { i: 'top-risks', x: 0, y: 0, w: 12, h: 2 },
    { i: 'risk-metrics', x: 0, y: 2, w: 6, h: 4 },
    { i: 'risk-trends', x: 6, y: 2, w: 6, h: 4 },
    { i: 'recommendations', x: 0, y: 6, w: 12, h: 3 },
  ];
  
  // Use the custom draggable layout hook
  const { 
    layout, 
    onLayoutChange, 
    resetLayout,
    cols 
  } = useDraggableLayout('risk-dashboard-layout', defaultLayout);
  
  const handleDrilldown = (riskId: string) => {
    setSelectedRisk(riskId);
    setActiveView('detail');
  };
  
  const handleBackToOverview = () => {
    setSelectedRisk(null);
    setActiveView('overview');
  };
  
  const roleLabels = {
    'exec': 'Executive View',
    'riskmgr': 'Risk Manager View',
    'process': 'Process Owner View',
    'analyst': 'Risk Analyst View'
  };
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Predictive Risk Analytics</h1>
          <p className="text-muted-foreground">Advanced risk insights and scenario modeling</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exec">Executive View</SelectItem>
                <SelectItem value="riskmgr">Risk Manager View</SelectItem>
                <SelectItem value="process">Process Owner View</SelectItem>
                <SelectItem value="analyst">Risk Analyst View</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search risks..." 
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsCustomLayoutMode(!isCustomLayoutMode)}
              className={isCustomLayoutMode ? "bg-blue-100 dark:bg-blue-900/50" : ""}
            >
              {isCustomLayoutMode ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            {isCustomLayoutMode && (
              <Button 
                variant="outline" 
                size="icon" 
                title="Reset layout"
                onClick={resetLayout}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last 30 Days</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-1">
        <Tabs 
          value={activeView} 
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="scenario" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden md:inline">Scenario Modeling</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Risk Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden md:inline">Alerts & Guidance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <Card className="mt-2 border-0 shadow-none">
            <CardContent className="p-0">
              {selectedRisk && activeView === 'detail' ? (
                <RiskDetailView riskId={selectedRisk} onBack={handleBackToOverview} />
              ) : (
                <>
                  <TabsContent value="overview" className="m-0">
                    {isCustomLayoutMode ? (
                      <div className="p-4">
                        <ReactGridLayout
                          className="layout"
                          layout={layout}
                          cols={cols}
                          rowHeight={100}
                          width={1200}
                          isDraggable={true}
                          isResizable={false}
                          onLayoutChange={onLayoutChange}
                          draggableHandle=".drag-handle"
                        >
                          <div key="top-risks" className="border rounded-lg p-4 overflow-hidden">
                            <div className="drag-handle cursor-move mb-2 flex items-center justify-between bg-muted/30 rounded p-1.5">
                              <h3 className="text-sm font-medium">Top Risks</h3>
                              <div className="h-1.5 w-10 bg-muted rounded-full"></div>
                            </div>
                            <div className="overflow-y-auto" style={{height: 'calc(100% - 40px)'}}>
                              <RiskOverview selectedRole={selectedRole} onDrilldown={handleDrilldown} />
                            </div>
                          </div>
                        </ReactGridLayout>
                        <div className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 p-3 rounded-lg mt-4 text-sm">
                          <p>Customization mode enabled. Drag widgets by their headers to rearrange them. Click the layout button again to exit this mode.</p>
                        </div>
                      </div>
                    ) : (
                      <RiskOverview selectedRole={selectedRole} onDrilldown={handleDrilldown} />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="scenario" className="m-0">
                    <ScenarioModeling selectedRole={selectedRole} />
                  </TabsContent>
                  
                  <TabsContent value="heatmap" className="m-0">
                    <RiskHeatmap selectedRole={selectedRole} onDrilldown={handleDrilldown} />
                  </TabsContent>
                  
                  <TabsContent value="alerts" className="m-0">
                    <RiskAlerts selectedRole={selectedRole} onDrilldown={handleDrilldown} />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="m-0">
                    <DashboardSettings selectedRole={selectedRole} />
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        Data last updated: {new Date().toLocaleDateString()} | <span className="text-blue-500">Refresh data</span>
      </div>
    </div>
  );
};

export default PredictiveRiskDashboard;
