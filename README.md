# Office-of-Global-Education
Useful links and information for incoming students regarding study away J-terms, Student Mobility, Community Based Learning, and more.

A linktree-style hub in the NYU Global Programs theme. It is a static site with no dependencies, set up to deploy on Vercel.

## Run locally

```bash
npm run dev        # → http://localhost:3000
```

## Update content

All teams, emails, members, topics and quick links are in [`public/data.js`](public/data.js). Edit that file and redeploy.

## Shareable filters

The search and topic filter are saved in the URL, so you can link straight to a view (for example, as a QR code at the front desk):

- `/?topic=visa` — UAE visa / NOC
- `/?topic=jterm` — everything J-Term
- `/?q=tickets` — free-text search

## Deploy to Vercel

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Or import the GitHub repo at vercel.com/new. No build step is needed: `vercel.json` serves `public/`.

## Analytics (MongoDB)

Anonymous usage events (page views, topic filters, searches, email copy/click, quick-link clicks) are stored in MongoDB so you can see what visitors look for. No cookies, IPs or names are stored. Browsers with Do Not Track / Global Privacy Control are skipped.

- The browser queues events and sends them **once**, when the visitor leaves or hides the page, to a single tiny function: [`api/track.js`](api/track.js). Everything else stays static.
- Set these environment variables in Vercel (Project → Settings → Environment Variables):
  - `MONGODB_URI` — your MongoDB Atlas connection string (required; without it tracking silently does nothing)
  - `MONGODB_DB` — optional, defaults to `oge` (collection: `events`)
- Raw events auto-delete after about 13 months (TTL index).
- To view the data, use Atlas Data Explorer or Atlas Charts on the `events` collection. Event `type` values: `view`, `filter`, `search`, `copy_email`, `email_click`, `link_click`.

## Relevance order

"Who to contact" is sorted by relevance: the order of `teams` in `public/data.js` is the default. Searching ranks by where the match is (team name, then what they help with, then topic, members, email). With a topic filter active, teams whose first-listed `topics` entry is that topic come first.
