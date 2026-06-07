const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

function nextWeekday(targetDay) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const current = today.getDay();
  let diff = targetDay - current;
  if (diff <= 0) diff += 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result.toISOString().split('T')[0];
}

function parseDate(str) {
  const s = str.trim().toLowerCase();

  if (s === 'today') {
    return new Date().toISOString().split('T')[0];
  }
  if (s === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  // "tuesday", "monday", etc.
  const dayIdx = DAYS.indexOf(s);
  if (dayIdx !== -1) return nextWeekday(dayIdx);

  // "12th june", "june 12", "12 june", "12th of june"
  const ordinalMonthMatch = s.match(/^(\d{1,2})(?:st|nd|rd|th)?(?:\s+of)?\s+([a-z]+)$/);
  if (ordinalMonthMatch) {
    const day = parseInt(ordinalMonthMatch[1]);
    const monthIdx = MONTHS.indexOf(ordinalMonthMatch[2]);
    if (monthIdx !== -1) {
      const today = new Date();
      let year = today.getFullYear();
      const candidate = new Date(year, monthIdx, day);
      if (candidate < today) year += 1;
      return new Date(year, monthIdx, day).toISOString().split('T')[0];
    }
  }

  // "june 12"
  const monthOrdinalMatch = s.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/);
  if (monthOrdinalMatch) {
    const monthIdx = MONTHS.indexOf(monthOrdinalMatch[1]);
    const day = parseInt(monthOrdinalMatch[2]);
    if (monthIdx !== -1) {
      const today = new Date();
      let year = today.getFullYear();
      const candidate = new Date(year, monthIdx, day);
      if (candidate < today) year += 1;
      return new Date(year, monthIdx, day).toISOString().split('T')[0];
    }
  }

  return null;
}

function parseRecurrence(str) {
  const s = str.trim().toLowerCase();
  if (s.includes('day') || s === 'daily') return 'daily';
  if (s.includes('week') || DAYS.some(d => s.includes(d))) return 'weekly';
  if (s.includes('month') || s.match(/\d+(st|nd|rd|th)?\s+of\s+the\s+month/) || s.match(/\d+(st|nd|rd|th)?$/)) return 'monthly';
  return 'none';
}

export function parseShortcuts(raw) {
  let title = raw;
  const extracted = {};

  // Priority: P1 / P2 / P3
  title = title.replace(/\bP1\b/gi, () => { extracted.priority = 'high'; return ''; });
  title = title.replace(/\bP2\b/gi, () => { extracted.priority = 'medium'; return ''; });
  title = title.replace(/\bP3\b/gi, () => { extracted.priority = 'low'; return ''; });

  // Category: @TagName
  title = title.replace(/@([\w-]+)/g, (_, cat) => { extracted.category = cat; return ''; });

  // Due date: "due: tuesday" / "due: 12th june"
  title = title.replace(/\bdue:\s*([^,!?]+?)(?=\s*(repeat|p[123]|@|$))/gi, (_, dateStr) => {
    const parsed = parseDate(dateStr.trim());
    if (parsed) extracted.due_date = parsed;
    return '';
  });

  // Recurrence: "repeat every ..."
  title = title.replace(/\brepeat\s+every\s+([^,!?]+?)(?=\s*(due:|p[123]|@|$))/gi, (_, recStr) => {
    extracted.recurrence = parseRecurrence(recStr.trim());
    return '';
  });

  // Clean up extra spaces
  extracted.title = title.replace(/\s{2,}/g, ' ').trim();

  return extracted;
}

export function getShortcutHints(raw) {
  const hints = [];
  if (/\bP1\b/i.test(raw)) hints.push({ label: 'P1', desc: 'High priority' });
  if (/\bP2\b/i.test(raw)) hints.push({ label: 'P2', desc: 'Medium priority' });
  if (/\bP3\b/i.test(raw)) hints.push({ label: 'P3', desc: 'Low priority' });
  if (/@[\w-]+/.test(raw)) hints.push({ label: '@', desc: 'Category tag' });
  if (/\bdue:/i.test(raw)) hints.push({ label: 'Due', desc: 'Due date' });
  if (/\brepeat\s+every\b/i.test(raw)) hints.push({ label: 'Repeat', desc: 'Recurrence' });
  return hints;
}
