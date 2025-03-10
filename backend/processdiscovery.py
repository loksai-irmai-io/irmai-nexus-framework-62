
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
import json
import traceback

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/processdiscovery/eventlog")
async def upload_event_log(file: UploadFile):
    try:
        # Read the contents of the uploaded file
        contents = await file.read()
        
        # Convert bytes to string and create a StringIO object
        contents_str = contents.decode('utf-8')
        csv_data = StringIO(contents_str)
        
        # Read CSV into pandas DataFrame with more flexible parsing
        df = pd.read_csv(csv_data, on_bad_lines='skip')
        
        # Make sure column names are standardized
        df.columns = [col.lower().strip().replace(' ', '_') for col in df.columns]
        
        # Try to identify common case ID, activity, and timestamp columns
        if 'case_id' not in df.columns and 'case' in df.columns:
            df.rename(columns={'case': 'case_id'}, inplace=True)
        
        if 'activity' not in df.columns:
            for col in ['event', 'action', 'activity_name', 'name']:
                if col in df.columns:
                    df.rename(columns={col: 'activity'}, inplace=True)
                    break
        
        if 'timestamp' not in df.columns:
            for col in ['time', 'date', 'datetime', 'time_stamp']:
                if col in df.columns:
                    df.rename(columns={col: 'timestamp'}, inplace=True)
                    break
        
        # Convert DataFrame to JSON
        json_data = df.to_dict(orient='records')
        
        # Print the first few records to the console for debugging
        print(f"Successfully processed {len(json_data)} records from {file.filename}")
        if len(json_data) > 0:
            print("Sample record:", json_data[0])
        
        return {
            "status": "success",
            "message": f"Successfully processed {len(json_data)} records from {file.filename}",
            "data": json_data
        }
        
    except UnicodeDecodeError as e:
        error_details = traceback.format_exc()
        print(f"Error decoding file: {error_details}")
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "message": f"Error decoding file: The file is not properly encoded or not a valid CSV file. {str(e)}",
                "data": None
            }
        )
    except pd.errors.ParserError as e:
        error_details = traceback.format_exc()
        print(f"Error parsing CSV: {error_details}")
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "message": f"Error parsing CSV: The file format is incorrect or corrupted. {str(e)}",
                "data": None
            }
        )
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error processing file: {error_details}")
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "message": f"Error processing file: {str(e)}",
                "data": None
            }
        )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "process-discovery-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
