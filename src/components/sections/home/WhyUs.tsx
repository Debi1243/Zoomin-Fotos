import type { CSSProperties } from "react";
import {
  CalendarCheckIcon,
  CameraIcon,
  FilmSlateIcon,
  HardDrivesIcon,
  SealCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import SectionHeader from "@/components/ui/SectionHeader";
import { reasons } from "@/lib/data";

const icons: Icon[] = [UsersThreeIcon, FilmSlateIcon, HardDrivesIcon, CalendarCheckIcon, CameraIcon, SealCheckIcon];

/**
 * Six reasons to book, each one something the studio already does or publishes. Set as an open,
 * numbered list rather than a wall of cards, so the photographs around it stay the main event.
 */
export default function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="why-title"
          label="Why Zoomin Fotos"
          title="Professional execution, from the first call to the final album"
        />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Ico = icons[i % icons.length];
            return (
              <li key={r.title} className="stagger-in border-t border-border pt-6" style={{ "--i": i % 3 } as CSSProperties}>
                <div className="flex items-center justify-between">
                  <Ico aria-hidden className="size-6 text-accent" />
                  <span aria-hidden className="font-display heading-5 italic tabular text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 heading-6">{r.title}</h3>
                <p className="mt-2 body-6 text-muted">{r.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
