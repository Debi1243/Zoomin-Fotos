"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CheckIcon as Check,
  CheckCircleIcon as CheckCircle,
  LockSimpleIcon as Lock,
  MinusIcon as Minus,
  PlusIcon as Plus,
  ShoppingBagIcon as Bag,
  TrashIcon as Trash,
  WhatsappLogoIcon as WhatsApp,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import ProductMockup from "./ProductMockup";
import Checkout, { type Field, type PaidOrder } from "@/components/payments/Checkout";
import { startCheckout } from "@/app/payments/actions";
import { cart, useCart, type CartLine } from "./cart-store";
import { buttonClasses } from "@/components/ui/Button";
import { brand, formatRupees, waLink } from "@/lib/brand";
import { onlinePayments } from "@/lib/checkout";
import { lowestPrice, type Product, type ShopCategory } from "@/lib/shop";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type Sort = "featured" | "price-asc" | "price-desc";

const control =
  "field h-11 rounded-lg border border-border-strong bg-surface px-3 body-6 text-fg transition-[border-color,box-shadow] duration-300 hover:border-fg focus-visible:border-fg";

function orderText(lines: { product: Product; option: string; qty: number; price: number }[]) {
  const rows = lines.map((l, i) => `${i + 1}. ${l.product.name} (${l.option}) x ${l.qty}: ${formatRupees(l.price * l.qty)}`);
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return [
    "Hi Zoomin Fotos! I'd like to order:",
    ...rows,
    `Estimated total: ${formatRupees(total)}`,
    "",
    "Please confirm the price and delivery. I'll share my photos here.",
  ].join("\n");
}

const deliveryFields: Field[] = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", optional: true },
  { name: "address", label: "House, street and area", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2", half: true },
  { name: "pincode", label: "PIN code", autoComplete: "postal-code", inputMode: "numeric", half: true },
  { name: "note", label: "Anything we should know", autoComplete: "off", optional: true },
];

