
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueueProvider } from './features/queue/QueueContext';
import { JoinQueuePage } from './features/queue/pages/JoinQueuePage';
import { DisplayScreenPage } from './features/queue/pages/DisplayScreenPage';
import { AdminLoginPage } from './features/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { AdminAnalyticsPage } from './features/admin/pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './features/admin/pages/AdminSettingsPage';

export default function App() {
  return (
    <QueueProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/queue" element={<JoinQueuePage />} />
          <Route path="/display-screen" element={<DisplayScreenPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/" element={<Navigate to="/queue" replace />} />
          <Route path="*" element={<Navigate to="/queue" replace />} />
        </Routes>
      </BrowserRouter>
    </QueueProvider>
  );
}
