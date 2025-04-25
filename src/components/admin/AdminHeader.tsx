
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  status: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return <Badge className="bg-green-500">Healthy</Badge>;
    case 'degraded':
      return <Badge variant="outline" className="bg-amber-500">Degraded</Badge>;
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ status, isLoading, onRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Admin & Dependencies</h1>
        <p className="text-muted-foreground">System monitoring and troubleshooting tools</p>
      </div>

      <div className="flex items-center gap-2">
        {status && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">System Status:</span>
            {getStatusBadge(status)}
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
