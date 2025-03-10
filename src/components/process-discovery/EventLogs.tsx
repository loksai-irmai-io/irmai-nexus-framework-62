
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventLog, ProcessNode } from './types';
import { AlertCircle } from 'lucide-react';

interface EventLogsProps {
  logs: EventLog[];
  selectedNode: string | null;
  processNodes: ProcessNode[];
}

export const EventLogs: React.FC<EventLogsProps> = ({ logs, selectedNode, processNodes }) => {
  // Handle the case when no logs are available
  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Raw Event Logs</CardTitle>
            <Badge variant="outline">0 events</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Event Data Available</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Upload an event log file to visualize your process data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Raw Event Logs</CardTitle>
          <Badge variant="outline">{logs.length} events</Badge>
        </div>
        {selectedNode && (
          <CardDescription>
            Showing events for: {processNodes.find(n => n.id === selectedNode)?.label}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-md border max-h-[400px]">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Case ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2 text-sm">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-2 text-sm font-medium">{log.activity}</td>
                  <td className="px-4 py-2 text-sm">{log.caseId}</td>
                  <td className="px-4 py-2 text-sm">{log.user}</td>
                  <td className="px-4 py-2 text-sm">{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
