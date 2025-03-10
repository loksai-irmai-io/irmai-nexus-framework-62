
# Risk Management API

This is a FastAPI backend for the Risk Management frontend application.

## Getting Started

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   python main.py
   ```

3. The API will be available at http://localhost:8000

4. API Documentation (Swagger UI) will be available at http://localhost:8000/docs

## API Endpoints

- `GET /` - API status check
- `GET /api/health` - Health check endpoint
- `GET /api/events` - Get all events
- `GET /api/events/{event_id}` - Get a specific event by ID
