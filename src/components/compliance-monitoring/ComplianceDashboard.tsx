
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Chart from '@/components/dashboard/Chart';
import CompactMetric from '@/components/dashboard/CompactMetric';
import { ComplianceFrameworkCard } from './ComplianceFrameworkCard';
import { ComplianceHeatmap } from './ComplianceHeatmap';
import { ComplianceAlertPanel } from './ComplianceAlertPanel';
import { 
  mockFrameworks, 
  mockBusinessUnits, 
  mockAlerts, 
  mockHeatmapData
} from './mockData';
import { 
  Settings, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Calendar, 
  Filter
} from 'lucide-react';
import { UserRole } from './types';

interface ComplianceDashboardProps {
  onFrameworkSelect: (frameworkId: string) => void;
  onSettingsClick: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  onFrameworkSelect,
  onSettingsClick,
  userRole,
  onRoleChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'alerts'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  
  // Filter frameworks based on search query
  const filteredFrameworks = mockFrameworks.filter(framework => 
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate overall compliance stats
  const overallComplianceScore = Math.round(
    mockFrameworks.reduce((sum, framework) => sum + framework.complianceScore, 0) / mockFrameworks.length
  );
  
  const totalAlerts = mockAlerts.length;
  const criticalAlerts = mockAlerts.filter(alert => alert.severity === 'critical').length;
  
  // Total number of controls across all frameworks (removing duplicates)
  const uniqueControls = new Set();
  mockFrameworks.forEach(framework => {
    uniqueControls.add(framework.totalControls);
  });
  const totalControls = uniqueControls.size;
  
  // Generate data for compliance trend chart
  const trendChartData = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 75 },
    { month: 'Mar', score: 74 },
    { month: 'Apr', score: 78 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 79 },
    { month: 'Aug', score: 83 },
    { month: 'Sep', score: 85 },
    { month: 'Oct', score: 84 },
    { month: 'Nov', score: 86 },
    { month: 'Dec', score: overallComplianceScore }
  ];
  
  const trendChartSeries = [
    { name: 'Compliance Score', dataKey: 'score', color: '#4ade80' }
  ];
  
  // Framework breakdown data for chart
  const frameworkChartData = mockFrameworks.map(framework => ({
    name: framework.name,
    score: framework.complianceScore
  }));
  
  const frameworkChartSeries = [
    { name: 'Compliance Score', dataKey: 'score', color: '#8b5cf6' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Compliance Monitoring</h1>
          <p className="text-muted-foreground mt-1">Unified view of compliance status, gaps, and evidence</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
            <span className="text-sm font-medium">Role:</span>
            <select
              value={userRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value="executive">Executive</option>
              <option value="compliance-officer">Compliance Officer</option>
              <option value="control-owner">Control Owner</option>
            </select>
          </div>
          
          <Button variant="outline" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CompactMetric
          label="Overall Compliance"
          value={`${overallComplianceScore}%`}
          icon="gauge"
          trend={{
            direction: overallComplianceScore > 80 ? 'up' : overallComplianceScore < 70 ? 'down' : 'neutral',
            value: 3
          }}
          tooltip="Average compliance score across all frameworks"
          accentColor="#8b5cf6"
          variant="card"
        />
        
        <CompactMetric
          label="Active Frameworks"
          value={mockFrameworks.length}
          icon="chart-bar"
          tooltip="Number of compliance frameworks being monitored"
          variant="card"
        />
        
        <CompactMetric
          label="Open Alerts"
          value={totalAlerts}
          icon="info"
          trend={{
            direction: criticalAlerts > 0 ? 'down' : 'up',
            value: criticalAlerts > 0 ? criticalAlerts : 0
          }}
          tooltip={`Includes ${criticalAlerts} critical alerts requiring immediate attention`}
          variant="card"
        />
        
        <CompactMetric
          label="Controls Monitored"
          value={totalControls}
          icon="check"
          tooltip="Total number of unique controls across all frameworks"
          variant="card"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="heatmap">
              <TrendingUp className="h-4 w-4 mr-2" />
              Compliance Heatmap
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search frameworks..."
                className="pl-9 w-[200px] md:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Compliance Score Trend</CardTitle>
                <CardDescription>12-month rolling compliance score</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  title=""
                  data={trendChartData}
                  series={trendChartSeries}
                  type="line"
                  xAxisKey="month"
                  height={300}
                  showGrid={true}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Framework Breakdown</CardTitle>
                <CardDescription>Compliance score by framework</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  title=""
                  data={frameworkChartData}
                  series={frameworkChartSeries}
                  type="bar"
                  xAxisKey="name"
                  height={300}
                  showGrid={true}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Compliance Frameworks</h2>
              <Badge variant="outline" className="font-normal">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Updated: {new Date().toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredFrameworks.map((framework) => (
                <ComplianceFrameworkCard
                  key={framework.id}
                  framework={framework}
                  onClick={() => onFrameworkSelect(framework.id)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Heatmap</CardTitle>
              <CardDescription>
                Compliance status across business units and frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceHeatmap 
                data={mockHeatmapData} 
                frameworks={mockFrameworks}
                businessUnits={mockBusinessUnits}
                onCellClick={(frameworkId) => onFrameworkSelect(frameworkId)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>
                Recent alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceAlertPanel 
                alerts={mockAlerts}
                onAlertClick={(frameworkId) => frameworkId && onFrameworkSelect(frameworkId)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
