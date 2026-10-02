import Image from "next/image";
import type { Aspect, Photo } from "@/lib/data";
import { cn } from "@/lib/cn";

const aspects: Record<Aspect, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  photo: Photo;
  /** Responsive `sizes` hint for real images. */
  sizes: string;
  priority?: boolean;
  /** Fill the parent instead of using the photo's own aspect ratio. */
  fill?: boolean;
  caption?: boolean;
  className?: string;
};

/**
 * A photograph, or a toned proof frame standing in for one until `photo.src` is set.
 * Frames carry the photo's title so the layout reads as intended before images arrive.
 */
export default function PhotoFrame({ photo, sizes, priority = false, fill = false, caption = true, className }: Props) {
  const label = `${photo.title}, ${photo.place}`;
  return (
    <div className={cn("relative overflow-hidden rounded-sm bg-inverse", fill ? "size-full" : aspects[photo.aspect], className)}>
      {photo.src ? (
        <Image
          src={`${basePath}${photo.src}`}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div
          role="img"
          aria-label={label}
          className={cn("frame absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]", `frame-${photo.tone}`)}
        />
      )}
      {caption && !photo.src && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-[#f4f2ec] md:p-5">
          <span className="font-display text-lg leading-tight italic md:text-xl">{photo.title}</span>
          <span className="label shrink-0 text-[0.625rem] text-[#f4f2ec]/75">ZF {photo.id}</span>
        </div>
      )}
    </div>
  );
}
