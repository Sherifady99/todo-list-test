# TaskFlow — To-Do List App

A full-stack task management app built with **React + Tailwind CSS** (frontend) and **FastAPI + SQLite** (backend).

## Features

- Create, edit, delete tasks
- Priority levels: High / Medium / Low (color-coded)
- Custom categories
- Due dates with overdue highlighting (Today / Tomorrow / Overdue)
- Recurrence: Daily / Weekly / Monthly
- Subtasks with progress bar
- Search across title and description
- Filter by priority, category, active/completed
- Sort by due date or priority

## Project Structure

```
todo-list-test/
├── backend/
│   ├── main.py          # FastAPI app — all endpoints
│   ├── models.py        # SQLAlchemy models (Task, Subtask)
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # SQLite setup
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js                    # API calls to FastAPI
│   │   └── components/
│   │       ├── FilterBar.jsx         # Search, filter, sort
│   │       ├── TaskForm.jsx          # Add/edit modal
│   │       ├── TaskItem.jsx          # Task card with subtask toggle
│   │       ├── TaskList.jsx          # Active / Completed sections
│   │       └── SubtaskList.jsx       # Subtasks with progress bar
│   └── index.css                     # Tailwind + custom component classes
└── README.md
```

## Running the App

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at **http://localhost:8000** — interactive docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | List tasks (filter: priority, category, complete, search, sort_by) |
| POST | /tasks | Create task |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |
| GET | /tasks/{id}/subtasks | List subtasks |
| POST | /tasks/{id}/subtasks | Create subtask |
| PUT | /subtasks/{id} | Update subtask |
| DELETE | /subtasks/{id} | Delete subtask |
