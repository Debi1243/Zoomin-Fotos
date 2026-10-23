# Redesign launch notes

Companion to `docs/redesign-audit-and-plan.md`. Covers what changed, how to check it, how to deploy and roll back,
how conversions are measured, and what still needs the studio's input.

## What changed

- **Design system** (`src/app/globals.css`): warm paper `#FAF8F5`, white cards, ink `#202020`, muted `#666666`,
  sand `#E9E2D9`, terracotta `#B65C45` for booking actions only, WhatsApp green `#1F7A4D`.
  Plus Jakarta Sans for headings, Manrope for text. One light theme. 8px spacing, 8/12/16px radius.
- **Header**: Home, Services, Packages, Portfolio, About, Contact, plus Book Your Shoot. Phones get a menu sheet,
  a WhatsApp icon and a sticky bottom bar (WhatsApp, Get a Quote).
- **Home**: photo hero with prices → service cards → wedding packages → 15-photo portfolio with filters →
  why us → reviews → three booking steps → FAQ → final call to action.
- **New `/packages`**: all packages, a side-by-side comparison table, the pre-wedding shoot, the package builder,
  and the services that are quoted on request.
- **Quote form** (`/contact#quote`): service, date, location, budget, name, mobile (required), email and notes
  (optional). On send it opens WhatsApp with the enquiry written out and saves the lead through the existing
  server action (webhook and/or Google Sheet). It never says the booking is confirmed.
- **Service pages**: same URLs. Hero with price, packages, what's included and not included, 12 photos,
  reviews, FAQs, other services.
- **Copy**: removed promises nobody has confirmed (72-hour preview, same-night backups, travel at cost,
  outfit counts, a second shooter on Essence, "reply within a day").
- **Speed**: removed Lenis, Motion, the marquees and the theme switcher. Home page on a phone:
  JavaScript 1,073 KB → 496 KB (uncompressed), images 234 → 22, page elements 1,787 → 808.

## Testing checklist

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass
- [ ] Home, Services, Packages, Portfolio, About, Contact, Reviews and all six service pages load on a phone (375px) and desktop (1440px)
- [ ] No sideways scrolling on a phone on any page
- [ ] Menu opens and closes on a phone; Escape closes it
- [ ] Sticky bar shows WhatsApp and Get a Quote on phones; hidden on `/admin` and `/portal`
- [ ] Package "Book" buttons open the form with the service and package filled in
- [ ] Package builder "Get a quote" fills in the service, an estimate and the chosen events
- [ ] Form: sending empty shows errors and focuses the first one; a 9-digit phone is rejected
- [ ] Form: a valid send opens WhatsApp with the enquiry text, and shows the thank-you message
- [ ] One real test enquiry on the live site reaches the studio (webhook or Google Sheet)
- [ ] `/admin` and `/portal` still work

## Deploy and roll back

- Deploy: merge the pull request into `main`. The server pulls `main` every minute and rebuilds; the site
  updates in about 3 minutes (`deploy/auto-deploy.sh`).
- Roll back: on GitHub, open the merged pull request and press **Revert**, then merge the revert.
  Or from a terminal: `git revert -m 1 <merge commit>` and push `main`. The server redeploys the previous version
  the same way, in about 3 minutes.

## Conversion measurement

| Event | Fired when |
|---|---|
| `page_view` | Every page (GA4) |
| `whatsapp_click` | Any WhatsApp button; `source` says which one (hero, header, booking-bar, package, …) |
| `package_select` | A package's Book button, the comparison table, or the package builder |
| `quote_form_start` | First change in the quote form |
| `quote_form_submit` | A valid quote form send (`service`, `budget`, `package`) |
| `call_click` | Any phone link |

To switch on GA4: create a GA4 property, then set `NEXT_PUBLIC_GA_ID=G-XXXXXXX` in `deploy/.env` on the server
and rebuild. Visitors are asked once before GA loads. Without it, the studio's own visit counter
(`/admin/dashboard`, Google Sheet) still records visits and clicks without cookies.

Bookings and revenue can't be measured by the website. Mark each enquiry as qualified, booked (with the amount)
or lost in the Enquiries sheet; conversion rate by service = booked ÷ quote sends + WhatsApp clicks for that service.

## Needs the studio's input

1. Confirm +91 70222 49799 is the WhatsApp number (`src/lib/brand.ts`, `whatsapp`).
2. "From" prices for portraits, maternity and newborn, events and commercial (`src/lib/data.ts`).
3. Delivery times, advance amount, date-change and cancellation terms (FAQ answers currently say these are in the quote).
4. Real Google reviews to publish from `/admin/reviews`.
5. There are no maternity or family-group photos in the portfolio yet; the cards use the kids and portrait photos.
6. Photographer names and photo for the About page.
7. Set `CONTACT_WEBHOOK_URL` or connect the Google Sheet so saved leads reach the studio.
8. The Google Sheet script changed (v4: phone-only enquiries accepted). If the sheet is connected, update it from `/admin/dashboard`.
