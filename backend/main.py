
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Process Mining API is running"}

@app.post("/api/upload-event-log")
async def upload_event_log(file: UploadFile = File(...)):
    """
    Upload an event log file and process it.
    """
    try:
        # Check file extension
        if not (file.filename.endswith('.csv') or file.filename.endswith('.xes') or file.filename.endswith('.xml')):
            raise HTTPException(status_code=400, detail="Invalid file type. Only CSV, XES, or XML files are allowed.")
        
        # Read file content
        # In a real app, you would process the file with PM4Py or another process mining library
        content = await file.read()
        
        # For demo purposes, return a mock BPMN model
        return {
            "status": "success",
            "message": f"Event log '{file.filename}' processed successfully",
            "bpmn": {
                "nodes": [
                    {"id": "start", "type": "event", "label": "Start", "position": {"x": 100, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 1000, "avgDuration": "0s", "waitTime": "0s", "resourceUtilization": 0}},
                    {"id": "process", "type": "activity", "label": "Process Trade", "position": {"x": 250, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 985, "avgDuration": "2m 30s", "waitTime": "5m", "resourceUtilization": 75}},
                    {"id": "check", "type": "activity", "label": "Validation", "position": {"x": 400, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 950, "avgDuration": "5m", "waitTime": "10m", "resourceUtilization": 60}},
                    {"id": "end", "type": "event", "label": "End", "position": {"x": 550, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 940, "avgDuration": "0s", "waitTime": "0s", "resourceUtilization": 0}}
                ],
                "edges": [
                    {"id": "e1", "source": "start", "target": "process", "metrics": {"frequency": 1000, "avgDuration": "0s"}},
                    {"id": "e2", "source": "process", "target": "check", "metrics": {"frequency": 985, "avgDuration": "1m"}},
                    {"id": "e3", "source": "check", "target": "end", "metrics": {"frequency": 940, "avgDuration": "30s"}}
                ]
            }
        }
    except Exception as e:
        return {
            "status": "failure",
            "message": f"Error processing file: {str(e)}"
        }

@app.get("/api/sample-fx-data")
async def get_sample_fx_data():
    """
    Provide sample FX trade data for demo purposes.
    """
    try:
        return {
            "status": "success",
            "message": "Sample FX trade data loaded successfully",
            "bpmn": {
                "nodes": [
                    {"id": "start", "type": "event", "label": "Trade Initiated", "position": {"x": 100, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 2500, "avgDuration": "0s", "waitTime": "0s", "resourceUtilization": 0}},
                    {"id": "quote", "type": "activity", "label": "Request Quote", "position": {"x": 250, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 2450, "avgDuration": "30s", "waitTime": "1m", "resourceUtilization": 85}},
                    {"id": "gateway1", "type": "gateway", "label": "Quote Acceptable?", "position": {"x": 400, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 2450, "avgDuration": "10s", "waitTime": "0s", "resourceUtilization": 100}},
                    {"id": "execute", "type": "activity", "label": "Execute Trade", "position": {"x": 550, "y": 100}, "compliant": True,
                     "metrics": {"frequency": 2100, "avgDuration": "45s", "waitTime": "15s", "resourceUtilization": 90}},
                    {"id": "reject", "type": "activity", "label": "Reject Quote", "position": {"x": 550, "y": 200}, "compliant": True,
                     "metrics": {"frequency": 350, "avgDuration": "20s", "waitTime": "0s", "resourceUtilization": 40}},
                    {"id": "settle", "type": "activity", "label": "Settle Trade", "position": {"x": 700, "y": 100}, "compliant": True,
                     "metrics": {"frequency": 2090, "avgDuration": "2m", "waitTime": "5m", "resourceUtilization": 75}},
                    {"id": "end", "type": "event", "label": "Trade Completed", "position": {"x": 850, "y": 150}, "compliant": True,
                     "metrics": {"frequency": 2440, "avgDuration": "0s", "waitTime": "0s", "resourceUtilization": 0}}
                ],
                "edges": [
                    {"id": "e1", "source": "start", "target": "quote", "metrics": {"frequency": 2500, "avgDuration": "0s"}},
                    {"id": "e2", "source": "quote", "target": "gateway1", "metrics": {"frequency": 2450, "avgDuration": "5s"}},
                    {"id": "e3", "source": "gateway1", "target": "execute", "label": "Yes", "metrics": {"frequency": 2100, "avgDuration": "10s"}},
                    {"id": "e4", "source": "gateway1", "target": "reject", "label": "No", "metrics": {"frequency": 350, "avgDuration": "5s"}},
                    {"id": "e5", "source": "execute", "target": "settle", "metrics": {"frequency": 2090, "avgDuration": "30m"}},
                    {"id": "e6", "source": "settle", "target": "end", "metrics": {"frequency": 2090, "avgDuration": "1h"}},
                    {"id": "e7", "source": "reject", "target": "end", "metrics": {"frequency": 350, "avgDuration": "10s"}}
                ]
            }
        }
    except Exception as e:
        return {
            "status": "failure",
            "message": f"Error loading sample data: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
