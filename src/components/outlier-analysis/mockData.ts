
import { 
  OutlierEvent, 
  AIInsight, 
  OutlierTimelineData, 
  OutlierHeatmapData, 
  OutlierDistributionData, 
  OutlierLogEntry 
} from './types';

// Mock AI Insights
export const mockAIInsights: AIInsight = {
  text: "AI detected recurring delays in the approval process; potential inefficiency in manual steps. Based on current data, there's a pattern of resource imbalances in the claims processing workflow. Approval tasks are taking 45% longer than the established baseline.",
  confidence: 0.87,
  recommendations: [
    "Redistribute workload for approval tasks across available resources",
    "Review and optimize manual verification steps in the process",
    "Consider automating the document validation step to reduce processing time"
  ]
};

// Mock Outlier Events
export const mockOutlierEvents: OutlierEvent[] = [
  {
    id: "out-001",
    name: "Approval Delay Anomaly",
    category: "time",
    severity: "high",
    timestamp: "2023-10-15T14:32:45",
    activity: "Approve Claims Request",
    resource: "Claims Department",
    deviationValue: 84.5,
    deviationPercentage: 168,
    description: "Significant delay detected in claims approval process, exceeding normal processing time by 168%",
    aiConfidence: 0.95,
    status: "new"
  },
  {
    id: "out-002",
    name: "Resource Overallocation",
    category: "resource",
    severity: "medium",
    timestamp: "2023-10-16T09:18:22",
    activity: "Document Verification",
    resource: "Verification Team",
    deviationValue: 12.3,
    deviationPercentage: 45,
    description: "Resource utilization for document verification exceeds normal levels by 45%",
    aiConfidence: 0.82,
    status: "confirmed"
  },
  {
    id: "out-003",
    name: "Sequence Violation",
    category: "sequence",
    severity: "critical",
    timestamp: "2023-10-16T16:45:03",
    activity: "Payment Processing",
    resource: "Financial Operations",
    deviationValue: 1,
    deviationPercentage: 100,
    description: "Payment processed before required approval step, violating procedure sequence",
    aiConfidence: 0.98,
    status: "new"
  },
  {
    id: "out-004",
    name: "Processing Time Anomaly",
    category: "time",
    severity: "low",
    timestamp: "2023-10-17T11:27:39",
    activity: "Customer Notification",
    resource: "Communication Team",
    deviationValue: 8.2,
    deviationPercentage: 15,
    description: "Minor delay in customer notification process detected",
    aiConfidence: 0.75,
    status: "dismissed"
  },
  {
    id: "out-005",
    name: "Workload Imbalance",
    category: "resource",
    severity: "high",
    timestamp: "2023-10-18T10:05:17",
    activity: "Initial Assessment",
    resource: "Assessment Team",
    deviationValue: 28.4,
    deviationPercentage: 95,
    description: "Significant workload imbalance detected in assessment distribution",
    aiConfidence: 0.88,
    status: "new"
  },
  {
    id: "out-006",
    name: "Duplicate Processing",
    category: "sequence",
    severity: "medium",
    timestamp: "2023-10-18T14:22:51",
    activity: "Data Entry",
    resource: "Data Management",
    deviationValue: 2,
    deviationPercentage: 200,
    description: "Duplicate entries detected for the same case, causing inefficiency",
    aiConfidence: 0.86,
    status: "confirmed"
  },
  {
    id: "out-007",
    name: "System Response Delay",
    category: "time",
    severity: "critical",
    timestamp: "2023-10-19T08:40:12",
    activity: "System Authentication",
    resource: "IT Infrastructure",
    deviationValue: 75.8,
    deviationPercentage: 245,
    description: "Critical delay in system authentication affecting multiple users",
    aiConfidence: 0.97,
    status: "new"
  }
];

