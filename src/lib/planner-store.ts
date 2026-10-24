import type { Pose } from "./shoot-plan";

/**
 * Poses the visitor saved from the photoshoot planner, kept in this browser only.
 * Every read and write is guarded: private browsing can refuse storage.
 */

export type SavedPose = {
  id: string;
  pose: Pose;
  /** The prompt as the visitor last edited it. */
  prompt: string;
  place: string;
  setting: "Indoor" | "Outdoor" | "Mixed";
  savedAt: number;
};

const KEY = "zf-planner-saved";

export function loadSaved(): SavedPose[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? (raw as SavedPose[]) : [];
  } catch {
    return [];
  }
}

export function storeSaved(list: SavedPose[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 60)));
  } catch {
    // Without storage, saved poses last until the page is closed.
  }
}

/** A pose ready to keep, stamped with the time it was saved. */
export const savedPose = (entry: Omit<SavedPose, "savedAt">): SavedPose => ({ ...entry, savedAt: Date.now() });

/** A stable id for a pose within one plan, so saving and comparing can find it again. */
export const poseKey = (planId: string, index: number) => `${planId}-${index}`;
