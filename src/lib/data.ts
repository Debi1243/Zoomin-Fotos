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

/** Each service carries one colour from the festive palette (see globals.css). */
export const serviceTone: Record<ServiceSlug, string> = {
  weddings: "var(--sindoor)",
  "pre-wedding": "var(--rani)",
  portraits: "var(--peacock)",
  "maternity-newborn": "var(--marigold)",
  events: "var(--gold)",
  commercial: "var(--rani)",
};

export const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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
        a: "Popular wedding dates fill six to nine months ahead. Send your date as soon as you have it and we will hold it while you decide.",
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
    deliverables: ["Online gallery", "Save-the-date edits", "Two outfit changes", "Print-ready files"],
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
  { id: "21", category: "weddings", title: "Haldi laughter", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-haldi.webp" },
  { id: "38", category: "pre-wedding", title: "Two rings, in rose petals", place: "Studio", aspect: "landscape", tone: "rose", src: "/photos/prewedding-rings-rose-petals.webp" },
  { id: "30", category: "weddings", title: "Getting ready, golden dust", place: "Odisha", aspect: "portrait", tone: "amber", src: "/photos/wedding-golden-powder.webp" },
  { id: "39", category: "weddings", title: "Behind the veil", place: "Odisha", aspect: "portrait", tone: "rose", src: "/photos/wedding-bride-red-veil.webp" },
  { id: "02", category: "portraits", title: "Yellow allamanda", place: "Odisha", aspect: "portrait", tone: "sage", src: "/photos/portrait-saree-garden.webp" },
  { id: "03", category: "pre-wedding", title: "Low tide", place: "Puri", aspect: "portrait", tone: "sky" },
  { id: "06", category: "maternity-newborn", title: "Eight days old", place: "Home session", aspect: "portrait", tone: "rose" },
  { id: "44", category: "maternity-newborn", title: "First steps under the bougainvillea", place: "Odisha", aspect: "portrait", tone: "rose", src: "/photos/kids-bougainvillea-walk.webp" },
  { id: "05", category: "commercial", title: "Chhena poda, close up", place: "Studio", aspect: "square", tone: "rose" },
  { id: "41", category: "commercial", title: "Dahi bara aloo dum, in a leaf bowl", place: "Studio", aspect: "portrait", tone: "amber", src: "/photos/commercial-dahi-bara-aloo-dum.webp" },
  { id: "04", category: "weddings", title: "Bridal portrait", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-bridal-portrait.webp" },
  { id: "33", category: "weddings", title: "Haldi, a shower of petals", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-haldi-petal-shower.webp" },
  { id: "23", category: "portraits", title: "Golden hour glow", place: "Odisha", aspect: "portrait", tone: "amber", src: "/photos/portrait-golden-hour.webp" },
  { id: "40", category: "weddings", title: "Crowned, hand in hand", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-mukut-ceremony.webp" },
  { id: "24", category: "pre-wedding", title: "The ring, at golden hour", place: "Odisha", aspect: "portrait", tone: "amber", src: "/photos/prewedding-ring-golden.webp" },
  { id: "34", category: "weddings", title: "Getting ready, a rain of petals", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-bride-petal-rain.webp" },
  { id: "18", category: "events", title: "Odissi recital", place: "Rabindra Mandap", aspect: "portrait", tone: "dusk" },
  { id: "08", category: "pre-wedding", title: "Temple steps", place: "Konark", aspect: "landscape", tone: "sage" },
  { id: "20", category: "weddings", title: "Bridal details", place: "Odisha", aspect: "landscape", tone: "rose", src: "/photos/wedding-bridal-collage.webp" },
  { id: "36", category: "pre-wedding", title: "Laughter under the lanterns", place: "Odisha", aspect: "landscape", tone: "rose", src: "/photos/prewedding-lantern-laughter.webp" },
  { id: "12", category: "maternity-newborn", title: "Thirty-four weeks", place: "Chilika", aspect: "landscape", tone: "sky" },
  { id: "11", category: "commercial", title: "Handloom, folded", place: "Studio", aspect: "portrait", tone: "amber" },
  { id: "42", category: "commercial", title: "Sizzling brownie, the chocolate pour", place: "Studio", aspect: "portrait", tone: "amber", src: "/photos/commercial-sizzling-brownie.webp" },
  { id: "14", category: "weddings", title: "The reception", place: "Odisha", aspect: "portrait", tone: "amber", src: "/photos/wedding-couple-reception.webp" },
  { id: "26", category: "portraits", title: "Crimson veil", place: "Studio", aspect: "portrait", tone: "rose", src: "/photos/portrait-crimson-veil.webp" },
  { id: "09", category: "weddings", title: "Bidaai", place: "Odisha", aspect: "landscape", tone: "dusk", src: "/photos/wedding-bidaai.webp" },
  { id: "22", category: "portraits", title: "Light through the blinds", place: "Studio", aspect: "portrait", tone: "rose", src: "/photos/portrait-red-blinds.webp" },
  { id: "45", category: "commercial", title: "Product shoot, tablets in morning light", place: "Studio", aspect: "landscape", tone: "amber", src: "/photos/commercial-pharma-product.webp" },
  { id: "01", category: "weddings", title: "Sindoor daan", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-sindoor.webp" },
  { id: "17", category: "portraits", title: "Emerald and gold", place: "Studio", aspect: "portrait", tone: "sage", src: "/photos/portrait-emerald-studio.webp" },
  { id: "35", category: "weddings", title: "A blushing bride", place: "Odisha", aspect: "landscape", tone: "rose", src: "/photos/wedding-bride-blush-petals.webp" },
  { id: "31", category: "portraits", title: "A shy smile in silk", place: "Odisha", aspect: "portrait", tone: "rose", src: "/photos/portrait-silk-saree.webp" },
  { id: "15", category: "pre-wedding", title: "Monsoon umbrella", place: "Bhubaneswar", aspect: "square", tone: "ink" },
  { id: "29", category: "weddings", title: "Haldi, petals flying", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/wedding-haldi-petals.webp" },
  { id: "37", category: "pre-wedding", title: "The groom, among marigolds", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/prewedding-groom-marigolds.webp" },
  { id: "16", category: "commercial", title: "Boutique interior", place: "Bhubaneswar", aspect: "landscape", tone: "sage" },
  { id: "43", category: "commercial", title: "Herbs, crisp onions and grilled bread", place: "Studio", aspect: "portrait", tone: "sage", src: "/photos/commercial-herb-bowl-sunlight.webp" },
  { id: "13", category: "events", title: "First birthday", place: "Bhubaneswar", aspect: "square", tone: "rose" },
  { id: "27", category: "pre-wedding", title: "Warm lights, closer", place: "Odisha", aspect: "landscape", tone: "amber", src: "/photos/prewedding-couple-evening.webp" },
  { id: "28", category: "weddings", title: "Hands joined, everyone smiling", place: "Odisha", aspect: "landscape", tone: "rose", src: "/photos/wedding-hasta-milap.webp" },
  { id: "07", category: "events", title: "The last speech", place: "Cuttack", aspect: "landscape", tone: "ink" },
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
    a: "Wedding packages start at ₹25,000 for one day plus GST, and every price is negotiable. Pre-wedding shoots start from ₹15,000 plus GST, with drone shots and an album included. Other sessions depend on the hours and any albums or prints; after a short call you get a clear, itemised quote with nothing hidden.",
  },
  {
    q: "How are the photographs delivered?",
    a: "In a private online gallery you can share with family, download in full resolution and order prints from. Albums are designed with you and printed separately.",
  },
  {
    q: "Do we get the raw files?",
    a: "Yes, for weddings: every wedding package includes all raw photos and videos alongside the edited work. Other sessions are delivered as finished, edited images, all yours to print and share.",
  },
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

export const telHref = `tel:${brand.phone.replace(/\s/g, "")}`;
export const mailHref = `mailto:${brand.email}`;
export const locationLine = `${brand.city}, ${brand.region}, India`;
