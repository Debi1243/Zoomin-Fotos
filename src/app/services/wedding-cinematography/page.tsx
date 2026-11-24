import type { Metadata } from "next";
import FocusServicePage from "@/components/sections/FocusServicePage";
import { getFocusService } from "@/lib/focus-services";

const f = getFocusService("wedding-cinematography");

export const metadata: Metadata = {
  title: f.seoTitle,
  description: f.description,
  alternates: { canonical: "/services/wedding-cinematography" },
  openGraph: { title: f.seoTitle, description: f.description, url: "/services/wedding-cinematography" },
};

export default function Page() {
  return <FocusServicePage f={f} />;
}
