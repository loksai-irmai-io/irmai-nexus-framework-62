
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Filter, Send, HelpCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import OutlierMetricsPanel from './OutlierMetricsPanel';
import OutlierTimeline from './OutlierTimeline';
import OutlierHeatmap from './OutlierHeatmap';
import OutlierDistribution from './OutlierDistribution';
import { OutlierEvent } from './types';
import { mockOutlierEvents, mockAIInsights } from './mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutlierDashboardProps {
  onSelectOutlier: (outlier: OutlierEvent) => void;
}

const OutlierDashboard: React.FC<OutlierDashboardProps> = ({ onSelectOutlier }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(mockAIInsights.text);
  const [aiRecommendations, setAiRecommendations] = useState(mockAIInsights.recommendations);
  const [timeframe, setTimeframe] = useState('week');
  const [filtering, setFiltering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskAI = () => {
    if (!aiQuery.trim()) return;
    
    // Simulate AI response with loading state
    setIsTyping(true);
    
    setTimeout(() => {
      setAiResponse(`Analysis of your query "${aiQuery}": ${mockAIInsights.text}`);
      setAiRecommendations([
        'Consider reviewing the approval workflow for efficiency',
        'Investigate the resource allocation during peak hours',
        'Analyze the sequence pattern for potential optimization'
      ]);
      setAiQuery('');
      setIsTyping(false);
    }, 1000);
  };

  const handleCategoryClick = (category: string) => {
    console.log(`Category clicked: ${category}`);
    // Filter the outliers based on the category
    const filteredOutliers = mockOutlierEvents.filter(
      outlier => category === 'all' || outlier.category === category
    );
    
    // Navigate to the appropriate section or update the UI
    setActiveTab('overview');
    
    // Show a toast or notification about the filtered results
    console.log(`Showing ${filteredOutliers.length} ${category} outliers`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Outlier Analysis</h1>
        <p className="text-muted-foreground">Identify process anomalies and violations.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={timeframe === 'day' ? 'bg-primary/10' : ''}
            onClick={() => setTimeframe('day')}
          >
            Last 24h
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeframe === 'week' ? 'bg-primary/10' : ''}
            onClick={() => setTimeframe('week')}
          >
            Last Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeframe === 'month' ? 'bg-primary/10' : ''}
            onClick={() => setTimeframe('month')}
          >
            Last Month
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setFiltering(!filtering)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {filtering && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
          <div>
            <h3 className="font-medium mb-2">Severity</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="critical" className="mr-2" defaultChecked />
                <label htmlFor="critical">Critical</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="high" className="mr-2" defaultChecked />
                <label htmlFor="high">High</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="medium" className="mr-2" defaultChecked />
                <label htmlFor="medium">Medium</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="low" className="mr-2" defaultChecked />
                <label htmlFor="low">Low</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="sequence" className="mr-2" defaultChecked />
                <label htmlFor="sequence">Sequence Violations</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="time" className="mr-2" defaultChecked />
                <label htmlFor="time">Time-based Outliers</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="resource" className="mr-2" defaultChecked />
                <label htmlFor="resource">Resource Imbalances</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="other" className="mr-2" defaultChecked />
                <label htmlFor="other">Other Anomalies</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="new" className="mr-2" defaultChecked />
                <label htmlFor="new">New</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="confirmed" className="mr-2" defaultChecked />
                <label htmlFor="confirmed">Confirmed</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="dismissed" className="mr-2" defaultChecked />
                <label htmlFor="dismissed">Dismissed</label>
              </div>
            </div>
          </div>
        </div>
      )}

      <OutlierMetricsPanel onCardClick={handleCategoryClick} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Distribution</TabsTrigger>
          <TabsTrigger value="resource">Resource Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OutlierTimeline />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OutlierHeatmap />
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-blue-500" />
                    AI Insights
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Type a query to receive AI insights on outlier patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-md text-sm">
                    <div className="font-medium mb-2">Analysis:</div>
                    <p>{aiResponse}</p>
                    
                    {aiRecommendations.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium mb-1">Recommendations:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiRecommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {isTyping && (
                      <div className="mt-2 flex space-x-1 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="w-2 h-2 rounded-full bg-primary" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 items-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Textarea 
                            placeholder="Ask a question about outlier patterns..." 
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            className="text-sm min-h-[60px]"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                          <p>Type a query to receive AI insights on outlier patterns</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button onClick={handleAskAI} className="shrink-0" disabled={isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <OutlierDistribution type="activity" />
        </TabsContent>
        
        <TabsContent value="resource" className="space-y-4">
          <OutlierDistribution type="resource" />
        </TabsContent>
      </Tabs>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-3 border-b">
          <h3 className="font-semibold">Recent Outlier Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Activity</th>
                <th className="px-4 py-2 text-left">Resource</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Severity</th>
                <th className="px-4 py-2 text-left">Deviation</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOutlierEvents.slice(0, 5).map((outlier) => (
                <tr key={outlier.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-2">{outlier.timestamp}</td>
                  <td className="px-4 py-2">{outlier.activity}</td>
                  <td className="px-4 py-2">{outlier.resource}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      outlier.category === 'sequence' ? 'bg-blue-100 text-blue-800' :
                      outlier.category === 'time' ? 'bg-amber-100 text-amber-800' :
                      outlier.category === 'resource' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {outlier.category === 'sequence' ? 'Sequence' :
                       outlier.category === 'time' ? 'Time' :
                       outlier.category === 'resource' ? 'Resource' : 'Other'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      outlier.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      outlier.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      outlier.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {outlier.severity.charAt(0).toUpperCase() + outlier.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{outlier.deviationPercentage}%</td>
                  <td className="px-4 py-2">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => onSelectOutlier(outlier)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutlierDashboard;
