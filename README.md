# QueueSmart - Real-Time Queue Management

A real-time queue management system built with React 18, TypeScript, Vite, and Tailwind CSS. Features cross-tab sync, auto-reset, and a polished admin/client interface.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Features

- Real-time queue management with live updates
- Cross-tab synchronization via localStorage + BroadcastChannel
- Auto-reset daily at 8:00 AM
- Inactivity reset after 24 hours
- Responsive design (mobile + desktop)
- Styled popup confirmation alerts
- Queue display screen for customers

## Project Structure

```
src/
  main.tsx                              Entry point
  index.css                             Tailwind CSS
  App.tsx                               Routes
  features/
    queue/
      QueueContext.tsx                   State management + localStorage sync
      components/
        Layout.tsx                      Public header layout
        ClientLayout.tsx                Client sidebar layout
        StatusBadge.tsx                 Status badge component
      pages/
        JoinQueuePage.tsx               Client join queue form
        DisplayScreenPage.tsx           Public display screen
    admin/
      components/
        AdminLayout.tsx                 Admin sidebar + header
        ConfirmModal.tsx                Reusable popup modal
      pages/
        AdminLoginPage.tsx              Admin login page
        AdminDashboardPage.tsx          Admin dashboard
        AdminAnalyticsPage.tsx          Analytics page
  __tests__/                            Test files (59 tests)
```

## Tech Stack

| Technology | Version |
|------------|---------|
| React | 18 |
| TypeScript | 5.7.3 |
| Vite | 6.4.3 |
| Tailwind CSS | 4.1.12 |
| React Router | v7 |
| Recharts | Charts |
| Framer Motion | Animations |
| Lucide React | Icons |

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run linter
```

## Data Persistence

- Queue state saved to `localStorage` on every change
- Cross-tab sync via `BroadcastChannel` + 500ms polling fallback
- Daily reset at 8:00 AM
- Inactivity reset after 24 hours

## License

MIT
