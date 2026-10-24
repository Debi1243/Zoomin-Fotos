"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import {
  Camera,
  Check,
  CircleAlert,
  Copy,
  Heart,
  ImageUp,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Rows3,
  Sparkles,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import PoseDetails from "./PoseDetails";
import { planShoot } from "@/app/plan/actions";
import { prepareImage } from "@/lib/image-prep";
import { waLink } from "@/lib/brand";
import { trackConversion } from "@/lib/conversions";
import { loadSaved, poseKey, savedPose, storeSaved, type SavedPose } from "@/lib/planner-store";
import {
  MAX_IMAGE_BASE64,
  difficulties,
  lightingLooks,
  poseCategories,
  poseStyles,
  shootTypes,
  type Pose,
  type ShootPlan,
} from "@/lib/shoot-plan";
import { cn } from "@/lib/cn";

/** The longer side sent to the AI: enough detail to read a scene, small enough to upload fast. */
const AI_EDGE = 1568;
const ACCEPTED = /^image\/(jpeg|png|webp|heic|heif|avif|gif)$/i;
const MAX_FILE_BYTES = 25 * 1024 * 1024;

type Photo = { url: string; base64: string; mediaType: "image/webp" | "image/jpeg" };
type Filters = { category: string; style: string; lighting: string; difficulty: string };
const ANY: Filters = { category: "", style: "", lighting: "", difficulty: "" };

const progressSteps = ["Reading the location", "Checking the light", "Finding spots to pose", "Writing poses and prompts"];

/**
 * "Plan My Photoshoot" for phones: upload or take a photo of a place, and get poses, lighting,
 * camera angles, outfit ideas and ready-to-use AI image prompts made for that exact spot.
 */
