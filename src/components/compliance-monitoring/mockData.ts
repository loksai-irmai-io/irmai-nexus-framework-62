
import { 
  ComplianceFramework, 
  BusinessUnit, 
  ComplianceControl, 
  EvidenceItem, 
  ComplianceAlert, 
  ComplianceGap, 
  WorkflowEvent,
  HeatmapCell 
} from './types';

export const mockFrameworks: ComplianceFramework[] = [
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    complianceScore: 85,
    previousScore: 80,
    trend: 'up',
    totalControls: 114,
    passedControls: 97,
    failedControls: 10,
    notTestedControls: 7,
    lastUpdated: '2023-11-15',
    nextAssessment: '2024-05-15',
    owners: ['Sarah Johnson'],
    priority: 'high'
  },
  {
    id: 'soc2',
    name: 'SOC 2',
    description: 'Service Organization Control 2',
    complianceScore: 92,
    previousScore: 95,
    trend: 'down',
    totalControls: 64,
    passedControls: 59,
    failedControls: 2,
    notTestedControls: 3,
    lastUpdated: '2023-12-01',
    nextAssessment: '2024-06-01',
    owners: ['Michael Chen'],
    priority: 'high'
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    complianceScore: 78,
    previousScore: 72,
    trend: 'up',
    totalControls: 42,
    passedControls: 33,
    failedControls: 6,
    notTestedControls: 3,
    lastUpdated: '2023-10-22',
    nextAssessment: '2024-04-22',
    owners: ['Anna Kowalski'],
    priority: 'medium'
  },
  {
    id: 'pcidss',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    complianceScore: 90,
    previousScore: 88,
    trend: 'up',
    totalControls: 78,
    passedControls: 70,
    failedControls: 5,
    notTestedControls: 3,
    lastUpdated: '2023-11-05',
    nextAssessment: '2024-02-05',
    owners: ['David Martinez'],
    priority: 'high'
  }
];

export const mockBusinessUnits: BusinessUnit[] = [
  { id: 'it', name: 'IT Department', head: 'John Smith' },
  { id: 'finance', name: 'Finance', head: 'Alice Wong' },
  { id: 'hr', name: 'Human Resources', head: 'Robert Johnson' },
  { id: 'sales', name: 'Sales & Marketing', head: 'Emma Davis' },
  { id: 'ops', name: 'Operations', head: 'James Wilson' }
];

export const mockControls: ComplianceControl[] = [
  {
    id: 'ctrl-001',
    name: 'Access Control Policy',
    description: 'Formal policy for access control including role-based permissions',
    status: 'compliant',
    frameworks: ['iso27001', 'soc2', 'gdpr'],
    owner: 'Sarah Johnson',
    lastTested: '2023-10-12',
    nextTest: '2024-01-12',
    evidenceCount: 5,
    automationLevel: 'partial',
    risk: 'high'
  },
  {
    id: 'ctrl-002',
    name: 'Vulnerability Management',
    description: 'Regular scanning and patching of vulnerabilities',
    status: 'non-compliant',
    frameworks: ['iso27001', 'pcidss'],
    owner: 'Michael Chen',
    lastTested: '2023-11-05',
    nextTest: '2024-02-05',
    evidenceCount: 2,
    automationLevel: 'full',
    risk: 'high'
  },
  {
    id: 'ctrl-003',
    name: 'Data Encryption',
    description: 'Encryption of sensitive data at rest and in transit',
    status: 'partially-compliant',
    frameworks: ['iso27001', 'soc2', 'gdpr', 'pcidss'],
    owner: 'Anna Kowalski',
    lastTested: '2023-09-18',
    nextTest: '2024-01-18',
    evidenceCount: 3,
    automationLevel: 'partial',
    risk: 'high'
  },
  {
    id: 'ctrl-004',
    name: 'Backup Procedures',
    description: 'Regular backup and recovery testing',
    status: 'compliant',
    frameworks: ['iso27001', 'soc2'],
    owner: 'David Martinez',
    lastTested: '2023-10-30',
    nextTest: '2024-01-30',
    evidenceCount: 6,
    automationLevel: 'full',
    risk: 'medium'
  }
];

export const mockEvidenceItems: EvidenceItem[] = [
  {
    id: 'ev-001',
    controlId: 'ctrl-001',
    name: 'Access Control Policy Document',
    type: 'document',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2023-10-10',
    status: 'verified',
    url: '/documents/access-policy.pdf'
  },
  {
    id: 'ev-002',
    controlId: 'ctrl-001',
    name: 'Role Assignment Matrix',
    type: 'document',
    uploadedBy: 'Robert Johnson',
    uploadedAt: '2023-10-11',
    status: 'verified',
    url: '/documents/role-matrix.xlsx'
  },
  {
    id: 'ev-003',
    controlId: 'ctrl-002',
    name: 'Vulnerability Scan Report - November',
    type: 'report',
    uploadedBy: 'System',
    uploadedAt: '2023-11-03',
    status: 'verified',
    url: '/reports/vuln-scan-nov.pdf'
  },
  {
    id: 'ev-004',
    controlId: 'ctrl-003',
    name: 'Encryption Implementation Screenshot',
    type: 'screenshot',
    uploadedBy: 'Anna Kowalski',
    uploadedAt: '2023-09-15',
    status: 'pending',
    url: '/screenshots/encryption-settings.png'
  }
];

