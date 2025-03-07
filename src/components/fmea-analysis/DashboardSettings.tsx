
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Eye, 
  Layout, 
  User, 
  UserCircle, 
  Save, 
  RefreshCw, 
  Lock, 
  BellRing,
  AlertTriangle,
  Check,
  RotateCw,
  Database,
  Info
} from 'lucide-react';

interface DashboardSettingsProps {
  selectedRole: string;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ selectedRole }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [criticalsOnly, setCriticalsOnly] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [defaultView, setDefaultView] = useState('overview');
  const [dashboardTheme, setDashboardTheme] = useState('system');
  const [currentTab, setCurrentTab] = useState('preferences');
  
  const handleSaveSettings = () => {
    // Here we would normally save the settings to a backend
    console.log("Saving settings...");
    // Show toast notification for successful save
  };
  
  const handleResetSettings = () => {
    // Reset settings to defaults
    setNotificationsEnabled(true);
    setCriticalsOnly(false);
    setEmailNotifications(true);
    setShowAIInsights(true);
    setAutoRefresh(true);
    setRefreshInterval('15');
    setDefaultView('overview');
    setDashboardTheme('system');
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Settings</h2>
          <p className="text-muted-foreground">Customize your risk analytics experience</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <UserCircle className="h-4 w-4 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">Risk Manager</p>
                
                <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {selectedRole === 'exec' ? 'Executive View' : 
                   selectedRole === 'riskmgr' ? 'Risk Manager View' : 
                   selectedRole === 'process' ? 'Process Owner View' : 
                   'Analyst View'}
                </Badge>
                
                <Button variant="outline" className="mt-4 text-sm w-full">Edit Profile</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm py-1">
                  <span>Email</span>
                  <span className="text-muted-foreground">john.doe@company.com</span>
                </div>
                
                <div className="flex justify-between text-sm py-1">
                  <span>Department</span>
                  <span className="text-muted-foreground">Risk Management</span>
                </div>
                
                <div className="flex justify-between text-sm py-1">
                  <span>Role</span>
                  <span className="text-muted-foreground">Risk Manager</span>
                </div>
                
                <div className="flex justify-between text-sm py-1">
                  <span>Last Login</span>
                  <span className="text-muted-foreground">Today, 09:45 AM</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm">Active Status</span>
                <Badge variant="outline" className="text-green-600 bg-green-50 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Help & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="text-sm w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Data Dictionary
                  </Button>
                  
                  <Button variant="outline" className="text-sm w-full justify-start">
                    <Layout className="h-4 w-4 mr-2" />
                    Dashboard Tutorial
                  </Button>
                  
                  <Button variant="outline" className="text-sm w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-3 h-9">
                  <TabsTrigger value="preferences" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Privacy & Security
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="preferences" className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Dashboard Display</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="defaultView">Default View</Label>
                      <Select value={defaultView} onValueChange={setDefaultView}>
                        <SelectTrigger id="defaultView">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="overview">Risk Overview</SelectItem>
                          <SelectItem value="scenario">Scenario Modeling</SelectItem>
                          <SelectItem value="heatmap">Risk Heatmap</SelectItem>
                          <SelectItem value="alerts">Alerts & Guidance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dashboardTheme">Dashboard Theme</Label>
                      <Select value={dashboardTheme} onValueChange={setDashboardTheme}>
                        <SelectTrigger id="dashboardTheme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="system">System Default</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show AI Insights</Label>
                        <p className="text-sm text-muted-foreground">Display AI-generated risk predictions and recommendations</p>
                      </div>
                      <Switch 
                        checked={showAIInsights}
                        onCheckedChange={setShowAIInsights}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-refresh Data</Label>
                        <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                      </div>
                      <Switch 
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                      />
                    </div>
                    
                    {autoRefresh && (
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                        <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                          <SelectTrigger id="refreshInterval">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Widget Customization</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select which widgets to display on your dashboard
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="risk-exposure" defaultChecked />
                      <Label htmlFor="risk-exposure">Risk Exposure Score</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="risk-distribution" defaultChecked />
                      <Label htmlFor="risk-distribution">Risk Distribution</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="risk-trend" defaultChecked />
                      <Label htmlFor="risk-trend">Risk Trend Analysis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="emerging-risks" defaultChecked />
                      <Label htmlFor="emerging-risks">Emerging Risk Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="control-optimization" defaultChecked />
                      <Label htmlFor="control-optimization">Control Optimization</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for risk events</p>
                      </div>
                      <Switch 
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                    
                    {notificationsEnabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Critical Risks Only</Label>
                            <p className="text-sm text-muted-foreground">Only notify for critical and high risks</p>
                          </div>
                          <Switch 
                            checked={criticalsOnly}
                            onCheckedChange={setCriticalsOnly}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Also send notifications via email</p>
                          </div>
                          <Switch 
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Notification Types</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select which events trigger notifications
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="risk-threshold" defaultChecked />
                      <Label htmlFor="risk-threshold">Risk Threshold Exceeded</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="control-failure" defaultChecked />
                      <Label htmlFor="control-failure">Control Effectiveness Decline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="new-regulatory" defaultChecked />
                      <Label htmlFor="new-regulatory">New Regulatory Requirements</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="ai-prediction" defaultChecked />
                      <Label htmlFor="ai-prediction">AI Risk Predictions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="risk-review" defaultChecked />
                      <Label htmlFor="risk-review">Scheduled Risk Reviews</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Notifications</h3>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    <div className="flex items-start gap-3 p-2 border rounded">
                      <BellRing className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Control Effectiveness Alert</h4>
                        <p className="text-xs text-muted-foreground">Data privacy controls effectiveness has decreased</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-2 border rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Critical Risk Threshold</h4>
                        <p className="text-xs text-muted-foreground">Cybersecurity threat risk score exceeds threshold</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-2 border rounded">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Risk Assessment Due</h4>
                        <p className="text-xs text-muted-foreground">Quarterly risk assessment due in 5 days</p>
                        <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Data Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Collection Consent</Label>
                        <p className="text-sm text-muted-foreground">Allow usage data collection for analytics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">AI Data Processing</Label>
                        <p className="text-sm text-muted-foreground">Allow AI to process your risk data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Third-Party Integrations</Label>
                        <p className="text-sm text-muted-foreground">Share data with approved third-party services</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Access & Security</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="sessionTimeout">
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Enable 2FA for added security</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new login attempts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Button variant="outline" className="text-sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Data Management</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="text-sm">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                    
                    <Button variant="outline" className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
