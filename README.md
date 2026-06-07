# Todo List App

A full-stack to-do list application built with React + Tailwind CSS (frontend) and FastAPI + SQLite (backend).

## Features

- Create, read, update, and delete tasks
- Task fields: title, description, priority (Low/Medium/High), category, due date
- Mark tasks complete/incomplete
- Filter by priority and category
- Sort by due date or priority
- Color-coded priorities (green=Low, yellow=Medium, red=High)
- Overdue date highlighting

## Project Structure

```
todo-list-test/
├── backend/
│   ├── main.py          # FastAPI app with CRUD endpoints
│   ├── models.py        # SQLAlchemy Task model
│   ├── database.py      # SQLite setup (todo.db)
│   ├── schemas.py       # Pydantic schemas
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app with state management
│   │   ├── components/
│   │   │   ├── TaskForm.jsx      # Add/edit task modal form
│   │   │   ├── TaskList.jsx      # List with filters and sort
│   │   │   └── TaskCard.jsx      # Individual task card
│   │   └── index.css             # Tailwind imports
│   └── tailwind.config.js
└── README.md
```

## Running the App

### Backend (FastAPI)

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

The API will be available at **http://localhost:8000**.  
Interactive docs: http://localhost:8000/docs

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

## API Endpoints

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | /tasks                 | List tasks (query: priority, category, sort_by) |
| POST   | /tasks                 | Create a new task                        |
| PUT    | /tasks/{id}            | Update a task                            |
| DELETE | /tasks/{id}            | Delete a task                            |
| PATCH  | /tasks/{id}/toggle     | Toggle task complete/incomplete          |
