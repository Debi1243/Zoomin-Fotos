# Measuring the enquiry funnel

This is how to see, on the studio dashboard (`/admin/dashboard`), how many visitors become enquiries and bookings.
There are no baseline figures yet. Tracking is off until the Google Sheet is connected (step 1), so every number
below starts from the day you connect it.

## 1. Switch it on (once, about 10 minutes)

1. Open https://zoominfotos.in/admin/dashboard and sign in.
2. Follow the on-screen steps: create a Google Sheet, paste the script, deploy it as a web app, and paste its URL back.
3. The dashboard saves the address to `src/content/settings.json`, and the site redeploys.

The sheet is yours. Nothing goes to a new third-party service.

- **No cookies are used.** A random visitor ID is kept in the visitor's browser so repeat visits can be told apart.
- **No names, emails or messages go into the visit log.** Enquiries are stored only in your sheet's "Enquiries" tab,
  and each one is emailed to you.

## 2. What is recorded

| Funnel step | Where it comes from | Recorded as |
|---|---|---|
| Visitors / page visits | Every page view | `Visits` tab, type `view` (dashboard: Visitors, Page visits, Top pages, Sources) |
| Key service-page visits | Page views of `/services/...` | `view` rows with that path (dashboard: Top pages) |
| CTA clicks | Every link or button click, with its label and target | type `click` (dashboard: Most clicked) |
| WhatsApp / phone / email clicks | Clicks to `wa.me/...`, `tel:`, `mailto:` | type `click`, target shows `wa.me/917022249799`, `tel:+917022249799` or `mailto:...` |
| Package-builder use | "Request this package" click; the full selection goes into the enquiry message | `click` + the enquiry text |
| **Enquiry form starts** (new) | First time someone types or picks something in the form, once per page view | type `start`, label `enquiry` (dashboard: "N started the enquiry form", counted per session) |
| **Successful enquiries** | Only when the sheet or webhook accepted the enquiry | `Enquiries` tab (dashboard: Enquiries) |
| Replied / booked / closed | You set each enquiry's status on the dashboard (New, Replied, Booked, Closed) | `Enquiries` tab, Status column |

A click is never counted as a lead. Only enquiries that were actually delivered appear under Enquiries.

**Fixed in this change:** on the live server, enquiries previously went only to `CONTACT_WEBHOOK_URL` and skipped the sheet.
They now go to both, whichever are set up, and count as sent when either accepts them.

## 3. The numbers to watch (monthly)

| Metric | Formula | Where |
|---|---|---|
| Visitor-to-enquiry rate | Enquiries ÷ Visitors | Dashboard, same date range |
| Form completion rate | Enquiries ÷ form starts | Dashboard |
| Reply rate | Enquiries no longer "New" ÷ Enquiries | Dashboard ("waiting for a reply") |
| Enquiry-to-booking rate | Booked ÷ Enquiries | Sheet, Status column. A separate "Qualified" status would need a small dashboard change. |
| Average booking value | Booking revenue ÷ bookings | Add an "Amount" column to the sheet, or use the client portal invoices |
| Cost per qualified lead | Ad spend ÷ qualified enquiries | Your ad accounts (not on the site) |

Sources: the dashboard shows the referring site for each session (Google, Instagram, WhatsApp, Direct).
For ads, add `?utm_source=instagram&utm_campaign=...` to the link. The referrer shows the site, but UTM tags are not yet
broken out on the dashboard. That is possible future work.

## 4. Not set up (needs your accounts)

- **Google Search Console:** verify `zoominfotos.in` (DNS TXT record in Cloudflare) and submit `https://zoominfotos.in/sitemap.xml`.
- **Google Business Profile:** keep the name, phone (+91 70222 49799) and area identical to the website. Ask happy clients for reviews there.
- **Cloudflare Web Analytics** appears to be enabled at the Cloudflare level (its beacon loads on the live site).
  It gives traffic totals but not enquiries.
- **No GA4 or Meta Pixel.** Add one only if you run ads and need them, and then with a consent banner.
