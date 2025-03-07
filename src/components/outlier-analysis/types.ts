
export type OutlierSeverity = 'critical' | 'high' | 'medium' | 'low';
export type OutlierCategory = 'sequence' | 'time' | 'resource' | 'other';

export interface OutlierEvent {
  id: string;
  name: string;
  category: OutlierCategory;
  severity: OutlierSeverity;
  timestamp: string;
  activity: string;
  resource: string;
  deviationValue: number;
  deviationPercentage: number;
  description: string;
  aiConfidence: number;
  status: 'new' | 'confirmed' | 'dismissed';
}

export interface OutlierLogEntry {
  timestamp: string;
  activity: string;
  resource: string;
  deviationValue: number;
}

export interface AIInsight {
  text: string;
  confidence: number;
  recommendations: string[];
}

export interface OutlierTimelineData {
  date: string;
  count: number;
  sequenceViolations: number;
  timeOutliers: number;
  resourceImbalances: number;
  [key: string]: string | number;
}

export interface OutlierHeatmapData {
  activity: string;
  resource: string;
  value: number;
  [key: string]: string | number;
}

export interface OutlierDistributionData {
  name: string;
  value: number;
  deviation: number;
  [key: string]: string | number;
}
