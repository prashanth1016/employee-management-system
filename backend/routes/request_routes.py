# backend/routes/request_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from models.request import Request
from models.employee import Employee
from utils.deps import get_current_user, admin_only
from schemas.request_schema import RequestCreate, RequestOut, RequestUpdate
from typing import List

router = APIRouter(tags=["requests"])

@router.get("/my", response_model=List[RequestOut])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    requests = db.query(Request).filter(Request.employee_id == employee.id).order_by(Request.created_at.desc()).all()
    return requests

# ... rest unchanged

# Employee: create request (existing)
@router.post("/", response_model=RequestOut)
def create_request(
    data: RequestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    new_req = Request(employee_id=employee.id, title=data.title, description=data.description, status="pending")
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

# Admin: get all requests (existing)
@router.get("/", response_model=List[RequestOut], dependencies=[Depends(admin_only)])
def get_all_requests(db: Session = Depends(get_db)):
    return db.query(Request).order_by(Request.created_at.desc()).all()

# Admin: update request status with remark
@router.put("/{request_id}", response_model=RequestOut, dependencies=[Depends(admin_only)])
def update_request_status(
    request_id: int,
    update: RequestUpdate,
    db: Session = Depends(get_db)
):
    req = db.query(Request).filter(Request.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = update.status
    req.admin_remark = update.admin_remark
    db.commit()
    db.refresh(req)
    return req