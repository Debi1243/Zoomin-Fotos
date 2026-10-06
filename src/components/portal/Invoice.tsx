import { brand, formatRupees } from "@/lib/data";
import { money, type Booking } from "@/lib/booking";

/** The booking's invoice: package lines, GST, payments received and the balance. */
export default function Invoice({ b }: { b: Booking }) {
  const m = money(b);
  const issued = new Date(b.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const row = "flex justify-between gap-6 py-1.5";
  return (
    <article className="invoice bg-white p-6 text-[#171512] sm:p-10" aria-label="Invoice">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="mt-2 text-sm text-neutral-600">
            {brand.city}, {brand.region}
            <br />
            {brand.phone} · {brand.email}
          </p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Invoice</p>
          <p className="tabular mt-1 font-medium">{b.code}-INV</p>
          <p className="mt-1 text-neutral-600">{issued}</p>
        </div>
      </header>
      <div className="mt-6 text-sm">
        <p className="text-xs uppercase tracking-widest text-neutral-500">Billed to</p>
        <p className="mt-1 font-medium">{b.client.names}</p>
        <p className="text-neutral-600">{[b.client.phone, b.client.email].filter(Boolean).join(" · ")}</p>
        <p className="mt-3 text-neutral-600">
          {b.title}
          {b.package.name && <> · {b.package.name}</>}
        </p>
      </div>
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-widest text-neutral-500">
            <th className="py-2 font-normal">Item</th>
            <th className="py-2 text-right font-normal">Amount</th>
          </tr>
        </thead>
        <tbody>
          {b.package.items.map((i, n) => (
            <tr key={n} className="border-b border-neutral-100">
              <td className="py-2 pr-4">{i.label}</td>
              <td className="tabular py-2 text-right">{formatRupees(i.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tabular ml-auto mt-4 max-w-xs text-sm">
        <p className={row}>
          <span>Subtotal</span>
          <span>{formatRupees(m.subtotal)}</span>
        </p>
        {b.package.discount > 0 && (
          <p className={row}>
            <span>Discount</span>
            <span>− {formatRupees(b.package.discount)}</span>
          </p>
        )}
        <p className={row}>
          <span>GST at {b.package.gstRate}%</span>
          <span>{formatRupees(m.gst)}</span>
        </p>
        <p className={`${row} border-t border-neutral-300 font-semibold`}>
          <span>Total</span>
          <span>{formatRupees(m.total)}</span>
        </p>
        <p className={row}>
          <span>Received</span>
          <span>− {formatRupees(m.paid)}</span>
        </p>
        <p className={`${row} border-t border-neutral-300 text-base font-semibold`}>
          <span>Balance due</span>
          <span>{formatRupees(m.balance)}</span>
        </p>
      </div>
      {b.payments.some((p) => p.status === "confirmed") && (
        <div className="mt-8 text-sm">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Payments received</p>
          <ul className="mt-2 space-y-1 text-neutral-700">
            {b.payments
              .filter((p) => p.status === "confirmed")
              .map((p) => (
                <li key={p.id} className="tabular">
                  {new Date(p.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {formatRupees(p.amount)} ·{" "}
                  {p.reference || p.method}
                </li>
              ))}
          </ul>
        </div>
      )}
      <p className="mt-10 text-xs text-neutral-500">Thank you for choosing {brand.name}.</p>
    </article>
  );
}
