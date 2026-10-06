import type { Metadata } from "next";
import AdminTabs from "@/components/admin/AdminTabs";
import Dashboard from "@/components/admin/Dashboard";

// Not linked from the public site and kept out of search results. The numbers come from the
// studio's own Google Sheet and are only shown to someone whose GitHub key can edit the website.
export const metadata: Metadata = {
  title: "Studio dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="dashboard-title" className="mt-4 font-display text-h2">
        Dashboard<em>.</em>
      </h1>
      <div className="mt-10">
        <Dashboard />
      </div>
    </section>
  );
}
