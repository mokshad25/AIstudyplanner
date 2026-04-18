from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import enum

class SessionType(str, enum.Enum):
    pomodoro = "pomodoro"
    deep_work = "deep_work"

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    difficulty: int
    exam_date: str
    syllabus_total: int
    syllabus_completed: int = 0

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class TopicBase(BaseModel):
    name: str
    status: str = "Pending"
    last_studied: Optional[str] = None

class TopicCreate(TopicBase):
    subject_id: int

class TopicResponse(TopicBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True

class StudySessionCreate(BaseModel):
    duration: int
    type: SessionType

class StudySessionResponse(BaseModel):
    id: int
    user_id: int
    duration: int
    type: SessionType
    timestamp: datetime
    completed: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
