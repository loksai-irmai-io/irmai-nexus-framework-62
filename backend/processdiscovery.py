
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
import json

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
        
        # Read CSV into pandas DataFrame
        df = pd.read_csv(csv_data)
        
        # Convert DataFrame to JSON
        json_data = df.to_dict(orient='records')
        
        return {
            "status": "success",
            "message": f"Successfully processed file: {file.filename}",
            "data": json_data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "message": f"Error processing file: {str(e)}",
                "data": None
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
