# Cadence — Frontend Preview

A premium, dark-mode, frontend-only consistency-tracking app. No backend, no
database — everything runs on mock data and `localStorage`, structured so a
real API can be dropped in later without touching any component.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## Try it

- Visit `/` for the landing page, or go straight to `/register`.
- Registering routes you through a two-step onboarding (create a topic, add a
  task) into the dashboard at `/app`.
- All data (topics, tasks, completions, streaks) lives in `localStorage`
  under the key `cadence_store_v1`. Clear it (or use dev tools) to reset the
  demo to its seeded state.
- The mock account "logs in" for any email/password combination — this is a
  frontend preview, not a real auth system.

## Pages implemented

| Route | Page |
|---|---|
| `/` | Landing page |
| `/login`, `/register`, `/forgot-password` | Auth screens |
| `/onboarding` | First-topic / first-task setup |
| `/app` | Dashboard ("Today") |
| `/app/topics` | Topic management |
| `/app/topics/:topicId` | Task management within a topic |
| `/app/history` | Calendar / heatmap history |
| `/app/statistics` | Charts and lifetime stats |
| `/app/settings` | Profile, appearance, notifications, account |

## Reusable components (`src/components`)

`Button`, `Input`, `Card`, `Modal`, `Dropdown`, `EmptyState`, `ProgressRing`,
`TaskCard`, `TopicCard`, `Sidebar`, `BottomNav`, `AppHeader`, `AppShell`,
`MarketingNavbar`, `ProtectedRoute`.

## Mock data models (`src/data/mockData.js`)

- `mockUser` — id, name, email, avatar initial, join date, total XP, streaks
- `mockTopics` — id, name, color token, order, createdAt
- `mockTasks` — id, topicId, name, xp, frequency, description, active
- `mockCompletions` — `{ date, taskId }` rows, one per completed task per day

None of these encode a fixed category ("Study", "Workout", etc.) — they're
just the example values a demo user happened to create. The UI never
branches on a topic or task name; everything is driven by whatever topics
and tasks exist in state.

## Where the backend plugs in

Everything the UI touches goes through **`src/services/api.js`**. Every
exported function there (`getTopics`, `createTask`, `toggleCompletion`,
`login`, etc.) already has the async, Promise-returning shape of a real API
call — right now the body reads/writes `localStorage`; later, swap each body
for a `fetch()` / API-client call with the same signature and return shape.
No component, page, or context needs to change.

Two React contexts sit on top of the service layer and are what pages
actually consume:

- **`AuthContext`** (`src/context/AuthContext.jsx`) — session state. Swap
  `login` / `register` in the service layer for real auth and this keeps
  working as-is.
- **`AppDataContext`** (`src/context/AppDataContext.jsx`) — topics, tasks,
  completions, derived streaks/XP. This is the single source of truth pages
  read from and write through (`toggleTask`, `addTopic`, `addTask`, etc.).

`computeStreaks()` in the service layer is flagged as a candidate to move
server-side once there's a backend, since streak math will want to be
computed from the source of truth rather than trusted from the client.

## Notes on the build

- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`), design tokens defined
  as CSS variables in `src/index.css` (`--color-*`, `--radius-*`, fonts).
- Motion: Framer Motion, used for task completion, modals, dropdowns, and
  one orchestrated hero entrance on the landing page — not on every card.
- Charts: Recharts, restyled to match the dark/electric-blue palette.
- Icons: lucide-react throughout.
- Responsive: sidebar nav on desktop, bottom tab bar on mobile; layouts are
  reflowed (not just shrunk) on the dashboard, history, and settings pages.
- Accessibility: semantic landmarks, labelled icon-only buttons, visible
  focus rings, `aria-pressed` / `aria-checked` on toggles, and a
  `prefers-reduced-motion` override in `index.css`.

## Folder structure

```
src/
  components/     reusable UI pieces (Button, Card, Modal, TaskCard, ...)
  context/        AuthContext, AppDataContext, ToastContext
  data/           mockData.js — seed data models
  pages/          route-level screens, including pages/auth/
  services/       api.js — the only file that knows mock data exists
  index.css       design tokens + global styles
  App.jsx         routes
  main.jsx        entry point
```
