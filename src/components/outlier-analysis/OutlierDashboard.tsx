
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
import { Bot, HelpCircle, MessageCircle, Settings } from 'lucide-react';
import OutlierSettings from './OutlierSettings';
import { useToast } from '@/hooks/use-toast';
import { OutlierCategory, OutlierSeverity, OutlierTimeframe, OutlierType } from './types';
import OutlierMetricsPanel from './OutlierMetricsPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const OutlierDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'detail'>('overview');
  const [selectedOutlierId, setSelectedOutlierId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
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

  // Handle AI question submission
  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;
    
    toast({
      title: "Question submitted",
      description: "The AI is analyzing your question about outlier patterns",
    });
    
    // This would typically send the question to an AI service
    // For demo purposes, we'll just clear the input
    setTimeout(() => {
      toast({
        title: "AI Analysis Complete",
        description: "Analysis found that approval delays are concentrated in the North region and occur primarily on Mondays and Fridays.",
      });
      setAiQuestion('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {activeView === 'overview' ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start mb-2">
            <OutlierFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange} 
            />
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Ask AI</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Ask About Outlier Patterns
                    </DialogTitle>
                    <DialogDescription>
                      Ask questions about patterns, trends, or specific anomalies to get AI-powered insights.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Example: 'Why are there delays in the approval process?' or 'What's causing the sequence violations in customer onboarding?'"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAskAI} className="gap-2">
                      <Bot className="h-4 w-4" />
                      Get AI Insights
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
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

          <OutlierMetricsPanel onCategoryClick={handleDrillDown} />

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
                <Button variant="outline" onClick={handleBackToOverview} className="gap-1">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
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
