const PRIORITY_STYLES = {
  Low: {
    badge: 'bg-green-100 text-green-700 border-green-200',
    border: 'border-l-green-400',
    dot: 'bg-green-400',
  },
  Medium: {
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    border: 'border-l-yellow-400',
    dot: 'bg-yellow-400',
  },
  High: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    border: 'border-l-red-400',
    dot: 'bg-red-400',
  },
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-')
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = dateStr.split('-')
  const due = new Date(year, month - 1, day)
  return due < today
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const style = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium
  const overdue = !task.completed && isOverdue(task.due_date)

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${style.border} p-4 transition-all hover:shadow-md ${task.completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Complete toggle */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-gray-800 leading-tight ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{task.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
              {task.priority}
            </span>

            {task.category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                {task.category}
              </span>
            )}

            {task.due_date && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                overdue
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-blue-50 text-blue-600 border-blue-200'
              }`}>
                {overdue ? '⚠ ' : ''}Due {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
