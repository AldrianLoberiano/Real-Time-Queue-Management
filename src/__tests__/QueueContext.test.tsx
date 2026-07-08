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

  it('provides empty initial state', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    expect(result.current.items.length).toBe(0);
    expect(result.current.waitingItems.length).toBe(0);
    expect(result.current.doneItems.length).toBe(0);
    expect(result.current.currentlyServing).toBeNull();
    expect(result.current.totalServedToday).toBe(0);
  });

  it('joinQueue adds a new waiting item', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let newItem: any;
    act(() => {
      newItem = result.current.joinQueue('Test User', 'vip');
    });

    expect(newItem.name).toBe('Test User');
    expect(newItem.type).toBe('vip');
    expect(newItem.status).toBe('waiting');
    expect(newItem.number).toMatch(/^A-\d{3}$/);
    expect(result.current.waitingItems.length).toBe(1);
  });

  it('joinQueue increments counter', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    expect(result.current.counter).toBe(0);
    act(() => {
      result.current.joinQueue('User 1', 'regular');
    });
    expect(result.current.counter).toBe(1);

    act(() => {
      result.current.joinQueue('User 2', 'regular');
    });
    expect(result.current.counter).toBe(2);
  });

  it('callNext moves the waiting item to serving', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Next User', 'regular');
    });

    act(() => {
      result.current.callNext();
    });

    expect(result.current.currentlyServing?.id).toBe(joined.id);
    expect(result.current.currentlyServing?.status).toBe('serving');
    expect(result.current.waitingItems.length).toBe(0);
  });

  it('callNext returns null when no waiting items', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let returned: any;
    act(() => {
      returned = result.current.callNext();
    });

    expect(returned).toBeNull();
  });

  it('callNext marks previously serving item as done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.joinQueue('User A', 'regular');
    });
    act(() => {
      result.current.callNext();
    });

    const firstServing = result.current.currentlyServing;
    expect(firstServing).not.toBeNull();

    act(() => {
      result.current.joinQueue('User B', 'regular');
    });
    act(() => {
      result.current.callNext();
    });

    expect(result.current.doneItems.find(i => i.id === firstServing!.id)).toBeDefined();
  });

  it('skipItem changes status to skipped', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Skip Me', 'regular');
    });

    act(() => {
      result.current.skipItem(joined.id);
    });

    const skipped = result.current.skippedItems.find(i => i.id === joined.id);
    expect(skipped).toBeDefined();
    expect(skipped?.status).toBe('skipped');
  });

  it('recallItem changes an item to serving', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Recall Me', 'vip');
    });

    act(() => {
      result.current.skipItem(joined.id);
    });

    act(() => {
      result.current.recallItem(joined.id);
    });

    const recalled = result.current.items.find(i => i.id === joined.id);
    expect(recalled?.status).toBe('serving');
    expect(recalled?.calledAt).toBeDefined();
  });

  it('markDone sets completedAt and status to done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Done User', 'regular');
    });

    act(() => {
      result.current.callNext();
    });

    act(() => {
      result.current.markDone(joined.id);
    });

    const marked = result.current.doneItems.find(i => i.id === joined.id);
    expect(marked).toBeDefined();
    expect(marked?.status).toBe('done');
    expect(marked?.completedAt).toBeDefined();
  });

  it('removeItem removes the item from queue entirely', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Remove Me', 'regular');
    });

    act(() => {
      result.current.removeItem(joined.id);
    });

    expect(result.current.items.find(i => i.id === joined.id)).toBeUndefined();
    expect(result.current.items.length).toBe(0);
  });

  it('resetQueue marks all waiting/serving/skipped as done', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.joinQueue('User 1', 'regular');
    });
    act(() => {
      result.current.joinQueue('User 2', 'vip');
    });
    act(() => {
      result.current.callNext();
    });

    expect(result.current.waitingItems.length).toBe(1);
    expect(result.current.currentlyServing).not.toBeNull();

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
      result.current.joinQueue('User 1', 'regular');
    });
    act(() => {
      result.current.joinQueue('User 2', 'regular');
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.counter).toBe(0);
  });

  it('updatePriority changes item priority type', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Priority User', 'regular');
    });

    act(() => {
      result.current.updatePriority(joined.id, 'vip');
    });

    const updated = result.current.items.find(i => i.id === joined.id);
    expect(updated?.type).toBe('vip');
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

    act(() => {
      result.current.joinQueue('First', 'regular');
    });
    act(() => {
      result.current.joinQueue('Second', 'vip');
    });

    const waiting = result.current.waitingItems;
    const firstPos = result.current.getPosition(waiting[0].id);
    const secondPos = result.current.getPosition(waiting[1].id);

    expect(firstPos).toBe(1);
    expect(secondPos).toBe(2);
  });

  it('getPosition returns 0 for non-waiting items', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    let joined: any;
    act(() => {
      joined = result.current.joinQueue('Serve Me', 'regular');
    });

    act(() => {
      result.current.callNext();
    });

    const pos = result.current.getPosition(joined.id);
    expect(pos).toBe(0);
  });

  it('getEstimatedWait returns position * 3 minutes', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.joinQueue('Wait User', 'regular');
    });

    const waitingItem = result.current.waitingItems[0];
    const pos = result.current.getPosition(waitingItem.id);
    const wait = result.current.getEstimatedWait(waitingItem.id);

    expect(wait).toBe(pos * 3);
  });

  it('waitingItems are sorted by priority then FIFO', () => {
    const { result } = renderHook(() => useQueue(), { wrapper });

    act(() => {
      result.current.joinQueue('Regular1', 'regular');
    });
    act(() => {
      result.current.joinQueue('VIP1', 'vip');
    });
    act(() => {
      result.current.joinQueue('Senior1', 'senior');
    });

    const waiting = result.current.waitingItems;
    const priorityOrder: Record<string, number> = { vip: 3, senior: 2, regular: 1 };

    for (let i = 0; i < waiting.length - 1; i++) {
      expect(priorityOrder[waiting[i].type]).toBeGreaterThanOrEqual(priorityOrder[waiting[i + 1].type]);
    }
  });

  it('notifications are created and can be dismissed', () => {
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
