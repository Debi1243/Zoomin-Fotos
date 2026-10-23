# Zoomin Fotos: audit and redesign plan

23 Oct 2026. Covers Phase 1 (audit) and the strategy for Phases 2 to 10 of the master prompt.

Sources checked: the live site https://zoominfotos.in (desktop and a 375px phone), the repository in
`D:\Zoomin Fotos\Website`, and the earlier audit in `docs/audit-2026-10-23.md` (its Lighthouse numbers are
reused below and labelled as lab data). Anything I could not verify is marked **UNVERIFIED**.

---

## 0. Status you need to know first

- **The WhatsApp and pricing work from this morning is not live.**
  - It sits on the `zoomin-main` branch (commit 461e44a) and was never merged into `main`.
  - The live site is built from `main`. I checked the live HTML: there is no `wa.me` link anywhere,
    and no home-page pricing section.
  - On top of that branch there are more uncommitted edits on your PC (21 files). I have not touched them.
- **The live enquiry form may be silently failing.**
  - The form only delivers if `CONTACT_WEBHOOK_URL` is set on the server, or a Google Sheet endpoint is set in
    `settings.json`. The sheet endpoint is empty.
  - If the webhook is also missing, every live visitor sees "Our form is offline right now".
  - **UNVERIFIED.** I did not send a test enquiry, because that would email the studio.

---

## 1. Brutally honest audit

### 1.1 First impression (home page)

| What a visitor sees | Verdict |
|---|---|
| Phone, first screen: logo, a theme switcher, six **empty** story circles, the headline, two buttons. **No photograph at all.** | Bad. A photography site that shows no photo above the fold on a phone. |
| Headline "Photographs that feel like the day did." | Pretty, but says nothing commercial: not what you shoot, not the price, not that booking is easy. |
| Dark, near-black theme with orange-pink gradients and a serif italic | Reads as an expensive boutique studio. That is the opposite of "affordable, high-volume". |
| The only price on the page is "Starting ₹25,000" and "Starting ₹15,000" in the services list, far down the page | Pricing, your biggest advantage, is effectively hidden. |
| Primary button "Check your date" | Better than "Discover more", but it goes to a long form, not WhatsApp. |

### 1.2 Branding, type and colour

