from sqlalchemy.orm import Session
from database.models import Payment


# -------------------- CREATE PAYMENT --------------------
def create_payment(db: Session, student_id: int, amount: float, month: str):
    # check duplicate payment for same month
    existing = db.query(Payment).filter(
        Payment.student_id == student_id,
        Payment.month == month
    ).first()

    if existing:
        raise Exception("Payment already exists for this month")

    payment = Payment(
        student_id=student_id,
        amount=amount,
        status="pending",
        month=month
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


# -------------------- GET ALL PAYMENTS --------------------
def get_all_payments(db: Session):
    return db.query(Payment).all()


# -------------------- GET PAYMENT BY ID --------------------
def get_payment_by_id(db: Session, payment_id: int):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise Exception("Payment not found")

    return payment


# -------------------- GET PAYMENTS BY STUDENT --------------------
def get_payments_by_student(db: Session, student_id: int):
    return db.query(Payment).filter(Payment.student_id == student_id).all()


# -------------------- UPDATE PAYMENT STATUS --------------------
def update_payment_status(db: Session, payment_id: int, status: str):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise Exception("Payment not found")

    if status not in ["paid", "pending"]:
        raise Exception("Invalid status")

    payment.status = status

    db.commit()
    db.refresh(payment)

    return payment


# -------------------- DELETE PAYMENT --------------------
def delete_payment(db: Session, payment_id: int):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise Exception("Payment not found")

    db.delete(payment)
    db.commit()

    return {"message": "Payment deleted successfully"}