import type { Metadata } from "next";
import AdminPanel from "@/components/admin/AdminPanel";
import AdminTabs from "@/components/admin/AdminTabs";

// Not linked from anywhere and kept out of search results. Nothing here works without
// a GitHub access key that can write to the website's repository.
export const metadata: Metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <section aria-labelledby="admin-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="admin-title" className="mt-4 font-display text-h2">
        Manage photos<em>.</em>
      </h1>
      <div className="mt-10">
        <AdminPanel />
      </div>
    </section>
  );
}
