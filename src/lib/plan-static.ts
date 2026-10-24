import type { PlanRequest, PlanResult } from "./shoot-plan";

/**
 * Stand-in for the planner's server action in the static GitHub Pages build, which has no server
 * to hold the AI key. The planner works on the studio's own server (zoominfotos.in).
 */
// The request is ignored here; the signature matches the real action so the form compiles unchanged.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function planShoot(_req: PlanRequest): Promise<PlanResult> {
  return { status: "error", message: "The photoshoot planner works on zoominfotos.in. Please open it there.", retry: false };
}
