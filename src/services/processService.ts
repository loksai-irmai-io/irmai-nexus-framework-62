
import { ProcessData } from '@/components/process-discovery/types';

export interface EventLogResponse {
  message: string;
  status_code: 'success' | 'failed';
  data?: ProcessData;
}

// Mock data for a successful upload response
const MOCK_PROCESS_DATA: ProcessData = {
  nodes: [
    {"id": "start", "type": "event", "label": "Start FX Trade", "position": {"x": 100, "y": 150}, "compliant": true},
    {"id": "request", "type": "activity", "label": "Request Quote", "position": {"x": 250, "y": 150}, "compliant": true},
    {"id": "gateway1", "type": "gateway", "label": "Quote Acceptable?", "position": {"x": 400, "y": 150}, "compliant": true},
    {"id": "negotiate", "type": "activity", "label": "Negotiate Terms", "position": {"x": 550, "y": 100}, "compliant": false},
    {"id": "accept", "type": "activity", "label": "Accept Quote", "position": {"x": 550, "y": 200}, "compliant": true},
    {"id": "execute", "type": "activity", "label": "Execute Trade", "position": {"x": 700, "y": 150}, "compliant": true},
    {"id": "settle", "type": "activity", "label": "Settle Trade", "position": {"x": 850, "y": 150}, "compliant": true},
    {"id": "end", "type": "event", "label": "End FX Trade", "position": {"x": 1000, "y": 150}, "compliant": true}
  ],
  edges: [
    {"id": "e1", "source": "start", "target": "request"},
    {"id": "e2", "source": "request", "target": "gateway1"},
    {"id": "e3", "source": "gateway1", "target": "negotiate", "label": "No"},
    {"id": "e4", "source": "gateway1", "target": "accept", "label": "Yes"},
    {"id": "e5", "source": "negotiate", "target": "gateway1"},
    {"id": "e6", "source": "accept", "target": "execute"},
    {"id": "e7", "source": "execute", "target": "settle"},
    {"id": "e8", "source": "settle", "target": "end"}
  ]
};

export const processService = {
  uploadEventLog: async (file: File): Promise<EventLogResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate file
    const validFileTypes = ['text/csv', 'text/xml', 'application/xml', 'text/plain'];
    const fileType = file.type;
    
    if (!validFileTypes.includes(fileType) && !file.name.endsWith('.xes')) {
      return {
        status_code: 'failed',
        message: "Invalid file type. Please upload a CSV, XES, XML, or text file."
      };
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        status_code: 'failed',
        message: "File is too large. Maximum size is 10MB."
      };
    }
    
    // Simulate successful response 95% of the time
    if (Math.random() > 0.05) {
      return {
        status_code: 'success',
        message: `File "${file.name}" uploaded successfully`,
        data: MOCK_PROCESS_DATA
      };
    } else {
      return {
        status_code: 'failed',
        message: 'Failed to process the file. Please try a different file.'
      };
    }
  },
  
  getExampleData: async (): Promise<EventLogResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status_code: 'success',
      message: 'Example data loaded successfully',
      data: MOCK_PROCESS_DATA
    };
  }
};
