
# Process Mining API Backend

This is a FastAPI backend for the Process Mining application.

## Setup

1. Install the required packages:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The server will start on http://localhost:8000

## API Endpoints

- GET `/`: Welcome message
- GET `/api/fx-trade-data`: Get sample FX trade process data
- POST `/api/upload-event-log`: Upload and process an event log file

## API Documentation

Once the server is running, you can access the auto-generated API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
