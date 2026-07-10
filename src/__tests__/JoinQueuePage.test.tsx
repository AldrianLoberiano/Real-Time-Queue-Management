import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { JoinQueuePage } from '../features/queue/pages/JoinQueuePage';

vi.mock('../api', () => {
  let counter = 0;
  const items: any[] = [];
  return {
    api: {
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
      callNext: vi.fn(async () => null),
      doneAndCallNext: vi.fn(async () => null),
      markDone: vi.fn(async () => ({ success: true })),
      skip: vi.fn(async () => ({ success: true })),
      recall: vi.fn(async () => ({ success: true })),
      removeItem: vi.fn(async () => ({ success: true })),
      reset: vi.fn(async () => ({ success: true })),
      clearAll: vi.fn(async () => {
        items.length = 0;
        counter = 0;
        return { success: true };
      }),
    },
  };
});

function renderJoinPage() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/']}>
        <JoinQueuePage />
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('JoinQueuePage', () => {
  it('renders Join the Queue heading', () => {
    renderJoinPage();
    expect(screen.getByText('Join the Queue')).toBeInTheDocument();
  });

  it('shows input field for name', () => {
    renderJoinPage();
    expect(screen.getByPlaceholderText(/juan dela cruz/i)).toBeInTheDocument();
  });

  it('shows Join Queue button', () => {
    renderJoinPage();
    expect(screen.getByRole('button', { name: /join queue/i })).toBeInTheDocument();
  });

  it('displays stats cards', () => {
    renderJoinPage();
    expect(screen.getAllByText('Waiting').length).toBeGreaterThan(0);
    expect(screen.getByText('Now Serving')).toBeInTheDocument();
  });

  it('join button is disabled when name is empty', () => {
    renderJoinPage();
    const button = screen.getByRole('button', { name: /join queue/i });
    expect(button).toBeDisabled();
  });

  it('can type name in input', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText(/juan dela cruz/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input).toHaveValue('Alice');
  });

  it('can join queue with name', async () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText(/juan dela cruz/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));
    await waitFor(() => {
      expect(screen.getByText("You're in the Queue")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('A-001')).toBeInTheDocument();
    });
  });

  it('shows view display screen button after joining', async () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText(/juan dela cruz/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));
    await waitFor(() => {
      expect(screen.getByText('View Display')).toBeInTheDocument();
    });
  });
});
