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
  it('renders BPLO Queue logo', () => {
    renderLayout();
    expect(screen.getByText('BPLO Queue')).toBeInTheDocument();
  });

  it('renders Display nav link', () => {
    renderLayout();
    expect(screen.getByText('Display')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderLayout();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders display link', () => {
    renderLayout();
    expect(screen.getByText('Display')).toBeInTheDocument();
  });
});
