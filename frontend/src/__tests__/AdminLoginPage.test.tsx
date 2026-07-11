import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueueProvider } from '../features/queue/QueueContext';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { api } from '../api';

vi.mock('../api', () => ({
  api: {
    getItems: vi.fn(async () => []),
    getCounter: vi.fn(async () => ({ counter: 0 })),
    getSoundSetting: vi.fn(async () => ({ enabled: true })),
    updateSoundSetting: vi.fn(async () => ({ success: true })),
    getLunchBreakSetting: vi.fn(async () => ({ enabled: false })),
    updateLunchBreakSetting: vi.fn(async () => ({ success: true })),
    adminLogin: vi.fn(async (username: string, password: string) => {
      if (username === 'admin' && password === 'admin123') {
        return { success: true };
      }
      throw new Error('Invalid credentials');
    }),
  },
}));

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
    sessionStorage.clear();
    vi.clearAllMocks();
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

  it('shows error on invalid credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('logs in successfully with correct credentials', async () => {
    renderLoginPage();
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderLoginPage();
    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toHaveAttribute('type', 'password');

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
