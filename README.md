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
| `CONTACT_WEBHOOK_URL` | Where contact form submissions are POSTed as JSON (Zapier, Make, Slack, a CRM, your own API). Without it, the form succeeds only in local development and shows an "email us" fallback in production. Paid shop orders are POSTed here too (`"type": "shop_order"`). |
| `RAZORPAY_KEY_ID` | Razorpay Key ID for shop payments (`rzp_test_...` or `rzp_live_...`). Read on the server at run time and handed to Razorpay Checkout, so changing it needs no rebuild. |
| `RAZORPAY_KEY_SECRET` | The matching Razorpay Key Secret. Server only: used to create orders and to verify payment signatures. Never commit it. Without both keys the cart offers WhatsApp ordering and "Pay online" says it is unavailable. |

## GitHub Pages

The site is published at https://debi1243.github.io/Zoomin-Fotos/ from the `gh-pages` branch.
`.github/workflows/deploy-pages.yml` rebuilds it on every push to `main` as a static export
(`STATIC_EXPORT=1`, `BASE_PATH=/<repo>`). Static hosting has no server, so the contact form posts
from the browser to the `CONTACT_ENDPOINT` repository variable (for example a Formspree URL);
without one it asks visitors to email instead.

## Self-hosted at zoominfotos.in

The live site runs on the DevLab server as a Docker container (`Dockerfile`, `deploy/docker-compose.yml`),
published through its own Cloudflare Tunnel. Every push to `main` goes live automatically: the server runs
`deploy/auto-deploy.sh` from cron every minute, pulls new commits and rebuilds, which takes about 3 minutes.
A failed build leaves the previous version running. Progress is logged to `~/zoominfotos-deploy.log` on the server.

To redeploy without waiting, run `deploy/deploy.sh` (needs Tailscale and SSH access to the server).
Secrets live only on the server in `deploy/.env`: `CLOUDFLARE_TUNNEL_TOKEN`, and optionally `CONTACT_WEBHOOK_URL`,
`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. After changing `deploy/.env`, run `deploy/auto-deploy.sh --force` on the server
(or `deploy/deploy.sh` from your machine) so the container restarts with the new values.

## Shop payments (Razorpay)

The shop (`/shop`, switched on with `shopEnabled` in `src/lib/site.ts`) takes payment through Razorpay Checkout, next to
WhatsApp ordering.

1. The visitor fills their cart, taps **Checkout and pay online** and enters name, mobile, email (optional) and delivery address.
2. The `startCheckout` Server Action (`src/app/shop/actions.ts`) prices the cart from `src/content/shop.json` and creates a
   Razorpay order with the customer details in its notes. The browser never sets the amount.
   Orders below ₹1 (100 paise, Razorpay's minimum) are refused. If Razorpay rejects the keys (HTTP 401) the server
   logs it and the customer is pointed to WhatsApp.
3. Razorpay Checkout opens (UPI, cards, netbanking, wallets). On success, `confirmPayment` checks Razorpay's HMAC SHA-256
   signature with the Key Secret, then sends the paid order to the studio's Google Sheet (which emails it) and
   `CONTACT_WEBHOOK_URL`, whichever are set up. Every order is also in the Razorpay dashboard under **Orders** and **Payments**.

Online payment needs the Node server (Docker image). The GitHub Pages static export has no server, so it shows WhatsApp ordering only.

**Test mode.** Put the test Key ID and its secret in `deploy/.env` (never in git; `.env*` is ignored):

```
RAZORPAY_KEY_ID=rzp_test_U1AvYvPQ8YN0V8
RAZORPAY_KEY_SECRET=<test Key Secret from the Razorpay dashboard>
```

For local development, put the same two lines in `.env.local` and run `npm run dev`. The Key ID reaches the browser only
through the checkout response, so no `NEXT_PUBLIC_` copy is needed. Pay with Razorpay's test card
`4111 1111 1111 1111` (any future expiry, any CVV) or the test UPI ID `success@razorpay`. No real money moves.

**Going live.** Finish account activation (KYC) in the Razorpay dashboard, switch the dashboard to Live mode, open
**Account & Settings → API Keys** and generate live keys. Replace both values in `deploy/.env` with the `rzp_live_...`
pair and redeploy with `--force`. Make sure every product in `shop.json` has its real price (`placeholder` removed),
because that is what customers are charged. Regenerate a key in the dashboard if its secret was ever shared.

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
