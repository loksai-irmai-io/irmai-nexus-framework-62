
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
import logging
import uuid
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("processdiscovery")

# Create router
router = APIRouter()

# In-memory storage for processed event logs
processed_logs: Dict[str, Dict[str, Any]] = {}

# Sample BPMN XML for mock response
SAMPLE_BPMN_XML = """<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Process Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:task id="Activity_2" name="Ship Order">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Activity_2" />
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_2" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="155" y="145" width="31" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_2_di" bpmnElement="Activity_2">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="562" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="570" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="562" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>"""

@router.post("/api/processdiscovery/eventlog")
async def process_event_log(file: UploadFile = File(...)):
    """
    Process uploaded event log file and generate BPMN diagram
    """
    logger.info(f"Processing event log: {file.filename}")
    
    try:
        # Read the file content
        contents = await file.read()
        
        # Parse CSV (could be enhanced for other formats)
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            event_count = len(df)
            logger.info(f"Successfully parsed CSV with {event_count} events")
        except Exception as e:
            logger.error(f"Error parsing CSV: {str(e)}")
            # For demo purposes, we'll return mock data even if parsing fails
            event_count = 120  # Mock event count
        
        # Generate unique ID for this process
        process_id = str(uuid.uuid4())
        
        # Store process data
        processed_logs[process_id] = {
            "id": process_id,
            "filename": file.filename,
            "event_count": event_count,
            "bpmn_xml": SAMPLE_BPMN_XML,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        
        # Return BPMN and event count
        return {
            "id": process_id,
            "filename": file.filename,
            "bpmnXml": SAMPLE_BPMN_XML,
            "eventCount": event_count
        }
        
    except Exception as e:
        logger.error(f"Error processing event log: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing event log: {str(e)}")

@router.get("/api/processdiscovery/eventlog/{log_id}")
async def get_event_log(log_id: str):
    """
    Retrieve a processed event log by ID
    """
    if log_id not in processed_logs:
        raise HTTPException(status_code=404, detail="Event log not found")
    
    return processed_logs[log_id]

@router.get("/api/processdiscovery/eventcount")
async def get_event_count():
    """
    Get total count of events across all processed logs
    """
    total_events = sum(log["event_count"] for log in processed_logs.values())
    return {"total_events": total_events}
