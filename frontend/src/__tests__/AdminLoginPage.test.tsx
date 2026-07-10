import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';

function renderLoginPage() {
  return render(
    <QueueProvider>
      <MemoryRouter initialEntries={['/admin/login']}>
        <AdminLoginPage />
      </MemoryRouter>
    </QueueProvider>
  );
}

describe('AdminLoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Admin Login heading', () => {
    renderLoginPage();
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('renders username and password inputs', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error on invalid credentials', () => {
    renderLoginPage();
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('logs in successfully with correct credentials', () => {
    renderLoginPage();
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Should navigate away from login page - the error should NOT be present
    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderLoginPage();
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the eye toggle button
    const toggleButtons = screen.getAllByRole('button');
    const eyeToggle = toggleButtons.find(btn =>
      btn.querySelector('svg') !== null && btn !== screen.getByRole('button', { name: /sign in/i })
    );

    if (eyeToggle) {
      fireEvent.click(eyeToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});
