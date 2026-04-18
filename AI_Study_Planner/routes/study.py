from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models, schemas
from database import get_db
from routes.auth import get_current_user

# Import Core AI Logic
from core.scheduler import generate_schedule
from core.spaced_repetition import due_revisions
from core.chronotype import find_best_hours

router = APIRouter(prefix="/study", tags=["study"])

@router.post("/generate-plan")
def generate_study_plan(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Fetch user subjects
    subjects_db = db.query(models.Subject).filter(models.Subject.user_id == current_user.id).all()
    
    if not subjects_db:
        return {"schedule": []}
    
    # Format for scheduler.py (requires dict)
    subjects_data = []
    for s in subjects_db:
        subjects_data.append({
            "name": s.name,
            "difficulty": s.difficulty,
            "exam_date": s.exam_date,
            "syllabus_total": s.syllabus_total,
            "syllabus_completed": s.syllabus_completed
        })
    
    schedule = generate_schedule(subjects_data)
    return {"schedule": schedule}

@router.get("/revision-plan")
def get_revision_plan(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Fetch user subjects
    subjects = db.query(models.Subject).filter(models.Subject.user_id == current_user.id).all()
    subject_ids = [s.id for s in subjects]
    
    # Fetch topics for these subjects
    topics_db = db.query(models.Topic).filter(models.Topic.subject_id.in_(subject_ids)).all()
    
    if not topics_db:
        return {"due_revisions": []}
        
    topics_data = []
    for t in topics_db:
        if t.last_studied:
            topics_data.append({
                "name": t.name,
                "last_studied": t.last_studied
            })
            
    due = due_revisions(topics_data)
    return {"due_revisions": due}

@router.post("/session", response_model=schemas.StudySessionResponse)
def save_study_session(session_data: schemas.StudySessionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_session = models.StudySession(**session_data.dict(), user_id=current_user.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sessions = db.query(models.StudySession).filter(models.StudySession.user_id == current_user.id).all()
    
    total_time = sum(s.duration for s in sessions)
    
    # Format history for chronotype
    history_data = []
    for s in sessions:
        hour_str = s.timestamp.strftime("%H:00")
        history_data.append({
            "completed": s.completed,
            "time": hour_str
        })
        
    best_hours = find_best_hours(history_data)
    
    return {
        "total_study_time_minutes": total_time,
        "best_study_hours": best_hours,
        "total_sessions": len(sessions)
    }
