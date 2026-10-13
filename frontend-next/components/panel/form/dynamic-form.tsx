"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type SyntheticEvent, useEffect, useState } from "react";

import { FormFieldError } from "@/components/shared/elements-client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

import FieldRenderer from "./field-renderer";

import type { FieldValue, FormField } from "@/lib/types";

interface DynamicFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (send_fields: FormField[]) => void;
  fieldError: string | null;
  isLoading: boolean;
}

export default function DynamicForm({
  title,
  fields,
  onSubmit,
  fieldError,
  isLoading,
}: DynamicFormProps) {
  const router = useRouter();
  const t = useTranslations();

  const [localFields, setLocalFields] = useState<FormField[]>([]);

  useEffect(() => {
    setLocalFields(fields);
  }, [fields]);

  const handleChange = (value: FieldValue, key: string) => {
    const updatedFields = localFields.map((field) =>
      field.key === key ? { ...field, value } : field,
    );
    setLocalFields(updatedFields);
  };

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col"
      onSubmit={(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoading) onSubmit(localFields);
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1
          data-testid="form-title"
          className="text-2xl font-extrabold text-text"
        >
          {t(title)}
        </h1>

        {typeof window !== "undefined" &&
          window.location.href.includes("form") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={() => router.back()}
            >
              {t("form.button.back")}
            </Button>
          )}
      </div>

      <div
        className="flex flex-col gap-4 transition-opacity"
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {localFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            onChange={handleChange}
          />
        ))}

        {fieldError && <FormFieldError fieldError={fieldError} />}

        <div className="mt-1 flex justify-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <Button type="submit" data-testid="form-submit-button">
              {t("form.button.submit")}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
