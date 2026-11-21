"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon as CheckCircle, LockSimpleIcon as Lock, WhatsappLogoIcon as WhatsApp, XIcon as X } from "@phosphor-icons/react/dist/ssr";
import Checkout, { type Field, type PaidOrder } from "./Checkout";
import { buttonClasses } from "@/components/ui/Button";
import { startPackageCheckout } from "@/app/payments/actions";
import { formatRupees, waLink } from "@/lib/brand";
import { bookingAdvance, onlinePayments } from "@/lib/checkout";

const fields = (today: string): Field[] => [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", optional: true },
  { name: "date", label: "Wedding date", type: "date", autoComplete: "off", min: today, half: true },
  { name: "venue", label: "City or venue", autoComplete: "address-level2", half: true },
  { name: "note", label: "Other events or anything we should know", autoComplete: "off", optional: true },
];

/**
 * "Pay advance online" on a package card: the customer enters their date and venue and pays the
 * booking advance through Razorpay. The server looks up the package and the advance itself.
 */
export default function PackagePay({ service, pkg, price }: { service: string; pkg: string; price: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [paid, setPaid] = useState<PaidOrder | null>(null);
  // Razorpay opens its own window above the page; a modal dialog would sit on top of it and block it.
  const [paying, setPaying] = useState(false);
  const payingRef = useRef(false);
  const advance = bookingAdvance(price);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const show = open && !paying;
    if (show && !d.open) d.showModal();
    if (!show && d.open) d.close();
  }, [open, paying]);

  if (!onlinePayments) return null;

  const close = () => {
    if (payingRef.current) return;
    setPaid(null);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-track="checkout_open"
        data-track-source={`package:${pkg}`}
        aria-label={`Book the ${pkg} package and pay a ${formatRupees(advance)} advance online`}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg button-sm text-accent transition-colors hover:bg-sand-soft"
      >
        <Lock aria-hidden weight="bold" className="size-4" />
        Pay {formatRupees(advance)} advance online
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`pay-${pkg}-title`}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="cart-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-transparent p-0"
      >
        <div className="cart-panel flex h-full flex-col bg-bg text-fg shadow-lg">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 id={`pay-${pkg}-title`} className="heading-5">
              {paid ? "Advance received" : `Book ${pkg}`}
            </h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="grid size-11 place-items-center rounded-lg border border-border transition-colors hover:border-fg">
              <X aria-hidden className="size-5" />
            </button>
          </div>

          {paid ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center" role="status">
              <CheckCircle aria-hidden weight="fill" className="size-12 text-whatsapp-text" />
              <p className="title-2">Thank you, {paid.name.split(" ")[0]}. Your advance is paid.</p>
              <p className="body-6 text-muted">
                We have your {formatRupees(paid.amount / 100)} advance for the {pkg} package. We will call you to confirm your date, your events and the
                balance. If we can&apos;t take your date, we refund the advance in full.
              </p>
              <p className="caption-2 text-muted">
                Payment ID: <span className="tabular select-all text-fg">{paid.paymentId}</span>
              </p>
              <a
                href={waLink(`Hi Zoomin Fotos! I just paid the advance for the ${pkg} package (payment ID ${paid.paymentId}).`)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_click"
                data-track-source="package-paid"
                className={buttonClasses({ variant: "whatsapp", size: "lg", className: "mt-2 w-full" })}
              >
                <WhatsApp aria-hidden weight="fill" className="size-5" />
                Message us on WhatsApp
              </a>
            </div>
          ) : (
            open && (
              <Checkout
                fields={fields(new Date().toISOString().slice(0, 10))}
                title="Your wedding details"
                intro={
                  <>
                    <p>
                      {pkg}: {formatRupees(price)} + GST. Pay a {formatRupees(advance)} advance now to request your date. The balance is due once we
                      confirm the date and the final price.
                    </p>
                    <p className="mt-1">If your date isn&apos;t available, we refund the advance in full.</p>
                  </>
                }
                amount={advance}
                description={`Advance: ${pkg} package`}
                start={(booking) => startPackageCheckout({ service, pkg, booking })}
                onPaying={(p) => {
                  payingRef.current = p;
                  setPaying(p);
                }}
                onPaid={setPaid}
              />
            )
          )}
        </div>
      </dialog>
    </>
  );
}
