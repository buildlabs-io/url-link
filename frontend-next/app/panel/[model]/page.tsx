"use client";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState, use } from "react";

import AGTable from "@/components/panel/table";
import TableHeader from "@/components/panel/table/table-header";
import { get_columns_ag_by_model, ModelType } from "@/lib/types";
import { filterBySearch } from "@/lib/utils/helper";
import { usePanelRows } from "@/lib/utils/hooks";

import type { AGTableModelType } from "@/lib/types";
import type { ColDef } from "ag-grid-community";
import type { ChangeEvent } from "react";

export default function TablePage({
  params,
}: {
  params: Promise<{ model: ModelType }>;
}) {
  const t = useTranslations();
  const { model } = use(params);

  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isValidating, error } = usePanelRows(model);

  const cols: ColDef<AGTableModelType>[] = useMemo(
    () => get_columns_ag_by_model(model),
    [model],
  );

  const filteredRows = useMemo(
    () => filterBySearch(data ?? [], searchValue),
    [data, searchValue],
  );

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);
  return (
    <div className="px-4 py-4 sm:px-6">
      <TableHeader
        model={model}
        count={filteredRows.length}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        loading={isValidating}
      />

      <div className="mt-4 flex w-full flex-col items-center gap-3">
        {error && <p className="text-danger">{t("errorPage.message")}</p>}

        {(!isLoading || data !== undefined) && (
          <AGTable cols={cols} rows={filteredRows} />
        )}

        {model === ModelType.link && (
          <h2 className="text-xl font-bold text-warning">
            {t("table.subtitleClicksUniques")}
          </h2>
        )}
      </div>
    </div>
  );
}
