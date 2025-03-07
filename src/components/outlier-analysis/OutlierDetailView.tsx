
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Bell, 
  Bot, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  GitBranch, 
  Info, 
  MessageSquare, 
  Scale, 
  Shield, 
  Timer, 
  TrendingUp, 
  User, 
  UserPlus, 
  XCircle,
  FileWarning
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OutlierEvent } from './types';

// Mock detailed outlier data
const mockOutlierData: Record<number, OutlierEvent> = {
  1: {
    id: 1,
    title: 'Critical delay in approval process',
    description: 'Multiple instances detected where approval time exceeds threshold by 245%. This represents a significant deviation from established process norms and may indicate resource constraints or procedural bottlenecks in the approval workflow.',
    timestamp: '2023-06-15T10:30:00Z',
    category: 'time_outlier',
    severity: 'critical',
    status: 'pending',
    type: 'process',
    deviation: 245,
    process: 'Loan Application',
    activity: 'Manager Approval',
    resource: 'Approval Team',
    recommendations: [
      'Analyze resource allocation in the approval team',
      'Consider implementing approval auto-routing based on workload',
      'Review approval criteria for potential simplification',
      'Implement escalation path for approvals exceeding time threshold'
    ],
    comments: [
      {
        id: 1,
        userId: 'user123',
        userName: 'John Smith',
        timestamp: '2023-06-15T11:15:00Z',
        content: 'I\'ve checked the approval queue and it appears we have a backlog due to recent system maintenance.'
      },
      {
        id: 2,
        userId: 'user456',
        userName: 'Sarah Jones',
        timestamp: '2023-06-15T12:30:00Z',
        content: 'Team lead is aware of the issue and has allocated additional resources for the next 48 hours.'
      }
    ],
    relatedEvents: [2, 5, 8]
  },
  2: {
    id: 2,
    title: 'Sequence violation in customer verification',
    description: 'Verification step being skipped or performed out of order in 23% of cases. This represents a potential compliance risk as customer verification is a mandatory step in the customer onboarding process.',
    timestamp: '2023-06-15T09:15:00Z',
    category: 'sequence_violation',
    severity: 'high',
    status: 'pending',
    type: 'activity',
    deviation: 23,
    process: 'Customer Onboarding',
    activity: 'Identity Verification',
    recommendations: [
      'Implement system controls to prevent sequence skipping',
      'Conduct targeted training for team members on verification importance',
      'Review cases where verification was skipped to identify patterns',
      'Update process documentation to emphasize verification requirements'
    ],
    comments: [
      {
        id: 1,
        userId: 'user789',
        userName: 'Michael Chen',
        timestamp: '2023-06-15T10:00:00Z',
        content: 'I\'ve reviewed several cases and it appears that the new interface update may be causing confusion about required steps.'
      }
    ]
  }
};

interface OutlierDetailViewProps {
  outlierId: number;
  onBack: () => void;
}

