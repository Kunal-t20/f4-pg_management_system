from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


# -------------------- USER --------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin / student

    # relationships
    student = relationship("Student", back_populates="user", uselist=False)


# -------------------- STUDENT --------------------
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String)

    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)

    # relationships
    user = relationship("User", back_populates="student")
    room = relationship("Room", back_populates="students")
    payments = relationship("Payment", back_populates="student")
    complaints = relationship("Complaint", back_populates="student")


# -------------------- ROOM --------------------
class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0)

    # relationships
    students = relationship("Student", back_populates="room")


# -------------------- PAYMENT --------------------
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # paid / pending
    month = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    student = relationship("Student", back_populates="payments")


# -------------------- COMPLAINT --------------------
class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    issue = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending / resolved

    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    student = relationship("Student", back_populates="complaints")