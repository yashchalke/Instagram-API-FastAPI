from fastapi import APIRouter,status,Depends,HTTPException,UploadFile,File
from sqlalchemy.orm.session import Session
from database.db import get_db
from .schemas import PostBase,PostDisplay,UserAuth
from database import db_post
from typing import List
from Auth.oauth2 import get_current_user
import os 
import boto3
import uuid
# import random
# import shutil
# import string

router = APIRouter(
    prefix='/post',
    tags=['Posts']
)

image_url_types = ['absolute','relative']

@router.post(
    '/create',
    summary="Create a New Post",
    description="Creates a new social media post by accepting post details such as image URL, image type, caption, and related user information. The post is validated and stored in the database.",
    response_model=PostDisplay,
    status_code=status.HTTP_201_CREATED,
    response_description="Post created successfully."
)
def new_post(request:PostBase ,db:Session = Depends(get_db), current_user:UserAuth = Depends(get_current_user)):
    if not request.image_url_type in image_url_types:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Parameter Image_url_type can only take values 'absolute' or 'relative'."
        )
    return db_post.create_post(request=request,db=db)

@router.get(
    '/all',
    summary="Retrieve All Posts",
    description="Fetches and returns a list of all available posts stored in the database, including post details and associated user information.",
    status_code=status.HTTP_200_OK,
    response_model=List[PostDisplay],
    response_description="List of all posts retrieved successfully."
)

@router.get(
    '/all',
    summary="Retrieve All Posts",
    description="Fetches and returns all posts available in the database, including post details such as captions, image URLs, timestamps, and associated user information.",
    status_code=status.HTTP_200_OK,
    response_model=List[PostDisplay],
    response_description="Successfully retrieved all posts."
)
def get_all_posts(db: Session = Depends(get_db)):
    return db_post.get_all(db)

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_ACCESS_SECRET_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

@router.post(
    '/image',
    summary="Upload an Image File",
    description="Uploads an image file to the server storage with a uniquely generated filename to prevent duplicate file conflicts. The endpoint accepts multipart/form-data image uploads.",
    status_code=status.HTTP_201_CREATED,
    response_description="Image uploaded successfully."
)
def upload_images(file:UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only Images are allowed to upload"
        )
    try:
        img_ext = file.filename.split(".")[-1]
        unique_name = f"{uuid.uuid4}.{img_ext}"

        s3_client.upload_fileobj(
            file.file,
            AWS_BUCKET_NAME,
            unique_name,
            ExtraArgs={
                "ContentType":file.content_type
            }
        )

        image_url = (f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_name}")

        return{
            "success":True,
            "Image_URL":image_url
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)   
        )
# def upload_image(image: UploadFile = File(...),current_user:UserAuth = Depends(get_current_user)):
#     letters = string.ascii_letters
#     rand_str = "".join(random.choice(letters) for i in range(6))
#     new = f"_{rand_str}."
#     filename = new.join(image.filename.rsplit('.', 1))
#     path = f'images/{filename}'

#     with open(path, "wb") as buffer:
#         shutil.copyfileobj(image.file, buffer)

#     return {'filename': f'/{path}'}

@router.delete('/delete/{id}',
               summary="Delete a Post",
                description="Deletes a specific post from the database by post ID. Only the post creator is authorized to perform this operation.",
                status_code=status.HTTP_200_OK,
                response_description="Post Deleted Successfully.")
def delete_post( id:int, db:Session = Depends(get_db),current_user:UserAuth = Depends(get_current_user)):
    return db_post.delete(db,id,current_user.id)









