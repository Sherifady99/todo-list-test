import React from 'react';

const PRIORITIES = ['', 'high', 'medium', 'low'];
const COMPLETE_OPTIONS = [
  { value: '', label: 'All tasks' },
  { value: 'false', label: 'Active' },
  { value: 'true', label: 'Completed' },
];

export default function FilterBar({ filters, setFilters, categories }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearAll = () => setFilters({ search: '', priority: '', category: '', complete: '' });
  const hasFilters = filters.search || filters.priority || filters.category || filters.complete;

  return (
    <div className="card p-4 mb-5">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={e => update('search', e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={e => update('priority', e.target.value)}
          className="input w-auto min-w-[130px]"
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={e => update('category', e.target.value)}
          className="input w-auto min-w-[130px]"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Complete filter */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          {COMPLETE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('complete', opt.value)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.complete === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button onClick={clearAll} className="btn-secondary text-slate-500 text-xs">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