- Fonts: Instrument Serif (display), Geist and Geist Mono. The monospace labels ("PHOTOGRAPHY STUDIO /
  BHUBANESWAR") feel like a tech product, not a family photographer.
- A light/system/dark theme switch sits in the header. Customers don't need it; it takes the space the
  WhatsApp button should have.
- Each service has its own "festive" colour, plus gradients and glows. Too many colours; none of them signals
  "click here to book".
- Logo: a camera-shaped wordmark. Fine, keep it.

### 1.3 Navigation and information architecture

- Desktop nav: Home, About, Portfolio, Services, Contact, plus "Book a shoot". **No "Packages" entry**, so the
  most wanted page (prices) has no door.
- Phone: an app-style bottom tab bar (Home, About, Portfolio, Services, Book). Good idea, but none of the five
  tabs is WhatsApp or prices.
- The site has 6 services: Weddings, Pre-wedding, Portraits, Maternity & Newborn, Events, Commercial.
  Your brief lists 7, with **Baby & Kids**, **Birthday & Event** and **Family Portraits** as their own items.
  Those don't exist as pages today; see 2.1 for how I'd handle that without inventing content.
- Extra pages: `/testimonials` (empty), `/portal` (client portal with invoices and UPI QR), `/admin`
  (noindex). The portal and admin are real, working features. They stay.

### 1.4 Services, packages and prices (verified on the live site today)

**Weddings** (per day, plus GST, "price is negotiable"):

| Package | Price | Team | Inclusions as published |
|---|---|---|---|
| Essence | ₹25,000 | 1 photographer, 1 cinematographer | All raw photos (high resolution), all raw videos, 1 premium album (standard), 1 full-length edited video |
| Signature | ₹35,000 | 2 photographers, 1 cinematographer | All raw photos and videos, 1 premium album (standard), 20 edited photos, highlight video (4 to 5 min), 1 full-length edited video |
| Luxe | ₹45,000 | 2 photographers, 2 cinematographers | Raw photos and videos, 1 premium album (standard), 50 edited photos, teaser, highlight video (4 to 5 min), full-length video, 1 Instagram reel |
| Infinity | ₹55,000 | 2 photographers, 2 cinematographers, 1 drone | Raw photos and videos, 150 edited photos, invitation video, highlight film (7 to 10 min), full-length video, luxury album (14x40, 35 pages), 2 to 3 reels |

- Infinity carries a "MOST COMPLETE" badge. That is a factual label, not a fake "most popular". Keep it that way.
- **Pre-wedding:** from ₹15,000 per shoot plus GST: photography, drone shots, edited photos, premium album.
- **Package builder** (weddings page): per-event pricing. ₹9,000 per photographer or cinematographer,
  drone ₹5,000, traditional video ₹7,000, live streaming ₹8,000, album ₹4,000, teaser ₹3,000, full film ₹3,000,
  same-day edit ₹12,000, extra hour ₹2,500. It is a genuinely useful tool, buried at the bottom of one page.
- **Portraits, Maternity & Newborn, Events, Commercial: no prices anywhere.** "Quote after a short call".
  **UNVERIFIED** prices; I will not invent any.

### 1.5 Copy that contradicts itself (trust risk)

- The site promises "Each delivered photograph is edited individually" and "a private online gallery of
  individually edited images". But Essence includes **no edited photos**, and Signature has 20.
  A couple who books Essence will feel misled.
- The weddings intro says "A lead photographer and a second shooter work as one". Essence has **one** photographer.
- Pre-wedding: "Two outfit changes" under "You receive", but the FAQ says "one outfit change".
- Claims with no evidence in the repo (**UNVERIFIED**, need your yes/no):
  "72-hour preview", "reply within one working day", "hold the date for a week",
  "dates fill six to nine months ahead", "dual-card cameras and same-night backups in two places",
  "travel at cost, no markup", "same-day selects" (events), "usage licence" (commercial),
  "up to twelve people in a family session".
- No published policy on: delivery time, advance payment, date change, cancellation. The brief's FAQ needs all four.

### 1.6 Portfolio

- 68 real photographs, 12 MB in total, WebP. Strong wedding work.
- Uneven coverage: Weddings 37, Portraits 14, Commercial 7, Pre-wedding 5, Maternity & Newborn 3, **Events 2**.
  An Events page with two photos undersells the service.
- The home page renders **234 `<img>` tags** (the same photos repeated in two infinite marquees and a
  scroller). That is the "hundreds of images" the brief warns against, and it is the main reason the phone
  version is slow.
- No stock or AI images found. Good, keep it that way.

### 1.7 Conversion paths

| Path | Today |
|---|---|
| WhatsApp | **Not on the live site.** The number is printed as "+91 70222 49799" (a `tel:` link). |
| Enquiry form | `/contact`. Requires **email** and a **20-character message**; phone is **optional**. Backwards for an Indian, WhatsApp-first audience: phone should be required, email optional. No budget field. |
| Package "Enquire" buttons | Live: open a blank form (the package is lost). Fixed on `zoomin-main`, not live. |
| Delivery of form leads | Depends on a server setting. **UNVERIFIED**, see section 0. |
| Reviews | `/testimonials` is empty; the home page says "Kind words" with no words. A link to Google is the only proof. |
| Sticky action on phone | Bottom tab bar has "Book" (goes to the form). No WhatsApp. |

### 1.8 Mobile

- No horizontal scroll, tap targets are big, the bottom tab bar works. Those are real strengths.
- But: no photo above the fold, no price above the fold, no WhatsApp, a long scroll of repeated photo strips
  before reaching services.

### 1.9 Performance (lab data from this morning's Lighthouse runs, not real-user data)

- Live home, phone: score 52, LCP 5.0 s, total blocking time 1,400 ms, CLS 0, 963 KiB, 1,703 DOM elements.
- Live home, desktop: score 94, LCP 1.2 s.
- Causes: Motion animation library, Lenis smooth scrolling, always-running marquees, a scroll-progress
  spring and 234 images. Image handling itself is good (`next/image`, AVIF/WebP, fixed ratios, CLS 0).
- No real-user (CrUX) data exists yet; the site is too new or too small. **The 2.5 s LCP target is not met on phones.**

### 1.10 SEO

- Good: unique titles and descriptions, canonical URLs, `sitemap.xml` (12 URLs), Open Graph image,
  ProfessionalService, Service, Breadcrumb and FAQ structured data, `/admin` and `/portal` noindexed.
- Weak: titles and the H1 don't use the words people search ("wedding photographer in Bhubaneswar",
  "photography packages price"). Prices are not in the home page text Google reads first.