export const mockAlerts: ComplianceAlert[] = [
  {
    id: 'alert-001',
    title: 'Control Failure: Vulnerability Management',
    description: 'Critical patches not applied within required timeframe',
    type: 'failed-control',
    severity: 'critical',
    timestamp: '2023-11-05T14:30:00',
    relatedControlId: 'ctrl-002',
    relatedFrameworkId: 'iso27001',
    status: 'new',
    aiRecommendation: 'Implement automated patch management system and establish emergency patch protocol for critical vulnerabilities'
  },
  {
    id: 'alert-002',
    title: 'Upcoming Deadline: ISO 27001 Assessment',
    description: 'Annual assessment due in 45 days',
    type: 'upcoming-deadline',
    severity: 'medium',
    timestamp: '2023-11-01T09:15:00',
    relatedFrameworkId: 'iso27001',
    status: 'acknowledged',
    aiRecommendation: 'Begin preparation by reviewing control documentation and scheduling preliminary internal audit'
  },
  {
    id: 'alert-003',
    title: 'Gap Identified: Data Subject Rights',
    description: 'GDPR requirement for data subject access requests not fully implemented',
    type: 'gap-identified',
    severity: 'high',
    timestamp: '2023-10-28T11:45:00',
    relatedFrameworkId: 'gdpr',
    status: 'new',
    aiRecommendation: 'Develop and implement a formal process for handling DSAR within required timeframes'
  }
];

export const mockGaps: ComplianceGap[] = [
  {
    id: 'gap-001',
    frameworkId: 'iso27001',
    requirement: 'A.12.6.1 Vulnerability Management',
    controlId: 'ctrl-002',
    currentState: 'Vulnerability scanning performed quarterly with ad-hoc patching',
    expectedState: 'Monthly vulnerability scanning with critical patches applied within 72 hours',
    impact: 'high',
    remediation: 'Implement automated vulnerability scanning and patch management system',
    dueDate: '2024-02-15',
    assignedTo: 'Michael Chen',
    status: 'in-progress'
  },
  {
    id: 'gap-002',
    frameworkId: 'gdpr',
    requirement: 'Article 15: Right of Access',
    currentState: 'Manual process for data subject access requests with inconsistent response times',
    expectedState: 'Streamlined process ensuring responses within 30 days with tracking and documentation',
    impact: 'medium',
    remediation: 'Implement DSAR management system and formalize process',
    dueDate: '2024-03-01',
    assignedTo: 'Anna Kowalski',
    status: 'open'
  },
  {
    id: 'gap-003',
    frameworkId: 'pcidss',
    requirement: 'Requirement 3.4: Render PAN unreadable',
    controlId: 'ctrl-003',
    currentState: 'Partial implementation of encryption for payment data',
    expectedState: 'Full encryption for all stored cardholder data',
    impact: 'high',
    remediation: 'Extend encryption to all databases and storage systems containing PAN data',
    dueDate: '2024-01-20',
    assignedTo: 'David Martinez',
    status: 'in-progress'
  }
];

export const mockWorkflowEvents: WorkflowEvent[] = [
  {
    id: 'wf-001',
    type: 'control-test',
    title: 'Access Control Policy Review',
    description: 'Annual review of access control policy',
    status: 'completed',
    timestamp: '2023-10-12T13:00:00',
    relatedItemId: 'ctrl-001',
    comments: [
      {
        id: 'comment-001',
        author: 'Sarah Johnson',
        text: 'Policy reviewed and updated to reflect new remote work requirements',
        timestamp: '2023-10-12T13:30:00'
      }
    ]
  },
  {
    id: 'wf-002',
    type: 'gap-identification',
    title: 'GDPR Gap Analysis',
    description: 'Review of GDPR compliance status',
    status: 'completed',
    timestamp: '2023-10-28T10:30:00',
    relatedItemId: 'gap-002',
    comments: [
      {
        id: 'comment-002',
        author: 'Anna Kowalski',
        text: 'Identified gaps in DSAR handling process',
        timestamp: '2023-10-28T11:15:00'
      }
    ]
  },
  {
    id: 'wf-003',
    type: 'remediation',
    title: 'Implement Vulnerability Management System',
    description: 'Deploy automated vulnerability scanning and patching',
    status: 'in-progress',
    timestamp: '2023-11-10T09:00:00',
    dueDate: '2024-02-15',
    assignedTo: 'Michael Chen',
    relatedItemId: 'gap-001',
    comments: [
      {
        id: 'comment-003',
        author: 'Michael Chen',
        text: 'Evaluating vendor solutions, plan to select by end of month',
        timestamp: '2023-11-15T14:20:00'
      }
    ]
  }
];

