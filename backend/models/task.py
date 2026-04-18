from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Text
from models.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    title = Column(String(255))
    description = Column(Text)          # Changed from String to Text
    status = Column(String(50))
    deadline = Column(Date)
    completed_at = Column(DateTime, nullable=True)
    completion_notes = Column(Text, nullable=True)
    attachment_path = Column(String(255), nullable=True)