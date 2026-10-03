import Link from "next/link";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { TextLink } from "@/components/ui/Button";
import { getService, photos } from "@/lib/data";

/** A horizontally scrolling contact sheet of recent frames. */
export default function FilmStrip() {
  const frames = photos.filter((p) => p.src);
  return (
    <section aria-labelledby="strip-title" className="py-16 md:py-24">
      <div className="container-page flex items-end justify-between gap-6">
        <div>
          <p className="label text-muted">
            <span aria-hidden className="label-dot festive-gradient" />
            Recent frames
          </p>
          <h2 id="strip-title" className="mt-4 font-display text-h2">
            From the last few seasons.
          </h2>
        </div>
        <TextLink href="/portfolio" className="hidden shrink-0 sm:inline-flex">Full portfolio</TextLink>
      </div>

      <ul
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 md:mt-14 lg:scroll-px-10 lg:px-10 xl:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))]"
        aria-label="Recent photographs"
      >
        {frames.map((p) => (
          <li key={p.id} className="reveal w-[72vw] shrink-0 snap-start sm:w-[40vw] lg:w-[26vw] xl:w-[22rem]">
            <Link href="/portfolio" className="group block">
              <PhotoFrame photo={{ ...p, aspect: "portrait" }} sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 26vw, 72vw" />
              <span className="mt-3 flex items-baseline justify-between gap-4 text-sm">
                <span>{getService(p.category)?.title}</span>
                <span className="text-muted">{p.place}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="container-page sm:hidden">
        <TextLink href="/portfolio" className="mt-4">Full portfolio</TextLink>
      </div>
    </section>
  );
}
