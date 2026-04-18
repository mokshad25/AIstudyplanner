from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "super-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _preprocess_password(password: str) -> str:
    # bcrypt limits passwords to 72 bytes.
    # If a password is longer, we pre-hash it with SHA256.
    if len(password.encode('utf-8')) > 72:
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    return password

def verify_password(plain_password, hashed_password):
    processed_password = _preprocess_password(plain_password)
    return pwd_context.verify(processed_password, hashed_password)

def get_password_hash(password):
    processed_password = _preprocess_password(password)
    return pwd_context.hash(processed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
