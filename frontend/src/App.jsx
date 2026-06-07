import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { getTasks, createTask, updateTask, deleteTask } from './api.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    complete: '',
    sort_by: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    getTasks({}).then(all => {
      const cats = [...new Set(all.map(t => t.category).filter(Boolean))].sort();
      setAllCategories(cats);
    }).catch(() => {});
  }, [tasks]);

  const handleCreateTask = async (data) => {
    const created = await createTask(data);
    setTasks(prev => [created, ...prev]);
    setModalOpen(false);
  };

  const handleUpdateTask = async (id, data) => {
    const updated = await updateTask(id, data);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleComplete = async (task) => {
    const updated = await updateTask(task.id, { is_complete: !task.is_complete });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const completedCount = tasks.filter(t => t.is_complete).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">TaskFlow</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} &middot; {completedCount} done
              </p>
            </div>
          </div>
          <button onClick={openCreate} className="btn-primary shadow-sm shadow-indigo-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <FilterBar filters={filters} setFilters={setFilters} categories={allCategories} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-sm">Loading tasks…</span>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={openEdit}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>

      {modalOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
