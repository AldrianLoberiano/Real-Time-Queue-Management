import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { Layout } from '../features/queue/components/Layout';

function renderLayout() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('Layout', () => {
  it('renders brand name', () => {
    renderLayout();
    expect(screen.getByText('QueueSmart')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderLayout();
    expect(screen.getByText('Join Queue')).toBeInTheDocument();
    expect(screen.getByText('Display Screen')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderLayout();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderLayout();
    expect(screen.getByText(/2026 QueueSmart/)).toBeInTheDocument();
  });

  it('shows waiting count in header', () => {
    renderLayout();
    expect(screen.getByText(/waiting/)).toBeInTheDocument();
  });
});
