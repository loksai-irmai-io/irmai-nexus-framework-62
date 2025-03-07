
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  ChevronDown, 
  MessageSquare, 
  ThumbsDown, 
  ThumbsUp, 
  Bot,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEventLogs } from './mockData';
import { OutlierEvent } from './types';
import Chart, { ChartDataSeries } from '../dashboard/Chart';
import type { ChartData } from '../dashboard/Chart';
import { Textarea } from '@/components/ui/textarea';

interface OutlierDetailViewProps {
  outlier: OutlierEvent;
  onBack: () => void;
}

const OutlierDetailView: React.FC<OutlierDetailViewProps> = ({ outlier, onBack }) => {
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // Get event logs for this outlier (or empty array if not found)
  const eventLogs = mockEventLogs[outlier.id] || [];
  
  // Format the timestamp for display
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
  
  // Convert the event logs to chart data
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                Event Log Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
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
                      <tr key={index} className="border-b hover:bg-muted/20">
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
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base font-medium flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-500" />
                AI Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-md p-3 text-sm">
                  <p className="mb-2">
                    This event deviated from the norm by {outlier.deviationPercentage}%. The anomaly was detected in the
                    <span className="font-medium"> {outlier.activity}</span> process.
                  </p>
                  <p className="mb-2">
                    AI confidence in this anomaly detection: <span className="font-medium">{(outlier.aiConfidence * 100).toFixed(0)}%</span>
                  </p>
                  <p>
                    Suggested action: Review the {outlier.activity} process for potential bottlenecks or resource constraints.
                  </p>
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
          
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  Confirm Outlier
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4 text-blue-500" />
                  Create Investigation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ThumbsDown className="mr-2 h-4 w-4 text-red-500" />
                  Dismiss
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setIsAddingComment(!isAddingComment)}
                >
                  <MessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                  Add Comment
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
                
                {isAddingComment && (
                  <div className="pt-2 space-y-2">
                    <Textarea
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-sm min-h-[80px]"
                    />
                    <Button size="sm" className="mt-2">Submit Comment</Button>
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
