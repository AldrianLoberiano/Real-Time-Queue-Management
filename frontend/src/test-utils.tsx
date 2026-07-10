import React, { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueueProvider } from './features/queue/QueueContext';

export function renderWithProviders(ui: ReactNode, options?: Parameters<typeof render>[1]) {
  return render(
    <QueueProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueueProvider>,
    options
  );
}

export function renderAdminProviders(ui: ReactNode, options?: Parameters<typeof render>[1]) {
  return render(
    <QueueProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueueProvider>,
    options
  );
}
