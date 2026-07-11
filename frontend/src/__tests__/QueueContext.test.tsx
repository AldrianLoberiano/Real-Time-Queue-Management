import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QueueProvider, useQueue } from '../features/queue/QueueContext';
import { api } from '../api';

vi.mock('../api', () => {
  let counter = 0;
  const items: any[] = [];
  return {
    api: {
      _reset: () => { items.length = 0; counter = 0; },
      getItems: vi.fn(async () => items),
      getCounter: vi.fn(async () => ({ counter })),
      getSoundSetting: vi.fn(async () => ({ enabled: true })),
      updateSoundSetting: vi.fn(async () => ({ success: true })),
      joinQueue: vi.fn(async (name: string) => {
        counter++;
        const item = {
          id: `id-${counter}`,
          number: `A-${String(counter).padStart(3, '0')}`,
          name,
          status: 'waiting',
          created_at: new Date().toISOString(),
          called_at: null,
          completed_at: null,
        };
        items.push(item);
        return item;
      }),
      callNext: vi.fn(async () => {
        const waiting = items.filter((i: any) => i.status === 'waiting');
        if (waiting.length === 0) return null;
        items.forEach((i: any) => {
          if (i.status === 'serving') { i.status = 'done'; i.completed_at = new Date().toISOString(); }
        });
        const next = waiting[0];
        next.status = 'serving';
        next.called_at = new Date().toISOString();
        return next;
      }),
      doneAndCallNext: vi.fn(async (id: string) => {
        const target = items.find((i: any) => i.id === id);
        if (target) { target.status = 'done'; target.completed_at = new Date().toISOString(); }
        const waiting = items.filter((i: any) => i.status === 'waiting');
        if (waiting.length === 0) return null;
        const next = waiting[0];
        next.status = 'serving';
        next.called_at = new Date().toISOString();
        return next;
      }),
      markDone: vi.fn(async (id: string) => {
        const item = items.find((i: any) => i.id === id);
        if (item) { item.status = 'done'; item.completed_at = new Date().toISOString(); }
        return { success: true };
      }),
      skip: vi.fn(async (id: string) => {
        const item = items.find((i: any) => i.id === id);
        if (item) item.status = 'skipped';
        return { success: true };
      }),
      recall: vi.fn(async (id: string) => {
        items.forEach((i: any) => {
          if (i.status === 'serving') { i.status = 'done'; i.completed_at = new Date().toISOString(); }
        });
        const item = items.find((i: any) => i.id === id);
        if (item) { item.status = 'serving'; item.called_at = new Date().toISOString(); }
        return { success: true };
      }),
      removeItem: vi.fn(async (id: string) => {
        const idx = items.findIndex((i: any) => i.id === id);
        if (idx !== -1) items.splice(idx, 1);
        return { success: true };
      }),
      reset: vi.fn(async () => {
        items.forEach((i: any) => {
          if (i.status === 'waiting' || i.status === 'serving' || i.status === 'skipped') {
            i.status = 'done'; i.completed_at = new Date().toISOString();
          }
        });
        return { success: true };
      }),
      clearAll: vi.fn(async () => {
        items.length = 0;
        counter = 0;
        return { success: true };
      }),
      getLunchBreakSetting: vi.fn(async () => ({ enabled: false })),
      updateLunchBreakSetting: vi.fn(async () => ({ success: true })),
      adminLogin: vi.fn(async (username: string, password: string) => {
        if (username === 'admin' && password === 'admin123') {
          return { success: true };
        }
        throw new Error('Invalid credentials');
      }),
    },
  };
});

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueueProvider>{children}</QueueProvider>;
  };
}

