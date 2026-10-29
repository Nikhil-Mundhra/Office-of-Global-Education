# NYUAD Office of Global Education Hub

A responsive, high-performance quick links hub and contact directory for the **NYU Abu Dhabi Office of Global Education (OGE)**. Designed to help incoming and current students quickly find contact information, book advising sessions, and navigate resources for Study Away, J-Terms, Student Mobility, Visas, and Community-Based Global Learning.

Built as a lightweight, Linktree-style portal with zero frontend build dependencies, deployed on Vercel with optional privacy-first anonymous analytics powered by MongoDB Atlas.

---

## Features

- **Zero Build Step:** Native HTML, CSS, and modern JavaScript. No bundlers (Webpack/Vite), transpilers, or frontend frameworks.
- **Advisor Appointment Scheduler:** Interactive modal for selecting and booking 1-on-1 calendar slots with specific advisors.
- **Quick Actions & One-Click Copy:** Fast access to booking links, external portals, and one-click clipboard copying for team emails.
- **Instant Search & Relevance Ranking:** Weighted client-side search indexing team names, services, topics, staff members, and email addresses.
- **Shareable Deep Links:** Address bar synchronization (`?q=...` and `?topic=...`) enables deep linking and instant QR code generation for front-desk signage.
- **Privacy-First Anonymous Telemetry:** Minimal usage events buffered in browser memory and dispatched via exit beacons. Zero cookies, zero IP tracking, zero PII, with full respect for Do Not Track (DNT) and Global Privacy Control (GPC).
- **Mobile-First Responsive Layout:** Smooth horizontal filter chip scroller and accessible touch targets for mobile devices.

---

## Quick Start

### Prerequisites
- Node.js (version 18.0.0 or higher)

### Run Locally
```bash
# Clone the repository
git clone https://github.com/nikhilmundhra/Office-of-Global-Education.git
cd Office-of-Global-Education

# Start the zero-dependency local dev server
npm run dev
# Server listening at http://localhost:3000
```

> **Note:** Node.js 18+ automatically loads `.env` using native `process.loadEnvFile()`.

---

## Environment Variables

Configure these in a local `.env` file or in your Vercel Project Settings:

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | No | — | MongoDB Atlas connection string for anonymous analytics. If omitted, analytics silently no-ops (`204 No Content`). |
| `MONGODB_DB` | No | `oge` | MongoDB database name. Analytics events are saved to the `events` collection. |
| `PORT` | No | `3000` | Local development server port. |

---

## Project Structure

```
.
├── AGENTS.md             # Guidelines and architectural reference for AI coding agents
├── README.md             # Project documentation and setup guide
├── api/
│   └── track.js          # Vercel serverless function for batched analytics logging
├── package.json          # Node manifest (minimal dependencies: mongodb)
├── public/
│   ├── analytics.js      # Client-side event buffer and exit beacon dispatcher
│   ├── app.js            # UI logic, search/filtering, and modal handling
│   ├── data.js           # Single source of truth for content, teams, and links
│   ├── favicon.svg       # Site favicon
│   ├── index.html        # Semantic HTML layout
│   ├── nyuad-logo.png    # NYUAD brand logo asset
│   ├── styles.css        # NYU brand variables, responsive layouts, and cards
│   └── team/             # Team headshot images (128x128 webp/jpg)
├── server.js             # Local development server mimicking Vercel static serving
└── vercel.json           # Vercel static output config, security, and cache headers
```

---

## Updating Content

All site content is centralized in [`public/data.js`](public/data.js):

- **Quick Links & Advisor Schedules:** Update the `quickLinks` array. You can define direct links (`url`), one-click email copying (`copyEmail`), or multi-advisor scheduling options (`options: [{ label, url }]`).
- **Teams & Responsibilities:** Edit the `teams` array with contact email addresses, bullet points under `helpsWith`, staff `members`, and associated `topics`.
- **Topic Filter Pills:** Add or modify categories in the `topics` array.
- **Team Headshots:** Place square profile images (`128x128px` recommended, WebP or JPG) in `public/team/`, then register the file in `OGE_DATA.photos`. If no photo is specified, the UI automatically falls back to the member's initials.

---

## Search & Relevance Ranking

1. **Default Order:** Teams are displayed in the baseline order defined in `public/data.js`.
2. **Search Queries:** Searches match case-insensitively and are ranked hierarchically:
   1. Team name exact/prefix matches.
   2. "Helps with" service bullet matches.
   3. Topic tags.
   4. Staff member names.
   5. Email addresses.
3. **Topic Filtering:** When a topic chip is selected, teams featuring that topic as their primary (first-listed) tag are prioritized to the top.

---

## Deployment

### Vercel (Recommended)
This repository is configured for automatic zero-config deployment on Vercel via [`vercel.json`](vercel.json):

```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

Or connect the repository on [vercel.com](https://vercel.com/new). No build step is required; `public/` is served directly with preconfigured security and asset caching headers.

---

## Contributing & AI Guidelines

When using AI coding assistants or automated agents, consult [`AGENTS.md`](AGENTS.md) for architectural invariants, coding conventions, zero-dependency requirements, and caching practices.
