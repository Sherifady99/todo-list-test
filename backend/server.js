const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── TASKS ───────────────────────────────────────────────────────────────────

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  const { priority, category, search, complete } = req.query;

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (complete !== undefined && complete !== '') {
    query += ' AND is_complete = ?';
    params.push(complete === 'true' ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const tasks = db.prepare(query).all(...params);
    // Convert is_complete to boolean
    const normalized = tasks.map(t => ({ ...t, is_complete: !!t.is_complete }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title, description = '', priority = 'medium', category = '', due_date = null, recurrence = 'none' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, category, due_date, recurrence)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title.trim(), description, priority, category, due_date || null, recurrence);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...task, is_complete: !!task.is_complete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, category, due_date, is_complete, recurrence } = req.body;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const updated = {
    title: title !== undefined ? title : existing.title,
    description: description !== undefined ? description : existing.description,
    priority: priority !== undefined ? priority : existing.priority,
    category: category !== undefined ? category : existing.category,
    due_date: due_date !== undefined ? due_date : existing.due_date,
    is_complete: is_complete !== undefined ? (is_complete ? 1 : 0) : existing.is_complete,
    recurrence: recurrence !== undefined ? recurrence : existing.recurrence,
  };

  try {
    db.prepare(`
      UPDATE tasks SET title=?, description=?, priority=?, category=?, due_date=?, is_complete=?, recurrence=?
      WHERE id=?
    `).run(updated.title, updated.description, updated.priority, updated.category, updated.due_date, updated.is_complete, updated.recurrence, id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json({ ...task, is_complete: !!task.is_complete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SUBTASKS ────────────────────────────────────────────────────────────────

// GET /api/tasks/:id/subtasks
app.get('/api/tasks/:id/subtasks', (req, res) => {
  const { id } = req.params;
  try {
    const subtasks = db.prepare('SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC').all(id);
    res.json(subtasks.map(s => ({ ...s, is_complete: !!s.is_complete })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks/:id/subtasks
app.post('/api/tasks/:id/subtasks', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = db.prepare('SELECT id FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  try {
    const result = db.prepare('INSERT INTO subtasks (task_id, title) VALUES (?, ?)').run(id, title.trim());
    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...subtask, is_complete: !!subtask.is_complete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/subtasks/:id
app.put('/api/subtasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, is_complete } = req.body;

  const existing = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Subtask not found' });

  const updated = {
    title: title !== undefined ? title : existing.title,
    is_complete: is_complete !== undefined ? (is_complete ? 1 : 0) : existing.is_complete,
  };

  try {
    db.prepare('UPDATE subtasks SET title=?, is_complete=? WHERE id=?').run(updated.title, updated.is_complete, id);
    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
    res.json({ ...subtask, is_complete: !!subtask.is_complete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/subtasks/:id
app.delete('/api/subtasks/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Subtask not found' });

  try {
    db.prepare('DELETE FROM subtasks WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
