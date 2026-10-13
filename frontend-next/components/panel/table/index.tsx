"use client";

import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { localeCache } from "@/lib/config";

import { ActionRenderer, AgGenericRenderer } from "./renderer";

import type { AGTableModelType } from "@/lib/types";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import type {
  AgGridReact as AgGridReactType,
  AgGridReactProps,
} from "ag-grid-react";

type GridProps = AgGridReactProps<AGTableModelType>;

declare global {
  var __agAllRegistered: boolean | undefined;
}
if (!globalThis.__agAllRegistered) {
  ModuleRegistry.registerModules([AllCommunityModule]);
  globalThis.__agAllRegistered = true;
}

const AgGridReactDynamic = dynamic(
  async () => {
    const { AgGridReact } = await import("ag-grid-react");
    const Wrapped = forwardRef<AgGridReactType<AGTableModelType>, GridProps>(
      (props, ref) => <AgGridReact {...props} ref={ref} />,
    );
    Wrapped.displayName = "AgGridReactDynamic";
    return Wrapped;
  },
  { ssr: false },
);

const defaultColDef: ColDef = { resizable: true, filter: true, sortable: true };

interface Props {
  cols: ColDef<AGTableModelType>[];
  rows: AGTableModelType[];
  fixedHeight?: boolean;
}

export default function AGTable({ cols, rows, fixedHeight = false }: Props) {
  const t = useTranslations();

  const isRtl = localeCache.isRtl();
  const direction = localeCache.dir();

  const gridRef = useRef<AgGridReactType<AGTableModelType>>(null);
  const [filteredCount, setFilteredCount] = useState(rows.length);

  const localizedCols = useMemo<ColDef<AGTableModelType>[]>(
    () =>
      cols.map((col) => ({
        ...col,
        headerName: col.headerName ?? t(`table.headerName.${col.field}`),
        valueFormatter:
          col.valueFormatter ??
          ((p) => {
            const v = p.value;
            if (v == null) return "";
            if (Array.isArray(v)) return v.join(", ");
            if (typeof v === "object") return "";
            return v;
          }),
      })),
    [cols, t],
  );

  const rafIdRef = useRef<number | null>(null);

  const updateCounts = useCallback(() => {
    const api = gridRef.current?.api;

    if (!api || api.isDestroyed()) return;
    if (rafIdRef.current != null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setFilteredCount(api.getDisplayedRowCount());
    });
  }, []);

  useEffect(
    () => () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    },
    [],
  );

  const onGridReady = (e: GridReadyEvent<AGTableModelType>) => {
    setFilteredCount(e.api.getDisplayedRowCount());
  };

  return (
    <>
      {filteredCount < rows.length && (
        <p dir="ltr" className="text-center text-sm text-slate-500">
          {filteredCount} / {rows.length}
        </p>
      )}

      <div
        className={`ag-theme-quartz w-full overflow-x-auto rounded-xl border border-slate-200 ${
          fixedHeight ? "h-80" : "h-[70vh] min-h-[26rem]"
        }`}
        data-testid="ag-table"
        dir={direction}
        style={{ direction }}
      >
        <AgGridReactDynamic
          ref={gridRef}
          rowData={rows}
          columnDefs={localizedCols}
          defaultColDef={defaultColDef}
          enableRtl={isRtl}
          animateRows
          getRowId={(p) => String("id" in p.data ? p.data.id : p.data.value)}
          ensureDomOrder={false}
          enableCellTextSelection
          rowHeight={30}
          onGridReady={onGridReady}
          onFilterChanged={updateCounts}
          onModelUpdated={updateCounts}
          components={{
            ActionRenderer,
            AgGenericRenderer,
          }}
        />
      </div>
    </>
  );
}
