"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  dataTestId?: string;
}

export default function Switch({
  checked,
  onChange,
  label,
  dataTestId,
}: SwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-text">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={dataTestId}
      />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
      {label}
    </label>
  );
}
