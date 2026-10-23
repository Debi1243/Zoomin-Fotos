import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { whatsappHref } from "@/lib/data";

type Props = { title?: string; text?: string };

export default function ClosingCta({
  title = "Your Moments Deserve Beautiful Photography.",
  text = "Find the right photography package for your celebration.",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="surface-inverse">
      <div className="container-page py-16 text-center md:py-20">
        <h2 id="cta-title" className="reveal mx-auto max-w-[24ch] font-display text-h2">
          {title}
        </h2>
        <p className="reveal mx-auto mt-4 max-w-[48ch] text-lead text-inverse-muted">{text}</p>
        <div className="reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact#quote" size="lg">
            Get Your Photography Quote
          </ButtonLink>
          <WhatsAppButton href={whatsappHref} source="closing-cta" size="lg" />
        </div>
      </div>
    </section>
  );
}
