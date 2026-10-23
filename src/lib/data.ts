import { z } from "zod";
import photoData from "@/content/photos.json";
import videoData from "@/content/videos.json";

// Contact details and formatting live in ./brand, which client components can import without the photo data.
export { brand, formatRupees, locationLine, mailHref, telHref, waLink, whatsappHref } from "./brand";

/**
 * All site content lives here: contact details, services, packages and prices, FAQs.
 * Only publish what the studio has confirmed; never invent prices, reviews or promises.
 */


export type Tone = "dusk" | "amber" | "rose" | "sage" | "sky" | "ink";
export type Aspect = "tall" | "portrait" | "landscape" | "square";
export const serviceSlugs = ["weddings", "pre-wedding", "portraits", "maternity-newborn", "events", "commercial"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export type Photo = {
  id: string;
  category: ServiceSlug;
  title: string;
  place: string;
  aspect: Aspect;
  tone: Tone;
  /** Path under /public, e.g. "/photos/wedding-01.jpg". Until set, a toned frame stands in. */
  src?: string;
  /** Shown in the home page's featured scroller; picked on the admin page. */
  featured?: boolean;
};

/** A film hosted on YouTube, shown as a thumbnail that opens on YouTube. */
export type Video = {
  id: string;
  youtubeId: string;
  title: string;
  category: ServiceSlug;
};

export type Service = {
  slug: ServiceSlug;
  title: string;
  short: string;
  intro: string;
  idealFor: string;
  includes: { title: string; text: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  packages?: Package[];
  /** Line under the packages heading; defaults to the one-day, plus-GST, negotiable note. */
  packagesIntro?: string;
};

export type Package = {
  name: string;
  /** Price in rupees for one day of coverage, before GST. */
  price: number;
  /** Shown as "Starting from" above the price. */
  startingFrom?: boolean;
  /** Small print beside and under the price. */
  unit?: string;
  note?: string;
  tagline: string;
  team?: string;
  items: string[];
  featured?: boolean;
};


const deliveryFaq = {
  q: "When will we receive our photographs?",
  a: "It depends on the package and the size of the shoot. We tell you the delivery date in your quote, before you book, so you know exactly when to expect your photos and videos.",
};

const travelFaq = {
  q: "Do you travel outside Bhubaneswar?",
  a: "Yes. We photograph across Odisha and travel further for weddings and shoots. Travel and stay are quoted separately, so you see them before you book.",
};

export const services: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    short: "Every ritual, every relative, every quiet glance between you, told as one continuous story.",
    intro:
      "From haldi to bidaai, we document your wedding the way it actually unfolds: candid, unhurried and true to colour. Every package pairs photography with video, from one photographer and one cinematographer up to a full crew with drone.",
    idealFor: "Multi-day celebrations, intimate ceremonies and destination weddings.",
    includes: [
      { title: "A team sized to your day", text: "From one photographer and one cinematographer up to a full crew with drone, so both families and both sides of the mandap are covered." },
      { title: "Ritual planning call", text: "We walk through the schedule with you and your family so we are in place before each moment." },
      { title: "Couple portraits", text: "A relaxed, guided half hour away from the crowd, timed for the best light of the day." },
      { title: "Premium album", text: "Every package includes a printed album, designed by us. Infinity upgrades to a 14x40 luxury album." },
    ],
    deliverables: ["All raw photos and videos", "Premium photo album", "Full-length edited video", "Online gallery"],
    faqs: [
      {
        q: "Are the package prices fixed?",
        a: "Prices are for one day of coverage, plus GST, and are negotiable. Multi-day weddings, travel and add-ons are quoted together so you get one clear number.",
      },
      {
        q: "How far in advance should we book?",
        a: "As soon as you know your date. Dates are booked in the order they are confirmed, so send yours early and we will tell you straight away if it is free.",
      },
      deliveryFaq,
      travelFaq,
    ],
    packages: [
      {
        name: "Essence",
        price: 25000,
        tagline: "The beginning of beautiful memories",
        team: "1 photographer, 1 cinematographer",
        items: ["All raw photos (high resolution)", "All raw videos", "1 premium photo album (standard size)", "1 full-length edited video"],
      },
      {
        name: "Signature",
        price: 35000,
        tagline: "More moments, more stories",
        team: "2 photographers, 1 cinematographer",
        items: [
          "All raw photos and videos",
          "1 premium photo album (standard size)",
          "20 edited photos",
          "Highlight video (4 to 5 mins)",
          "1 full-length edited video",
        ],
      },
      {
        name: "Luxe",
        price: 45000,
        tagline: "Every detail, beautifully told",
        team: "2 photographers, 2 cinematographers",
        items: [
          "All raw photos and videos",
          "1 premium photo album (standard size)",
          "50 edited photos",
          "Teaser video",
          "Highlight video (4 to 5 mins)",
          "1 full-length edited video",
          "1 Instagram reel",
        ],
      },
      {
        name: "Infinity",
        price: 55000,
        tagline: "A complete story from every angle",
        team: "2 photographers, 2 cinematographers, 1 drone",
        featured: true,
        items: [
          "All raw photos and videos",
          "150 edited photos",
          "Wedding invitation video",
          "1 highlight film (7 to 10 mins, cinematic and storyline driven)",
          "1 full-length edited video",
          "1 luxury album (14x40, 35 pages)",
          "2 to 3 Instagram reels",
        ],
      },
    ],
  },
  {
    slug: "pre-wedding",
    title: "Pre-wedding",
    short: "An unhurried session somewhere that means something to you both, before the rush begins.",
    intro:
      "A pre-wedding shoot is the best way to get comfortable in front of the camera before the big day. We help you choose a location, outfits and time of day, then let the conversation do the rest.",
    idealFor: "Save-the-dates, invitations and couples who want images with room to breathe.",
    includes: [
      { title: "Location scouting", text: "Beaches, temples, old streets or your favourite cafe: we suggest places that suit your story and the light." },
      { title: "Styling guidance", text: "A short guide on outfits, colours and props so the photographs feel timeless, not trendy." },
      { title: "Golden-hour timing", text: "Sessions are planned around the softest light of the day, morning or evening." },
      { title: "Save-the-date edits", text: "A few images formatted for invitations and social posts, delivered first." },
    ],
    deliverables: ["Edited photos", "Drone shots", "Premium album", "Save-the-date edits"],
    packagesIntro: "One session, everything included. Tell us where you would like to shoot and we will plan the light, the outfits and the route.",
    packages: [
      {
        name: "Pre-wedding shoot",
        price: 15000,
        startingFrom: true,
        unit: "per shoot + GST",
        note: "Includes everything",
        tagline: "More than pictures, a story of you",
        items: ["Professional photography", "Drone shots", "Edited photos", "Premium album"],
      },
    ],
    faqs: [
      {
        q: "How much does a pre-wedding shoot cost?",
        a: "Pre-wedding shoots start from ₹15,000 plus GST and include everything: professional photography, drone shots, edited photos and a premium album. Travel to faraway locations is quoted separately.",
      },
      { q: "How long is a pre-wedding session?", a: "It depends on the locations you choose. We plan the timing, the route and your outfit changes with you before the shoot." },
      travelFaq,
      deliveryFaq,
    ],
  },
  {
    slug: "portraits",
    title: "Portraits",
    short: "Honest portraits for individuals, couples and families, made without stiff poses.",
    intro:
      "Whether it is a family gathering, a milestone birthday or a new profile picture, we direct gently and keep things moving so you look like yourself on your best day.",
    idealFor: "Families, couples, graduates, artists and professionals.",
    includes: [
      { title: "Studio or outdoors", text: "Shoot in our studio with controlled light, or on location at home, in a park or by the sea." },
      { title: "Gentle direction", text: "Small prompts instead of rigid poses, so expressions stay natural." },
      { title: "Wardrobe check", text: "We help pick outfits that photograph well together before the day." },
      { title: "Light retouching", text: "Skin and stray hairs tidied, never reshaped. You still look like you." },
    ],
    deliverables: ["Online gallery", "Retouched selects", "Print-ready files"],
    faqs: [
      { q: "Can we bring our pets?", a: "Please do. Tell us in advance so we can plan the session around them." },
      { q: "How many people can be in a family session?", a: "Up to twelve people in a standard session. Larger gatherings are quoted as an event." },
      deliveryFaq,
    ],
  },
  {
    slug: "maternity-newborn",
    title: "Maternity & Newborn",
    short: "Soft, calm sessions for the weeks you will want to remember in detail.",
    intro:
      "We photograph maternity sessions from around 30 weeks and newborns in their first two weeks. Sessions are slow, warm and led entirely by the baby's routine, with safety first in every set-up.",
    idealFor: "Expecting parents, new families and siblings meeting the baby.",
    includes: [
      { title: "Home or studio", text: "We come to you, or you visit our warm, quiet studio set up for little ones." },
      { title: "Baby-led pace", text: "Feeds, cuddles and naps come first. A session takes as long as it needs." },
      { title: "Safe posing", text: "Simple, natural positions only, with a parent's hand always close by." },
      { title: "Wraps and props", text: "Neutral wraps, blankets and a few heirloom props are provided." },
    ],
    deliverables: ["Online gallery", "Retouched selects", "Fine-art prints"],
    faqs: [
      { q: "When should we book a newborn session?", a: "During pregnancy. We pencil in your due date and confirm the session once the baby arrives." },
      {
        q: "Is the studio safe for newborns?",
        a: "Yes. It is kept warm, quiet and clean, and we never use poses that rely on balance or props to hold the baby.",
      },
      deliveryFaq,
    ],
  },
  {
    slug: "events",
    title: "Events",
    short: "Birthdays, anniversaries, launches and gatherings, captured without interrupting them.",
    intro:
      "We blend into the room and photograph the people, speeches and small moments that make an event worth remembering, then deliver quickly so you can share while the excitement is fresh.",
    idealFor: "Birthdays, anniversaries, family functions, corporate events and launches.",
    includes: [
      { title: "Discreet coverage", text: "We work quietly in the background so guests behave like guests, not subjects." },
      { title: "Group photographs", text: "Organised family and team groups, done quickly so nobody misses the party." },
      { title: "Same-day selects", text: "A handful of edited images sent the same evening for social sharing." },
      { title: "Flexible hours", text: "Book by the hour, from short gatherings to full-day programmes." },
    ],
    deliverables: ["Online gallery", "Same-day selects", "Print-ready files"],
    faqs: [
      { q: "Can you cover an event at short notice?", a: "Often, yes. Message us on WhatsApp with the date and time and we will tell you whether we are free." },
      travelFaq,
      deliveryFaq,
    ],
  },
  {
    slug: "commercial",
    title: "Commercial",
    short: "Product, food, interior and brand photography that sells as well as it looks.",
    intro:
      "Clear, consistent images for menus, catalogues, websites and campaigns. We plan each shot list around where the photographs will be used, from marketplace listings to billboards.",
    idealFor: "Restaurants, retailers, hotels, makers and growing brands.",
    includes: [
      { title: "Shot list planning", text: "We agree every angle, crop and format before the shoot, so nothing is missed." },
      { title: "Studio and on-site", text: "Tabletop and product work in our studio; interiors and teams on location." },
      { title: "Consistent styling", text: "Backgrounds, light and colour kept consistent across the whole catalogue." },
      { title: "Usage licence", text: "Clear commercial usage rights for web, print and advertising." },
    ],
    deliverables: ["Edited image set", "Marketplace crops", "Web-optimised files", "Usage licence"],
    faqs: [
      { q: "Do you provide props and styling?", a: "Basic surfaces and props are included. Food and prop stylists can be arranged for larger shoots." },
      {
        q: "Can you match our brand guidelines?",
        a: "Yes. Share your guidelines and any reference images, and we will match colour and mood across every shot.",
      },
      deliveryFaq,
    ],
  },
];