// Mock Timeline Data
export const mockTimelineData: OutlierTimelineData[] = [
  { date: "2023-10-01", count: 3, sequenceViolations: 1, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-02", count: 2, sequenceViolations: 0, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-03", count: 5, sequenceViolations: 2, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-04", count: 1, sequenceViolations: 0, timeOutliers: 1, resourceImbalances: 0 },
  { date: "2023-10-05", count: 4, sequenceViolations: 1, timeOutliers: 1, resourceImbalances: 2 },
  { date: "2023-10-06", count: 2, sequenceViolations: 0, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-07", count: 3, sequenceViolations: 1, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-08", count: 6, sequenceViolations: 2, timeOutliers: 3, resourceImbalances: 1 },
  { date: "2023-10-09", count: 4, sequenceViolations: 1, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-10", count: 2, sequenceViolations: 0, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-11", count: 5, sequenceViolations: 2, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-12", count: 7, sequenceViolations: 3, timeOutliers: 2, resourceImbalances: 2 },
  { date: "2023-10-13", count: 4, sequenceViolations: 1, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-14", count: 3, sequenceViolations: 1, timeOutliers: 1, resourceImbalances: 1 },
  { date: "2023-10-15", count: 8, sequenceViolations: 3, timeOutliers: 3, resourceImbalances: 2 },
  { date: "2023-10-16", count: 5, sequenceViolations: 2, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-17", count: 4, sequenceViolations: 1, timeOutliers: 2, resourceImbalances: 1 },
  { date: "2023-10-18", count: 6, sequenceViolations: 2, timeOutliers: 2, resourceImbalances: 2 },
  { date: "2023-10-19", count: 9, sequenceViolations: 3, timeOutliers: 4, resourceImbalances: 2 },
  { date: "2023-10-20", count: 5, sequenceViolations: 2, timeOutliers: 2, resourceImbalances: 1 }
];

// Mock Heatmap Data
export const mockHeatmapData: OutlierHeatmapData[] = [
  { activity: "Claim Submission", resource: "Online Portal", value: 2 },
  { activity: "Claim Submission", resource: "Mobile App", value: 1 },
  { activity: "Claim Submission", resource: "Call Center", value: 4 },
  { activity: "Initial Assessment", resource: "Assessment Team A", value: 7 },
  { activity: "Initial Assessment", resource: "Assessment Team B", value: 3 },
  { activity: "Document Verification", resource: "Verification Team", value: 8 },
  { activity: "Document Verification", resource: "Automated System", value: 1 },
  { activity: "Approve Claims", resource: "Claims Manager", value: 9 },
  { activity: "Approve Claims", resource: "Senior Specialist", value: 6 },
  { activity: "Payment Processing", resource: "Financial Ops", value: 5 },
  { activity: "Payment Processing", resource: "Automated Payment", value: 2 },
  { activity: "Customer Notification", resource: "Email System", value: 3 },
  { activity: "Customer Notification", resource: "SMS System", value: 4 },
  { activity: "Customer Notification", resource: "Call Center", value: 6 }
];

// Mock Distribution Data
export const mockActivityDistribution: OutlierDistributionData[] = [
  { name: "Claim Submission", value: 120, deviation: 7 },
  { name: "Initial Assessment", value: 95, deviation: 10 },
  { name: "Document Verification", value: 85, deviation: 15 },
  { name: "Approve Claims", value: 110, deviation: 25 },
  { name: "Payment Processing", value: 70, deviation: 8 },
  { name: "Customer Notification", value: 130, deviation: 13 }
];

export const mockResourceDistribution: OutlierDistributionData[] = [
  { name: "Online Portal", value: 85, deviation: 5 },
  { name: "Call Center", value: 110, deviation: 15 },
  { name: "Assessment Team", value: 90, deviation: 20 },
  { name: "Verification Team", value: 70, deviation: 25 },
  { name: "Claims Manager", value: 55, deviation: 30 },
  { name: "Financial Ops", value: 65, deviation: 10 },
  { name: "Automated Systems", value: 130, deviation: 8 }
];

// Mock Event Logs
export const mockEventLogs: Record<string, OutlierLogEntry[]> = {
  "out-001": [
    { timestamp: "2023-10-15T14:30:10", activity: "Begin Approval Review", resource: "Claims Specialist", deviationValue: 0 },
    { timestamp: "2023-10-15T14:45:22", activity: "Check Documentation", resource: "Claims Specialist", deviationValue: 5.2 },
    { timestamp: "2023-10-15T15:20:37", activity: "Request Additional Info", resource: "Claims Specialist", deviationValue: 25.3 },
    { timestamp: "2023-10-15T16:15:58", activity: "Review Additional Info", resource: "Claims Manager", deviationValue: 40.7 },
    { timestamp: "2023-10-15T16:57:12", activity: "Complete Approval", resource: "Claims Manager", deviationValue: 84.5 }
  ],
  "out-003": [
    { timestamp: "2023-10-16T16:30:15", activity: "Payment Request Received", resource: "Financial System", deviationValue: 0 },
    { timestamp: "2023-10-16T16:35:42", activity: "Payment Initiated", resource: "Financial Officer", deviationValue: 0 },
    { timestamp: "2023-10-16T16:39:18", activity: "Payment Processed", resource: "Financial System", deviationValue: 1 },
    { timestamp: "2023-10-16T16:45:03", activity: "Approval Check Failed", resource: "Compliance System", deviationValue: 1 },
    { timestamp: "2023-10-16T16:50:27", activity: "Sequence Error Flagged", resource: "Audit System", deviationValue: 1 }
  ],
  "out-007": [
    { timestamp: "2023-10-19T08:15:32", activity: "Login Attempt", resource: "User Authentication System", deviationValue: 0 },
    { timestamp: "2023-10-19T08:16:45", activity: "Credential Validation", resource: "Authentication Service", deviationValue: 15.2 },
    { timestamp: "2023-10-19T08:23:18", activity: "Database Query", resource: "Database Server", deviationValue: 42.6 },
    { timestamp: "2023-10-19T08:35:09", activity: "Session Creation", resource: "Session Manager", deviationValue: 65.3 },
    { timestamp: "2023-10-19T08:40:12", activity: "User Authentication Complete", resource: "Authentication Service", deviationValue: 75.8 }
  ]
};
