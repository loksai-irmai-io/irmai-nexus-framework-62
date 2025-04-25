
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ServerCrash } from 'lucide-react';
import { SystemHealth } from '@/services/adminService';

interface SystemAlertsProps {
  healthData?: SystemHealth;
  error?: Error | null;
  isError: boolean;
}

const SystemAlerts: React.FC<SystemAlertsProps> = ({ healthData, error, isError }) => {
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch system health data: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      {healthData?.overall.status === 'critical' && (
        <Alert variant="destructive" className="border-red-600 bg-red-50 text-red-900">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Critical System Alert</AlertTitle>
          <AlertDescription className="text-red-800">
            {healthData.overall.message}. Please check the troubleshooting guide immediately.
          </AlertDescription>
        </Alert>
      )}

      {healthData?.overall.status === 'degraded' && (
        <Alert variant="default" className="border-amber-500 bg-amber-50 text-amber-900">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Performance Degradation</AlertTitle>
          <AlertDescription className="text-amber-800">
            {healthData.overall.message}. Some services may be experiencing issues.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SystemAlerts;
