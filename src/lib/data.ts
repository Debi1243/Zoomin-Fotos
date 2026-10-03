/**
 * All site content lives here. Replace the placeholder contact details and add
 * real photo files (see `photos` below) before launch.
 */

export const brand = {
  name: "Zoomin Fotos",
  tagline: "Photographs that feel like the day did.",
  description:
    "Zoomin Fotos is a photography studio in Bhubaneswar for weddings, portraits, families, events and brands across Odisha and beyond.",
  // Placeholder contact details: replace with the studio's real ones.
  email: "hello@zoominfotos.com",
  phone: "+91 90000 00000",
  city: "Bhubaneswar",
  region: "Odisha",
  country: "IN",
  hours: "Mon to Sat, 10:00 AM to 7:00 PM IST",
};

export type Tone = "dusk" | "amber" | "rose" | "sage" | "sky" | "ink";
export type Aspect = "portrait" | "landscape" | "square";
export type ServiceSlug = "weddings" | "pre-wedding" | "portraits" | "maternity-newborn" | "events" | "commercial";

export type Photo = {
  id: string;
  category: ServiceSlug;
  title: string;
  place: string;
  aspect: Aspect;
  tone: Tone;
  /** Path under /public, e.g. "/photos/wedding-01.jpg". Until set, a toned frame stands in. */
  src?: string;
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
};

const deliveryFaq = {
  q: "How long until we receive our photographs?",
  a: "You get a hand-picked preview within 72 hours. The full, individually edited gallery follows within three to four weeks, depending on the size of the shoot.",
};

const travelFaq = {
  q: "Do you travel outside Bhubaneswar?",
  a: "Yes. We photograph across Odisha regularly and travel anywhere in India or abroad. Travel and stay are quoted at cost, with no markup.",
};

