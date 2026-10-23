"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { CircleAlert, CircleCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, TextField, TextareaField } from "./Field";
import { submitContact } from "@/app/contact/actions";
import { trackFormStart } from "@/lib/track";
import { trackConversion } from "@/lib/conversions";
import { waLink } from "@/lib/brand";
import {
  budgetsFor,
  contactSchema,
  enquiryText,
  readContactForm,
  sessionOptions,
  toFieldErrors,
  type ContactField,
  type FieldErrors,
} from "@/lib/contact";

const FIELD_ORDER: ContactField[] = ["session", "date", "location", "budget", "name", "phone", "email", "message"];

type Sent = { name: string; whatsapp: string; opened: boolean; saved: boolean | null };

/**
 * The quick quote form. On send it opens WhatsApp with the enquiry already written out, and
 * saves the same enquiry for the studio (webhook or Google Sheet) in case the message is never sent.
 * It never says a booking is confirmed: that happens after the studio replies.
 */
export default function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const [service, setService] = useState("");
  const [pkg, setPkg] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<Sent | null>(null);
  const [, startSaving] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  // A package or service chosen elsewhere on the site arrives in the address.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("service");
    // Reading the address happens after mount so the static page and the first render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s && (sessionOptions as readonly string[]).includes(s)) setService(s);
    setPkg(params.get("package")?.slice(0, 80) ?? "");
    setNotes(params.get("notes")?.slice(0, 2000) ?? "");
  }, []);

  const validate = () => {
    const data = readContactForm(new FormData(formRef.current!));
    const result = contactSchema.safeParse(data);
    return { data: result.success ? result.data : null, errors: result.success ? {} : toFieldErrors(result.error) };
  };

  // Once a field has an error, re-check it as the visitor fixes it.
  const recheck = (field: ContactField) => {
    if (!errors[field]) return;
    const next = validate().errors;
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as ContactField;
    if (FIELD_ORDER.includes(name)) recheck(name);
    if (!started.current) {
      started.current = true;
      trackFormStart(location.pathname.replace(/\/$/, "") || "/", "quote");
      trackConversion("quote_form_start");
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    // Bots fill the hidden field; pretend all is well and do nothing.
    if (String(new FormData(form).get("website") ?? "") !== "") return;

    const { data, errors: next } = validate();
    if (!data) {
      setErrors(next);
      const first = FIELD_ORDER.find((f) => next[f]);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Open WhatsApp straight from the tap, before anything async, so browsers don't block it.
    const whatsapp = waLink(enquiryText(data));
    const win = window.open(whatsapp, "_blank");
    if (win) win.opener = null;

    trackConversion("quote_form_submit", { service: data.session, budget: data.budget, package: data.pkg || undefined });
    setSent({ name: data.name, whatsapp, opened: !!win, saved: null });

    const formData = new FormData(form);
    startSaving(async () => {
      const result = await submitContact({ status: "idle" }, formData).catch(() => null);
      setSent((s) => s && { ...s, saved: result?.status === "success" });
    });
  };

  const budgets = service ? budgetsFor(service) : [];

  return (
    <>
      {sent && (
        <div role="status" className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
          <CircleCheck aria-hidden className="size-9 text-success" strokeWidth={1.75} />
          <h2 className="mt-4 font-display text-h3">Thanks, {sent.name.split(" ")[0]}. Your enquiry is ready.</h2>
          <p className="mt-3 max-w-[52ch] text-muted">
            {sent.opened
              ? "We've opened WhatsApp with your details filled in. Press Send there, and we'll reply to confirm availability and the final price."
              : "Tap below to open WhatsApp with your details filled in, then press Send. We'll reply to confirm availability and the final price."}
          </p>
          <p className="mt-3 text-sm text-muted">Your date isn&apos;t booked yet. It&apos;s confirmed once we&apos;ve both agreed the details and the advance is paid.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={sent.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
              data-track-source="quote-form-success"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-whatsapp px-5 font-semibold text-white hover:bg-whatsapp-hover"
            >
              <MessageCircle aria-hidden className="size-[1.125rem]" />
              {sent.opened ? "Open WhatsApp again" : "Open WhatsApp"}
            </a>
            <Button variant="secondary" size="lg" arrow={false} onClick={() => setSent(null)}>
              Edit my details
            </Button>
          </div>
          {sent.saved && <p className="mt-5 text-sm text-muted">We&apos;ve also saved your enquiry, so we can call you if the WhatsApp message doesn&apos;t reach us.</p>}
        </div>
      )}
      <form
        hidden={!!sent}
        ref={formRef}
        onSubmit={onSubmit}
        onChange={onChange}
        noValidate
        aria-label="Get a photography quote"
        className="space-y-6 rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8"
      >
        {pkg && (
          <p className="rounded-md bg-sand-soft px-4 py-3 text-sm">
            Package: <strong className="font-semibold">{pkg}</strong>
            <input type="hidden" name="pkg" value={pkg} />
          </p>
        )}
        {!pkg && <input type="hidden" name="pkg" value="" />}
  
        <ChoiceGroup
          legend="1. What would you like photographed?"
          name="session"
          type="radio"
          options={sessionOptions}
          value={service}
          onValueChange={(v) => {
            setService(v);
            setErrors((prev) => ({ ...prev, session: undefined, budget: undefined }));
          }}
          error={errors.session}
        />
  
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField id="date" name="date" label="2. Event date" type="date" min={today} optional hint="Leave empty if it isn't fixed yet." error={errors.date} />
          <TextField id="location" name="location" label="3. Event location" autoComplete="address-level2" placeholder="e.g. Bhubaneswar, Cuttack, Puri" error={errors.location} />
        </div>
  
        {service && (
          <ChoiceGroup key={service} legend="4. Approximate budget" name="budget" type="radio" options={budgets} error={errors.budget} />
        )}
        {!service && (
          <fieldset aria-describedby={errors.budget ? "budget-error" : undefined}>
            <legend className="text-sm font-semibold">4. Approximate budget</legend>
            <p className="mt-2 text-sm text-muted">Choose a service first to see budget options.</p>
            {errors.budget && (
              <p id="budget-error" className="mt-2 flex items-start gap-1.5 text-sm text-error">
                <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                {errors.budget}
              </p>
            )}
          </fieldset>
        )}
  
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField id="name" name="name" label="5. Your name" autoComplete="name" error={errors.name} />
          <TextField
            id="phone"
            name="phone"
            label="6. Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            error={errors.phone}
          />
        </div>
  
        <TextField id="email" name="email" label="Email" type="email" inputMode="email" autoComplete="email" optional error={errors.email} />
  
        <TextareaField
          id="message"
          name="message"
          label="7. Anything else we should know?"
          optional
          hint="Events to cover, number of guests, ideas you love."
          rows={notes ? 6 : 3}
          key={notes}
          defaultValue={notes}
          error={errors.message}
        />
  
        {/* Honeypot for bots; hidden from people and assistive tech. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
  
        <div className="border-t border-border pt-6">
          <Button type="submit" variant="whatsapp" size="lg" arrow={false} className="w-full sm:w-auto">
            <MessageCircle aria-hidden className="size-[1.125rem]" />
            Send on WhatsApp
          </Button>
          <p className="mt-3 text-sm text-muted">
            Opens WhatsApp with your enquiry written out, and saves a copy for our team. We use your details only to reply to this enquiry.
          </p>
        </div>
      </form>
    </>
  );
}
