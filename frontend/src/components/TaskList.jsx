import React from 'react';
import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  if (tasks.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-slate-400">
        <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <div className="text-center">
          <p className="font-medium text-slate-500">No tasks found</p>
          <p className="text-sm mt-1">Create a new task or adjust your filters.</p>
        </div>
      </div>
    );
  }

  const pending = tasks.filter(t => !t.is_complete);
  const done = tasks.filter(t => t.is_complete);

  return (
    <div className="mt-2 space-y-6">
      {pending.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
            Active — {pending.length}
          </h2>
          <div className="space-y-3">
            {pending.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
            Completed — {done.length}
          </h2>
          <div className="space-y-3 opacity-70">
            {done.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
