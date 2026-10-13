"use client";
import { notFound } from "next/navigation";
import { use } from "react";

import FormContainer from "@/components/panel/form";
import { ModelType } from "@/lib/types";
import { safeDecodeURIComponent } from "@/lib/utils/helper";
import { usePanelRows } from "@/lib/utils/hooks";

export default function FormPage({
  params,
}: {
  params: Promise<{ model: ModelType; id: string }>;
}) {
  const { model, id } = use(params);
  if (!Object.values(ModelType).includes(model as ModelType)) notFound();
  const decodedId = safeDecodeURIComponent(id);
  const {
    data: rows = [],
    isLoading,
    error,
  } = usePanelRows(model, decodedId !== "add");

  if (decodedId !== "add" && isLoading) return null;
  if (error) throw error;

  return (
    <FormContainer
      model={model}
      id={decodedId}
      findByKey={"alias"}
      rows={rows}
    />
  );
}
