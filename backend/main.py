
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from io import StringIO
import os
from typing import Optional

app = FastAPI(title="Process Mining API")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # The default Vite dev server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample FX trade process data
fx_trade_data = {
    "nodes": [
        {"id": "start", "type": "event", "label": "Trade Initiated", "position": {"x": 100, "y": 150}, "compliant": True, "metrics": {"frequency": 450, "avgDuration": "0m 0s"}},
        {"id": "validate", "type": "activity", "label": "Validate Trade Details", "position": {"x": 250, "y": 150}, "compliant": True, "metrics": {"frequency": 430, "avgDuration": "5m 20s"}},
        {"id": "gateway1", "type": "gateway", "label": "Trade Valid?", "position": {"x": 400, "y": 150}, "compliant": True, "metrics": {"frequency": 430, "avgDuration": "0m 10s"}},
        {"id": "execute", "type": "activity", "label": "Execute Trade", "position": {"x": 550, "y": 100}, "compliant": True, "metrics": {"frequency": 405, "avgDuration": "3m 15s"}},
        {"id": "correction", "type": "activity", "label": "Trade Correction", "position": {"x": 550, "y": 200}, "compliant": False, "metrics": {"frequency": 25, "avgDuration": "15m 45s"}},
        {"id": "gateway2", "type": "gateway", "label": "Trade Successful?", "position": {"x": 700, "y": 150}, "compliant": True, "metrics": {"frequency": 430, "avgDuration": "0m 5s"}},
        {"id": "confirm", "type": "activity", "label": "Confirm Settlement", "position": {"x": 850, "y": 150}, "compliant": True, "metrics": {"frequency": 415, "avgDuration": "7m 30s"}},
        {"id": "error", "type": "activity", "label": "Handle Trade Error", "position": {"x": 700, "y": 250}, "compliant": False, "metrics": {"frequency": 15, "avgDuration": "12m 20s"}},
        {"id": "end", "type": "event", "label": "Trade Completed", "position": {"x": 1000, "y": 150}, "compliant": True, "metrics": {"frequency": 430, "avgDuration": "0m 0s"}}
    ],
    "edges": [
        {"id": "e1", "source": "start", "target": "validate"},
        {"id": "e2", "source": "validate", "target": "gateway1"},
        {"id": "e3", "source": "gateway1", "target": "execute", "label": "Valid"},
        {"id": "e4", "source": "gateway1", "target": "correction", "label": "Invalid"},
        {"id": "e5", "source": "correction", "target": "execute"},
        {"id": "e6", "source": "execute", "target": "gateway2"},
        {"id": "e7", "source": "gateway2", "target": "confirm", "label": "Yes"},
        {"id": "e8", "source": "gateway2", "target": "error", "label": "No"},
        {"id": "e9", "source": "confirm", "target": "end"},
        {"id": "e10", "source": "error", "target": "validate", "label": "Retry"}
    ]
}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Process Mining API"}

@app.get("/api/fx-trade-data")
def get_fx_trade_data():
    """Get sample FX trade process data"""
    return {
        "status": "success",
        "msg": "FX trade data fetched successfully",
        "bpmn": fx_trade_data
    }

@app.post("/api/upload-event-log")
async def upload_event_log(file: UploadFile = File(...)):
    """Upload event log file and process it"""
    try:
        # Check file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in ['.csv', '.xes', '.xml']:
            return {
                "status": "failure",
                "msg": f"Unsupported file format: {file_extension}. Please upload CSV, XES, or XML files."
            }
        
        # For this example, we'll simply return the sample FX trade data
        # In a real application, you would process the uploaded file here
        
        return {
            "status": "success",
            "msg": f"Event log '{file.filename}' processed successfully",
            "bpmn": fx_trade_data
        }
    except Exception as e:
        return {
            "status": "failure",
            "msg": f"Failed to process event log: {str(e)}"
        }
