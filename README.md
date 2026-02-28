# Ericeira Golden Hour ☀️

Real-time sunlight map showing which bar patios, rooftops, and terraces in Ericeira get the best sun at any time of day.

24 real venues with astronomical sun calculations for Ericeira's exact coordinates (38.96°N, 9.42°W).

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel (fastest)

### Option A: CLI (30 seconds)
```bash
npm i -g vercel
vercel
```

That's it. Follow the prompts, you'll get a live URL.

### Option B: GitHub → Vercel (auto-deploy on push)
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Click Deploy

Every push to `main` auto-deploys.

### Option C: Netlify
```bash
npm run build
# drag the `dist/` folder to netlify.com/drop
```

## Build for production

```bash
npm run build
```

Static files output to `dist/` — host anywhere (S3, Cloudflare Pages, any static host).

## Custom domain

On Vercel: Settings → Domains → Add your domain.
Point DNS A record to `76.76.21.21` or CNAME to `cname.vercel-dns.com`.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Canvas 2D (no mapping library needed)
- Zero external APIs — everything runs client-side
