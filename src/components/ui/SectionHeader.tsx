import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  id?: string;
  /** Centre the heading (used for short, standalone sections). */
  center?: boolean;
  className?: string;
};

/** Eyebrow label, heading and optional intro, with an optional action on the right on wide screens. */
export default function SectionHeader({ label, title, intro, action, id, center, className }: Props) {
  return (
    <header
      className={cn(
        "reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        center && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <p className="label text-accent">{label}</p>
        <h2 id={id} className="mt-3 font-display text-h2">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lead text-muted">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
