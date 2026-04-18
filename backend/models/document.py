from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from models.base import Base
from datetime import datetime

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    file_name = Column(String(255))
    file_type = Column(String(50))
    file_path = Column(String(255))
    uploaded_at = Column(DateTime, default=datetime.utcnow)