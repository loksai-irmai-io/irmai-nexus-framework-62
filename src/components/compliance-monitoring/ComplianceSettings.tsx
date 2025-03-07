
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  Calendar, 
  Users, 
  Sliders, 
  Save
} from 'lucide-react';

interface ComplianceSettingsProps {
  onClose: () => void;
}

export const ComplianceSettings: React.FC<ComplianceSettingsProps> = ({ onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Compliance Settings</h1>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alerts & Notifications
          </TabsTrigger>
          <TabsTrigger value="frameworks">
            <Shield className="h-4 w-4 mr-2" />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="scheduling">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="h-4 w-4 mr-2" />
            Teams & Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Interface Settings</CardTitle>
              <CardDescription>
                Customize how the compliance dashboard appears and functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark interface themes
                  </p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Gap Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Include gap information in framework cards
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Real-time Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium">Dashboard Refresh Rate</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Set how frequently dashboard data refreshes
                </p>
                <div className="flex items-center space-x-4">
                  <Slider defaultValue={[5]} max={60} step={5} className="flex-1" />
                  <span className="text-sm w-12 text-right">5 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Display Preferences</CardTitle>
              <CardDescription>
                Configure data visualization options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Trend Indicators</p>
                  <p className="text-sm text-muted-foreground">
                    Display trend arrows on compliance scores
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Risk Ratings</p>
                  <p className="text-sm text-muted-foreground">
                    Display risk level indicators on controls
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI-Generated Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Show AI recommendations and explanations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>
                Manage how and when you receive compliance alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Alert Delivery Methods</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select how you want to receive alerts
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="email" defaultChecked />
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="dashboard" defaultChecked />
                      <label htmlFor="dashboard">Dashboard</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sms" />
                      <label htmlFor="sms">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="slack" />
                      <label htmlFor="slack">Slack</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="font-medium">Alert Severity Thresholds</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure which severity levels trigger notifications
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Critical</p>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">High</p>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Medium</p>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Low</p>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="frameworks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Framework Management</CardTitle>
              <CardDescription>
                Configure frameworks and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which frameworks to display on the dashboard
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">ISO 27001</p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">GDPR</p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">SOC 2</p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">PCI DSS</p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">HIPAA</p>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">NIST CSF</p>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Scheduling</CardTitle>
              <CardDescription>
                Configure automated compliance assessment schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">ISO 27001</p>
                  <div className="flex items-center space-x-2">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Bi-annually</option>
                      <option>Annually</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">GDPR</p>
                  <div className="flex items-center space-x-2">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option selected>Bi-annually</option>
                      <option>Annually</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">SOC 2</p>
                  <div className="flex items-center space-x-2">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Monthly</option>
                      <option selected>Quarterly</option>
                      <option>Bi-annually</option>
                      <option>Annually</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">PCI DSS</p>
                  <div className="flex items-center space-x-2">
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option selected>Monthly</option>
                      <option>Quarterly</option>
                      <option>Bi-annually</option>
                      <option>Annually</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage team access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">Default View by Role</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm">Executive</p>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option selected>Dashboard Overview</option>
                      <option>Compliance Heatmap</option>
                      <option>Alerts</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Compliance Officer</p>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Dashboard Overview</option>
                      <option>Compliance Heatmap</option>
                      <option selected>Alerts</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Control Owner</p>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Dashboard Overview</option>
                      <option selected>Compliance Heatmap</option>
                      <option>Alerts</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
