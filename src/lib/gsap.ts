"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registered once, on the client only. Every component imports gsap from here so the plugins
// are always registered before use.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The site's one motion curve. CSS uses cubic-bezier(0.22, 1, 0.36, 1) (an ease-out quint),
 * which is GSAP's power4.out, so tweens and CSS transitions decelerate the same way.
 */
export const EASE = "power4.out";
gsap.defaults({ ease: EASE });

/** Media query for visitors who are fine with motion. Every animation lives inside it. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
