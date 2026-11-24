import type { Metadata } from "next";
import FocusServicePage from "@/components/sections/FocusServicePage";
import { getFocusService } from "@/lib/focus-services";

const f = getFocusService("candid-photography");

export const metadata: Metadata = {
  title: f.seoTitle,
  description: f.description,
  alternates: { canonical: "/services/candid-photography" },
  openGraph: { title: f.seoTitle, description: f.description, url: "/services/candid-photography" },
};

export default function Page() {
  return <FocusServicePage f={f} />;
}
