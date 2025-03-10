
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from processdiscovery import router as processdiscovery_router

# Create FastAPI app
app = FastAPI(title="IRMAI API", description="API for risk management and process discovery")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include process discovery routes
app.include_router(processdiscovery_router)

@app.get("/")
async def root():
    return {"message": "Welcome to IRMAI API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
