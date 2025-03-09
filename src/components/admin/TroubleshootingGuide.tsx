
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Server, Database, Globe, Zap, Code } from 'lucide-react';

const TroubleshootingGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Troubleshooting Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Use this guide to diagnose and resolve common system issues.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex gap-2">
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                API Connection Issues
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check if the API server is running and accessible</li>
                <li>Verify network connectivity and firewall settings</li>
                <li>Confirm API endpoints are correctly configured in the frontend</li>
                <li>Examine browser console for CORS or connection errors</li>
                <li>Try an API testing tool like Postman to test the endpoints directly</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="flex gap-2">
              <span className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Service Availability Problems
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Restart the problematic service from the Services tab</li>
                <li>Check the service logs for error messages</li>
                <li>Verify service dependencies are all available and responding</li>
                <li>Check system resources (CPU, memory, disk space) on the server</li>
                <li>Examine configuration files for misconfiguration</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="flex gap-2">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Connection Failures
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify database service is running</li>
                <li>Check connection string configuration</li>
                <li>Ensure database credentials are correct</li>
                <li>Look for database locks or resource constraints</li>
                <li>Test connection using a database client tool</li>
                <li>Check database logs for errors or warnings</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="flex gap-2">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Performance Degradation
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analyze system metrics in the Overview tab</li>
                <li>Check for resource bottlenecks (CPU, memory, disk I/O, network)</li>
                <li>Review recent changes or deployments</li>
                <li>Look for long-running queries or processes</li>
                <li>Monitor request latency across different services</li>
                <li>Consider scaling resources or optimizing code</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="flex gap-2">
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Error Messages & Logs Analysis
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review system logs in the Logs tab</li>
                <li>Search for error patterns or recurring issues</li>
                <li>Check application logs for exceptions or stack traces</li>
                <li>Correlate errors across multiple services</li>
                <li>Look for timestamp patterns to identify related issues</li>
                <li>Use log levels to filter critical errors first</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TroubleshootingGuide;
