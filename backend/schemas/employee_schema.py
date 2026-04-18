from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    emp_id: str
    phone: str
    department: str
    salary: int
    joining_date: date
    status: str