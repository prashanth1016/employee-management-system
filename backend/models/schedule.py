from sqlalchemy import Column, Integer, Date, String, ForeignKey
from models.base import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    work_date = Column(Date)
    shift = Column(String(50))