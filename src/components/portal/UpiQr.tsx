"use client";

import { useMemo } from "react";
import qrcode from "qrcode-generator";

/** A QR code for a UPI payment link, drawn as SVG so it stays sharp and prints cleanly. */
export default function UpiQr({ link, className }: { link: string; className?: string }) {
  const svg = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(link);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [link]);
  return <div role="img" aria-label="QR code to pay by UPI" className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
