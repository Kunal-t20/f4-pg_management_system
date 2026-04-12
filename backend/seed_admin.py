from database.db import SessionLocal
import auth

db = SessionLocal()
try:
    auth.register_user(db, "Direct Admin", "admin123@gmail.com", "admin123", "admin")
    print("Successfully created admin123@gmail.com account!")
except Exception as e:
    print("Error:", e)
finally:
    db.close()
