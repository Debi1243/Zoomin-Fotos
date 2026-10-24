"use server";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { headers } from "next/headers";
import { MAX_IMAGE_BASE64, shootPlanSchema, shootTypes, type PlanRequest, type PlanResult } from "@/lib/shoot-plan";

/**
 * Analyses one location photo with Claude and returns poses, lighting and camera advice.
 * Runs on the server only: the API key (ANTHROPIC_API_KEY in deploy/.env) never reaches the browser,
 * and the photo is sent to Anthropic for this one request and not stored by the website.
 */

const MODEL = "claude-opus-5-5";

// Each request costs money, so visitors get a few plans an hour and the whole site a daily ceiling.
const PER_VISITOR_PER_HOUR = 5;
const SITE_PER_DAY = Number(process.env.PLANNER_DAILY_LIMIT ?? 150);
const visits = new Map<string, number[]>();
let day = { date: "", count: 0 };

function allow(visitor: string) {
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  if (day.date !== today) day = { date: today, count: 0 };
  if (day.count >= SITE_PER_DAY) return "busy" as const;
  const recent = (visits.get(visitor) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= PER_VISITOR_PER_HOUR) return "limit" as const;
  recent.push(now);
  visits.set(visitor, recent);
  day.count += 1;
  // Keep the map from growing without end on a long-running server.
  if (visits.size > 5000) visits.clear();
  return "ok" as const;
}

const SYSTEM = `You are an experienced portrait and wedding photographer at Zoomin Fotos, a photography studio in Bhubaneswar, Odisha, India. A customer has uploaded a photo of a location and wants to plan a photoshoot there, often using only a phone.

Work from the photo you are given. It is the environment reference only: it shows the place, not the person to be photographed.

How to analyse the scene:
- Describe only what is actually visible. Never add objects, features or people that are not in the photo.
- For light direction, time of day and weather, give your best reading with an honest confidence: "Visible in the photo" when you can point to evidence (hard shadows, sun in frame, wet ground), "Likely" for a reasoned guess, "Uncertain" when the photo does not establish it. Do not claim to know the time, weather or sun direction when it is not shown.

How to suggest poses:
- Give 8 to 10 clearly different poses that use this specific place: its seats, walls, railings, stairs, doorways, windows, paths, plants and light. Spread them across the pose categories.
- Every pose must be physically practical and safe. Never suggest climbing, sitting on ledges or railings above a drop, standing on unstable or unsupported surfaces, or anything near traffic or water edges that could be dangerous.
- Assume a phone camera and no professional lighting. Suggest only cheap helpers (a white sheet or card as a reflector, a phone torch) and only when they really help.
- Write for people in India planning weddings, pre-weddings, portraits and family shoots; outfits can be Indian traditional, western or fusion as the place and mood suit.
- Keep each field short and concrete; the customer reads these on a phone.

How to write each ai_prompt:
- One complete paragraph, specific to that pose; never reuse the same prompt.
- It must say: keep the exact identity of the person in the supplied person reference image (face, skin tone, age, hairstyle and features) and do not replace them with someone else; use the supplied location photo as the environment reference and keep its recognisable features, layout and perspective; then the exact pose and placement, the outfit, the lighting direction and quality, the camera angle, framing and lens, and the style and mood; ask for realistic skin texture, natural proportions, correct anatomy and seamless integration of the person into the scene, with no invented scenery.
- If the customer will not supply a person reference, write it for "the person" in neutral terms instead of referring to a reference image, but keep the environment reference instructions.

If the photo is not a place someone could be photographed in (a document, a screenshot, a close-up of a face, or too dark or blurred to read), set usable to false, explain why in not_usable_reason, and return an empty poses list with a minimal analysis.`;

export async function planShoot(req: PlanRequest): Promise<PlanResult> {
  if (req.website) return { status: "error", message: "Something went wrong. Please try again.", retry: true };
  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: "error", message: "The photoshoot planner isn't switched on yet. Please message us on WhatsApp for pose ideas.", retry: false };
  }
  if (!["image/webp", "image/jpeg", "image/png"].includes(req.mediaType) || !req.imageBase64 || req.imageBase64.length > MAX_IMAGE_BASE64) {
    return { status: "error", message: "That photo couldn't be read. Try a JPG or PNG photo from your gallery.", retry: false };
  }
  const shootType = (shootTypes as readonly string[]).includes(req.shootType) ? req.shootType : shootTypes[0];

  const h = await headers();
  const visitor = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = allow(visitor);
  if (allowed === "limit") return { status: "error", message: "You've made a few plans already. Please try again in an hour.", retry: false };
  if (allowed === "busy") return { status: "error", message: "The planner is very busy today. Please try again tomorrow, or message us on WhatsApp.", retry: false };

  const client = new Anthropic();
  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(shootPlanSchema) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: req.mediaType, data: req.imageBase64 } },
            {
              type: "text",
              text: `Plan a photoshoot at this location. Type of shoot: ${shootType}. ${
                req.hasPersonReference
                  ? "The customer will supply a separate photo of the person to the image tool, so write each ai_prompt around that person reference."
                  : "The customer has no person reference photo, so write each ai_prompt for the person in neutral terms."
              }`,
            },
          ],
        },
      ],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return { status: "error", message: "We couldn't plan a shoot for this photo. Please try a different photo of the location.", retry: false };
    }
    if (message.stop_reason === "max_tokens" || !message.parsed_output) {
      return { status: "error", message: "The plan came back incomplete. Please try again.", retry: true };
    }
    const plan = message.parsed_output;
    if (!plan.usable) {
      return { status: "error", message: plan.not_usable_reason || "This doesn't look like a location photo. Please upload a photo of the place.", retry: false };
    }
    return { status: "ok", plan };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return { status: "error", message: "The planner is busy right now. Please try again in a minute.", retry: true };
    }
    if (err instanceof Anthropic.BadRequestError) {
      return { status: "error", message: "That photo couldn't be analysed. Please try another photo.", retry: false };
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("Photoshoot planner: the Anthropic API key was rejected.");
      return { status: "error", message: "The photoshoot planner isn't available right now. Please message us on WhatsApp.", retry: false };
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`Photoshoot planner: API error ${err.status}`);
      return { status: "error", message: "Something went wrong while analysing the photo. Please try again.", retry: true };
    }
    console.error("Photoshoot planner:", err);
    return { status: "error", message: "We couldn't reach the planner. Check your connection and try again.", retry: true };
  }
}
