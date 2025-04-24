
import { InsightItem, ProcessData } from './types';

export const processData: ProcessData = {
  nodes: [
    { id: 'start', type: 'event', label: 'Start', position: { x: 100, y: 150 }, compliant: true },
    { id: 'checkout', type: 'activity', label: 'Checkout Cart', position: { x: 250, y: 150 }, compliant: true },
    { id: 'gateway1', type: 'gateway', label: 'Payment Method?', position: { x: 400, y: 150 }, compliant: true },
    { id: 'credit', type: 'activity', label: 'Process Credit Card', position: { x: 550, y: 100 }, compliant: false },
    { id: 'bank', type: 'activity', label: 'Process Bank Transfer', position: { x: 550, y: 200 }, compliant: true },
    { id: 'gateway2', type: 'gateway', label: 'Payment Successful?', position: { x: 700, y: 150 }, compliant: true },
    { id: 'confirm', type: 'activity', label: 'Confirm Order', position: { x: 850, y: 150 }, compliant: true },
    { id: 'error', type: 'activity', label: 'Handle Payment Error', position: { x: 700, y: 250 }, compliant: false },
    { id: 'end', type: 'event', label: 'End', position: { x: 1000, y: 150 }, compliant: true },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'checkout' },
    { id: 'e2', source: 'checkout', target: 'gateway1' },
    { id: 'e3', source: 'gateway1', target: 'credit', label: 'Credit Card' },
    { id: 'e4', source: 'gateway1', target: 'bank', label: 'Bank Transfer' },
    { id: 'e5', source: 'credit', target: 'gateway2' },
    { id: 'e6', source: 'bank', target: 'gateway2' },
    { id: 'e7', source: 'gateway2', target: 'confirm', label: 'Yes' },
    { id: 'e8', source: 'gateway2', target: 'error', label: 'No' },
    { id: 'e9', source: 'confirm', target: 'end' },
    { id: 'e10', source: 'error', target: 'checkout', label: 'Retry' },
  ]
};

export const insights: InsightItem[] = [
  {
    id: 1,
    type: 'anomaly',
    description: 'Credit Card processing takes 45% longer than average',
    status: 'pending',
    severity: 'high',
    nodeId: 'credit'
  },
  {
    id: 2,
    type: 'compliance',
    description: 'Required verification step skipped in 8% of Credit Card transactions',
    status: 'validated',
    severity: 'critical',
    nodeId: 'credit'
  },
  {
    id: 3,
    type: 'optimization',
    description: 'Bank Transfer has 30% fewer errors than Credit Card payments',
    status: 'pending',
    severity: 'medium',
    nodeId: 'bank'
  },
  {
    id: 4,
    type: 'anomaly',
    description: 'Unusual delay between Checkout and Payment Method selection',
    status: 'pending',
    severity: 'low',
    nodeId: 'checkout'
  },
  {
    id: 5,
    type: 'compliance',
    description: 'Error handling procedure not following compliance guidelines',
    status: 'pending',
    severity: 'high',
    nodeId: 'error'
  }
];

export const eventLogs = [
  { id: 1, timestamp: '2025-02-15T09:14:22', activity: 'Checkout Cart', caseId: 'C-1001', user: 'john.doe', duration: '2m 15s' },
  { id: 2, timestamp: '2025-02-15T09:16:45', activity: 'Process Credit Card', caseId: 'C-1001', user: 'system', duration: '1m 53s' },
  { id: 3, timestamp: '2025-02-15T09:18:40', activity: 'Payment Error', caseId: 'C-1001', user: 'system', duration: '0m 2s' },
  { id: 4, timestamp: '2025-02-15T09:20:15', activity: 'Checkout Cart', caseId: 'C-1001', user: 'john.doe', duration: '1m 45s' },
  { id: 5, timestamp: '2025-02-15T09:22:05', activity: 'Process Bank Transfer', caseId: 'C-1001', user: 'john.doe', duration: '3m 10s' },
  { id: 6, timestamp: '2025-02-15T09:25:20', activity: 'Confirm Order', caseId: 'C-1001', user: 'system', duration: '0m 45s' },
  { id: 7, timestamp: '2025-02-15T10:30:10', activity: 'Checkout Cart', caseId: 'C-1002', user: 'jane.smith', duration: '1m 50s' },
  { id: 8, timestamp: '2025-02-15T10:32:05', activity: 'Process Credit Card', caseId: 'C-1002', user: 'system', duration: '4m 35s' },
  { id: 9, timestamp: '2025-02-15T10:36:45', activity: 'Confirm Order', caseId: 'C-1002', user: 'system', duration: '0m 30s' },
  { id: 10, timestamp: '2025-02-15T11:45:15', activity: 'Checkout Cart', caseId: 'C-1003', user: 'robert.jones', duration: '2m 5s' },
];
