import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge, PriorityDot } from '../features/queue/components/PriorityBadge';

describe('PriorityBadge', () => {
  it('renders VIP badge with correct label', () => {
    render(<PriorityBadge type="vip" />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('renders Senior badge with correct label', () => {
    render(<PriorityBadge type="senior" />);
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });

  it('renders Regular badge with correct label', () => {
    render(<PriorityBadge type="regular" />);
    expect(screen.getByText('Regular')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    render(<PriorityBadge type="vip" size="sm" />);
    const badge = screen.getByText('VIP');
    expect(badge.className).toContain('text-[11px]');
  });

  it('applies lg size classes', () => {
    render(<PriorityBadge type="vip" size="lg" />);
    const badge = screen.getByText('VIP');
    expect(badge.className).toContain('text-sm');
  });
});

describe('PriorityDot', () => {
  it('renders with correct title attribute', () => {
    render(<PriorityDot type="vip" />);
    const dot = screen.getByTitle('VIP');
    expect(dot).toBeInTheDocument();
  });

  it('renders senior dot with title', () => {
    render(<PriorityDot type="senior" />);
    expect(screen.getByTitle('Senior')).toBeInTheDocument();
  });

  it('renders regular dot with title', () => {
    render(<PriorityDot type="regular" />);
    expect(screen.getByTitle('Regular')).toBeInTheDocument();
  });
});
