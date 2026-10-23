import { brand, formatRupees } from "./brand";
import { services } from "./data";
import { addOns, coverage, crew, extraHours } from "./package-builder";

/**
 * Quotations and bills made on /admin/billing. They are kept in this browser only (nothing is
 * sent anywhere), so the studio can reopen, edit, print or turn a quote into a bill later.
 */

export type DocKind = "quote" | "bill";

export type LineItem = { id: string; description: string; detail: string; qty: number; rate: number };

export type BillDoc = {
  id: string;
  kind: DocKind;
  number: string;
  /** YYYY-MM-DD */
  date: string;
  /** Quote: valid until. Bill: payment due by. YYYY-MM-DD or empty. */
  until: string;
  client: { name: string; phone: string; email: string; address: string; gstin: string };
  event: { title: string; date: string; venue: string };
  items: LineItem[];
  discount: number;
  gst: { on: boolean; rate: number };
  /** Quote: advance asked to confirm the date. Bill: amount already received. */
  advance: number;
  notes: string;
  terms: string;
  /** If this bill was made from a quote, that quote's number. */
  fromQuote?: string;
  updatedAt: number;
};

/** Details the studio fills in once per device: they appear on every document. */
export type StudioProfile = {
  gstin: string;
  address: string;
  upiId: string;
  bank: string;
  /** Default terms, typed by the studio. Nothing is pre-written: terms are the studio's to set. */
  terms: string;
};

export const emptyProfile: StudioProfile = { gstin: "", address: "", upiId: "", bank: "", terms: "" };

export const kindLabel: Record<DocKind, string> = { quote: "Quotation", bill: "Tax invoice" };

const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const newItem = (description = "", rate = 0, detail = ""): LineItem => ({ id: uid(), description, detail, qty: 1, rate });

export function newDoc(kind: DocKind, number: string, profile: StudioProfile): BillDoc {
  const date = today();
  return {
    id: uid(),
    kind,
    number,
    date,
    until: kind === "quote" ? plusDays(date, 15) : "",
    client: { name: "", phone: "", email: "", address: "", gstin: "" },
    event: { title: "", date: "", venue: "" },
    items: [newItem()],
    discount: 0,
    // The website's prices are all "+ GST"; 18% is the usual rate for photography services. Change it per document if needed.
    gst: { on: true, rate: 18 },
    advance: 0,
    notes: "",
    terms: profile.terms,
    updatedAt: Date.now(),
  };
}

/** A bill made from a quote: same client, event and lines, a new number and today's date. */
export function quoteToBill(q: BillDoc, number: string): BillDoc {
  return { ...structuredClone(q), id: uid(), kind: "bill", number, date: today(), until: "", advance: 0, fromQuote: q.number, updatedAt: Date.now() };
}

/** A fresh copy of a document under a new number, e.g. to quote a similar wedding. */
export function duplicateDoc(d: BillDoc, number: string): BillDoc {
  return { ...structuredClone(d), id: uid(), number, date: today(), fromQuote: undefined, updatedAt: Date.now() };
}

export function totals(d: BillDoc) {
  const subtotal = d.items.reduce((s, i) => s + Math.max(0, i.qty) * Math.max(0, i.rate), 0);
  const discount = Math.min(Math.max(0, d.discount), subtotal);
  const taxable = subtotal - discount;
  const gst = d.gst.on ? Math.round((taxable * d.gst.rate) / 100) : 0;
  const total = taxable + gst;
  const advance = Math.min(Math.max(0, d.advance), total);
  return { subtotal, discount, taxable, gst, cgst: gst / 2, sgst: gst / 2, total, advance, balance: total - advance };
}

/** Numbers like QT-2026-0007 and INV-2026-0012, counted per year on this device. */
export function nextNumber(kind: DocKind, existing: BillDoc[]) {
  const prefix = `${kind === "quote" ? "QT" : "INV"}-${new Date().getFullYear()}-`;
  const used = existing
    .filter((d) => d.number.startsWith(prefix))
    .map((d) => Number(d.number.slice(prefix.length)))
    .filter(Number.isFinite);
  return `${prefix}${String((used.length ? Math.max(...used) : 0) + 1).padStart(4, "0")}`;
}

