
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
from datetime import datetime

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

# Run the API with uvicorn when this file is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
