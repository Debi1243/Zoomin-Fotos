# Orbitra — Digital studio website

Marketing site for Orbitra Digital Labs: websites, SEO & digital marketing, mobile apps and industry software.

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
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata, sitemap and structured data. Defaults to `https://orbitra.studio`. |
| `CONTACT_WEBHOOK_URL` | Where contact form submissions are POSTed as JSON (Zapier, Make, Slack, a CRM, your own API). Without it, the form succeeds only in local development and shows an "email us" fallback in production. |

## GitHub Pages

The site is published at https://debi1243.github.io/Zoomin-Fotos/ from the `gh-pages` branch.
`.github/workflows/deploy-pages.yml` rebuilds it on every push to `main` as a static export
(`STATIC_EXPORT=1`, `BASE_PATH=/<repo>`). Static hosting has no server, so the contact form posts
from the browser to the `CONTACT_ENDPOINT` repository variable (for example a Formspree URL);
without one it asks visitors to email instead.

## Pages

All pages are statically generated.

- `/` Hero with the discipline diagram, key numbers, disciplines index, selected work, industry software tabs, process, testimonials, FAQ
- `/services` Every service grouped by discipline, with in-page category links
- `/services/[slug]` 15 service pages: numbers at a glance, what's included, deliverables, process, FAQ, related services
- `/about` Story, mission/vision/values, timeline, why Orbitra
- `/work` Case studies with data-driven covers
- `/contact` Contact details and a validated form backed by a Server Action

Also generated: `sitemap.xml`, `robots.txt`, Open Graph image, SVG favicon and JSON-LD (organisation, services, breadcrumbs, FAQ).

## Structure

```
src/
  app/                 routes, metadata files, contact Server Action
  components/
    navigation/        header, services menu, mobile menu, theme toggle
    layout/            footer
    sections/          page sections (home/ holds home-only ones)
    work/              project card and generated covers
    forms/             form fields and the contact form
    ui/                buttons, logo, section header, tag
    shared/            JSON-LD, Motion config
  lib/                 content (data.ts), site config, contact schema
```

## Customise

- Copy, services, numbers, projects and testimonials live in `src/lib/data.ts`.
- Colours, type scale, radii and shadows are tokens at the top of `src/app/globals.css`, with light and dark values.
- Case-study covers are drawn from each project's `cover` setting (tone + chart type) in `data.ts`.

## Design notes

- Type: Bricolage Grotesque for display, Geist for text, Geist Mono for labels and numbers.
- One accent colour (signal orange) used only for primary actions and data highlights.
- Light, dark and system themes; the choice is stored per visitor and applied before first paint.
- Scroll reveals use CSS scroll-driven animations; Motion handles menus, tabs and form transitions. Both respect `prefers-reduced-motion`.
