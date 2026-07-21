# backend/app/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, engine
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.admin import router as admin_router
from app.api.v1.landlord import router as landlord_router
from app.api.v1.renter import router as renter_router

app = FastAPI(title=settings.PROJECT_NAME)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(landlord_router, prefix=settings.API_V1_STR)
app.include_router(renter_router, prefix=settings.API_V1_STR)
# This decorator runs code automatically as soon as the Uvicorn server starts up
@app.on_event("startup")
def test_db_connection():
    print("🔄 Attempting to connect to the database...")
    try:
        # We acquire a raw connection from the engine and run a basic query
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ DATABASE CONNECTION SUCCESSFUL! RentStreet is online.")
    except Exception as e:
        print("❌ DATABASE CONNECTION FAILED!")
        print(f"Error details: {e}")
        print("\n💡 Double check if your Docker container is running and your .env credentials match DBeaver.")

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API v1.0"}

# A test API endpoint that fetches data live using the get_db dependency
@app.get("/api/db-test")
def test_endpoint(db: Session = Depends(get_db)):
    # Run a simple query to see if PostGIS is also active
    result = db.execute(text("SELECT PostGIS_Version();")).fetchone()
    return {
        "status": "Database connected successfully!",
        "postgis_version": result[0] if result else "Not found"
    }