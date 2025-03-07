
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
  Download
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

interface OutlierDetailViewProps {
  outlier: OutlierEvent;
  onBack: () => void;
}

const OutlierDetailView: React.FC<OutlierDetailViewProps> = ({ outlier, onBack }) => {
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [hoveredLogIndex, setHoveredLogIndex] = useState<number | null>(null);
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Outlier Details – {outlier.name}</h1>
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
              {/* Visual Drill-Down Section - Enhanced with better highlighting */}
              <div className="mb-6 p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center mb-2">
                  <Activity className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-sm">Visual Drill-Down</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  This chart highlights the trend around the outlier. Peaks indicate significant deviations from expected behavior.
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <Chart
                          title="Anomaly Trend"
                          type="line"
                          data={chartData}
                          series={series}
                          xAxisKey="name"
                          height={200}
                          showLegend={false}
                          tooltip="This chart shows the trend of deviation values across the event timeline."
                        />
                        {/* Highlight the outlier point in the chart */}
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs rounded-bl-md">
                          Outlier Point
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Visual Drill-Down: This chart highlights the trend around the outlier. Peaks indicate significant deviations from expected behavior.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
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
                        className={`border-b hover:bg-muted/20 transition-colors ${hoveredLogIndex === index ? 'bg-muted/30' : ''} ${log.deviationValue > 5 ? 'bg-red-50' : ''}`}
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
          {/* AI Explanation Panel - Enhanced with better styling and tooltip */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="pb-2 border-b bg-blue-50">
              <CardTitle className="text-base font-medium flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-500" />
                AI Explanation
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
                  <p className="font-medium mb-1">Suggested actions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Review the {outlier.activity} process for potential bottlenecks.</li>
                    <li>Check resource allocation for the {outlier.resource}.</li>
                    <li>Verify if this pattern occurs at regular intervals.</li>
                  </ul>
                </div>
                
                {!feedbackGiven ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => setFeedbackGiven(true)}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Accurate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setFeedbackGiven(true)}
                    >
                      <ThumbsDown className="mr-1 h-4 w-4" />
                      False Positive
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
          
          {/* User Action Buttons - Enhanced with better styling */}
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
                        <Activity className="mr-2 h-4 w-4 text-blue-500" />
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
                        className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                        variant="outline"
                        onClick={handleDismissOutlier}
                      >
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Dismiss
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
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={handleSubmitComment}
                      disabled={!comment.trim()}
                    >
                      Submit Comment
                    </Button>
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
