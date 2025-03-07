
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OutlierCategory, OutlierDetectionSettings } from './types';

interface OutlierSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutlierSettings: React.FC<OutlierSettingsProps> = ({ open, onOpenChange }) => {
  // Default settings - in a real app, these would be loaded from API/state
  const [settings, setSettings] = React.useState<OutlierDetectionSettings>({
    sensitivityThreshold: 75,
    categoryThresholds: {
      sequence_violation: 70,
      time_outlier: 80,
      resource_imbalance: 75,
      data_quality: 85,
      compliance_breach: 90
    },
    enabledCategories: ['sequence_violation', 'time_outlier', 'resource_imbalance', 'data_quality', 'compliance_breach'],
    enablePredictiveAlerts: true,
    alertThreshold: 3, // Minimum severity level (e.g., 3 = medium)
    refreshInterval: 300 // In seconds
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

  const handleRefreshIntervalChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      refreshInterval: value[0]
    }));
  };

  const handleSave = () => {
    // In a real app, this would save settings to API/state
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Anomaly Detection Settings</DialogTitle>
          <DialogDescription>
            Configure how anomalies are detected and alerted. Higher sensitivity will detect more anomalies but may include more false positives.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall sensitivity control */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="sensitivity">Overall Sensitivity</Label>
              <span className="text-sm font-medium">{settings.sensitivityThreshold}%</span>
            </div>
            <Slider
              id="sensitivity"
              defaultValue={[settings.sensitivityThreshold]}
              max={100}
              step={5}
              onValueChange={handleSensitivityChange}
            />
            <p className="text-sm text-muted-foreground">
              Higher sensitivity detects more anomalies but may increase false positives
            </p>
          </div>

          {/* Category-specific thresholds */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Category Thresholds</h3>
            
            {Object.entries(settings.categoryThresholds).map(([category, threshold]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`enable-${category}`}
                      checked={settings.enabledCategories.includes(category as OutlierCategory)}
                      onCheckedChange={(checked) => 
                        handleCategoryToggle(category as OutlierCategory, checked as boolean)
                      }
                    />
                    <Label htmlFor={`enable-${category}`} className="text-sm capitalize">
                      {category.replace('_', ' ')}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">{threshold}%</span>
                </div>
                
                <Slider
                  disabled={!settings.enabledCategories.includes(category as OutlierCategory)}
                  defaultValue={[threshold]}
                  max={100}
                  step={5}
                  onValueChange={(value) => 
                    handleCategoryThresholdChange(category as OutlierCategory, value)
                  }
                />
              </div>
            ))}
          </div>

          {/* Predictive alerts toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="predictive-alerts"
              checked={settings.enablePredictiveAlerts}
              onCheckedChange={(checked) => handlePredictiveAlertsToggle(checked as boolean)}
            />
            <Label htmlFor="predictive-alerts">Enable predictive alerts</Label>
          </div>

          {/* Refresh interval */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="refresh">Refresh Interval</Label>
              <span className="text-sm font-medium">
                {settings.refreshInterval < 60 
                  ? `${settings.refreshInterval}s` 
                  : `${Math.floor(settings.refreshInterval / 60)}m ${settings.refreshInterval % 60}s`}
              </span>
            </div>
            <Slider
              id="refresh"
              defaultValue={[settings.refreshInterval]}
              min={30}
              max={600}
              step={30}
              onValueChange={handleRefreshIntervalChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutlierSettings;
