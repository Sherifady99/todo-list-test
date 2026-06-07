from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TaskFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://frontend-production-c1049.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PRIORITY_ORDER = {"high": 0, "medium": 1, "low": 2}


@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    complete: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Task)
    if priority:
        query = query.filter(models.Task.priority == priority)
    if category:
        query = query.filter(models.Task.category == category)
    if search:
        query = query.filter(
            models.Task.title.contains(search) | models.Task.description.contains(search)
        )
    if complete is not None and complete != "":
        query = query.filter(models.Task.is_complete == (complete.lower() == "true"))
    tasks = query.all()
    if sort_by == "due_date":
        tasks.sort(key=lambda t: (t.due_date is None, t.due_date or ""))
    elif sort_by == "priority":
        tasks.sort(key=lambda t: PRIORITY_ORDER.get(t.priority, 99))
    return tasks


@app.post("/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()


@app.get("/tasks/{task_id}/subtasks", response_model=List[schemas.SubtaskResponse])
def get_subtasks(task_id: int, db: Session = Depends(get_db)):
    if not db.query(models.Task).filter(models.Task.id == task_id).first():
        raise HTTPException(status_code=404, detail="Task not found")
    return db.query(models.Subtask).filter(models.Subtask.task_id == task_id).all()


@app.post("/tasks/{task_id}/subtasks", response_model=schemas.SubtaskResponse, status_code=201)
def create_subtask(task_id: int, subtask: schemas.SubtaskCreate, db: Session = Depends(get_db)):
    if not db.query(models.Task).filter(models.Task.id == task_id).first():
        raise HTTPException(status_code=404, detail="Task not found")
    db_subtask = models.Subtask(task_id=task_id, **subtask.model_dump())
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask


@app.put("/subtasks/{subtask_id}", response_model=schemas.SubtaskResponse)
def update_subtask(subtask_id: int, subtask: schemas.SubtaskUpdate, db: Session = Depends(get_db)):
    db_subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    for key, value in subtask.model_dump(exclude_unset=True).items():
        setattr(db_subtask, key, value)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask


@app.delete("/subtasks/{subtask_id}", status_code=204)
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    db_subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    db.delete(db_subtask)
    db.commit()
