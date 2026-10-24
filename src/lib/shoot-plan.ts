import { z } from "zod";

/**
 * "Plan My Photoshoot": the shape of the AI's answer for one uploaded location photo.
 * Shared by the server action (which asks Claude for exactly this shape) and the phone screens
 * (which render it). Every field is plain text so the cards can show it as written.
 */

export const poseCategories = [
  "Standing",
  "Walking & candid",
  "Sitting & leaning",
  "Looking away",
  "Looking at camera",
  "Profile & over-the-shoulder",
  "Close-up portrait",
  "Fashion editorial",
  "Relaxed lifestyle",
  "Creative with the setting",
] as const;

export const poseStyles = ["Candid", "Editorial", "Lifestyle", "Romantic", "Traditional", "Fashion"] as const;
export const lightingLooks = ["Soft natural", "Golden hour", "Backlit", "Dramatic contrast", "Indoor ambient"] as const;
export const difficulties = ["Easy", "Medium", "Advanced"] as const;
export const confidenceLevels = ["Visible in the photo", "Likely", "Uncertain"] as const;

const estimate = z.object({
  value: z.string().describe("What you can say about it, in one or two short sentences."),
  confidence: z.enum(confidenceLevels).describe("Visible in the photo = you can point to it; Likely = a reasoned guess; Uncertain = the photo does not establish it."),
});

export const analysisSchema = z.object({
  environment_type: z.string().describe("For example: rooftop café terrace, temple courtyard, beach at low tide, hotel lobby."),
  setting: z.enum(["Indoor", "Outdoor", "Mixed"]),
  visual_style: z.string(),
  visible_elements: z.array(z.string()).describe("Only things actually visible in the photo."),
  foreground_and_background: z.string(),
  light: z.object({
    main_source: estimate,
    direction: estimate,
    quality: estimate.describe("Hard or soft, and how strong."),
    color_temperature: estimate,
    shadows_reflections_highlights: z.string(),
  }),
  time_and_weather: estimate.describe("Only what the photo supports. Say Uncertain rather than guessing a time or the weather."),
  pose_spots: z.array(z.string()).describe("Visible seats, walls, railings, stairs, doorways, windows and similar, and where they are in the frame."),
  best_camera_positions: z.array(z.string()),
  composition: z.string().describe("Depth, framing, leading lines and how to separate a person from the background here."),
  cautions: z.array(z.string()).describe("Safety or practical issues: edges, traffic, slippery or unstable surfaces, crowds, distracting objects."),
});

export const poseSchema = z.object({
  name: z.string(),
  category: z.enum(poseCategories),
  style: z.enum(poseStyles),
  difficulty: z.enum(difficulties),
  lighting_look: z.enum(lightingLooks),
  summary: z.string().describe("One short line the person can act on straight away."),
  placement: z.string().describe("Exactly where in this scene to stand or sit, using visible landmarks."),
  steps: z.array(z.string()).describe("Body positioning, step by step, 3 to 5 steps."),
  hands_and_arms: z.string(),
  head_and_expression: z.string(),
  legs_and_feet: z.string().describe("Empty string if the pose does not show legs."),
  why_it_works: z.string().describe("Why this pose suits this particular location."),
  camera: z.object({
    angle: z.string().describe("Eye level, low, high or overhead, and from where."),
    framing: z.string().describe("Full body, three-quarter, medium or close-up."),
    orientation: z.enum(["Portrait", "Landscape"]),
    subject_placement: z.string(),
    composition: z.string().describe("Leading lines, negative space, symmetry or foreground framing to use."),
    phone_lens: z.string().describe("Which phone lens or focal-length equivalent, e.g. 2x for 50mm-like portraits."),
    rear_camera_tip: z.string(),
    front_camera_tip: z.string().describe("How to do it as a selfie or with a timer on the front camera."),
    avoid: z.string().describe("Distortion or distracting background elements to keep out."),
  }),
  lighting: z.object({
    best_source: z.string(),
    subject_position: z.string().describe("Where the person faces relative to the light."),
    direction: z.enum(["Front", "Side", "Back", "Rim"]),
    time_of_day: z.string().describe("Suggested time if it matters, e.g. golden hour; say any time if it does not."),
    soft_or_dramatic: z.enum(["Soft", "Dramatic"]),
    shadows_and_exposure: z.string(),
    optional_helpers: z.string().describe("Cheap extras only if useful: a white sheet or card as reflector, phone torch, small LED. Never assume pro gear."),
    color_grade_and_mood: z.string(),
    alternatives: z.array(z.string()).describe("One or two other lighting options for the same pose."),
  }),
  outfit: z.object({
    suggestion: z.string(),
    colors: z.string().describe("Colours that contrast or harmonise with this background."),
    fabric_and_accessories: z.string(),
  }),
  ai_prompt: z.string().describe("A complete, ready-to-paste image-generation prompt written for this pose; see the system instructions."),
});

export const shootPlanSchema = z.object({
  usable: z.boolean().describe("False if the photo is not a place someone could be photographed in (a document, a screenshot, a close-up of a face, too dark or blurry to read)."),
  not_usable_reason: z.string().describe("Empty when usable is true."),
  analysis: analysisSchema,
  poses: z.array(poseSchema).describe("8 to 10 distinct poses that suit this exact location."),
});

export type ShootPlan = z.infer<typeof shootPlanSchema>;
export type Pose = z.infer<typeof poseSchema>;

/** What the planner's form sends. The photo is already resized in the browser. */
export type PlanRequest = {
  imageBase64: string;
  mediaType: "image/webp" | "image/jpeg" | "image/png";
  /** The mood the visitor picked, e.g. "Romantic couple" or "Solo fashion". */
  shootType: string;
  /** Whether the visitor will give the AI image tool a photo of the person (it is never sent to us). */
  hasPersonReference: boolean;
  /** Bots fill this hidden field. */
  website: string;
};

export type PlanResult =
  | { status: "ok"; plan: ShootPlan }
  | { status: "error"; message: string; retry: boolean };

export const shootTypes = ["Solo portrait", "Couple / pre-wedding", "Bride or groom", "Family", "Maternity", "Kids", "Fashion / brand"] as const;

/** Uploads larger than this (as base64) are refused; the browser resizes photos well below it (server actions accept about 1 MB). */
export const MAX_IMAGE_BASE64 = 900_000;
