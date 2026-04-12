from sqlalchemy.orm import Session
from database.models import Student, Room


def assign_room(db: Session, student_id: int, room_id: int):
    # get room
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise Exception("Room not found")

    # check capacity
    if room.current_occupancy >= room.capacity:
        raise Exception("Room is full")

    # get student
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise Exception("Student not found")

    # if student already has a room → remove from old room
    if student.room_id:
        old_room = db.query(Room).filter(Room.id == student.room_id).first()
        if old_room:
            old_room.current_occupancy -= 1

    # assign new room
    student.room_id = room_id
    room.current_occupancy += 1

    db.commit()
    db.refresh(student)

    return student