from fastapi import APIRouter,Depends,status
from sqlalchemy.orm.session import Session
from database.db import get_db
from database import db_comment
from .schemas import commentBase,UserAuth,Comment
from Auth.oauth2 import get_current_user
from typing import List

router = APIRouter(
    prefix='/comment',
    tags=['comments']
)

@router.get(
    '/all/{post_id}',
    summary="Retrieve All Comments for a Post",
    description="Fetches a list of all comments associated with a specific post by post ID.",
    status_code=status.HTTP_200_OK,
    response_model=List[Comment],
    response_description="Successfully retrieved all comments for the post."
)
def comments(post_id:int, db:Session = Depends(get_db)):
    return db_comment.get_all(db,post_id)

@router.post(
    '/create',
    summary="Create a Comment on a Post",
    description="Allows an authenticated user to add a comment to an existing post.",
    status_code=status.HTTP_201_CREATED,
    response_model=Comment,
    response_description="Comment created successfully."
)
def create_comment(request:commentBase , db:Session = Depends(get_db), current_user:UserAuth = Depends(get_current_user)):
    return db_comment.create(db,request)