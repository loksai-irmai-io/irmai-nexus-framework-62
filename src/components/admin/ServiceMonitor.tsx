
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSystemHealth, useTestEndpoint, useRestartService } from '@/hooks/useAdminData';
import { 
  Search, MoreVertical, RefreshCw, AlertTriangle, ExternalLink, 
  Check, History, Terminal, PowerOff, Play, Zap, Hourglass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceStatus } from '@/services/adminService';

const ServiceMonitor: React.FC = () => {
  const { data: healthData, isLoading } = useSystemHealth();
  const { mutate: testEndpoint, isPending: isTesting } = useTestEndpoint();
  const { mutate: restartService, isPending: isRestarting } = useRestartService();
  
  const [filter, setFilter] = useState('');
  const [view, setView] = useState<'all' | 'issues'>('all');
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (isLoading || !healthData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Service Status Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <Hourglass className="h-6 w-6 text-muted-foreground animate-pulse mr-2" />
            <span>Loading service data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const filteredServices = healthData.services.filter(service => {
    // Text filter
    const matchesFilter = filter === '' || 
      service.name.toLowerCase().includes(filter.toLowerCase()) ||
      service.id.toLowerCase().includes(filter.toLowerCase()) ||
      service.description.toLowerCase().includes(filter.toLowerCase());
    
    // Status filter
    const matchesView = view === 'all' || service.status !== 'online';
    
    return matchesFilter && matchesView;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'degraded':
        return <Badge variant="warning" className="bg-amber-500">Degraded</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleTestEndpoint = (endpoint: string) => {
    testEndpoint(endpoint);
  };
  
  const handleRestartConfirm = () => {
    if (!selectedService) return;
    
    restartService(selectedService.id);
    setDialogOpen(false);
  };
  
  const openRestartDialog = (service: ServiceStatus) => {
    setSelectedService(service);
    setDialogOpen(true);
  };
  
  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'offline':
        return <PowerOff className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Service Status Monitor</CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter services..."
                  className="pl-8 w-full sm:w-auto"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setView('all')}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="issues" 
                    onClick={() => setView('issues')}
                  >
                    Issues
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Service status last updated: {new Date(healthData.lastUpdated).toLocaleString()}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No services found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className={cn(
                    service.status === 'degraded' && "bg-amber-50",
                    service.status === 'offline' && "bg-red-50"
                  )}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs text-muted-foreground">{service.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(service.status)}
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "font-medium",
                      service.responseTime < 100 ? "text-green-600" : 
                      service.responseTime < 300 ? "text-amber-600" : "text-red-600"
                    )}>
                      {service.responseTime}ms
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          service.uptime > 99.9 ? "text-green-600" : 
                          service.uptime > 99.0 ? "text-amber-600" : "text-red-600"
                        )}>
                          {service.uptime.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.errorCount > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-red-600">{service.errorCount}</span>
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        </div>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTestEndpoint(service.endpoint)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            <span>Test Connection</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openRestartDialog(service)}>
                            <Play className="h-4 w-4 mr-2" />
                            <span>Restart Service</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="h-4 w-4 mr-2" />
                            <span>View History</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Terminal className="h-4 w-4 mr-2" />
                            <span>View Logs</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            <span>Full Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to restart {selectedService?.name}? This may cause temporary service disruption.
            </DialogDescription>
          </DialogHeader>

          {selectedService?.status === 'online' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This service is currently online. Restarting it may affect users currently using the system.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isRestarting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRestartConfirm} 
              disabled={isRestarting}
              className="flex items-center gap-2"
            >
              {isRestarting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Restarting...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Restart Service</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceMonitor;
