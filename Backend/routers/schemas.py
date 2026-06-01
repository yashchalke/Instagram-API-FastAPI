from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class UserBase(BaseModel):
    username:str
    email:str
    password:str

class UserLogin(BaseModel):
    username:str
    password:str

class UserDisplay(BaseModel):
    username:str
    email:str

    class Config():
        from_attributes = True

class PostBase(BaseModel):
    image_url:str
    image_url_type:str
    caption: str
    creator_id:int

# For PostDisplay
class User(BaseModel):
    username:str

    class Config():
        from_attributes = True

class Comment(BaseModel):
    text:str
    username:str
    timestamp:datetime
    class config():
        from_attributes = True
class PostDisplay(BaseModel):
    id: int
    creator_id:int = Field(validation_alias='user_id')
    image_url:str
    image_url_type:str
    caption: str
    timestamps:datetime = Field(validation_alias='timestamp')
    user:User
    comments:List[Comment]
    class Config():
        from_attributes = True

class UserAuth(BaseModel):
    id:int
    username:str
    email:str

class LoginDisplay(BaseModel):
    token:str
    token_type:str
    user_id:str
    username:str

    class config():
        from_attributes = True

class commentBase(BaseModel):
    username:str
    text:str
    post_id:int

    
