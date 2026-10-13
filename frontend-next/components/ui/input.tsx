"use client";

import type { FieldValue } from "@/lib/types";
import type { ChangeEvent } from "react";

const fieldClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-text placeholder:text-slate-400 transition-colors focus:border-accent focus:outline-2 focus:outline-accent/20";

interface TextInputProps {
  label?: string;
  helperText?: string;
  placeholder?: string;
  value: FieldValue;
  type?: "text" | "number";
  multiline?: boolean;
  rows?: number;
  onChange: (value: string) => void;
  dataTestId?: string;
}

export function TextInput({
  label,
  helperText,
  placeholder,
  value,
  type = "text",
  multiline = false,
  rows = 5,
  onChange,
  dataTestId,
}: TextInputProps) {
  const stringValue = value === null ? "" : String(value);

  return (
    <label className="flex w-full flex-col gap-1.5 text-start text-sm">
      {label && <span className="font-medium text-text">{label}</span>}

      {multiline ? (
        <textarea
          className={`${fieldClasses} resize-none`}
          rows={rows}
          value={stringValue}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          data-testid={dataTestId}
        />
      ) : (
        <input
          className={fieldClasses}
          type={type}
          value={stringValue}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          data-testid={dataTestId}
        />
      )}

      {helperText && (
        <span className="whitespace-pre-line text-xs text-slate-500">
          {helperText}
        </span>
      )}
    </label>
  );
}

export function SearchInput({
  value,
  placeholder,
  onChange,
  className = "",
}: {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <input
      className={`${fieldClasses} ${className}`}
      value={value}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={onChange}
    />
  );
}
