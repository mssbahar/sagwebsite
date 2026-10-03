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

There is one page. The address bar hash picks the screen: `/#dashboard`, `/#about`, `/#services`, `/#workshop`, `/#locations`, `/#promotions`, `/#reviews`, `/#contact`. Reloading a hash URL opens that view directly.

`docs/` is a photo and video brief for the content team. It is not part of the website.

`public/` is files the browser can request by URL. Images live in `public/images/` (branch photos, promotions, reviews, services). The opening video is `public/video/hero.mp4`. The click sound is `public/audio/ui-click.mp3`.

### Pages and layout

- `src/pages/index.astro` — the only route. It stacks every screen inside the layout. Add a new screen here.
- `src/layouts/AppLayout.astro` — the HTML shell: title, description, fonts, and the scripts that boot the site.

### Components (`src/components/app/`)

- `Landing.astro` — the full-screen intro video. Edit the headline in `src/data/trust.ts`.
- `Dashboard.astro` — the home grid of tiles. Edit this to change what a tile says or which view it opens.
- `InnerPage.astro` — the shared frame for every page after the dashboard (logo, social links, scroll area).
- `CtaBanner.astro` — the wide “book on WhatsApp” strip at the bottom of inner pages.
- `CtaButton.astro` — the shared pink button. Pass the link and label in.
- `ExploreCloseCta.astro` — the floating Explore / Close / Back button.
- `PinkDot.astro` — the small icon badge on section headings.
- `SiteLoader.astro` — the black loading screen with the logo.
- `SocialIcon.astro` — TikTok, Instagram, and Facebook icons.
- `about/CarGets.astro` — the “what your car gets” list on the About page.
- `locations/BranchMap.astro` — the map box. Leaflet fills it from `src/scripts/branch-map.ts`.
- `locations/BranchListItem.astro` — one branch row. It expands in place to show address and hours.
- `views/AboutView.astro` — About page.
- `views/ServicesView.astro` — Services page.
- `views/WorkshopView.astro` — Workshop page.
- `views/LocationsView.astro` — Branches page (search, list, map).
- `views/PromotionsView.astro` — Promotions page.
- `views/ReviewsView.astro` — Reviews page and carousel.
- `views/ContactView.astro` — Contact page.

### Data (`src/data/`)

Change words and lists here. You usually do not need to touch the component.

- `site.ts` — company name, phone, email, WhatsApp link, address, hours. Also used for the page title and search description.
- `trust.ts` — landing headline and dashboard hero sentence.
- `about.ts` — About page copy, stats, and future plans.
- `services.ts` — service list and the “how a job moves” steps.
- `facilities.ts` — workshop bay names and photos.
- `branches.ts` — every branch: address, hours, phone, map pin. Also the distance helper for “Find nearest”.
- `promotions.ts` — promotion posters.
- `testimonials.ts` — review cards (quote, name, photos).
- `reviews.ts` — the reviews page heading only. The cards are in `testimonials.ts`.
- `contact.ts` — contact page heading and the HQ card.
- `social.ts` — social profile links.

### Scripts (`src/scripts/`)

These run in the browser after the page loads.

- `gsap-init.ts` — turns on GSAP and the scroll plugin. Other motion files import this.
- `motion.ts` — shared timing numbers (how fast fades and counters run).
- `lenis.ts` — smooth scrolling.
- `loader.ts` — animates the loading screen.
- `landing-journey.ts` — plays the intro video, then moves to the dashboard.
- `views.ts` — hash navigation and the open/close animation between screens.
- `reveals.ts` — fade-in when a section scrolls into view.
- `carousel.ts` — next/previous on the reviews page.
- `audio.ts` — short click sound on dashboard tiles.
- `branch-map.ts` — draws the branch map and moves the pin when a branch is picked.
- `page-motions/index.ts` — starts the right animation when a screen opens, and stops it when you leave.
- `page-motions/utils.ts` — small helpers shared by those animations.
- `page-motions/landing-dashboard.ts` — landing and dashboard motion.
- `page-motions/about.ts` — About page motion.
- `page-motions/services.ts` — slow drift on the services hero photo.
- `page-motions/workshop.ts` — Workshop page motion.
- `page-motions/locations-map.ts` — “Find nearest” and list/map behaviour.
- `page-motions/promotions.ts` — Promotions page motion.
- `page-motions/reviews.ts` — Reviews page motion.
- `page-motions/contact.ts` — Contact page motion.

### Styles

- `src/styles/global.css` — colours, layout, and animations for the whole site. Tailwind classes in the components cover spacing and type; this file covers the custom pieces (dashboard grid, map, reviews, banners).

## Deploy

Configured for Vercel and Netlify. Build command is `npm run build`, output directory is `dist`.

Push to `main` and connect the repo in Vercel — it should pick up Astro and deploy without extra setup.

## Notes

- Branch coordinates and hours live in `src/data/branches.ts`.
- Map tiles use Leaflet + CARTO dark basemap.
- `.env` files are gitignored; this site does not need env vars for a standard deploy.
