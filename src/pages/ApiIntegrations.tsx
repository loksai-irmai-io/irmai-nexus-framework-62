
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plug, Database, Link, Lock, CloudCog, Network, Globe, ArrowRight, Check, Plus, Server, ChevronRight } from "lucide-react";

const ApiIntegrations = () => {
  const [activeCategory, setActiveCategory] = useState("internal");

  const handleTestConnection = (apiName: string) => {
    toast.success(`Connection to ${apiName} API tested successfully`);
  };

  const handleSaveConnection = (apiName: string) => {
    toast.success(`${apiName} API connection saved successfully`);
  };

  return (
    <Layout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Integrations</h1>
            <p className="text-muted-foreground">
              Configure connections between UI components and backend services
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Connection
          </Button>
        </div>

        <Tabs defaultValue="internal" onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="internal">Internal API Connections</TabsTrigger>
            <TabsTrigger value="third-party">Third-Party Services</TabsTrigger>
            <TabsTrigger value="client-data">Client Data Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Risk Management API */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Risk Management API</CardTitle>
                    </div>
                    <Badge variant={riskApiConnected ? "default" : "outline"}>
                      {riskApiConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Backend services for FMEA and risk assessment features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="risk-endpoint">API Endpoint</Label>
                            <Input id="risk-endpoint" value={riskEndpoint} 
                                  onChange={(e) => setRiskEndpoint(e.target.value)} 
                                  placeholder="https://api.example.com/risk" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="risk-key">API Key</Label>
                            <Input id="risk-key" type="password" value={riskApiKey}
                                  onChange={(e) => setRiskApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="risk-version">API Version</Label>
                            <Select value={riskApiVersion} onValueChange={setRiskApiVersion}>
                              <SelectTrigger id="risk-version">
                                <SelectValue placeholder="Select version" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="v1">Version 1.0</SelectItem>
                                <SelectItem value="v2">Version 2.0</SelectItem>
                                <SelectItem value="v3">Version 3.0 (Beta)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="risk-auto-retry" className="cursor-pointer">
                              Auto-retry on failure
                            </Label>
                            <Switch id="risk-auto-retry" checked={riskAutoRetry} 
                                  onCheckedChange={setRiskAutoRetry} />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>RiskDetailView</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>RiskHeatmap</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>PredictiveRiskDashboard</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Risk Management")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Risk Management")}>
                    {riskApiConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Process Mining API */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-indigo-500" />
                      <CardTitle className="text-lg">Process Mining API</CardTitle>
                    </div>
                    <Badge variant={processApiConnected ? "default" : "outline"}>
                      {processApiConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Backend services for process discovery and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="process-endpoint">API Endpoint</Label>
                            <Input id="process-endpoint" value={processEndpoint} 
                                  onChange={(e) => setProcessEndpoint(e.target.value)} 
                                  placeholder="https://api.example.com/process" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="process-key">API Key</Label>
                            <Input id="process-key" type="password" value={processApiKey}
                                  onChange={(e) => setProcessApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="process-mode">Processing Mode</Label>
                            <Select value={processMode} onValueChange={setProcessMode}>
                              <SelectTrigger id="process-mode">
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sync">Synchronous</SelectItem>
                                <SelectItem value="async">Asynchronous</SelectItem>
                                <SelectItem value="batch">Batch Processing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>ProcessMap</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>ProcessStatistics</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>EventLogs</span>
                            <Badge variant="outline" className="bg-yellow-50">Partial</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Process Mining")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Process Mining")}>
                    {processApiConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Compliance API */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">Compliance API</CardTitle>
                    </div>
                    <Badge variant={complianceApiConnected ? "default" : "outline"}>
                      {complianceApiConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Backend services for compliance monitoring and regulation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="compliance-endpoint">API Endpoint</Label>
                            <Input id="compliance-endpoint" value={complianceEndpoint} 
                                  onChange={(e) => setComplianceEndpoint(e.target.value)} 
                                  placeholder="https://api.example.com/compliance" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="compliance-key">API Key</Label>
                            <Input id="compliance-key" type="password" value={complianceApiKey}
                                  onChange={(e) => setComplianceApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="compliance-refresh">Auto-refresh Interval (minutes)</Label>
                            <Select value={complianceRefresh} onValueChange={setComplianceRefresh}>
                              <SelectTrigger id="compliance-refresh">
                                <SelectValue placeholder="Select interval" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>ComplianceDashboard</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>ComplianceHeatmap</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>EvidenceVaultPanel</span>
                            <Badge variant="outline" className="bg-red-50">Not Connected</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Compliance")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Compliance")}>
                    {complianceApiConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Admin API */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">Admin API</CardTitle>
                    </div>
                    <Badge variant={adminApiConnected ? "default" : "outline"}>
                      {adminApiConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    System administration and monitoring services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="admin-endpoint">API Endpoint</Label>
                            <Input id="admin-endpoint" value={adminEndpoint} 
                                  onChange={(e) => setAdminEndpoint(e.target.value)} 
                                  placeholder="https://api.example.com/admin" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admin-key">Admin API Key</Label>
                            <Input id="admin-key" type="password" value={adminApiKey}
                                  onChange={(e) => setAdminApiKey(e.target.value)} 
                                  placeholder="Enter admin API key" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-secure" className="cursor-pointer">
                              Enhanced Security Mode
                            </Label>
                            <Switch id="admin-secure" checked={adminSecureMode} 
                                  onCheckedChange={setAdminSecureMode} />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>SystemOverview</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>ServiceMonitor</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>LogViewer</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Admin")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Admin")}>
                    {adminApiConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="third-party" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Analytics Integration */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <CardTitle className="text-lg">AI Analytics</CardTitle>
                    </div>
                    <Badge variant={aiApiConnected ? "default" : "outline"}>
                      {aiApiConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Advanced AI-powered analytics and prediction services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="ai-provider">Provider</Label>
                            <Select value={aiProvider} onValueChange={setAiProvider}>
                              <SelectTrigger id="ai-provider">
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="openai">OpenAI</SelectItem>
                                <SelectItem value="azure">Azure AI</SelectItem>
                                <SelectItem value="huggingface">HuggingFace</SelectItem>
                                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ai-endpoint">API Endpoint</Label>
                            <Input id="ai-endpoint" value={aiEndpoint} 
                                  onChange={(e) => setAiEndpoint(e.target.value)} 
                                  placeholder="https://api.openai.com/v1" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ai-key">API Key</Label>
                            <Input id="ai-key" type="password" value={aiApiKey}
                                  onChange={(e) => setAiApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ai-model">Model Selection</Label>
                            <Select value={aiModel} onValueChange={setAiModel}>
                              <SelectTrigger id="ai-model">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3">Claude 3</SelectItem>
                                <SelectItem value="llama-3">Llama 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>AIRiskSummary</span>
                            <Badge variant="outline" className="bg-yellow-50">Partial</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>KnowledgeGraph</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("AI Analytics")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("AI Analytics")}>
                    {aiApiConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Data Visualization Service */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Data Visualization</CardTitle>
                    </div>
                    <Badge variant={dataVisConnected ? "default" : "outline"}>
                      {dataVisConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Advanced data visualization and charting services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="vis-provider">Provider</Label>
                            <Select value={visProvider} onValueChange={setVisProvider}>
                              <SelectTrigger id="vis-provider">
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tableau">Tableau</SelectItem>
                                <SelectItem value="powerbi">Power BI</SelectItem>
                                <SelectItem value="qlik">Qlik</SelectItem>
                                <SelectItem value="looker">Looker</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vis-endpoint">Service Endpoint</Label>
                            <Input id="vis-endpoint" value={visEndpoint} 
                                  onChange={(e) => setVisEndpoint(e.target.value)} 
                                  placeholder="https://api.visualization.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vis-key">API Key</Label>
                            <Input id="vis-key" type="password" value={visApiKey}
                                  onChange={(e) => setVisApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vis-workspace">Workspace ID</Label>
                            <Input id="vis-workspace" value={visWorkspace}
                                  onChange={(e) => setVisWorkspace(e.target.value)} 
                                  placeholder="Enter workspace ID" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>RiskHeatmap</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>ComplianceHeatmap</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>DashboardCharts</span>
                            <Badge variant="outline" className="bg-yellow-50">Partial</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Data Visualization")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Data Visualization")}>
                    {dataVisConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Notification Service */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-lg">Notifications</CardTitle>
                    </div>
                    <Badge variant={notifConnected ? "default" : "outline"}>
                      {notifConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Multi-channel notification and alerting services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="notif-provider">Provider</Label>
                            <Select value={notifProvider} onValueChange={setNotifProvider}>
                              <SelectTrigger id="notif-provider">
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="sendgrid">SendGrid</SelectItem>
                                <SelectItem value="slack">Slack</SelectItem>
                                <SelectItem value="firebase">Firebase</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notif-endpoint">Service Endpoint</Label>
                            <Input id="notif-endpoint" value={notifEndpoint} 
                                  onChange={(e) => setNotifEndpoint(e.target.value)} 
                                  placeholder="https://api.notifications.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notif-key">API Key</Label>
                            <Input id="notif-key" type="password" value={notifApiKey}
                                  onChange={(e) => setNotifApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="email-channel" checked={notifChannels.email} 
                                        onCheckedChange={(checked) => 
                                          setNotifChannels({...notifChannels, email: !!checked})} />
                              <label htmlFor="email-channel" className="text-sm cursor-pointer">
                                Email
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="sms-channel" checked={notifChannels.sms} 
                                        onCheckedChange={(checked) => 
                                          setNotifChannels({...notifChannels, sms: !!checked})} />
                              <label htmlFor="sms-channel" className="text-sm cursor-pointer">
                                SMS
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="push-channel" checked={notifChannels.push} 
                                        onCheckedChange={(checked) => 
                                          setNotifChannels({...notifChannels, push: !!checked})} />
                              <label htmlFor="push-channel" className="text-sm cursor-pointer">
                                Push
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="slack-channel" checked={notifChannels.slack} 
                                        onCheckedChange={(checked) => 
                                          setNotifChannels({...notifChannels, slack: !!checked})} />
                              <label htmlFor="slack-channel" className="text-sm cursor-pointer">
                                Slack
                              </label>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="components">
                      <AccordionTrigger className="text-sm py-2">Connected Components</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          <li className="flex items-center justify-between text-sm">
                            <span>RiskAlerts</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>ComplianceAlertPanel</span>
                            <Badge variant="outline" className="bg-green-50">Connected</Badge>
                          </li>
                          <li className="flex items-center justify-between text-sm">
                            <span>SystemOverview</span>
                            <Badge variant="outline" className="bg-red-50">Not Connected</Badge>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Notifications")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Notifications")}>
                    {notifConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="client-data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ERP System Integration */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-indigo-500" />
                      <CardTitle className="text-lg">ERP System</CardTitle>
                    </div>
                    <Badge variant={erpConnected ? "default" : "outline"}>
                      {erpConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Enterprise Resource Planning system integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="erp-provider">ERP System</Label>
                            <Select value={erpProvider} onValueChange={setErpProvider}>
                              <SelectTrigger id="erp-provider">
                                <SelectValue placeholder="Select ERP system" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sap">SAP</SelectItem>
                                <SelectItem value="oracle">Oracle ERP</SelectItem>
                                <SelectItem value="microsoft">Microsoft Dynamics</SelectItem>
                                <SelectItem value="netsuite">NetSuite</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="erp-endpoint">API Endpoint</Label>
                            <Input id="erp-endpoint" value={erpEndpoint} 
                                  onChange={(e) => setErpEndpoint(e.target.value)} 
                                  placeholder="https://api.erp-system.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="erp-key">API Key</Label>
                            <Input id="erp-key" type="password" value={erpApiKey}
                                  onChange={(e) => setErpApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="erp-sync">Sync Frequency</Label>
                            <Select value={erpSyncFrequency} onValueChange={setErpSyncFrequency}>
                              <SelectTrigger id="erp-sync">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Real-time</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="entities">
                      <AccordionTrigger className="text-sm py-2">Data Entities</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            Select data entities to sync
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="entity-processes" checked={erpEntities.processes} 
                                        onCheckedChange={(checked) => 
                                          setErpEntities({...erpEntities, processes: !!checked})} />
                              <label htmlFor="entity-processes" className="text-sm cursor-pointer">
                                Processes
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="entity-risks" checked={erpEntities.risks} 
                                        onCheckedChange={(checked) => 
                                          setErpEntities({...erpEntities, risks: !!checked})} />
                              <label htmlFor="entity-risks" className="text-sm cursor-pointer">
                                Risks
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="entity-controls" checked={erpEntities.controls} 
                                        onCheckedChange={(checked) => 
                                          setErpEntities({...erpEntities, controls: !!checked})} />
                              <label htmlFor="entity-controls" className="text-sm cursor-pointer">
                                Controls
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="entity-incidents" checked={erpEntities.incidents} 
                                        onCheckedChange={(checked) => 
                                          setErpEntities({...erpEntities, incidents: !!checked})} />
                              <label htmlFor="entity-incidents" className="text-sm cursor-pointer">
                                Incidents
                              </label>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("ERP System")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("ERP System")}>
                    {erpConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* CRM System Integration */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">CRM System</CardTitle>
                    </div>
                    <Badge variant={crmConnected ? "default" : "outline"}>
                      {crmConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Customer Relationship Management system integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="crm-provider">CRM System</Label>
                            <Select value={crmProvider} onValueChange={setCrmProvider}>
                              <SelectTrigger id="crm-provider">
                                <SelectValue placeholder="Select CRM system" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="salesforce">Salesforce</SelectItem>
                                <SelectItem value="dynamics">Dynamics 365</SelectItem>
                                <SelectItem value="hubspot">HubSpot</SelectItem>
                                <SelectItem value="zoho">Zoho CRM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="crm-endpoint">API Endpoint</Label>
                            <Input id="crm-endpoint" value={crmEndpoint} 
                                  onChange={(e) => setCrmEndpoint(e.target.value)} 
                                  placeholder="https://api.crm-system.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="crm-key">API Key</Label>
                            <Input id="crm-key" type="password" value={crmApiKey}
                                  onChange={(e) => setCrmApiKey(e.target.value)} 
                                  placeholder="Enter your API key" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="crm-objects">Object Types</Label>
                            <Select value={crmObjectType} onValueChange={setCrmObjectType}>
                              <SelectTrigger id="crm-objects">
                                <SelectValue placeholder="Select objects to sync" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Objects</SelectItem>
                                <SelectItem value="accounts">Accounts Only</SelectItem>
                                <SelectItem value="contacts">Contacts Only</SelectItem>
                                <SelectItem value="custom">Custom Selection</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="mappings">
                      <AccordionTrigger className="text-sm py-2">Field Mappings</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            Configure how CRM fields map to system entities
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Field Mapping
                          </Button>
                          <div className="border rounded-md p-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Customer ID → Client Reference</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Account Type → Risk Category</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("CRM System")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("CRM System")}>
                    {crmConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Document Management System */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">Document System</CardTitle>
                    </div>
                    <Badge variant={docMgmtConnected ? "default" : "outline"}>
                      {docMgmtConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Document Management System integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="config">
                      <AccordionTrigger className="text-sm py-2">Connection Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="doc-provider">Document System</Label>
                            <Select value={docProvider} onValueChange={setDocProvider}>
                              <SelectTrigger id="doc-provider">
                                <SelectValue placeholder="Select document system" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sharepoint">SharePoint</SelectItem>
                                <SelectItem value="onedrive">OneDrive</SelectItem>
                                <SelectItem value="googledrive">Google Drive</SelectItem>
                                <SelectItem value="dropbox">Dropbox</SelectItem>
                                <SelectItem value="box">Box</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc-endpoint">API Endpoint</Label>
                            <Input id="doc-endpoint" value={docEndpoint} 
                                  onChange={(e) => setDocEndpoint(e.target.value)} 
                                  placeholder="https://api.document-system.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc-key">API Key / OAuth Token</Label>
                            <Input id="doc-key" type="password" value={docApiKey}
                                  onChange={(e) => setDocApiKey(e.target.value)} 
                                  placeholder="Enter your API key or OAuth token" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc-root">Root Folder Path</Label>
                            <Input id="doc-root" value={docRootPath}
                                  onChange={(e) => setDocRootPath(e.target.value)} 
                                  placeholder="/Risk Management/Evidence" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="permissions">
                      <AccordionTrigger className="text-sm py-2">Permissions</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-2">
                          <div className="text-sm text-muted-foreground mb-2">
                            Configure access permissions
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="doc-read" className="cursor-pointer">
                              Read Access
                            </Label>
                            <Switch id="doc-read" checked={docPermissions.read} 
                                  onCheckedChange={(checked) => 
                                    setDocPermissions({...docPermissions, read: checked})} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="doc-write" className="cursor-pointer">
                              Write Access
                            </Label>
                            <Switch id="doc-write" checked={docPermissions.write} 
                                  onCheckedChange={(checked) => 
                                    setDocPermissions({...docPermissions, write: checked})} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="doc-delete" className="cursor-pointer">
                              Delete Access
                            </Label>
                            <Switch id="doc-delete" checked={docPermissions.delete} 
                                  onCheckedChange={(checked) => 
                                    setDocPermissions({...docPermissions, delete: checked})} />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleTestConnection("Document System")}>
                    Test Connection
                  </Button>
                  <Button size="sm" onClick={() => handleSaveConnection("Document System")}>
                    {docMgmtConnected ? "Update" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Add necessary imports for icon components
import { 
  Shield, 
  GitBranch, 
  BarChart, 
  BellRing, 
  Brain, 
  Building, 
  Users, 
  FileText, 
  Pencil,
  Checkbox 
} from "lucide-react";

// State for API connections
const [riskApiConnected, setRiskApiConnected] = useState(true);
const [riskEndpoint, setRiskEndpoint] = useState("https://api.irmai.com/risk");
const [riskApiKey, setRiskApiKey] = useState("risk_api_key_12345");
const [riskApiVersion, setRiskApiVersion] = useState("v2");
const [riskAutoRetry, setRiskAutoRetry] = useState(true);

const [processApiConnected, setProcessApiConnected] = useState(true);
const [processEndpoint, setProcessEndpoint] = useState("https://api.irmai.com/process");
const [processApiKey, setProcessApiKey] = useState("process_api_key_12345");
const [processMode, setProcessMode] = useState("async");

const [complianceApiConnected, setComplianceApiConnected] = useState(false);
const [complianceEndpoint, setComplianceEndpoint] = useState("");
const [complianceApiKey, setComplianceApiKey] = useState("");
const [complianceRefresh, setComplianceRefresh] = useState("15");

const [adminApiConnected, setAdminApiConnected] = useState(true);
const [adminEndpoint, setAdminEndpoint] = useState("https://api.irmai.com/admin");
const [adminApiKey, setAdminApiKey] = useState("admin_api_key_12345");
const [adminSecureMode, setAdminSecureMode] = useState(true);

// Third-party API states
const [aiApiConnected, setAiApiConnected] = useState(false);
const [aiProvider, setAiProvider] = useState("openai");
const [aiEndpoint, setAiEndpoint] = useState("");
const [aiApiKey, setAiApiKey] = useState("");
const [aiModel, setAiModel] = useState("gpt-4");

const [dataVisConnected, setDataVisConnected] = useState(true);
const [visProvider, setVisProvider] = useState("tableau");
const [visEndpoint, setVisEndpoint] = useState("https://api.tableau.com");
const [visApiKey, setVisApiKey] = useState("viz_api_key_12345");
const [visWorkspace, setVisWorkspace] = useState("ws-12345");

const [notifConnected, setNotifConnected] = useState(false);
const [notifProvider, setNotifProvider] = useState("twilio");
const [notifEndpoint, setNotifEndpoint] = useState("");
const [notifApiKey, setNotifApiKey] = useState("");
const [notifChannels, setNotifChannels] = useState({
  email: true,
  sms: false,
  push: true,
  slack: false
});

// Client data integration states
const [erpConnected, setErpConnected] = useState(false);
const [erpProvider, setErpProvider] = useState("sap");
const [erpEndpoint, setErpEndpoint] = useState("");
const [erpApiKey, setErpApiKey] = useState("");
const [erpSyncFrequency, setErpSyncFrequency] = useState("daily");
const [erpEntities, setErpEntities] = useState({
  processes: true,
  risks: true,
  controls: false,
  incidents: false
});

const [crmConnected, setCrmConnected] = useState(true);
const [crmProvider, setCrmProvider] = useState("salesforce");
const [crmEndpoint, setCrmEndpoint] = useState("https://api.salesforce.com");
const [crmApiKey, setCrmApiKey] = useState("crm_api_key_12345");
const [crmObjectType, setCrmObjectType] = useState("all");

const [docMgmtConnected, setDocMgmtConnected] = useState(false);
const [docProvider, setDocProvider] = useState("sharepoint");
const [docEndpoint, setDocEndpoint] = useState("");
const [docApiKey, setDocApiKey] = useState("");
const [docRootPath, setDocRootPath] = useState("");
const [docPermissions, setDocPermissions] = useState({
  read: true,
  write: true,
  delete: false
});

export default ApiIntegrations;
