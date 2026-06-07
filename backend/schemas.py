from pydantic import BaseModel
from typing import Optional


class SubtaskCreate(BaseModel):
    title: str
    notes: Optional[str] = ""


class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    is_complete: Optional[bool] = None


class SubtaskResponse(BaseModel):
    id: int
    task_id: int
    title: str
    notes: Optional[str] = ""
    is_complete: bool

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    notes: Optional[str] = ""
    priority: str = "medium"
    category: Optional[str] = ""
    assignee: Optional[str] = ""
    due_date: Optional[str] = None
    recurrence: str = "none"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    is_complete: Optional[bool] = None
    recurrence: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    notes: Optional[str] = None
    priority: str
    category: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    is_complete: bool
    recurrence: str

    class Config:
        from_attributes = True
