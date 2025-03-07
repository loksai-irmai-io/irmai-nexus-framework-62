
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventLog, ProcessNode } from './types';

interface EventLogsProps {
  logs: EventLog[];
  selectedNode: string | null;
  processNodes: ProcessNode[];
}

export const EventLogs: React.FC<EventLogsProps> = ({ logs, selectedNode, processNodes }) => {
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
              {logs.map((log) => (
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
      </CardContent>
    </Card>
  );
};
