import {
  Link2,
  Languages,
  BarChart3,
  QrCode,
  Share2,
  LayoutDashboard,
  Infinity as InfinityIcon,
  Smartphone,
  Zap,
  ChevronDown,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { HomeCTA } from "@/components/shared/wrappers";
import { generateJsonLdHome } from "@/lib/utils/seo";

import type { FaqItem } from "@/lib/types";
import type { ComponentType } from "react";

const FEATURE_ICONS: ComponentType<{ className?: string }>[] = [
  Link2,
  Languages,
  BarChart3,
  QrCode,
  Share2,
  LayoutDashboard,
  InfinityIcon,
  Smartphone,
  Zap,
];

export const HomeView = async () => {
  const t = await getTranslations("home");

  const faq = t.raw("seo.faq") as FaqItem[];
  const features = t.raw("seo.features") as string[];
  const keywords = t.raw("seo.keywords") as string[];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLdHome(t)),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-600 px-4 py-6 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-cyan-300/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-indigo-300/20 blur-3xl"
        />

        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-3 text-center">
          <h1 className="sr-only">{t("seo.title")}</h1>
          <h2 className="sr-only">{t("seo.description")}</h2>

          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h2>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-base text-indigo-100">{t("subtitle")}</h3>
            <h3 className="text-base text-indigo-100">{t("description1")}</h3>
            <h3 className="text-base text-indigo-100">{t("description2")}</h3>
          </div>

          <div className="mt-6 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:p-7">
            <HomeCTA />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
        <p className="text-sm font-bold tracking-wide text-accent uppercase">
          {t("features.eyebrow")}
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-text sm:text-3xl">
          {t("features.title")}
        </h2>

        <div className="grid grid-cols-1 gap-5 text-start sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]!;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="size-5" />
                </span>
                <p className="mt-1.5 text-sm text-text">{feature}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section
        className="mx-auto w-full max-w-2xl p-4   text-start"
        aria-labelledby="faq-title"
      >
        <h2
          id="faq-title"
          className="mb-6 text-center text-2xl font-extrabold text-text sm:text-3xl"
        >
          {t("faq.title")}
        </h2>

        <div className="flex flex-col gap-2">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-3 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-text">
                {item.name}
                <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="m-0 mt-2 text-text">{item.text}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-1.5 px-4 pb-10">
        {keywords.map((keyword, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
          >
            {keyword}
          </span>
        ))}
      </div>
    </main>
  );
};
