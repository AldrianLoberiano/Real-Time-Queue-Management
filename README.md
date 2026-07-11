# BPLO Queue - Real-Time Queue Management

A real-time queue management system for the Business Permit & Licensing Office (BPLO) — Municipality of Calauan, Laguna. Built with React 18, TypeScript, Vite, Tailwind CSS, Express, and MySQL.

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8+

### Setup

```bash
npm install
```

Create the database and tables:

```bash
npm run db:setup
```

Configure the database connection in `backend/server/index.ts` if needed (default: root, no password, port 3306).

### Run

```bash
npm run dev:all        # Start frontend + backend together
```

Or separately:

```bash
npm run dev            # Frontend only (http://localhost:5173)
npm run dev:server     # Backend only (http://localhost:3001)
```

### Access from Mobile/Tablet

Both servers listen on `0.0.0.0`, so you can access from any device on the same network.

1. Find your computer's local IP address:
   ```bash
   ipconfig    # Windows
   ifconfig    # macOS/Linux
   ```
2. Open in your mobile browser:
   - **Frontend:** `http://<your-ip>:5173`
   - **Backend API:** `http://<your-ip>:3001`

> Make sure your firewall allows connections on ports 5173 and 3001.

## Features

- Real-time queue management with MySQL persistence (2-second polling)
- 5-second cooldown between customer joins
- Queue limit (15 customers) with warning banner and popup alert
- Call Next, Done & Call Next, Skip, Recall, Remove from Queue
- Sound notifications on serve (toggleable via Admin Settings)
- Lunch break mode (pauses queue, shows amber banner on display)
- BPLO logo branding throughout
- Queue display screen for customers with announcement ticker
- Admin dashboard with queue management
- Admin settings page for sound and lunch break configuration
- Analytics page with hourly traffic, weekly overview, and wait time charts
- Responsive design (mobile + desktop)
- Custom styled popup confirmation alerts
- Toast notifications for real-time feedback

## Project Structure

```
├── package.json                         Root scripts
├── frontend/
│   ├── index.html                       Entry HTML
│   ├── vite.config.ts                   Vite config
│   ├── vitest.config.ts                 Test config
│   ├── public/
│   │   ├── bplo-logo.png                BPLO logo
│   │   └── header-bg.png                Header background
│   └── src/
│       ├── main.tsx                     Entry point
│       ├── index.css                    Tailwind CSS
│       ├── App.tsx                      Routes
│       ├── api.ts                       Backend API client
│       ├── features/
│       │   ├── queue/
│       │   │   ├── QueueContext.tsx      State management + API calls
│       │   │   ├── components/
│       │   │   │   ├── Layout.tsx       Public header layout
│       │   │   │   ├── ClientLayout.tsx Client sidebar layout
│       │   │   │   └── StatusBadge.tsx  Status badge component
│       │   │   └── pages/
│       │   │       ├── JoinQueuePage.tsx       Client join queue form
│       │   │       └── DisplayScreenPage.tsx   Public display screen
│       │   └── admin/
│       │       ├── components/
│       │       │   ├── AdminLayout.tsx    Admin sidebar + header
│       │       │   └── ConfirmModal.tsx   Reusable popup modal
│       │       └── pages/
│       │           ├── AdminLoginPage.tsx      Admin login page
│       │           ├── AdminDashboardPage.tsx  Admin dashboard
│       │           ├── AdminAnalyticsPage.tsx  Analytics page
│       │           └── AdminSettingsPage.tsx   Settings page
│       └── __tests__/                   Test files (80 tests)
└── backend/
    └── server/
        ├── index.ts                     Server entry point
        ├── app.ts                       Express app + all routes
        ├── schema.sql                   Database schema
        └── __tests__/
            └── api.test.ts              API tests
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | Frontend UI |
| TypeScript | 5.7.3 | Type safety |
| Vite | 6.4.3 | Build tool |
| Tailwind CSS | 4.1.12 | Styling |
| React Router | v7 | Routing |
| Recharts | 2.15.2 | Analytics charts |
| Framer Motion | 12.23.24 | UI animations |
| Lucide React | 0.487.0 | Icon library |
| Express | 5.2.1 | REST API server |
| MySQL | 8 | Persistent storage |
| mysql2 | 3.22.6 | Node.js MySQL client |
| Vitest | 4.1.10 | Test framework |
| concurrently | 10.0.3 | Run frontend + backend |

## Scripts

```bash
npm run dev            # Start frontend dev server (port 5173)
npm run dev:server     # Start backend server (port 3001)
npm run dev:all        # Start frontend + backend together
npm run build          # Build frontend for production
npm run test           # Run frontend tests
npm run test:watch     # Run frontend tests in watch mode
npm run test:api       # Run backend API tests
npm run db:setup       # Create MySQL database and tables
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/items | Get all queue items |
| GET | /api/counter | Get current queue counter |
| POST | /api/join | Join the queue |
| POST | /api/call-next | Call next customer |
| POST | /api/done-and-call-next | Mark done + call next |
| POST | /api/mark-done | Mark customer as done |
| POST | /api/skip | Skip a customer |
| POST | /api/recall | Recall a skipped customer |
| DELETE | /api/items/:id | Remove from queue |
| POST | /api/reset | Reset queue (mark all as done) |
| POST | /api/clear | Clear all queue data |
| GET | /api/settings/sound | Get sound setting |
| PUT | /api/settings/sound | Update sound setting |
| GET | /api/settings/lunch-break | Get lunch break setting |
| PUT | /api/settings/lunch-break | Update lunch break setting |
| POST | /api/admin/login | Admin authentication |

## Database Schema

- **queue_items** — id, number, name, status (waiting/serving/skipped/done), timestamps
- **queue_counter** — Current queue number counter
- **settings** — Key-value store for sound, lunch break, and other config

## License

Develop for The BPLO Municipality of Calauan, Laguna. All rights reserved.
