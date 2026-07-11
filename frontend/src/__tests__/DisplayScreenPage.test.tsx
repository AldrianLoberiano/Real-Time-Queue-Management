import { describe, it, expect, beforeEach } from 'vitest';
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
  it('renders Now Serving heading', () => {
    renderDisplayPage();
    expect(screen.getByText('Now Serving')).toBeInTheDocument();
  });

  it('shows no one being served message when empty', () => {
    renderDisplayPage();
    expect(screen.getByText('No one being served')).toBeInTheDocument();
  });

  it('shows waiting list section', () => {
    renderDisplayPage();
    expect(screen.getAllByText(/Waiting/).length).toBeGreaterThan(0);
  });

  it('shows announcement section', () => {
    renderDisplayPage();
    expect(screen.getByText('Announcement')).toBeInTheDocument();
  });
});
