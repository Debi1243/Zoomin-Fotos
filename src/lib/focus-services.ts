import { brand, formatRupees, weddingComparison } from "./data";
import { addOns, coverage, crew } from "./package-builder";

/**
 * Pages for two things every wedding package already includes: candid photography and wedding
 * cinematography. They are not separate photo categories (so the admin page is unchanged); they
 * describe what the published packages and package builder already offer, in the words couples
 * search for. Every number comes from the packages, the comparison table or the builder's rates.
 */

export type FocusService = {
  slug: "candid-photography" | "wedding-cinematography";
  /** The H1 and breadcrumb. */
  title: string;
  /** The page title in search results. */
  seoTitle: string;
  description: string;
  label: string;
  intro: string;
  /** Rows of the wedding comparison to show, by label. */
  rows: string[];
  approach: { title: string; text: string }[];
  /** Ways to add more, from the package builder's rates. */
  extras: string[];
  faqs: { q: string; a: string }[];
  /** Photographs to show: ids, in order. */
  photoIds: string[];
  heroPhotoId: string;
  whatsapp: string;
};

const rate = (list: { id: string; price: number }[], id: string) => formatRupees(list.find((x) => x.id === id)?.price ?? 0);

export const compareRows = (labels: string[]) => weddingComparison.filter((r) => labels.includes(r.label));

export const focusServices: FocusService[] = [
  {
    slug: "candid-photography",
    title: `Candid wedding photography in ${brand.city}`,
    seoTitle: `Candid Wedding Photographer in ${brand.city}, ${brand.region}`,
    label: "Candid photography",
    description: `Candid wedding photography in ${brand.city} and across ${brand.region}: unposed moments, family photographs and hand-edited images in every Zoomin Fotos wedding package, from ₹25,000 + GST.`,
    intro:
      "Candid is how we photograph every wedding: unposed laughter, glances and tears, caught as they happen, alongside the family photographs your elders will ask for. Every wedding package includes at least one photographer and all raw photographs in high resolution. Signature, Luxe and Infinity add a second photographer and 20, 50 or 150 hand-edited photographs.",
    rows: ["Photographers", "All raw photos and videos", "Edited photos", "Photo album"],
    approach: [
      { title: "We notice, then we photograph", text: "We work quietly and direct gently, so the aunt fixing a dupatta and the father pretending not to cry end up in your album." },
      { title: "Candid and family, together", text: "Our photographers cover the unposed moments and the organised family groups, so nobody important is missed." },
      { title: "Planned around your rituals", text: "A planning call before the day puts us in place before each moment, not after it." },
      { title: "Time for the two of you", text: "A relaxed, guided half hour away from the crowd, timed for the best light of the day." },
    ],
    extras: [
      `Add a photographer: ${rate(crew, "photographer")} per event`,
      `Add a designed and printed premium album: ${rate(addOns, "album")}`,
      "Cover more events (haldi, mehendi, sangeet, reception) in the package builder",
    ],
    faqs: [
      {
        q: "Is candid photography included in your wedding packages?",
        a: "Yes. Every package is photographed candidly, with family group photographs as well. Essence has one photographer; Signature, Luxe and Infinity have two.",
      },
      {
        q: "How many edited photos do we receive?",
        a: "You receive all raw photos in high resolution with every package. Signature includes 20 hand-edited photos, Luxe 50 and Infinity 150. Essence includes the raw photos and an album, without separately edited photos.",
      },
      {
        q: "Can we add another photographer?",
        a: `Yes. In the package builder an extra photographer is ${rate(crew, "photographer")} per event, and the estimate updates as you choose.`,
      },
    ],
    photoIds: ["56", "59", "58", "21", "96", "62", "63", "35", "29", "78", "80", "28"],
    heroPhotoId: "58",
    whatsapp: "Hi Zoomin Fotos! I'd like to know more about candid wedding photography.",
  },
  {
    slug: "wedding-cinematography",
    title: `Wedding cinematography in ${brand.region}`,
    seoTitle: `Wedding Cinematographer in ${brand.city}, ${brand.region}`,
    label: "Wedding cinematography",
    description: `Wedding films in ${brand.city} and across ${brand.region}: a cinematographer in every Zoomin Fotos package, full-length and highlight films, teasers, reels and drone, from ₹25,000 + GST.`,
    intro:
      "Every Zoomin Fotos wedding package includes a cinematographer, so your day is kept in motion as well as in photographs. Depending on the package you receive a full-length edited video, a 4 to 5 minute highlight video, a teaser, Instagram reels and a wedding invitation video. Infinity adds a drone and a 7 to 10 minute cinematic, storyline-driven highlight film.",
    rows: ["Cinematographers", "Drone", "Full-length edited video", "Highlight video", "Teaser video", "Instagram reels", "Wedding invitation video"],
    approach: [
      { title: "Told as a story", text: "Highlight films are cut around your day's story and emotions, not as a slideshow of every guest." },
      { title: "Every ritual, start to end", text: "The full-length video keeps the whole ceremony for the family to watch again." },
      { title: "Made to share", text: "Teasers and Instagram reels in Luxe and Infinity, ready to post while the excitement is fresh." },
      { title: "From the sky", text: "Infinity includes a drone for aerial photos and video of the venue and the baraat." },
    ],
    extras: [
      `Add a cinematographer: ${rate(crew, "cinematographer")} per event`,
      `Drone: ${rate(coverage, "drone")} per event`,
      `Traditional video, every ritual start to end: ${rate(coverage, "traditional")} per event`,
      `Live streaming for family far away: ${rate(coverage, "live")} per event`,
      `Teaser: ${rate(addOns, "teaser")}. Same-day edit shown at the reception: ${rate(addOns, "same-day")}`,
    ],
    faqs: [
      {
        q: "Is a cinematographer included in every wedding package?",
        a: "Yes. Essence and Signature include one cinematographer; Luxe and Infinity include two. Every package includes all raw videos and a full-length edited video.",
      },
      {
        q: "How long is the highlight film?",
        a: "Signature and Luxe include a 4 to 5 minute highlight video. Infinity includes a 7 to 10 minute cinematic, storyline-driven highlight film.",
      },
      {
        q: "Can you live stream our wedding?",
        a: `Yes. Live streaming is ${rate(coverage, "live")} per event and can be added in the package builder.`,
      },
      {
        q: "Do you offer drone shots?",
        a: `Infinity includes a drone. With any other package, a drone is ${rate(coverage, "drone")} per event. Some venues need permission for drones, which we ask you to arrange.`,
      },
    ],
    photoIds: ["63", "40", "65", "62", "55", "67", "14", "57", "68", "82", "69", "52"],
    heroPhotoId: "40",
    whatsapp: "Hi Zoomin Fotos! I'd like to know more about your wedding films.",
  },
];

export const getFocusService = (slug: FocusService["slug"]) => focusServices.find((f) => f.slug === slug)!;
