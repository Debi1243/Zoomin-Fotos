import { ButtonLink, WhatsAppLink } from "@/components/ui/Button";
import { whatsappHref } from "@/lib/data";

type Props = {
  title?: string;
  text?: string;
  /** The page's primary action, the same one its hero uses. */
  href?: string;
  label?: string;
};

/** The last section of a landing page: the same primary action as the top, with WhatsApp as a quiet second way in. */
export default function ClosingCta({
  title = "Your moments deserve beautiful photography.",
  text = "Find the right photography package for your celebration.",
  href = "/packages",
  label = "See packages and prices",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="surface-inverse">
      <div className="container-page py-16 text-center md:py-24">
        <h2 id="cta-title" className="reveal mx-auto max-w-[680px] heading-4 md:heading-2">
          {title}
        </h2>
        <p className="reveal mx-auto mt-4 max-w-[680px] body-3 text-inverse-muted md:body-7">{text}</p>
        <div className="reveal mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <ButtonLink href={href} size="lg" className="w-full sm:w-auto">
            {label}
          </ButtonLink>
          <WhatsAppLink href={whatsappHref} source="closing-cta" />
        </div>
      </div>
    </section>
  );
}
