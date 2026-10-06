import type { Metadata } from "next";
import Portal from "@/components/portal/Portal";

// Private to each client and kept out of search results.
export const metadata: Metadata = {
  title: "Client portal",
  description: "Your Zoomin Fotos booking: agreement, payments, planning and delivery.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <section aria-label="Client portal" className="container-page max-w-5xl pb-24 pt-6 md:pb-32 md:pt-14">
      <Portal />
    </section>
  );
}
