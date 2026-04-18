from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from config.db import get_db
from models.document import Document
from models.employee import Employee
from models.user import User
from utils.deps import get_current_user, admin_only
import shutil
import os
import uuid

router = APIRouter(tags=["documents"])

ALLOWED_TYPES = ["resume", "id_proof", "marksheet", "certificate"]
ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"]

@router.post("/upload")
def upload_document(
    user_id: int = Form(...),
    file_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Permission check
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(403, "Not authorized")

    if file_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Invalid document type")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Invalid file format")

    # Find employee by user_id
    employee = db.query(Employee).filter(Employee.user_id == user_id).first()
    if not employee:
        raise HTTPException(404, "Employee profile not found for this user")

    # Save file
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join("uploads", filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create document record with correct employee.id
    doc = Document(
        employee_id=employee.id,
        file_name=file.filename,
        file_type=file_type,
        file_path=path
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {"msg": "Document uploaded", "doc_id": doc.id}

@router.get("/my")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(404, "Employee profile not found")
    docs = db.query(Document).filter(Document.employee_id == employee.id).all()
    return docs

@router.get("/{employee_id}")
def get_documents_by_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin only
    if current_user.role != "admin":
        raise HTTPException(403, "Admin only")
    return db.query(Document).filter(Document.employee_id == employee_id).all()

@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(404, "Document not found")

    # Check permission: admin or owner
    if current_user.role != "admin":
        employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
        if not employee or doc.employee_id != employee.id:
            raise HTTPException(403, "Not authorized")

    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    db.delete(doc)
    db.commit()
    return {"msg": "Deleted successfully"}