
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OutlierEvent } from './types';
import { 
  AlertTriangle, 
  ArrowUpDown, 
  Clock, 
  Search, 
  User, 
  Filter, 
  GitBranch,
  Timer,
  Scale,
  FileWarning,
  Shield,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Generate mock data for outlier events
const generateMockOutliers = (): OutlierEvent[] => {
  const outliers: OutlierEvent[] = [];
  const processes = ['Loan Application', 'Customer Onboarding', 'Claims Processing', 'Payment Verification'];
  const activities = ['Data Entry', 'Approval', 'Verification', 'Document Upload', 'Review'];
  const resources = ['System', 'Agent A', 'Agent B', 'Agent C', 'Manager'];
  
  for (let i = 1; i <= 20; i++) {
    const severity: any = i % 10 === 0 ? 'critical' : i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low';
    const category: any = i % 5 === 0 ? 'sequence_violation' : 
                      i % 4 === 0 ? 'time_outlier' : 
                      i % 3 === 0 ? 'resource_imbalance' : 
                      i % 2 === 0 ? 'data_quality' : 'compliance_breach';
    
    const type: any = i % 5 === 0 ? 'process' : 
                  i % 4 === 0 ? 'activity' : 
                  i % 3 === 0 ? 'resource' : 
                  i % 2 === 0 ? 'data' : 'compliance';
    
    const process = processes[Math.floor(Math.random() * processes.length)];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    
    // Create title based on category and process
    let title = '';
    switch (category) {
      case 'sequence_violation':
        title = `Sequence violation in ${process}`;
        break;
      case 'time_outlier':
        title = `Unusual duration in ${process} ${activity}`;
        break;
      case 'resource_imbalance':
        title = `Resource allocation issue with ${resource}`;
        break;
      case 'data_quality':
        title = `Data quality issue in ${process}`;
        break;
      case 'compliance_breach':
        title = `Compliance issue detected in ${process}`;
        break;
    }
    
    // Generate date in the past week
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    outliers.push({
      id: i,
      title,
      description: `Detailed description of the ${category} issue detected in the ${process} process`,
      timestamp: date.toISOString(),
      category,
      severity,
      status: i % 7 === 0 ? 'validated' : i % 3 === 0 ? 'rejected' : 'pending',
      type,
      deviation: Math.floor(Math.random() * 300),
      process,
      activity: i % 2 === 0 ? activity : undefined,
      resource: i % 3 === 0 ? resource : undefined,
      assignedTo: i % 4 === 0 ? 'John Smith' : i % 5 === 0 ? 'Sarah Jones' : undefined
    });
  }
  
  return outliers;
};

interface OutlierListProps {
  onSelectOutlier: (id: number) => void;
}

const OutlierList: React.FC<OutlierListProps> = ({ onSelectOutlier }) => {
  const [outliers] = useState<OutlierEvent[]>(generateMockOutliers());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter outliers based on search query
  const filteredOutliers = outliers.filter(outlier => 
    outlier.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlier.process.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (outlier.activity && outlier.activity.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sequence_violation':
        return <GitBranch className="h-4 w-4" />;
      case 'time_outlier':
        return <Timer className="h-4 w-4" />;
      case 'resource_imbalance':
        return <Scale className="h-4 w-4" />;
      case 'data_quality':
        return <FileWarning className="h-4 w-4" />;
      case 'compliance_breach':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    let color = "";
    switch (severity) {
      case 'critical':
        color = "bg-red-500 text-white hover:bg-red-600";
        break;
      case 'high':
        color = "bg-orange-500 text-white hover:bg-orange-600";
        break;
      case 'medium':
        color = "bg-yellow-500 text-black hover:bg-yellow-600";
        break;
      case 'low':
        color = "bg-green-500 text-white hover:bg-green-600";
        break;
      default:
        color = "bg-blue-500 text-white hover:bg-blue-600";
    }
    
    return (
      <Badge className={color}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case 'validated':
        color = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
        break;
      case 'rejected':
        color = "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
        break;
      case 'pending':
        color = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
        break;
      default:
        color = "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
    
    return (
      <Badge variant="outline" className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Outlier Events</CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search outliers..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center">
                  Outlier Event
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Process</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Timestamp
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOutliers.map((outlier) => (
              <TableRow 
                key={outlier.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => onSelectOutlier(outlier.id)}
              >
                <TableCell className="font-medium">{outlier.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(outlier.category)}
                    <span>
                      {outlier.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{outlier.process}</TableCell>
                <TableCell>{formatTimestamp(outlier.timestamp)}</TableCell>
                <TableCell>{getSeverityBadge(outlier.severity)}</TableCell>
                <TableCell>{getStatusBadge(outlier.status)}</TableCell>
                <TableCell>
                  {outlier.assignedTo ? (
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{outlier.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={e => {
                        e.stopPropagation();
                        onSelectOutlier(outlier.id);
                      }}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Assign</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                      <DropdownMenuItem>Create Task</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Raise Incident</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OutlierList;
