
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  BellRing, 
  Check, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  Eye, 
  Info, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { mockRiskData } from './mockData';

interface RiskAlertsProps {
  selectedRole: string;
  onDrilldown: (riskId: string) => void;
}

const RiskAlerts: React.FC<RiskAlertsProps> = ({ selectedRole, onDrilldown }) => {
  const [alertsView, setAlertsView] = useState<string>('active');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  
  const acknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlerts(prev => [...prev, alertId]);
  };
  
  // Filter alerts based on role
  const getAlerts = () => {
    // Simulated alerts based on risk data
    const alerts = [
      {
        id: 'A001',
        title: 'Critical Risk Threshold Exceeded',
        description: 'Cybersecurity threat risk score has increased by 22% in the last 30 days, exceeding the critical threshold.',
        severity: 'critical',
        timestamp: '2 hours ago',
        relatedRiskId: 'R010',
        recommendation: 'Review security controls and implement emergency response procedures.',
        aiConfidence: 92,
        category: 'threshold'
      },
      {
        id: 'A002',
        title: 'Control Effectiveness Declining',
        description: 'Data privacy controls effectiveness has decreased from 85% to 72% in the last quarter.',
        severity: 'high',
        timestamp: '1 day ago',
        relatedRiskId: 'R001',
        recommendation: 'Conduct control testing and address identified weaknesses.',
        aiConfidence: 88,
        category: 'control'
      },
      {
        id: 'A003',
        title: 'Emerging Regulatory Risk',
        description: 'New data protection regulations announced that may impact compliance posture.',
        severity: 'medium',
        timestamp: '3 days ago',
        relatedRiskId: 'R003',
        recommendation: 'Analyze new requirements and update compliance controls.',
        aiConfidence: 75,
        category: 'regulatory'
      },
      {
        id: 'A004',
        title: 'Risk Correlation Detected',
        description: 'AI has detected correlation between talent shortage and process inefficiency risks.',
        severity: 'medium',
        timestamp: '5 days ago',
        relatedRiskId: 'R007',
        recommendation: 'Consider integrated mitigation strategy addressing both risks.',
        aiConfidence: 82,
        category: 'correlation'
      },
      {
        id: 'A005',
        title: 'Potential Control Redundancy',
        description: 'Multiple overlapping controls identified for financial reporting risks.',
        severity: 'low',
        timestamp: '1 week ago',
        relatedRiskId: 'R004',
        recommendation: 'Streamline control framework to eliminate duplication.',
        aiConfidence: 79,
        category: 'optimization'
      }
    ];
    
    // Filter based on role
    if (selectedRole === 'exec') {
      return alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
    }
    if (selectedRole === 'process') {
      return alerts.filter(alert => alert.category === 'control' || alert.category === 'optimization');
    }
    return alerts;
  };
  
  const activeAlerts = getAlerts().filter(alert => !acknowledgedAlerts.includes(alert.id));
  const historicalAlerts = getAlerts().filter(alert => acknowledgedAlerts.includes(alert.id));
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Risk Alerts & Guidance</h2>
          <p className="text-muted-foreground">AI-powered risk intelligence and recommendations</p>
        </div>
        
        <Tabs value={alertsView} onValueChange={setAlertsView} className="w-auto">
          <TabsList className="grid grid-cols-2 h-8">
            <TabsTrigger value="active" className="text-xs px-3">
              Active <Badge variant="outline" className="ml-1">{activeAlerts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="historical" className="text-xs px-3">Historical</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <BellRing className="h-4 w-4 mr-2" />
                {alertsView === 'active' ? 'Active Alerts' : 'Historical Alerts'}
                {alertsView === 'active' && (
                  <Badge variant="outline" className="ml-auto">
                    {activeAlerts.length} requiring attention
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              <TabsContent value="active" className="m-0 p-0 space-y-4">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium">All Clear!</h3>
                    <p className="text-muted-foreground">No active alerts requiring your attention.</p>
                  </div>
                ) : (
                  activeAlerts.map(alert => (
                    <Alert 
                      key={alert.id}
                      className={
                        alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                        alert.severity === 'medium' ? 'border-amber-500 bg-amber-50' :
                        'border-green-500 bg-green-50'
                      }
                    >
                      <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <AlertTriangle className={
                              alert.severity === 'critical' ? 'h-4 w-4 text-red-500' :
                              alert.severity === 'high' ? 'h-4 w-4 text-orange-500' :
                              alert.severity === 'medium' ? 'h-4 w-4 text-amber-500' :
                              'h-4 w-4 text-green-500'
                            } />
                            
                            <AlertTitle className="ml-2 text-sm font-medium">
                              {alert.title}
                            </AlertTitle>
                            
                            <Badge 
                              className="ml-2"
                              variant={
                                alert.severity === 'critical' ? 'destructive' :
                                alert.severity === 'high' ? 'default' :
                                alert.severity === 'medium' ? 'secondary' :
                                'outline'
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          
                          <AlertDescription className="mt-1 text-sm">
                            {alert.description}
                          </AlertDescription>
                          
                          <div className="mt-2 flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{alert.timestamp}</span>
                            <Badge variant="outline" className="ml-2 text-[10px] h-5">
                              AI Confidence: {alert.aiConfidence}%
                            </Badge>
                          </div>
                          
                          <div className="mt-2 p-2 bg-background rounded-sm border text-xs">
                            <div className="font-medium mb-1 flex items-center">
                              <Info className="h-3 w-3 mr-1" />
                              Recommended Action:
                            </div>
                            <p>{alert.recommendation}</p>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 sm:w-auto w-full justify-between">
                          <Button 
                            size="sm" 
                            className="text-xs px-2"
                            onClick={() => onDrilldown(alert.relatedRiskId)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Risk
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-2"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="historical" className="m-0 p-0 space-y-4">
                {historicalAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-medium">No Historical Alerts</h3>
                    <p className="text-muted-foreground">Previous alerts will appear here once acknowledged.</p>
                  </div>
                ) : (
                  historicalAlerts.map(alert => (
                    <Alert 
                      key={alert.id}
                      className="border-gray-200 bg-gray-50"
                    >
                      <div className="flex justify-between w-full">
                        <div>
                          <AlertTitle className="text-sm font-medium text-gray-600">
                            {alert.title}
                          </AlertTitle>
                          
                          <AlertDescription className="mt-1 text-sm text-gray-500">
                            {alert.description}
                          </AlertDescription>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{alert.timestamp}</span>
                            <Badge variant="outline" className="ml-2 text-[10px] h-5 text-gray-500">
                              Acknowledged
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs"
                          onClick={() => onDrilldown(alert.relatedRiskId)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </Alert>
                  ))
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Alert Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Alerts</span>
                    <Badge variant="destructive">
                      {activeAlerts.filter(a => a.severity === 'critical').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Alerts</span>
                    <Badge>
                      {activeAlerts.filter(a => a.severity === 'high').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Alerts</span>
                    <Badge variant="secondary">
                      {activeAlerts.filter(a => a.severity === 'medium').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Alerts</span>
                    <Badge variant="outline">
                      {activeAlerts.filter(a => a.severity === 'low').length}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Acknowledged (Today)</span>
                      <Badge variant="outline">
                        {acknowledgedAlerts.length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">Update Risk Assessment</h4>
                      <Badge variant="outline" className="text-xs">Priority</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Schedule a comprehensive risk assessment update for cybersecurity risks.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-blue-600 flex items-center">
                        <span>View Details</span>
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">Control Effectiveness Review</h4>
                      <Badge variant="outline" className="text-xs">Suggested</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Evaluate control effectiveness for data privacy risks based on recent findings.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-blue-600 flex items-center">
                        <span>View Details</span>
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">Consolidate Controls</h4>
                      <Badge variant="outline" className="text-xs">Efficiency</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Merge redundant financial reporting controls to improve efficiency.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-blue-600 flex items-center">
                        <span>View Details</span>
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-3 text-xs h-8">
                  View All Recommendations
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAlerts;
