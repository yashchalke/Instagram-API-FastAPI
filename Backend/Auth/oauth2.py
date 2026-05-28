from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime , timedelta
from jose import JWTError,jwt
from fastapi import Depends , HTTPException , status
from sqlalchemy.orm.session import Session
from database.db import get_db
from database import db_user
from dotenv import load_dotenv
import os

load_dotenv()

oauth2scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY");
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

def create_access_token(data:dict, expires_delta: Optional[str] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encode_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encode_jwt

def get_current_user(token:str = Depends(oauth2scheme) , db:Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"}
    )
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=ALGORITHM)
        username:str  = payload.get("username")
        if username is None:
            raise credential_exception
    except JWTError:
        raise credential_exception
    
    user = db_user.get_user_by_username(db,username=username)
    if user is None:
        raise credential_exception
    return user