"use client";

import { Download, Copy, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import QrCodeSvg from "react-qr-code";
import { toast } from "sonner";
import useSWR from "swr";

import AGTable from "@/components/panel/table";
import { HomeButtonClient } from "@/components/shared/elements-client";
import Badge from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { appConfig, localeCache } from "@/lib/config";
import { baseMetricsCols, ModelType } from "@/lib/types";
import { clientApi } from "@/lib/utils/api";
import { safeDecodeURIComponent } from "@/lib/utils/helper";

import type {
  Totals,
  Breakdowns,
  Breakdown,
  Series,
  DataPoint,
  Link,
  SingleLinkResponse,
} from "@/lib/types";
import type { ColDef } from "ag-grid-community";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function TrafficChart({ series }: { series: Series }) {
  const t = useTranslations();

  const chartSeries = useMemo<{ name: string; data: DataPoint[] }[]>(
    () => [
      {
        name: t("table.headerName.clicks"),
        data: series.clicks,
      },
      {
        name: t("table.headerName.uniques"),
        data: series.uniques,
      },
    ],
    [series, t],
  );

  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: ["#4338ca", "#06b6d4"],
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      xaxis: { type: "datetime", labels: { datetimeUTC: true } },
      yaxis: { decimalsInFloat: 0 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 0.3, opacityFrom: 0.25, opacityTo: 0.05 },
      },
      legend: {
        position: "top",
        horizontalAlign: localeCache.isRtl() ? "right" : "left",
      },
      grid: { strokeDashArray: 4, borderColor: "#e2e8f0" },
    }),
    [],
  );

  return (
    <div className="mx-auto my-4 max-w-6xl px-2">
      <h2 className="mb-3 text-lg font-bold text-text">
        {t("report.chartTitle")}
      </h2>

      <div className="surface rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
        <ReactApexChart
          options={options}
          series={chartSeries}
          type="area"
          height={360}
        />
      </div>
    </div>
  );
}

const sizeQr = 180;

export const LinkQR = ({ link }: { link: Link }) => {
  const t = useTranslations();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const shortUrl = useMemo(
    () => `${appConfig.API_URL}/${link.alias}`,
    [link.alias],
  );

  const download = () => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = sizeQr;
      canvas.height = sizeQr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, sizeQr, sizeQr);
      ctx.drawImage(img, 0, 0, sizeQr, sizeQr);
      URL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `${link.alias}.png`;
      a.click();
    };

    img.src = url;
  };

  return (
    <div className="mx-auto my-4 flex max-w-xs flex-col items-center gap-3 text-center">
      <div
        ref={wrapRef}
        className="surface inline-block rounded-2xl border border-slate-200 bg-white p-4"
      >
        <QrCodeSvg value={shortUrl} size={sizeQr} />
      </div>

      <Button
        variant="outline"
        size="sm"
        icon={<Download className="size-4" />}
        onClick={download}
      >
        {t("download.qr")}
      </Button>
    </div>
  );
};

export const LinkInfo = ({
  link,
  totals,
  isPublic = false,
}: {
  link: Link;
  totals: Totals;
  isPublic?: boolean;
}) => {
  const t = useTranslations();

  const shortUrl = useMemo(
    () => `${appConfig.API_URL}/${link.alias}`,
    [link.alias],
  );

  const totalsStr = useMemo(() => {
    return Object.entries(totals)
      .map(([key, value]) => `${t(`table.headerName.${key}`)}: ${value}`)
      .join(" | ");
  }, [totals, t]);

  const copy = async (toCopy: string) => {
    await navigator.clipboard.writeText(toCopy);
    toast.success(t("copy.clipboard"), {
      description: toCopy,
    });
  };

  return (
    <div className="surface mx-auto my-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <HomeButtonClient />
        <Badge tone={link.active ? "success" : "danger"}>
          {link.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
        <h2 className="text-xl font-bold text-text">{t("report.title1")}</h2>
        <p className="text-base text-slate-500">{totalsStr}</p>

        <p className="text-base text-slate-600">{t("report.title2")}</p>

        {isPublic && (
          <>
            <div className="flex flex-col items-center gap-2">
              <p className="text-balance font-bold text-warning">
                {t("report.publicNotice")}
              </p>

              <p className="flex items-center gap-1 break-all text-text">
                {window.location.href}
                <IconButton
                  size="sm"
                  aria-label="copy-href"
                  onClick={() => copy(window.location.href)}
                >
                  <Copy className="size-4" />
                </IconButton>
              </p>
            </div>

            <hr className="my-1 w-full border-slate-200" />
          </>
        )}

        <p className="break-all text-text font-bold ">
          {t("report.topNotice")}
        </p>

        <div className="flex w-full flex-col gap-1.5 text-start">
          <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            {t("report.shortUrl")}
          </span>
          <div
            dir="ltr"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm break-all text-text"
          >
            {shortUrl}
            <IconButton
              size="sm"
              aria-label="copy-link"
              className="ms-auto shrink-0"
              onClick={() => copy(shortUrl)}
            >
              <Copy className="size-4" />
            </IconButton>
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5 text-start">
          <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            {t("report.originalUrl")}
          </span>
          <div
            dir="ltr"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm break-all text-text"
          >
            {link.url}
            <IconButton
              size="sm"
              aria-label="open"
              className="ms-auto shrink-0"
              onClick={() =>
                window.open(link.url, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink className="size-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BreakdownTables = ({ breakdowns }: { breakdowns: Breakdowns }) => {
  const t = useTranslations();

  const dimOrder: (keyof Breakdowns)[] = [
    "referrer",
    "city",
    "device",
    "os",
    "browser",
    "country",
    "region",
  ];

  return (
    <div className="mx-auto my-4 max-w-6xl px-2">
      <h2 className="mb-3 text-lg font-bold text-text">
        {t("report.breakdownTitle")}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {dimOrder.map((dim) => {
          const rows = breakdowns[dim] as Breakdown[];
          if (!rows || rows.length === 0) return null;

          const localDim = t(dim);
          const cols = [
            { headerName: localDim, field: "value", flex: 1 },
            ...baseMetricsCols,
          ] as ColDef[];

          return (
            <div key={dim as string}>
              <h3
                className={`mb-2 text-sm font-bold text-slate-500 ${
                  localeCache.isRtl() ? "me-1" : "ms-1"
                }`}
              >
                {localDim}
              </h3>
              <AGTable cols={cols} rows={rows} fixedHeight />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Report({
  alias,
  password_hash,
  isPublic = false,
}: {
  alias?: string;
  password_hash?: string;
  isPublic?: boolean;
}) {
  const key =
    isPublic && password_hash
      ? `/report/${safeDecodeURIComponent(password_hash)}`
      : alias
        ? `/${ModelType.link}/${safeDecodeURIComponent(alias)}`
        : null;
  const { data, error, isValidating } = useSWR<SingleLinkResponse>(
    key,
    (url: string) => clientApi.get<SingleLinkResponse>(url),
  );

  if (!key || (error && !data)) return notFound();
  if (!data) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {isValidating && (
        <div className="flex justify-end px-4 py-2">
          <Spinner className="size-4" />
        </div>
      )}
      <LinkInfo
        link={data.link}
        totals={data.report.totals}
        isPublic={isPublic}
      />
      <TrafficChart series={data.report.series} />
      <BreakdownTables breakdowns={data.report.breakdowns} />
      <LinkQR link={data.link} />
    </>
  );
}
