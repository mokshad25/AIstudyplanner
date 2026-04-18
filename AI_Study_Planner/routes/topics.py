from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/topics", tags=["topics"])

@router.post("/", response_model=schemas.TopicResponse)
def create_topic(topic: schemas.TopicCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Verify subject belongs to user
    subject = db.query(models.Subject).filter(models.Subject.id == topic.subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found or doesn't belong to you")
    
    db_topic = models.Topic(**topic.dict())
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.get("/", response_model=List[schemas.TopicResponse])
def get_topics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    subjects = db.query(models.Subject).filter(models.Subject.user_id == current_user.id).all()
    subject_ids = [s.id for s in subjects]
    
    return db.query(models.Topic).filter(models.Topic.subject_id.in_(subject_ids)).all()

@router.delete("/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    subject = db.query(models.Subject).filter(models.Subject.id == topic.subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not authorized to delete this topic")
    
    db.delete(topic)
    db.commit()
    return {"detail": "Topic deleted successfully"}
