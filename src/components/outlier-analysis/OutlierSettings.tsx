
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OutlierCategory, OutlierDetectionSettings } from './types';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, GitBranch, Timer, Scale, FileWarning, Shield, Check } from 'lucide-react';

interface OutlierSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutlierSettings: React.FC<OutlierSettingsProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<OutlierDetectionSettings>({
    sensitivityThreshold: 75,
    categoryThresholds: {
      sequence_violation: 70,
      time_outlier: 80,
      resource_imbalance: 65,
      data_quality: 75,
      compliance_breach: 90
    },
    enabledCategories: ['sequence_violation', 'time_outlier', 'resource_imbalance', 'data_quality', 'compliance_breach'],
    enablePredictiveAlerts: true,
    alertThreshold: 2, // 0=low, 1=medium, 2=high, 3=critical
    refreshInterval: 60,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your anomaly detection settings have been updated",
    });
    onOpenChange(false);
  };

  const getCategoryIcon = (category: OutlierCategory) => {
    switch (category) {
      case 'sequence_violation':
        return <GitBranch className="h-4 w-4 text-blue-500" />;
      case 'time_outlier':
        return <Timer className="h-4 w-4 text-orange-500" />;
      case 'resource_imbalance':
        return <Scale className="h-4 w-4 text-purple-500" />;
      case 'data_quality':
        return <FileWarning className="h-4 w-4 text-yellow-500" />;
      case 'compliance_breach':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getCategoryLabel = (category: OutlierCategory) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCategoryToggle = (category: OutlierCategory) => {
    setSettings(prev => {
      const enabledCategories = prev.enabledCategories.includes(category)
        ? prev.enabledCategories.filter(c => c !== category)
        : [...prev.enabledCategories, category];
      
      return {
        ...prev,
        enabledCategories
      };
    });
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

  const handleSensitivityChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      sensitivityThreshold: value[0]
    }));
  };

  const handlePredictiveAlertsToggle = () => {
    setSettings(prev => ({
      ...prev,
      enablePredictiveAlerts: !prev.enablePredictiveAlerts
    }));
  };

  const handleAlertThresholdChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      alertThreshold: value[0]
    }));
  };

  const handleRefreshIntervalChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      refreshInterval: value[0]
    }));
  };

  const alertLevels = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>Anomaly Detection Settings</SheetTitle>
          <SheetDescription>
            Configure how anomalies are detected and displayed in your dashboard
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Overall Sensitivity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Low Detection (Fewer Alerts)</span>
                <span>High Detection (More Alerts)</span>
              </div>
              <Slider
                value={[settings.sensitivityThreshold]}
                min={0}
                max={100}
                step={5}
                onValueChange={handleSensitivityChange}
              />
              <div className="text-center text-sm text-muted-foreground mt-1">
                Current: {settings.sensitivityThreshold}%
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-4">Anomaly Categories</h3>
            <div className="space-y-6">
              {Object.keys(settings.categoryThresholds).map((category) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category as OutlierCategory)}
                      <Label htmlFor={`category-${category}`} className="font-medium">
                        {getCategoryLabel(category as OutlierCategory)}
                      </Label>
                    </div>
                    <Switch
                      id={`category-${category}`}
                      checked={settings.enabledCategories.includes(category as OutlierCategory)}
                      onCheckedChange={() => handleCategoryToggle(category as OutlierCategory)}
                    />
                  </div>
                  
                  <Slider
                    value={[settings.categoryThresholds[category as OutlierCategory]]}
                    min={0}
                    max={100}
                    step={5}
                    disabled={!settings.enabledCategories.includes(category as OutlierCategory)}
                    onValueChange={(value) => handleCategoryThresholdChange(category as OutlierCategory, value)}
                  />
                  
                  <div className="text-right text-xs text-muted-foreground">
                    Threshold: {settings.categoryThresholds[category as OutlierCategory]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Alert Settings</h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <Label htmlFor="predictive-alerts" className="font-medium">Predictive Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Show predictions about future anomalies based on trends
                </p>
              </div>
              <Switch
                id="predictive-alerts"
                checked={settings.enablePredictiveAlerts}
                onCheckedChange={handlePredictiveAlertsToggle}
              />
            </div>
            
            <div className="space-y-2 mb-4">
              <Label className="font-medium">
                Minimum Alert Severity
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Only show alerts for this severity and higher
              </p>
              
              <Slider
                value={[settings.alertThreshold]}
                min={0}
                max={3}
                step={1}
                onValueChange={handleAlertThresholdChange}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {alertLevels.map((level, index) => (
                  <span key={level} className={settings.alertThreshold === index ? "font-bold text-primary" : ""}>
                    {level}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-medium">
                Data Refresh Interval
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                How often to check for new anomalies (in seconds)
              </p>
              
              <Slider
                value={[settings.refreshInterval]}
                min={15}
                max={300}
                step={15}
                onValueChange={handleRefreshIntervalChange}
              />
              
              <div className="text-center text-sm text-muted-foreground mt-1">
                Every {settings.refreshInterval} seconds
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-1">
              <Check className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OutlierSettings;
