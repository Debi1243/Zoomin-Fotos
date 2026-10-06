"use client";

import { useRef, useState } from "react";
import { Eraser } from "lucide-react";

/** A box to sign in with a finger, stylus or mouse. Hands back a small PNG of the strokes. */
export default function SignaturePad({ onChange }: { onChange: (png: string | null) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  // Sized on first touch: inside a dialog that is still opening, the box has no size yet.
  const ready = useRef(false);
  const setup = () => {
    const c = canvas.current!;
    if (ready.current && c.width) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.max(1, c.offsetWidth * ratio);
    c.height = Math.max(1, c.offsetHeight * ratio);
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
    ready.current = true;
  };

  const point = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  /** A white-backed copy at a modest size keeps the saved image small. */
  const exportPng = () => {
    const c = canvas.current!;
    const out = document.createElement("canvas");
    out.width = 600;
    out.height = Math.round((600 * c.height) / c.width);
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(c, 0, 0, out.width, out.height);
    return out.toDataURL("image/png");
  };

  const clear = () => {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange(null);
  };

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvas}
          aria-label="Signature box. Draw your signature here."
          role="img"
          className="h-40 w-full touch-none rounded-md border border-border-strong bg-white"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setup();
            drawing.current = true;
            const ctx = canvas.current!.getContext("2d")!;
            const [x, y] = point(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 0.1, y + 0.1);
            ctx.stroke();
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = canvas.current!.getContext("2d")!;
            const [x, y] = point(e);
            ctx.lineTo(x, y);
            ctx.stroke();
          }}
          onPointerUp={() => {
            if (!drawing.current) return;
            drawing.current = false;
            setEmpty(false);
            onChange(exportPng());
          }}
        />
        {empty && (
          <span aria-hidden className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-dashed border-neutral-300 pb-1 text-xs text-neutral-400">
            Sign here
          </span>
        )}
      </div>
      <button type="button" onClick={clear} className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <Eraser aria-hidden className="size-4" /> Clear and sign again
      </button>
    </div>
  );
}
