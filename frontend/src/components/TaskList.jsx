import TaskCard from './TaskCard'

const PRIORITIES = ['Low', 'Medium', 'High']
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
]

export default function TaskList({ tasks, loading, filters, setFilters, categories, onEdit, onDelete, onToggle }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-600 mr-1">Filter:</span>

        <select
          value={filters.priority}
          onChange={e => handleFilterChange('priority', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={e => handleFilterChange('category', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <select
            value={filters.sort_by}
            onChange={e => handleFilterChange('sort_by', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">⏳</div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm mt-1">Create a new task to get started.</p>
        </div>
      ) : (
        <div>
          {activeTasks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Active ({activeTasks.length})
              </h2>
              <div className="space-y-3">
                {activeTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Completed ({completedTasks.length})
              </h2>
              <div className="space-y-3 opacity-70">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
