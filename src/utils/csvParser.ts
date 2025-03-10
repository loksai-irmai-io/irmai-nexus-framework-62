
/**
 * Parses CSV content into an array of objects
 */
export const parseCSV = (csvContent: string): Record<string, string>[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1)
    .filter(line => line.trim() !== '') // Skip empty lines
    .map(line => {
      const values = line.split(',').map(value => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as Record<string, string>);
    });
};

/**
 * Converts parsed CSV data to process graph format
 */
export const convertToProcessGraph = (csvData: Record<string, string>[]) => {
  // Extract unique activities
  const activities = [...new Set(csvData.map(row => row.activity))];
  
  // Create nodes for each unique activity
  const nodes = activities.map((activity, index) => {
    return {
      id: `activity-${index}`,
      type: 'activity',
      label: activity,
      position: calculatePosition(index, activities.length),
      compliant: true,
      metrics: {
        frequency: csvData.filter(row => row.activity === activity).length,
        avgDuration: calculateAverageDuration(csvData.filter(row => row.activity === activity))
      }
    };
  });
  
  // Add start and end events
  nodes.unshift({
    id: 'start',
    type: 'event',
    label: 'Start',
    position: { x: 100, y: 150 },
    compliant: true
  });
  
  nodes.push({
    id: 'end',
    type: 'event',
    label: 'End',
    position: { x: 100 + (activities.length + 1) * 150, y: 150 },
    compliant: true
  });
  
  // Create edges
  const edges = [];
  
  // Connect start to first activity
  edges.push({
    id: 'e-start',
    source: 'start',
    target: 'activity-0',
    metrics: { frequency: csvData.length }
  });
  
  // Connect activities based on case flow
  const caseFlows = extractCaseFlows(csvData);
  
  // For each case, connect activities in sequence
  caseFlows.forEach((flow, flowIndex) => {
    flow.forEach((activityName, activityIndex) => {
      if (activityIndex < flow.length - 1) {
        const sourceActivity = activityName;
        const targetActivity = flow[activityIndex + 1];
        
        const sourceNode = nodes.find(node => node.label === sourceActivity);
        const targetNode = nodes.find(node => node.label === targetActivity);
        
        if (sourceNode && targetNode) {
          // Check if this edge already exists
          const existingEdge = edges.find(edge => 
            edge.source === sourceNode.id && edge.target === targetNode.id
          );
          
          if (existingEdge) {
            // Update frequency
            existingEdge.metrics.frequency = (existingEdge.metrics.frequency || 0) + 1;
          } else {
            // Create new edge
            edges.push({
              id: `e-${sourceNode.id}-${targetNode.id}`,
              source: sourceNode.id,
              target: targetNode.id,
              metrics: { frequency: 1 }
            });
          }
        }
      }
    });
  });
  
  // Connect last activity to end
  const lastActivityId = `activity-${activities.length - 1}`;
  edges.push({
    id: 'e-end',
    source: lastActivityId,
    target: 'end',
    metrics: { frequency: csvData.length }
  });
  
  return { nodes, edges };
};

// Helper function to extract case flows
const extractCaseFlows = (csvData: Record<string, string>[]) => {
  const caseMap = new Map<string, { activity: string, timestamp: string }[]>();
  
  csvData.forEach(row => {
    const caseId = row.case_id;
    if (!caseMap.has(caseId)) {
      caseMap.set(caseId, []);
    }
    
    caseMap.get(caseId)?.push({
      activity: row.activity,
      timestamp: row.timestamp
    });
  });
  
  // Sort activities by timestamp for each case
  for (const [caseId, activities] of caseMap.entries()) {
    activities.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    caseMap.set(caseId, activities);
  }
  
  // Return just the activity names in order for each case
  return Array.from(caseMap.values()).map(activities => 
    activities.map(a => a.activity)
  );
};

// Helper function to calculate position for nodes in a circular layout
const calculatePosition = (index: number, total: number) => {
  const radius = Math.min(total * 30, 200);
  const angle = (index / total) * 2 * Math.PI;
  
  // Start from 250,150 and create a circular layout
  return {
    x: 250 + Math.cos(angle) * radius,
    y: 150 + Math.sin(angle) * radius
  };
};

// Helper function to calculate average duration
const calculateAverageDuration = (activities: Record<string, string>[]) => {
  if (activities.length === 0) return '0m 0s';
  
  // Parse durations like "2m 15s" into seconds
  const durationInSeconds = activities.map(activity => {
    const duration = activity.duration || '0m 0s';
    const match = duration.match(/(\d+)m\s+(\d+)s/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  });
  
  // Calculate average
  const totalSeconds = durationInSeconds.reduce((sum, seconds) => sum + seconds, 0);
  const avgSeconds = Math.round(totalSeconds / activities.length);
  
  // Format back to "Xm Ys"
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;
  return `${minutes}m ${seconds}s`;
};
