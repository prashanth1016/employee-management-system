# backend/schemas/request_schema.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RequestCreate(BaseModel):
    title: str
    description: str

class RequestUpdate(BaseModel):
    status: str  # "approved" or "rejected"
    admin_remark: Optional[str] = ""

class RequestOut(BaseModel):
    id: int
    employee_id: int
    title: str
    description: str
    status: str
    admin_remark: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True