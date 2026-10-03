import type { CSSProperties } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { process } from "@/lib/data";

export default function ProcessSteps() {
  return (
    <section aria-labelledby="process-title" className="section-y border-t border-border">
      <div className="container-page">
        <SectionHeader
          id="process-title"
          label="How we work"
          title="Simple to book. Calm on the day."
          intro="Four steps from first message to finished gallery, with a real person answering at every one."
        />
        <ol className="mt-14 grid md:mt-20 md:grid-cols-2 xl:grid-cols-4">
          {process.map((p, i) => (
            <li
              key={p.step}
              className="reveal relative border-t border-border-strong pb-10 pt-6 md:pr-8 xl:pb-0"
              style={{ "--i": i } as CSSProperties}
            >
              <span aria-hidden className="reveal-line absolute -top-px left-0 h-px w-12 bg-primary" style={{ "--i": i } as CSSProperties} />
              <p className="label tabular text-muted">Step {p.step}</p>
              <h3 className="mt-8 font-display text-h3">{p.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted">{p.text}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg" />
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
