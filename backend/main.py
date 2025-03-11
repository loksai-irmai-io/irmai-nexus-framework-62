
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import json
import random
import os
import logging
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Position(BaseModel):
    x: int
    y: int

class NodeMetrics(BaseModel):
    frequency: Optional[int] = None
    avgDuration: Optional[str] = None
    waitTime: Optional[str] = None
    resourceUtilization: Optional[float] = None

class EdgeMetrics(BaseModel):
    frequency: Optional[int] = None
    avgDuration: Optional[str] = None
    waitTime: Optional[str] = None
    resourceUtilization: Optional[float] = None

class ProcessNode(BaseModel):
    id: str
    type: str
    label: str
    position: Position
    compliant: bool
    metrics: Optional[NodeMetrics] = None

class ProcessEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    metrics: Optional[EdgeMetrics] = None

class ProcessData(BaseModel):
    nodes: List[ProcessNode]
    edges: List[ProcessEdge]

class UploadResponse(BaseModel):
    status: str
    msg: str
    bpmn: Optional[ProcessData] = None

# Global variable to store the latest response data
latest_response = {
    "message": "FX Trade Log API is running",
    "status": "Waiting for file upload...",
    "bpmn": None
}

# Mock BPMN data for FX trade log
MOCK_BPMN_DATA = {
    "nodes": [
        {"id": "start", "type": "event", "label": "Start FX Trade", "position": {"x": 100, "y": 150}, "compliant": True},
        {"id": "request", "type": "activity", "label": "Request Quote", "position": {"x": 250, "y": 150}, "compliant": True},
        {"id": "gateway1", "type": "gateway", "label": "Quote Acceptable?", "position": {"x": 400, "y": 150}, "compliant": True},
        {"id": "negotiate", "type": "activity", "label": "Negotiate Terms", "position": {"x": 550, "y": 100}, "compliant": False},
        {"id": "accept", "type": "activity", "label": "Accept Quote", "position": {"x": 550, "y": 200}, "compliant": True},
        {"id": "execute", "type": "activity", "label": "Execute Trade", "position": {"x": 700, "y": 150}, "compliant": True},
        {"id": "settle", "type": "activity", "label": "Settle Trade", "position": {"x": 850, "y": 150}, "compliant": True},
        {"id": "end", "type": "event", "label": "End FX Trade", "position": {"x": 1000, "y": 150}, "compliant": True}
    ],
    "edges": [
        {"id": "e1", "source": "start", "target": "request"},
        {"id": "e2", "source": "request", "target": "gateway1"},
        {"id": "e3", "source": "gateway1", "target": "negotiate", "label": "No"},
        {"id": "e4", "source": "gateway1", "target": "accept", "label": "Yes"},
        {"id": "e5", "source": "negotiate", "target": "gateway1"},
        {"id": "e6", "source": "accept", "target": "execute"},
        {"id": "e7", "source": "execute", "target": "settle"},
        {"id": "e8", "source": "settle", "target": "end"}
    ]
}

@app.get("/")
def read_root():
    """ Returns the latest response status and BPMN data automatically. """
    logging.info("Root endpoint accessed")
    return latest_response

@app.post("/app/process-discovery/upload-event", response_model=UploadResponse)
async def upload_event_log(file: Optional[UploadFile] = None):
    global latest_response

    logging.info("Received request to upload event log")
    
    # If no file is provided, return example data
    if file is None:
        logging.info("No file uploaded. Returning mock BPMN data")
        latest_response = {
            "message": "FX Trade Log API is running",
            "status": "Example data loaded successfully",
            "bpmn": MOCK_BPMN_DATA
        }
        return UploadResponse(
            status="success",
            msg="Example data loaded successfully",
            bpmn=MOCK_BPMN_DATA
        )
    
    try:
        # Check if file extension is valid
        filename = file.filename
        if not filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        logging.info(f"Uploaded file: {filename}")
            
        # Simulating file validation
        valid_extensions = ['.csv', '.xes', '.xml', '.txt']
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext not in valid_extensions:
            logging.warning(f"Invalid file type: {file_ext}")
            latest_response = {
                "message": "FX Trade Log API is running",
                "status": f"Invalid file type. Please upload a CSV, XES, XML, or TXT file.",
                "bpmn": None
            }
            return UploadResponse(
                status="failure",
                msg=f"Invalid file type. Please upload a CSV, XES, XML, or TXT file."
            )
        
        # Simulating file size check
        content = await file.read()
        file_size = len(content)
        max_size = 10 * 1024 * 1024  # 10MB
        
        if file_size > max_size:
            logging.warning(f"File too large: {file_size / (1024 * 1024):.2f}MB")
            latest_response = {
                "message": "FX Trade Log API is running",
                "status": f"File size exceeds the 10MB limit. Your file is {file_size / (1024 * 1024):.2f}MB.",
                "bpmn": None
            }
            return UploadResponse(
                status="failure",
                msg=f"File size exceeds the 10MB limit. Your file is {file_size / (1024 * 1024):.2f}MB."
            )
        
        # Randomly succeed or fail for testing purposes (90% success rate)
        if random.random() < 0.9:
            logging.info(f"File '{filename}' processed successfully")
            latest_response = {
                "message": "FX Trade Log API is running",
                "status": f"Event log '{filename}' processed successfully",
                "bpmn": MOCK_BPMN_DATA
            }
            return UploadResponse(
                status="success",
                msg=f"Event log '{filename}' processed successfully",
                bpmn=MOCK_BPMN_DATA
            )
        else:
            logging.error("Processing failed: Could not parse the event log format.")
            latest_response = {
                "message": "FX Trade Log API is running",
                "status": "Processing failed: Could not parse the event log format.",
                "bpmn": None
            }
            return UploadResponse(
                status="failure",
                msg="Processing failed: Could not parse the event log format."
            )
            
    except Exception as e:
        logging.error(f"Server error: {str(e)}")
        latest_response = {
            "message": "FX Trade Log API is running",
            "status": f"Server error: {str(e)}",
            "bpmn": None
        }
        return UploadResponse(
            status="failure",
            msg=f"Server error: {str(e)}"
        )
