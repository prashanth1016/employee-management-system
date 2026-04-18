from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes.document_routes import router as doc_router
from config.db import engine
from models.base import Base
from fastapi.staticfiles import StaticFiles
from routes.auth_routes import router as auth_router
from routes.employee_routes import router as emp_router
from routes.task_routes import router as task_router
from routes.request_routes import router as req_router
from routes.leave_routes import router as leave_router
from routes import attendance_routes

# backend/main.py
from models import user, employee, task, request, document, leave, login_session
Base.metadata.create_all(bind=engine)

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app = FastAPI(title="EMS Production API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(emp_router, prefix="/employees")
app.include_router(task_router, prefix="/tasks")
app.include_router(req_router, prefix="/requests")
app.include_router(doc_router, prefix="/documents")
app.include_router(leave_router, prefix="/leave-requests")
app.include_router(attendance_routes.router)
@app.get("/")
def home():
    return {"msg": "Production EMS Running 🚀"}