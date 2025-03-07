
export type ComplianceFramework = {
  id: string;
  name: string;
  description: string;
  complianceScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'neutral';
  totalControls: number;
  passedControls: number;
  failedControls: number;
  notTestedControls: number;
  lastUpdated: string;
  nextAssessment: string;
  owners: string[];
  priority: 'high' | 'medium' | 'low';
};

export type BusinessUnit = {
  id: string;
  name: string;
  head: string;
};

export type ComplianceControl = {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partially-compliant' | 'not-tested';
  frameworks: string[];
  owner: string;
  lastTested: string;
  nextTest: string;
  evidenceCount: number;
  automationLevel: 'full' | 'partial' | 'manual';
  risk: 'high' | 'medium' | 'low';
};

export type EvidenceItem = {
  id: string;
  controlId: string;
  name: string;
  type: 'document' | 'screenshot' | 'log' | 'report' | 'certification';
  uploadedBy: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
  url: string;
};

export type ComplianceAlert = {
  id: string;
  title: string;
  description: string;
  type: 'failed-control' | 'upcoming-deadline' | 'gap-identified' | 'evidence-needed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  relatedControlId?: string;
  relatedFrameworkId?: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  aiRecommendation?: string;
};

export type ComplianceGap = {
  id: string;
  frameworkId: string;
  requirement: string;
  controlId?: string;
  currentState: string;
  expectedState: string;
  impact: 'high' | 'medium' | 'low';
  remediation?: string;
  dueDate?: string;
  assignedTo?: string;
  status: 'open' | 'in-progress' | 'resolved';
};

export type WorkflowEvent = {
  id: string;
  type: 'control-test' | 'evidence-collection' | 'gap-identification' | 'remediation';
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  timestamp: string;
  dueDate?: string;
  assignedTo?: string;
  relatedItemId?: string;
  comments: WorkflowComment[];
};

export type WorkflowComment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

export type HeatmapCell = {
  frameworkId: string;
  businessUnitId: string;
  complianceScore: number;
  trend: 'up' | 'down' | 'neutral';
  alertCount: number;
  gapCount: number;
};

export type UserRole = 'executive' | 'compliance-officer' | 'control-owner';
