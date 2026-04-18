from models.user import User
from config.db import SessionLocal
from utils.hash import hash_password

db = SessionLocal()

admin = User(
    name="Admin",
    email="admin@sparkintellect.in",
    password=hash_password("admin123"),
    role="admin"
)

db.add(admin)
db.commit()
db.close()

print("✅ Admin created successfully")