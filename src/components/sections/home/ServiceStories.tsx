import type { CSSProperties } from "react";
import Link from "next/link";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { photosIn, services } from "@/lib/data";

/**
 * A row of story-style circles, one per service, for phones and tablets: the
 * quickest way into each gallery, in the shape app users already know.
 */
export default function ServiceStories() {
  return (
    <nav aria-label="Services" className="lg:hidden">
      <ul className="stories container-page flex gap-4 overflow-x-auto pb-1 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {services.map((s, i) => {
          const cover = photosIn(s.slug).find((p) => p.src) ?? photosIn(s.slug)[0];
          return (
            <li key={s.slug} className="story rise shrink-0" style={{ "--i": i } as CSSProperties}>
              <Link href={`/services/${s.slug}`} className="flex w-[4.75rem] flex-col items-center gap-1.5">
                <span className="story-ring">
                  {cover && <PhotoFrame photo={{ ...cover, aspect: "square" }} caption={false} sizes="5rem" className="story-photo" />}
                </span>
                <span className="w-full truncate text-center text-[0.6875rem] font-medium">{s.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
