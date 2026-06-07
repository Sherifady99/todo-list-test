from sqlalchemy import Column, Integer, String, Boolean, Date, Enum
from database import Base
import enum


class PriorityEnum(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(String, default="Medium", nullable=False)
    category = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
