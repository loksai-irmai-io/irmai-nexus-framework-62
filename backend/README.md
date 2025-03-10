
# Process Mining Backend

This is a FastAPI backend for the Process Mining application. It provides APIs for uploading event logs and processing them for process discovery.

## Setup

1. Install dependencies:
```bash
pip install fastapi uvicorn python-multipart
```

2. Run the server:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET /
- Basic health check endpoint

### POST /api/upload-event-log
- Upload an event log file (CSV, XES, or XML) for processing
- Returns a processed BPMN model

### GET /api/sample-fx-data
- Get sample FX trade data for demonstration purposes
- Returns a pre-defined BPMN model representing an FX trading process

## Response Format

All API responses follow this format:
```json
{
  "status": "success" | "failure",
  "message": "Description of what happened",
  "bpmn": {
    "nodes": [...],
    "edges": [...]
  }
}
```

## CORS

The API has CORS enabled for all origins in development. For production, you should restrict this to specific origins.
