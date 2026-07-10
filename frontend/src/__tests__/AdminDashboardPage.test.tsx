import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';

function renderDashboard() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/admin']}>
        <AdminDashboardPage />
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('AdminDashboardPage', () => {
  it('renders stat cards', () => {
    renderDashboard();
    expect(screen.getAllByText('Waiting').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Serving').length).toBeGreaterThan(0);
    expect(screen.getByText('Served')).toBeInTheDocument();
    expect(screen.getByText(/Avg\. Time/)).toBeInTheDocument();
  });

  it('renders Currently Serving section', () => {
    renderDashboard();
    expect(screen.getByText('Currently Serving')).toBeInTheDocument();
  });

  it('renders Queue List section', () => {
    renderDashboard();
    expect(screen.getByText('Queue List')).toBeInTheDocument();
  });

  it('renders filter buttons with correct labels', () => {
    renderDashboard();
    const filterButtons = screen.getAllByRole('button');
    const filterLabels = ['all', 'waiting', 'done', 'skipped'];
    filterLabels.forEach(label => {
      const found = filterButtons.some(btn =>
        btn.textContent?.trim().toLowerCase() === label
      );
      expect(found).toBe(true);
    });
  });

  it('renders Reset and Clear All buttons', () => {
    renderDashboard();
    expect(screen.getByText('Reset Queue')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });
});
