from sqlalchemy.orm import Session
from database.models import User
import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException

# JWT configuration

# JWT configuration
SECRET_KEY = "pg_management_super_secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# -------------------- HASH PASSWORD --------------------
def hash_password(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


# -------------------- VERIFY PASSWORD --------------------
def verify_password(plain_password: str, hashed_password: str):
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


# -------------------- JWT GENERATOR --------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# -------------------- REGISTER USER --------------------
def register_user(db: Session, name: str, email: str, password: str, role: str):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(password)
    user = User(name=name, email=email, password=hashed_password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# -------------------- LOGIN USER --------------------
def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})

    return {
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }