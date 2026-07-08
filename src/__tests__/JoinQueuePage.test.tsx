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
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Join Queue heading', () => {
    renderJoinPage();
    expect(screen.getByText('Join the Queue')).toBeInTheDocument();
  });

  it('displays live stats (waiting count)', () => {
    renderJoinPage();
    expect(screen.getByText('Waiting')).toBeInTheDocument();
  });

  it('displays the form with name input', () => {
    renderJoinPage();
    expect(screen.getByPlaceholderText('e.g. Juan dela Cruz')).toBeInTheDocument();
  });

  it('displays priority options', () => {
    renderJoinPage();
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Senior')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('join button is disabled when name is empty', () => {
    renderJoinPage();
    const button = screen.getByRole('button', { name: /join queue/i });
    expect(button).toBeDisabled();
  });

  it('join button is enabled when name is entered', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText('e.g. Juan dela Cruz');
    fireEvent.change(input, { target: { value: 'Test User' } });
    const button = screen.getByRole('button', { name: /join queue/i });
    expect(button).not.toBeDisabled();
  });

  it('shows confirmation screen after joining queue', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText('e.g. Juan dela Cruz');
    fireEvent.change(input, { target: { value: 'Test User' } });
    const button = screen.getByRole('button', { name: /join queue/i });
    fireEvent.click(button);

    expect(screen.getByText("You're in the Queue!")).toBeInTheDocument();
    expect(screen.getByText('Your Number')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Est. Wait')).toBeInTheDocument();
  });

  it('can select VIP priority and join', () => {
    renderJoinPage();
    const vipButton = screen.getByText('VIP').closest('button')!;
    fireEvent.click(vipButton);

    const input = screen.getByPlaceholderText('e.g. Juan dela Cruz');
    fireEvent.change(input, { target: { value: 'VIP User' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));

    expect(screen.getByText("You're in the Queue!")).toBeInTheDocument();
  });

  it('displays View Display Screen button after joining', () => {
    renderJoinPage();
    const input = screen.getByPlaceholderText('e.g. Juan dela Cruz');
    fireEvent.change(input, { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /join queue/i }));

    expect(screen.getByText('View Display Screen')).toBeInTheDocument();
  });
});
