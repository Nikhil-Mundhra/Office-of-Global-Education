# AGENTS.md

Guidance and architectural reference for AI coding agents working on the **NYU Abu Dhabi Office of Global Education (OGE)** quick links hub.

---

## 1. Project Overview

The **Office of Global Education Hub** is a fast, responsive, Linktree-style directory and quick-reference portal for NYU Abu Dhabi students. It helps incoming and current students quickly find contact information, book advising sessions, and access guidance for Study Away, J-Terms, Student Mobility, Visas, and Community-Based Global Learning.

### Design Principles
- **Zero Frontend Build Step:** No bundlers (Webpack, Vite), transpilers, or frontend frameworks. Pure native HTML, CSS, and JavaScript.
- **Instant Load & High Performance:** Lightweight static assets served directly with aggressive caching headers.
- **Privacy-First Anonymous Analytics:** Minimal usage telemetry buffered client-side and dispatched upon page exit via beacon without cookies, IP tracking, or PII.
- **Stateful URLs:** Search queries (`?q=...`) and selected topics (`?topic=...`) synchronize with the browser address bar for effortless QR code generation and direct linking.

---

## 2. Tech Stack & Dependencies

- **Runtime:** Node.js (>= 18.0.0)
- **Local Dev Server:** Built-in Node.js standard libraries (`http`, `fs`, `path`) using `process.loadEnvFile()` in `server.js`.
- **Production Host:** Vercel (static file serving configured in `vercel.json`).
- **Serverless API:** Node.js serverless function (`api/track.js`).
- **Database / Analytics:** MongoDB Atlas via the official `mongodb` npm driver (`^6.10.0`).

---

## 3. Directory Layout

```
.
├── .env                  # Local environment configuration (MONGODB_URI, optional)
├── .gitignore            # Ignores node_modules, .env, .vercel
├── README.md             # High-level repo summary and quick start
├── AGENTS.md             # Agent guidelines and architectural documentation
├── api/
│   └── track.js          # Vercel serverless function handling batched analytics events
├── node_modules/         # Node packages
├── package.json          # Node manifest (minimal dependencies: mongodb)
├── public/
│   ├── analytics.js      # Client-side analytics event queue & beacon dispatcher
│   ├── app.js            # Core UI logic, search/filtering, modal/dropdown handling
│   ├── data.js           # Single source of truth: teams, members, topics, quick links
│   ├── favicon.svg       # SVG site favicon
│   ├── index.html        # Semantic HTML layout and metadata
│   ├── nyuad-logo.png    # NYUAD brand logo asset
│   ├── styles.css        # NYU brand variables, responsive layouts, card components
│   └── team/             # Member headshot avatars (128x128 webp/jpg)
├── server.js             # Zero-dependency local development server (serves /public + /api/track)
└── vercel.json           # Vercel output directory, security headers, and caching rules
```

---

## 4. Development & Operation

### Running Locally
```bash
npm run dev
# Server starts at http://localhost:3000
```
- `server.js` loads `.env` automatically using Node 18+'s native `process.loadEnvFile()`.
- Routes ending in `/` serve `index.html`.
- Requests to `/api/track` invoke `api/track.js` directly within the Node process.

### Environment Variables
Set in `.env` locally or in Vercel Project Settings:
- `MONGODB_URI`: MongoDB Atlas connection string. If missing, `/api/track` quietly responds with `204 No Content` without failing or degrading client functionality.
- `MONGODB_DB`: MongoDB database name (default: `oge`). Target collection is `events`.
- `PORT`: (Optional) Local port override (default: `3000`).

### Deployment
Configured for automatic deployment on Vercel:
- **Build Command:** None required (static output directory is `public`).
- **Output Directory:** `public` (defined in `vercel.json`).
- Preview deployments can be run via `npx vercel`; production via `npx vercel --prod` or git pushes to `main`.

---

## 5. Architectural Components

