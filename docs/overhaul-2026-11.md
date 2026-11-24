# Website overhaul, November 2026

Follows the master prompt "Zoomin Fotos website overhaul". Builds on the existing site; nothing was rebuilt from
scratch and no working feature was removed. The midnight black and cobalt glass theme stays as it is.

## What changed

**Brand and home page**
- Tagline, description, default title and share image now carry the brand promise:
  "Not just photographs. The moments you'll relive forever." and
  "Wedding photography and films crafted around your story, your emotions and the moments that matter."
  The old "affordable" wording is gone.
- Hero: View Wedding Stories (to `/portfolio#wedding-story`) and Check Availability (to the enquiry form, Wedding
  pre-selected), with a WhatsApp link under them. Starting prices stay in the hero.
- Order: hero, trust strip, wedding stories, services, wedding packages, why choose us, tagline, reviews, booking
  steps, FAQ, closing call to action.
- Trust strip: only facts the site already publishes (Bhubaneswar, photos and film in every package, published
  prices, the refundable ₹5,000 advance) plus the Google reviews link. Shows a review count and average only once
  real reviews are published from `/admin/reviews`.
- Services: eight cards, including Candid Photography and Wedding Cinematography.
- Why choose us: professional team, creative storytelling, backup equipment, defined delivery process,
  personalised planning, consistent quality. Each is backed by the packages, the booking agreement, the quote or
  the client portal.

**Packages and builder**
- Each package has a "who it's for" line. Wedding cards show photographers, cinematographers, edited photos and
  highlight film in the same grid, read from the comparison table (`weddingFacts` in `src/lib/data.ts`).
- New panel (`PackageTerms`) on `/packages` and `/services/weddings`: what every package includes, what costs
  extra, delivery and customisation.
- Every "price is negotiable" line is now "Custom packages available based on your event requirements."
  (`customPackagesLine` in `src/lib/brand.ts`).
- Prices and package contents are unchanged.
- Builder: event tiles show each event's cost, the itemised estimate is on phones too, rounding is explained, and the
  itemised estimate goes into the enquiry (`breakdown` and `quoteNotes` in `src/lib/package-builder.ts`). Totals
  are identical to before for every selection.

**Portfolio**
- A wedding day in six chapters (`weddingStory` in `src/lib/data.ts`) at the top of `/portfolio`, each with the
  lightbox. The page says the chapters come from several weddings.
- New collections: Haldi & Mehendi and Candid moments (`collections` in `src/lib/data.ts`), alongside the service
  categories. Filters can be linked to, e.g. `/portfolio#candid`.

**Enquiry and conversion**
- Choosing Wedding in the form shows a package picker; packages from cards and the builder arrive pre-selected.
- The WhatsApp message reads as an availability request, one detail per line.
- "Check availability" on the header, phone menu, sticky phone bar and closing call to action.
- `/contact` shows what happens after sending, and where delivery dates are written.

**SEO**
- New pages: `/services/candid-photography` and `/services/wedding-cinematography`, written from the packages,
  comparison table and builder rates, with Service, Breadcrumb and FAQ data. Added to the sitemap and footer.
- Service page titles use searched phrases (Wedding Photographer in Bhubaneswar, Odisha; Pre-Wedding Photographer
  in Bhubaneswar; Maternity & Newborn Photographer in Bhubaneswar, ...) and the H1 names the place.
- Portfolio has a keyword-led title and breadcrumb data. The studio's structured data lists every service and the
  slogan.

## Needs the studio's input

1. **Google reviews and testimonials.** Publish real ones from `/admin/reviews`; the trust strip and review sections
   then show them automatically.
2. **Coverage hours per package** (for example "up to 10 hours"). Today the site says "one day of coverage".
3. **Delivery timelines** (photos, films, album). The site says they are written into the quote; the agreement
   template says "usually four to eight weeks" and "a preview within 72 hours", which the 23 Oct audit flagged as
   unconfirmed. Confirm, and they can go on the package cards.
4. **Wedding films.** No YouTube links are in `videos.json` yet. Add them from the admin page; the cinematography page
   and portfolio show them automatically.
5. **Real wedding stories.** If you tell us which photos belong to the same couple (and get their permission), the
   chapters can become one couple's story with their names.
6. **Maternity and newborn photographs.** None in the portfolio yet; those categories stay hidden until there are some.
7. **Team photos, names and behind-the-scenes shots** for the About page.
8. **Studio street address and Google Maps link**, if clients can visit. Structured data has city and state only.
9. **Business numbers** (years shooting, weddings covered) if you want them shown; none are on the site.

## Testing done

- `npm run lint`, `npm run typecheck`, `npm run build`: pass.
- 13 routes on a 390px phone and a 1440px desktop: no horizontal scroll, no console errors, one H1 each.
- Builder: Haldi + Wedding, 2 photographers, 1 cinematographer, drone, album, film gives ₹58,200, shown as
  ₹58,000 + GST; the same lines reach the form and the WhatsApp message.
- Form: empty send shows four errors; a valid send opens WhatsApp with the formatted enquiry and shows the
  thank-you state.
- Portfolio: `/portfolio#candid` opens on Candid moments; lightbox opens, arrow keys move, Escape closes.
