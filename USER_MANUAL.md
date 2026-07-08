# QueueSmart - User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Client Guide](#client-guide)
4. [Admin Guide](#admin-guide)
5. [Display Screen](#display-screen)
6. [Data Management](#data-management)
7. [Troubleshooting](#troubleshooting)

---

## Overview

QueueSmart is a real-time queue management system that allows businesses to manage customer queues efficiently. Customers can join the queue from a kiosk or shared device, and staff can manage the queue from an admin dashboard.

### Key Features

- **Real-time updates** — Queue changes appear instantly across all devices/tabs
- **Cross-tab sync** — Open multiple browser tabs; they all stay in sync
- **Auto-reset** — Queue resets daily at 8:00 AM automatically
- **Display screen** — Large, visible queue number for customers to see
- **No server required** — Runs entirely in the browser

---

## Getting Started

### Installation

```bash
npm install
npm run dev
```

### Access Points

| Page | URL | Description |
|------|-----|-------------|
| Join Queue | `http://localhost:5173/` | Client-facing join page |
| Display Screen | `http://localhost:5173/display` | Public queue display |
| Admin Login | `http://localhost:5173/admin/login` | Staff login |
| Admin Dashboard | `http://localhost:5173/admin` | Queue management |

---

## Client Guide

### Joining the Queue

1. Open `http://localhost:5173/` on any device
2. Enter your **name** in the text field
3. Click **Join Queue**
4. You will see your:
   - **Queue Number** (e.g., A-001)
   - **Position** in line
   - **Estimated wait time**
5. Click **Join Queue** to add another person, or **View Display** to see the display screen

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

### Serving Customers

#### Step 1: Call Next Customer
- Click the **Call Next Customer** button (purple gradient)
- The next waiting customer moves to "Currently Serving"
- Their number appears large on the display screen

#### Step 2: Complete Service
When done, choose one:

| Button | Action |
|--------|--------|
| **Done & Call Next** | Mark done + call next customer |
| **Done** | Mark done without calling next |
| **Skip** | Skip to next customer |
| **Recall** | Bring back a skipped customer |
| **Remove from Queue** | Permanently remove customer |

### Queue Management

| Button | Action |
|--------|--------|
| **Reset Queue** | Mark all waiting/skipped as done |
| **Clear All** | Delete all queue data permanently |

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

Go to `http://localhost:5173/display`

### What It Shows

| Section | Description |
|---------|-------------|
| **Now Serving** | Large queue number (A-001) |
| **Waiting** | List of customers in line |
| **Recently Served** | Last 15 completed customers |

### Best Practices

- Open the display screen on a **large monitor** or **TV**
- The queue number scales from small screens to **huge** on large displays
- Use **full-screen mode** (F11) for best visibility

---

## Data Management

### How Data is Stored

- All data stored in **browser localStorage**
- No server or internet connection required
- Data persists across page refreshes and tab closures

### Auto-Reset

| Trigger | Timing | Action |
|---------|--------|--------|
| **Daily Reset** | 8:00 AM | Clears queue + counter |
| **Inactivity Reset** | 24 hours of no activity | Clears queue + counter |

### Manual Reset

- **Reset Queue** — Marks all as done (keeps history)
- **Clear All** — Deletes everything permanently

### Data Capacity

| Metric | Value |
|--------|-------|
| Storage limit | ~5-10 MB |
| Per item size | ~200 bytes |
| Max items (practical) | 25,000+ |
| 300 users | ~60 KB |

---

## Troubleshooting

### Queue Not Syncing Across Tabs

1. Check if both tabs are on the same URL origin
2. Refresh both tabs
3. Clear localStorage and rejoin

### Display Screen Not Updating

1. Refresh the display page
2. Check if admin tab is open and active
3. The display polls every 500ms automatically

### Data Lost After Browser Clear

This is expected. Clearing browser data removes localStorage. The queue will start fresh.

### Admin Locked Out

- Default credentials: `admin` / `admin123`
- If changed and forgotten, clear localStorage key `qs_admin`

### WebSocket Error in Console

This is Vite's HMR (Hot Module Replacement) — harmless. The app works fine without WebSocket. Vite falls back to HTTP polling.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close popup modals |
