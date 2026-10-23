"use server";

import { brand } from "@/lib/data";
import { dataEndpoint } from "@/lib/settings";
import { contactSchema, readContactForm, toFieldErrors, type ContactInput, type ContactState } from "@/lib/contact";

const WEBHOOK_TIMEOUT_MS = 8000;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", name: "" };
  }

  const values = readContactForm(formData);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "invalid", errors: toFieldErrors(parsed.error), values };
  }

  // Deliver to the server's webhook and to the studio's own Google Sheet (connected on
  // /admin/dashboard), whichever are set up. It counts as sent once any of them accepts it.
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const targets = [webhook && toWebhook(webhook, parsed.data), dataEndpoint && toSheet(dataEndpoint, parsed.data)].filter(
    (t): t is Promise<void> => !!t,
  );
  if (targets.length === 0) {
    // Without a delivery target, only pretend to send while developing locally.
    if (process.env.NODE_ENV !== "production") {
      return { status: "success", name: parsed.data.name };
    }
    return { status: "error", message: `Our form is offline right now. Please email us at ${brand.email}.`, values };
  }

  const results = await Promise.allSettled(targets);
  if (!results.some((r) => r.status === "fulfilled")) {
    return { status: "error", message: `We couldn't send that just now. Please try again or email ${brand.email}.`, values };
  }

  return { status: "success", name: parsed.data.name };
}

async function toWebhook(url: string, data: ContactInput) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

/** Saves the enquiry in the studio's sheet, which also emails it to the studio. */
async function toSheet(endpoint: string, data: ContactInput) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "enquiry", enquiry: { ...data, page: "/contact" } }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  const reply = (await res.json().catch(() => ({}))) as { ok?: boolean };
  if (!res.ok || !reply.ok) throw new Error("The sheet did not accept the enquiry");
}
