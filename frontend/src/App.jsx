import { useState, useEffect, useCallback } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const API_BASE = 'http://localhost:8000'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({ priority: '', category: '', sort_by: '' })

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.category) params.append('category', filters.category)
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      const res = await fetch(`${API_BASE}/tasks?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreate = async (taskData) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    if (!res.ok) throw new Error('Failed to create task')
    setShowForm(false)
    fetchTasks()
  }

  const handleUpdate = async (id, taskData) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    if (!res.ok) throw new Error('Failed to update task')
    setEditingTask(null)
    fetchTasks()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete task')
    fetchTasks()
  }

  const handleToggle = async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH' })
    if (!res.ok) throw new Error('Failed to toggle task')
    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-sm text-gray-500 mt-0.5">Stay organized and productive</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + New Task
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? (data) => handleUpdate(editingTask.id, data) : handleCreate}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </main>
    </div>
  )
}
