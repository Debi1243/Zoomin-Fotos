import Image from "next/image";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/shop";
import { cn } from "@/lib/cn";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Shot({ src, sizes, position, priority }: { src: string; sizes: string; position?: string; priority?: boolean }) {
  return (
    <Image
      src={`${basePath}${src}`}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

/**
 * The product drawn in CSS around one of the studio's own photographs: an open album spread,
 * a framed print, a canvas, a calendar, a mug. A real product photograph (`image`) replaces it.
 */
export default function ProductMockup({ product, sizes, priority = false, className }: { product: Product; sizes: string; priority?: boolean; className?: string }) {
  const { photo, mockup } = product;

  if (product.image) {
    return (
      <div className={cn("mock-stage relative overflow-hidden", className)}>
        <Shot src={product.image} sizes={sizes} priority={priority} />
      </div>
    );
  }

  const body = (() => {
    switch (mockup) {
      case "album":
        return (
          <div className="mock-album">
            <div className="mock-album-spread">
              <Shot src={photo} sizes={sizes} priority={priority} />
            </div>
          </div>
        );
      case "frame":
        return (
          <div className="mock-frame">
            <div className="mock-frame-mat">
              <div className="relative size-full">
                <Shot src={photo} sizes={sizes} priority={priority} />
              </div>
            </div>
          </div>
        );
      case "collage":
        return (
          <div className="mock-frame mock-frame-wide">
            <div className="mock-frame-mat grid grid-cols-3 grid-rows-2 gap-[4%]">
              {["50% 20%", "20% 50%", "80% 40%", "40% 80%", "60% 60%", "10% 10%"].map((pos, i) => (
                <div key={pos} className={cn("relative", i === 0 && "col-span-2 row-span-2")}>
                  <Shot src={photo} sizes={sizes} position={pos} priority={priority && i === 0} />
                </div>
              ))}
            </div>
          </div>
        );
      case "print":
        return (
          <div className="mock-prints">
            <span aria-hidden className="mock-print mock-print-back" />
            <span aria-hidden className="mock-print mock-print-mid" />
            <div className="mock-print">
              <div className="relative size-full">
                <Shot src={photo} sizes={sizes} priority={priority} />
              </div>
            </div>
          </div>
        );
      case "canvas":
        return (
          <div className="mock-canvas">
            <Shot src={photo} sizes={sizes} priority={priority} />
          </div>
        );
      case "triptych":
        return (
          <div className="mock-triptych">
            {["0% 50%", "50% 50%", "100% 50%"].map((pos, i) => (
              <div key={pos} className="mock-canvas">
                <Shot src={photo} sizes={sizes} position={pos} priority={priority && i === 1} />
              </div>
            ))}
          </div>
        );
      case "calendar":
        return (
          <div className="mock-calendar">
            <span aria-hidden className="mock-calendar-rings" />
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Shot src={photo} sizes={sizes} priority={priority} />
            </div>
            <span aria-hidden className="mock-calendar-month">January</span>
            <span aria-hidden className="mock-calendar-grid">
              {Array.from({ length: 28 }, (_, i) => (
                <span key={i} className={i === 11 ? "is-marked" : undefined} />
              ))}
            </span>
          </div>
        );
      case "mug":
        return (
          <div className="mock-mug">
            <span aria-hidden className="mock-mug-handle" />
            <div className="mock-mug-body">
              <div className="mock-mug-print">
                <Shot src={photo} sizes={sizes} priority={priority} />
              </div>
            </div>
          </div>
        );
      case "cushion":
        return (
          <div className="mock-cushion">
            <Shot src={photo} sizes={sizes} priority={priority} />
          </div>
        );
      case "magnets":
        return (
          <div className="mock-magnets">
            {["30% 30%", "60% 40%", "45% 70%"].map((pos, i) => (
              <div key={pos} className="mock-magnet" style={{ "--i": i } as CSSProperties}>
                <Shot src={photo} sizes={sizes} position={pos} priority={priority && i === 0} />
              </div>
            ))}
          </div>
        );
    }
  })();

  return <div className={cn("mock-stage relative grid place-items-center overflow-hidden", className)}>{body}</div>;
}
