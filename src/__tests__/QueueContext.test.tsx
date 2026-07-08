import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { QueueProvider, useQueue } from '../features/queue/QueueContext';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueueProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </QueueProvider>
  );
}

describe('QueueContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial queue state with seed data', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    expect(result.current.items.length).toBe(9);
    expect(result.current.waitingItems.length).toBe(2);
    expect(result.current.doneItems.length).toBe(6);
    expect(result.current.currentlyServing).not.toBeNull();
    expect(result.current.currentlyServing?.status).toBe('serving');
    expect(result.current.totalServedToday).toBe(6);
  });

  it('joinQueue adds a new waiting item with correct properties', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let newItem: any;
    act(() => {
      newItem = result.current.joinQueue('Test User', 'vip');
    });

    expect(newItem.name).toBe('Test User');
    expect(newItem.type).toBe('vip');
    expect(newItem.status).toBe('waiting');
    expect(newItem.number).toMatch(/^A-\d{3}$/);
    expect(result.current.waitingItems.length).toBe(3);
  });

  it('joinQueue increments counter', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const initialCounter = result.current.counter;
    act(() => {
      result.current.joinQueue('User 1', 'regular');
    });

    expect(result.current.counter).toBe(initialCounter + 1);
  });

  it('callNext moves the highest priority waiting item to serving', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.callNext();
    });

    const serving = result.current.currentlyServing;
    expect(serving).not.toBeNull();
    expect(serving?.status).toBe('serving');
  });

  it('callNext marks previously serving item as done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const firstServing = result.current.currentlyServing;
    expect(firstServing).not.toBeNull();

    act(() => {
      result.current.callNext();
    });

    expect(result.current.doneItems.find(i => i.id === firstServing!.id)).toBeDefined();
  });

  it('callNext returns null when no waiting items', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.clearAll();
    });

    let returned: any;
    act(() => {
      returned = result.current.callNext();
    });

    expect(returned).toBeNull();
  });

  it('skipItem changes status to skipped', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    act(() => {
      result.current.skipItem(waitingItem.id);
    });

    const skipped = result.current.skippedItems.find(i => i.id === waitingItem.id);
    expect(skipped).toBeDefined();
    expect(skipped?.status).toBe('skipped');
  });

  it('recallItem changes an item to serving', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    act(() => {
      result.current.skipItem(waitingItem.id);
    });

    act(() => {
      result.current.recallItem(waitingItem.id);
    });

    const recalled = result.current.items.find(i => i.id === waitingItem.id);
    expect(recalled?.status).toBe('serving');
    expect(recalled?.calledAt).toBeDefined();
  });

  it('markDone sets completedAt and status to done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const serving = result.current.currentlyServing;
    expect(serving).not.toBeNull();

    act(() => {
      result.current.markDone(serving!.id);
    });

    const marked = result.current.doneItems.find(i => i.id === serving!.id);
    expect(marked).toBeDefined();
    expect(marked?.status).toBe('done');
    expect(marked?.completedAt).toBeDefined();
  });

  it('removeItem removes the item from queue entirely', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    act(() => {
      result.current.removeItem(waitingItem.id);
    });

    expect(result.current.items.find(i => i.id === waitingItem.id)).toBeUndefined();
  });

  it('resetQueue marks all waiting/serving/skipped as done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.resetQueue();
    });

    expect(result.current.waitingItems.length).toBe(0);
    expect(result.current.skippedItems.length).toBe(0);
    expect(result.current.currentlyServing).toBeNull();
  });

  it('clearAll removes all items and resets counter', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.counter).toBe(0);
  });

  it('updatePriority changes item priority type', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    const originalType = waitingItem.type;
    const newType = originalType === 'vip' ? 'regular' : 'vip';

    act(() => {
      result.current.updatePriority(waitingItem.id, newType);
    });

    const updated = result.current.items.find(i => i.id === waitingItem.id);
    expect(updated?.type).toBe(newType);
  });

  it('adminLogin returns true for correct credentials', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let loginResult: boolean;
    act(() => {
      loginResult = result.current.adminLogin('admin', 'admin123');
    });

    expect(loginResult!).toBe(true);
    expect(result.current.isAdminLoggedIn).toBe(true);
  });

  it('adminLogin returns false for wrong credentials', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let loginResult: boolean;
    act(() => {
      loginResult = result.current.adminLogin('wrong', 'wrong');
    });

    expect(loginResult!).toBe(false);
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('adminLogout sets isAdminLoggedIn to false', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.adminLogin('admin', 'admin123');
    });
    expect(result.current.isAdminLoggedIn).toBe(true);

    act(() => {
      result.current.adminLogout();
    });
    expect(result.current.isAdminLoggedIn).toBe(false);
  });

  it('getPosition returns correct position for waiting items', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    const pos = result.current.getPosition(waitingItem.id);
    expect(pos).toBeGreaterThan(0);
  });

  it('getPosition returns 0 for non-waiting items', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const serving = result.current.currentlyServing;
    expect(serving).not.toBeNull();

    const pos = result.current.getPosition(serving!.id);
    expect(pos).toBe(0);
  });

  it('getEstimatedWait returns position * 3 minutes', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waitingItem = result.current.waitingItems[0];
    const pos = result.current.getPosition(waitingItem.id);
    const wait = result.current.getEstimatedWait(waitingItem.id);

    expect(wait).toBe(pos * 3);
  });

  it('waitingItems are sorted by priority then FIFO', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    const waiting = result.current.waitingItems;
    for (let i = 0; i < waiting.length - 1; i++) {
      const priorityOrder: Record<string, number> = { vip: 3, senior: 2, regular: 1 };
      const currentP = priorityOrder[waiting[i].type];
      const nextP = priorityOrder[waiting[i + 1].type];
      expect(currentP).toBeGreaterThanOrEqual(nextP);
    }
  });

  it('notifications are created and can be dismissed', async () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.joinQueue('Notif Test', 'regular');
    });

    expect(result.current.notifications.length).toBeGreaterThan(0);

    const notifId = result.current.notifications[0].id;
    act(() => {
      result.current.dismissNotification(notifId);
    });

    expect(result.current.notifications.find(n => n.id === notifId)).toBeUndefined();
  });
});
