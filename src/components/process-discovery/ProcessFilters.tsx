
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProcessFiltersProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
  caseVariant: string;
  setCaseVariant: (value: string) => void;
  orgUnit: string;
  setOrgUnit: (value: string) => void;
}

const ProcessFilters: React.FC<ProcessFiltersProps> = ({
  timeframe,
  setTimeframe,
  caseVariant,
  setCaseVariant,
  orgUnit,
  setOrgUnit
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mt-3">
      <Select value={timeframe} onValueChange={setTimeframe}>
        <SelectTrigger>
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={caseVariant} onValueChange={setCaseVariant}>
        <SelectTrigger>
          <SelectValue placeholder="Select case variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Variants</SelectItem>
          <SelectItem value="standard">Standard Flow</SelectItem>
          <SelectItem value="credit">Credit Card Only</SelectItem>
          <SelectItem value="bank">Bank Transfer Only</SelectItem>
          <SelectItem value="error">With Errors</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={orgUnit} onValueChange={setOrgUnit}>
        <SelectTrigger>
          <SelectValue placeholder="Select org unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Units</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
          <SelectItem value="customer">Customer Service</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProcessFilters;
