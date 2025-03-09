
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth } from '@/hooks/useAdminData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, ExternalLink, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SimpleDependencyGraph: React.FC<{ selectedDependency: string | null, onSelectDependency: (id: string | null) => void }> = ({ 
  selectedDependency, 
  onSelectDependency 
}) => {
  const { data: healthData, isLoading } = useSystemHealth();

  if (isLoading || !healthData) {
    return <div className="h-96 flex items-center justify-center">Loading dependency graph...</div>;
  }

  // This is a simple SVG-based dependency graph visualization
  // In a real application, you'd use a more sophisticated graph visualization library

  const services = [
    { id: 'frontend', name: 'Frontend', x: 100, y: 50 },
    { id: 'api-gateway', name: 'API Gateway', x: 300, y: 50 },
    { id: 'auth-service', name: 'Auth Service', x: 500, y: 20 },
    { id: 'process-analyzer', name: 'Process Analyzer', x: 500, y: 80 },
    { id: 'outlier-detector', name: 'Outlier Detector', x: 500, y: 140 },
    { id: 'risk-analyzer', name: 'Risk Analyzer', x: 500, y: 200 },
    { id: 'compliance-checker', name: 'Compliance Checker', x: 500, y: 260 },
    { id: 'database', name: 'Database', x: 700, y: 140 },
    { id: 'notification', name: 'Notifications', x: 500, y: 320 },
  ];

  const getNodeColor = (id: string) => {
    if (selectedDependency === id) return '#3b82f6'; // blue-500
    
    const service = healthData.services.find(s => s.id === id);
    if (service) {
      switch (service.status) {
        case 'online': return '#10b981'; // emerald-500
        case 'degraded': return '#f59e0b'; // amber-500
        case 'offline': return '#ef4444'; // red-500
        default: return '#6b7280'; // gray-500
      }
    }
    return '#6b7280'; // gray-500 for frontend
  };

  const getEdgeStatus = (source: string, target: string) => {
    const dependency = healthData.dependencies.find(
      d => d.source === source && d.target === target
    );
    
    if (!dependency) return 'unknown';
    return dependency.status;
  };

  const getEdgeColor = (source: string, target: string) => {
    const status = getEdgeStatus(source, target);
    switch (status) {
      case 'active': return '#10b981'; // emerald-500
      case 'degraded': return '#f59e0b'; // amber-500
      case 'inactive': return '#ef4444'; // red-500
      default: return '#d1d5db'; // gray-300
    }
  };

  const getEdgeWidth = (source: string, target: string) => {
    if (selectedDependency === source || selectedDependency === target) return 3;
    return 1.5;
  };

  const edges = [
    { source: 'frontend', target: 'api-gateway' },
    { source: 'api-gateway', target: 'auth-service' },
    { source: 'api-gateway', target: 'process-analyzer' },
    { source: 'api-gateway', target: 'outlier-detector' },
    { source: 'api-gateway', target: 'risk-analyzer' },
    { source: 'api-gateway', target: 'compliance-checker' },
    { source: 'api-gateway', target: 'notification' },
    { source: 'auth-service', target: 'database' },
    { source: 'process-analyzer', target: 'database' },
    { source: 'outlier-detector', target: 'database' },
    { source: 'risk-analyzer', target: 'database' },
    { source: 'compliance-checker', target: 'database' },
  ];

  return (
    <div className="border rounded-md bg-white p-4 h-[600px] overflow-auto">
      <svg width="800" height="400" className="mx-auto">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        
        {/* Draw edges */}
        {edges.map((edge, i) => {
          const source = services.find(s => s.id === edge.source);
          const target = services.find(s => s.id === edge.target);
          
          if (!source || !target) return null;
          
          const edgeColor = getEdgeColor(edge.source, edge.target);
          const edgeWidth = getEdgeWidth(edge.source, edge.target);
          
          return (
            <line
              key={`edge-${i}`}
              x1={source.x + 60} // offset to connect from the right side of the node
              y1={source.y + 20} // center of the node
              x2={target.x - 10} // offset to connect to the left side of the node
              y2={target.y + 20} // center of the node
              stroke={edgeColor}
              strokeWidth={edgeWidth}
              strokeDasharray={getEdgeStatus(edge.source, edge.target) === 'degraded' ? "4 2" : ""}
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        
        {/* Draw nodes */}
        {services.map(service => (
          <g 
            key={service.id} 
            onClick={() => onSelectDependency(selectedDependency === service.id ? null : service.id)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={service.x - 10}
              y={service.y}
              width={120}
              height={40}
              rx={6}
              fill={getNodeColor(service.id)}
              stroke={selectedDependency === service.id ? '#1e40af' : 'none'}
              strokeWidth={2}
              opacity={0.8}
            />
            <text
              x={service.x + 50}
              y={service.y + 25}
              textAnchor="middle"
              fill="white"
              fontSize={12}
              fontWeight={500}
            >
              {service.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const DependencyTable: React.FC<{ selectedService: string | null }> = ({ selectedService }) => {
  const { data: healthData, isLoading } = useSystemHealth();

  if (isLoading || !healthData) {
    return <div className="h-96 flex items-center justify-center">Loading dependency data...</div>;
  }

  let dependencies = healthData.dependencies;
  
  if (selectedService) {
    dependencies = dependencies.filter(
      d => d.source === selectedService || d.target === selectedService
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'degraded':
        return <Badge variant="warning" className="bg-amber-500">Degraded</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getLatencyClass = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 150) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Error Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dependencies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No dependencies found
              </TableCell>
            </TableRow>
          ) : (
            dependencies.map((dep, i) => (
              <TableRow key={`${dep.source}-${dep.target}`}>
                <TableCell className="font-medium">{dep.source}</TableCell>
                <TableCell>{dep.target}</TableCell>
                <TableCell>{getStatusBadge(dep.status)}</TableCell>
                <TableCell className={cn("font-medium", getLatencyClass(dep.latency))}>
                  {dep.latency}ms
                </TableCell>
                <TableCell>
                  {dep.errorRate > 0.05 ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      {(dep.errorRate * 100).toFixed(1)}%
                    </div>
                  ) : (
                    <span className="text-green-600">{(dep.errorRate * 100).toFixed(1)}%</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="text-sm">
                          <p>Requests: {dep.requestCount}</p>
                          {dep.lastError && <p className="text-red-500 mt-1">Last error: {dep.lastError}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const DependencyGraph: React.FC = () => {
  const [view, setView] = useState<'graph' | 'table'>('graph');
  const [selectedDependency, setSelectedDependency] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">System Dependencies</CardTitle>
            
            <TabsList>
              <TabsTrigger 
                value="graph" 
                onClick={() => setView('graph')} 
                className={view === 'graph' ? 'bg-blue-50 data-[state=active]:bg-blue-50' : ''}
              >
                Graph View
              </TabsTrigger>
              <TabsTrigger 
                value="table" 
                onClick={() => setView('table')}
                className={view === 'table' ? 'bg-blue-50 data-[state=active]:bg-blue-50' : ''}
              >
                Table View
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-sm">Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm">Offline</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedDependency ? `Selected: ${selectedDependency}` : 'Click on a service to see its connections'}
              </span>
              {selectedDependency && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedDependency(null)}
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
          
          {view === 'graph' ? (
            <SimpleDependencyGraph 
              selectedDependency={selectedDependency} 
              onSelectDependency={setSelectedDependency} 
            />
          ) : (
            <DependencyTable selectedService={selectedDependency} />
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependency Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Quick Reference</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                The system consists of a frontend application that communicates with the backend through an API Gateway. 
                The API Gateway routes requests to appropriate microservices based on the functionality required.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="text-sm">
                  <p className="font-medium mb-1">Common Issues</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Slow API responses</li>
                    <li>Authentication failures</li>
                    <li>Database connection timeouts</li>
                    <li>Service unavailability</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">First Response</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Check service status</li>
                    <li>Review recent logs</li>
                    <li>Verify network connectivity</li>
                    <li>Check for recent deployments</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <Button variant="outline" size="sm" className="mt-2">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DependencyGraph;
