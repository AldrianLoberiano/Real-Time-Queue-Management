# Real-Time Queue Management

A real-time queue management system built with React, Vite, and Tailwind CSS.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Project Structure

```
src/
  main.tsx                          Entry point
  index.css                         Tailwind CSS
  App.tsx                           Routes
  features/
    queue/
      QueueContext.tsx               State management
      components/
        Layout.tsx                   Public layout
        PriorityBadge.tsx            Priority badge
        StatusBadge.tsx              Status badge
      pages/
        JoinQueuePage.tsx            Join queue page
        DisplayScreenPage.tsx        Display screen
    admin/
      components/
        AdminLayout.tsx              Admin layout
      pages/
        AdminDashboardPage.tsx       Admin dashboard
        AdminAnalyticsPage.tsx       Analytics page
        AdminLoginPage.tsx           Admin login
```

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`
