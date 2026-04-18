from pydantic import BaseModel
from typing import Optional

class PasswordChange(BaseModel):
    old_password: str
    new_password: str