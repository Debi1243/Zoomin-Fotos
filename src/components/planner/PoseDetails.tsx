"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Camera, Check, Copy, Heart, Shirt, Sun, X } from "lucide-react";
import type { Pose } from "@/lib/shoot-plan";
import { cn } from "@/lib/cn";

type Props = {
  pose: Pose | null;
  prompt: string;
  onPromptChange: (text: string) => void;
  saved: boolean;
  onToggleSave: () => void;
  used: boolean;
  onUse: () => void;
  onCopy: () => void;
  copied: boolean;
  onClose: () => void;
};

/** Everything about one pose, in a sheet that rises from the bottom of the phone. */
export default function PoseDetails({ pose, prompt, onPromptChange, saved, onToggleSave, used, onUse, onCopy, copied, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (pose && !d.open) d.showModal();
    if (!pose && d.open) d.close();
  }, [pose]);

  return (
    <dialog
      ref={ref}
      aria-label={pose ? pose.name : "Pose details"}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="sheet m-0 mt-auto h-[92dvh] max-h-none w-full max-w-none rounded-t-xl bg-bg p-0 text-fg backdrop:bg-fg/50"
    >
      {pose && (
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {pose.category} · {pose.difficulty}
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold">{pose.name}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface">
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 text-[0.9375rem] leading-relaxed" data-lenis-prevent>
            <p className="rounded-md bg-sand-soft px-3 py-2.5 font-medium">{pose.summary}</p>

            <Block title="Where to stand">{pose.placement}</Block>
            <Block title="How to pose">
              <ol className="list-decimal space-y-1.5 pl-5">
                {pose.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </Block>
            <Block title="Hands and arms">{pose.hands_and_arms}</Block>
            <Block title="Head and expression">{pose.head_and_expression}</Block>
            {pose.legs_and_feet && <Block title="Legs and feet">{pose.legs_and_feet}</Block>}
            <Block title="Why it works here">{pose.why_it_works}</Block>

            <Group icon={<Camera aria-hidden className="size-4" />} title="Camera">
              <Row k="Angle" v={pose.camera.angle} />
              <Row k="Framing" v={`${pose.camera.framing} · ${pose.camera.orientation}`} />
              <Row k="Where in frame" v={pose.camera.subject_placement} />
              <Row k="Composition" v={pose.camera.composition} />
              <Row k="Phone lens" v={pose.camera.phone_lens} />
              <Row k="Back camera" v={pose.camera.rear_camera_tip} />
              <Row k="Front camera" v={pose.camera.front_camera_tip} />
              <Row k="Avoid" v={pose.camera.avoid} />
            </Group>

            <Group icon={<Sun aria-hidden className="size-4" />} title="Lighting">
              <Row k="Light" v={`${pose.lighting.best_source} · ${pose.lighting.direction} light · ${pose.lighting.soft_or_dramatic}`} />
              <Row k="Face the light" v={pose.lighting.subject_position} />
              <Row k="When" v={pose.lighting.time_of_day} />
              <Row k="Shadows and exposure" v={pose.lighting.shadows_and_exposure} />
              {pose.lighting.optional_helpers && <Row k="Helpful extras" v={pose.lighting.optional_helpers} />}
              <Row k="Colour and mood" v={pose.lighting.color_grade_and_mood} />
              {pose.lighting.alternatives.length > 0 && <Row k="Other options" v={pose.lighting.alternatives.join(" · ")} />}
            </Group>

            <Group icon={<Shirt aria-hidden className="size-4" />} title="Outfit (optional)">
              <Row k="Wear" v={pose.outfit.suggestion} />
              <Row k="Colours" v={pose.outfit.colors} />
              <Row k="Fabric and extras" v={pose.outfit.fabric_and_accessories} />
            </Group>

            <section>
              <label htmlFor="pose-prompt" className="font-display text-base font-semibold">
                AI image prompt
              </label>
              <p className="mt-1 text-sm text-muted">Edit it if you like. Paste it into your AI image app with your location photo, and a photo of the person if you have one.</p>
              <textarea
                id="pose-prompt"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                rows={9}
                className="mt-2 block w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
            </section>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-border bg-bg px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
            <ActionButton onClick={onCopy} active={copied} icon={copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}>
              {copied ? "Copied" : "Copy prompt"}
            </ActionButton>
            <ActionButton onClick={onToggleSave} active={saved} icon={<Heart aria-hidden className={cn("size-4", saved && "fill-current")} />}>
              {saved ? "Saved" : "Save"}
            </ActionButton>
            <ActionButton onClick={onUse} active={used} primary icon={<Check aria-hidden className="size-4" />}>
              {used ? "In shot list" : "Use this pose"}
            </ActionButton>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-1 text-fg/90">{children}</div>
    </section>
  );
}

function Group({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-3">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-accent">
        {icon}
        {title}
      </h3>
      <dl className="mt-2 space-y-2">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  if (!v) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}

function ActionButton({ onClick, active, primary, icon, children }: { onClick: () => void; active?: boolean; primary?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-xs font-semibold transition-colors active:scale-[0.97]",
        primary ? "bg-primary text-primary-fg" : "border border-border bg-surface",
        active && !primary && "border-primary text-accent",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
