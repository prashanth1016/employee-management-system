# backend/routes/attendance_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from config.db import get_db
from models.login_session import LoginSession
from models.user import User
from models.employee import Employee
from utils.deps import admin_only
from datetime import datetime, timedelta
from typing import List, Dict

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/current-status", dependencies=[Depends(admin_only)])
def get_current_login_status(db: Session = Depends(get_db)):
    """
    Returns list of all employees with their current login status.
    Status: 'online' if they have an active session (logout_time is NULL)
    """
    employees = db.query(
        Employee,
        User,
        LoginSession
    ).join(User, Employee.user_id == User.id)\
     .outerjoin(LoginSession, and_(
         LoginSession.user_id == User.id,
         LoginSession.logout_time.is_(None)
     ))\
     .all()
    
    result = []
    for emp, user, session in employees:
        result.append({
            "employee_id": emp.id,
            "emp_id": emp.emp_id,
            "name": user.name,
            "email": user.email,
            "department": emp.department,
            "status": "online" if session else "offline",
            "login_time": session.login_time if session else None,
            "session_id": session.id if session else None,
            "ip_address": session.ip_address if session else None
        })
    return result

@router.get("/daily/{date}", dependencies=[Depends(admin_only)])
def get_daily_attendance(date: str, db: Session = Depends(get_db)):
    """
    Get attendance summary for a specific date (YYYY-MM-DD).
    Returns each employee's first login, last logout, total online duration.
    """
    target_date = datetime.strptime(date, "%Y-%m-%d").date()
    start_of_day = datetime.combine(target_date, datetime.min.time())
    end_of_day = start_of_day + timedelta(days=1)
    
    # Get all employees
    employees = db.query(Employee, User).join(User, Employee.user_id == User.id).all()
    
    attendance = []
    for emp, user in employees:
        sessions = db.query(LoginSession).filter(
            LoginSession.user_id == user.id,
            LoginSession.login_time >= start_of_day,
            LoginSession.login_time < end_of_day
        ).order_by(LoginSession.login_time).all()
        
        first_login = sessions[0].login_time if sessions else None
        last_logout = None
        total_seconds = 0
        for sess in sessions:
            logout = sess.logout_time or datetime.now()
            total_seconds += (logout - sess.login_time).total_seconds()
            if sess.logout_time and (last_logout is None or sess.logout_time > last_logout):
                last_logout = sess.logout_time
        
        attendance.append({
            "employee_id": emp.id,
            "emp_id": emp.emp_id,
            "name": user.name,
            "first_login": first_login,
            "last_logout": last_logout,
            "total_hours": round(total_seconds / 3600, 2),
            "sessions_count": len(sessions)
        })
    return attendance

@router.get("/employee/{employee_id}/sessions", dependencies=[Depends(admin_only)])
def get_employee_sessions(employee_id: int, db: Session = Depends(get_db)):
    """
    Get detailed login sessions for a specific employee.
    """
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    sessions = db.query(LoginSession).filter(
        LoginSession.user_id == employee.user_id
    ).order_by(LoginSession.login_time.desc()).limit(50).all()
    
    return [
        {
            "id": s.id,
            "login_time": s.login_time,
            "logout_time": s.logout_time,
            "duration": (
                (s.logout_time - s.login_time).total_seconds() / 3600 
                if s.logout_time else None
            ),
            "ip_address": s.ip_address
        } for s in sessions
    ]