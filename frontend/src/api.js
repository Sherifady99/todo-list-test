const BASE = 'https://todo-list-test-production-1b48.up.railway.app';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Tasks
export const getTasks = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null))
  ).toString();
  return request(`/tasks${qs ? `?${qs}` : ''}`);
};

export const createTask = (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });

// Subtasks
export const getSubtasks = (taskId) => request(`/tasks/${taskId}/subtasks`);
export const createSubtask = (taskId, data) => request(`/tasks/${taskId}/subtasks`, { method: 'POST', body: JSON.stringify(data) });
export const updateSubtask = (id, data) => request(`/subtasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubtask = (id) => request(`/subtasks/${id}`, { method: 'DELETE' });
