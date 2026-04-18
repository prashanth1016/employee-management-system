from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.db import get_db
from models.employee import Employee
from models.user import User
from schemas.employee_schema import EmployeeCreate
from utils.hash import hash_password, verify_password
from utils.deps import admin_only, get_current_user
import shutil
import os
import uuid

router = APIRouter(tags=["employees"])

# CREATE EMPLOYEE (admin only)
@router.post("/", dependencies=[Depends(admin_only)])
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == emp.email).first()
    if existing_user:
        raise HTTPException(400, "Email already exists")
    existing_emp = db.query(Employee).filter(Employee.emp_id == emp.emp_id).first()
    if existing_emp:
        raise HTTPException(400, "Employee ID already exists")
    
    user = User(
        name=emp.name,
        email=emp.email,
        password=hash_password("123456"),
        role="employee",
        first_login=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    employee = Employee(
        user_id=user.id,
        emp_id=emp.emp_id,
        phone=emp.phone,
        department=emp.department,
        salary=emp.salary,
        joining_date=emp.joining_date,
        status=emp.status
    )
    db.add(employee)
    db.commit()
    return {"msg": "Employee created", "employee_id": employee.id}

# GET ALL EMPLOYEES (admin only)
@router.get("/", dependencies=[Depends(admin_only)])
def get_all(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        user = db.query(User).filter(User.id == emp.user_id).first()
        result.append({
            "id": emp.id,
            "user_id": emp.user_id,
            "emp_id": emp.emp_id,
            "name": user.name if user else None,
            "email": user.email if user else None,
            "phone": emp.phone,
            "department": emp.department,
            "salary": emp.salary,
            "joining_date": emp.joining_date,
            "status": emp.status,
        })
    return result

# GET EMPLOYEE BY USER_ID (admin or the employee themselves)
@router.get("/user/{user_id}")
def get_employee_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(403, "Not authorized")
    
    employee = db.query(Employee).filter(Employee.user_id == user_id).first()
    if not employee:
        raise HTTPException(404, "Employee not found")
    
    user = db.query(User).filter(User.id == employee.user_id).first()
    return {
        "id": employee.id,
        "user_id": employee.user_id,
        "emp_id": employee.emp_id,
        "name": user.name if user else None,
        "email": user.email if user else None,
        "phone": employee.phone,
        "department": employee.department,
        "salary": employee.salary,
        "joining_date": employee.joining_date,
        "status": employee.status,
    }

# DELETE EMPLOYEE (admin only) – also deletes the associated User
@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_emp(id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(404, "Employee not found")

    user = db.query(User).filter(User.id == emp.user_id).first()
    if user:
        db.delete(user)

    db.delete(emp)
    db.commit()
    return {"msg": "Employee and associated user deleted"}

# GET own profile (employee)
@router.get("/profile")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(404, "Employee not found")
    user = db.query(User).filter(User.id == employee.user_id).first()
    return {
        "id": employee.id,
        "emp_id": employee.emp_id,
        "name": user.name,
        "email": user.email,
        "phone": employee.phone,
        "department": employee.department,
        "salary": employee.salary,
        "joining_date": employee.joining_date,
        "profile_pic": employee.profile_pic,
        "total_leaves": employee.total_leaves,
        "used_leaves": employee.used_leaves,
        "pending_leaves": employee.pending_leaves,
        "status": employee.status
    }

# Change password
@router.post("/change-password")
def change_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not verify_password(old_password, user.password):
        raise HTTPException(400, "Incorrect old password")
    user.password = hash_password(new_password)
    user.first_login = False
    db.commit()
    return {"msg": "Password changed successfully"}

# Upload profile picture
@router.post("/upload-profile-pic")
def upload_profile_pic(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png"]:
        raise HTTPException(400, "Only JPG/PNG images allowed")
    filename = f"profile_{current_user.id}{ext}"
    path = os.path.join("uploads", filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if employee:
        employee.profile_pic = path
        db.commit()
    return {"file_path": path}

# UPLOAD RESUME (employee or admin)
@router.post("/{id}/resume")
def upload_resume(
    id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(404, "Employee not found")

    user = db.query(User).filter(User.id == emp.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    if current_user.role != "admin" and current_user.id != user.id:
        raise HTTPException(403, "Not authorized to upload resume for this employee")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are allowed")

    if emp.resume and os.path.exists(emp.resume):
        os.remove(emp.resume)

    filename = f"{uuid.uuid4()}.pdf"
    path = os.path.join("uploads", filename)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    emp.resume = path
    db.commit()
    return {"msg": "Resume uploaded successfully", "file_path": path}