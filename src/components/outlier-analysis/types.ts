
import { InsightItem, InsightSeverity, InsightStatus, InsightType } from '../process-discovery/types';

export type OutlierTimeframe = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type OutlierSeverity = InsightSeverity; // reuse the existing severity types
export type OutlierCategory = 'sequence_violation' | 'time_outlier' | 'resource_imbalance' | 'data_quality' | 'compliance_breach';
export type OutlierStatus = InsightStatus; // reuse the existing status types
export type OutlierType = 'process' | 'activity' | 'resource' | 'data' | 'compliance';

export interface OutlierEvent {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  category: OutlierCategory;
  severity: OutlierSeverity;
  status: OutlierStatus;
  type: OutlierType;
  deviation: number; // percentage of deviation from normal
  process: string;
  activity?: string;
  resource?: string;
  assignedTo?: string;
  comments?: OutlierComment[];
  relatedEvents?: number[]; // IDs of related outlier events
  recommendations?: string[];
}

export interface OutlierComment {
  id: number;
  userId: string;
  userName: string;
  timestamp: string;
  content: string;
}

// Updated to work with Chart component by adding index signature
export interface OutlierTimelineData {
  date: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  topProcess?: string;
  percentChange?: number;
  hasAlert?: boolean;
  [key: string]: string | number | boolean | undefined; // Add index signature for Chart component
}

export interface OutlierCategoryData {
  id: OutlierCategory;
  label: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface OutlierHeatmapNode {
  id: string;
  label: string;
  anomalyCount: number;
  anomalyPercentage: number;
}

export interface OutlierHeatmapEdge {
  id: string;
  source: string;
  target: string;
  anomalyCount: number;
  anomalyPercentage: number;
}

export interface OutlierInsight extends InsightItem {
  recommendation: string;
  validated: boolean;
  overridden: boolean;
}

export interface OutlierAlert {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  severity: OutlierSeverity;
  isNew: boolean;
  category: OutlierCategory;
  assignedTo?: string;
}

export interface OutlierDetectionSettings {
  sensitivityThreshold: number; // Overall sensitivity (0-100)
  categoryThresholds: Record<OutlierCategory, number>; // Per-category thresholds
  enabledCategories: OutlierCategory[];
  enablePredictiveAlerts: boolean;
  alertThreshold: number; // Minimum severity to trigger alerts
  refreshInterval: number; // In seconds
}
