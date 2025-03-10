
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
        
        # Print basic dataframe info for debugging
        print(f"DataFrame columns: {df.columns.tolist()}")
        print(f"DataFrame shape: {df.shape}")
        
        # Make sure column names are standardized (lowercase, no spaces)
        df.columns = [col.lower().strip().replace(' ', '_') for col in df.columns]
        
        # Try to identify common case ID columns
        case_id_columns = ['case_id', 'case', 'caseid', 'case_identifier', 'case_key', 'id']
        for col_name in case_id_columns:
            if col_name in df.columns:
                if col_name != 'case_id':
                    df.rename(columns={col_name: 'case_id'}, inplace=True)
                break
        
        # Try to identify common activity columns
        activity_columns = ['activity', 'event', 'action', 'activity_name', 'name', 'task', 'event_name']
        for col_name in activity_columns:
            if col_name in df.columns:
                if col_name != 'activity':
                    df.rename(columns={col_name: 'activity'}, inplace=True)
                break
        
        # Try to identify common timestamp columns
        timestamp_columns = ['timestamp', 'time', 'date', 'datetime', 'time_stamp', 'event_time', 'start_time']
        for col_name in timestamp_columns:
            if col_name in df.columns:
                if col_name != 'timestamp':
                    df.rename(columns={col_name: 'timestamp'}, inplace=True)
                break
        
        # Try to identify resource/user columns
        resource_columns = ['resource', 'user', 'originator', 'person', 'employee', 'agent']
        for col_name in resource_columns:
            if col_name in df.columns:
                if col_name != 'resource':
                    df.rename(columns={col_name: 'resource'}, inplace=True)
                break
        
        # For better debugging
        print(f"Standardized columns: {df.columns.tolist()}")
        
        # Ensure we have the required columns, even with default values
        # This helps the frontend display something meaningful
        if 'case_id' not in df.columns:
            print("Warning: No case_id column found. Adding a default one.")
            df['case_id'] = range(1, len(df) + 1)
        
        if 'activity' not in df.columns:
            print("Warning: No activity column found. Using the first non-timestamp column.")
            # Try to use first non-timestamp, non-case_id column as activity
            possible_activity_cols = [col for col in df.columns if col not in ['case_id', 'timestamp', 'resource']]
            if possible_activity_cols:
                df['activity'] = df[possible_activity_cols[0]]
            else:
                df['activity'] = 'Unknown Activity'
        
        if 'timestamp' not in df.columns:
            print("Warning: No timestamp column found. Adding a default one.")
            # Add a sequential timestamp
            import datetime
            base_date = datetime.datetime.now()
            df['timestamp'] = [(base_date + datetime.timedelta(seconds=i)).isoformat() for i in range(len(df))]
        
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
