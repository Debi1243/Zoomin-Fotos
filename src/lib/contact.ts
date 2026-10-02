import { z } from "zod";

export const sessionOptions = ["Wedding", "Pre-wedding", "Portraits", "Maternity & Newborn", "Event", "Commercial", "Something else"] as const;

export const contactSchema = z.object({
  session: z.enum(sessionOptions, "Choose what you'd like photographed."),
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.email("Enter an email address we can reply to.").trim().max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[+\d][\d\s()-]{6,}$/.test(v), "That phone number doesn't look right."),
  date: z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  location: z.string().trim().max(160),
  message: z.string().trim().min(20, "A couple of sentences about the shoot helps us prepare.").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export function readContactForm(data: FormData) {
  return {
    session: String(data.get("session") ?? ""),
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    phone: String(data.get("phone") ?? ""),
    date: String(data.get("date") ?? ""),
    location: String(data.get("location") ?? ""),
    message: String(data.get("message") ?? ""),
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
