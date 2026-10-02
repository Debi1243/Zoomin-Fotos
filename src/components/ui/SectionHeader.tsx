import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
};

/** Label + heading + optional intro, laid on the 12-column grid. */
export default function SectionHeader({ label, title, intro, action, id, className }: Props) {
  return (
    <header className={cn("grid gap-y-6 lg:grid-cols-12 lg:gap-x-10", className)}>
      <p className="label text-muted lg:col-span-3 lg:pt-3">{label}</p>
      <div className="lg:col-span-9">
        <h2 id={id} className="max-w-[22ch] font-display text-h2">
          {title}
        </h2>
        {(intro || action) && (
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {intro && <p className="max-w-[58ch] text-lead text-muted">{intro}</p>}
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
