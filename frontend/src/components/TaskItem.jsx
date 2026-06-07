import React, { useState } from 'react';
import SubtaskList from './SubtaskList.jsx';

const PRIORITY_STYLES = {
  high:   { badge: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500',   border: 'border-l-red-400',   label: 'High' },
  medium: { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', border: 'border-l-amber-400', label: 'Medium' },
  low:    { badge: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', border: 'border-l-green-400', label: 'Low' },
};

const RECURRENCE_LABELS = { none: null, daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  if (diff < 0) return { text: formatted, overdue: true };
  if (diff === 0) return { text: 'Today', overdue: false, today: true };
  if (diff === 1) return { text: 'Tomorrow', overdue: false };
  return { text: formatted, overdue: false };
}

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const recurrence = RECURRENCE_LABELS[task.recurrence];
  const dateInfo = formatDate(task.due_date);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try { await onDelete(task.id); } catch { setDeleting(false); }
  };

  return (
    <div className={`card border-l-4 ${priority.border} transition-all duration-200 hover:shadow-md ${task.is_complete ? 'opacity-75' : ''} ${deleting ? 'opacity-30 pointer-events-none' : ''}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task)}
            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              task.is_complete ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-500'
            }`}
          >
            {task.is_complete && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <button onClick={() => setExpanded(e => !e)} className="text-left flex-1 min-w-0">
                <h3 className={`font-semibold text-slate-800 leading-snug ${task.is_complete ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit task">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={handleDelete} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete task">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {task.description && (
              <p className="mt-1 text-sm text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
            )}

            {/* Tags row */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${priority.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>

              {task.category && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {task.category}
                </span>
              )}

              {task.assignee && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {task.assignee}
                </span>
              )}

              {dateInfo && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  dateInfo.overdue ? 'bg-red-50 text-red-600 border border-red-200'
                  : dateInfo.today ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dateInfo.overdue && 'Overdue · '}{dateInfo.text}
                </span>
              )}

              {recurrence && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {recurrence}
                </span>
              )}

              <button onClick={() => setExpanded(e => !e)} className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 transition-colors">
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {expanded ? 'Hide' : 'Details'}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded: notes + subtasks */}
        {expanded && (
          <div className="mt-3 ml-8 space-y-3">
            {task.notes && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 mb-1">Notes</p>
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{task.notes}</p>
              </div>
            )}
            <SubtaskList taskId={task.id} />
          </div>
        )}
      </div>
    </div>
  );
}
