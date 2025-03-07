
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Filter, Send, HelpCircle, Settings, AlertTriangle, Flame, Activity, BarChart3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import OutlierMetricsPanel from './OutlierMetricsPanel';
import OutlierTimeline from './OutlierTimeline';
import OutlierHeatmap from './OutlierHeatmap';
import OutlierDistribution from './OutlierDistribution';
import { OutlierEvent } from './types';
import { mockOutlierEvents, mockAIInsights, mockTimelineData } from './mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';

interface OutlierDashboardProps {
  onSelectOutlier: (outlier: OutlierEvent) => void;
  onOpenSettings: () => void;
}

const OutlierDashboard: React.FC<OutlierDashboardProps> = ({ onSelectOutlier, onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(mockAIInsights.text);
  const [aiRecommendations, setAiRecommendations] = useState(mockAIInsights.recommendations);
  const [timeframe, setTimeframe] = useState('week');
  const [filtering, setFiltering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [outliers, setOutliers] = useState(mockOutlierEvents);
  const [filters, setFilters] = useState({
    severity: { critical: true, high: true, medium: true, low: true },
    category: { sequence: true, time: true, resource: true, other: true },
    status: { new: true, confirmed: true, dismissed: false }
  });
  const [sensitivityThreshold, setSensitivityThreshold] = useState([75]);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mockTimelineData.length);
      const randomIncrease = Math.floor(Math.random() * 3) + 1;
      
      if (Math.random() > 0.7) {
        toast({
          title: "New Outlier Detected",
          description: `A new ${Math.random() > 0.5 ? 'sequence' : 'time'} outlier has been detected in the system.`,
          variant: "default",
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(intervalId);
  }, [toast]);

  const handleAskAI = () => {
    if (!aiQuery.trim()) return;
    
    // Simulate AI response with loading state
    setIsTyping(true);
    
    setTimeout(() => {
      setAiResponse(`Analysis of your query "${aiQuery}": ${mockAIInsights.text}`);
      setAiRecommendations([
        'Consider reviewing the approval workflow for efficiency',
        'Investigate the resource allocation during peak hours',
        'Analyze the sequence pattern for potential optimization',
        'Set up alerts for similar deviations in the future'
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
    
    setOutliers(filteredOutliers);
    
    // Navigate to the appropriate section or update the UI
    setActiveTab('overview');
    
    // Show a toast or notification about the filtered results
    toast({
      title: `${category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)} Outliers`,
      description: `Showing ${filteredOutliers.length} ${category === 'all' ? '' : category} outliers`,
      variant: "default",
    });
  };

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      // @ts-ignore - This is a dynamic property access
      newFilters[type][value] = checked;
      return newFilters;
    });
    
    // Apply filters
    let filtered = mockOutlierEvents.filter(outlier => {
      const severityMatch = filters.severity[outlier.severity as keyof typeof filters.severity];
      const categoryMatch = filters.category[outlier.category as keyof typeof filters.category];
      const statusMatch = filters.status[outlier.status as keyof typeof filters.status];
      return severityMatch && categoryMatch && statusMatch;
    });
    
    setOutliers(filtered);
  };

  const handleSensitivityChange = (values: number[]) => {
    setSensitivityThreshold(values);
    
    toast({
      title: "Sensitivity Threshold Updated",
      description: `Outlier detection sensitivity set to ${values[0]}%`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outlier Analysis</h1>
            <p className="text-muted-foreground">Identify process anomalies and violations.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 animate-pulse">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span> Live Monitoring
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onOpenSettings}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure outlier detection settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Predictive Alert Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Predictive Alert</p>
              <p className="text-sm text-amber-700">
                Based on current trends, 15 new outliers are predicted in the next 24 hours. 
                Sequence violations are showing an upward trend.
              </p>
            </div>
          </div>
        </div>
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
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFiltering(!filtering)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Flame className="mr-2 h-4 w-4" />
                      Sensitivity
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adjust outlier detection sensitivity</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="p-4 min-w-[300px]">
              <h4 className="font-medium mb-2">Detection Sensitivity</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust the threshold for what is considered an outlier. 
                Higher values detect more subtle anomalies.
              </p>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <Slider 
                  value={sensitivityThreshold} 
                  onValueChange={handleSensitivityChange} 
                  className="mb-1"
                  max={100}
                  step={5}
                />
                <div className="text-center text-sm font-medium">
                  {sensitivityThreshold[0]}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Current setting will detect deviations above {100 - sensitivityThreshold[0]}% from normal patterns.
              </p>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtering && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
          <div>
            <h3 className="font-medium mb-2">Severity</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="critical" 
                  className="mr-2" 
                  checked={filters.severity.critical} 
                  onChange={(e) => handleFilterChange('severity', 'critical', e.target.checked)}
                />
                <label htmlFor="critical" className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1.5"></span>
                  Critical
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="high" 
                  className="mr-2" 
                  checked={filters.severity.high} 
                  onChange={(e) => handleFilterChange('severity', 'high', e.target.checked)}
                />
                <label htmlFor="high" className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1.5"></span>
                  High
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="medium" 
                  className="mr-2" 
                  checked={filters.severity.medium} 
                  onChange={(e) => handleFilterChange('severity', 'medium', e.target.checked)}
                />
                <label htmlFor="medium" className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span>
                  Medium
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="low" 
                  className="mr-2" 
                  checked={filters.severity.low} 
                  onChange={(e) => handleFilterChange('severity', 'low', e.target.checked)}
                />
                <label htmlFor="low" className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1.5"></span>
                  Low
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="sequence" 
                  className="mr-2" 
                  checked={filters.category.sequence} 
                  onChange={(e) => handleFilterChange('category', 'sequence', e.target.checked)}
                />
                <label htmlFor="sequence" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 mr-1.5">SEQ</span>
                  Sequence Violations
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="time" 
                  className="mr-2" 
                  checked={filters.category.time} 
                  onChange={(e) => handleFilterChange('category', 'time', e.target.checked)}
                />
                <label htmlFor="time" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-800 mr-1.5">TIME</span>
                  Time-based Outliers
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="resource" 
                  className="mr-2" 
                  checked={filters.category.resource} 
                  onChange={(e) => handleFilterChange('category', 'resource', e.target.checked)}
                />
                <label htmlFor="resource" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-800 mr-1.5">RES</span>
                  Resource Imbalances
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="other" 
                  className="mr-2" 
                  checked={filters.category.other} 
                  onChange={(e) => handleFilterChange('category', 'other', e.target.checked)}
                />
                <label htmlFor="other" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-800 mr-1.5">OTHER</span>
                  Other Anomalies
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="new" 
                  className="mr-2" 
                  checked={filters.status.new} 
                  onChange={(e) => handleFilterChange('status', 'new', e.target.checked)}
                />
                <label htmlFor="new" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 mr-1.5">NEW</span>
                  New
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="confirmed" 
                  className="mr-2" 
                  checked={filters.status.confirmed} 
                  onChange={(e) => handleFilterChange('status', 'confirmed', e.target.checked)}
                />
                <label htmlFor="confirmed" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-800 mr-1.5">OK</span>
                  Confirmed
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="dismissed" 
                  className="mr-2" 
                  checked={filters.status.dismissed} 
                  onChange={(e) => handleFilterChange('status', 'dismissed', e.target.checked)}
                />
                <label htmlFor="dismissed" className="flex items-center">
                  <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800 mr-1.5">X</span>
                  Dismissed
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <OutlierMetricsPanel onCardClick={handleCategoryClick} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Activity Distribution
          </TabsTrigger>
          <TabsTrigger value="resource" className="flex items-center gap-1">
            <Flame className="h-4 w-4" />
            Resource Distribution
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OutlierTimeline />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OutlierHeatmap />
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200 mr-2">
                      AI Insight
                    </Badge>
                    <span>Recommendations</span>
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
                            <li key={index} className="flex items-start">
                              <span>{rec}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-auto h-6 text-xs"
                                onClick={() => toast({
                                  title: "Recommendation Validated",
                                  description: "Your feedback has been recorded.",
                                  variant: "default",
                                })}
                              >
                                Validate
                              </Button>
                            </li>
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
        <div className="bg-muted/30 p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recent Outlier Events</h3>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 cursor-help">
                  <Bot className="h-3 w-3 mr-1" /> AI Prioritized
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>These outliers are sorted by AI-determined importance and impact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              {outliers.slice(0, 5).map((outlier) => (
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
