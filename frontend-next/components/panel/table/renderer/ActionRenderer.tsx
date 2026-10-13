"use client";

import { Trash2, Pencil, Copy, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { DeleteConfirmDialog } from "@/components/shared/elements-client";
import { IconButton } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { clientApi } from "@/lib/utils/api";
import { panelRowsKey } from "@/lib/utils/hooks";

import type { ModelType } from "@/lib/types";
import type { ICellRendererParams } from "ag-grid-community";

export default function ActionRenderer({ data }: ICellRendererParams) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const model = pathname.split("/").at(-1) as ModelType;

  const id: number = data.id;
  const alias: string = data.alias;

  const { mutate } = useSWRConfig();

  const handleConfirmDelete = async () => {
    setOpen(false);

    try {
      await clientApi.delete(`/${model}`, {
        query: [{ key: "id", value: id, opt: "eq" }],
      });
      await mutate(panelRowsKey(model));

      toast.success(t("delete.success", { title: alias }));
    } catch {
      toast.error(t("delete.error", { title: alias }));
    }
  };

  const handleCopy = async () => {
    const url = `${appConfig.API_URL}/${alias}`;
    await navigator.clipboard.writeText(url);

    toast.success(t("copy.clipboard"), {
      description: url,
    });
  };

  return (
    <div className="flex h-full items-center gap-0.5">
      <IconButton
        size="sm"
        variant="success"
        aria-label="copy"
        onClick={handleCopy}
        data-testid="action-copy-button"
      >
        <Copy />
      </IconButton>

      <Link href={`/panel/report/${alias}`}>
        <IconButton
          size="sm"
          aria-label="view"
          data-testid="action-view-button"
        >
          <Eye />
        </IconButton>
      </Link>

      <Link href={`/panel/form/${model}/${alias}`}>
        <IconButton
          size="sm"
          variant="accent"
          aria-label="edit"
          data-testid="action-edit-button"
        >
          <Pencil />
        </IconButton>
      </Link>

      <IconButton
        size="sm"
        variant="danger"
        aria-label="delete"
        onClick={() => setOpen(true)}
        data-testid="action-delete-button"
      >
        <Trash2 />
      </IconButton>

      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        title={alias}
      />
    </div>
  );
}