- `robots.txt` has a Cloudflare-managed block in front of yours. Harmless for Google; it is a Cloudflare
  dashboard setting, not code.
- **UNVERIFIED:** Google Search Console and Google Business Profile status. I have no access.

### 1.11 Technology (reusable)

- Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, Lenis, Zod, Lucide.
- All public pages prerender as static HTML. Docker container on your own server behind a Cloudflare Tunnel;
  a push to `main` goes live in about 3 minutes (`deploy/auto-deploy.sh`).
- Content lives in JSON (`src/content/*.json`) and `src/lib/data.ts`, edited from `/admin`, which commits to GitHub.
- Analytics: only Cloudflare Web Analytics (if on in the dashboard). The site's own event tracking (`src/lib/track.ts`)
  is off because the Sheet endpoint is empty. **No GA4.**

### 1.12 Keep, change, remove

| Keep | Change | Remove |
|---|---|---|
| Real photos and the photo pipeline | Dark boutique theme to the warm light palette in the brief | Theme switcher in the header |
| Next.js stack, static pages, Docker deploy | Hero: real photo first, commercial headline, price and WhatsApp | Duplicate marquees (234 images to about 30) |
| `/admin`, `/portal`, package builder | Form: phone required, email optional, budget field, WhatsApp hand-off | Lenis smooth scroll on phones |
| Package data model, structured data | Copy that contradicts the packages | Empty "Kind words" block until real reviews exist |
| All current URLs | Fonts to Plus Jakarta Sans and Manrope | Monospace labels |

---

## 2. Redesign strategy

### 2.1 Information architecture

Navigation: **Home · Services · Packages · Portfolio · About · Contact**, plus a terracotta **Book Your Shoot**
button. On phones: a compact header with a WhatsApp icon, and a sticky bottom bar with
**WhatsApp** and **Get a Quote**.

| URL | Status | Purpose |
|---|---|---|
| `/` | redesign | Sections in the order of the brief |
| `/services` | redesign | All services with photo, "from" price where verified, link |
| `/services/weddings`, `/pre-wedding`, `/portraits`, `/maternity-newborn`, `/events`, `/commercial` | redesign, **same URLs** | Service landing pages (2.5) |
| `/packages` | **new** | Every package on one page, comparison table, package builder, GST and payment notes |
| `/portfolio` | redesign | Filterable gallery |
| `/about` | redesign | Who you are (needs your input) |
| `/contact` | redesign | Quick enquiry form, WhatsApp, phone, map |
| `/testimonials` | keep, hidden from nav until reviews exist | |
| `/portal`, `/admin/*` | untouched | |

On the services you listed that have no page: **Family Portraits** fits inside `/services/portraits` (rename the
card "Family & Portraits"). **Baby & Kids** fits inside Maternity & Newborn ("Maternity, Newborn & Kids"), and
**Birthday & Event** is the existing Events page. That gives every service in your brief a home without
thin pages. If you want them as separate pages later, they need their own photos and prices first.

### 2.2 Design system ("modern editorial commerce")

**Colour tokens** (from the brief, with contrast checked):

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | #FAF8F5 | Page background | |
| `--surface` | #FFFFFF | Cards, forms | |
| `--sand` | #E9E2D9 | Alternating sections, borders on hover | |
| `--ink` | #202020 | Headings, body | 15.4:1 on bg |
| `--ink-2` | #666666 | Secondary text | 5.5:1 on bg, passes AA |
| `--cta` | #B65C45 | Buttons and price highlights only | white text on it 4.56:1, passes AA. As text on the page background it is 4.3:1, so only for large text (prices, 24px+) |
| `--cta-hover` | #9E4C37 | Hover/pressed | |
| `--line` | #E4DDD3 | Hairline borders | |
| `--wa` | #1F7A4D | WhatsApp button (darker than WhatsApp green so white text passes AA) | 5.3:1 |

Terracotta is used only for things you can press to book. No gradients, no gold, no black sections.
Dark mode: dropped. The brand is warm and light, and a second theme doubles the QA for no conversion gain.

**Type:** Plus Jakarta Sans (headings, 600/700) and Manrope (body, 400/500/600), self-hosted with `next/font`.

