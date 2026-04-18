from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from config.db import get_db
from models.task import Task
from models.employee import Employee
from models.user import User
from utils.deps import admin_only, get_current_user
from datetime import datetime
import os
import uuid
import shutil

router = APIRouter(tags=["tasks"])

# Admin assigns task
@router.post("/", dependencies=[Depends(admin_only)])
def assign_task(data: dict, db: Session = Depends(get_db)):
    task = Task(**data)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

# Employee sees their tasks
@router.get("/my")
def my_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return []
    return db.query(Task).filter(Task.employee_id == employee.id).all()

# Get all tasks (admin only)
@router.get("/", dependencies=[Depends(admin_only)])
def get_all_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    result = []
    for task in tasks:
        emp = db.query(Employee).filter(Employee.id == task.employee_id).first()
        user = db.query(User).filter(User.id == emp.user_id).first() if emp else None
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "deadline": task.deadline,
            "employee_name": user.name if user else "Unknown",
            "employee_id": task.employee_id,
            "completed_at": task.completed_at,
            "completion_notes": task.completion_notes,
            "attachment_path": task.attachment_path
        })
    return result

# Mark task as completed (employee)
@router.post("/{task_id}/complete")
def complete_task(
    task_id: int,
    notes: str = Form(...),
    attachment: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(404, "Employee not found")
    if task.employee_id != employee.id and current_user.role != "admin":
        raise HTTPException(403, "Not authorized")
    
    task.status = "completed"
    task.completed_at = datetime.utcnow()
    task.completion_notes = notes
    if attachment:
        ext = os.path.splitext(attachment.filename)[1].lower()
        filename = f"task_{task_id}_{uuid.uuid4()}{ext}"
        path = os.path.join("uploads", filename)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(attachment.file, buffer)
        task.attachment_path = path
    db.commit()
    return {"msg": "Task marked completed"}