/** Rupees in words, Indian style: "Fifty-Five Thousand Rupees Only". */
export function rupeesInWords(n: number) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x: number) => (x < 20 ? ones[x] : `${tens[Math.floor(x / 10)]}${x % 10 ? `-${ones[x % 10]}` : ""}`);
  const three = (x: number) => [x >= 100 ? `${ones[Math.floor(x / 100)]} Hundred` : "", two(x % 100)].filter(Boolean).join(" ");
  let rest = Math.round(n);
  if (rest === 0) return "Zero Rupees Only";
  const parts: string[] = [];
  for (const [size, name] of [[10_000_000, "Crore"], [100_000, "Lakh"], [1000, "Thousand"]] as const) {
    const q = Math.floor(rest / size);
    if (q) parts.push(`${q >= 100 ? three(q) : two(q)} ${name}`);
    rest %= size;
  }
  if (rest) parts.push(three(rest));
  return `${parts.join(" ")} Rupees Only`;
}

export type CatalogItem = { group: string; description: string; detail: string; rate: number };

/** The studio's published packages and package-builder rates, ready to drop into a document. */
export const catalog: CatalogItem[] = [
  ...services.flatMap((s) =>
    (s.packages ?? []).map((p) => ({
      group: `${s.title} packages`,
      description: s.packages!.length > 1 ? `${s.title.replace(/s$/, "")} photography: ${p.name} package` : `${s.title} shoot`,
      detail: [p.team, ...p.items].filter(Boolean).join(" · "),
      rate: p.price,
    })),
  ),
  ...crew.map((c) => ({ group: "Per event", description: c.label.replace(/s$/, ""), detail: c.note, rate: c.price })),
  ...coverage.map((c) => ({ group: "Per event", description: c.label, detail: c.note, rate: c.price })),
  ...addOns.map((a) => ({ group: "Add-ons", description: a.label, detail: a.note, rate: a.price })),
  { group: "Add-ons", description: "Extra hour", detail: extraHours.note, rate: extraHours.price },
];

/** A short WhatsApp message to send with the PDF. */
export function shareText(d: BillDoc) {
  const t = totals(d);
  const first = d.client.name.split(" ")[0];
  return [
    `Hi${first ? ` ${first}` : ""}, here is your ${kindLabel[d.kind].toLowerCase()} from ${brand.name}.`,
    "",
    `${kindLabel[d.kind]} ${d.number}`,
    ...(d.event.title ? [`For: ${d.event.title}${d.event.date ? `, ${longDate(d.event.date)}` : ""}`] : []),
    `Total: ${formatRupees(t.total)}${d.gst.on ? ` (incl. GST)` : ""}`,
    ...(d.kind === "quote" && t.advance ? [`Advance to confirm your date: ${formatRupees(t.advance)}`] : []),
    ...(d.kind === "bill" && t.advance ? [`Received: ${formatRupees(t.advance)}`, `Balance due: ${formatRupees(t.balance)}`] : []),
    ...(d.kind === "quote" && d.until ? [`Valid until: ${longDate(d.until)}`] : []),
    "",
    "The PDF is attached. Let us know if you have any questions.",
  ].join("\n");
}

export const longDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

/** A client's number as wa.me wants it: digits only, with 91 added to a 10-digit Indian mobile. */
export function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

// Device storage. Every read and write is guarded: private browsing can refuse storage.
const DOCS_KEY = "zf-billing-docs";
const PROFILE_KEY = "zf-billing-profile";

export function loadDocs(): BillDoc[] {
  try {
    const raw = JSON.parse(localStorage.getItem(DOCS_KEY) ?? "[]");
    return Array.isArray(raw) ? (raw as BillDoc[]) : [];
  } catch {
    return [];
  }
}

export function saveDocs(docs: BillDoc[]) {
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return true;
  } catch {
    return false;
  }
}

export function loadProfile(): StudioProfile {
  try {
    return { ...emptyProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}") };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(p: StudioProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    // Without storage the details last for this visit only.
  }
}