| Style | Phone | Desktop | Weight |
|---|---|---|---|
| Display (hero) | 36px / 1.1 | 60px / 1.05 | Jakarta 700 |
| H2 | 28px | 40px | Jakarta 700 |
| H3 | 20px | 24px | Jakarta 600 |
| Price | 28px | 32px | Jakarta 700, tabular figures |
| Body | 16px / 1.6 | 17px / 1.65 | Manrope 400 |
| Small, labels | 14px | 14px | Manrope 500/600 |

**Spacing:** an 8px scale (4, 8, 16, 24, 32, 48, 64, 96). Section padding 64px on phones, 96px on desktop.
**Radius:** 8px for buttons and inputs, 12px for cards, 16px for large photos. **Shadow:** a single soft
shadow for raised cards and the sticky bar; everything else uses a 1px border.
**Buttons:** primary (terracotta), WhatsApp (green with icon), secondary (outlined ink), text link.
Every button gets hover, pressed, focus ring, disabled and loading states. Height 48px minimum.
**Motion:** fade-up on scroll only (CSS, no library), 200 ms hovers, all of it off with `prefers-reduced-motion`.

### 2.3 Homepage wireframe (phone first)

```
[Header] logo · WhatsApp icon · menu          (sticky, white after scroll)
[1 HERO] full-bleed real photo (the Sindoor daan portrait), dark overlay at the bottom
   📍 Bhubaneswar, Odisha
   Beautiful Memories. Affordable Photography.
   Professional wedding, pre-wedding, maternity, family and event photography
   with transparent packages and effortless booking.
   Weddings from ₹25,000 · Pre-wedding from ₹15,000 (+GST)
   [Explore Packages]  [Chat on WhatsApp]
[2 SERVICES] 2-column photo cards on phone, 3 on desktop
   photo · name · "from ₹X" (only where verified, else "Ask for a quote") · one line · View packages →
[3 PACKAGES] 4 wedding cards, swipe on phone, grid on desktop
   name · price + GST · team · 4 key inclusions · [Book this package]
   "Compare all packages" → /packages   ·   "Build your own" → package builder
[4 PORTFOLIO] 12 to 18 best photos, filter chips (All, Weddings, Pre-wedding, Portraits, Kids & Family, Commercial)
[5 WHY ZOOMIN] 4 short points, only claims you confirm (e.g. clear prices, raw files included, one point of contact)
[6 REVIEWS] real Google reviews with link, or a single "See our reviews on Google" card until you give me some
[7 HOW BOOKING WORKS] 1 Choose a package · 2 Share your date · 3 We confirm availability
[8 FAQ] 8 questions from the brief, answered only with confirmed policies
[9 FINAL CTA] Your Moments Deserve Beautiful Photography. [Get Your Photography Quote]
[Footer] contact, services, address, Google profile, Instagram
[Sticky phone bar] [WhatsApp] [Get a Quote]
```

### 2.4 Booking flow (the core of the redesign)

A short form, used in three places (the contact page, a bottom sheet from any "Book" button, and the end of
each service page):

1. Service (chips)
2. Event date (date picker, or "Not fixed yet")
3. Location (text, default "Bhubaneswar")
4. Budget (chips that change with the service; weddings: Under ₹25k, ₹25 to 35k, ₹35 to 45k, ₹45 to 55k, ₹55k+;
   other services: "Not sure yet" plus ranges once you give me prices)
5. Name
6. Phone (required, Indian format check)
7. Anything else (optional)

On submit:
- Validate on the phone, then open WhatsApp with a readable message, for example:

  ```
  Hi Zoomin Fotos! New enquiry from the website
  Service: Wedding – Signature (₹35,000 + GST)
  Date: 14 Feb 2027
  Location: Cuttack
  Budget: ₹35–45k
  Name: Priya
  Phone: 98xxxxxxxx
  Notes: Haldi and reception too
  ```
- In parallel, save the lead through the existing server action (webhook or Google Sheet), so a lead is not lost
  if the person never presses "send" in WhatsApp.
- Thank-you state says "We'll confirm availability on WhatsApp". It never says "booked".
- Package buttons pre-fill service, package and price.

### 2.5 Service page template

Hero (one real photo, service name, "from" price or "quote on request", WhatsApp and Quote buttons) →
what's included and **not** included → packages and comparison (weddings, pre-wedding) →
the service's best photos (max 12) → reviews for that service, if any → 4 to 6 FAQs → booking form.
Each page ends at the form. No repeated home-page sections.

### 2.6 Mobile first

