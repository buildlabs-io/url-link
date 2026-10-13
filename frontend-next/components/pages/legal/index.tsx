import { getTranslations } from "next-intl/server";

import { legal_sections } from "@/components/pages/legal/legal_sections";
import { TermsPage } from "@/components/pages/legal/terms";
import { HomeButton } from "@/components/shared/wrappers";
import { appConfig, localeCache } from "@/lib/config";

export default async function LegalPageView({ slug }: { slug: string }) {
  const t = await getTranslations();

  const content = legal_sections[slug as "terms" | "accessibility" | "remove"];

  return (
    <main
      className="mx-auto w-full max-w-3xl px-4 py-10 text-text"
      style={{ direction: localeCache.dir() }}
    >
      <div className="mb-4">
        <HomeButton />
      </div>

      <div className="surface rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
        {slug === "terms" && <TermsPage />}

        {content.sections.map((section, idx) => (
          <section
            key={idx}
            className={
              idx > 0
                ? "mt-6 border-t border-slate-100 pt-6"
                : "flex flex-col gap-2"
            }
          >
            <h2 className="mb-2 text-xl font-bold">{t(section.title)}</h2>

            {section.paragraphs?.map((pid, i) => (
              <p key={i}>{t(pid)}</p>
            ))}

            {section.list && (
              <ul className="my-2 list-disc ps-5">
                {section.list.map((lid, i) => (
                  <li key={i} className="mb-1">
                    {t(lid)}
                  </li>
                ))}
              </ul>
            )}

            {section.contact && (
              <p className="mt-8">
                {t(section.contact, { email: "" })}
                <a
                  href={`mailto:${appConfig.EMAIL_CONTACT}`}
                  className="font-medium text-accent"
                >
                  {appConfig.EMAIL_CONTACT}
                </a>
              </p>
            )}
          </section>
        ))}

        <p className="mt-10 text-sm text-slate-500">
          {t("terms.last_update")}: 29/08/2025
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <HomeButton />
      </div>
    </main>
  );
}
