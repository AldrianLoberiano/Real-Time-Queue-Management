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

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Features

- Real-time queue management with MySQL persistence
- 5-second cooldown between customer joins
- Queue limit (15 customers) with warning banner and popup alert
- Call Next, Done & Call Next, Skip, Recall, Remove from Queue
- Sound notifications on serve (toggleable)
- BPLO logo branding throughout
- Queue display screen for customers
- Admin dashboard with queue management
- Analytics page with charts
- Responsive design (mobile + desktop)
- Custom styled popup confirmation alerts

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
│       ├── components/
│       │   └── BploLogo.tsx             Inline SVG logo component
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
│       │           └── AdminAnalyticsPage.tsx  Analytics page
│       └── __tests__/                   Test files (59 tests)
└── backend/
    └── server/
        ├── index.ts                     Express server + MySQL routes
        └── schema.sql                   Database schema
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | Frontend UI |
| TypeScript | 5.7.3 | Type safety |
| Vite | 6.4.3 | Build tool |
| Tailwind CSS | 4.1.12 | Styling |
| React Router | v7 | Routing |
| Recharts | Charts | Analytics charts |
| Framer Motion | Animations | UI animations |
| Lucide React | Icons | Icon library |
| Express | Backend | REST API server |
| MySQL | Database | Persistent storage |
| mysql2 | MySQL driver | Node.js MySQL client |
| concurrently | Runner | Run frontend + backend |

## Scripts

```bash
npm run dev            # Start frontend dev server
npm run dev:server     # Start backend server
npm run dev:all        # Start frontend + backend together
npm run build          # Build frontend for production
npm run preview        # Preview production build
npm run test           # Run tests
npm run lint           # Run linter
npm run db:setup       # Create MySQL database and tables
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/queue | Get all queue items |
| POST | /api/queue | Join queue |
| POST | /api/queue/:id/serve | Serve a customer |
| POST | /api/queue/:id/complete | Mark as done |
| POST | /api/queue/:id/skip | Skip a customer |
| POST | /api/queue/:id/recall | Recall a skipped customer |
| DELETE | /api/queue/:id | Remove from queue |
| POST | /api/queue/next | Call next customer |
| POST | /api/queue/reset | Reset queue |
| GET | /api/settings | Get settings |
| PUT | /api/settings | Update settings |
| GET | /api/analytics | Get analytics data |

## Database Schema

- **queue_items** — id, number, name, status (waiting/serving/skipped/done), timestamps
- **queue_counter** — Current queue number counter
- **settings** — Queue limit (15), cooldown (5000ms), and other settings

## License

MIT