Build every section at 375px first. Sticky bottom bar (WhatsApp + Quote) on every page except inside the form.
48px tap targets, `inputmode="tel"` and `autocomplete` on fields, no popups, no horizontal scroll, swipeable
package cards with a visible "1 of 4".

### 2.7 Performance and SEO

- Remove Lenis and the marquees; drop the Motion library from public pages (CSS transitions instead).
  Target: under 100 KB of JavaScript on the home page.
- Hero image with `priority`, 30 or fewer images on the home page, the rest lazy-loaded.
- Fonts: 2 families, subset, `display: swap`.
- Titles like "Wedding Photographer in Bhubaneswar | Packages from ₹25,000 | Zoomin Fotos".
- Keep the existing structured data; add `Offer` prices to the packages page, `LocalBusiness` with
  address and opening hours (needs your address), Breadcrumbs on every page.
- Off-site (you): Google Business Profile with the same name, address and phone; Search Console with the sitemap.

### 2.8 Conversion measurement

| Event | How | What it answers |
|---|---|---|
| page_view, service_view, package_view | GA4 | Which services draw interest |
| whatsapp_click (with service and package) | GA4 event on every WhatsApp button | The main lead signal |
| quote_form_submit (service, budget) | GA4 + saved lead | Form leads by service |
| call_click | GA4 | Phone leads |
| Lead → qualified → booked → ₹ | Your Google Sheet or the admin dashboard, filled in by you | Real bookings and revenue (the site cannot know this on its own) |

GA4 through a single script tag (Google Tag Manager is optional; it adds weight and you don't need it yet),
loaded after a simple consent banner, as India's DPDP Act expects. Conversion rate by service =
WhatsApp clicks + form submits ÷ service page views; bookings and revenue come from the sheet.

### 2.9 Technical approach

- Keep the stack. No migration: it is modern, static, and the deploy pipeline works.
- One `tokens.css` with the design tokens; Tailwind reads them.
- Package and price data stays in one place (`src/lib/data.ts` + `pricing.json`), so the home page,
  packages page, service pages and structured data never disagree.
- New components: `Header`, `StickyBookingBar`, `Hero`, `ServiceCard`, `PackageCard`, `PackageCompare`,
  `PortfolioGrid`, `ReviewList`, `BookingSteps`, `Faq`, `QuoteForm`, `WhatsAppButton`.
- Work on a branch, with a pull request per phase, so nothing reaches the live site without your merge.

### 2.10 Phases and deliverables

| # | Phase | Output |
|---|---|---|
| 1 | Fold in the unmerged `zoomin-main` and local work, fix the contradictory copy | Branch with a clean base |
| 2 | Design tokens, fonts, buttons, cards, header and sticky bar | Component set |
| 3 | Homepage | New home page |
| 4 | Quick enquiry form + WhatsApp hand-off + lead saving | Booking flow |
| 5 | `/packages` and the service page template, all 6 services | Service pages |
| 6 | Phone pass at 320 / 375 / 390 / 430 px | Screenshots |
| 7 | Performance and SEO | Lighthouse before/after |
| 8 | GA4 events and consent | Measurement plan wired |
| 9 | QA: lint, typecheck, build, links, accessibility | Checklist |
| 10 | Pull request, deploy and rollback steps (rollback = revert the merge commit on `main`; the server redeploys in about 3 minutes) | Live site |

---

## 3. What I need from you

Without these I will build with neutral wording ("Ask for a quote", no policy promises) and flag the gaps.

1. **WhatsApp number:** is +91 70222 49799 the official WhatsApp Business number?
2. **Prices** for Portraits/Family, Maternity & Newborn/Kids, Birthdays & Events, Commercial. A "from" price each is enough.
3. **Policies:** delivery time for photos and videos, advance payment to confirm a date, date-change and cancellation terms, travel charges.
4. **Is GST 18% on top of every price?** The site says "+ GST" but never the rate.
5. **Edited photos:** does Essence really include no edited photos? (Otherwise the "every photo edited by hand" line must go.)
6. **Which of the unverified claims in 1.5 are true** (72-hour preview, reply within a day, date hold, backups, etc.)?
7. **Reviews:** 5 to 10 Google reviews you're happy to show with first names.
8. **About:** the photographer's name, a photo, years in business, team size, studio address.
9. **Is the form delivering?** Is `CONTACT_WEBHOOK_URL` set on the server?
