from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routes import router, get_db
import auth
import time

app = FastAPI()

# -------------------- CORS MIDDLEWARE --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development (React)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STARTUP EVENT (ADMIN SEEDING) -----------
@app.on_event("startup")
def startup_event():
    from database.db import engine, Base
    from database.models import User
    
    # Auto-create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = next(get_db())
    try:
        # Check if our specific admin exists
        admin_exists = db.query(User).filter(User.email == "admin123@gmail.com").first()
        if not admin_exists:
            print("Specific admin not found. Creating admin123@gmail.com...")
            auth.register_user(db, "System Admin", "admin123@gmail.com", "admin123", "admin")
            print("Default admin created (admin123@gmail.com / admin123)")
    except Exception as e:
        print("Could not seed admin: ", e)


# -------------------- LOGGING MIDDLEWARE (OPTIONAL) --------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time
    print(f"{request.method} {request.url} - {round(process_time, 3)}s")

    return response


# -------------------- ROUTES --------------------
app.include_router(router)