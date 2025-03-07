
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  ChevronDown, 
  MessageSquare, 
  ThumbsDown, 
  ThumbsUp, 
  Bot,
  Activity,
  Info,
  Check,
  X,
  Download,
  Users,
  Bell,
  FileBarChart,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEventLogs } from './mockData';
import { OutlierEvent } from './types';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import type { ChartData } from '../dashboard/Chart';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface OutlierDetailViewProps {
  outlier: OutlierEvent;
  onBack: () => void;
}

const OutlierDetailView: React.FC<OutlierDetailViewProps> = ({ outlier, onBack }) => {
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null);
  const [assignee, setAssignee] = useState<string | null>(null);
  const { toast } = useToast();
  
  const eventLogs = mockEventLogs[outlier.id] || [];
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const chartData: ChartData[] = eventLogs.map(log => ({
    name: log.timestamp.split('T')[1].substring(0, 5),
    value: log.deviationValue,
    activity: log.activity
  }));
  
  const series: ChartDataSeries[] = [
    {
      name: 'Deviation Value',
      color: '#ef4444', // Red
      dataKey: 'value'
    }
  ];
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sequence': return 'text-blue-600 bg-blue-50';
      case 'time': return 'text-amber-600 bg-amber-50';
      case 'resource': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const handleConfirmOutlier = () => {
    toast({
      title: "Outlier Confirmed",
      description: `The outlier "${outlier.name}" has been confirmed.`,
      variant: "default",
    });
  };
  
  const handleDismissOutlier = () => {
    toast({
      title: "Outlier Dismissed",
      description: `The outlier "${outlier.name}" has been dismissed as a false positive.`,
      variant: "default",
    });
  };
  
  const handleCreateInvestigation = () => {
    toast({
      title: "Investigation Created",
      description: `A new investigation has been created for "${outlier.name}".`,
      variant: "default",
    });
  };
  
  const handleRaiseIncident = () => {
    toast({
      title: "Incident Raised",
      description: `An incident has been raised for "${outlier.name}".`,
      variant: "default",
    });
  };
  
  const handleAssignUser = (userName: string) => {
    setAssignee(userName);
    toast({
      title: "Outlier Assigned",
      description: `The outlier "${outlier.name}" has been assigned to ${userName}.`,
      variant: "default",
    });
  };
  
  const handleSubmitComment = () => {
    if (comment.trim()) {
      toast({
        title: "Comment Added",
        description: "Your comment has been added to this outlier event.",
        variant: "default",
      });
      setComment('');
      setIsAddingComment(false);
    }
  };
  
  const handleMouseEnterLogRow = (index: number) => {
    setHoveredLogIndex(index);
  };
  
  const handleMouseLeaveLogRow = () => {
    setHoveredLogIndex(null);
  };
  
  const handleDownloadEventLog = () => {
    const headers = ['Timestamp', 'Activity', 'Resource', 'Deviation Value'];
    const rows = eventLogs.map(log => [
      log.timestamp,
      log.activity,
      log.resource,
      log.deviationValue
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `outlier-${outlier.id}-events.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Event log data is being downloaded as CSV.",
      variant: "default",
    });
  };
  
  const handleValidateAI = () => {
    toast({
      title: "AI Insight Validated",
      description: "You've confirmed the AI explanation is accurate.",
      variant: "default",
    });
    setFeedbackGiven(true);
  };
  
  const handleOverrideAI = () => {
    toast({
      title: "AI Insight Overridden",
      description: "You've marked this AI explanation as inaccurate.",
      variant: "default",
    });
    setFeedbackGiven(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Outlier Details – {outlier.name}</h1>
        
        {/* Real-time indicator */}
        <Badge variant="outline" className="ml-auto bg-green-50 text-green-600 border-green-200 animate-pulse">
          <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span> Live Monitoring
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Outlier Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className={`mt-1 text-sm font-medium px-2 py-1 rounded-full inline-block ${getCategoryColor(outlier.category)}`}>
                    {outlier.category.charAt(0).toUpperCase() + outlier.category.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <p className={`mt-1 text-sm font-medium px-2 py-1 rounded-full inline-block ${getSeverityColor(outlier.severity)}`}>
                    {outlier.severity.charAt(0).toUpperCase() + outlier.severity.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Detected At</p>
                  <p className="mt-1 text-sm font-medium">{formatTimestamp(outlier.timestamp)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deviation</p>
                  <p className="mt-1 text-sm font-medium">{outlier.deviationPercentage}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Activity</p>
                  <p className="mt-1 text-sm font-medium">{outlier.activity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Resource</p>
                  <p className="mt-1 text-sm font-medium">{outlier.resource}</p>
                </div>
                <div className="col-span-4">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{outlier.description}</p>
                </div>
                
                {assignee && (
                  <div className="col-span-4">
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="mt-1 text-sm font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      {assignee}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Visual Drill-Down Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Activity className="h-5 w-5 text-blue-500 mr-2" />
                Visual Drill-Down
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This chart highlights the trend around the outlier. The red point indicates the exact moment of the anomaly.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <Chart
                  title=""
                  type="line"
                  data={chartData}
                  series={series}
                  xAxisKey="name"
                  height={220}
                  showLegend={false}
                  tooltip="This chart shows the trend of deviation values across the event timeline."
                  onClick={(data) => console.log('Chart clicked', data)}
                  onMouseMove={(data) => console.log('Chart hover', data)}
                />
                {/* Highlight the outlier point in the chart */}
                <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs rounded-bl-md">
                  Outlier Point
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Trend Alert</p>
                    <p className="text-sm text-amber-700">
                      This pattern shows a 45% increase in deviations over the past 12 hours. 
                      3 more outliers predicted in the next 24 hours if trend continues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Event Log Timeline
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleDownloadEventLog}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Activity</th>
                      <th className="px-4 py-2 text-left">Resource</th>
                      <th className="px-4 py-2 text-left">Deviation Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventLogs.map((log, index) => (
                      <tr 
                        key={index} 
                        className={`border-b hover:bg-muted/20 transition-colors cursor-pointer ${hoveredLogIndex === index ? 'bg-muted/30' : ''} ${log.deviationValue > 5 ? 'bg-red-50' : ''}`}
                        onMouseEnter={() => handleMouseEnterLogRow(index)}
                        onMouseLeave={handleMouseLeaveLogRow}
                      >
                        <td className="px-4 py-2">{formatTimestamp(log.timestamp)}</td>
                        <td className="px-4 py-2">{log.activity}</td>
                        <td className="px-4 py-2">{log.resource}</td>
                        <td className={`px-4 py-2 ${log.deviationValue > 0 ? 'text-red-600 font-medium' : ''}`}>
                          {log.deviationValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {/* Enhanced AI Explanation Panel */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="pb-2 border-b bg-blue-50">
              <CardTitle className="text-base font-medium flex items-center">
                <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200 mr-2">
                  AI Insight
                </Badge>
                <span>Anomaly Explanation</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>AI Explanation: This event deviated from the norm by {outlier.deviationPercentage}%. Provide feedback if this is a false positive.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-md p-3 text-sm">
                  <p className="mb-2">
                    This event deviated from the norm by <span className="font-medium text-red-600">{outlier.deviationPercentage}%</span>. The anomaly was detected in the
                    <span className="font-medium"> {outlier.activity}</span> process.
                  </p>
                  <p className="mb-2">
                    AI confidence in this anomaly detection: <span className="font-medium">{(outlier.aiConfidence * 100).toFixed(0)}%</span>
                  </p>
                  <p className="font-medium mb-1">Root cause analysis:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Processing time exceeded expected duration by 3.5x</li>
                    <li>Resource utilization spiked to 87% during this period</li>
                    <li>Previous activity showed similar pattern in 2 other cases</li>
                  </ul>
                  
                  <p className="font-medium mb-1">Recommended actions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Review the {outlier.activity} process for potential bottlenecks</li>
                    <li>Check resource allocation for the {outlier.resource}</li>
                    <li>Consider implementing a pre-approval step to avoid delays</li>
                    <li>Verify if this pattern occurs at regular intervals</li>
                  </ul>
                </div>
                
                {!feedbackGiven ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={handleValidateAI}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Validate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleOverrideAI}
                    >
                      <ThumbsDown className="mr-1 h-4 w-4" />
                      Override
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-sm text-green-600">
                    Thank you for your feedback!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced User Action Buttons */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full justify-start bg-green-50 text-green-600 hover:bg-green-100 border border-green-200" 
                        variant="outline"
                        onClick={handleConfirmOutlier}
                      >
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Confirm Outlier
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Mark this as a confirmed anomaly</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full justify-start bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" 
                        variant="outline"
                        onClick={handleCreateInvestigation}
                      >
                        <FileBarChart className="mr-2 h-4 w-4 text-blue-500" />
                        Create Investigation
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Start a formal investigation process</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full justify-start bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200" 
                        variant="outline"
                        onClick={handleRaiseIncident}
                      >
                        <Bell className="mr-2 h-4 w-4 text-amber-500" />
                        Raise Incident
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Create an incident case for immediate attention</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            className="w-full justify-start bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200" 
                            variant="outline"
                          >
                            <Users className="mr-2 h-4 w-4 text-purple-500" />
                            Assign To
                            <ChevronDown className="ml-auto h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Assign this outlier to a team member</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleAssignUser("John Doe")}>
                      John Doe (Process Analyst)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAssignUser("Jane Smith")}>
                      Jane Smith (Risk Manager)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAssignUser("Michael Johnson")}>
                      Michael Johnson (Compliance Officer)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                        variant="outline"
                        onClick={handleDismissOutlier}
                      >
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Dismiss as False Positive
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Mark this as a false positive</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setIsAddingComment(!isAddingComment)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                        Add Comment
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isAddingComment ? 'rotate-180' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Add a comment or note to this outlier</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {isAddingComment && (
                  <div className="pt-2 space-y-2 animate-fade-in">
                    <Textarea
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-sm min-h-[80px]"
                    />
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify" />
                        <label htmlFor="notify" className="text-sm cursor-pointer">Notify team</label>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handleSubmitComment}
                        disabled={!comment.trim()}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base font-medium">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200">
                <div className="relative flex items-start space-x-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 border border-blue-200 z-10">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium">Outlier Detected</p>
                    <p className="text-xs text-gray-500">Today at 10:23 AM</p>
                    <p className="mt-1 text-xs text-gray-600">Anomaly detected in {outlier.activity} process</p>
                  </div>
                </div>
                
                <div className="relative flex items-start space-x-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 border border-amber-200 z-10">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium">AI Analysis</p>
                    <p className="text-xs text-gray-500">Today at 10:24 AM</p>
                    <p className="mt-1 text-xs text-gray-600">AI analyzed the outlier and provided recommendations</p>
                  </div>
                </div>
                
                {assignee && (
                  <div className="relative flex items-start space-x-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 border border-purple-200 z-10">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium">Assigned to {assignee}</p>
                      <p className="text-xs text-gray-500">Just now</p>
                      <p className="mt-1 text-xs text-gray-600">The outlier has been assigned for investigation</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OutlierDetailView;
