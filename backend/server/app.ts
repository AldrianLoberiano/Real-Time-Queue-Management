import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'queue_management',
  waitForConnections: true,
  connectionLimit: 10,
});

const app = express();
app.use(cors());
app.use(express.json());

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatNumber(n: number): string {
  return `A-${String(n).padStart(3, '0')}`;
}

// Get all queue items
app.get('/api/items', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM queue_items ORDER BY created_at ASC');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get counter
app.get('/api/counter', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT counter FROM queue_counter WHERE id = 1') as any;
    res.json({ counter: rows[0]?.counter ?? 0 });
  } catch (err) {
    console.error('GET /api/counter error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join queue
app.post('/api/join', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [counterRows] = await conn.query('SELECT counter FROM queue_counter WHERE id = 1 FOR UPDATE') as any;
    const newCounter = (counterRows[0]?.counter ?? 0) + 1;
    await conn.query('UPDATE queue_counter SET counter = ? WHERE id = 1', [newCounter]);

    const id = generateId();
    const number = formatNumber(newCounter);
    await conn.query(
      'INSERT INTO queue_items (id, number, name, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [id, number, name.trim(), 'waiting']
    );

    await conn.commit();
    res.json({ id, number, name: name.trim(), status: 'waiting' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// Call next
app.post('/api/call-next', async (_req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [waiting] = await conn.query(
      'SELECT * FROM queue_items WHERE status = ? ORDER BY created_at ASC LIMIT 1 FOR UPDATE',
      ['waiting']
    ) as any;

    if (waiting.length === 0) {
      await conn.rollback();
      res.json(null);
      return;
    }

    const next = waiting[0];

    await conn.query(
      'UPDATE queue_items SET status = ?, completed_at = NOW() WHERE status = ?',
      ['done', 'serving']
    );

    await conn.query(
      'UPDATE queue_items SET status = ?, called_at = NOW() WHERE id = ?',
      ['serving', next.id]
    );

    await conn.commit();
    res.json({ ...next, status: 'serving', called_at: new Date().toISOString() });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// Done and call next (atomic)
app.post('/api/done-and-call-next', async (req, res) => {
  const { id } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE queue_items SET status = ?, completed_at = NOW() WHERE id = ?',
      ['done', id]
    );

    const [waiting] = await conn.query(
      'SELECT * FROM queue_items WHERE status = ? ORDER BY created_at ASC LIMIT 1 FOR UPDATE',
      ['waiting']
    ) as any;

    if (waiting.length === 0) {
      await conn.commit();
      res.json(null);
      return;
    }

    const next = waiting[0];
    await conn.query(
      'UPDATE queue_items SET status = ?, called_at = NOW() WHERE id = ?',
      ['serving', next.id]
    );

    await conn.commit();
    res.json({ ...next, status: 'serving', called_at: new Date().toISOString() });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// Mark done
app.post('/api/mark-done', async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query(
      'UPDATE queue_items SET status = ?, completed_at = NOW() WHERE id = ?',
      ['done', id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/mark-done error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Skip item
app.post('/api/skip', async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query(
      'UPDATE queue_items SET status = ? WHERE id = ?',
      ['skipped', id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/skip error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recall item
app.post('/api/recall', async (req, res) => {
  const { id } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE queue_items SET status = ?, completed_at = NOW() WHERE status = ?',
      ['done', 'serving']
    );

    await conn.query(
      'UPDATE queue_items SET status = ?, called_at = NOW() WHERE id = ?',
      ['serving', id]
    );

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// Remove item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM queue_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/items/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset queue
app.post('/api/reset', async (_req, res) => {
  try {
    await pool.query(
      "UPDATE queue_items SET status = 'done', completed_at = NOW() WHERE status IN ('waiting', 'serving', 'skipped')"
    );
    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/reset error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all
app.post('/api/clear', async (_req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM queue_items');
    await conn.query('UPDATE queue_counter SET counter = 0 WHERE id = 1');
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// Get sound setting
app.get('/api/settings/sound', async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT value FROM settings WHERE key_name = 'sound_enabled'") as any;
    res.json({ enabled: rows[0]?.value !== 'false' });
  } catch (err) {
    console.error('GET /api/settings/sound error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sound setting
app.put('/api/settings/sound', async (req, res) => {
  try {
    const { enabled } = req.body;
    await pool.query(
      "INSERT INTO settings (key_name, value) VALUES ('sound_enabled', ?) ON DUPLICATE KEY UPDATE value = ?",
      [String(enabled), String(enabled)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/settings/sound error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lunch break setting
app.get('/api/settings/lunch-break', async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT value FROM settings WHERE key_name = 'lunch_break'") as any;
    res.json({ enabled: rows[0]?.value === 'true' });
  } catch (err) {
    console.error('GET /api/settings/lunch-break error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lunch break setting
app.put('/api/settings/lunch-break', async (req, res) => {
  try {
    const { enabled } = req.body;
    await pool.query(
      "INSERT INTO settings (key_name, value) VALUES ('lunch_break', ?) ON DUPLICATE KEY UPDATE value = ?",
      [String(enabled), String(enabled)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/settings/lunch-break error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('POST /api/admin/login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export { app };