export default function ShootPlanner() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [shootType, setShootType] = useState<string>(shootTypes[1]);
  const [hasPerson, setHasPerson] = useState(false);
  const [error, setError] = useState<{ message: string; retry: boolean } | null>(null);
  const [plan, setPlan] = useState<{ id: string; data: ShootPlan } | null>(null);
  const [analysing, startAnalysing] = useTransition();
  const [step, setStep] = useState(0);

  const [tab, setTab] = useState<"ideas" | "list" | "saved">("ideas");
  const [filters, setFilters] = useState<Filters>(ANY);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [used, setUsed] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedPose[]>([]);
  const [savedSetting, setSavedSetting] = useState<"" | "Indoor" | "Outdoor">("");
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Saved poses live in this browser's storage, which exists only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadSaved());
  }, []);

  // Free the preview image's memory when it is replaced or the page closes.
  useEffect(() => () => void (photo && URL.revokeObjectURL(photo.url)), [photo]);

  // The progress line moves on while the analysis runs, so a long wait never looks frozen.
  useEffect(() => {
    if (!analysing) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, progressSteps.length - 1)), 6000);
    return () => clearInterval(t);
  }, [analysing]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (file.type && !ACCEPTED.test(file.type)) {
      setError({ message: "That file isn't a photo we can read. Please choose a JPG, PNG, HEIC or WebP photo.", retry: false });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError({ message: "That photo is very large. Please choose one under 25 MB.", retry: false });
      return;
    }
    setPreparing(true);
    try {
      const img = await prepareImage(file, AI_EDGE);
      if (img.base64.length > MAX_IMAGE_BASE64) throw new Error("too large");
      const mediaType = img.ext === "webp" ? "image/webp" : "image/jpeg";
      const url = URL.createObjectURL(await (await fetch(`data:${mediaType};base64,${img.base64}`)).blob());
      setPhoto({ url, base64: img.base64, mediaType });
      setPlan(null);
    } catch {
      setError({ message: "We couldn't open that photo. Try another one, or take a new photo with the camera.", retry: false });
    } finally {
      setPreparing(false);
    }
  };

  const analyse = () => {
    if (!photo) return;
    setError(null);
    setStep(0);
    trackConversion("planner_analyse", { shoot_type: shootType });
    startAnalysing(async () => {
      const result = await planShoot({
        imageBase64: photo.base64,
        mediaType: photo.mediaType,
        shootType,
        hasPersonReference: hasPerson,
        website: "",
      }).catch(() => ({ status: "error" as const, message: "We couldn't reach the planner. Check your connection and try again.", retry: true }));
      if (result.status === "ok") {
        const id = Date.now().toString(36);
        setPlan({ id, data: result.plan });
        setPrompts(Object.fromEntries(result.plan.poses.map((p, i) => [poseKey(id, i), p.ai_prompt])));
        setUsed([]);
        setCompare([]);
        setFilters(ANY);
        setTab("ideas");
        requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      } else {
        setError({ message: result.message, retry: result.retry });
      }
    });
  };

  const reset = () => {
    setPhoto(null);
    setPlan(null);
    setError(null);
  };

  const poses = useMemo(() => (plan ? plan.data.poses.map((p, i) => ({ key: poseKey(plan.id, i), pose: p })) : []), [plan]);
  const shown = poses.filter(
    ({ pose }) =>
      (!filters.category || pose.category === filters.category) &&
      (!filters.style || pose.style === filters.style) &&
      (!filters.lighting || pose.lighting_look === filters.lighting) &&
      (!filters.difficulty || pose.difficulty === filters.difficulty),
  );
  const available = (field: keyof Pose, list: readonly string[]) => list.filter((v) => poses.some(({ pose }) => pose[field] === v));

  const isSaved = (key: string) => saved.some((s) => s.id === key);
  const toggleSave = (key: string, pose: Pose) => {
    const next = isSaved(key)
      ? saved.filter((s) => s.id !== key)
      : [
          savedPose({ id: key, pose, prompt: prompts[key] ?? pose.ai_prompt, place: plan?.data.analysis.environment_type ?? "", setting: plan?.data.analysis.setting ?? "Outdoor" }),
          ...saved,
        ];
    setSaved(next);
    storeSaved(next);
  };
  const toggleUse = (key: string) => setUsed((u) => (u.includes(key) ? u.filter((k) => k !== key) : [...u, key]));
  const toggleCompare = (key: string) => setCompare((c) => (c.includes(key) ? c.filter((k) => k !== key) : c.length >= 3 ? c : [...c, key]));
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
      trackConversion("planner_copy_prompt");
    } catch {
      setOpen(key); // Opens the details, where the prompt can be selected and copied by hand.
    }
  };

  const openPose = open ? poses.find((p) => p.key === open)?.pose ?? saved.find((s) => s.id === open)?.pose ?? null : null;
  const openPrompt = open ? prompts[open] ?? saved.find((s) => s.id === open)?.prompt ?? openPose?.ai_prompt ?? "" : "";
  const usedPoses = poses.filter((p) => used.includes(p.key));
  const shotListLink = waLink(
    [
      "Hi Zoomin Fotos! I planned a photoshoot on your website and would like to book it.",
      plan ? `Location: ${plan.data.analysis.environment_type}` : "",
      `Type of shoot: ${shootType}`,
      "Poses I like:",
      ...usedPoses.map((p, i) => `${i + 1}. ${p.pose.name}`),
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <div className="space-y-6">
      {/* 1. The location photo */}
      <section aria-labelledby="planner-photo" className="rounded-lg border border-border bg-surface p-4">
        <h2 id="planner-photo" className="font-display text-lg font-bold">
          1. Add a photo of the location
        </h2>
        <p className="mt-1 text-sm text-muted">A beach, garden, street, café, hotel, rooftop, temple, studio or room. Just the place; no people needed.</p>

        <input ref={galleryRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => void pick(e.target.files?.[0]).finally(() => (e.target.value = ""))} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} onChange={(e) => void pick(e.target.files?.[0]).finally(() => (e.target.value = ""))} />

        {photo ? (
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-lg bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the visitor's own photo */}
              <img src={photo.url} alt="Your location photo" className="max-h-80 w-full object-contain" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SmallButton onClick={() => galleryRef.current?.click()} icon={<RefreshCw aria-hidden className="size-4" />}>
                Replace
              </SmallButton>
              <SmallButton onClick={reset} icon={<Trash2 aria-hidden className="size-4" />}>
                Remove
              </SmallButton>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <BigButton onClick={() => cameraRef.current?.click()} icon={<Camera aria-hidden className="size-6" />} disabled={preparing}>
              Take a photo
            </BigButton>
            <BigButton onClick={() => galleryRef.current?.click()} icon={<ImageUp aria-hidden className="size-6" />} disabled={preparing}>
              Choose from gallery
            </BigButton>
          </div>
        )}
        {preparing && (
          <p role="status" className="mt-3 flex items-center gap-2 text-sm text-muted">
            <LoaderCircle aria-hidden className="size-4 animate-spin" /> Preparing your photo…
          </p>
        )}
      </section>

      {/* 2. About the shoot */}
      {photo && (
        <section aria-labelledby="planner-about" className="rise rounded-lg border border-border bg-surface p-4">
          <h2 id="planner-about" className="font-display text-lg font-bold">
            2. What kind of shoot?
          </h2>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Type of shoot">
            {shootTypes.map((t) => (
              <Chip key={t} on={shootType === t} onClick={() => setShootType(t)} role="radio">
                {t}
              </Chip>
            ))}
          </div>
          <label className="mt-4 flex items-start gap-3 rounded-md bg-sand-soft p-3 text-sm">
            <input type="checkbox" checked={hasPerson} onChange={(e) => setHasPerson(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]" />
            <span>
              <span className="font-semibold">I&apos;ll use a photo of the person in my AI image app.</span>
              <span className="mt-0.5 block text-muted">
                The prompts will then ask the app to keep that person&apos;s face and look exactly the same. Their photo stays on your phone; we never see it.
              </span>
            </span>
          </label>
          <button
            type="button"
            onClick={analyse}
            disabled={analysing}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-fg shadow-sm transition-[background-color,scale] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-70"
          >
            {analysing ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : <Sparkles aria-hidden className="size-5" />}
            {analysing ? "Planning your shoot…" : plan ? "Plan again" : "Plan my photoshoot"}
          </button>
          {analysing && (
            <div role="status" aria-live="polite" className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-primary transition-[width] duration-[6000ms] ease-linear" style={{ width: `${((step + 1) / progressSteps.length) * 90}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted">{progressSteps[step]}… this usually takes under a minute.</p>
            </div>
          )}
        </section>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          <div className="flex-1">
            <p>{error.message}</p>
            {error.retry && photo && (
              <button type="button" onClick={analyse} className="mt-2 inline-flex items-center gap-1.5 font-semibold underline underline-offset-2">
                <RefreshCw aria-hidden className="size-4" /> Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Results */}
      {plan && (
        <div ref={resultsRef} className="scroll-mt-20 space-y-5">
          <SceneSummary plan={plan.data} />

          <div role="tablist" aria-label="Poses" className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-surface p-1">
            {(
              [
                ["ideas", `Ideas (${poses.length})`],
                ["list", `Shot list (${used.length})`],
                ["saved", `Saved (${saved.length})`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn("h-11 rounded-md text-sm font-semibold transition-colors", tab === id ? "bg-fg text-bg" : "text-muted")}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "ideas" && (
            <>
              <div className="space-y-2">
                <FilterRow label="Pose" value={filters.category} options={available("category", poseCategories)} onChange={(v) => setFilters({ ...filters, category: v })} />
                <FilterRow label="Style" value={filters.style} options={available("style", poseStyles)} onChange={(v) => setFilters({ ...filters, style: v })} />
                <FilterRow label="Light" value={filters.lighting} options={available("lighting_look", lightingLooks)} onChange={(v) => setFilters({ ...filters, lighting: v })} />
                <FilterRow label="Level" value={filters.difficulty} options={available("difficulty", difficulties)} onChange={(v) => setFilters({ ...filters, difficulty: v })} />
              </div>

              {shown.length === 0 ? (
                <div className="rounded-lg border border-border bg-surface p-5 text-center text-sm text-muted">
                  No poses match these filters.{" "}
                  <button type="button" onClick={() => setFilters(ANY)} className="font-semibold text-accent underline underline-offset-2">
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted">
                    Swipe through {shown.length} {shown.length === 1 ? "pose" : "poses"}. Tick up to 3 to compare.
                  </p>
                  <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
                    {shown.map(({ key, pose }) => (
                      <li key={key} className="w-[86%] max-w-sm shrink-0 snap-center">
                        <PoseCard
                          pose={pose}
                          saved={isSaved(key)}
                          used={used.includes(key)}
                          comparing={compare.includes(key)}
                          compareFull={compare.length >= 3}
                          copied={copied === key}
                          onDetails={() => setOpen(key)}
                          onCopy={() => void copy(key, prompts[key] ?? pose.ai_prompt)}
                          onUse={() => toggleUse(key)}
                          onSave={() => toggleSave(key, pose)}
                          onCompare={() => toggleCompare(key)}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          {tab === "list" && (
            <section aria-label="Your shot list" className="space-y-3">
              {usedPoses.length === 0 ? (
                <Empty>Tap &ldquo;Use this pose&rdquo; on the poses you want, and they&apos;ll collect here as your shot list.</Empty>
              ) : (
                <>
                  <ol className="space-y-2">
                    {usedPoses.map(({ key, pose }, i) => (
                      <li key={key} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-fg">{i + 1}</span>
                        <button type="button" onClick={() => setOpen(key)} className="min-w-0 flex-1 text-left">
                          <span className="block truncate font-semibold">{pose.name}</span>
                          <span className="block truncate text-sm text-muted">{pose.summary}</span>
                        </button>
                        <button type="button" aria-label={`Remove ${pose.name} from the shot list`} onClick={() => toggleUse(key)} className="grid size-10 shrink-0 place-items-center rounded-md text-muted">
                          <X aria-hidden className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ol>
                  <a
                    href={shotListLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp_click"
                    data-track-source="planner-shot-list"
                    className="flex h-12 items-center justify-center gap-2 rounded-md bg-whatsapp font-semibold text-white"
                  >
                    <MessageCircle aria-hidden className="size-5" /> Book this shoot on WhatsApp
                  </a>
                  <p className="text-center text-xs text-muted">Sends your pose list to Zoomin Fotos so a photographer can shoot it with you.</p>
                </>
              )}
            </section>
          )}

          {tab === "saved" && <SavedList saved={saved} setting={savedSetting} onSetting={setSavedSetting} onOpen={setOpen} onRemove={(id) => { const next = saved.filter((s) => s.id !== id); setSaved(next); storeSaved(next); }} />}
        </div>
      )}

      {!plan && saved.length > 0 && !photo && (
        <SavedList saved={saved} setting={savedSetting} onSetting={setSavedSetting} onOpen={setOpen} onRemove={(id) => { const next = saved.filter((s) => s.id !== id); setSaved(next); storeSaved(next); }} heading />
      )}

      {/* Compare bar and sheet */}
      {compare.length > 0 && tab === "ideas" && (
        <div className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.5rem)] z-30 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/95 p-3 shadow-md backdrop-blur">
          <span className="text-sm font-semibold">{compare.length} selected</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setCompare([])} className="h-10 rounded-md border border-border px-3 text-sm font-semibold">
              Clear
            </button>
            <button type="button" disabled={compare.length < 2} onClick={() => setComparing(true)} className="inline-flex h-10 items-center gap-1.5 rounded-md bg-fg px-3 text-sm font-semibold text-bg disabled:opacity-50">
              <Rows3 aria-hidden className="size-4" /> Compare
            </button>
          </div>
        </div>
      )}
      {comparing && <CompareSheet poses={poses.filter((p) => compare.includes(p.key))} onClose={() => setComparing(false)} onOpen={(k) => { setComparing(false); setOpen(k); }} />}

      <PoseDetails
        pose={openPose}
        prompt={openPrompt}
        onPromptChange={(text) => {
          if (!open) return;
          setPrompts((p) => ({ ...p, [open]: text }));
          if (isSaved(open)) {
            const next = saved.map((s) => (s.id === open ? { ...s, prompt: text } : s));
            setSaved(next);
            storeSaved(next);
          }
        }}
        saved={!!open && isSaved(open)}
        onToggleSave={() => open && openPose && toggleSave(open, openPose)}
        used={!!open && used.includes(open)}
        onUse={() => open && toggleUse(open)}
        onCopy={() => open && void copy(open, openPrompt)}
        copied={!!open && copied === open}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

function SceneSummary({ plan }: { plan: ShootPlan }) {
  const a = plan.analysis;
  const light = [
    ["Main light", a.light.main_source],
    ["Direction", a.light.direction],
    ["Quality", a.light.quality],
    ["Colour", a.light.color_temperature],
    ["Time and weather", a.time_and_weather],
  ] as const;
  return (
    <section aria-labelledby="scene-title" className="rise rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{a.setting} · {a.visual_style}</p>
      <h2 id="scene-title" className="mt-1 font-display text-xl font-bold">{a.environment_type}</h2>
      <details className="disclosure group mt-3">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between text-sm font-semibold text-accent">
          What we see in your photo
          <span className="transition-transform group-open:rotate-180" aria-hidden>▾</span>
        </summary>
        <div className="space-y-3 pb-1 pt-2 text-sm leading-relaxed">
          <p>{a.foreground_and_background}</p>
          {a.visible_elements.length > 0 && (
            <p>
              <span className="font-semibold">Visible: </span>
              {a.visible_elements.join(", ")}
            </p>
          )}
          <dl className="space-y-2">
            {light.map(([k, v]) => (
              <div key={k}>
                <dt className="flex items-center gap-2 font-semibold">
                  {k}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      v.confidence === "Visible in the photo" ? "bg-success/10 text-success" : v.confidence === "Likely" ? "bg-sand text-fg" : "bg-warning/10 text-warning",
                    )}
                  >
                    {v.confidence === "Visible in the photo" ? "Seen" : v.confidence === "Likely" ? "Likely" : "Not sure"}
                  </span>
                </dt>
                <dd className="text-muted">{v.value}</dd>
              </div>
            ))}
          </dl>
          <p>
            <span className="font-semibold">Shadows and reflections: </span>
            {a.light.shadows_reflections_highlights}
          </p>
          {a.pose_spots.length > 0 && (
            <p>
              <span className="font-semibold">Good spots to pose: </span>
              {a.pose_spots.join("; ")}
            </p>
          )}
          {a.best_camera_positions.length > 0 && (
            <p>
              <span className="font-semibold">Best camera positions: </span>
              {a.best_camera_positions.join("; ")}
            </p>
          )}
          <p>
            <span className="font-semibold">Composition: </span>
            {a.composition}
          </p>
          {a.cautions.length > 0 && (
            <p className="rounded-md bg-warning/10 p-2.5 text-warning">
              <span className="font-semibold">Take care: </span>
              {a.cautions.join("; ")}
            </p>
          )}
          <p className="text-xs text-muted">&ldquo;Not sure&rdquo; means the photo doesn&apos;t show it; check on the day.</p>
        </div>
      </details>
    </section>
  );
}

type CardProps = {
  pose: Pose;
  saved: boolean;
  used: boolean;
  comparing: boolean;
  compareFull: boolean;
  copied: boolean;
  onDetails: () => void;
  onCopy: () => void;
  onUse: () => void;
  onSave: () => void;
  onCompare: () => void;
};

function PoseCard({ pose, saved, used, comparing, compareFull, copied, onDetails, onCopy, onUse, onSave, onCompare }: CardProps) {
  return (
    <article className={cn("flex h-full flex-col rounded-lg border bg-surface p-4 shadow-sm", used ? "border-primary" : "border-border")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{pose.category}</p>
          <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">{pose.name}</h3>
        </div>
        <button
          type="button"
          onClick={onSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${pose.name} from saved` : `Save ${pose.name}`}
          className={cn("grid size-11 shrink-0 place-items-center rounded-full border transition-[scale] active:scale-90", saved ? "border-primary text-primary" : "border-border text-muted")}
        >
          <Heart aria-hidden className={cn("size-5", saved && "fill-current")} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
        <Tag>{pose.difficulty}</Tag>
        <Tag>{pose.style}</Tag>
        <Tag>
          <Sun aria-hidden className="size-3" /> {pose.lighting_look}
        </Tag>
      </div>

      <p className="mt-3 text-[0.9375rem] leading-relaxed">{pose.summary}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <Line k="Light" v={`${pose.lighting.direction} light · ${pose.lighting.best_source}`} />
        <Line k="Camera" v={`${pose.camera.angle}, ${pose.camera.framing.toLowerCase()}`} />
        <Line k="Outfit" v={pose.outfit.suggestion} />
      </dl>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={comparing} disabled={!comparing && compareFull} onChange={onCompare} className="size-5 accent-[var(--fg)]" />
        Compare
      </label>

      <div className="mt-auto grid gap-2 pt-4">
        <button type="button" onClick={onDetails} className="h-11 rounded-md border border-border-strong font-semibold active:scale-[0.98]">
          View full details
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onCopy} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border text-sm font-semibold active:scale-[0.98]">
            {copied ? <Check aria-hidden className="size-4 text-success" /> : <Copy aria-hidden className="size-4" />}
            {copied ? "Copied" : "Copy AI prompt"}
          </button>
          <button
            type="button"
            onClick={onUse}
            aria-pressed={used}
            className={cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-semibold active:scale-[0.98]", used ? "bg-primary/10 text-accent" : "bg-primary text-primary-fg")}
          >
            <Check aria-hidden className="size-4" />
            {used ? "In shot list" : "Use this pose"}
          </button>
        </div>
      </div>
    </article>
  );
}

function CompareSheet({ poses, onClose, onOpen }: { poses: { key: string; pose: Pose }[]; onClose: () => void; onOpen: (key: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const rows: [string, (p: Pose) => string][] = [
    ["Pose", (p) => p.category],
    ["Level", (p) => p.difficulty],
    ["Style", (p) => p.style],
    ["Light", (p) => `${p.lighting.direction}, ${p.lighting.soft_or_dramatic.toLowerCase()}`],
    ["Best time", (p) => p.lighting.time_of_day],
    ["Camera", (p) => p.camera.angle],
    ["Framing", (p) => `${p.camera.framing} · ${p.camera.orientation}`],
    ["Where", (p) => p.placement],
    ["Outfit", (p) => p.outfit.suggestion],
  ];
  return (
    <dialog ref={ref} aria-label="Compare poses" onClose={onClose} className="sheet m-0 mt-auto max-h-[88dvh] w-full max-w-none rounded-t-xl bg-bg p-0 text-fg backdrop:bg-fg/50">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-display text-lg font-bold">Compare poses</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-md border border-border bg-surface">
          <X aria-hidden className="size-5" />
        </button>
      </div>
      <div className="overflow-auto p-4" style={{ maxHeight: "calc(88dvh - 4.5rem)" }}>
        <table className="w-full min-w-[30rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-24" />
              {poses.map(({ key, pose }) => (
                <th key={key} scope="col" className="px-2 pb-2 text-left align-bottom">
                  <button type="button" onClick={() => onOpen(key)} className="font-display font-bold text-accent underline underline-offset-2">
                    {pose.name}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-t border-border align-top">
                <th scope="row" className="py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  {label}
                </th>
                {poses.map(({ key, pose }) => (
                  <td key={key} className="px-2 py-2">
                    {get(pose)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
}

function SavedList({
  saved,
  setting,
  onSetting,
  onOpen,
  onRemove,
  heading,
}: {
  saved: SavedPose[];
  setting: "" | "Indoor" | "Outdoor";
  onSetting: (s: "" | "Indoor" | "Outdoor") => void;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  heading?: boolean;
}) {
  const list = saved.filter((s) => !setting || s.setting === setting || s.setting === "Mixed");
  return (
    <section aria-label="Saved poses" className="space-y-3">
      {heading && <h2 className="font-display text-lg font-bold">Your saved poses</h2>}
      <div className="flex gap-2" role="group" aria-label="Indoor or outdoor">
        {(["", "Indoor", "Outdoor"] as const).map((s) => (
          <Chip key={s || "all"} on={setting === s} onClick={() => onSetting(s)}>
            {s || "All"}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <Empty>{saved.length ? "No saved poses for this setting yet." : "Tap the heart on any pose to keep it here, on this phone."}</Empty>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
              <button type="button" onClick={() => onOpen(s.id)} className="min-w-0 flex-1 text-left">
                <span className="block truncate font-semibold">{s.pose.name}</span>
                <span className="block truncate text-sm text-muted">
                  {s.setting} · {s.place}
                </span>
              </button>
              <button type="button" aria-label={`Remove ${s.pose.name} from saved`} onClick={() => onRemove(s.id)} className="grid size-10 shrink-0 place-items-center rounded-md text-muted">
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  if (options.length < 2) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="w-11 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <div className="no-scrollbar -mr-4 flex gap-1.5 overflow-x-auto pr-4" role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
        <Chip on={!value} onClick={() => onChange("")}>All</Chip>
        {options.map((o) => (
          <Chip key={o} on={value === o} onClick={() => onChange(value === o ? "" : o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children, role }: { on: boolean; onClick: () => void; children: ReactNode; role?: "radio" }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role ? on : undefined}
      aria-pressed={role ? undefined : on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors active:scale-[0.97]",
        on ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface",
      )}
    >
      {children}
    </button>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-sand-soft px-2.5 py-1">{children}</span>;
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-14 shrink-0 font-semibold text-muted">{k}</dt>
      <dd className="line-clamp-2">{v}</dd>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border-strong bg-surface p-5 text-center text-sm text-muted">{children}</p>;
}

function BigButton({ onClick, icon, disabled, children }: { onClick: () => void; icon: ReactNode; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-strong bg-bg px-3 text-center font-semibold transition-[border-color,scale] active:scale-[0.98] disabled:opacity-60"
    >
      <span className="text-accent">{icon}</span>
      {children}
    </button>
  );
}

function SmallButton({ onClick, icon, children }: { onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border bg-bg text-sm font-semibold active:scale-[0.98]">
      {icon}
      {children}
    </button>
  );
}