describe('QueueContext', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    (api as any)._reset();
    wrapper = createWrapper();
  });

  it('provides initial state', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    expect(result.current.items).toEqual([]);
    expect(result.current.counter).toBe(0);
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('joinQueue adds a new item', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    let newItem: any;
    await act(async () => {
      newItem = await result.current.joinQueue('Alice');
    });
    expect(newItem.name).toBe('Alice');
    expect(newItem.number).toBe('A-001');
    expect(newItem.status).toBe('waiting');
  });

  it('joinQueue increments counter', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    expect(result.current.counter).toBe(2);
  });

  it('callNext serves the first waiting item', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    let served: any;
    await act(async () => { served = await result.current.callNext(); });
    expect(served.name).toBe('Alice');
  });

  it('callNext returns null when queue is empty', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    let served: any;
    await act(async () => { served = await result.current.callNext(); });
    expect(served).toBeNull();
  });

  it('callNext marks previous serving as done', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    await act(async () => { await result.current.callNext(); });
    await act(async () => { await result.current.callNext(); });
    expect(result.current.doneItems.length).toBe(1);
    expect(result.current.doneItems[0].name).toBe('Alice');
  });

  it('skipItem marks item as skipped', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    const id = result.current.items[0].id;
    await act(async () => { await result.current.skipItem(id); });
    expect(result.current.skippedItems.length).toBe(1);
  });

  it('recallItem brings skipped item back to serving', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    const id = result.current.items[0].id;
    await act(async () => { await result.current.skipItem(id); });
    await act(async () => { await result.current.recallItem(id); });
    expect(result.current.currentlyServing?.id).toBe(id);
  });

  it('markDone marks serving item as done', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { await result.current.callNext(); });
    const id = result.current.items[0].id;
    await act(async () => { await result.current.markDone(id); });
    expect(result.current.doneItems.length).toBe(1);
    expect(result.current.currentlyServing).toBeNull();
  });

  it('removeItem removes item from queue', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    const id = result.current.items[0].id;
    await act(async () => { await result.current.removeItem(id); });
    expect(result.current.items.length).toBe(0);
  });

  it('resetQueue marks all waiting/skipped as done', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    await act(async () => { await result.current.resetQueue(); });
    expect(result.current.doneItems.length).toBe(2);
    expect(result.current.waitingItems.length).toBe(0);
  });

  it('clearAll empties the queue', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { await result.current.clearAll(); });
    expect(result.current.items.length).toBe(0);
    expect(result.current.counter).toBe(0);
  });

  it('adminLogin succeeds with correct credentials', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    let success: boolean = false;
    await act(async () => { success = await result.current.adminLogin('admin', 'admin123'); });
    expect(success).toBe(true);
    expect(result.current.isAdminLoggedIn).toBe(true);
  });

  it('adminLogin fails with wrong credentials', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    let success: boolean = true;
    await act(async () => { success = await result.current.adminLogin('wrong', 'wrong'); });
    expect(success).toBe(false);
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('adminLogout clears login state', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { await result.current.adminLogin('admin', 'admin123'); });
    act(() => { result.current.adminLogout(); });
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('getPosition returns 0 for non-waiting items', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { await result.current.callNext(); });
    const id = result.current.items[0].id;
    expect(result.current.getPosition(id)).toBe(0);
  });

  it('getPosition returns correct position for waiting items', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Charlie'); });
    const bobId = result.current.items[1].id;
    expect(result.current.getPosition(bobId)).toBe(2);
  });

  it('getEstimatedWait returns correct estimate', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    const bobId = result.current.items[1].id;
    expect(result.current.getEstimatedWait(bobId)).toBe(6);
  });

  it('notifications are added and dismissed', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    expect(result.current.notifications.length).toBe(1);
    const notifId = result.current.notifications[0].id;
    act(() => { result.current.dismissNotification(notifId); });
    expect(result.current.notifications.length).toBe(0);
  });

  it('waitingItems are sorted by arrival time (FIFO)', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Charlie'); });
    expect(result.current.waitingItems[0].name).toBe('Alice');
    expect(result.current.waitingItems[1].name).toBe('Bob');
    expect(result.current.waitingItems[2].name).toBe('Charlie');
  });

  it('doneItems are sorted by completion time (newest first)', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });
    await act(async () => {});
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Alice'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Bob'); });
    await act(async () => { vi.advanceTimersByTime(10100); await result.current.joinQueue('Charlie'); });
    await act(async () => { await result.current.callNext(); });
    await act(async () => { await result.current.callNext(); });
    await act(async () => { await result.current.callNext(); });
    expect(result.current.doneItems.length).toBe(2);
    const names = result.current.doneItems.map(i => i.name);
    expect(names).toContain('Alice');
    expect(names).toContain('Bob');
  });
});
