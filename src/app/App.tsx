import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QueueProvider } from './context/QueueContext';

export default function App() {
  return (
    <QueueProvider>
      <RouterProvider router={router} />
    </QueueProvider>
