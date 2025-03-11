
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
import random
import os
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock BPMN data for FX trade log
MOCK_BPMN_DATA = {
    "nodes": [
        {"id": "start", "type": "event", "label": "Start FX Trade", "position": {"x": 100, "y": 150}},
        {"id": "request", "type": "activity", "label": "Request Quote", "position": {"x": 250, "y": 150}},
        {"id": "gateway1", "type": "gateway", "label": "Quote Acceptable?", "position": {"x": 400, "y": 150}},
        {"id": "negotiate", "type": "activity", "label": "Negotiate Terms", "position": {"x": 550, "y": 100}},
        {"id": "accept", "type": "activity", "label": "Accept Quote", "position": {"x": 550, "y": 200}},
        {"id": "execute", "type": "activity", "label": "Execute Trade", "position": {"x": 700, "y": 150}},
        {"id": "settle", "type": "activity", "label": "Settle Trade", "position": {"x": 850, "y": 150}},
        {"id": "end", "type": "event", "label": "End FX Trade", "position": {"x": 1000, "y": 150}}
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

class UploadResponse(BaseModel):
    status: str
    msg: str
    bpmn: Optional[dict] = None

@app.get("/")
def read_root():
    return {"message": "FX Trade Log API is running"}

@app.post("/upload-event-log/", response_model=UploadResponse)
async def upload_event_log(file: UploadFile = File(...)):
    try:
        # Check if file extension is valid
        filename = file.filename
        if not filename:
            raise HTTPException(status_code=400, detail="No filename provided")
            
        # Simulating file validation
        valid_extensions = ['.csv', '.xes', '.xml', '.txt']
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext not in valid_extensions:
            return UploadResponse(
                status="failure",
                msg=f"Invalid file type. Please upload a CSV, XES, XML or TXT file."
            )
            
        # Simulating file size check
        content = await file.read()
        file_size = len(content)
        max_size = 10 * 1024 * 1024  # 10MB
        
        if file_size > max_size:
            return UploadResponse(
                status="failure",
                msg=f"File size exceeds the 10MB limit. Your file is {file_size / (1024 * 1024):.2f}MB."
            )
            
        # Randomly succeed or fail for testing purposes (90% success rate)
        if random.random() < 0.9:
            return UploadResponse(
                status="success",
                msg=f"Event log '{filename}' processed successfully",
                bpmn=MOCK_BPMN_DATA
            )
        else:
            return UploadResponse(
                status="failure",
                msg=f"Processing failed: Could not parse the event log format."
            )
            
    except Exception as e:
        return UploadResponse(
            status="failure",
            msg=f"Server error: {str(e)}"
        )

# Example endpoint to get FX Trade sample data without uploading
@app.get("/fx-trade-example/", response_model=UploadResponse)
def get_fx_trade_example():
    return UploadResponse(
        status="success",
        msg="Example FX Trade data loaded successfully",
        bpmn=MOCK_BPMN_DATA
    )
