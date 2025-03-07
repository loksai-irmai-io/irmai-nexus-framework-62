
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutlierTimeline from './OutlierTimeline';
import OutlierHeatmap from './OutlierHeatmap';
import OutlierFilters from './OutlierFilters';
import OutlierAIInsights from './OutlierAIInsights';
import OutlierAlertCenter from './OutlierAlertCenter';
import OutlierList from './OutlierList';
import OutlierDetailView from './OutlierDetailView';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import OutlierSettings from './OutlierSettings';
import { useToast } from '@/hooks/use-toast';
import { OutlierCategory, OutlierSeverity, OutlierTimeframe, OutlierType } from './types';

const OutlierDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'detail'>('overview');
  const [selectedOutlierId, setSelectedOutlierId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as OutlierCategory[],
    severities: [] as OutlierSeverity[],
    timeframe: 'week' as OutlierTimeframe,
    types: [] as OutlierType[]
  });
  const { toast } = useToast();

  // Handle drill-down to list view
  const handleDrillDown = (categoryId: string, count: number) => {
    // This would typically fetch outliers for this category
    toast({
      title: "Loading outliers",
      description: `Loading ${count} outliers for category: ${categoryId}`,
    });
    // For demo purposes, we'll just go to the list view
    setActiveView('detail');
  };

  // Handle selection of a specific outlier
  const handleSelectOutlier = (id: number) => {
    setSelectedOutlierId(id);
  };

  // Handle returning to overview
  const handleBackToOverview = () => {
    setActiveView('overview');
    setSelectedOutlierId(null);
  };

  // Update filters from filter component
  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // For demo purposes, indicate filters are applied
    toast({
      title: "Filters applied",
      description: "Outlier data has been updated based on your filters",
    });
  };

  return (
    <div className="space-y-6">
      {activeView === 'overview' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <OutlierFilters 
                filters={filters} 
                onFiltersChange={handleFiltersChange} 
              />
            </div>
            <div className="col-span-1 flex justify-end items-start">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
                <span>Anomaly Settings</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                  <TabsTrigger value="heatmap">Process Heatmap</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="mt-4">
                  <OutlierTimeline onDrillDown={handleDrillDown} timeframe={filters.timeframe} />
                </TabsContent>
                <TabsContent value="heatmap" className="mt-4">
                  <OutlierHeatmap onDrillDown={handleDrillDown} />
                </TabsContent>
              </Tabs>
              
              <OutlierAlertCenter onSelectOutlier={handleSelectOutlier} />
            </div>
            
            <div className="col-span-1">
              <OutlierAIInsights />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {selectedOutlierId === null ? (
            <>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleBackToOverview}>
                  Back to Overview
                </Button>
                <OutlierFilters 
                  isCompact 
                  filters={filters} 
                  onFiltersChange={handleFiltersChange} 
                />
              </div>
              <OutlierList onSelectOutlier={handleSelectOutlier} />
            </>
          ) : (
            <OutlierDetailView 
              outlierId={selectedOutlierId} 
              onBack={() => setSelectedOutlierId(null)} 
            />
          )}
        </div>
      )}
      
      <OutlierSettings 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
};

export default OutlierDashboard;