/**
 * Portfolio. Real photographs live in src/content/photos.json, which the admin page
 * (/admin) edits; their files are in /public/photos. The toned frames below stand in
 * for any service that has no real photographs yet.
 */
const placeholderPhotos: Photo[] = [
  { id: "03", category: "pre-wedding", title: "Low tide", place: "Puri", aspect: "portrait", tone: "sky" },
  { id: "06", category: "maternity-newborn", title: "Eight days old", place: "Home session", aspect: "portrait", tone: "rose" },
  { id: "05", category: "commercial", title: "Chhena poda, close up", place: "Studio", aspect: "square", tone: "rose" },
  { id: "18", category: "events", title: "Odissi recital", place: "Rabindra Mandap", aspect: "portrait", tone: "dusk" },
  { id: "08", category: "pre-wedding", title: "Temple steps", place: "Konark", aspect: "landscape", tone: "sage" },
  { id: "12", category: "maternity-newborn", title: "Thirty-four weeks", place: "Chilika", aspect: "landscape", tone: "sky" },
  { id: "11", category: "commercial", title: "Handloom, folded", place: "Studio", aspect: "portrait", tone: "amber" },
  { id: "15", category: "pre-wedding", title: "Monsoon umbrella", place: "Bhubaneswar", aspect: "square", tone: "ink" },
  { id: "16", category: "commercial", title: "Boutique interior", place: "Bhubaneswar", aspect: "landscape", tone: "sage" },
  { id: "13", category: "events", title: "First birthday", place: "Bhubaneswar", aspect: "square", tone: "rose" },
  { id: "07", category: "events", title: "The last speech", place: "Cuttack", aspect: "landscape", tone: "ink" },
];

