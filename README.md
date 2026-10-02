# Zoomin Fotos — Photography studio website

Website for Zoomin Fotos, a photography studio in Bhubaneswar: weddings, pre-wedding, portraits, maternity & newborn, events and commercial work.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Motion and Zod.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build && npm start
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata, sitemap and structured data. Defaults to `https://debi1243.github.io/Zoomin-Fotos`. |
| `CONTACT_WEBHOOK_URL` | Where contact form submissions are POSTed as JSON (Zapier, Make, Slack, a CRM, your own API). Without it, the form succeeds only in local development and shows an "email us" fallback in production. |

## GitHub Pages

The site is published at https://debi1243.github.io/Zoomin-Fotos/ from the `gh-pages` branch.
`.github/workflows/deploy-pages.yml` rebuilds it on every push to `main` as a static export
(`STATIC_EXPORT=1`, `BASE_PATH=/<repo>`). Static hosting has no server, so the contact form posts
from the browser to the `CONTACT_ENDPOINT` repository variable (for example a Formspree URL);
without one it asks visitors to email instead.

## Pages

All pages are statically generated.

- `/` Hero collage, recent frames strip, services index, approach, process, FAQ
- `/portfolio` Filterable gallery with a keyboard-friendly lightbox
- `/services` The six services, image-led
- `/services/[slug]` Photographs from that category, what's included, what you receive, process, FAQ, other sessions
- `/about` Studio story and approach
- `/contact` Booking details and a validated enquiry form (session type, date, location)

Also generated: `sitemap.xml`, `robots.txt`, Open Graph image, SVG favicon and JSON-LD (studio, services, breadcrumbs, FAQ).

## Adding your photographs

Until real photographs are added, every photo slot shows a toned placeholder frame.

1. Put images in `public/photos/` (JPG or WebP, about 2400px on the long edge).
2. In `src/lib/data.ts`, set `src: "/photos/your-file.jpg"` on the matching entry in `photos`, and update its `title`, `place`, `category` and `aspect`.
3. Replace the placeholder `email` and `phone` in `brand` at the top of the same file.

## Design notes

- Type: Instrument Serif for display, Geist for text, Geist Mono for labels.
- One accent colour (warm orange) used only for primary actions.
- Light, dark and system themes; the choice is stored per visitor and applied before first paint.
- Scroll reveals use CSS scroll-driven animations; Motion handles the mobile menu. Both respect `prefers-reduced-motion`.
