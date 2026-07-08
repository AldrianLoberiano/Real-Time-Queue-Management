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

  it('shows currently serving item', () => {
    renderDisplayPage();
    // The seed data has one serving item (Elena Torres, A-007)
    expect(screen.getByText('Now Serving')).toBeInTheDocument();
    expect(screen.getByText('A-007')).toBeInTheDocument();
  });

  it('shows waiting list with count', () => {
    renderDisplayPage();
    expect(screen.getByText(/Waiting/)).toBeInTheDocument();
  });

  it('shows recently served section', () => {
    renderDisplayPage();
    expect(screen.getByText('Recently Served')).toBeInTheDocument();
  });
});
