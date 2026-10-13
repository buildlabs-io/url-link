"use client";
import { CheckCircle2, XCircle } from "lucide-react";

import { formatDate } from "@/lib/utils/helper";

import type { ICellRendererParams } from "ag-grid-community";

export default function AgGenericRenderer({
  value,
  colDef,
}: ICellRendererParams) {
  const field = colDef!.field;

  if (!field) return null;
  if (
    ["created_at", "updated_at"].includes(field) &&
    typeof value === "string"
  ) {
    return <span>{formatDate.dateTime(value)}</span>;
  }

  if (["active"].includes(field)) {
    return value ? (
      <CheckCircle2 className="size-5 text-success" />
    ) : (
      <XCircle className="size-5 text-danger" />
    );
  }

  return <span>{value}</span>;
}
