from pydantic import BaseModel, EmailStr

class LoginSchema(BaseModel):
    email: str   # Accepts both email and emp_id
    password: str