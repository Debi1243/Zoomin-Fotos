"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { control, TextField, TextareaField } from "@/components/forms/Field";
import { reviewEvents } from "@/lib/testimonials";
import { dataEndpoint } from "@/lib/settings";
import { callSheet } from "@/lib/sheet";
import { brand, mailHref } from "@/lib/data";
import { cn } from "@/lib/cn";

const labels = ["", "Not happy", "Could be better", "Good", "Very good", "Loved it"];

/** Lets a client send a review. It waits in the studio's sheet until the studio publishes it. */
export default function ReviewForm() {
  const [name, setName] = useState("");
  const [event, setEvent] = useState<string>("Wedding");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ busy?: boolean; error?: string; done?: boolean }>({});

  // The client portal links here with the couple's name filled in.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name");
    // Prefilling from the address happens once the page is in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (n) setName(n.slice(0, 120));
    const e = params.get("event");
    if (e && (reviewEvents as readonly string[]).includes(e)) setEvent(e);
  }, []);

  if (!dataEndpoint) {
    return (
      <p className="text-muted">
        We&apos;d love to hear from you. Email your review to{" "}
        <a href={`${mailHref}?subject=${encodeURIComponent(`A review for ${brand.name}`)}`} className="link-underline text-fg">
          {brand.email}
        </a>
        .
      </p>
    );
  }

  if (state.done) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-lg border border-border bg-surface p-8">
        <CircleCheck aria-hidden className="size-10 text-success" strokeWidth={1.5} />
        <p className="font-display text-h3">Thank you{name ? `, ${name.split(" ")[0]}` : ""}.</p>
        <p className="max-w-[44ch] text-muted">Your review means a lot to us. It will appear on this page once we&apos;ve had a look.</p>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rating || text.trim().length < 10) {
      setState({ error: "Please add your name, choose a rating and write a few words." });
      return;
    }
    setState({ busy: true });
    try {
      const result = await callSheet(dataEndpoint!, { type: "review", review: { name: name.trim(), event, date, rating, text: text.trim(), email: email.trim() } });
      if (!result.ok) throw new Error(result.error);
      setState({ done: true });
    } catch {
      setState({ error: `We couldn't send that just now. Please try again, or email it to ${brand.email}.` });
    }
  };

  const shown = hover || rating;
  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-lg border border-border bg-surface p-5 sm:p-8">
      <fieldset>
        <legend className="text-sm font-medium">Your rating</legend>
        <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="sr-only" />
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""}
              </span>
              <Star
                aria-hidden
                className={cn(
                  "size-9 transition-transform duration-200 ease-[var(--spring)]",
                  n <= shown ? "scale-110 fill-[var(--marigold-glow)] text-[var(--marigold-glow)]" : "text-border-strong",
                )}
              />
            </label>
          ))}
          <span className="ml-3 text-sm text-muted" aria-live="polite">
            {labels[shown]}
          </span>
        </div>
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="review-name" label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} hint="Shown with your review, e.g. Priya and Arjun" />
        <div>
          <label htmlFor="review-event" className="text-sm font-medium">
            What we photographed
          </label>
          <select id="review-event" value={event} onChange={(e) => setEvent(e.target.value)} className={cn(control, "mt-2 h-12 border-border")}>
            {reviewEvents.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <TextField id="review-date" label="When" type="month" optional value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField id="review-email" label="Email" type="email" optional value={email} onChange={(e) => setEmail(e.target.value)} hint="Only so we can thank you. Never shown." />
      </div>
      <TextareaField id="review-text" label="Your review" rows={5} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} hint="What was it like working with us, and how do you feel about the photographs?" />
      {state.error && (
        <p role="alert" className="flex items-start gap-2 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {state.error}
        </p>
      )}
      <Button type="submit" loading={state.busy} loadingLabel="Sending…">
        Send review
      </Button>
    </form>
  );
}
