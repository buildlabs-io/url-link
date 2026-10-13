import { ModelType } from "./enums";

import type { Link, Breakdown } from "@/lib/types";
import type { ColDef } from "ag-grid-community";

export type AGTableModelType = Link | Breakdown;
export const baseMetricsCols: ColDef<Partial<Breakdown>>[] = [
  {
    field: "clicks",
    width: 95,
  },
  {
    field: "uniques",
    width: 105,
  },
];
export const columns_link: ColDef<Link>[] = [
  {
    field: "alias",
    width: 140,
  },
  ...baseMetricsCols,
  {
    field: "id",
    cellRenderer: "ActionRenderer",
    width: 155,
  },
  {
    field: "url",

    minWidth: 250,
  },

  {
    field: "active",
    cellRenderer: "AgGenericRenderer",
    width: 90,
  },
  {
    field: "created_at",
    cellRenderer: "AgGenericRenderer",
    width: 145,
  },
  {
    field: "updated_at",
    cellRenderer: "AgGenericRenderer",
    width: 145,
  },
] as ColDef<Link>[];

export const get_columns_ag_by_model = (
  model: ModelType,
): ColDef<AGTableModelType>[] => {
  let columns;
  switch (model) {
    case ModelType.link:
      columns = [...columns_link];
      break;

    default:
      columns = [...columns_link];
  }

  return columns as ColDef<AGTableModelType>[];
};
