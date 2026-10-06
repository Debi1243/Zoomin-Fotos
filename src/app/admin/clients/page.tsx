import type { Metadata } from "next";
import AdminTabs from "@/components/admin/AdminTabs";
import ClientsManager from "@/components/admin/ClientsManager";

// Not linked from the public site and kept out of search results.
export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false, nocache: true },
};

export default function ClientsPage() {
  return (
    <section aria-labelledby="clients-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="clients-title" className="mt-4 font-display text-h2">
        Clients<em>.</em>
      </h1>
      <div className="mt-10">
        <ClientsManager />
      </div>
    </section>
  );
}
