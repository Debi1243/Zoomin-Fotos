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
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        center && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <p className="reveal label label-rule text-accent">{label}</p>
        <h2 id={id} className="reveal-heading mt-4 heading-4 md:heading-2">
          {title}
        </h2>
        {intro && <p className="reveal mt-4 body-3 text-muted md:body-7">{intro}</p>}
      </div>
      {action && <div className="reveal shrink-0">{action}</div>}
    </header>
  );
}
