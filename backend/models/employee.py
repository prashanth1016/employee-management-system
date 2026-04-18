from sqlalchemy import Column, Integer, String, Date, ForeignKey
from models.base import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    emp_id = Column(String(20), unique=True, index=True)
    phone = Column(String(20))
    department = Column(String(50))
    salary = Column(Integer)
    joining_date = Column(Date)
    status = Column(String(20))
    resume = Column(String(255), nullable=True)
    profile_pic = Column(String(255), nullable=True)
    total_leaves = Column(Integer, default=12)
    used_leaves = Column(Integer, default=0)
    pending_leaves = Column(Integer, default=0)