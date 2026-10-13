"use client";

import { useTranslations } from "next-intl";

import { TextInput } from "@/components/ui/input";
import Switch from "@/components/ui/switch";
import { FormType } from "@/lib/types";

import type { FieldValue, FormField } from "@/lib/types";

type FormFieldProps = {
  field: FormField;
  onChange: (value: FieldValue, key: string) => void;
};

export default function FieldRenderer({ field, onChange }: FormFieldProps) {
  const t = useTranslations();

  const safe = (id: string, fallback?: string) => {
    try {
      return t(id);
    } catch {
      return fallback ?? "";
    }
  };

  const placeholder = safe(`form.placeholder.${field.key}`);

  switch (field.type) {
    case FormType.Switch:
      return (
        <Switch
          dataTestId={`form-input-${field.key}`}
          checked={!!field.value as boolean}
          onChange={(value) => onChange(value, field.key)}
          label={placeholder}
        />
      );

    case FormType.TEXT:
    case FormType.TEXTAREA:
    case FormType.NUMBER:
    default:
      return (
        <TextInput
          label={safe(`form.label.${field.key}`, placeholder)}
          helperText={safe(`form.helper.${field.key}`) || undefined}
          placeholder={placeholder}
          value={field.value}
          type={field.type === FormType.NUMBER ? "number" : "text"}
          multiline={field.type === FormType.TEXTAREA}
          onChange={(value) => onChange(value, field.key)}
          dataTestId={`form-input-${field.key}`}
        />
      );
  }
}
