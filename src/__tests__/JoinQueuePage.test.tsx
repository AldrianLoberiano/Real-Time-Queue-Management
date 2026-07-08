import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { JoinQueuePage } from '../features/queue/pages/JoinQueuePage';

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

  it('can join queue with name', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText(/juan dela cruz/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));
    expect(screen.getByText("You're in the Queue")).toBeInTheDocument();
    expect(screen.getByText('A-001')).toBeInTheDocument();
    expect(screen.getByText(/#\d+/)).toBeInTheDocument();
  });

  it('shows view display screen button after joining', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText(/juan dela cruz/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));
    expect(screen.getByText('View Display')).toBeInTheDocument();
  });
});