const OutlierDetailView: React.FC<OutlierDetailViewProps> = ({ outlierId, onBack }) => {
  const { toast } = useToast();
  const outlier = mockOutlierData[outlierId] || mockOutlierData[1]; // Fallback to first if not found
  
  const handleCreateTask = () => {
    toast({
      title: "Task created",
      description: "A new task has been created to investigate this outlier",
    });
  };
  
  const handleRaiseIncident = () => {
    toast({
      title: "Incident raised",
      description: "An incident has been created with high priority",
    });
  };
  
  const handleAssign = () => {
    toast({
      title: "Assigned successfully",
      description: "This outlier has been assigned for investigation",
    });
  };
  
  // Get appropriate icon for category
  const getCategoryIcon = () => {
    switch (outlier.category) {
      case 'sequence_violation':
        return <GitBranch className="h-5 w-5 text-blue-500" />;
      case 'time_outlier':
        return <Timer className="h-5 w-5 text-orange-500" />;
      case 'resource_imbalance':
        return <Scale className="h-5 w-5 text-purple-500" />;
      case 'data_quality':
        return <FileWarning className="h-5 w-5 text-yellow-500" />;
      case 'compliance_breach':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };
  
  // Get appropriate severity badge
  const getSeverityBadge = () => {
    let color = "";
    switch (outlier.severity) {
      case 'critical':
        color = "bg-red-500 text-white hover:bg-red-600";
        break;
      case 'high':
        color = "bg-orange-500 text-white hover:bg-orange-600";
        break;
      case 'medium':
        color = "bg-yellow-500 text-black hover:bg-yellow-600";
        break;
      case 'low':
        color = "bg-green-500 text-white hover:bg-green-600";
        break;
      default:
        color = "bg-blue-500 text-white hover:bg-blue-600";
    }
    
    return (
      <Badge className={color}>
        {outlier.severity.charAt(0).toUpperCase() + outlier.severity.slice(1)}
      </Badge>
    );
  };
  
  // Get appropriate status badge
  const getStatusBadge = () => {
    let color = "";
    switch (outlier.status) {
      case 'validated':
        color = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
        break;
      case 'rejected':
        color = "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
        break;
      case 'pending':
        color = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
        break;
      default:
        color = "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
    
    return (
      <Badge variant="outline" className={color}>
        {outlier.status.charAt(0).toUpperCase() + outlier.status.slice(1)}
      </Badge>
    );
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format category
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAssign} className="gap-1">
            <UserPlus className="h-4 w-4" />
            Assign
          </Button>
          <Button variant="outline" onClick={handleCreateTask} className="gap-1">
            <FileText className="h-4 w-4" />
            Create Task
          </Button>
          <Button variant="destructive" onClick={handleRaiseIncident} className="gap-1">
            <Bell className="h-4 w-4" />
            Raise Incident
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getCategoryIcon()}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {getSeverityBadge()}
                  {getStatusBadge()}
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                    {formatCategory(outlier.category)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{outlier.title}</CardTitle>
                <CardDescription className="mt-1 text-sm">
                  Detected at {formatTimestamp(outlier.timestamp)} • ID: {outlier.id}
                </CardDescription>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-red-600">
                +{outlier.deviation}%
              </div>
              <div className="text-sm text-muted-foreground">
                deviation from normal
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="event-logs">Event Logs</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="related">Related Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm">{outlier.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Process Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Process:</span>
                          <span className="font-medium">{outlier.process}</span>
                        </div>
                        {outlier.activity && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Activity:</span>
                            <span className="font-medium">{outlier.activity}</span>
                          </div>
                        )}
                        {outlier.resource && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resource:</span>
                            <span className="font-medium">{outlier.resource}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{outlier.type.charAt(0).toUpperCase() + outlier.type.slice(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deviation:</span>
                          <span className="font-medium text-red-600">+{outlier.deviation}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">First Detected:</span>
                          <span className="font-medium">{formatTimestamp(outlier.timestamp)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="font-medium">12 instances</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trend:</span>
                          <span className="font-medium flex items-center text-red-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Increasing
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Status Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">{outlier.status.charAt(0).toUpperCase() + outlier.status.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned To:</span>
                          <span className="font-medium">{outlier.assignedTo || 'Unassigned'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Related Events:</span>
                          <span className="font-medium">{outlier.relatedEvents?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">AI Recommendations:</span>
                          <span className="font-medium">{outlier.recommendations?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="event-logs" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Event Logs</CardTitle>
                  <CardDescription>
                    Detailed logs of events related to this anomaly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Here would be actual event logs, using mock data for now */}
                    <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{formatTimestamp(outlier.timestamp)}</span>
                        <span>ID: LOG-1234</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Process started</span> - {outlier.process}
                      </div>
                    </div>
                    <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{formatTimestamp(new Date(new Date(outlier.timestamp).getTime() + 1200000).toISOString())}</span>
                        <span>ID: LOG-1235</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Activity completed</span> - Initial data entry
                      </div>
                    </div>
                    <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800 border-red-200 bg-red-50/50 dark:bg-red-900/10">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{formatTimestamp(new Date(new Date(outlier.timestamp).getTime() + 3600000).toISOString())}</span>
                        <span>ID: LOG-1236</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-red-600">Anomaly detected</span> - {outlier.activity} exceeded time threshold by {outlier.deviation}%
                      </div>
                    </div>
                    <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{formatTimestamp(new Date(new Date(outlier.timestamp).getTime() + 7200000).toISOString())}</span>
                        <span>ID: LOG-1237</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Process completed</span> - {outlier.process}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    <CardTitle>AI-Generated Recommendations</CardTitle>
                  </div>
                  <CardDescription>
                    Actionable suggestions based on anomaly analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outlier.recommendations?.map((recommendation, index) => (
                      <div key={index} className="border p-4 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 text-blue-600 dark:text-blue-300">
                            <Info className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{recommendation}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Button size="sm" variant="success" className="h-8 gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Implement
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 gap-1">
                                <XCircle className="h-4 w-4" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outlier.comments?.map((comment) => (
                      <div key={comment.id} className="border p-3 rounded-md">
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center text-muted-foreground">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">Add Comment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="related" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Related Anomaly Events</CardTitle>
                  <CardDescription>
                    Other anomalies that may be connected to this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {outlier.relatedEvents?.map((eventId) => (
                      <div key={eventId} className="border p-3 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 dark:bg-orange-800 p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {mockOutlierData[eventId]?.title || `Anomaly Event #${eventId}`}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTimestamp(mockOutlierData[eventId]?.timestamp || new Date().toISOString())}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutlierDetailView;
