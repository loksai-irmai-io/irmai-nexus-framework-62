export type InsightType = 'anomaly' | 'compliance' | 'optimization';
export type InsightStatus = 'pending' | 'validated' | 'rejected';
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface InsightItem {
  id: number;
  type: InsightType;
  description: string;
  status: InsightStatus;
  severity: InsightSeverity;
  nodeId: string;
  impact?: number; // Optional impact score
  details?: string; // Optional detailed explanation
  recommendation?: string; // Optional recommendation for action
}

export interface ProcessNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
    waitTime?: string;
    resourceUtilization?: number;
  };
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
    waitTime?: string;
    resourceUtilization?: number;
  };
}

export interface ProcessData {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

export interface EventLog {
  id: number;
  timestamp: string;
  activity: string;
  caseId: string;
  user: string;
  duration: string;
  details?: {
    resource?: string;
    cost?: number;
    outcome?: string;
  };
}

// Dashboard interaction types
export interface FilterOptions {
  timeframe?: string;
  variant?: string;
  department?: string;
  status?: string;
  severity?: InsightSeverity[];
}

export interface DrilldownData {
  module: string;
  filter?: Record<string, any>;
  view?: string;
}

export interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
    waitTime?: string;
    resourceUtilization?: number;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  metrics?: {
    frequency?: number;
    avgDuration?: string;
  };
}