const photoSchema = z.object({
  id: z.string().min(1),
  category: z.enum(serviceSlugs),
  title: z.string().min(1),
  place: z.string(),
  aspect: z.enum(["tall", "portrait", "landscape", "square"]),
  tone: z.enum(["dusk", "amber", "rose", "sage", "sky", "ink"]),
  src: z.string().startsWith("/photos/"),
  featured: z.boolean().optional(),
});

export const realPhotos: Photo[] = z.array(photoSchema).parse(photoData);

export const photos: Photo[] = [...realPhotos, ...placeholderPhotos];

/** The photographs picked for the home page scroller on the admin page, in portfolio order. */
export const featuredPhotos: Photo[] = realPhotos.filter((p) => p.featured);

const videoSchema = z.object({
  id: z.string().min(1),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string().min(1),
  category: z.enum(serviceSlugs),
});

/** Films, edited from the admin page (src/content/videos.json). */
export const videos: Video[] = z.array(videoSchema).parse(videoData);

export const videosIn = (category: ServiceSlug) => videos.filter((v) => v.category === category);

/**
 * The photographs with these ids, in order, topped up with other photographs when any
 * have been deleted, so featured spots never come up empty.
 */
export function pickPhotos(ids: string[], count = ids.length): Photo[] {
  const chosen = ids.map((id) => realPhotos.find((p) => p.id === id)).filter((p): p is Photo => !!p);
  const rest = photos.filter((p) => !chosen.includes(p));
  return [...chosen, ...rest].slice(0, count);
}

