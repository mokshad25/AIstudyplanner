from sqlalchemy import Boolean, Column, Integer, String, Enum, DateTime
from database import Base
import enum
import datetime

class SessionType(enum.Enum):
    pomodoro = "pomodoro"
    deep_work = "deep_work"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer) # Foreign Key ideal, keeping simple
    name = Column(String(100))
    difficulty = Column(Integer)
    exam_date = Column(String(50))
    syllabus_total = Column(Integer)
    syllabus_completed = Column(Integer, default=0)

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer) # Foreign Key ideal, keeping simple
    name = Column(String(100))
    status = Column(String(50), default="Pending")
    last_studied = Column(String(50), default=lambda: datetime.datetime.today().strftime("%Y-%m-%d"))

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    duration = Column(Integer)
    type = Column(Enum(SessionType))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    completed = Column(Boolean, default=True)
