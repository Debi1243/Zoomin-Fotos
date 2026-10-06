import { brand } from "./data";
import { dataEndpoint } from "./settings";
import { contactSchema, readContactForm, toFieldErrors, type ContactInput, type ContactState } from "./contact";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

/** Saves the enquiry in the studio's Google Sheet, which also emails it to the studio (see /admin/dashboard). */
async function toSheet(endpoint: string, data: ContactInput) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "enquiry", enquiry: { ...data, page: location.pathname } }),
  });
  const reply = (await res.json().catch(() => ({}))) as { ok?: boolean };
  if (!res.ok || !reply.ok) throw new Error("The sheet did not accept the enquiry");
}

async function toEndpoint(endpoint: string, data: ContactInput) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
}

/**
 * Browser-side twin of the contact Server Action, swapped in for static builds. Sends to the
 * studio dashboard's sheet and/or NEXT_PUBLIC_CONTACT_ENDPOINT (e.g. Formspree); it counts as
 * sent when any of them takes it. Without either it offers email instead.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "success", name: "" };

  const values = readContactForm(formData);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "invalid", errors: toFieldErrors(parsed.error), values };

  const targets = [dataEndpoint && toSheet(dataEndpoint, parsed.data), ENDPOINT && toEndpoint(ENDPOINT, parsed.data)].filter(
    (t): t is Promise<void> => !!t,
  );
  if (targets.length === 0) {
    return { status: "error", message: `Our form is offline right now. Please email us at ${brand.email}.`, values };
  }

  const results = await Promise.allSettled(targets);
  if (!results.some((r) => r.status === "fulfilled")) {
    return { status: "error", message: `We couldn't send that just now. Please try again or email ${brand.email}.`, values };
  }
  return { status: "success", name: parsed.data.name };
}
