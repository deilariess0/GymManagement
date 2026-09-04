# FIT4LESS — Gym Management System

React + Vite + Tailwind CSS rebuild of the FIT4LESS dashboard, wired entirely
to local mock data so it runs with **no backend**.

## Stack

- React 19 + Vite
- Tailwind CSS
- React Router (sidebar navigation + routed pages)
- Recharts (income line chart, membership donut chart)
- lucide-react (icons, pinned to `0.462.0`)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Folder structure

```
src/
├─ assets/                 static images/icons you add later
├─ components/
│  ├─ layout/               Sidebar, Topbar, DashboardLayout (page shell)
│  ├─ dashboard/             one component per dashboard widget
│  │  ├─ StatCard.jsx
│  │  ├─ IncomeChart.jsx
│  │  ├─ MembershipBreakdown.jsx
│  │  ├─ TransactionsTable.jsx
│  │  ├─ TopMembers.jsx
│  │  └─ QuickActions.jsx
│  └─ ui/                   small reusable primitives (Badge, Avatar)
├─ data/                    ← mock "backend" — one file per data need
│  ├─ navigation.js          sidebar links (drives routing too)
│  ├─ stats.js                today's visits / income / members / expiring
│  ├─ incomeOverview.js       line chart series
│  ├─ membershipBreakdown.js  donut chart series
│  ├─ transactions.js         transactions table rows
│  ├─ topMembers.js           leaderboard rows
│  └─ quickActions.js         quick action buttons
├─ hooks/                   custom hooks as you add them
├─ pages/
│  ├─ Dashboard.jsx          assembles all dashboard widgets
│  └─ PlaceholderPage.jsx    shared "coming soon" screen for other routes
├─ utils/
│  └─ cn.js                  tiny classnames helper
├─ App.jsx                  route table
└─ main.jsx                 app entry, wraps App in BrowserRouter
```

## How the sidebar and routing connect

Every sidebar item lives once, in `src/data/navigation.js`. `App.jsx` reads
that same list to generate a `<Route>` for each item, so adding a new
section is: add one entry to `navigation.js`, then build a real page and
swap it in for `PlaceholderPage` in `App.jsx`.

## Swapping in a real backend later

Each file in `src/data/` exports plain arrays/objects shaped exactly like
what the components expect. When you're ready to connect a real API,
replace the export in a given file with a fetch call (or move the fetching
into a hook in `src/hooks/`) — the components themselves don't need to
change since they only care about the shape of the data.

## Pages currently built out

- **Dashboard** (`/`) — fully built: stat cards, income chart, membership
  breakdown, today's transactions, top members, quick actions.
- **Check-in, Members, Memberships, Payments, Reports, Plans & Pricing,
  Discounts, Staff, Settings** — routed and reachable from the sidebar,
  currently rendering a placeholder screen ready for you to build out next.
