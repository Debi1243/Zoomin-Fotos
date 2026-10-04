import { control } from "@/components/forms/Field";
import { cn } from "@/lib/cn";
import { services, type ServiceSlug } from "@/lib/data";

export const categoryName = (slug: ServiceSlug) => services.find((s) => s.slug === slug)?.title ?? slug;

export function CategorySelect({
  id,
  value,
  onChange,
  className,
  disabled,
}: {
  id: string;
  value: ServiceSlug;
  onChange: (slug: ServiceSlug) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ServiceSlug)}
      className={cn(control, "h-10 border-border pr-8", className)}
    >
      {services.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.title}
        </option>
      ))}
    </select>
  );
}
