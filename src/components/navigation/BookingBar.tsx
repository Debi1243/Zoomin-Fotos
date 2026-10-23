"use client";

import { usePathname } from "next/navigation";
import { ButtonLink, WhatsAppButton } from "../ui/Button";
import { whatsappHref } from "@/lib/brand";

/** Pages where the bar would get in the way: the studio's own tools and the client portal. */
const HIDDEN = ["/admin", "/portal"];

/**
 * The two ways to book, always one tap away on phones and tablets: WhatsApp and the quick quote form.
 * Desktop has the same actions in the header.
 */
export default function BookingBar() {
  const pathname = usePathname();
  if (HIDDEN.some((p) => pathname.startsWith(p))) return null;
  const onContact = pathname.startsWith("/contact");

  return (
    <div className="booking-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_-8px_rgb(32_32_32/0.15)] backdrop-blur transition-[translate] duration-300 lg:hidden">
      <div className="mx-auto flex max-w-xl gap-3">
        <WhatsAppButton href={whatsappHref} source="booking-bar" className="flex-1">
          WhatsApp
        </WhatsAppButton>
        {!onContact && (
          <ButtonLink href="/contact#quote" className="flex-1" arrow={false}>
            Get a Quote
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
