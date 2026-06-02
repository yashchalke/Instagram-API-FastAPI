from fastapi import FastAPI
from database import models
from database.db import engine
from routers import auth,post
from routers import comment
from Auth import login
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(auth.router)
app.include_router(post.router)
app.include_router(login.router)
app.include_router(comment.router)

origins = json.loads(os.getenv("ORIGIN_URLS"))

app.add_middleware(
        CORSMiddleware,
        allow_origins = origins,
        allow_credentials = True,
        allow_methods=['*'],
        allow_headers=['*']
)

@app.get("/",
        tags=["Server Health"],
        summary="Check Server Health",
        description="Check whether the server is running or not",
        response_description="If the server is running, it will return a message indicating that the server is running.",
        status_code=200)
def root():
    return {
        "message":"Server is Running..."
    }



