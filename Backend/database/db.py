from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("DB_URL")
engine = create_engine(db_url)
localsession = sessionmaker(bind=engine,autocommit=False,autoflush=False)

Base = declarative_base()

def get_db():
    db = localsession()
    try:
        yield db
    finally:
        db.close()