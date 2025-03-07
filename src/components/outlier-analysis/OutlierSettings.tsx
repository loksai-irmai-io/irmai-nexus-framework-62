
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sliders, Save, PlusCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutlierSettingsProps {
  onClose: () => void;
}

interface SettingsOption {
  id: string;
  name: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

const OutlierSettings: React.FC<OutlierSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [settings, setSettings] = useState<SettingsOption[]>([
    {
      id: 'time_threshold',
      name: 'Time Deviation Threshold',
      description: 'Minimum percentage deviation to flag a time-based anomaly',
      value: 25,
      min: 5,
      max: 100,
      unit: '%'
    },
    {
      id: 'sequence_confidence',
      name: 'Sequence Violation Confidence',
      description: 'Minimum confidence level to report a sequence violation',
      value: 85,
      min: 50,
      max: 100,
      unit: '%'
    },
    {
      id: 'resource_threshold',
      name: 'Resource Imbalance Threshold',
      description: 'Threshold for resource distribution anomalies',
      value: 30,
      min: 10,
      max: 100,
      unit: '%'
    },
    {
      id: 'alert_sensitivity',
      name: 'Alert Sensitivity',
      description: 'Overall sensitivity for anomaly detection',
      value: 65,
      min: 10,
      max: 100,
      unit: '%'
    }
  ]);
  
  const handleSettingChange = (id: string, newValue: number) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    ));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your anomaly detection settings have been updated",
      variant: "success",
    });
    onClose();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">Anomaly Detection Settings</h2>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Configure Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.map(setting => (
              <div key={setting.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor={setting.id}>
                    {setting.name}
                  </label>
                  <span className="text-sm font-medium">
                    {setting.value}{setting.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
                <input
                  id={setting.id}
                  type="range"
                  min={setting.min}
                  max={setting.max}
                  value={setting.value}
                  onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Custom Anomaly Type
            </Button>
            <div className="flex items-center text-amber-600 text-sm ml-auto">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Changes will be applied to future analysis only
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutlierSettings;
