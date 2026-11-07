import { InstagramLogoIcon as Instagram } from "@phosphor-icons/react/dist/ssr";
import { instagramUrl } from "@/lib/instagram";
import { cn } from "@/lib/cn";

/** The Instagram accounts tagged on a photo or film, each linking to its profile in a new tab. */
export default function InstagramTags({ handles, title, className }: { handles?: string[]; title: string; className?: string }) {
  if (!handles?.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3", className)}>
      <Instagram aria-hidden className="size-4 shrink-0 opacity-70" />
      <ul aria-label={`People tagged in ${title}`} className="flex flex-wrap gap-x-3">
        {handles.map((handle) => (
          <li key={handle}>
            <a
              href={instagramUrl(handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center caption-1 underline-offset-4 transition-colors hover:underline focus-visible:underline"
            >
              @{handle}
              <span className="sr-only"> on Instagram (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
