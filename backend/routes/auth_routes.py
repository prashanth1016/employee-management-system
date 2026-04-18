# backend/routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from config.db import SessionLocal
from models.user import User
from models.employee import Employee
from models.login_session import LoginSession
from utils.hash import verify_password, hash_password
from utils.auth import create_token
from utils.deps import admin_only, get_current_user
from schemas.auth_schema import LoginSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(
    data: LoginSchema,
    db: Session = Depends(get_db),
    request: Request = None
):
    user = None
    # Try email first
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Try emp_id via employee table
        employee = db.query(Employee).filter(Employee.emp_id == data.email).first()
        if employee:
            user = db.query(User).filter(User.id == employee.user_id).first()
    if not user:
        raise HTTPException(401, "Invalid credentials")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(401, "Invalid password")
    
    # Determine if this is first login (default password or flag)
    is_first_login = user.first_login or (data.password == "123456")
    token = create_token({"user_id": user.id, "role": user.role})
    
    # Create login session record
    client_ip = request.client.host if request else None
    user_agent = request.headers.get("user-agent") if request else None
    session = LoginSession(
        user_id=user.id,
        ip_address=client_ip,
        user_agent=user_agent
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {
        "access_token": token,
        "role": user.role,
        "name": user.name,
        "user_id": user.id,
        "first_login": is_first_login,
        "session_id": session.id   # <-- NEW: send session ID to frontend
    }

@router.post("/logout")
def logout(
    session_id: int = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update the session's logout_time to record logout.
    """
    if session_id:
        session = db.query(LoginSession).filter(
            LoginSession.id == session_id,
            LoginSession.user_id == current_user.id,
            LoginSession.logout_time.is_(None)
        ).first()
        if session:
            session.logout_time = func.now()
            db.commit()
    return {"msg": "Logged out"}

@router.post("/admin/reset-password", dependencies=[Depends(admin_only)])
def admin_reset_password(
    user_id: int,
    new_password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.password = hash_password(new_password)
    user.first_login = True      # Force password change on next login
    db.commit()
    return {"msg": f"Password reset for user {user.email} (ID: {user_id})"}