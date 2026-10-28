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
