import type { ComponentProps, ReactNode } from "react";
import { Check, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export const control =
  "block w-full rounded-md border bg-elevated px-3.5 text-[0.9375rem] text-fg shadow-sm transition-[border-color,box-shadow] duration-150 " +
  "placeholder:text-muted/70 hover:border-border-strong focus:border-fg focus:outline-none focus:ring-4 focus:ring-fg/10 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

export function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {optional && <span className="text-xs text-muted">Optional</span>}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  valid?: boolean;
};

export function TextField({ id, label, hint, error, optional, valid, className, ...props }: InputProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, "h-12", error ? "border-error" : valid ? "border-success/60 pr-10" : "border-border", className)}
          {...props}
        />
        {valid && !error && (
          <Check aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-success" />
        )}
      </div>
    </FieldShell>
  );
}

type TextareaProps = Omit<ComponentProps<"textarea">, "id"> & { id: string; label: string; hint?: string; error?: string };

export function TextareaField({ id, label, hint, error, className, ...props }: TextareaProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "min-h-36 resize-y py-3 leading-relaxed", error ? "border-error" : "border-border", className)}
        {...props}
      />
    </FieldShell>
  );
}

type ChoiceGroupProps = {
  legend: string;
  name: string;
  type: "checkbox" | "radio";
  options: readonly string[];
  defaultValue: string[];
  error?: string;
};

/** Checkbox or radio group rendered as selectable chips; native inputs keep it accessible. */
export function ChoiceGroup({ legend, name, type, options, defaultValue, error }: ChoiceGroupProps) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "relative inline-flex h-10 cursor-pointer select-none items-center rounded-md border px-3.5 text-sm transition-colors",
              "border-border bg-elevated hover:border-border-strong",
              "has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",
            )}
          >
            <input
              type={type}
              name={name}
              value={option}
              defaultChecked={defaultValue.includes(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
