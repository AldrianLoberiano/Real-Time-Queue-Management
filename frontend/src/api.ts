const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;

export interface QueueItemResponse {
  id: string;
  number: string;
  name: string;
  status: 'waiting' | 'serving' | 'done' | 'skipped';
  created_at: string;
  called_at: string | null;
  completed_at: string | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getItems: () => request<QueueItemResponse[]>('/api/items'),

  getCounter: () => request<{ counter: number }>('/api/counter'),

  joinQueue: (name: string) =>
    request<{ id: string; number: string; name: string; status: string }>(
      '/api/join',
      { method: 'POST', body: JSON.stringify({ name }) }
    ),

  callNext: () =>
    request<QueueItemResponse | null>('/api/call-next', { method: 'POST' }),

  doneAndCallNext: (id: string) =>
    request<QueueItemResponse | null>('/api/done-and-call-next', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  markDone: (id: string) =>
    request<{ success: boolean }>('/api/mark-done', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  skip: (id: string) =>
    request<{ success: boolean }>('/api/skip', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  recall: (id: string) =>
    request<{ success: boolean }>('/api/recall', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  removeItem: (id: string) =>
    request<{ success: boolean }>(`/api/items/${id}`, { method: 'DELETE' }),

  reset: () =>
    request<{ success: boolean }>('/api/reset', { method: 'POST' }),

  clearAll: () =>
    request<{ success: boolean }>('/api/clear', { method: 'POST' }),

  getSoundSetting: () =>
    request<{ enabled: boolean }>('/api/settings/sound'),

  updateSoundSetting: (enabled: boolean) =>
    request<{ success: boolean }>('/api/settings/sound', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),

  getLunchBreakSetting: () =>
    request<{ enabled: boolean }>('/api/settings/lunch-break'),

  updateLunchBreakSetting: (enabled: boolean) =>
    request<{ success: boolean }>('/api/settings/lunch-break', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),

  adminLogin: (username: string, password: string) =>
    request<{ success: boolean }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};
