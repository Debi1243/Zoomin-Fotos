"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/data";
import {
  addOns,
  builderEvents,
  coverage,
  crew,
  estimate,
  extraHours,
  initialSelection,
  summary,
  type Counter,
  type Selection,
  type Toggle,
} from "@/lib/package-builder";

/** Rolls the shown price towards the new estimate instead of jumping. */
function useRolling(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / 450);
      const eased = 1 - (1 - t) ** 3;
      const v = Math.round((start + (value - start) * eased) / 100) * 100;
      from.current = v;
      setShown(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return shown;
}

/**
 * Lets visitors put together their own wedding coverage and see an estimate as they go,
 * then send it to the booking form. Rates live in src/lib/package-builder.ts.
 */
export default function PackageBuilder({ className }: { className?: string }) {
  const router = useRouter();
  const [sel, setSel] = useState<Selection>(initialSelection);
  const total = estimate(sel);
  const shown = useRolling(total);
  const [bump, setBump] = useState(0);

  const update = (next: Selection) => {
    setSel(next);
    setBump((b) => b + 1);
  };
  const toggleEvent = (id: string) =>
    update({ ...sel, events: sel.events.includes(id) ? sel.events.filter((e) => e !== id) : [...sel.events, id] });
  const toggleOption = (id: string) =>
    update({ ...sel, options: sel.options.includes(id) ? sel.options.filter((o) => o !== id) : [...sel.options, id] });
  const setCount = (c: Counter, n: number) => update({ ...sel, counts: { ...sel.counts, [c.id]: Math.max(c.min ?? 0, Math.min(c.max, n)) } });

  const onlyPreWedding = sel.events.length === 1 && sel.events[0] === "pre-wedding";
  const request = () => {
    const params = new URLSearchParams({
      session: onlyPreWedding ? "Pre-wedding" : "Wedding",
      message: `I'd like this package (estimate ${formatRupees(total)} + GST):\n${summary(sel)}\n\n`,
    });
    router.push(`/contact/?${params}#enquiry`);
  };

  const empty = sel.events.length === 0;

  // While the builder is on screen, the floating back-to-top button steps aside for the estimate bar.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => root.classList.toggle("builder-in-view", entry.isIntersecting));
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.classList.remove("builder-in-view");
    };
  }, []);

  return (
    <section ref={sectionRef} id="build" aria-labelledby="builder-title" className={cn("section-y scroll-mt-20 border-t border-border", className)}>
      <div className="container-page">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <p className="label text-muted lg:col-span-3 lg:pt-3">
            <span aria-hidden className="label-dot festive-gradient" />
            Package builder
          </p>
          <div className="lg:col-span-9">
            <h2 id="builder-title" className="max-w-[20ch] font-display text-h2">
              Build your own <em>package.</em>
            </h2>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-muted">
              Pick your events, your team and the extras you want. The estimate updates as you go, and we confirm the final price
              after a short call.
            </p>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-8 md:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="space-y-10 lg:col-span-8">
            <Group step="1" title="Choose events">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {builderEvents.map((e) => (
                  <Tile key={e.id} on={sel.events.includes(e.id)} onClick={() => toggleEvent(e.id)} label={e.label} note={e.note} />
                ))}
              </div>
            </Group>

            <Group step="2" title="Choose coverage" note="For each event you picked">
              <div className="space-y-3">
                {crew.map((c) => (
                  <Stepper key={c.id} c={c} value={sel.counts[c.id] ?? 0} onChange={(n) => setCount(c, n)} />
                ))}
                <div className="grid gap-3 sm:grid-cols-3">
                  {coverage.map((c) => (
                    <Tile key={c.id} on={sel.options.includes(c.id)} onClick={() => toggleOption(c.id)} label={c.label} note={c.note} price={c} />
                  ))}
                </div>
              </div>
            </Group>

            <Group step="3" title="Add-ons" note="Once for the whole booking">
              <div className="grid gap-3 sm:grid-cols-2">
                {addOns.map((a) => (
                  <Tile key={a.id} on={sel.options.includes(a.id)} onClick={() => toggleOption(a.id)} label={a.label} note={a.note} price={a} />
                ))}
              </div>
              <div className="mt-3">
                <Stepper c={extraHours} value={sel.counts[extraHours.id] ?? 0} onChange={(n) => setCount(extraHours, n)} />
              </div>
            </Group>
          </div>

          {/* On phones the estimate rides along above the tab bar; on computers it sits beside the choices. */}
          <aside
            aria-label="Your estimate"
            className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] z-30 lg:top-24 lg:bottom-auto lg:col-span-4"
          >
            <div className="overflow-hidden rounded-lg border border-border bg-surface/95 shadow-lg backdrop-blur-md lg:shadow-none">
              <div className="festive-gradient h-1" />
              <div className="flex items-center gap-4 p-4 lg:block lg:p-6">
                <div className="min-w-0 flex-1">
                  <p className="label text-[0.625rem] text-muted lg:text-xs">Estimated package</p>
                  <p aria-live="polite" className="mt-1 flex flex-wrap items-baseline gap-x-2 lg:mt-3">
                    <span key={bump} className="price-pop tabular font-display text-3xl leading-none lg:text-5xl">
                      {empty ? "—" : formatRupees(shown)}
                    </span>
                    {!empty && <span className="text-sm text-muted">+ GST</span>}
                  </p>
                  <p className="mt-1 hidden text-sm text-muted lg:mt-4 lg:block">
                    {empty ? "Choose at least one event to see an estimate." : `${sel.events.length} event${sel.events.length > 1 ? "s" : ""}. Prices are negotiable.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={request}
                  disabled={empty}
                  className={buttonClasses({ className: "shrink-0 lg:mt-6 lg:h-13 lg:w-full lg:text-[0.9375rem]" })}
                >
                  Request this package
                </button>
              </div>
              <div className="hidden border-t border-border px-6 py-4 lg:block">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted">{summary(sel)}</pre>
                <button
                  type="button"
                  onClick={() => update(initialSelection)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
                >
                  <RotateCcw aria-hidden className="size-3.5" /> Start again
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Group({ step, title, note, children }: { step: string; title: string; note?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="tabular grid size-7 place-items-center rounded-full bg-fg text-xs font-medium text-bg">{step}</span>
        <span className="font-display text-2xl">{title}</span>
        {note && <span className="basis-full pl-10 text-sm text-muted sm:basis-auto sm:pl-0">{note}</span>}
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Tile({ on, onClick, label, note, price }: { on: boolean; onClick: () => void; label: string; note: string; price?: Toggle }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "relative flex min-h-[4.5rem] w-full flex-col items-start justify-center rounded-lg border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-200",
        on ? "border-fg bg-fg/[0.04] shadow-[inset_0_0_0_1px_var(--fg)]" : "border-border hover:border-border-strong",
      )}
    >
      <span className="pr-7 font-medium">{label}</span>
      <span className="mt-0.5 text-xs text-muted">
        {note}
        {price && <> · {formatRupees(price.price)}</>}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 grid size-5 place-items-center rounded-full border transition-all duration-300 ease-[var(--spring)]",
          on ? "scale-100 border-transparent bg-fg text-bg" : "scale-90 border-border-strong",
        )}
      >
        <Check className={cn("size-3 transition-transform duration-300 ease-[var(--spring)]", on ? "scale-100" : "scale-0")} strokeWidth={3} />
      </span>
    </button>
  );
}

function Stepper({ c, value, onChange }: { c: Counter; value: number; onChange: (n: number) => void }) {
  const btn = "grid size-10 place-items-center rounded-full border border-border-strong transition-colors hover:border-fg disabled:opacity-30";
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-lg border px-4 py-3", value ? "border-fg/40" : "border-border")}>
      <div>
        <p className="font-medium">{c.label}</p>
        <p className="mt-0.5 text-xs text-muted">
          {c.note} · {formatRupees(c.price)} {c.unit ? `per ${c.unit}` : "each"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= (c.min ?? 0)} aria-label={`Fewer ${c.label.toLowerCase()}`}>
          <Minus aria-hidden className="size-4" />
        </button>
        <span key={value} className="price-pop tabular w-5 text-center text-lg font-medium" aria-live="polite" aria-label={`${value} ${c.label.toLowerCase()}`}>
          {value}
        </span>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= c.max} aria-label={`More ${c.label.toLowerCase()}`}>
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
