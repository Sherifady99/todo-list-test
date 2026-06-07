import React, { useState, useEffect, useRef } from 'react';
import { getSubtasks, createSubtask, updateSubtask, deleteSubtask } from '../api.js';

export default function SubtaskList({ taskId }) {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    getSubtasks(taskId).then(setSubtasks).catch(console.error).finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const handleToggle = async (subtask) => {
    const updated = await updateSubtask(subtask.id, { is_complete: !subtask.is_complete });
    setSubtasks(prev => prev.map(s => s.id === subtask.id ? updated : s));
  };

  const handleDelete = async (id) => {
    await deleteSubtask(id);
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleNoteChange = async (subtask, notes) => {
    const updated = await updateSubtask(subtask.id, { notes });
    setSubtasks(prev => prev.map(s => s.id === subtask.id ? updated : s));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const created = await createSubtask(taskId, { title: newTitle.trim() });
      setSubtasks(prev => [...prev, created]);
      setNewTitle('');
      setShowInput(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="mt-3 text-xs text-slate-400 pl-1">Loading subtasks…</div>;

  const done = subtasks.filter(s => s.is_complete).length;

  return (
    <div className="border-t border-slate-100 pt-3">
      {subtasks.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500">Subtasks</span>
          <span className="text-xs text-slate-400">{done}/{subtasks.length}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${subtasks.length ? (done / subtasks.length) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {subtasks.map(subtask => (
          <li key={subtask.id} className="group">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(subtask)}
                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  subtask.is_complete ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                {subtask.is_complete && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm ${subtask.is_complete ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {subtask.title}
              </span>
              <button
                onClick={() => setExpandedNotes(prev => ({ ...prev, [subtask.id]: !prev[subtask.id] }))}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500 transition-all p-0.5 rounded text-xs"
                title="Toggle notes"
              >
                📝
              </button>
              <button
                onClick={() => handleDelete(subtask.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-0.5 rounded"
                title="Delete subtask"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {expandedNotes[subtask.id] && (
              <textarea
                className="mt-1 ml-6 w-full text-xs px-2 py-1 border border-amber-200 bg-amber-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                rows={2}
                placeholder="Add a note…"
                defaultValue={subtask.notes || ''}
                onBlur={e => handleNoteChange(subtask, e.target.value)}
              />
            )}
          </li>
        ))}
      </ul>

      {showInput ? (
        <form onSubmit={handleAdd} className="mt-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') { setShowInput(false); setNewTitle(''); } }}
            placeholder="Subtask title…"
            className="flex-1 px-2 py-1 text-sm rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type="submit" disabled={adding || !newTitle.trim()} className="px-2.5 py-1 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">Add</button>
          <button type="button" onClick={() => { setShowInput(false); setNewTitle(''); }} className="px-2 py-1 text-sm text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
        </form>
      ) : (
        <button onClick={() => setShowInput(true)} className="mt-2 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add subtask
        </button>
      )}
    </div>
  );
}
