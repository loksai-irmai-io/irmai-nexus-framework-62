
export interface ProcessNode {
  id: string;
  type: string;
  label: string;
  position: {
    x: number;
    y: number;
  };
  compliant: boolean;
  metrics: {
    frequency: number;
    avgDuration: string;
  };
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

export interface InsightItem {
  id: number;
  type: 'anomaly' | 'compliance' | 'optimization';
  description: string;
  status: 'pending' | 'validated' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  nodeId: string;
}

export interface EventLog {
  id: number;
  timestamp: string;
  activity: string;
  caseId: string;
  user: string;
  duration: string;
}
