/**
 * The studio's name, contact details and the links built from them. Kept apart from data.ts so
 * client components (header, booking bar, forms) can use them without loading the photo list.
 */
export const brand = {
  name: "Zoomin Fotos",
  tagline: "Not just photographs. The moments you'll relive forever.",
  /** The supporting line under the headline. */
  promise: "Wedding photography and films crafted around your story, your emotions and the moments that matter.",
  description:
    "Wedding photography and films in Bhubaneswar, Odisha, crafted around your story. Candid, pre-wedding, maternity, newborn, event and commercial photography, with transparent packages and easy WhatsApp booking.",
  email: "info@zoominfotos.in",
  /** For help with an existing booking, order, payment or the client portal. General enquiries use `email`. */
  supportEmail: "support@zoominfotos.in",
  phone: "+91 70222 49799",
  /** The number customers message on WhatsApp. Today the studio phone; change it here if a separate business number is used. */
  whatsapp: "+91 70222 49799",
  city: "Bhubaneswar",
  region: "Odisha",
  country: "IN",
  hours: "Mon to Sat, 10:00 AM to 7:00 PM IST",
  /** The studio's Google business listing, where clients can read and leave reviews. */
  googleReviews: "https://share.google/MrFH24KEedQoNTOly",
};

/** Said wherever the site talks about changing a package, in place of any talk of negotiating. */
export const customPackagesLine = "Custom packages available based on your event requirements.";

export const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const telHref = `tel:${brand.phone.replace(/\s/g, "")}`;
/** A WhatsApp chat with the studio, opened with `text` already typed. */
export const waLink = (text: string) => `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export const whatsappHref = waLink("Hi Zoomin Fotos, I'd like to check availability for a shoot.");
export const mailHref = `mailto:${brand.email}`;
export const supportMailHref = `mailto:${brand.supportEmail}`;
export const locationLine = `${brand.city}, ${brand.region}, India`;
