
# Event Log Processing Backend

This is a FastAPI backend that handles event log uploads for process mining.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   uvicorn main:app --reload
   ```

The server will start at http://localhost:8000

## API Endpoints

- `POST /upload-event-log/` - Upload and process an event log file
- `GET /fx-trade-example/` - Get a sample FX trade process model without uploading
