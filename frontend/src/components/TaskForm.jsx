import React, { useState, useEffect, useRef } from 'react';
import { parseShortcuts, getShortcutHints } from '../utils/parseShortcuts.js';

const PRIORITIES = ['high', 'medium', 'low'];
const RECURRENCES = ['none', 'daily', 'weekly', 'monthly'];

const SHORTCUT_HELP = [
  { key: 'P1 / P2 / P3', desc: 'Set priority (high / medium / low)' },
  { key: '@TagName', desc: 'Assign a category' },
  { key: 'Due: Tuesday', desc: 'Set due date by day name' },
  { key: 'Due: 12th June', desc: 'Set due date by date' },
  { key: 'Repeat every Monday', desc: 'Set weekly recurrence' },
  { key: 'Repeat every 1st of the month', desc: 'Set monthly recurrence' },
];

export default function TaskForm({ task, onSubmit, onClose }) {
  const isEdit = !!task;
  const [rawTitle, setRawTitle] = useState(task?.title || '');
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    notes: task?.notes || '',
    priority: task?.priority || 'medium',
    category: task?.category || '',
    assignee: task?.assignee || '',
    due_date: task?.due_date || '',
    recurrence: task?.recurrence || 'none',
  });
  const [hints, setHints] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleTitleChange = (e) => {
    const raw = e.target.value;
    setRawTitle(raw);
    setHints(getShortcutHints(raw));
    const parsed = parseShortcuts(raw);
    setForm(prev => ({
      ...prev,
      title: parsed.title || raw,
      ...(parsed.priority && { priority: parsed.priority }),
      ...(parsed.category && { category: parsed.category }),
      ...(parsed.due_date && { due_date: parsed.due_date }),
      ...(parsed.recurrence && parsed.recurrence !== 'none' && { recurrence: parsed.recurrence }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ ...form, due_date: form.due_date || null });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg card shadow-2xl shadow-slate-900/20 animate-[fadeInUp_0.2s_ease] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          {/* Title with shortcut parsing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Title <span className="text-red-400">*</span></label>
              <button type="button" onClick={() => setShowHelp(h => !h)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
                {showHelp ? 'Hide shortcuts' : '⌨ Shortcuts'}
              </button>
            </div>

            {showHelp && (
              <div className="mb-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg space-y-1">
                {SHORTCUT_HELP.map(s => (
                  <div key={s.key} className="flex gap-2 text-xs">
                    <code className="font-mono text-indigo-700 font-semibold min-w-[140px]">{s.key}</code>
                    <span className="text-slate-500">{s.desc}</span>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={titleRef}
              type="text"
              className="input"
              placeholder='e.g. "Fix report P1 @Work Due: Friday"'
              value={rawTitle}
              onChange={handleTitleChange}
            />

            {hints.length > 0 && (
              <div className="mt-1 flex gap-1 flex-wrap">
                {hints.map(h => (
                  <span key={h.label} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    ✓ {h.desc}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Add more details…" value={form.description} onChange={e => update('description', e.target.value)} />
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={3} placeholder="Private notes, links, references…" value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>

          {/* Priority + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e => update('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <input type="text" className="input" placeholder="e.g. Work, Personal" value={form.category} onChange={e => update('category', e.target.value)} />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="label">For (Assignee)</label>
            <input type="text" className="input" placeholder="e.g. Brett, Self, Team" value={form.assignee} onChange={e => update('assignee', e.target.value)} />
          </div>

          {/* Due date + Recurrence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" value={form.due_date || ''} onChange={e => update('due_date', e.target.value)} />
            </div>
            <div>
              <label className="label">Recurrence</label>
              <select className="input" value={form.recurrence} onChange={e => update('recurrence', e.target.value)}>
                {RECURRENCES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary shadow-sm shadow-indigo-200">
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
