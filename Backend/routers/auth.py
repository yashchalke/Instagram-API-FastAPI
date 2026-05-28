from fastapi import APIRouter,status,Depends
from .schemas import UserDisplay,UserBase
from sqlalchemy.orm.session import Session 
from database.db import get_db
from database.db_user import create_user

router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
)

@router.post(
    '/register',
    summary="Register a New User",
    description="Creates a new user account by accepting the required registration details such as username, email, and password. Validates the input data and stores the user securely in the database.",
    response_description="Successfully created user account details.",
    response_model=UserDisplay,
    status_code=status.HTTP_201_CREATED
)
def register_user(request:UserBase,db:Session = Depends(get_db)):
    return create_user(request=request,db=db)


    