import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { AdminAnalyticsPage } from '../features/admin/pages/AdminAnalyticsPage';

beforeAll(() => {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as any).ResizeObserver = MockResizeObserver;
});

function renderAnalytics() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/admin/analytics']}>
        <AdminAnalyticsPage />
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('AdminAnalyticsPage', () => {
  it('renders metric cards', () => {
    renderAnalytics();
    expect(screen.getByText('Served Today')).toBeInTheDocument();
    expect(screen.getByText(/Avg\. Wait Time/)).toBeInTheDocument();
    expect(screen.getAllByText('Efficiency').length).toBeGreaterThan(0);
    expect(screen.getByText('Peak Hour')).toBeInTheDocument();
  });

  it('renders chart sections', () => {
    renderAnalytics();
    expect(screen.getByText('Hourly Traffic')).toBeInTheDocument();
    expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
    expect(screen.getByText('Wait Time Distribution')).toBeInTheDocument();
  });

  it('renders summary section', () => {
    renderAnalytics();
    expect(screen.getByText("Today's Summary")).toBeInTheDocument();
    expect(screen.getAllByText('Still Waiting').length).toBeGreaterThan(0);
  });
});
