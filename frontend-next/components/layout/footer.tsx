import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LangToggle } from "@/components/shared/wrappers";
import { appConfig, localeCache } from "@/lib/config";

const SOCIAL_LINKS = [
  {
    icon: Mail,
    href: `mailto:${appConfig.EMAIL_CONTACT}`,
    label: "Email",
    className: "text-danger hover:bg-danger/10",
  },
];

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer
      className="surface w-full border-t border-slate-200 bg-bg py-3 lg:mx-auto lg:w-[55rem] lg:py-4"
      style={{ direction: localeCache.dir() }}
    >
      <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-y-2 px-4 lg:grid-cols-[auto_1fr_auto] lg:gap-x-3 lg:gap-y-0">
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <span className="text-base">{t("contact")}</span>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${className}`}
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>

          <span className="text-slate-400">|</span>

          <a
            href={`/legal/terms/${localeCache.get()}`}
            className="text-base font-medium text-accent hover:opacity-80"
          >
            {t("terms")}
          </a>
        </div>

        <div className="w-full text-center text-sm font-semibold">
          {t("copyright")}
        </div>

        <div className="flex w-full justify-center lg:w-60 lg:justify-start">
          <LangToggle />
        </div>
      </div>

      <p
        dir="ltr"
        className="m-0 flex items-center justify-center gap-1.5 px-4 py-5 text-lg text-slate-500"
      >
        Made with <span aria-label="love">❤️</span> by{" "}
        <a
          href="https://studiopo.net"
          target="_blank"
          rel="noopener"
          className="font-semibold text-inherit underline decoration-slate-300 underline-offset-4"
        >
          Studio Po
        </a>
      </p>
    </footer>
  );
}
