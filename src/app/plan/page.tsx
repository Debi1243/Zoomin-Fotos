import type { Metadata } from "next";
import { Smartphone } from "lucide-react";
import ShootPlanner from "@/components/planner/ShootPlanner";
import { brand } from "@/lib/brand";

const description = `Upload a photo of any place and get poses, lighting, camera angles, outfit ideas and AI image prompts made for that spot. A free phone tool from ${brand.name}.`;

export const metadata: Metadata = {
  title: "Plan My Photoshoot",
  description,
  alternates: { canonical: "/plan" },
  openGraph: { title: "Plan My Photoshoot", description, url: "/plan" },
};

/**
 * Phones only: the planner is linked from the phone menu and renders only below the desktop
 * breakpoint. On a computer the page explains that it is a phone tool and nothing runs.
 */
export default function PlanPage() {
  return (
    <section className="container-page pb-16 pt-6">
      <div className="lg:hidden">
        <p className="label text-accent">Free photoshoot planner</p>
        <h1 className="mt-2 font-display text-h1">Plan My Photoshoot</h1>
        <p className="mt-3 text-lead text-muted">
          Show us the place. We&apos;ll suggest poses, light, camera angles and outfits made for that exact spot, plus AI image prompts you can copy.
        </p>
        <div className="mt-6">
          <ShootPlanner />
        </div>
        <p className="mt-8 text-xs leading-relaxed text-muted">
          Your location photo is analysed by an AI service to make this plan and isn&apos;t stored by us. Suggestions are a starting point: check the place and stay safe on
          the day.
        </p>
      </div>
      <div className="hidden py-16 text-center lg:block">
        <Smartphone aria-hidden className="mx-auto size-10 text-accent" />
        <h1 className="mt-4 font-display text-h2">Plan My Photoshoot is a phone tool</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-lead text-muted">Open zoominfotos.in/plan on your phone to take or upload a photo of your location and get poses made for it.</p>
      </div>
    </section>
  );
}
