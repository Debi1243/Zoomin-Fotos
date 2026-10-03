import { services } from "@/lib/data";

/** A slow ribbon of what the studio photographs. Decorative: the same list is in the services section. */
export default function Marquee() {
  const items = [...services.map((s) => s.title), "Odisha & beyond"];
  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-[clamp(2rem,1.4rem+2.6vw,3.75rem)] leading-none italic md:px-10">{t}</span>
          <span className="size-2.5 rotate-45 bg-gold-glow" />
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-hidden className="marquee overflow-hidden bg-gradient-to-r from-[#b8165c] via-[#c62828] to-[#b8165c] py-6 text-white md:py-8">
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
