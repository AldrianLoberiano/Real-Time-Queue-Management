import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { Layout } from '../features/queue/components/Layout';

function renderLayout(pathname = '/') {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('Layout', () => {
  it('renders QueueSmart logo', () => {
    renderLayout();
    expect(screen.getByText('QueueSmart')).toBeInTheDocument();
  });

  it('renders Display nav link', () => {
    renderLayout();
    expect(screen.getByText('Display')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderLayout();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows waiting count', () => {
    renderLayout();
    expect(screen.getByText(/waiting/)).toBeInTheDocument();
  });

  it('shows serving status', () => {
    renderLayout();
    expect(screen.getByText(/serving/)).toBeInTheDocument();
  });
});
