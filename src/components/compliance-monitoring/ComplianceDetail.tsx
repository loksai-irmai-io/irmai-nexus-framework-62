
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShieldCheck, 
  Shield, 
  Folder, 
  ArrowUpDown,
  Clock,
  CalendarClock,
  Users,
  AlertTriangle,
  CircleAlert,
  FileText,
  CheckCircle,
  XCircle,
  Layers,
  Play,
  MessageSquare,
  Download,
  LightbulbIcon,
  PlusCircle
} from 'lucide-react';
import { UserRole } from './types';
import { 
  getFrameworkById, 
  getControlsByFramework, 
  getGapsByFramework,
  getAlertsByFramework,
  getEvidenceByControl 
} from './mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Chart from '@/components/dashboard/Chart';

interface ComplianceDetailProps {
  frameworkId: string;
  onBack: () => void;
  userRole: UserRole;
}

export const ComplianceDetail: React.FC<ComplianceDetailProps> = ({ 
  frameworkId, 
  onBack,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'gaps' | 'evidence' | 'mapping'>('controls');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  
  const framework = getFrameworkById(frameworkId);
  const controls = getControlsByFramework(frameworkId);
  const gaps = getGapsByFramework(frameworkId);
  const alerts = getAlertsByFramework(frameworkId);
  
  if (!framework) {
    return (
      <div className="text-center py-8">
        <p>Framework not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  const filteredControls = controls.filter(control => 
    control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    control.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'partially-compliant':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'not-tested':
        return <CircleAlert className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="success">Compliant</Badge>;
      case 'non-compliant':
        return <Badge variant="destructive">Non-Compliant</Badge>;
      case 'partially-compliant':
        return <Badge variant="warning">Partially Compliant</Badge>;
      case 'not-tested':
        return <Badge variant="info">Not Tested</Badge>;
      default:
        return null;
    }
  };
  
  const getAutomationBadge = (level: string) => {
    switch (level) {
      case 'full':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Automated</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Semi-Automated</Badge>;
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      default:
        return null;
    }
  };
  
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline">Low Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Generate control status chart data
  const controlStatusChartData = [
    { name: 'Compliant', value: framework.passedControls },
    { name: 'Non-Compliant', value: framework.failedControls },
    { name: 'Not Tested', value: framework.notTestedControls }
  ];
  
  const controlStatusChartSeries = [
    { name: 'Status', dataKey: 'value', color: '#10b981' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center mb-1">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 h-8">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Badge variant="outline" className="mr-2">{framework.priority} Priority</Badge>
            {framework.complianceScore >= 90 ? (
              <Badge variant="success">High Compliance</Badge>
            ) : framework.complianceScore >= 70 ? (
              <Badge variant="warning">Medium Compliance</Badge>
            ) : (
              <Badge variant="destructive">Low Compliance</Badge>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold">{framework.name}</h1>
          <p className="text-muted-foreground">{framework.description}</p>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{framework.totalControls} Controls</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Owner: {framework.owners.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Next Assessment: {new Date(framework.nextAssessment).toLocaleDateString()}</span>
            </div>
            {alerts.length > 0 && (
              <div className="flex items-center text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>{alerts.length} Active Alerts</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${
                framework.complianceScore >= 90 ? 'text-green-600' : 
                framework.complianceScore >= 70 ? 'text-amber-600' : 
                'text-red-600'
              }`}>
                {framework.complianceScore}%
              </span>
              
              <span className={`ml-2 text-sm ${
                framework.trend === 'up' ? 'text-emerald-600' : 
                framework.trend === 'down' ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {framework.trend === 'up' ? '↗' : framework.trend === 'down' ? '↘' : '→'}
                {Math.abs(framework.complianceScore - framework.previousScore)}%
              </span>
            </div>
            
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-muted-foreground">Passing:</span>
                </div>
                <span className="font-medium">{framework.passedControls}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
                  <span className="text-muted-foreground">Failing:</span>
                </div>
                <span className="font-medium">{framework.failedControls}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-300 mr-1.5"></div>
                  <span className="text-muted-foreground">Not Tested:</span>
                </div>
                <span className="font-medium">{framework.notTestedControls}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <CalendarClock className="h-4 w-4 mr-2" />
              Schedule Assessment
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="controls">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="gaps">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Gaps
                </TabsTrigger>
                <TabsTrigger value="evidence">
                  <FileText className="h-4 w-4 mr-2" />
                  Evidence Vault
                </TabsTrigger>
                <TabsTrigger value="mapping">
                  <Layers className="h-4 w-4 mr-2" />
                  Framework Mapping
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-9 w-[200px] md:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="controls" className="space-y-4">
              {filteredControls.map(control => (
                <Card 
                  key={control.id} 
                  className={`transition-shadow hover:shadow-md cursor-pointer ${
                    selectedControlId === control.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedControlId(
                    selectedControlId === control.id ? null : control.id
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {getStatusIcon(control.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{control.name}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(control.status)}
                            {getAutomationBadge(control.automationLevel)}
                            {getRiskBadge(control.risk)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          {control.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>Owner: {control.owner}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>Last Tested: {new Date(control.lastTested).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarClock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>Next Test: {new Date(control.nextTest).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{control.evidenceCount} Evidence Items</span>
                          </div>
                          {control.frameworks.length > 1 && (
                            <div className="flex items-center">
                              <Layers className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Maps to {control.frameworks.length} frameworks</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedControlId === control.id && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Evidence & Testing</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              View All Evidence
                            </Button>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Run Test
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {getEvidenceByControl(control.id).map(evidence => (
                            <div key={evidence.id} className="border rounded-md p-3 bg-muted/30">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-sm">{evidence.name}</h5>
                                  <div className="text-xs text-muted-foreground mt-1 mb-2">
                                    Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadedAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge 
                                  variant={
                                    evidence.status === 'verified' ? 'success' : 
                                    evidence.status === 'pending' ? 'warning' : 'destructive'
                                  }
                                  className="text-[10px]"
                                >
                                  {evidence.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center text-xs text-blue-600">
                                  <FileText className="h-3 w-3 mr-1" />
                                  <span>View Document</span>
                                </div>
                                <div className="flex items-center text-xs text-blue-600">
                                  <Download className="h-3 w-3 mr-1" />
                                  <span>Download</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {control.status === 'non-compliant' && (
                          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start">
                              <LightbulbIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="flex items-center mb-1">
                                  <Badge variant="info" className="bg-blue-600 text-[10px] h-4 mr-2">AI Insight</Badge>
                                  <span className="text-xs text-blue-700 dark:text-blue-400">Remediation Suggestion</span>
                                </div>
                                <p className="text-sm text-blue-900 dark:text-blue-300">
                                  Based on evidence and test results, this control requires updated documentation and more frequent testing. Consider implementing automated testing on a bi-weekly schedule.
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Accept Suggestion
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Provide Feedback
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="gaps" className="space-y-4">
              {gaps.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-600" />
                    <p>No compliance gaps identified</p>
                  </CardContent>
                </Card>
              ) : (
                gaps.map(gap => (
                  <Card key={gap.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <CircleAlert className="h-5 w-5 mr-4 mt-1 text-amber-600" />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{gap.requirement}</h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  gap.status === 'resolved' ? 'success' : 
                                  gap.status === 'in-progress' ? 'warning' : 'destructive'
                                }
                              >
                                {gap.status}
                              </Badge>
                              <Badge 
                                variant={
                                  gap.impact === 'high' ? 'destructive' : 
                                  gap.impact === 'medium' ? 'warning' : 'outline'
                                }
                              >
                                {gap.impact} Impact
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-3">
                            <div className="bg-muted/30 p-3 rounded-md">
                              <p className="text-xs font-medium mb-1">Current State</p>
                              <p className="text-sm">{gap.currentState}</p>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                              <p className="text-xs font-medium mb-1 text-blue-800 dark:text-blue-300">Expected State</p>
                              <p className="text-sm text-blue-900 dark:text-blue-200">{gap.expectedState}</p>
                            </div>
                          </div>
                          
                          {gap.remediation && (
                            <div className="mb-3">
                              <p className="text-xs font-medium mb-1">Remediation Plan</p>
                              <p className="text-sm">{gap.remediation}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                            {gap.assignedTo && (
                              <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span>Assigned to: {gap.assignedTo}</span>
                              </div>
                            )}
                            
                            {gap.dueDate && (
                              <div className="flex items-center">
                                <CalendarClock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span>Due by: {new Date(gap.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            {gap.controlId && (
                              <div className="flex items-center">
                                <Shield className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span>Related Control: {gap.controlId}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              Add Comment
                            </Button>
                            
                            {gap.status !== 'resolved' && (
                              <Button size="sm">
                                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                {gap.status === 'in-progress' ? 'Update Progress' : 'Start Remediation'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evidence Vault</CardTitle>
                  <CardDescription>
                    Centralized repository of all compliance evidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Folder className="h-10 w-10 mx-auto mb-2" />
                    <p>Evidence Vault content will be displayed here</p>
                    <p className="text-sm mt-2">This section is under development</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mapping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Framework Mapping</CardTitle>
                  <CardDescription>
                    Cross-reference controls with other compliance frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-10 w-10 mx-auto mb-2" />
                    <p>Framework mapping visualization will be displayed here</p>
                    <p className="text-sm mt-2">This section is under development</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Control Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                data={controlStatusChartData}
                series={[{ name: 'Controls', dataKey: 'value', color: '#10b981' }]}
                type="pie"
                xAxisKey="name"
                height={180}
                showLegend={true}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No active alerts</p>
                </div>
              ) : (
                alerts.slice(0, 3).map(alert => (
                  <div 
                    key={alert.id} 
                    className="border rounded-md p-3 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start">
                      <AlertTriangle className={`h-4 w-4 mr-2 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {alerts.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all {alerts.length} alerts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Related Frameworks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">SOC 2</span>
                  <Badge variant="outline">85% Match</Badge>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">NIST CSF</span>
                  <Badge variant="outline">62% Match</Badge>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GDPR</span>
                  <Badge variant="outline">45% Match</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