function ProductCard({ product, index, categoryLabel }: { product: Product; index: number; categoryLabel: string }) {
  const [optionLabel, setOptionLabel] = useState(product.options[0].label);
  const [added, setAdded] = useState(false);
  const option = product.options.find((o) => o.label === optionLabel) ?? product.options[0];
  const selectId = `size-${product.id}`;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <li
      className={cn("lift group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm hover:border-border-strong", index >= 3 && "stagger-in")}
      data-top={index < 3 || undefined}
      style={{ "--i": index % 3 } as CSSProperties}
    >
      <div className="relative">
        <ProductMockup product={product} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={index < 3} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-fg px-3 py-1 caption-3 text-bg">{product.badge}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label text-accent">{categoryLabel}</p>
        <h3 className="mt-2 heading-6">{product.name}</h3>
        <p className="mt-2 body-6 text-muted">{product.description}</p>

        <div className="mt-auto pt-5">
          {product.options.length > 1 ? (
            <div>
              <label htmlFor={selectId} className="caption-4 text-muted">
                Size or finish
              </label>
              <select id={selectId} value={option.label} onChange={(e) => setOptionLabel(e.target.value)} className={cn(control, "mt-1 w-full")}>
                {product.options.map((o) => (
                  <option key={o.label} value={o.label}>
                    {o.label}: {formatRupees(o.price)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="caption-2 text-muted">{option.label}</p>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="tabular font-display text-2xl text-fg" aria-live="polite">
              {formatRupees(option.price)}
            </p>
            {product.placeholder && (
              <span className="rounded-full border border-dashed border-gold-soft px-2 py-0.5 caption-4 text-gold-text" title="The studio will confirm this price">
                Sample price
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                cart.add(product.id, option.label);
                setAdded(true);
              }}
              data-track="add_to_cart"
              data-track-source={`shop:${product.id}`}
              aria-label={`Add ${product.name}, ${option.label}, to cart`}
              className={buttonClasses({ variant: "secondary", className: "px-2" })}
            >
              {added ? <Check aria-hidden weight="bold" className="size-4 text-whatsapp-text" /> : <Bag aria-hidden className="size-4" />}
              {added ? "Added" : "Add to cart"}
            </button>
            <a
              href={waLink(`Hi Zoomin Fotos! I'd like to order the ${product.name} (${option.label}, ${formatRupees(option.price)}). Is it available?`)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
              data-track-source={`shop:${product.id}`}
              aria-label={`Order ${product.name}, ${option.label}, on WhatsApp`}
              className={buttonClasses({ variant: "whatsapp", className: "px-2" })}
            >
              <WhatsApp aria-hidden weight="fill" className="size-5" />
              Order
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartDrawer({ open, onClose, products }: { open: boolean; onClose: () => void; products: Product[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const lines = useCart();
  const items = lines
    .map((l: CartLine) => {
      const product = products.find((p) => p.id === l.id);
      const option = product?.options.find((o) => o.label === l.option);
      return product && option ? { product, option: l.option, qty: l.qty, price: option.price } : null;
    })
    .filter((l): l is NonNullable<typeof l> => !!l);
  const total = items.reduce((sum, l) => sum + l.price * l.qty, 0);
  const anySample = items.some((l) => l.product.placeholder);
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [paid, setPaid] = useState<PaidOrder | null>(null);
  // Razorpay opens its own window above the page; a modal dialog would sit on top of it and block it.
  const [paying, setPaying] = useState(false);
  const payingRef = useRef(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const show = open && !paying;
    if (show && !d.open) d.showModal();
    if (!show && d.open) d.close();
  }, [open, paying]);

  const close = () => {
    if (payingRef.current) return;
    if (paid) setPaid(null);
    setStep("cart");
    onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="cart-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-transparent p-0"
    >
      <div className="cart-panel flex h-full flex-col bg-bg text-fg shadow-lg">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 id="cart-title" className="heading-5">
            {paid ? "Order placed" : step === "details" ? "Checkout" : "Your cart"}
          </h2>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close cart" className="grid size-11 place-items-center rounded-lg border border-border transition-colors hover:border-fg">
            <X aria-hidden className="size-5" />
          </button>
        </div>

        {paid ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center" role="status">
            <CheckCircle aria-hidden weight="fill" className="size-12 text-whatsapp-text" />
            <p className="title-2">Thank you, {paid.name.split(" ")[0]}. Payment received.</p>
            <p className="body-6 text-muted">
              We have your order and {formatRupees(paid.amount / 100)} payment. Send us the photos you want printed on WhatsApp and we will share a
              preview before we make it.
            </p>
            <p className="caption-2 text-muted">
              Payment ID: <span className="tabular select-all text-fg">{paid.paymentId}</span>
            </p>
            <a
              href={waLink(`Hi Zoomin Fotos! I just paid for a shop order (payment ID ${paid.paymentId}). Here are my photos.`)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
              data-track-source="shop-paid"
              className={buttonClasses({ variant: "whatsapp", size: "lg", className: "mt-2 w-full" })}
            >
              <WhatsApp aria-hidden weight="fill" className="size-5" />
              Send my photos on WhatsApp
            </a>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <Bag aria-hidden className="size-10 text-gold-soft" />
            <p className="title-2">Your cart is empty</p>
            <p className="body-6 text-muted">Add an album, a frame or a few prints, then send the whole order to us on WhatsApp.</p>
            <button type="button" onClick={() => ref.current?.close()} className={buttonClasses({ variant: "secondary", className: "mt-2" })}>
              Keep browsing
            </button>
          </div>
        ) : step === "details" ? (
          <Checkout
            fields={deliveryFields}
            defaults={{ city: brand.city }}
            title="Delivery details"
            intro="We call or WhatsApp you on this number to collect your photos and arrange delivery."
            amount={total}
            description={`Shop order, ${lines.reduce((n, l) => n + l.qty, 0)} item(s)`}
            start={(customer) => startCheckout({ lines, customer })}
            onBack={{ label: "Back to cart", onClick: () => setStep("cart") }}
            onPaying={(p) => {
              payingRef.current = p;
              setPaying(p);
            }}
            onPaid={(order) => {
              setPaid(order);
              setStep("cart");
              cart.clear();
            }}
          />
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((l) => (
                <li key={`${l.product.id}|${l.option}`} className="flex gap-4 py-4">
                  <ProductMockup product={l.product} sizes="96px" className="w-24 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="title-3">{l.product.name}</p>
                    <p className="caption-2 text-muted">{l.option}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-border-strong" role="group" aria-label={`Quantity of ${l.product.name}`}>
                        <button
                          type="button"
                          onClick={() => cart.setQty(l.product.id, l.option, l.qty - 1)}
                          aria-label={l.qty === 1 ? `Remove ${l.product.name}` : "One fewer"}
                          className="grid size-11 place-items-center rounded-l-lg transition-colors hover:bg-sand-soft"
                        >
                          {l.qty === 1 ? <Trash aria-hidden className="size-4" /> : <Minus aria-hidden className="size-4" />}
                        </button>
                        <span className="tabular w-8 text-center body-5" aria-live="polite">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => cart.setQty(l.product.id, l.option, l.qty + 1)}
                          aria-label="One more"
                          className="grid size-11 place-items-center rounded-r-lg transition-colors hover:bg-sand-soft"
                        >
                          <Plus aria-hidden className="size-4" />
                        </button>
                      </div>
                      <p className="tabular body-4">{formatRupees(l.price * l.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="body-5 text-muted">Estimated total</p>
                <p className="tabular font-display text-2xl">{formatRupees(total)}</p>
              </div>
              <p className="mt-2 caption-2 text-muted">
                {onlinePayments
                  ? `${anySample ? "Some prices are samples. " : ""}Pay online now, or send the order on WhatsApp and pay once we confirm the price. Either way we collect your photos on WhatsApp. Delivery in Bhubaneswar, or pick up from the studio.`
                  : `${anySample ? "Some prices are samples. " : ""}We confirm the final price, your photos and delivery on WhatsApp before you pay. Delivery in Bhubaneswar, or pick up from the studio.`}
              </p>
              {onlinePayments && (
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  data-track="checkout_open"
                  data-track-source="shop-cart"
                  className={buttonClasses({ size: "lg", className: "mt-4 w-full" })}
                >
                  <Lock aria-hidden weight="bold" className="size-5" />
                  Checkout and pay online
                </button>
              )}
              <a
                href={waLink(orderText(items))}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_click"
                data-track-source="shop-cart"
                className={buttonClasses({ variant: onlinePayments ? "secondary" : "whatsapp", size: "lg", className: onlinePayments ? "mt-2 w-full" : "mt-4 w-full" })}
              >
                <WhatsApp aria-hidden weight="fill" className={cn("size-5", onlinePayments && "text-whatsapp-text")} />
                Send order on WhatsApp
              </a>
              <button type="button" onClick={() => cart.clear()} className="mt-2 inline-flex min-h-11 w-full items-center justify-center button-sm text-muted transition-colors hover:text-fg">
                Empty the cart
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/** Category filters, sorting, the product grid and the cart. Orders are paid online (Razorpay) or sent to the studio on WhatsApp. */
export default function Shop({ products, categories }: { products: Product[]; categories: ShopCategory[] }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const lines = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  // The cart count gives a small bump each time something is added.
  const [bump, setBump] = useState(0);
  const lastCount = useRef(count);
  useEffect(() => {
    if (count > lastCount.current) setBump((b) => b + 1);
    lastCount.current = count;
  }, [count]);

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);
  const list = sort === "featured" ? filtered : [...filtered].sort((a, b) => (sort === "price-asc" ? 1 : -1) * (lowestPrice(a) - lowestPrice(b)));
  const label = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;
  const filters = [{ slug: "all", label: "All", count: products.length }, ...categories];

  // Changing the filter or sort: the first row fades and rises into place; the rest use the scroll reveal.
  const gridRef = useRef<HTMLUListElement>(null);
  const shown = useRef(`${filter}-${sort}`);
  useGSAP(
    () => {
      const key = `${filter}-${sort}`;
      if (shown.current === key) return;
      shown.current = key;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-top]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, clearProps: "opacity,visibility,transform" });
      });
      return () => mm.revert();
    },
    { dependencies: [filter, sort], scope: gridRef, revertOnUpdate: true },
  );

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by product" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => (
            <button
              key={f.slug}
              type="button"
              aria-pressed={filter === f.slug}
              onClick={() => setFilter(f.slug)}
              className={cn(
                "chip inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
                filter === f.slug ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:border-fg",
              )}
            >
              {f.label}
              <span className={cn("tabular text-xs", filter === f.slug ? "text-primary-fg" : "text-muted")}>{f.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="shop-sort" className="sr-only">
            Sort products
          </label>
          <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(control, "flex-1 lg:flex-none")}>
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            className={buttonClasses({ variant: "secondary", className: "shrink-0" })}
          >
            <Bag aria-hidden className="size-5" />
            Cart
            <span key={bump} className={cn("tabular grid min-w-6 place-items-center rounded-full px-1.5 caption-3", count ? "cart-bump bg-primary text-primary-fg" : "bg-sand text-muted")}>
              {count}
            </span>
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} products
      </p>

      <ul key={`${filter}-${sort}`} ref={gridRef} className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 lg:grid-cols-3 lg:gap-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} categoryLabel={label(p.category)} />
        ))}
      </ul>

      {/* Once something is in the cart, it stays one tap away while scrolling. */}
      {count > 0 && !cartOpen && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
          className="cart-fab fixed bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+1rem)] right-4 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-5 button-sm text-bg shadow-lg transition-[translate,scale] duration-300 hover:-translate-y-px active:scale-[0.98] sm:right-6"
        >
          <Bag aria-hidden className="size-5" />
          View cart
          <span key={bump} className="cart-bump tabular grid min-w-6 place-items-center rounded-full bg-gold-soft px-1.5 caption-3 text-[#05070c]">
            {count}
          </span>
        </button>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </>
  );
}