/** The three steps from first message to a confirmed date. */
export const bookingSteps = [
  {
    title: "Choose your package",
    text: "Compare the packages and prices, or build your own. Not sure yet? Just tell us the occasion.",
  },
  {
    title: "Share your date and needs",
    text: "Send your date, place and budget through the quick form or on WhatsApp. It takes under a minute.",
  },
  {
    title: "Confirm and book",
    text: "We check availability and send the final details. Your date is booked once we have both confirmed and the advance is paid.",
  },
];

/**
 * Why book with us. Every point here is backed by what the site itself publishes:
 * the prices, the package contents and the package builder.
 */
export const reasons = [
  {
    title: "Prices on the page",
    text: "Wedding packages from ₹25,000 and pre-wedding shoots from ₹15,000, plus GST. No “call for price” guessing.",
  },
  {
    title: "Photos and video together",
    text: "Every wedding package includes a photographer and a cinematographer, all raw files, an album and a full-length film.",
  },
  {
    title: "Packages that flex",
    text: "Pick a ready package or build your own, event by event. Every price is negotiable.",
  },
  {
    title: "Booking on WhatsApp",
    text: "Ask questions, check your date and confirm your booking in the app you already use.",
  },
];

export const homeFaqs = [
  {
    q: "What is included in a package?",
    a: "Each package lists its team, photos, videos and album on the packages page. Every wedding package includes all raw photos and videos, a full-length edited video and a printed album; the bigger packages add edited photos, highlight films, reels and a drone.",
  },
  {
    q: "Is GST included in the price?",
    a: "No. All prices are shown before GST, which is added to your final invoice.",
  },
  {
    q: "How do I confirm my booking?",
    a: "Send your date through the quick form or on WhatsApp. We check availability and agree the details with you. Your date is booked once we have both confirmed and the advance is paid.",
  },
  {
    q: "Can I customise a package?",
    a: "Yes. Every price is negotiable, and you can build your own wedding package event by event, adding photographers, cinematographers, a drone, an album or a same-day edit.",
  },
  travelFaq,
  deliveryFaq,
  {
    q: "What happens if my event date changes?",
    a: "Tell us as soon as you know. We will check the new date and confirm what changes, if anything, before you commit. Date-change terms are written into your quote.",
  },
  {
    q: "What are the cancellation terms?",
    a: "Cancellation terms are set out in writing in your quote, before you pay any advance. Ask us on WhatsApp if you would like to see them first.",
  },
];

