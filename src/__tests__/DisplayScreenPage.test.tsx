import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { DisplayScreenPage } from '../features/queue/pages/DisplayScreenPage';

function renderDisplayPage() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/display']}>
        <DisplayScreenPage />
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('DisplayScreenPage', () => {
  it('renders Queue Display heading', () => {
    renderDisplayPage();
    expect(screen.getByText('Queue Display')).toBeInTheDocument();
  });

  it('shows no one being served message when empty', () => {
    renderDisplayPage();
    expect(screen.getByText('No one being served')).toBeInTheDocument();
  });

  it('shows waiting list section', () => {
    renderDisplayPage();
    expect(screen.getByText(/Waiting/)).toBeInTheDocument();
  });

  it('shows recently served section', () => {
    renderDisplayPage();
    expect(screen.getByText('Recently Served')).toBeInTheDocument();
  });
});
