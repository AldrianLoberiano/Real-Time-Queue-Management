import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

// Mock mysql2/promise before importing app
const mockQuery = vi.fn();
const mockGetConnection = vi.fn();
const mockRelease = vi.fn();
const mockBeginTransaction = vi.fn();
const mockCommit = vi.fn();
const mockRollback = vi.fn();

vi.mock('mysql2/promise', () => ({
  default: {
    createPool: () => ({
      query: mockQuery,
      getConnection: mockGetConnection,
    }),
  },
}));

// Import app after mocking
const { app } = await import('../app');

function setupMockConn() {
  const conn = {
    query: mockQuery,
    beginTransaction: mockBeginTransaction,
    commit: mockCommit,
    rollback: mockRollback,
    release: mockRelease,
  };
  mockGetConnection.mockResolvedValue(conn);
  return conn;
}

describe('API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBeginTransaction.mockResolvedValue(undefined);
    mockCommit.mockResolvedValue(undefined);
    mockRollback.mockResolvedValue(undefined);
    mockRelease.mockResolvedValue(undefined);
  });

  describe('GET /api/items', () => {
    it('returns all queue items', async () => {
      const items = [
        { id: '1', number: 'A-001', name: 'Alice', status: 'waiting', created_at: '2026-07-11T10:08:24.134Z' },
      ];
      mockQuery.mockResolvedValueOnce([items]);

      const res = await request(app).get('/api/items');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(items);
    });

    it('returns 500 on error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/api/items');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/counter', () => {
    it('returns counter value', async () => {
      mockQuery.mockResolvedValueOnce([[{ counter: 5 }]]);
      const res = await request(app).get('/api/counter');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ counter: 5 });
    });

    it('returns 0 when no counter exists', async () => {
      mockQuery.mockResolvedValueOnce([[]]);
      const res = await request(app).get('/api/counter');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ counter: 0 });
    });
  });

  describe('POST /api/join', () => {
    it('joins queue with valid name', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce([[{ counter: 0 }]]) // SELECT counter FOR UPDATE
        .mockResolvedValueOnce({}) // UPDATE counter
        .mockResolvedValueOnce({}); // INSERT item

      const res = await request(app)
        .post('/api/join')
        .send({ name: 'Alice' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Alice');
      expect(res.body.number).toBe('A-001');
      expect(res.body.status).toBe('waiting');
      expect(mockBeginTransaction).toHaveBeenCalled();
      expect(mockCommit).toHaveBeenCalled();
    });

    it('trims whitespace from name', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce([[{ counter: 0 }]])
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const res = await request(app)
        .post('/api/join')
        .send({ name: '  Bob  ' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Bob');
    });

    it('returns 400 for empty name', async () => {
      const res = await request(app)
        .post('/api/join')
        .send({ name: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is required');
    });

    it('returns 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/join')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is required');
    });

    it('rolls back on error', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce([[{ counter: 0 }]])
        .mockRejectedValueOnce(new Error('DB error'));

      try {
        await request(app)
          .post('/api/join')
          .send({ name: 'Alice' });
      } catch {}

      expect(mockRollback).toHaveBeenCalled();
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  describe('POST /api/call-next', () => {
    it('calls next waiting item', async () => {
      setupMockConn();
      const waitingItem = { id: '1', number: 'A-001', name: 'Alice', status: 'waiting', created_at: new Date() };
      mockQuery
        .mockResolvedValueOnce([[waitingItem]]) // SELECT waiting
        .mockResolvedValueOnce({}) // UPDATE serving -> done
        .mockResolvedValueOnce({}); // UPDATE waiting -> serving

      const res = await request(app).post('/api/call-next');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('serving');
      expect(res.body.id).toBe('1');
    });

    it('returns null when no waiting items', async () => {
      setupMockConn();
      mockQuery.mockResolvedValueOnce([[]]);

      const res = await request(app).post('/api/call-next');
      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });
  });

  describe('POST /api/done-and-call-next', () => {
    it('marks done and calls next', async () => {
      setupMockConn();
      const nextItem = { id: '2', number: 'A-002', name: 'Bob', status: 'waiting', created_at: new Date() };
      mockQuery
        .mockResolvedValueOnce({}) // UPDATE current -> done
        .mockResolvedValueOnce([[nextItem]]) // SELECT next waiting
        .mockResolvedValueOnce({}); // UPDATE next -> serving

      const res = await request(app)
        .post('/api/done-and-call-next')
        .send({ id: '1' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('serving');
      expect(res.body.id).toBe('2');
    });

    it('returns null when no more waiting items', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/done-and-call-next')
        .send({ id: '1' });

      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });
  });

  describe('POST /api/mark-done', () => {
    it('marks item as done', async () => {
      mockQuery.mockResolvedValueOnce({});

      const res = await request(app)
        .post('/api/mark-done')
        .send({ id: '1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('POST /api/skip', () => {
    it('skips an item', async () => {
      mockQuery.mockResolvedValueOnce({});

      const res = await request(app)
        .post('/api/skip')
        .send({ id: '1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('POST /api/recall', () => {
    it('recalls an item to serving', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce({}) // UPDATE serving -> done
        .mockResolvedValueOnce({}); // UPDATE recalled -> serving

      const res = await request(app)
        .post('/api/recall')
        .send({ id: '1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('removes an item', async () => {
      mockQuery.mockResolvedValueOnce({});

      const res = await request(app).delete('/api/items/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('POST /api/reset', () => {
    it('resets queue', async () => {
      mockQuery.mockResolvedValueOnce({});

      const res = await request(app).post('/api/reset');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('POST /api/clear', () => {
    it('clears all data', async () => {
      setupMockConn();
      mockQuery
        .mockResolvedValueOnce({}) // DELETE items
        .mockResolvedValueOnce({}); // UPDATE counter

      const res = await request(app).post('/api/clear');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('GET /api/settings/sound', () => {
    it('returns sound setting', async () => {
      mockQuery.mockResolvedValueOnce([[{ value: 'true' }]]);
      const res = await request(app).get('/api/settings/sound');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ enabled: true });
    });

    it('returns true when no setting exists', async () => {
      mockQuery.mockResolvedValueOnce([[]]);
      const res = await request(app).get('/api/settings/sound');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ enabled: true });
    });
  });

  describe('PUT /api/settings/sound', () => {
    it('updates sound setting', async () => {
      mockQuery.mockResolvedValueOnce({});
      const res = await request(app)
        .put('/api/settings/sound')
        .send({ enabled: false });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('GET /api/settings/lunch-break', () => {
    it('returns lunch break setting', async () => {
      mockQuery.mockResolvedValueOnce([[{ value: 'true' }]]);
      const res = await request(app).get('/api/settings/lunch-break');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ enabled: true });
    });

    it('returns false when setting is false', async () => {
      mockQuery.mockResolvedValueOnce([[{ value: 'false' }]]);
      const res = await request(app).get('/api/settings/lunch-break');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ enabled: false });
    });
  });

  describe('PUT /api/settings/lunch-break', () => {
    it('updates lunch break setting', async () => {
      mockQuery.mockResolvedValueOnce({});
      const res = await request(app)
        .put('/api/settings/lunch-break')
        .send({ enabled: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('POST /api/admin/login', () => {
    it('returns success for valid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'admin', password: 'admin123' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    });

    it('returns 401 for invalid username', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'wrong', password: 'admin123' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('returns 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'admin', password: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('returns 401 for empty credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: '', password: '' });
      expect(res.status).toBe(401);
    });
  });
});
