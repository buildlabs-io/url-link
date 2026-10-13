"use client";

import { useTranslations } from "next-intl";

import { HomeButtonClient } from "@/components/shared/elements-client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-2 text-center">
      <h1 className="text-3xl font-extrabold text-text">
        {t("errorPage.title")}
      </h1>

      <p className="max-w-xl text-lg text-slate-500">
        {t("errorPage.message")}
      </p>

      <Button onClick={reset}>{t("errorPage.retry")}</Button>
      <HomeButtonClient />
    </main>
  );
}
