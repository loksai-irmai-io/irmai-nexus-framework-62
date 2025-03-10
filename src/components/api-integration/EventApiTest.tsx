
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/apiClient';
import { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Event {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: string;
  category: string;
}

interface ProcessedEventLog {
  id: string;
  eventCount: number;
  caseCount: number;
  bpmnXml: string;
  activities: string[];
}

interface ApiResponse {
  status: string;
  data?: Event[] | Event | ProcessedEventLog;
  count?: number;
  message?: string;
}

export default function EventApiTest() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('events');
  const [processedLog, setProcessedLog] = useState<ProcessedEventLog | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<ApiResponse>('/events');
      
      if (response.status === 'success' && response.data && Array.isArray(response.data)) {
        setEvents(response.data);
        toast.success(`Loaded ${response.data.length} events from API`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      toast.error('Failed to fetch events from API');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processEventLog = async (file: File) => {
    setUploadLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.uploadFile<ApiResponse>('/processdiscovery/eventlog', formData);
      
      if (response.status === 'success' && response.data) {
        const processedData = response.data as ProcessedEventLog;
        setProcessedLog(processedData);
        setActiveTab('processedLog');
        toast.success(`Processed event log with ${processedData.eventCount} events`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error processing event log:', err);
      setError(err instanceof Error ? err.message : 'Failed to process event log');
      toast.error('Failed to process event log');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`Uploading ${file.name}...`);
      processEventLog(file);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Integration Test</CardTitle>
        <CardDescription>
          Test connection to the FastAPI backend by fetching events and processing event logs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="events">API Events</TabsTrigger>
            <TabsTrigger value="processedLog">Processed Event Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant={getSeverityColor(event.severity) as any}>{event.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Category: {event.category}</span>
                      <span>Status: {event.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <p className="text-center py-8 text-gray-500">No events loaded. Click the button below to fetch from API.</p>
            ) : null}
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processedLog">
            <div className="space-y-4">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              
              {uploadLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-gray-600">Processing event log...</p>
                </div>
              ) : processedLog ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 bg-card">
                      <h3 className="font-medium text-lg mb-1">Events</h3>
                      <p className="text-3xl font-bold">{processedLog.eventCount}</p>
                    </div>
                    <div className="border rounded-md p-4 bg-card">
                      <h3 className="font-medium text-lg mb-1">Cases</h3>
                      <p className="text-3xl font-bold">{processedLog.caseCount}</p>
                    </div>
                    <div className="border rounded-md p-4 bg-card">
                      <h3 className="font-medium text-lg mb-1">Activities</h3>
                      <p className="text-3xl font-bold">{processedLog.activities.length}</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {processedLog.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{activity}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-lg mb-2">BPMN Diagram</h3>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <pre className="text-xs overflow-auto max-h-60">{processedLog.bpmnXml}</pre>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is a simple representation. In a production system, you would render this XML
                      using a BPMN rendering library like bpmn.io/bpmn-js.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md border-dashed flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Event Log Processed</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    Upload a CSV file containing event log data to generate a process model
                  </p>
                  <Button onClick={handleFileUpload} variant="outline">Upload Event Log</Button>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-4">
          {activeTab === 'events' ? (
            <Button 
              onClick={fetchEvents} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Events...
                </>
              ) : (
                'Fetch Events from API'
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleFileUpload} 
              disabled={uploadLoading}
              className="w-full"
            >
              {uploadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upload Event Log'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
