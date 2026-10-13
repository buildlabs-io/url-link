"use client";

import { Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button, IconButton } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { useLogout } from "@/lib/utils/hooks";

import type { ModelType } from "@/lib/types";
import type { ChangeEvent } from "react";

interface Props {
  model: ModelType;
  count: number;
  searchValue: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

export default function TableHeader({
  model,
  count,
  searchValue,
  onSearchChange,
  loading = false,
}: Props) {
  const t = useTranslations();
  const logout = useLogout();
  const router = useRouter();

  return (
    <div className="my-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <h1 className="truncate text-2xl font-bold tracking-tight text-text">
            {t(`panel.${model}.title`)}
          </h1>

          <span
            data-testid="panel-row-count"
            className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-lg font-semibold tabular-nums text-accent"
          >
            {count}
          </span>

          {loading && <Spinner className="size-5" />}
        </div>

        <div className="shrink-0">
          <Button
            data-testid={`add-${model}-button`}
            icon={<Plus className="size-4" />}
            onClick={() => router.push(`/panel/form/${model}/add`)}
          >
            {t(`panel.${model}.add`)}
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 lg:w-80 lg:shrink-0">
        <div className="min-w-0 flex-1">
          <SearchInput
            className="w-full max-w-none"
            placeholder={t("panel.search.placeholder")}
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>

        <div className="shrink-0">
          <IconButton
            variant="danger"
            title={t("search.logout")}
            aria-label={t("search.logout")}
            onClick={logout}
          >
            <LogOut className="size-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
