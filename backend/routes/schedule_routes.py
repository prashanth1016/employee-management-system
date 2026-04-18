from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.schedule import Schedule

router = APIRouter()

def get_db():
    db = SessionLocal()
    yield db
    db.close()

@router.post("/")
def create_schedule(data: dict, db: Session = Depends(get_db)):
    schedule = Schedule(**data)
    db.add(schedule)
    db.commit()
    return schedule

@router.get("/")
def get_schedule(db: Session = Depends(get_db)):
    return db.query(Schedule).all()