import { LogoMark } from "@/components/ui/Logo";
import { brand, formatRupees } from "@/lib/brand";
import { longDate, rupeesInWords, totals, type BillDoc, type StudioProfile } from "@/lib/billing";

/** What the document calls itself. A "tax invoice" needs the studio's GSTIN on it. */
export function docTitle(d: BillDoc, profile: StudioProfile) {
  if (d.kind === "quote") return "Quotation";
  return d.gst.on && profile.gstin ? "Tax Invoice" : "Invoice";
}

const money = (n: number) => formatRupees(Math.round(n * 100) / 100);

/**
 * The quotation or bill as the client sees it: A4, black on white, the studio's details,
 * the lines, GST, advance and balance, amount in words, payment details and the studio's terms.
 */
export default function BillDocument({ d, profile }: { d: BillDoc; profile: StudioProfile }) {
  const t = totals(d);
  const title = docTitle(d, profile);
  const label = "text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500";

  return (
    <article
      aria-label={`${title} ${d.number}`}
      className="bill-doc mx-auto w-full max-w-[210mm] bg-white p-6 text-[13px] leading-relaxed text-[#202020] [print-color-adjust:exact] sm:p-10"
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#b65c45] pb-5">
        <div>
          <LogoMark size="lg" className="h-14 text-[#202020]" />
          <p className="mt-3 font-display text-lg font-bold">{brand.name}</p>
          <p className="text-neutral-600">
            {profile.address || `${brand.city}, ${brand.region}`}
            <br />
            {brand.phone} · {brand.email}
            {profile.gstin && (
              <>
                <br />
                GSTIN: {profile.gstin}
              </>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-[#b65c45]">{title}</p>
          <dl className="mt-2 grid grid-cols-[auto_auto] justify-end gap-x-3 text-neutral-700">
            <dt className="text-neutral-500">No.</dt>
            <dd className="tabular font-semibold">{d.number}</dd>
            <dt className="text-neutral-500">Date</dt>
            <dd>{longDate(d.date)}</dd>
            {d.until && (
              <>
                <dt className="text-neutral-500">{d.kind === "quote" ? "Valid until" : "Due by"}</dt>
                <dd>{longDate(d.until)}</dd>
              </>
            )}
            {d.fromQuote && (
              <>
                <dt className="text-neutral-500">Quote ref.</dt>
                <dd className="tabular">{d.fromQuote}</dd>
              </>
            )}
          </dl>
        </div>
      </header>

      <section className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className={label}>{d.kind === "quote" ? "Prepared for" : "Billed to"}</p>
          <p className="mt-1 font-semibold">{d.client.name || "Client name"}</p>
          <p className="whitespace-pre-line text-neutral-600">
            {[d.client.address, [d.client.phone, d.client.email].filter(Boolean).join(" · ")].filter(Boolean).join("\n")}
            {d.client.gstin && `\nGSTIN: ${d.client.gstin}`}
          </p>
        </div>
        {(d.event.title || d.event.date || d.event.venue) && (
          <div>
            <p className={label}>Event</p>
            {d.event.title && <p className="mt-1 font-semibold">{d.event.title}</p>}
            <p className="text-neutral-600">{[longDate(d.event.date), d.event.venue].filter(Boolean).join(" · ")}</p>
          </div>
        )}
      </section>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="bg-[#f3eee7] text-left">
            <th className={`${label} w-8 px-2 py-2`}>#</th>
            <th className={`${label} px-2 py-2`}>Description</th>
            <th className={`${label} px-2 py-2 text-right`}>Qty</th>
            <th className={`${label} px-2 py-2 text-right`}>Rate</th>
            <th className={`${label} px-2 py-2 text-right`}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {d.items.map((i, n) => (
            <tr key={i.id} className="border-b border-neutral-200 align-top [break-inside:avoid]">
              <td className="tabular px-2 py-2.5 text-neutral-500">{n + 1}</td>
              <td className="px-2 py-2.5">
                <span className="font-medium">{i.description || "Item"}</span>
                {i.detail && <span className="mt-0.5 block text-[12px] text-neutral-500">{i.detail}</span>}
              </td>
              <td className="tabular px-2 py-2.5 text-right">{i.qty}</td>
              <td className="tabular px-2 py-2.5 text-right">{money(i.rate)}</td>
              <td className="tabular px-2 py-2.5 text-right font-medium">{money(i.qty * i.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex flex-col-reverse gap-6 sm:flex-row sm:justify-between">
        <p className="max-w-[48ch] text-neutral-600">
          <span className={label}>Amount in words</span>
          <br />
          {rupeesInWords(t.total)}
        </p>
        <dl className="tabular w-full max-w-[18rem] shrink-0 sm:ml-auto [&>div]:flex [&>div]:justify-between [&>div]:gap-6 [&>div]:py-1">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(t.subtotal)}</dd>
          </div>
          {t.discount > 0 && (
            <div>
              <dt>Discount</dt>
              <dd>− {money(t.discount)}</dd>
            </div>
          )}
          {d.gst.on && (
            <>
              <div className="text-neutral-600">
                <dt>CGST {d.gst.rate / 2}%</dt>
                <dd>{money(t.cgst)}</dd>
              </div>
              <div className="text-neutral-600">
                <dt>SGST {d.gst.rate / 2}%</dt>
                <dd>{money(t.sgst)}</dd>
              </div>
            </>
          )}
          <div className="border-t-2 border-[#202020] text-[15px] font-bold">
            <dt>Total</dt>
            <dd>{money(t.total)}</dd>
          </div>
          {t.advance > 0 && (
            <>
              <div className="text-neutral-700">
                <dt>{d.kind === "quote" ? "Advance to confirm" : "Received"}</dt>
                <dd>{d.kind === "quote" ? money(t.advance) : `− ${money(t.advance)}`}</dd>
              </div>
              {d.kind === "bill" && (
                <div className="border-t border-neutral-300 font-bold text-[#b65c45]">
                  <dt>Balance due</dt>
                  <dd>{money(t.balance)}</dd>
                </div>
              )}
            </>
          )}
        </dl>
      </div>

      {(profile.upiId || profile.bank) && (
        <section className="mt-6 rounded-md border border-neutral-200 p-3 [break-inside:avoid]">
          <p className={label}>Payment details</p>
          <p className="mt-1 whitespace-pre-line text-neutral-700">
            {[profile.upiId && `UPI: ${profile.upiId}`, profile.bank].filter(Boolean).join("\n")}
          </p>
        </section>
      )}

      {d.notes && (
        <section className="mt-5 [break-inside:avoid]">
          <p className={label}>Notes</p>
          <p className="mt-1 whitespace-pre-line text-neutral-700">{d.notes}</p>
        </section>
      )}

      {d.terms && (
        <section className="mt-5 [break-inside:avoid]">
          <p className={label}>Terms</p>
          <p className="mt-1 whitespace-pre-line text-[12px] text-neutral-600">{d.terms}</p>
        </section>
      )}

      <footer className="mt-10 flex items-end justify-between gap-6 border-t border-neutral-200 pt-4 text-[12px] text-neutral-500">
        <p>
          Thank you for choosing {brand.name}.
          {d.kind === "quote" && " This quotation is not a booking; your date is confirmed once the advance is received."}
        </p>
        <p className="shrink-0 text-right">
          For {brand.name}
          <span className="mt-8 block border-t border-neutral-400 pt-1">Authorised signatory</span>
        </p>
      </footer>
    </article>
  );
}
