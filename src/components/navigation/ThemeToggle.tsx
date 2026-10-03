"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "system" | "light" | "dark";

const STORAGE_KEY = THEME_STORAGE_KEY;

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "System theme", icon: Monitor },
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
];

const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies to this page.
  }
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = theme;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Inline script for <head>: applies the stored theme before first paint. */

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);

  return (
    <div role="group" aria-label="Colour theme" className={cn("inline-flex rounded-md border border-border p-0.5", className)}>
      {options.map(({ value, label, icon: Icon }) => {
        const checked = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={checked}
            aria-label={label}
            title={label}
            onClick={() => applyTheme(value)}
            className={cn(
              "grid size-8 place-items-center rounded-[0.3rem] transition-colors",
              checked ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            <Icon aria-hidden className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