export const mockHeatmapData: HeatmapCell[] = [
  { frameworkId: 'iso27001', businessUnitId: 'it', complianceScore: 88, trend: 'up', alertCount: 2, gapCount: 1 },
  { frameworkId: 'iso27001', businessUnitId: 'finance', complianceScore: 85, trend: 'up', alertCount: 1, gapCount: 1 },
  { frameworkId: 'iso27001', businessUnitId: 'hr', complianceScore: 90, trend: 'neutral', alertCount: 0, gapCount: 0 },
  { frameworkId: 'iso27001', businessUnitId: 'sales', complianceScore: 82, trend: 'up', alertCount: 1, gapCount: 0 },
  { frameworkId: 'iso27001', businessUnitId: 'ops', complianceScore: 79, trend: 'down', alertCount: 2, gapCount: 1 },
  
  { frameworkId: 'soc2', businessUnitId: 'it', complianceScore: 95, trend: 'up', alertCount: 0, gapCount: 0 },
  { frameworkId: 'soc2', businessUnitId: 'finance', complianceScore: 92, trend: 'down', alertCount: 1, gapCount: 0 },
  { frameworkId: 'soc2', businessUnitId: 'hr', complianceScore: 88, trend: 'neutral', alertCount: 1, gapCount: 1 },
  { frameworkId: 'soc2', businessUnitId: 'sales', complianceScore: 94, trend: 'up', alertCount: 0, gapCount: 0 },
  { frameworkId: 'soc2', businessUnitId: 'ops', complianceScore: 90, trend: 'neutral', alertCount: 1, gapCount: 0 },
  
  { frameworkId: 'gdpr', businessUnitId: 'it', complianceScore: 80, trend: 'up', alertCount: 1, gapCount: 0 },
  { frameworkId: 'gdpr', businessUnitId: 'finance', complianceScore: 75, trend: 'neutral', alertCount: 1, gapCount: 1 },
  { frameworkId: 'gdpr', businessUnitId: 'hr', complianceScore: 72, trend: 'up', alertCount: 2, gapCount: 1 },
  { frameworkId: 'gdpr', businessUnitId: 'sales', complianceScore: 85, trend: 'up', alertCount: 0, gapCount: 0 },
  { frameworkId: 'gdpr', businessUnitId: 'ops', complianceScore: 78, trend: 'neutral', alertCount: 1, gapCount: 0 },
  
  { frameworkId: 'pcidss', businessUnitId: 'it', complianceScore: 92, trend: 'up', alertCount: 0, gapCount: 0 },
  { frameworkId: 'pcidss', businessUnitId: 'finance', complianceScore: 95, trend: 'up', alertCount: 0, gapCount: 0 },
  { frameworkId: 'pcidss', businessUnitId: 'hr', complianceScore: 80, trend: 'neutral', alertCount: 0, gapCount: 0 },
  { frameworkId: 'pcidss', businessUnitId: 'sales', complianceScore: 85, trend: 'down', alertCount: 1, gapCount: 1 },
  { frameworkId: 'pcidss', businessUnitId: 'ops', complianceScore: 88, trend: 'up', alertCount: 1, gapCount: 1 }
];

// Helper function to get framework by ID
export const getFrameworkById = (id: string): ComplianceFramework | undefined => {
  return mockFrameworks.find(framework => framework.id === id);
};

// Helper function to get controls by framework ID
export const getControlsByFramework = (frameworkId: string): ComplianceControl[] => {
  return mockControls.filter(control => control.frameworks.includes(frameworkId));
};

// Helper function to get gaps by framework ID
export const getGapsByFramework = (frameworkId: string): ComplianceGap[] => {
  return mockGaps.filter(gap => gap.frameworkId === frameworkId);
};

// Helper function to get evidence by control ID
export const getEvidenceByControl = (controlId: string): EvidenceItem[] => {
  return mockEvidenceItems.filter(item => item.controlId === controlId);
};

// Helper function to get alerts by framework ID
export const getAlertsByFramework = (frameworkId: string): ComplianceAlert[] => {
  return mockAlerts.filter(alert => alert.relatedFrameworkId === frameworkId);
};

// Helper function to get workflow events by related item ID
export const getWorkflowByRelatedItem = (itemId: string): WorkflowEvent[] => {
  return mockWorkflowEvents.filter(event => event.relatedItemId === itemId);
};

// Helper function to get heatmap data for specific framework
export const getHeatmapByFramework = (frameworkId: string): HeatmapCell[] => {
  return mockHeatmapData.filter(cell => cell.frameworkId === frameworkId);
};