/**
 * The kinds of shoot customers look for, each pointing at the service page that covers it.
 * Maternity shares a card with baby and kids (one page covers both), and family portraits sit
 * with portraits. Prices are only shown where the studio publishes them.
 */
export const homeServices: { title: string; slug: ServiceSlug; photoId: string; text: string }[] = [
  { title: "Wedding", slug: "weddings", photoId: "81", text: "Every ritual from haldi to bidaai, in photos and film." },
  { title: "Pre-Wedding", slug: "pre-wedding", photoId: "24", text: "A relaxed shoot at a place that means something to you both." },
  { title: "Maternity, Baby & Kids", slug: "maternity-newborn", photoId: "44", text: "Calm sessions for bumps, newborns and little ones, at their own pace." },
  { title: "Birthday & Event", slug: "events", photoId: "70", text: "Birthdays, anniversaries and functions, without interrupting them." },
  { title: "Family & Portraits", slug: "portraits", photoId: "73", text: "Natural portraits for families, couples and individuals." },
  { title: "Commercial", slug: "commercial", photoId: "42", text: "Product, food and brand photos that help you sell." },
];

/** The lowest published price for a service, if it publishes any. */
export function startingPrice(slug: ServiceSlug) {
  const prices = (getService(slug)?.packages ?? []).map((p) => p.price);
  return prices.length ? Math.min(...prices) : null;
}

/**
 * The wedding packages side by side. Each cell is copied from the package's own list above;
 * "—" means the package does not list it (it can still be added, see the package builder).
 */
export const weddingComparison: { label: string; values: [string, string, string, string] }[] = [
  { label: "Coverage", values: ["1 day", "1 day", "1 day", "1 day"] },
  { label: "Photographers", values: ["1", "2", "2", "2"] },
  { label: "Cinematographers", values: ["1", "1", "2", "2"] },
  { label: "Drone", values: ["—", "—", "—", "Yes"] },
  { label: "All raw photos and videos", values: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Edited photos", values: ["—", "20", "50", "150"] },
  { label: "Photo album", values: ["Premium, standard size", "Premium, standard size", "Premium, standard size", "Luxury 14x40, 35 pages"] },
  { label: "Full-length edited video", values: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Highlight video", values: ["—", "4 to 5 min", "4 to 5 min", "7 to 10 min cinematic film"] },
  { label: "Teaser video", values: ["—", "—", "Yes", "—"] },
  { label: "Instagram reels", values: ["—", "—", "1", "2 to 3"] },
  { label: "Wedding invitation video", values: ["—", "—", "—", "Yes"] },
];

const serviceBySlug = new Map<string, Service>(services.map((s) => [s.slug, s]));

export function getService(slug: string) {
  return serviceBySlug.get(slug);
}

/**
 * Photos for one service. Once a service has real photographs, its placeholder frames
 * are dropped; a service with none keeps its toned frames so the page is not empty.
 */
export function photosIn(category: ServiceSlug) {
  const inCategory = photos.filter((p) => p.category === category);
  const real = inCategory.filter((p) => p.src);
  return real.length ? real : inCategory;
}
