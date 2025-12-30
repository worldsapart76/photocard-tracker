from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)  # numeric ID
    group_code = Column(String, nullable=False, default="skz")  # future-proof
    front_image_path = Column(String, nullable=False)  # relative to project root
    back_image_path = Column(String, nullable=True)

    member = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
