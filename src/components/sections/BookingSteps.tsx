import type { CSSProperties } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { bookingSteps } from "@/lib/data";

/** How booking works, in three steps, ending in the quote form. */
export default function BookingSteps() {
  return (
    <section aria-labelledby="steps-title" className="section-y bg-sand-soft">
      <div className="container-page">
        <SectionHeader id="steps-title" label="How booking works" title="Book your shoot in three simple steps" />
        <ol className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
          {bookingSteps.map((s, i) => (
            <li key={s.title} className="stagger-in relative rounded-lg border border-border bg-surface p-5 md:p-6" style={{ "--i": i } as CSSProperties}>
              <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-fg" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/contact#quote" size="lg">
            Start with step 1
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
