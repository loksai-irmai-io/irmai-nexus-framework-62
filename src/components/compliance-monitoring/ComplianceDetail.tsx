
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Eye, 
  RotateCw, 
  Upload, 
  ChevronUp, 
  ChevronDown, 
  Shield,
  ShieldCheck,
  ShieldAlert,
  Play,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Calendar,
  AlertCircle,
  Gauge,
  Sparkles,
  BarChart,
  InfoCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFrameworks, mockControls, mockEvidenceItems } from './mockData';
import { ComplianceFramework, ComplianceControl, EvidenceItem, UserRole } from './types';
import { EvidenceVaultPanel } from './EvidenceVaultPanel';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [framework, setFramework] = useState<ComplianceFramework | null>(null);
  const [controls, setControls] = useState<ComplianceControl[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  useEffect(() => {
    // Find the framework
    const foundFramework = mockFrameworks.find(f => f.id === frameworkId);
    if (foundFramework) {
      setFramework(foundFramework);
    }
    
    // Filter controls related to this framework
    const relatedControls = mockControls.filter(control => 
      control.frameworks.includes(frameworkId)
    );
    setControls(relatedControls);
    
    // Get related evidence items
    const relatedEvidence = mockEvidenceItems.filter(item => 
      relatedControls.some(control => control.id === item.controlId)
    );
    setEvidenceItems(relatedEvidence);
    
    // Set the first control as selected by default
    if (relatedControls.length > 0) {
      setSelectedControl(relatedControls[0]);
    }
  }, [frameworkId]);

  const handleRunTest = () => {
    setIsRunningTest(true);
    setTestProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setTestProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunningTest(false);
            // Update control status based on test result
            if (selectedControl) {
              const updatedControl = { ...selectedControl };
              // Simulate a random test result
              const testPassed = Math.random() > 0.3;
              updatedControl.status = testPassed ? 'compliant' : 'non-compliant';
              updatedControl.lastTested = new Date().toISOString();
              setSelectedControl(updatedControl);
              
              // Create a new evidence item for this test
              const newEvidence: EvidenceItem = {
                id: `evidence-${Date.now()}`,
                controlId: selectedControl.id,
                name: `Automated Test Result - ${new Date().toLocaleString()}`,
                type: 'report',
                uploadedBy: 'Automated System',
                uploadedAt: new Date().toISOString(),
                status: 'verified',
                url: '#'
              };
              
              setEvidenceItems(prev => [newEvidence, ...prev]);
            }
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Compliant
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Non-Compliant
          </Badge>
        );
      case 'partially-compliant':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            Partially Compliant
          </Badge>
        );
      case 'not-tested':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Not Tested
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAutomationBadge = (level: string) => {
    switch (level) {
      case 'full':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Fully Automated
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Partially Automated
          </Badge>
        );
      case 'manual':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Manual
          </Badge>
        );
      default:
        return null;
    }
  };

  // Generate historical test result data with consistent properties
  const testHistoryData = [
    { date: '01/15/2023', result: 'pass', evidence: 1, tester: 'Automated System' },
    { date: '04/20/2023', result: 'pass', evidence: 1, tester: 'Automated System' },
    { date: '07/25/2023', result: 'fail', evidence: 2, tester: 'Automated System' },
    { date: '10/30/2023', result: 'pass', evidence: 1, tester: 'Automated System' },
    { date: '01/05/2024', result: 'pass', evidence: 1, tester: 'Automated System' },
    { date: '04/10/2024', result: 'pass', evidence: 1, tester: 'Automated System' },
  ];
  
  // Control status distribution data
  const controlStatusData = [
    { name: 'Compliant', value: controls.filter(c => c.status === 'compliant').length },
    { name: 'Non-Compliant', value: controls.filter(c => c.status === 'non-compliant').length },
    { name: 'Partially Compliant', value: controls.filter(c => c.status === 'partially-compliant').length },
    { name: 'Not Tested', value: controls.filter(c => c.status === 'not-tested').length }
  ];
  
  const controlStatusSeries = [
    { name: 'Controls', dataKey: 'value', color: '#8b5cf6' }
  ];

  if (!framework) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading framework details...</h2>
          <p className="text-muted-foreground">Please wait while we load the data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">{framework.name}</h1>
          {getStatusBadge(framework.passedControls > framework.failedControls ? 'compliant' : 'partially-compliant')}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Last Updated: {new Date(framework.lastUpdated).toLocaleDateString()}
          </Badge>
          
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Framework Overview</CardTitle>
              <CardDescription>{framework.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Compliance Score</span>
                  <span className="text-2xl font-bold text-blue-600">{framework.complianceScore}%</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Next Assessment</span>
                  <span className="font-semibold">
                    {new Date(framework.nextAssessment).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Control Status</span>
                  <span className="text-xs font-semibold">
                    {framework.passedControls} / {framework.totalControls} Controls Passing
                  </span>
                </div>
                <Progress value={(framework.passedControls / framework.totalControls) * 100} className="h-2" />
              </div>
              
              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex items-center text-sm">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  <span>{framework.passedControls} Passing</span>
                </div>
                <div className="flex items-center text-sm">
                  <ShieldAlert className="h-4 w-4 mr-2 text-red-600" />
                  <span>{framework.failedControls} Failing</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{framework.notTestedControls} Not Tested</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Owners</h4>
                <div className="space-y-1">
                  {framework.owners.map((owner, index) => (
                    <div key={index} className="text-sm flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {owner}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <Button className="w-full">
                <BarChart className="h-4 w-4 mr-2" />
                View Framework Analytics
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Control Status</CardTitle>
              <CardDescription>Distribution of control compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                data={controlStatusData}
                series={controlStatusSeries}
                type="pie"
                height={200}
                showPercentages={true}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Compliant</span>
                  </div>
                  <span className="font-semibold">{controls.filter(c => c.status === 'compliant').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Non-Compliant</span>
                  </div>
                  <span className="font-semibold">{controls.filter(c => c.status === 'non-compliant').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    <span>Partially Compliant</span>
                  </div>
                  <span className="font-semibold">{controls.filter(c => c.status === 'partially-compliant').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                    <span>Not Tested</span>
                  </div>
                  <span className="font-semibold">{controls.filter(c => c.status === 'not-tested').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="controls">
            <TabsList className="mb-4">
              <TabsTrigger value="controls">
                <Shield className="h-4 w-4 mr-2" />
                Controls
              </TabsTrigger>
              <TabsTrigger value="evidence">
                <FileText className="h-4 w-4 mr-2" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="gaps">
                <AlertCircle className="h-4 w-4 mr-2" />
                Gaps
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Calendar className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="controls" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Controls ({controls.length})</h2>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search controls..." 
                    className="w-[200px]" 
                  />
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    All Controls
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {controls.map((control) => (
                  <Card 
                    key={control.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${selectedControl?.id === control.id ? 'border-blue-500 shadow-md' : ''}`}
                    onClick={() => setSelectedControl(control)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{control.name}</h3>
                          <p className="text-sm text-muted-foreground">{control.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(control.status)}
                          {getAutomationBadge(control.automationLevel)}
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Owner</p>
                          <p className="font-medium">{control.owner}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Tested</p>
                          <p className="font-medium">{new Date(control.lastTested).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Evidence</p>
                          <p className="font-medium">{control.evidenceCount} items</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-end text-xs text-blue-600">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="evidence">
              <Card>
                <CardHeader>
                  <CardTitle>Evidence Vault</CardTitle>
                  <CardDescription>All evidence items for {framework.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <EvidenceVaultPanel 
                    evidenceItems={evidenceItems}
                    onEvidenceClick={(controlId) => {
                      const foundControl = controls.find(c => c.id === controlId);
                      if (foundControl) {
                        setSelectedControl(foundControl);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gaps">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Gaps</CardTitle>
                  <CardDescription>Identified gaps in compliance with {framework.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {controls.filter(c => c.status !== 'compliant').map((control) => (
                      <Card key={control.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{control.name}</h3>
                              <p className="text-sm text-muted-foreground">{control.description}</p>
                            </div>
                            {getStatusBadge(control.status)}
                          </div>
                          
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                            <div className="flex items-start">
                              <Sparkles className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-amber-800">AI Analysis</p>
                                <p className="text-amber-700">
                                  This control requires additional evidence to meet {framework.name} compliance standards. 
                                  Consider implementing automated monitoring for real-time verification.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                              <FileText className="h-4 w-4 mr-2" />
                              View Control Details
                            </Button>
                            <Button className="w-full">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Evidence
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {controls.filter(c => c.status !== 'compliant').length === 0 && (
                      <div className="text-center py-10">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">No Gaps Found</h3>
                        <p className="text-muted-foreground">All controls are currently compliant</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Timeline</CardTitle>
                  <CardDescription>History of compliance activities for {framework.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Timeline events */}
                    <div className="relative pl-6 border-l-2 border-muted space-y-8">
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-green-500 border-4 border-background">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h4 className="font-semibold">Framework Assessment Completed</h4>
                            <Badge variant="outline" className="ml-2">Latest</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Apr 15, 2024 - 11:30 AM</p>
                          <p className="text-sm">
                            Quarterly assessment completed with a compliance score of {framework.complianceScore}%. 
                            {framework.complianceScore > framework.previousScore 
                              ? ` Improved by ${framework.complianceScore - framework.previousScore}% from previous assessment.`
                              : ` Decreased by ${framework.previousScore - framework.complianceScore}% from previous assessment.`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-blue-500 border-4 border-background">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Evidence Collection</h4>
                          <p className="text-sm text-muted-foreground">Apr 10, 2024 - 02:45 PM</p>
                          <p className="text-sm">
                            15 new evidence items collected for various controls. 
                            3 items flagged for manual review.
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-amber-500 border-4 border-background">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Control Failure Detected</h4>
                          <p className="text-sm text-muted-foreground">Mar 28, 2024 - 09:15 AM</p>
                          <p className="text-sm">
                            Password policy control failed automated testing. 
                            Remediation plan created and assigned to IT Security team.
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] p-1 rounded-full bg-purple-500 border-4 border-background">
                          <RotateCw className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Framework Testing Initiated</h4>
                          <p className="text-sm text-muted-foreground">Mar 15, 2024 - 10:00 AM</p>
                          <p className="text-sm">
                            Quarterly automated testing cycle initiated for all {framework.totalControls} controls.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedControl && (
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Control Details - {selectedControl.id}</CardTitle>
                <CardDescription className="mt-1">{selectedControl.name}</CardDescription>
              </div>
              {getStatusBadge(selectedControl.status)}
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Control Information</TabsTrigger>
                <TabsTrigger value="test">Test Results</TabsTrigger>
                <TabsTrigger value="evidence">Evidence ({selectedControl.evidenceCount})</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Control Description</h3>
                    <p className="text-sm">{selectedControl.description}</p>
                    
                    <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-2">Related Frameworks</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedControl.frameworks.map((fw, index) => {
                        const framework = mockFrameworks.find(f => f.id === fw);
                        return (
                          <Badge key={index} variant="secondary">
                            {framework ? framework.name : fw}
                          </Badge>
                        );
                      })}
                    </div>
                    
                    <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-2">Testing Schedule</h3>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Last Tested</p>
                        <p className="font-semibold text-sm">{new Date(selectedControl.lastTested).toLocaleDateString()}</p>
                      </div>
                      <div className="mx-4 h-6 border-l border-gray-200"></div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Next Test</p>
                        <p className="font-semibold text-sm">{new Date(selectedControl.nextTest).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Control Metadata</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-xs text-muted-foreground">Control ID</dt>
                          <dd className="font-medium">{selectedControl.id}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">Owner</dt>
                          <dd className="font-medium">{selectedControl.owner}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">Risk Level</dt>
                          <dd className="font-medium capitalize">{selectedControl.risk}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground">Automation</dt>
                          <dd className="font-medium capitalize">{selectedControl.automationLevel}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {selectedControl.automationLevel !== 'manual' && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">Automated Testing</h3>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleRunTest} 
                            disabled={isRunningTest}
                            className="flex-1"
                          >
                            {isRunningTest ? (
                              <>
                                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Run Test Now
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {isRunningTest && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span>Collecting evidence...</span>
                              <span>{testProgress}%</span>
                            </div>
                            <Progress value={testProgress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
                          <p className="text-blue-700">
                            <AlertCircle className="h-4 w-4 inline-block mr-1" />
                            Running this test will automatically collect evidence and update the control status.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="requirements">
                    <AccordionTrigger className="text-sm font-medium">
                      Regulatory Requirements
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 border rounded-md">
                          <h4 className="font-medium">ISO 27001 - A.9.4.3</h4>
                          <p className="text-muted-foreground">
                            Password management system shall be interactive and shall ensure quality passwords.
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <h4 className="font-medium">SOC 2 - CC6.1</h4>
                          <p className="text-muted-foreground">
                            The entity implements logical access security software, infrastructure, and architectures for 
                            authentication and authorization of users.
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <h4 className="font-medium">NIST 800-53 - IA-5</h4>
                          <p className="text-muted-foreground">
                            The organization manages information system authenticators by establishing and implementing
                            authenticator content and requirements.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              <TabsContent value="test" className="space-y-4">
                <h3 className="text-lg font-medium">Test History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Result</th>
                        <th className="p-3 text-left font-medium">Evidence</th>
                        <th className="p-3 text-left font-medium">Tester</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        {
                          date: new Date().toLocaleDateString(),
                          result: selectedControl.status === 'compliant' ? 'pass' : 'fail',
                          evidence: 2,
                          tester: 'Automated System',
                        },
                        ...testHistoryData
                      ].map((test, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-3">{test.date}</td>
                          <td className="p-3">
                            {test.result === 'pass' ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Pass
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Fail
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">{test.evidence} items</td>
                          <td className="p-3">{test.tester}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="evidence">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Control Evidence</h3>
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Evidence
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    {evidenceItems.filter(item => item.controlId === selectedControl.id).length > 0 ? (
                      <div className="divide-y">
                        {evidenceItems
                          .filter(item => item.controlId === selectedControl.id)
                          .map((item, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50">
                              <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <FileText className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span>Uploaded by {item.uploadedBy}</span>
                                    <span>•</span>
                                    <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                                      {item.status}
                                    </Badge>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">No Evidence Found</h3>
                        <p className="text-muted-foreground">Upload evidence to support this control</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="workflow">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Control Approval Workflow</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Current Status</h4>
                            {getStatusBadge(selectedControl.status)}
                          </div>
                          
                          <div className="space-y-3 mt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Last Reviewer</span>
                              <span className="font-medium">Alex Thompson</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Reviewed On</span>
                              <span className="font-medium">April 12, 2024</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next Review</span>
                              <span className="font-medium">July 12, 2024</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Remediation Actions</h4>
                          
                          {selectedControl.status !== 'compliant' ? (
                            <div className="space-y-4">
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                                <p className="text-amber-800">
                                  <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                                  This control requires remediation actions to achieve compliance.
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Action Plan</label>
                                <Textarea placeholder="Describe remediation steps..." />
                              </div>
                              
                              <div className="flex justify-between gap-2">
                                <Button variant="outline" className="flex-1">
                                  Set Reminder
                                </Button>
                                <Button className="flex-1">
                                  Submit for Review
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                              <p className="text-sm font-medium">No remediation needed</p>
                              <p className="text-xs text-muted-foreground">Control is currently compliant</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Approval History</h3>
                      
                      <div className="relative pl-6 border-l-2 border-muted space-y-5">
                        <div className="relative">
                          <div className="absolute -left-[25px] p-1 rounded-full bg-green-500 border-4 border-background">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Approved</h4>
                            <p className="text-sm text-muted-foreground">Apr 12, 2024 - Alex Thompson</p>
                            <p className="text-sm">
                              Control verified and approved during quarterly assessment.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-[25px] p-1 rounded-full bg-blue-500 border-4 border-background">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Evidence Collected</h4>
                            <p className="text-sm text-muted-foreground">Apr 10, 2024 - Automated System</p>
                            <p className="text-sm">
                              Automated evidence collection completed successfully.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-[25px] p-1 rounded-full bg-purple-500 border-4 border-background">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">Comment Added</h4>
                            <p className="text-sm text-muted-foreground">Apr 05, 2024 - Diana Lawson</p>
                            <p className="text-sm">
                              "Please ensure updated policy documentation is collected during next test."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
