# In backend folder, create a temporary script reset_db.py
from config.db import engine
from models.base import Base
from models.user import User
from models.employee import Employee
from models.task import Task
from models.leave import LeaveRequest
from models.document import Document
from models.attendance import Attendance
from models.schedule import Schedule
from models.request import Request

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Database reset complete")