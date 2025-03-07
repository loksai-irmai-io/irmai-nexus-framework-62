
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
}

export interface ProcessNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  compliant: boolean;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
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
}
