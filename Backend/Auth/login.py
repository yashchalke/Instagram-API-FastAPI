from fastapi import APIRouter,status,Depends,HTTPException
from database.models import DbUser
from sqlalchemy.orm.session import Session
from database.hashing import Hash
from .oauth2 import create_access_token
from routers.schemas import LoginDisplay, UserLogin
from database.db import get_db

router = APIRouter(prefix='/auth',tags=['Authentication'])

@router.post(
    '/login',
    # response_model=LoginDisplay,
    summary="Authenticate user and generate token",
    description="Verifies user credentials and returns a JWT access token required for protected routes.",
    response_description="Returns a Bearer token along with basic user identification.",
    status_code=status.HTTP_200_OK
)
def login_user(request: UserLogin, db: Session = Depends(get_db)):
    user = db.query(DbUser).filter(DbUser.username == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Credentials")
    if not Hash.verify_pwd(user.password,request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    acccess_token = create_access_token({'username':user.username})

    return {
        'access_token':acccess_token,
        'token_type':'bearer',
        'user_id':user.id,
        'username':user.username
    }