### 5.1 Content & Data Layer (`public/data.js`)
All content is centralized in `window.OGE_DATA`:
- `photos`: Key-value map of member first name (or identifier) to avatar asset in `/team/`. If missing, the UI falls back to initials.
- `quickLinks`: Array of top card objects.
  - Can be a direct link (`url`) or provide multiple sub-options (`options: [{ label, url }]`, used for advisor scheduling).
  - Can include `copyEmail` to provide a one-click clipboard copy button.
  - Accompanied by SVG `icon` (`calendar`, `plane`, `globe`) and an `accent` color palette.
- `topics`: Available filter pills with `{ id, label }`.
- `teams`: Array of contact cards containing `name`, `email`, `helpsWith`, `members`, `topics`, and `accent`. The array definition order represents the baseline relevance order.

### 5.2 Application Logic & Search (`public/app.js`)
- **Search & Ranking:** Free-text searches are ranked by specificity:
  1. Team name exact/prefix matches.
  2. "Helps with" bullet point matches.
  3. Associated topic tag matches.
  4. Team member name matches.
  5. Email address matches.
- **Topic Filter Priority:** When filtering by topic, teams listing that topic first in their `topics` array are sorted to the top.
- **Advisor Selection Popover:** For multi-option quick links (e.g., Study Away advising calendar appointments), a modal/dropdown lets users select specific advisors.
- **Address Bar Sync:** `history.replaceState` synchronizes changes to `?topic=` and `?q=` without triggering full page reloads.

### 5.3 Privacy-Preserving Analytics (`public/analytics.js` & `api/track.js`)
- **Client Side (`public/analytics.js`):**
  - Respects browser privacy: skips recording if `navigator.doNotTrack === "1"` or `navigator.globalPrivacyControl` is active.
  - Buffers actions (`view`, `search`, `filter`, `copy_email`, `email_click`, `link_click`) in memory.
  - Flushes the batch once when the page is hidden or unloaded (`visibilitychange` / `pagehide`) using `navigator.sendBeacon` (falling back to `fetch` with `keepalive: true`).
- **Serverless Handler (`api/track.js`):**
  - Accepts POST requests with a max body size limit (8 KB).
  - Validates and sanitizes payload strings.
  - Inserts events into the `events` collection with a TTL index on `createdAt` (~13 months auto-expiry).
  - Always terminates promptly with `204 No Content` to ensure client requests are never blocked.

---

## 6. Conventions & Guidelines for AI Agents

When editing or extending this codebase, adhere strictly to these rules:

1. **Preserve Zero-Dependency Philosophy:**
   - Do NOT introduce build tools (Webpack, Vite, esbuild, Babel) or runtime JS libraries/frameworks (React, Vue, jQuery, Lodash, Tailwind).
   - Maintain vanilla JavaScript (ES6+ standard), CSS custom properties, and semantic HTML.

2. **Content Changes Belong in `public/data.js`:**
   - When modifying team members, advising links, email addresses, or topics, modify `public/data.js`. Avoid hardcoding data into `public/index.html` or `public/app.js`.

3. **Asset Handling:**
   - Keep team photos optimized (preferably WebP or JPG, square aspect ratio, around 128x128px) in `public/team/`.
   - Update `window.OGE_DATA.photos` to map member names to their respective image file paths.

4. **URL Compatibility & Accessibility:**
   - Ensure query parameters (`?q=`, `?topic=`) continue to work seamlessly for QR codes and deep links.
   - Maintain accessible markup (ARIA attributes, keyboard navigation on buttons/inputs, focus states).

5. **Caching & Caching Invalidation:**
   - Assets in `public/team/` and logo files are cached long-term in `vercel.json` (`max-age=2592000`). If replacing an existing image with a different file of the same name, be aware of caching behavior.
   - Core scripts (`app.js`, `data.js`, `styles.css`) use a shorter TTL (`max-age=300, stale-while-revalidate=86400`).

6. **Testing Changes:**
   - Verify changes locally by running `npm run dev` and testing with query params (e.g. `http://localhost:3000/?topic=visa`, `http://localhost:3000/?q=tickets`).
   - Test responsive layout behavior at mobile screen widths (< 640px) and ensure horizontal chip scroller and advising modal operate cleanly.
