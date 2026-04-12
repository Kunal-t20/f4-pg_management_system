from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime


# -------------------- AUTH --------------------
class LoginSchema(BaseModel):
    email: EmailStr
    password: str


# -------------------- USER --------------------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # admin / student


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


# -------------------- STUDENT --------------------
class StudentBase(BaseModel):
    phone: str


class StudentCreate(StudentBase):
    user_id: int


class StudentResponse(StudentBase):
    id: int
    user_id: int
    room_id: Optional[int] = None

    class Config:
        from_attributes = True


# -------------------- ROOM --------------------
class RoomBase(BaseModel):
    room_number: str
    capacity: int


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    id: int
    current_occupancy: int

    class Config:
        from_attributes = True


# -------------------- ROOM ALLOCATION --------------------
class RoomAssignSchema(BaseModel):
    student_id: int
    room_id: int


# -------------------- PAYMENT --------------------
class PaymentBase(BaseModel):
    amount: float
    month: str


class PaymentCreate(PaymentBase):
    student_id: int


class PaymentUpdateStatus(BaseModel):
    status: str  # paid / pending


class PaymentResponse(BaseModel):
    id: int
    student_id: int
    amount: float
    status: str
    month: str
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------- COMPLAINT --------------------
class ComplaintBase(BaseModel):
    issue: str


class ComplaintCreate(ComplaintBase):
    student_id: int


class ComplaintUpdate(BaseModel):
    status: str  # pending / resolved


class ComplaintResponse(BaseModel):
    id: int
    student_id: int
    issue: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True