"use client";

import { notFound, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DynamicForm from "@/components/panel/form/dynamic-form";
import {
  create_form_fields,
  form_fields_to_data,
  get_form_by_model,
  ModelType,
} from "@/lib/types";
import { clientApi, isApiError } from "@/lib/utils/api";
import { array_obj_to_obj_with_key } from "@/lib/utils/helper";

import type { FormModelType, FormField } from "@/lib/types";

export default function ModelFormContainer({
  model,
  id,
  findByKey,
  rows = [],
}: {
  model: ModelType;
  id: string | number;
  findByKey?: string;
  rows?: FormModelType[];
}) {
  const t = useTranslations();
  const router = useRouter();

  const isAdd = id === "add";

  const baseData: FormModelType | undefined = useMemo(() => {
    if (isAdd || !findByKey) return undefined;
    return array_obj_to_obj_with_key(rows, id, findByKey) as FormModelType;
  }, [id, isAdd, rows, findByKey]);

  const [fields, setFields] = useState<FormField[]>([]);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setFormFields = useCallback(
    (data: FormModelType | undefined) => {
      let fieldsArr = create_form_fields(get_form_by_model(model), data);

      if (isAdd && model === ModelType.link && fieldsArr.length > 0) {
        fieldsArr = fieldsArr.slice(0, -1);
      }

      setFields(fieldsArr);
    },
    [model, isAdd],
  );

  useEffect(() => {
    if (!isAdd && baseData === undefined) notFound();
    setFormFields(baseData);
  }, [baseData, isAdd, setFormFields]);

  const handleSubmit = async (send_fields: FormField[]) => {
    if (submitting) return;

    setFieldError(null);
    setSubmitting(true);

    try {
      const data = form_fields_to_data(send_fields);
      const isAddLink = model === ModelType.link && isAdd;

      const isAnonymous = !localStorage.getItem("token");
      const targetModel = isAnonymous && isAddLink ? "create" : model;
      const targetId =
        isAnonymous && isAddLink
          ? "link"
          : isAdd
            ? id
            : (baseData as FormModelType).id;
      const res = await clientApi.post<{
        password_hash: string;
        alias: string;
      }>(`/${targetModel}/${targetId}`, data);

      toast.success(t("form.success"));

      if (isAddLink) {
        router.push(
          isAnonymous
            ? `/report/${res.password_hash}`
            : `/panel/report/${res.alias}`,
        );
      } else {
        router.push(`/panel/${model}`);
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        let intlId = err.message || "form.error.general";
        const errors = err.errors;

        if (Array.isArray(errors) && errors.length > 0 && errors[0]?.field) {
          intlId = `form.label.${errors[0].field}`;
        }

        setFieldError(intlId);
      } else {
        setFieldError("form.error.general");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-hidden px-2 py-8">
      {fields.length > 0 && (
        <DynamicForm
          title={isAdd ? `form.add.${model}` : `form.edit.${model}`}
          fields={fields}
          onSubmit={handleSubmit}
          fieldError={fieldError}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
