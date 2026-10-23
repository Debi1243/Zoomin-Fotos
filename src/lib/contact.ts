import { z } from "zod";
import { formatRupees, type ServiceSlug } from "./data";

/** What a visitor can ask to have photographed, with budget choices that suit each. */
export const quoteServices = [
  { value: "Wedding", budgets: ["Under ₹25,000", "₹25,000 to ₹35,000", "₹35,000 to ₹45,000", "₹45,000 to ₹55,000", "Above ₹55,000"] },
  { value: "Pre-wedding", budgets: ["Around ₹15,000", "₹15,000 to ₹25,000", "Above ₹25,000"] },
  { value: "Maternity & Newborn", budgets: ["Under ₹10,000", "₹10,000 to ₹20,000", "Above ₹20,000"] },
  { value: "Baby & Kids", budgets: ["Under ₹10,000", "₹10,000 to ₹20,000", "Above ₹20,000"] },
  { value: "Birthday & Event", budgets: ["Under ₹15,000", "₹15,000 to ₹30,000", "Above ₹30,000"] },
  { value: "Family & Portraits", budgets: ["Under ₹10,000", "₹10,000 to ₹20,000", "Above ₹20,000"] },
  { value: "Commercial", budgets: ["Under ₹15,000", "₹15,000 to ₹40,000", "Above ₹40,000"] },
  { value: "Something else", budgets: [] },
] as const;

export const NOT_SURE = "Not sure yet";
export const sessionOptions = quoteServices.map((s) => s.value);

export const budgetsFor = (service: string) => [...(quoteServices.find((s) => s.value === service)?.budgets ?? []), NOT_SURE];

/** Indian mobile numbers, with or without +91 / 0, spaces or dashes. */
const PHONE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export const contactSchema = z.object({
  session: z.enum(sessionOptions, "Choose what you'd like photographed."),
  pkg: z.string().trim().max(80),
  date: z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  location: z.string().trim().min(2, "Where is the shoot? A city or venue is enough.").max(160),
  budget: z.string().trim().min(1, "Pick a rough budget, or “Not sure yet”.").max(60),
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: z.string().trim().regex(PHONE, "Enter a 10-digit mobile number."),
  email: z.union([z.literal(""), z.email("That email doesn't look right.").trim().max(200)]),
  message: z.string().trim().max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export function readContactForm(data: FormData) {
  const get = (k: string) => String(data.get(k) ?? "");
  return {
    session: get("session"),
    pkg: get("pkg"),
    date: get("date"),
    location: get("location"),
    budget: get("budget"),
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    message: get("message"),
  };
}

export type ContactValues = ReturnType<typeof readContactForm>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; values: ContactValues }
  | { status: "error"; message: string; values: ContactValues }
  | { status: "success"; name: string };

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

const longDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Not fixed yet";

/** The enquiry as the studio reads it in WhatsApp: one fact per line, most important first. */
export function enquiryText(q: ContactInput) {
  return [
    "Hi Zoomin Fotos! New enquiry from the website:",
    "",
    `Service: ${q.session}${q.pkg ? ` (${q.pkg})` : ""}`,
    `Date: ${longDate(q.date)}`,
    `Location: ${q.location}`,
    `Budget: ${q.budget}`,
    `Name: ${q.name}`,
    `Phone: ${q.phone}`,
    ...(q.email ? [`Email: ${q.email}`] : []),
    ...(q.message ? ["", `Notes: ${q.message}`] : []),
  ].join("\n");
}

/** The extra details the enquiry sheet has no column for, kept at the top of its message. */
export function sheetMessage(q: ContactInput) {
  return [`Budget: ${q.budget}`, ...(q.pkg ? [`Package: ${q.pkg}`] : []), ...(q.message ? ["", q.message] : [])].join("\n");
}

/** A link to the quote form with the service (and package) already chosen. */
export function quoteHref({ service, pkg, price }: { service: string; pkg?: string; price?: number }) {
  const params = new URLSearchParams({ service });
  if (pkg) params.set("package", price ? `${pkg}, ${formatRupees(price)} + GST` : pkg);
  return `/contact?${params}#quote`;
}

/** The quote-form service that matches each service page. */
export const quoteServiceFor: Record<ServiceSlug, string> = {
  weddings: "Wedding",
  "pre-wedding": "Pre-wedding",
  "maternity-newborn": "Maternity & Newborn",
  events: "Birthday & Event",
  portraits: "Family & Portraits",
  commercial: "Commercial",
};
