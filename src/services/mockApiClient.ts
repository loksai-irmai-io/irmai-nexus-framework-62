
import { EventLog } from '@/components/process-discovery/types';
import { parseCSV, convertToProcessGraph } from '@/utils/csvParser';

// Sample process data for the mock response
const sampleProcessData = {
  nodes: [
    { id: 'start', type: 'event', label: 'Start', position: { x: 100, y: 150 }, compliant: true },
    { id: 'checkout', type: 'activity', label: 'Checkout Cart', position: { x: 250, y: 150 }, compliant: true, metrics: { frequency: 450, avgDuration: '2m 15s' } },
    { id: 'gateway1', type: 'gateway', label: 'Payment Method?', position: { x: 400, y: 150 }, compliant: true },
    { id: 'credit', type: 'activity', label: 'Process Credit Card', position: { x: 550, y: 100 }, compliant: false, metrics: { frequency: 300, avgDuration: '3m 45s' } },
    { id: 'bank', type: 'activity', label: 'Process Bank Transfer', position: { x: 550, y: 200 }, compliant: true, metrics: { frequency: 150, avgDuration: '4m 30s' } },
    { id: 'gateway2', type: 'gateway', label: 'Payment Successful?', position: { x: 700, y: 150 }, compliant: true },
    { id: 'confirm', type: 'activity', label: 'Confirm Order', position: { x: 850, y: 150 }, compliant: true, metrics: { frequency: 400, avgDuration: '1m 20s' } },
    { id: 'error', type: 'activity', label: 'Handle Payment Error', position: { x: 700, y: 250 }, compliant: false, metrics: { frequency: 50, avgDuration: '5m 10s' } },
    { id: 'end', type: 'event', label: 'End', position: { x: 1000, y: 150 }, compliant: true },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'checkout', metrics: { frequency: 450 } },
    { id: 'e2', source: 'checkout', target: 'gateway1', metrics: { frequency: 450 } },
    { id: 'e3', source: 'gateway1', target: 'credit', label: 'Credit Card', metrics: { frequency: 300 } },
    { id: 'e4', source: 'gateway1', target: 'bank', label: 'Bank Transfer', metrics: { frequency: 150 } },
    { id: 'e5', source: 'credit', target: 'gateway2', metrics: { frequency: 300 } },
    { id: 'e6', source: 'bank', target: 'gateway2', metrics: { frequency: 150 } },
    { id: 'e7', source: 'gateway2', target: 'confirm', label: 'Yes', metrics: { frequency: 400 } },
    { id: 'e8', source: 'gateway2', target: 'error', label: 'No', metrics: { frequency: 50 } },
    { id: 'e9', source: 'confirm', target: 'end', metrics: { frequency: 400 } },
    { id: 'e10', source: 'error', target: 'checkout', label: 'Retry', metrics: { frequency: 50 } },
  ]
};

// Function to generate a large set of mock event logs
function generateMockEventLogs(count: number): EventLog[] {
  const activities = [
    'Checkout Cart',
    'Process Credit Card',
    'Process Bank Transfer',
    'Confirm Order',
    'Handle Payment Error'
  ];
  
  const users = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'robert.jones@example.com',
    'sarah.williams@example.com',
    'michael.brown@example.com',
    'system'
  ];
  
  const logs: EventLog[] = [];
  
  // Start with a base date
  const baseDate = new Date('2025-02-15T08:00:00');
  
  // Generate random case IDs
  const caseIds = Array.from({ length: Math.ceil(count / 5) }, (_, i) => `C-${1000 + i}`);
  
  for (let i = 0; i < count; i++) {
    // Calculate a timestamp that increments forward in time
    const timeOffset = Math.floor(Math.random() * 300) + (i * 60); // Add some randomness
    const timestamp = new Date(baseDate.getTime() + timeOffset * 1000);
    
    // Select a random activity, user, and case ID
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const caseId = caseIds[Math.floor(Math.random() * caseIds.length)];
    
    // Generate random duration
    const minutes = Math.floor(Math.random() * 5);
    const seconds = Math.floor(Math.random() * 60);
    const duration = `${minutes}m ${seconds}s`;
    
    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      activity,
      caseId,
      user,
      duration,
      details: {
        resource: user,
        cost: Math.floor(Math.random() * 100),
        outcome: Math.random() > 0.2 ? 'Success' : 'Failure'
      }
    });
  }
  
  // Sort logs by timestamp
  logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  return logs;
}

// Generate a large set of logs (1000 events)
const mockEventLogs = generateMockEventLogs(1000);

// Export the mock API client
export const mockApi = {
  uploadEventLog: async (file: File) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`[Mock API] Uploading file: ${file.name} (${file.size} bytes)`);
    
    // For CSV files, parse the content and generate process map
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const fileContent = await file.text();
        const parsedData = parseCSV(fileContent);
        
        // Convert the parsed data to event logs format
        const eventLogs = parsedData.map((row, index) => ({
          id: index + 1,
          timestamp: row.timestamp || new Date().toISOString(),
          activity: row.activity || 'Unknown Activity',
          caseId: row.case_id || `Case-${Math.floor(Math.random() * 1000)}`,
          user: row.resource || 'Unknown',
          duration: row.duration || '0m 0s',
          details: {
            ...row,
            resource: row.resource || 'Unknown',
            cost: Number(row.cost) || 0,
            outcome: Math.random() > 0.2 ? 'Success' : 'Failure'
          }
        }));
        
        // Generate process map from CSV data
        const processMap = convertToProcessGraph(parsedData);
        
        return {
          status: 'success',
          message: `Successfully processed ${eventLogs.length} events from ${file.name}`,
          data: eventLogs,
          processMap
        };
      } catch (error) {
        console.error('Error parsing CSV:', error);
        return {
          status: 'error',
          message: `Error parsing CSV file: ${error}`,
          data: mockEventLogs,
          processMap: sampleProcessData
        };
      }
    }
    
    // Return mock data for non-CSV files
    return {
      status: 'success',
      message: `Successfully processed ${mockEventLogs.length} events from ${file.name}`,
      data: mockEventLogs,
      processMap: sampleProcessData
    };
  }
};
