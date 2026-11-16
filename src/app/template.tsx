import { ViewTransition, type ReactNode } from "react";

/**
 * Re-mounts on every navigation. Where the browser supports view transitions, the old page drifts
 * up and softens away while the new one rises into focus, and the floating header stays put
 * (globals.css, "Page transitions"). Elsewhere the new page simply fades up.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page-enter">{children}</div>
    </ViewTransition>
  );
}
