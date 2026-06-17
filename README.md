# Tempo — Smart Reminder System

A task and reminder manager that aims to nag you the *right* amount. Tempo organizes what's urgent, what's overdue, and what can wait, and learns when you actually respond to reminders so it can nudge you at the right time instead of just on a fixed schedule.

**Live demo:** [smart-reminder-fe.vercel.app](https://smart-reminder-fe.vercel.app)

> ⚠️ **Status:** This repo is the front-end only. The backend/API integration is in progress — see [Current State](#current-state) below for what's wired up vs. still mocked.

## The Idea

Most to-do apps treat every reminder the same way. Tempo's goal is different: it assigns priority to each task, then uses that priority plus a (planned) behavioral model to decide *when* to alert you — sending more frequent nudges as a deadline gets closer, and learning from your past response patterns (e.g. "you respond fastest to morning reminders") to pick better send times going forward.

## Features

- **Dashboard** — tasks organized by priority (Critical, Urgent, Upcoming, Completed) with live countdown timers
- **Task Detail View** — full task info, deadline status, and associated reminder history
- **Reminder History** — a log of past reminders grouped by day, with channel and status
- **Behavioral Insights** — a panel surfacing patterns like best time-of-day and preferred reminder channel
- **Auth** — email/password sign-up and sign-in via Supabase Auth

## Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router
- **Backend:** [Supabase](https://supabase.com/) (Postgres, Auth, Row Level Security)
- **Icons:** Lucide React

## Current State

| Feature | Status |
|---|---|
| Task CRUD (create, update, complete) | ✅ Connected to Supabase |
| Auth (sign up / sign in / sign out) | ✅ Connected to Supabase |
| Reminder history | ✅ Connected to Supabase |
| Behavioral Insights | ⚠️ UI complete, currently backed by mock data |
| Automatic reminder scheduling/sending | 🚧 Not yet built — planned as a Supabase Edge Function |
| Auto-marking tasks "overdue" on deadline pass | 🚧 Not yet built |

## Getting Started

```bash
# Install dependencies
npm install

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your-project-url
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Run the development server
npm run dev
```

### Database setup

You'll need `tasks` and `reminders` tables in Supabase with Row Level Security enabled so each user only sees their own data. See the project's setup notes for the SQL schema, or recreate it from `src/services/api.js`, which defines the exact shape each table needs to support.

## Roadmap

- [ ] Wire up real reminder scheduling (email/SMS/push)
- [ ] Replace mock Behavioral Insights with real computed data
- [ ] Background job to auto-flag overdue tasks
- [ ] Mobile app (React Native/Expo)
