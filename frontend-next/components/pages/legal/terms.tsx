import { getTranslations } from "next-intl/server";

import type { ReactNode } from "react";

async function Section({
  n,
  titleKey,
  children,
}: {
  n: number;
  titleKey: string;
  children: ReactNode;
}) {
  const t = await getTranslations();

  return (
    <section className="border-t border-slate-100 pt-6 first:border-0 first:pt-0">
      <h2 className="mb-3 flex items-center gap-3 text-lg font-bold text-text">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-extrabold text-accent">
          {n}
        </span>
        {t(titleKey)}
      </h2>
      <div className="ms-10 flex flex-col gap-2">{children}</div>
    </section>
  );
}

export async function TermsPage() {
  const t = await getTranslations();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-text">{t("terms.title")}</h1>

      <Section n={1} titleKey="terms.1.title">
        <p>
          <strong>{t("terms.1.p1.lead")}</strong>
        </p>
        <p>{t("terms.1.p1.text")}</p>

        <p>
          <strong>{t("terms.1.p2.lead")}</strong>
        </p>

        <ul className="list-disc ps-5">
          <li>{t("terms.1.def.1")}</li>
          <li>{t("terms.1.def.2")}</li>
          <li>{t("terms.1.def.3")}</li>
          <li>{t("terms.1.def.4")}</li>
          <li>{t("terms.1.def.5")}</li>
        </ul>
      </Section>

      <Section n={2} titleKey="terms.2.title">
        <p>
          <strong>{t("terms.2.p1.lead")}</strong>
        </p>
        <p>{t("terms.2.p1.text")}</p>

        <p>
          <strong>{t("terms.2.p2.lead")}</strong>
        </p>
        <p>{t("terms.2.p2.text")}</p>
      </Section>

      <Section n={3} titleKey="terms.3.title">
        <p>
          <strong>{t("terms.3.p1.lead")}</strong>
        </p>
        <p>{t("terms.3.p1.text")}</p>

        <p>
          <strong>{t("terms.3.p2.lead")}</strong>
        </p>

        <ul className="list-disc ps-5">
          <li>{t("terms.3.li.1")}</li>
          <li>{t("terms.3.li.2")}</li>
          <li>{t("terms.3.li.3")}</li>
        </ul>
      </Section>

      <Section n={4} titleKey="terms.4.title">
        <p>
          <strong>{t("terms.4.p1.lead")}</strong>
        </p>
        <p>{t("terms.4.p1.text")}</p>

        <p>
          <strong>{t("terms.4.p2.lead")}</strong>
        </p>
        <p>{t("terms.4.p2.text")}</p>

        <p>
          <strong>{t("terms.4.p3.lead")}</strong>
        </p>
        <p>{t("terms.4.p3.text")}</p>
      </Section>

      <Section n={5} titleKey="terms.5.title">
        <p>
          <strong>{t("terms.5.p1.lead")}</strong>
        </p>
        <p>{t("terms.5.p1.text")}</p>

        <p>
          <strong>{t("terms.5.p2.lead")}</strong>
        </p>
        <p>{t("terms.5.p2.text")}</p>

        <p>
          <strong>{t("terms.5.p3.lead")}</strong>
        </p>
        <p>{t("terms.5.p3.text")}</p>

        <p>
          <strong>{t("terms.5.p4.lead")}</strong>
        </p>
        <p>{t("terms.5.p4.text")}</p>
      </Section>

      <Section n={6} titleKey="terms.6.title">
        <p>
          <strong>{t("terms.6.p1.lead")}</strong>
        </p>
        <p>{t("terms.6.p1.text")}</p>

        <p>
          <strong>{t("terms.6.p2.lead")}</strong>
        </p>
        <p>{t("terms.6.p2.text")}</p>
      </Section>

      <Section n={7} titleKey="terms.7.title">
        <p>
          <strong>{t("terms.7.p1.lead")}</strong>
        </p>
        <p>{t("terms.7.p1.text")}</p>

        <p>
          <strong>{t("terms.7.p2.lead")}</strong>
        </p>
        <p>{t("terms.7.p2.text")}</p>
      </Section>

      <Section n={8} titleKey="terms.8.title">
        <p>{t("terms.8.p1.text")}</p>
      </Section>

      <Section n={9} titleKey="terms.9.title">
        <p>{t("terms.9.p1.text")}</p>
      </Section>
    </section>
  );
}
