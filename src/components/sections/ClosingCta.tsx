import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { brand, mailHref, telHref } from "@/lib/data";

type Props = { title?: string; text?: string };

export default function ClosingCta({
  title = "Tell us about your day.",
  text = "Share the date, the place and what matters most. We reply within one working day with availability and a clear quote.",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="surface-inverse aurora overflow-hidden">
      <div className="container-page grid gap-y-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-x-10">
        <p className="label text-inverse-muted lg:col-span-3 lg:pt-4">Book a shoot</p>
        <div className="lg:col-span-9">
          <h2 id="cta-title" className="reveal max-w-[16ch] font-display text-h1">
            {title}
          </h2>
          <p className="reveal mt-6 max-w-[52ch] text-lead text-inverse-muted" style={{ "--i": 1 } as CSSProperties}>{text}</p>
          <div className="reveal mt-10 flex flex-col gap-8 sm:flex-row sm:items-center" style={{ "--i": 2 } as CSSProperties}>
            <ButtonLink href="/contact" size="lg">Check your date</ButtonLink>
            <div className="text-sm">
              <a href={mailHref} className="link-underline block w-fit">{brand.email}</a>
              <a href={telHref} className="link-underline mt-1 block w-fit text-inverse-muted">{brand.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
