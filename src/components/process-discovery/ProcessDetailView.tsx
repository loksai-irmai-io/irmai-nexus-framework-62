
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCheck, FileText, MessageSquare, Clock, Activity, GitBranch } from 'lucide-react';
import { toast } from "sonner";
import { InsightItem } from './types';

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface ProcessData {
  nodes: Node[];
  edges: Edge[];
}

interface EventLog {
  id: number;
  timestamp: string;
  activity: string;
  caseId: string;
  user: string;
  duration: string;
}

interface ProcessDetailViewProps {
  nodeId: string;
  processData: ProcessData;
  insights: InsightItem[];
  eventLogs: EventLog[];
}

const ProcessDetailView: React.FC<ProcessDetailViewProps> = ({ 
  nodeId, 
  processData, 
  insights,
  eventLogs
}) => {
  const node = processData.nodes.find(n => n.id === nodeId);
  
  if (!node) {
    return <div>Node not found</div>;
  }

  const incomingEdges = processData.edges.filter(e => e.target === nodeId);
  const outgoingEdges = processData.edges.filter(e => e.source === nodeId);
  
  const handleMarkAsReviewed = () => {
    toast.success(`Marked ${node.label} as reviewed`);
  };
  
  const handleAddComment = () => {
    toast.info("Comment feature activated");
  };
  
  const handleViewRawLog = () => {
    toast.info("Showing raw logs");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Process Details – {node.label}</CardTitle>
              <CardDescription>
                Detailed view and analysis of the selected process element
              </CardDescription>
            </div>
            <Badge 
              variant={node.compliant ? "outline" : "destructive"}
              className={`capitalize px-3 py-1 ${node.compliant ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800" : ""}`}
            >
              {node.compliant ? "Compliant" : "Non-Compliant"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Pane: Visualization */}
            <div>
              <h3 className="text-lg font-medium mb-3">Process Segment</h3>
              <div className="border rounded-md p-4 bg-muted/20 h-[400px] relative">
                {/* Simplified process segment visualization */}
                <svg width="100%" height="100%" className="mx-auto">
                  {/* Draw a simple segment focusing on this node and immediate connections */}
                  {incomingEdges.map(edge => {
                    const source = processData.nodes.find(n => n.id === edge.source);
                    if (source) {
                      return (
                        <g key={`in-${edge.id}`}>
                          <line 
                            x1={100} 
                            y1={200} 
                            x2={200} 
                            y2={200}
                            className="stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px]" 
                          />
                          <text 
                            x={150} 
                            y={190}
                            className="text-xs fill-muted-foreground text-center"
                          >
                            {edge.label || 'From: ' + source.label}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Central node */}
                  <rect 
                    x={200} 
                    y={175} 
                    width={120} 
                    height={50} 
                    rx={5}
                    className={`${node.compliant ? 'stroke-green-500' : 'stroke-red-500'} stroke-[2px] fill-blue-100 dark:fill-blue-900`}
                  />
                  <text 
                    x={260} 
                    y={200} 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-foreground"
                  >
                    {node.label}
                  </text>
                  
                  {outgoingEdges.map(edge => {
                    const target = processData.nodes.find(n => n.id === edge.target);
                    if (target) {
                      return (
                        <g key={`out-${edge.id}`}>
                          <line 
                            x1={320} 
                            y1={200} 
                            x2={420} 
                            y2={200}
                            className="stroke-gray-300 dark:stroke-gray-600 stroke-[1.5px]" 
                          />
                          <text 
                            x={370} 
                            y={190}
                            className="text-xs fill-muted-foreground text-center"
                          >
                            {edge.label || 'To: ' + target.label}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
                <div className="text-xs text-muted-foreground mt-2 absolute bottom-2 right-2">
                  Zoomed view of process segment
                </div>
              </div>
            </div>
            
            {/* Right Pane: Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Activity Details</h3>
                <div className="space-y-3 bg-muted/10 p-4 rounded-md border">
                  <div>
                    <span className="text-sm text-muted-foreground">Activity Type:</span>
                    <span className="ml-2 font-medium capitalize">{node.type}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Average Duration:</span>
                    <span className="ml-2 font-medium">2m 45s</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Execution Frequency:</span>
                    <span className="ml-2 font-medium">453 occurrences (38.2%)</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Average Wait Time:</span>
                    <span className="ml-2 font-medium">50s</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Resource Utilization:</span>
                    <span className="ml-2 font-medium">87%</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Last Modified:</span>
                    <span className="ml-2 font-medium">2025-02-10 14:23</span>
                  </div>
                </div>
              </div>
              
              {/* AI Insight */}
              {insights.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">AI Insights</h3>
                  <div className="space-y-3">
                    {insights.map(insight => (
                      <div 
                        key={insight.id} 
                        className={`p-3 rounded-lg border ${
                          insight.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                          insight.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                          insight.severity === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                          'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <p className="text-sm">{insight.description}</p>
                        <div className="flex justify-end mt-1">
                          <Badge variant="outline" className="text-xs">
                            Click to validate or provide feedback
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div>
                <h3 className="text-lg font-medium mb-3">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleMarkAsReviewed}>
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark as Reviewed
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddComment}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleViewRawLog}>
                    <FileText className="h-4 w-4 mr-1" />
                    View Raw Logs
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Logs for this activity */}
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-medium mb-3">Activity Event Logs</h3>
            {eventLogs.length > 0 ? (
              <div className="overflow-auto rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Case ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {eventLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm font-medium">{log.activity}</td>
                        <td className="px-4 py-2 text-sm">{log.caseId}</td>
                        <td className="px-4 py-2 text-sm">{log.user}</td>
                        <td className="px-4 py-2 text-sm">{log.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                No event logs found for this activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessDetailView;
