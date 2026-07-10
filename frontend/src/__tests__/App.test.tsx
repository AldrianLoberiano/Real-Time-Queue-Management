import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual };
});

describe('App routing', () => {
  it('renders JoinQueuePage on /queue', () => {
    render(<App />);
    expect(screen.getByText('Join the Queue')).toBeInTheDocument();
  });
});
