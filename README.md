# ResolveAI — Frontend

A complete, working React app for all 7 screens, wired together with mock data so you can see the full flow immediately, before your backend teammate's API is ready.

---

## Step 1: Install prerequisites (one-time, on your own laptop)

1. Install **Node.js LTS** from https://nodejs.org
2. Verify: open a terminal and run `node -v` and `npm -v` — you should see version numbers.
3. Install **VS Code** from https://code.visualstudio.com

---

## Step 2: Run the project

1. Download and unzip this folder.
2. Open it in VS Code (`File > Open Folder`).
3. Open the built-in terminal (`` Ctrl+` ``) and run:

```bash
npm install
npm run dev
```

4. Open the URL it prints (usually `http://localhost:5173`).
5. Type any email/password on the login screen — it's mock auth, anything works.

You now have a working, click-through prototype of every screen.

---

## Step 3: Understand the folder structure

```
src/
  components/       → reusable UI pieces
    Sidebar.jsx        the left nav, shown on every logged-in page
    StatusBadge.jsx     the little colored pill (e.g. "Analysis Complete")
    CaseCard.jsx         the card shown on the dashboard grid
    ProtectedRoute.jsx   wraps pages that require login; redirects if not logged in

  pages/            → one file per screen
    Login.jsx
    Dashboard.jsx
    CreateCase.jsx
    UploadEvidence.jsx
    Timeline.jsx
    Report.jsx
    CaseHistory.jsx

  context/
    AuthContext.jsx   → stores the logged-in user + JWT, available anywhere via useAuth()

  services/
    api.js            → EVERY backend call goes through here. See Step 4.

  App.jsx             → defines all the URL routes (e.g. /dashboard, /cases/:caseId/timeline)
  main.jsx            → the entry point that starts React
  index.css           → design tokens (colors, fonts) + Tailwind
```

---

## Step 4: How the mock data works (important!)

Open `src/services/api.js`. At the top:

```js
export const USE_MOCK_DATA = true
```

While this is `true`, every function (`fetchCases`, `createCase`, `fetchTimeline`, etc.) returns fake data instantly — no backend needed. This is why the app works right now with zero setup.

**When your Backend Lead gives you real API endpoints:**

1. Set `USE_MOCK_DATA = false`
2. Update the `baseURL` in the `axios.create({...})` call to your backend's URL (local `http://localhost:8000` while developing together, then your Render URL once deployed)
3. Each function already has the real `axios` call written and ready (the `else` branch) — check that the URL paths (`/auth/login`, `/cases`, etc.) match what your Backend Lead actually built. Adjust if needed.

You never call `axios` directly from a page component — always go through a function in `api.js`. This means when the real backend is ready, you change **one file**, not seven.

---

## Step 5: The user flow, screen by screen

1. **Login** (`/login`) — mock auth, stores user + token in `AuthContext`
2. **Dashboard** (`/dashboard`) — shows stats + case cards, "New Case" button
3. **Create Case** (`/cases/new`) — form, submits → redirects to Upload
4. **Upload Evidence** (`/cases/:caseId/upload`) — drag-drop screenshots, "Analyze" → redirects to Timeline
5. **Timeline** (`/cases/:caseId/timeline`) — reconstructed event list with severity flags
6. **Report** (`/cases/:caseId/report`) — extracted fields, fraud indicators, generate + download complaint
7. **Case History** (`/cases/history`) — table of all past cases

All navigation between these already works via React Router — click through the whole app now.

---

## Step 6: Where to make changes as you build

- **Change colors/fonts**: `src/index.css`, inside the `@theme { ... }` block
- **Add a new page**: create `src/pages/YourPage.jsx`, then add a `<Route>` in `App.jsx`
- **Add a new field to a case**: update the mock object shape in `api.js`, then use it in the relevant page component
- **Connect a real form to the backend**: find the matching function in `api.js` and flip `USE_MOCK_DATA`

---

## Step 7: Deploy

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, sign in with GitHub, "Import Project," select your repo.
3. Vercel auto-detects Vite — click Deploy.
4. Every time you `git push`, it redeploys automatically.

---

## Common issues

- **Blank page / errors on `npm run dev`**: delete `node_modules` and `package-lock.json`, run `npm install` again.
- **Tailwind styles not applying**: make sure `vite.config.js` still has `tailwindcss()` in the plugins array — don't remove it.
- **Port already in use**: another app is using 5173 — either close it or change the port in `vite.config.js`.
