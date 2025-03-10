
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import csv
import io
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("process-discovery-api")

# Initialize FastAPI app
app = FastAPI(
    title="Risk Management API",
    description="API for the Risk Management Application",
    version="1.0.0"
)

# Add CORS middleware to allow frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
events = [
    {
        "id": str(uuid.uuid4()),
        "title": "System Outage Detected",
        "description": "Primary database cluster experienced downtime",
        "severity": "high",
        "timestamp": datetime.now().isoformat(),
        "status": "active",
        "category": "infrastructure",
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Compliance Threshold Exceeded",
        "description": "SLA compliance rate dropped below 95%",
        "severity": "medium",
        "timestamp": datetime.now().isoformat(),
        "status": "investigating",
        "category": "compliance",
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Multiple Failed Login Attempts",
        "description": "5 failed login attempts detected from IP 192.168.1.15",
        "severity": "low",
        "timestamp": datetime.now().isoformat(),
        "status": "resolved",
        "category": "security",
    }
]

# Store for processed event logs
processed_logs = {}

class EventLogSummary(BaseModel):
    id: str
    eventCount: int
    caseCount: int
    bpmnXml: str
    activities: List[str]


@app.get("/")
async def read_root():
    return {"status": "ok", "message": "API is running"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/api/events")
async def get_events():
    return {"status": "success", "data": events, "count": len(events)}


@app.get("/api/events/{event_id}")
async def get_event(event_id: str):
    for event in events:
        if event["id"] == event_id:
            return {"status": "success", "data": event}
    raise HTTPException(status_code=404, detail="Event not found")


# Process Discovery API Endpoints
@app.post("/api/processdiscovery/eventlog")
async def process_event_log(file: UploadFile = File(...)):
    """
    Process an uploaded event log file and return BPMN XML and event count
    """
    try:
        logger.info(f"Processing event log: {file.filename}")
        
        # Generate a unique ID for this process
        process_id = str(uuid.uuid4())
        
        # Read and parse CSV content
        content = await file.read()
        text_content = content.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(text_content))
        
        # Process the CSV data
        event_data = []
        case_ids = set()
        activities = set()
        
        for row in csv_reader:
            event_data.append(row)
            if 'case_id' in row:
                case_ids.add(row['case_id'])
            if 'activity' in row:
                activities.add(row['activity'])
        
        event_count = len(event_data)
        case_count = len(case_ids)
        
        # Generate a simple BPMN XML (this is a placeholder - you'd use a real process mining algorithm)
        bpmn_xml = generate_bpmn_from_events(event_data, list(activities))
        
        # Store the processed data
        processed_logs[process_id] = {
            "id": process_id,
            "eventCount": event_count,
            "caseCount": case_count,
            "bpmnXml": bpmn_xml,
            "activities": list(activities),
            "events": event_data,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Event log processed successfully: {process_id} with {event_count} events")
        
        return {
            "status": "success",
            "data": {
                "id": process_id,
                "eventCount": event_count,
                "caseCount": case_count,
                "bpmnXml": bpmn_xml,
                "activities": list(activities)
            }
        }
        
    except Exception as e:
        logger.error(f"Error processing event log: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing event log: {str(e)}")


@app.get("/api/processdiscovery/eventlog/{process_id}")
async def get_processed_event_log(process_id: str):
    """
    Fetch the processed BPMN diagram & event details for a specific process ID
    """
    if process_id not in processed_logs:
        logger.warning(f"Process ID not found: {process_id}")
        raise HTTPException(status_code=404, detail="Process ID not found")
    
    return {
        "status": "success",
        "data": processed_logs[process_id]
    }


@app.get("/api/processdiscovery/eventcount")
async def get_event_count():
    """
    Return the total number of events across all processed logs
    """
    total_events = sum(log["eventCount"] for log in processed_logs.values())
    
    return {
        "status": "success",
        "data": {
            "totalEvents": total_events,
            "processedLogs": len(processed_logs)
        }
    }


def generate_bpmn_from_events(events, activities):
    """
    Generate a simple BPMN XML diagram from event data
    This is a simplification - in a real implementation, you would use a proper process mining algorithm
    """
    # Simple sequence of activities for demonstration
    process_id = "process_" + str(uuid.uuid4())[:8]
    
    # Create XML header and definitions
    bpmn_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_{process_id}" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_{process_id}" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_start</bpmn:outgoing>
    </bpmn:startEvent>
"""
    
    # Add activities
    previous_id = "StartEvent_1"
    flow_id = "Flow_start"
    
    for i, activity in enumerate(activities):
        activity_id = f"Activity_{i+1}"
        bpmn_xml += f"""    <bpmn:task id="{activity_id}" name="{activity}">
      <bpmn:incoming>{flow_id}</bpmn:incoming>
"""
        if i < len(activities) - 1:
            next_flow_id = f"Flow_{i+1}"
            bpmn_xml += f"""      <bpmn:outgoing>{next_flow_id}</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="{flow_id}" sourceRef="{previous_id}" targetRef="{activity_id}" />
"""
            previous_id = activity_id
            flow_id = next_flow_id
        else:
            end_flow_id = "Flow_end"
            bpmn_xml += f"""      <bpmn:outgoing>{end_flow_id}</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="{flow_id}" sourceRef="{previous_id}" targetRef="{activity_id}" />
"""
            bpmn_xml += f"""    <bpmn:endEvent id="EndEvent_1">
      <bpmn:incoming>{end_flow_id}</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="{end_flow_id}" sourceRef="{activity_id}" targetRef="EndEvent_1" />
"""
    
    # Close the XML
    bpmn_xml += """  </bpmn:process>
</bpmn:definitions>"""
    
    return bpmn_xml


# Run the API with uvicorn when this file is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

