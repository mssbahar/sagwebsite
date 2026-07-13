# Smart Autocare Garage — Website

Marketing site for SAG. Single-page Astro app with hash-based views (dashboard, about, services, branches, reviews, workshop, contact).

**Stack:** Astro 7, Tailwind CSS 4, GSAP, Lenis, Leaflet

**Node:** 22.12 or newer

## Setup

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Scripts

| Command           | What it does                 |
| ----------------- | ---------------------------- |
| `npm run dev`     | Local development            |
| `npm run build`   | Production build → `dist/`   |
| `npm run preview` | Serve the built site locally |

## Project layout

```
public/          Static assets (images, video, audio)
src/
  components/    Astro UI
  data/          Branch list, copy, testimonials
  layouts/       App shell
  pages/         index.astro (entry)
  scripts/       Views, motion, map, audio
  styles/        global.css
```

Navigation is client-side: `/#dashboard`, `/#about`, `/#locations`, and so on. Reloading a hash URL opens that view directly.

## Deploy

Configured for Vercel and Netlify. Build command is `npm run build`, output directory is `dist`.

Push to `main` and connect the repo in Vercel — it should pick up Astro and deploy without extra setup.

## Notes

- Branch coordinates and hours live in `src/data/branches.ts`.
- Map tiles use Leaflet + CARTO dark basemap.
- `.env` files are gitignored; this site does not need env vars for a standard deploy.
