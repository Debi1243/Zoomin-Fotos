import { brand } from "./data";
import { contactSchema, readContactForm, toFieldErrors, type ContactState } from "./contact";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

/**
 * Browser-side twin of the contact Server Action, swapped in for static builds.
 * Posts JSON to NEXT_PUBLIC_CONTACT_ENDPOINT (e.g. Formspree); without one it offers email instead.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "success", name: "" };

  const values = readContactForm(formData);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "invalid", errors: toFieldErrors(parsed.error), values };

  if (!ENDPOINT) {
    return { status: "error", message: `Our form is offline right now. Please email us at ${brand.email}.`, values };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
  } catch {
    return { status: "error", message: `We couldn't send that just now. Please try again or email ${brand.email}.`, values };
  }
  return { status: "success", name: parsed.data.name };
}
