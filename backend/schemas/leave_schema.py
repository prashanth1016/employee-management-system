from pydantic import BaseModel
from datetime import date
from typing import Optional

class LeaveCreate(BaseModel):
    category: str
    from_date: date
    to_date: date
    reason: str

class LeaveUpdate(BaseModel):
    status: str   # approved / rejected
    admin_remark: Optional[str] = None