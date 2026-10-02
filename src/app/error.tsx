"use client";

import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/data";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-page grid min-h-[60vh] content-center gap-y-8 py-24 lg:grid-cols-12 lg:gap-x-10">
      <p className="label text-muted lg:col-span-3 lg:pt-4">Something went wrong</p>
      <div className="lg:col-span-9">
        <h1 className="max-w-[18ch] font-display text-h1">We couldn&apos;t load this page.</h1>
        <p className="mt-6 max-w-[48ch] text-lead text-muted">
          Please try again. If it keeps happening, email us at{" "}
          <a href={`mailto:${brand.email}`} className="link-underline text-fg">{brand.email}</a>.
        </p>
        <Button size="lg" className="mt-10" onClick={reset}>Try again</Button>
      </div>
    </section>
  );
}
