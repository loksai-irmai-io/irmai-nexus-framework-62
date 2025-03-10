
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import EventApiTest from '@/components/api-integration/EventApiTest';

const ApiIntegrations = () => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);
  const [testSuccess, setTestSuccess] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleEndpointToggle = (value: string) => {
    setSelectedEndpoints(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleTestConnection = () => {
    setConnecting(true);
    // Simulate API test connection
    setTimeout(() => {
      setConnecting(false);
      setTestSuccess(true);
    }, 1500);
  };

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">API Integrations</h2>
        </div>
        
        <Tabs defaultValue="fastapi" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fastapi">FastAPI</TabsTrigger>
            <TabsTrigger value="external">External APIs</TabsTrigger>
            <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fastapi" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column: API connection test */}
              <EventApiTest />
              
              {/* Right column: Backend connection info */}
              <Card>
                <CardHeader>
                  <CardTitle>Backend Connection</CardTitle>
                  <CardDescription>
                    Configure connection to your FastAPI backend
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Base URL</label>
                    <Input 
                      placeholder="http://localhost:8000/api" 
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The base URL of your FastAPI backend service
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Key (Optional)</label>
                    <Input 
                      placeholder="Enter your API key" 
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleTestConnection} disabled={!endpoint || connecting}>
                      {connecting ? 'Testing Connection...' : 'Test Connection'}
                    </Button>
                    
                    {testSuccess && (
                      <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded">
                        Connection successful!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Endpoints</CardTitle>
                <CardDescription>
                  FastAPI automatically generates interactive API documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="events">
                    <AccordionTrigger>Events API</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 ml-6 list-disc">
                        <li>
                          <strong>GET /api/events</strong>
                          <p className="text-sm text-gray-500">Retrieve all events from the system</p>
                        </li>
                        <li>
                          <strong>GET /api/events/{'{id}'}</strong>
                          <p className="text-sm text-gray-500">Retrieve a specific event by ID</p>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="health">
                    <AccordionTrigger>Health API</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 ml-6 list-disc">
                        <li>
                          <strong>GET /api/health</strong>
                          <p className="text-sm text-gray-500">Check the health status of the API</p>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    API Documentation (Swagger UI) available at:{' '}
                    <a 
                      href="http://localhost:8000/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      http://localhost:8000/docs
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="external" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>External API Configuration</CardTitle>
                <CardDescription>
                  Connect to third-party APIs for additional functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure and manage connections to external APIs that provide additional data sources and functionality.
                </p>
                
                {/* Placeholder for future external API configurations */}
                <div className="p-6 text-center border rounded-md bg-muted/10">
                  <p>External API configuration coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Set up webhooks to receive data from external systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure webhooks to allow external systems to push data to your application.
                </p>
                
                {/* Placeholder for future webhook configurations */}
                <div className="p-6 text-center border rounded-md bg-muted/10">
                  <p>Webhook configuration coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ApiIntegrations;
