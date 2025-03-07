
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OutlierCategory, OutlierDetectionSettings } from './types';
import { Bot, RefreshCcw, Settings2, Plus, AlertTriangle, Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutlierSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutlierSettings: React.FC<OutlierSettingsProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("sensitivity");
  
  // Mock settings state
  const [settings, setSettings] = useState<OutlierDetectionSettings>({
    sensitivityThreshold: 75,
    categoryThresholds: {
      sequence_violation: 65,
      time_outlier: 80,
      resource_imbalance: 70,
      data_quality: 60,
      compliance_breach: 90
    },
    enabledCategories: [
      'sequence_violation',
      'time_outlier',
      'resource_imbalance', 
      'data_quality',
      'compliance_breach'
    ],
    enablePredictiveAlerts: true,
    alertThreshold: 70,
    refreshInterval: 300
  });
  
  const handleSensitivityChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      sensitivityThreshold: value[0]
    }));
  };
  
  const handleCategoryThresholdChange = (category: OutlierCategory, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      categoryThresholds: {
        ...prev.categoryThresholds,
        [category]: value[0]
      }
    }));
  };
  
  const handleCategoryToggle = (category: OutlierCategory, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enabledCategories: checked 
        ? [...prev.enabledCategories, category]
        : prev.enabledCategories.filter(c => c !== category)
    }));
  };
  
  const handlePredictiveAlertsToggle = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enablePredictiveAlerts: checked
    }));
  };
  
  const handleAlertThresholdChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      alertThreshold: value[0]
    }));
  };
  
  const handleRefreshIntervalChange = (value: string) => {
    const interval = parseInt(value);
    if (!isNaN(interval) && interval > 0) {
      setSettings(prev => ({
        ...prev,
        refreshInterval: interval
      }));
    }
  };
  
  const handleSaveSettings = () => {
    // This would typically save to backend
    toast({
      title: "Settings saved",
      description: "Your anomaly detection settings have been updated",
    });
    onOpenChange(false);
  };
  
  // Format seconds to minutes and seconds
  const formatInterval = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes} minutes`;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Anomaly Detection Settings
          </DialogTitle>
          <DialogDescription>
            Configure how anomalies are detected, displayed, and alerted in your processes
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sensitivity">Detection Sensitivity</TabsTrigger>
            <TabsTrigger value="categories">Anomaly Categories</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sensitivity" className="space-y-4 pt-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="overall-sensitivity">
                    Overall Sensitivity Threshold
                  </Label>
                  <span className="text-sm font-medium">
                    {settings.sensitivityThreshold}%
                  </span>
                </div>
                <Slider 
                  id="overall-sensitivity"
                  value={[settings.sensitivityThreshold]} 
                  min={0} 
                  max={100} 
                  step={5}
                  onValueChange={handleSensitivityChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values detect more subtle anomalies but may increase false positives
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-4">Per-Category Sensitivity</h3>
                
                <div className="space-y-5">
                  {Object.entries(settings.categoryThresholds).map(([category, threshold]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor={`threshold-${category}`}>
                          {category.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Label>
                        <span className="text-sm font-medium">{threshold}%</span>
                      </div>
                      <Slider 
                        id={`threshold-${category}`}
                        value={[threshold]} 
                        min={0} 
                        max={100} 
                        step={5}
                        onValueChange={(value) => handleCategoryThresholdChange(category as OutlierCategory, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4 pt-2">
            <div>
              <h3 className="text-sm font-medium mb-3">Enabled Anomaly Categories</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Select which types of anomalies should be detected and displayed
              </p>
              
              <div className="space-y-3">
                {Object.keys(settings.categoryThresholds).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={settings.enabledCategories.includes(category as OutlierCategory)}
                      onCheckedChange={(checked) => 
                        handleCategoryToggle(category as OutlierCategory, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t mt-4">
              <h3 className="text-sm font-medium mb-3">Custom Anomaly Types</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Add domain-specific anomaly types for your processes
              </p>
              
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Anomaly Type
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base" htmlFor="predictive-alerts">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-1 text-primary" />
                    Predictive Alerts
                  </div>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive AI-generated alerts about predicted future anomalies
                </p>
              </div>
              <Switch
                id="predictive-alerts"
                checked={settings.enablePredictiveAlerts}
                onCheckedChange={handlePredictiveAlertsToggle}
              />
            </div>
            
            <div className="pt-4 space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="alert-threshold">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                      Alert Threshold
                    </div>
                  </Label>
                  <span className="text-sm font-medium">{settings.alertThreshold}%</span>
                </div>
                <Slider 
                  id="alert-threshold"
                  value={[settings.alertThreshold]} 
                  min={0} 
                  max={100} 
                  step={5}
                  onValueChange={handleAlertThresholdChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only anomalies above this severity threshold will trigger alerts
                </p>
              </div>
              
              <div className="pt-4">
                <Label htmlFor="refresh-interval">
                  <div className="flex items-center mb-2">
                    <RefreshCcw className="h-4 w-4 mr-1 text-blue-500" />
                    Refresh Interval
                  </div>
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="refresh-interval"
                    type="number"
                    min="30"
                    value={settings.refreshInterval}
                    onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm">seconds</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current refresh: {formatInterval(settings.refreshInterval)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="gap-1">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutlierSettings;
