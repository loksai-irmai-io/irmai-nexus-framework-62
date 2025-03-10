
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/apiClient';

interface Event {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: string;
  category: string;
}

interface ApiResponse {
  status: string;
  data?: Event[] | Event;
  count?: number;
  message?: string;
}

export default function EventApiTest() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          Test connection to the FastAPI backend by fetching events
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
