"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type RowField = {
  key: string;
  label: string;
  type?: "text" | "date" | "time" | "number" | "tel" | "url" | "select";
  options?: readonly string[];
  placeholder?: string;
  /** Grid columns this field spans on wider screens, out of 12. */
  span?: number;
  /** Half width on phones. */
  half?: boolean;
};

type Row = Record<string, string | number>;

const input =
  "h-10 w-full min-w-0 rounded-md border border-border-strong bg-bg px-3 text-sm outline-none transition-colors focus:border-fg disabled:opacity-60";

/**
 * Edits a list of small records (timeline items, family members, invoice lines). Each row is a
 * card on phones and a single line of fields on wider screens.
 */
export default function RowsEditor<T extends Row>({
  fields,
  rows,
  onChange,
  blank,
  addLabel,
  empty,
  max = 60,
  disabled,
  label,
}: {
  fields: RowField[];
  rows: T[];
  onChange: (rows: T[]) => void;
  blank: () => T;
  addLabel: string;
  empty?: string;
  max?: number;
  disabled?: boolean;
  label: string;
}) {
  const set = (i: number, key: string, value: string) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [key]: typeof r[key] === "number" ? Number(value) || 0 : value } : r)));

  return (
    <div>
      {rows.length === 0 && empty && <p className="text-sm text-muted">{empty}</p>}
      <ol className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="flex gap-2 rounded-lg border border-border bg-bg/40 p-3 sm:border-0 sm:bg-transparent sm:p-0">
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-12">
              {fields.map((f) => {
                const id = `${label}-${i}-${f.key}`.replace(/\W+/g, "-");
                const value = String(row[f.key] ?? "");
                return (
                  <label key={f.key} htmlFor={id} className={cn(f.half ? "col-span-1" : "col-span-2", "min-w-0", spanClass(f))}>
                    <span className={cn("mb-1 block text-xs text-muted", i > 0 && "sm:sr-only")}>{f.label}</span>
                    {f.type === "select" ? (
                      <select id={id} value={value} disabled={disabled} onChange={(e) => set(i, f.key, e.target.value)} className={input}>
                        {f.options?.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        type={f.type === "number" ? "text" : (f.type ?? "text")}
                        inputMode={f.type === "number" ? "numeric" : undefined}
                        value={f.type === "number" && value === "0" ? "" : value}
                        placeholder={f.type === "number" ? "0" : f.placeholder}
                        disabled={disabled}
                        onChange={(e) => set(i, f.key, f.type === "number" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
                        className={cn(input, f.type === "number" && "tabular text-right")}
                      />
                    )}
                  </label>
                );
              })}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                className={cn("grid size-10 shrink-0 place-items-center self-end rounded-md text-muted hover:text-error", i === 0 && "sm:mt-5")}
                aria-label={`Remove row ${i + 1} from ${label}`}
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ol>
      {!disabled && rows.length < max && (
        <button
          type="button"
          onClick={() => onChange([...rows, blank()])}
          className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-md border border-dashed border-border-strong px-3 text-sm hover:border-fg"
        >
          <Plus aria-hidden className="size-4" /> {addLabel}
        </button>
      )}
    </div>
  );
}

// Written out in full so Tailwind can see every class.
const spans: Record<number, string> = {
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  12: "sm:col-span-12",
};
function spanClass(f: RowField) {
  return spans[f.span ?? 3] ?? "sm:col-span-3";
}
