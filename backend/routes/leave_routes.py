from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from models.leave import LeaveRequest
from models.employee import Employee
from models.user import User
from utils.deps import get_current_user, admin_only
from schemas.leave_schema import LeaveCreate, LeaveUpdate

router = APIRouter(tags=["leave-requests"])

@router.post("/")
def create_leave_request(
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(404, "Employee profile not found")
    
    days = (leave.to_date - leave.from_date).days + 1
    if days <= 0:
        raise HTTPException(400, "Invalid date range")
    
    new_leave = LeaveRequest(
        employee_id=employee.id,
        category=leave.category,
        from_date=leave.from_date,
        to_date=leave.to_date,
        reason=leave.reason,
        status="pending"
    )
    db.add(new_leave)
    db.commit()
    employee.pending_leaves += days
    db.commit()
    return {"msg": "Leave request submitted", "id": new_leave.id}

@router.get("/my")
def get_my_leave_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return []
    leaves = db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee.id).all()
    return leaves

@router.get("/", dependencies=[Depends(admin_only)])
def get_all_leave_requests(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).all()
    result = []
    for leave in leaves:
        emp = db.query(Employee).filter(Employee.id == leave.employee_id).first()
        user = db.query(User).filter(User.id == emp.user_id).first() if emp else None
        result.append({
            "id": leave.id,
            "employee_name": user.name if user else "Unknown",
            "emp_id": emp.emp_id if emp else "",
            "category": leave.category,
            "from_date": leave.from_date,
            "to_date": leave.to_date,
            "reason": leave.reason,
            "status": leave.status,
            "admin_remark": leave.admin_remark,
            "created_at": leave.created_at
        })
    return result

@router.put("/{leave_id}", dependencies=[Depends(admin_only)])
def update_leave_status(leave_id: int, update: LeaveUpdate, db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(404, "Leave request not found")
    leave.status = update.status
    leave.admin_remark = update.admin_remark
    employee = db.query(Employee).filter(Employee.id == leave.employee_id).first()
    if employee:
        days = (leave.to_date - leave.from_date).days + 1
        if update.status == "approved":
            employee.used_leaves += days
            employee.pending_leaves -= days
        elif update.status == "rejected":
            employee.pending_leaves -= days
        db.commit()
    db.commit()
    return {"msg": "Leave request updated"}