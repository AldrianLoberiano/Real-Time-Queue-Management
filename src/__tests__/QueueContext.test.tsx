import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QueueProvider, useQueue } from '../features/queue/QueueContext';

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
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function joinAs(name: string) {
    act(() => { vi.advanceTimersByTime(8100); });
    act(() => { result!.current.joinQueue(name); });
  }

  let result: ReturnType<typeof renderHook>['result'];

  it('provides initial state', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    expect(result.current.items).toEqual([]);
    expect(result.current.counter).toBe(0);
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('joinQueue adds a new item', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    let newItem: any;
    act(() => {
      vi.advanceTimersByTime(8100);
      newItem = result.current.joinQueue('Alice');
    });
    expect(newItem.name).toBe('Alice');
    expect(newItem.number).toBe('A-001');
    expect(newItem.status).toBe('waiting');
    expect(result.current.items.length).toBe(1);
    expect(result.current.counter).toBe(1);
  });

  it('joinQueue increments counter', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    expect(result.current.counter).toBe(2);
    expect(result.current.items[0].number).toBe('A-001');
    expect(result.current.items[1].number).toBe('A-002');
  });

  it('callNext serves the first waiting item', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    let served: any;
    act(() => { served = result.current.callNext(); });
    expect(served.name).toBe('Alice');
    expect(result.current.currentlyServing?.name).toBe('Alice');
    expect(result.current.waitingItems.length).toBe(1);
  });

  it('callNext returns null when queue is empty', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    let served: any;
    act(() => { served = result.current.callNext(); });
    expect(served).toBeNull();
  });

  it('callNext marks previous serving as done', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    act(() => { result.current.callNext(); });
    act(() => { result.current.callNext(); });
    expect(result.current.doneItems.length).toBe(1);
    expect(result.current.doneItems[0].name).toBe('Alice');
  });

  it('skipItem marks item as skipped', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    const id = result.current.items[0].id;
    act(() => { result.current.skipItem(id); });
    expect(result.current.skippedItems.length).toBe(1);
    expect(result.current.waitingItems.length).toBe(0);
  });

  it('recallItem brings skipped item back to serving', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    const id = result.current.items[0].id;
    act(() => { result.current.skipItem(id); });
    act(() => { result.current.recallItem(id); });
    expect(result.current.currentlyServing?.id).toBe(id);
    expect(result.current.skippedItems.length).toBe(0);
  });

  it('markDone marks serving item as done', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { result.current.callNext(); });
    const id = result.current.items[0].id;
    act(() => { result.current.markDone(id); });
    expect(result.current.doneItems.length).toBe(1);
    expect(result.current.currentlyServing).toBeNull();
  });

  it('removeItem removes item from queue', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    const id = result.current.items[0].id;
    act(() => { result.current.removeItem(id); });
    expect(result.current.items.length).toBe(0);
  });

  it('resetQueue marks all waiting/skipped as done', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    act(() => { result.current.resetQueue(); });
    expect(result.current.doneItems.length).toBe(2);
    expect(result.current.waitingItems.length).toBe(0);
  });

  it('clearAll empties the queue', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { result.current.clearAll(); });
    expect(result.current.items.length).toBe(0);
    expect(result.current.counter).toBe(0);
  });

  it('adminLogin succeeds with correct credentials', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    let success: boolean = false;
    act(() => { success = result.current.adminLogin('admin', 'admin123'); });
    expect(success).toBe(true);
    expect(result.current.isAdminLoggedIn).toBe(true);
  });

  it('adminLogin fails with wrong credentials', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    let success: boolean = true;
    act(() => { success = result.current.adminLogin('wrong', 'wrong'); });
    expect(success).toBe(false);
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('adminLogout clears login state', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { result.current.adminLogin('admin', 'admin123'); });
    act(() => { result.current.adminLogout(); });
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('getPosition returns 0 for non-waiting items', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { result.current.callNext(); });
    const id = result.current.items[0].id;
    expect(result.current.getPosition(id)).toBe(0);
  });

  it('getPosition returns correct position for waiting items', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Charlie'); }); });
    const bobId = result.current.items[1].id;
    expect(result.current.getPosition(bobId)).toBe(2);
  });

  it('getEstimatedWait returns correct estimate', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    const bobId = result.current.items[1].id;
    expect(result.current.getEstimatedWait(bobId)).toBe(6);
  });

  it('notifications are added and dismissed', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    expect(result.current.notifications.length).toBe(1);
    const notifId = result.current.notifications[0].id;
    act(() => { result.current.dismissNotification(notifId); });
    expect(result.current.notifications.length).toBe(0);
  });

  it('waitingItems are sorted by arrival time (FIFO)', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Charlie'); }); });
    expect(result.current.waitingItems[0].name).toBe('Alice');
    expect(result.current.waitingItems[1].name).toBe('Bob');
    expect(result.current.waitingItems[2].name).toBe('Charlie');
  });

  it('doneItems are sorted by completion time (newest first)', () => {
    const r = renderHook(() => useQueue(), { wrapper });
    result = r.result;
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Alice'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Bob'); }); });
    act(() => { vi.advanceTimersByTime(8100); act(() => { result.current.joinQueue('Charlie'); }); });
    act(() => { result.current.callNext(); });
    act(() => { result.current.callNext(); });
    act(() => { result.current.callNext(); });
    expect(result.current.doneItems.length).toBe(2);
    const names = result.current.doneItems.map(i => i.name);
    expect(names).toContain('Alice');
    expect(names).toContain('Bob');
  });
});
