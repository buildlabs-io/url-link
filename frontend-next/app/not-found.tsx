import { getTranslations } from "next-intl/server";

import { HomeButton } from "@/components/shared/wrappers";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-2 text-center">
      <h1 className="text-3xl font-extrabold text-text">
        {t("notFound.title")}
      </h1>

      <p className="max-w-xl text-lg text-slate-500">
        {t("notFound.description")}
      </p>

      <HomeButton />
    </main>
  );
}
