from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Text
from models.base import Base
from datetime import datetime

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    category = Column(String(50))      # sick, casual, earned, unpaid
    from_date = Column(Date)
    to_date = Column(Date)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    admin_remark = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)