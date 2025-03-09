
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSystemLogs } from '@/hooks/useAdminData';
import { 
  Search, RefreshCw, Download, Clock, AlertTriangle, 
  Info, Bug, Terminal, Filter, Copy, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogEntry } from '@/services/adminService';

const LogViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { data: logs, isLoading, refetch } = useSystemLogs();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would pass the search term to your API
    console.log('Searching for:', searchTerm);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const filterLogs = (logs: LogEntry[] = []) => {
    return logs.filter(log => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by level
      const matchesLevel = levelFilter === '' || log.level === levelFilter;
      
      // Filter by source
      const matchesSource = sourceFilter === '' || log.source === sourceFilter;
      
      // Filter by tab
      const matchesTab = activeTab === 'all' || log.level === activeTab;
      
      return matchesSearch && matchesLevel && matchesSource && matchesTab;
    });
  };
  
  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge className="bg-blue-500">Info</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      case 'debug':
        return <Badge className="bg-purple-500">Debug</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'debug':
        return <Terminal className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const handleCopyLog = (log: LogEntry) => {
    const logText = `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}
${log.details ? JSON.stringify(log.details, null, 2) : ''}`;
    
    navigator.clipboard.writeText(logText).then(() => {
      // You could use a toast here in a real app
      console.log('Log copied to clipboard');
    });
  };
  
  // Extract unique sources for the filter dropdown
  const uniqueSources = logs ? [...new Set(logs.map(log => log.source))] : [];
  
  const filteredLogs = logs ? filterLogs(logs) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">System Logs</CardTitle>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              
              <div className="flex gap-2">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Log Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Log Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sources</SelectItem>
                    {uniqueSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(levelFilter !== '' || sourceFilter !== '' || searchTerm !== '') && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setLevelFilter('');
                      setSourceFilter('');
                      setSearchTerm('');
                    }} 
                    className="h-10 w-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="info" className="text-blue-500">Info</TabsTrigger>
                <TabsTrigger value="warning" className="text-amber-500">Warnings</TabsTrigger>
                <TabsTrigger value="error" className="text-red-500">Errors</TabsTrigger>
                <TabsTrigger value="debug" className="text-purple-500">Debug</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="border rounded-md max-h-96 overflow-auto">
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
                  <span>Loading logs...</span>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-muted-foreground">
                  <Filter className="h-8 w-8 mb-2" />
                  <span>No logs matching your filters</span>
                  {(levelFilter !== '' || sourceFilter !== '' || searchTerm !== '') && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => {
                        setLevelFilter('');
                        setSourceFilter('');
                        setSearchTerm('');
                        setActiveTab('all');
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className={cn(
                      "p-3 hover:bg-muted/50",
                      log.level === 'error' && "bg-red-50 hover:bg-red-100/50",
                      log.level === 'warning' && "bg-amber-50 hover:bg-amber-100/50"
                    )}>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getLogIcon(log.level)}
                          <span className="font-medium">{log.source}</span>
                          {getLogLevelBadge(log.level)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(log.timestamp)}</span>
                          </div>
                          <div>{formatDate(log.timestamp)}</div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopyLog(log)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm">{log.message}</div>
                      
                      {log.details && (
                        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogViewer;
