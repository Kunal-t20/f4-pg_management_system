from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.db import SessionLocal
import schemas
import auth 

from database.models import Student, Room, Complaint, User, Payment
from services.allocation import assign_room
from services.payment import (
    create_payment,
    get_all_payments,
    update_payment_status,
    get_payments_by_student
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# -------------------- DB DEPENDENCY --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- SECURITY DEPENDENCIES --------------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return current_user


# -------------------- AUTH --------------------

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return auth.register_user(
        db,
        user.name,
        user.email,
        user.password,
        user.role
    )


@router.post("/login")
def login(data: schemas.LoginSchema, db: Session = Depends(get_db)):
    return auth.login_user(db, data.email, data.password)


# -------------------- STUDENT --------------------

@router.post("/students")
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.get("/students")
def get_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Student).all()


@router.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Decrease room occupancy to make vacancy
    if student.room_id:
        room = db.query(Room).filter(Room.id == student.room_id).first()
        if room and room.current_occupancy > 0:
            room.current_occupancy -= 1

    # Clean up dependent records to avoid Foreign Key errors
    db.query(Complaint).filter(Complaint.student_id == student_id).delete()
    db.query(Payment).filter(Payment.student_id == student_id).delete()

    user_id = student.user_id

    # Delete the student synchronously to avoid out-of-order execution issues
    db.query(Student).filter(Student.id == student_id).delete(synchronize_session=False)

    # Delete the associated user account
    if user_id:
        db.query(User).filter(User.id == user_id).delete(synchronize_session=False)

    db.commit()
    return {"message": "Student successfully deleted."}


# -------------------- ROOM --------------------

@router.post("/rooms")
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    new_room = Room(**room.dict())
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room


@router.get("/rooms")
def get_rooms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Room).all()


# -------------------- ROOM ALLOCATION --------------------

@router.post("/assign-room")
def assign(student: schemas.RoomAssignSchema, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    return assign_room(db, student.student_id, student.room_id)


# -------------------- PAYMENT --------------------

@router.post("/payments")
def add_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_payment(
        db,
        payment.student_id,
        payment.amount,
        payment.month
    )


@router.get("/payments")
def get_payments(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    return get_all_payments(db)


@router.get("/payments/student/{student_id}")
def get_student_payments(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_payments_by_student(db, student_id)


@router.put("/payments/{payment_id}")
def update_payment(payment_id: int, data: schemas.PaymentUpdateStatus, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    return update_payment_status(db, payment_id, data.status)


# -------------------- COMPLAINT --------------------

@router.post("/complaints")
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_complaint = Complaint(**complaint.dict())
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint


@router.get("/complaints")
def get_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    return db.query(Complaint).all()


@router.get("/complaints/student/{student_id}")
def get_student_complaints(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Complaint).filter(Complaint.student_id == student_id).all()


@router.put("/complaints/{complaint_id}")
def update_complaint(complaint_id: int, data: schemas.ComplaintUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise Exception("Complaint not found")

    complaint.status = data.status
    db.commit()
    db.refresh(complaint)

    return complaint