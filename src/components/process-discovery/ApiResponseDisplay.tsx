
import React from 'react';
import { ApiResponse } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApiResponseDisplayProps {
  response: ApiResponse | null;
}

const ApiResponseDisplay: React.FC<ApiResponseDisplayProps> = ({ response }) => {
  if (!response) return null;

  const isSuccess = response.status === 'success';

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">API Response</CardTitle>
          <Badge variant={isSuccess ? "success" : "destructive"}>
            {response.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant={isSuccess ? "default" : "destructive"} className="mb-4">
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{isSuccess ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {response.message}
          </AlertDescription>
        </Alert>

        {response.bpmn && (
          <div>
            <h4 className="text-sm font-medium mb-2">BPMN Data Preview:</h4>
            <div className="bg-muted p-2 rounded-md max-h-40 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(response.bpmn, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiResponseDisplay;
