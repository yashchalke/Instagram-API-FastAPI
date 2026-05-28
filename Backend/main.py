from fastapi import FastAPI
from database import models
from database.db import engine
from routers import auth,post
from fastapi.staticfiles import StaticFiles
from Auth import login

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(auth.router)
app.include_router(post.router)
app.include_router(login.router)

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

app.mount('/images',StaticFiles(directory='images'),name='images')