export const services: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    short: "Every ritual, every relative, every quiet glance between you, told as one continuous story.",
    intro:
      "From haldi to bidaai, we document your wedding the way it actually unfolds: candid, unhurried and true to colour. A lead photographer and a second shooter work as one, so nothing important happens out of frame.",
    idealFor: "Multi-day celebrations, intimate ceremonies and destination weddings.",
    includes: [
      { title: "Two photographers", text: "A lead and a second shooter, so both families and both sides of the mandap are covered." },
      { title: "Ritual planning call", text: "We walk through the schedule with you and your family so we are in place before each moment." },
      { title: "Couple portraits", text: "A relaxed, guided half hour away from the crowd, timed for the best light of the day." },
      { title: "Heirloom album", text: "A lay-flat album designed by us, printed on archival paper and bound by hand." },
    ],
    deliverables: ["Online gallery", "72-hour preview", "Lay-flat album", "Print-ready files", "Family selects"],
    faqs: [
      {
        q: "How far in advance should we book?",
        a: "Popular wedding dates fill six to nine months ahead. Send your date as soon as you have it and we will hold it while you decide.",
      },
      deliveryFaq,
      travelFaq,
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
    deliverables: ["Online gallery", "Save-the-date edits", "Two outfit changes", "Print-ready files"],
    faqs: [
      { q: "How long is a pre-wedding session?", a: "Three to four hours, including travel between two nearby locations and one outfit change." },
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
      { q: "Can you cover an event at short notice?", a: "Often, yes. Message us with the date and time and we will confirm availability within a few hours." },
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
 * Portfolio. Each entry renders as a toned frame until `src` points at a real file in
 * /public/photos. Titles and places are illustrative; replace them with the real work.
 */
export const photos: Photo[] = [
  { id: "01", category: "weddings", title: "Sindoor daan", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-sindoor.webp" },
  { id: "02", category: "portraits", title: "Yellow allamanda", place: "Odisha", aspect: "portrait", tone: "sage", src: "/photos/portrait-saree-garden.webp" },
  { id: "03", category: "pre-wedding", title: "Low tide", place: "Puri", aspect: "portrait", tone: "sky" },
  { id: "04", category: "weddings", title: "Bridal portrait", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-bridal-portrait.webp" },
  { id: "05", category: "commercial", title: "Chhena poda, close up", place: "Studio", aspect: "square", tone: "rose" },
  { id: "06", category: "maternity-newborn", title: "Eight days old", place: "Home session", aspect: "portrait", tone: "rose" },
  { id: "07", category: "events", title: "The last speech", place: "Cuttack", aspect: "landscape", tone: "ink" },
  { id: "08", category: "pre-wedding", title: "Temple steps", place: "Konark", aspect: "landscape", tone: "sage" },
  { id: "09", category: "weddings", title: "Bidaai", place: "Odisha", aspect: "landscape", tone: "dusk", src: "/photos/wedding-bidaai.webp" },
  { id: "10", category: "portraits", title: "Our little one", place: "Odisha", aspect: "portrait", tone: "ink", src: "/photos/family-double-exposure.webp" },
  { id: "11", category: "commercial", title: "Handloom, folded", place: "Studio", aspect: "portrait", tone: "amber" },
  { id: "12", category: "maternity-newborn", title: "Thirty-four weeks", place: "Chilika", aspect: "landscape", tone: "sky" },
  { id: "13", category: "events", title: "First birthday", place: "Bhubaneswar", aspect: "square", tone: "rose" },
  { id: "14", category: "weddings", title: "The reception", place: "Odisha", aspect: "portrait", tone: "amber", src: "/photos/wedding-couple-reception.webp" },
  { id: "15", category: "pre-wedding", title: "Monsoon umbrella", place: "Bhubaneswar", aspect: "square", tone: "ink" },
  { id: "16", category: "commercial", title: "Boutique interior", place: "Bhubaneswar", aspect: "landscape", tone: "sage" },
  { id: "17", category: "portraits", title: "Graduate", place: "Utkal University", aspect: "portrait", tone: "sky" },
  { id: "18", category: "events", title: "Odissi recital", place: "Rabindra Mandap", aspect: "portrait", tone: "dusk" },
];

export const process = [
  {
    step: "01",
    title: "Enquire",
    text: "Tell us your date, place and what you have in mind. We reply within a day with availability and a tailored quote.",
    points: ["Date check", "Tailored quote", "No obligation"],
  },
  {
    step: "02",
    title: "Plan",
    text: "A call to understand the people, the schedule and the moments that matter most, so we are always in the right place.",
    points: ["Planning call", "Shot list", "Timeline"],
  },
  {
    step: "03",
    title: "Shoot",
    text: "We work quietly and direct gently. You enjoy the day; we make sure it is remembered properly.",
    points: ["Candid coverage", "Gentle direction", "Backup cameras"],
  },
  {
    step: "04",
    title: "Deliver",
    text: "A preview within 72 hours, then a private online gallery of individually edited images, plus albums and prints if you wish.",
    points: ["72-hour preview", "Private gallery", "Albums & prints"],
  },
];

export const principles = [
  {
    title: "Direction, not posing",
    text: "We give small prompts and then step back. The best expressions happen between instructions.",
  },
  {
    title: "Honest colour",
    text: "Skin tones stay true and reds stay red. We edit for how the day felt, not for the latest filter.",
  },
  {
    title: "Edited by hand",
    text: "No presets on autopilot. Each delivered photograph is looked at, corrected and finished individually.",
  },
  {
    title: "Backed up, always",
    text: "Dual-card cameras and same-night backups in two places. Your photographs are never on a single card.",
  },
];

export const homeFaqs = [
  {
    q: "How do we check if you are available?",
    a: "Send your date and location through the booking form. We reply within one working day and can hold the date for a week while you decide.",
  },
  {
    q: "What does a booking cost?",
    a: "It depends on the hours, the number of photographers and any albums or prints. After a short call you get a clear, itemised quote with nothing hidden.",
  },
  {
    q: "How are the photographs delivered?",
    a: "In a private online gallery you can share with family, download in full resolution and order prints from. Albums are designed with you and printed separately.",
  },
  {
    q: "Do we get the raw files?",
    a: "We deliver finished, edited images only. Every delivered photograph is yours to print and share for personal use.",
  },
];

const serviceBySlug = new Map<string, Service>(services.map((s) => [s.slug, s]));

export function getService(slug: string) {
  return serviceBySlug.get(slug);
}

export function photosIn(category: ServiceSlug) {
  return photos.filter((p) => p.category === category);
}

export const telHref = `tel:${brand.phone.replace(/\s/g, "")}`;
export const mailHref = `mailto:${brand.email}`;
export const locationLine = `${brand.city}, ${brand.region}, India`;
