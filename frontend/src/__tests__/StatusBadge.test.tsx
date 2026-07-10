import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../features/queue/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders Waiting badge', () => {
    render(<StatusBadge status="waiting" />);
    expect(screen.getByText('Waiting')).toBeInTheDocument();
  });

  it('renders Serving badge', () => {
    render(<StatusBadge status="serving" />);
    expect(screen.getByText('Serving')).toBeInTheDocument();
  });

  it('renders Done badge', () => {
    render(<StatusBadge status="done" />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders Skipped badge', () => {
    render(<StatusBadge status="skipped" />);
    expect(screen.getByText('Skipped')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    render(<StatusBadge status="waiting" size="sm" />);
    const badge = screen.getByText('Waiting');
    expect(badge.className).toContain('text-[11px]');
  });

  it('applies default md size classes', () => {
    render(<StatusBadge status="waiting" />);
    const badge = screen.getByText('Waiting');
    expect(badge.className).toContain('text-xs');
  });
});
