import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueueProvider } from './features/queue/QueueContext';
import { JoinQueuePage } from './features/queue/pages/JoinQueuePage';
import { DisplayScreenPage } from './features/queue/pages/DisplayScreenPage';
import { AdminLoginPage } from './features/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { AdminAnalyticsPage } from './features/admin/pages/AdminAnalyticsPage';

export default function App() {
  return (
    <QueueProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JoinQueuePage />} />
          <Route path="/display" element={<DisplayScreenPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueueProvider>
  );
}
