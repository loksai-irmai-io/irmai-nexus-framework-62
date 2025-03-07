
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OutlierCategory, OutlierSeverity, OutlierTimeframe, OutlierType } from './types';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutlierFiltersProps {
  filters: {
    categories: OutlierCategory[];
    severities: OutlierSeverity[];
    timeframe: OutlierTimeframe;
    types: OutlierType[];
  };
  onFiltersChange: (filters: any) => void;
  isCompact?: boolean;
}

const OutlierFilters: React.FC<OutlierFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  isCompact = false 
}) => {
  // Prepare filter options
  const categoryOptions: { value: OutlierCategory; label: string }[] = [
    { value: 'sequence_violation', label: 'Sequence Violations' },
    { value: 'time_outlier', label: 'Time-based Outliers' },
    { value: 'resource_imbalance', label: 'Resource Imbalances' },
    { value: 'data_quality', label: 'Data Quality Issues' },
    { value: 'compliance_breach', label: 'Compliance Breaches' },
  ];

  const severityOptions: { value: OutlierSeverity; label: string }[] = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const typeOptions: { value: OutlierType; label: string }[] = [
    { value: 'process', label: 'Process' },
    { value: 'activity', label: 'Activity' },
    { value: 'resource', label: 'Resource' },
    { value: 'data', label: 'Data' },
    { value: 'compliance', label: 'Compliance' },
  ];

  const timeframeOptions: { value: OutlierTimeframe; label: string }[] = [
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
  ];

  // Handler for checkbox changes
  const handleCategoryToggle = (category: OutlierCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    
    onFiltersChange({ categories: newCategories });
  };

  const handleSeverityToggle = (severity: OutlierSeverity, checked: boolean) => {
    const newSeverities = checked
      ? [...filters.severities, severity]
      : filters.severities.filter((s) => s !== severity);
    
    onFiltersChange({ severities: newSeverities });
  };

  const handleTypeToggle = (type: OutlierType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter((t) => t !== type);
    
    onFiltersChange({ types: newTypes });
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: OutlierTimeframe) => {
    onFiltersChange({ timeframe: value });
  };

  // For compact view (when in the list or detail view)
  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        <Select 
          value={filters.timeframe} 
          onValueChange={(value) => handleTimeframeChange(value as OutlierTimeframe)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-medium text-sm mb-2">Timeframe</h3>
          <Select 
            value={filters.timeframe} 
            onValueChange={(value) => handleTimeframeChange(value as OutlierTimeframe)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-2">Anomaly Category</h3>
          <div className="space-y-2">
            {categoryOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${option.value}`} 
                  checked={filters.categories.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleCategoryToggle(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-2">Severity</h3>
          <div className="space-y-2">
            {severityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`severity-${option.value}`} 
                  checked={filters.severities.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleSeverityToggle(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`severity-${option.value}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    option.value === 'critical' ? 'text-red-600' :
                    option.value === 'high' ? 'text-orange-500' :
                    option.value === 'medium' ? 'text-yellow-500' :
                    'text-green-600'
                  }`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-2">Outlier Type</h3>
          <div className="space-y-2">
            {typeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${option.value}`} 
                  checked={filters.types.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleTypeToggle(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`type-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OutlierFilters;
