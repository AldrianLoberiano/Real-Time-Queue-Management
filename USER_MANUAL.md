# BPLO Queue - User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Client Guide](#client-guide)
4. [Admin Guide](#admin-guide)
5. [Display Screen](#display-screen)
6. [Admin Settings](#admin-settings)
7. [Data Management](#data-management)
8. [Troubleshooting](#troubleshooting)

---

## Overview

BPLO Queue is a real-time queue management system for the Business Permit & Licensing Office (BPLO) — Municipality of Calauan, Laguna. Customers can join the queue from a kiosk or shared device, and staff can manage the queue from an admin dashboard.

### Key Features

- **Real-time updates** — Queue changes appear instantly via MySQL + polling (2-second interval)
- **5-second cooldown** — Prevents rapid duplicate entries
- **Queue limit (15)** — Maximum customers in queue with warning banner and popup alert
- **Sound notifications** — Chime sound when customers are served (toggleable)
- **Lunch break mode** — Pause queue with amber banner on display screen
- **BPLO branding** — Official logo and header throughout
- **Display screen** — Large, visible queue number for customers to see
- **MySQL persistence** — Data stored in MySQL database, survives browser restarts

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Installation

```bash
npm install
npm run db:setup
npm run dev:all
```

### Access Points

| Page | URL | Description |
|------|-----|-------------|
| Join Queue | `http://localhost:5173/queue` | Client-facing join page |
| Display Screen | `http://localhost:5173/display-screen` | Public queue display |
| Admin Login | `http://localhost:5173/admin/login` | Staff login |
| Admin Dashboard | `http://localhost:5173/admin` | Queue management |
| Admin Settings | `http://localhost:5173/admin/settings` | Sound & lunch break config |

---

## Client Guide

### Joining the Queue

1. Open `http://localhost:5173/queue` on any device
2. Enter your **name** in the text field
3. Click **Join Queue**
4. You will see your:
   - **Queue Number** (e.g., A-001)
   - **Position** in line
   - **Estimated wait time**
5. Click **Join Queue** to add another person, or **View Display** to see the display screen

### Queue Limit

- Maximum **15 customers** can be in the queue at once
- When the limit is reached, the **Join Queue** button is disabled and a popup alert is shown
- The queue limit warning also appears on the admin dashboard

### Cooldown

- There is a **5-second cooldown** between joining attempts
- The cooldown timer is shown on the Join Queue button

### What You See

- **Waiting** — Number of people ahead of you
- **Now Serving** — Current number being served
- **Avg. Wait** — Estimated wait per person (~3 min)

---

## Admin Guide

### Logging In

1. Go to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click **Sign In**

### Dashboard Overview

The admin dashboard shows:

| Section | Description |
|---------|-------------|
| **Stats Cards** | Waiting, Serving, Served, Avg. Time |
| **Call Next Customer** | Button to call the next person |
| **Currently Serving** | Details of the customer being served |
| **Queue List** | All customers with status filters |

### Queue Limit Warning

- A **yellow warning banner** appears when the queue has 15 or more customers
- The banner shows the current count and a message

### Serving Customers

#### Step 1: Call Next Customer
- Click the **Call Next Customer** button (purple gradient)
- The next waiting customer moves to "Currently Serving"
- Their number appears large on the display screen
- A **sound notification** plays to alert customers

#### Step 2: Complete Service
When done, choose one:

| Button | Action |
|--------|--------|
| **Done & Call Next** | Mark done + call next customer |
| **Done** | Mark done without calling next |
| **Recall** | Bring back a skipped customer (Currently Serving only) |
| **Skip** | Skip to next customer (Currently Serving only) |
| **Remove from Queue** | Permanently remove customer |

### Queue Management

| Button | Action |
|--------|--------|
| **Reset Queue** | Mark all waiting/skipped as done |
| **Clear All** | Delete all queue data permanently and reset counter |

### Filtering the Queue List

Use the filter tabs to view:
- **All** — Every customer
- **Waiting** — Customers in line + currently serving
- **Done** — Completed customers
- **Skipped** — Skipped customers

### Popup Confirmations

All dangerous actions show a styled popup alert:
- **Done & Call Next** — Confirms marking done and calling next
- **Done** — Confirms marking as done
- **Skip** — Confirms skipping customer
- **Recall** — Confirms recalling customer
- **Remove from Queue** — Confirms permanent removal
- **Reset Queue** — Confirms marking all as done
- **Clear All** — Confirms permanent data deletion

---

## Display Screen

### Accessing the Display

Go to `http://localhost:5173/display-screen`

### What It Shows

| Section | Description |
|---------|-------------|
| **Now Serving** | Large queue number (A-001) |
| **Waiting** | List of customers in line |
| **Recently Served** | Last 15 completed customers |

### Sound Toggle

- Click the **speaker icon** in the header to toggle sound notifications
- When enabled, a chime plays each time a customer is served

### Best Practices

- Open the display screen on a **large monitor** or **TV**
- The queue number scales from small screens to **huge** on large displays
- Use **full-screen mode** (F11) for best visibility

---

## Admin Settings

### Accessing Settings

Go to `http://localhost:5173/admin/settings` or click **Settings** in the admin sidebar.

### Available Settings

| Setting | Description |
|---------|-------------|
| **Sound Notifications** | Toggle the chime sound when serving customers |
| **Lunch Break** | Pause the queue and show an amber banner on the display screen |

### Lunch Break Mode

When enabled:
- Customers cannot join the queue
- Display screen shows a full amber "Lunch Break" banner
- The admin dashboard shows a lunch break indicator
- Queue resumes when disabled

---

## Data Management

### How Data is Stored

- All data stored in **MySQL database**
- Survives browser restarts, cache clears, and server reboots
- Backend API runs on `http://localhost:3001`

### Database Tables

| Table | Purpose |
|-------|---------|
| `queue_items` | All queue entries with status |
| `queue_counter` | Current queue number counter |
| `settings` | Sound and lunch break configuration |

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Sound Notifications | true | Chime on serve |
| Lunch Break | false | Pause queue mode |

### Manual Reset

- **Reset Queue** — Marks all as done (keeps history)
- **Clear All** — Deletes everything permanently and resets the queue counter to 0

---

## Troubleshooting

### Queue Not Syncing

1. Refresh the page
2. Check if the backend server is running (`http://localhost:3001`)
3. Check MySQL connection

### Display Screen Not Updating

1. Refresh the display page
2. Check if admin tab is open and active
3. The display polls every 2 seconds automatically

### Backend Server Not Starting

1. Ensure MySQL is running
2. Check database credentials in `backend/server/app.ts`
3. Run `npm run db:setup` to create tables

### Admin Locked Out

- Default credentials: `admin` / `admin123`
- Credentials are stored in the backend code (`backend/server/app.ts`)
- If changed and forgotten, update the hardcoded values in `app.ts`

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close popup modals |
