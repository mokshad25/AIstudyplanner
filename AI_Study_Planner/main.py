from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routes import auth, subjects, topics, study

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Study Planner & Productivity System", version="1.0.0")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aistudyplanner-tau.vercel.app/login"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(topics.router)
app.include_router(study.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Study Planner API"}
