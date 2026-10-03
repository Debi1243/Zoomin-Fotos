import PhotoMarquee from "@/components/motion/PhotoMarquee";
import { cn } from "@/lib/cn";
import { photos, type ServiceSlug } from "@/lib/data";

type Props = {
  /** Limit to one service; falls back to every real photo when that service has too few. */
  category?: ServiceSlug;
  rows?: 1 | 2;
  className?: string;
};

/** One or two drifting rows of real photographs, running in opposite directions. */
export default function PhotoRibbon({ category, rows = 2, className }: Props) {
  const real = photos.filter((p) => p.src);
  const own = category ? real.filter((p) => p.category === category) : real;
  const list = own.length >= 4 ? own : real;
  const half = Math.ceil(list.length / 2);
  const [first, second] = rows === 2 && list.length >= 8 ? [list.slice(0, half), list.slice(half)] : [list, [...list].reverse()];

  return (
    <section aria-hidden className={cn("space-y-3 overflow-hidden py-14 sm:space-y-4 md:py-20", className)}>
      <PhotoMarquee photos={first} speed={-38} />
      {rows === 2 && <PhotoMarquee photos={second} speed={38} />}
    </section>
  );
}
