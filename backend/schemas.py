from pydantic import BaseModel
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.medium
    category: Optional[str] = None
    due_date: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True
