
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

- `POST /app/process-discovery/upload-event` - Upload and process an event log file. 
  - If a file is provided, the endpoint processes the uploaded file
  - If no file is provided, the endpoint returns example FX trade data

## Testing the Backend

You can test the backend API using various methods:

### Using curl

```bash
# Get example data
curl -X POST http://localhost:8000/app/process-discovery/upload-event

# Upload a file
curl -X POST http://localhost:8000/app/process-discovery/upload-event -F "file=@/path/to/your/file.csv"
```

### Using the Swagger UI

FastAPI automatically generates interactive API documentation:

1. Start the server
2. Navigate to http://localhost:8000/docs in your browser
3. You'll see the Swagger UI where you can test the endpoints interactively

### Checking the Response Data

The API returns a JSON response with the following structure:

```json
{
  "status": "success" or "failure",
  "msg": "Description of the result",
  "bpmn": {
    "nodes": [...],
    "edges": [...]
  }
}
```

- `status`: Indicates if the operation succeeded
- `msg`: Provides details about the operation result
- `bpmn`: Contains the process model data (if successful)
