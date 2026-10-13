"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { IconButton } from "@/components/ui/button";
import { localeCache } from "@/lib/config";
import { Language } from "@/lib/types";
import { useClickOutside } from "@/lib/utils/hooks";

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: Language.EN, label: "English 🇺🇸" },
  { code: Language.ES, label: "Español 🇪🇸" },
  { code: Language.HE, label: "עברית 🇮🇱" },
];

export default function LangToggleClient() {
  const t = useTranslations();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside([triggerRef, menuRef], () => setOpen(false), open);

  const switchLang = (lang: Language) => {
    const segments = window.location.pathname.split("/");
    const current = segments.at(-1);

    localeCache.set(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = localeCache.dir();

    if (!current || Object.values(Language).includes(current as Language)) {
      segments[segments.length - 1] = lang;
      router.push(segments.join("/") || `/legal/terms/${lang}`);
    }

    router.refresh();
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-2"
      >
        <span className="select-none text-sm">{t("language_change")}</span>

        <IconButton
          size="sm"
          aria-label="Change language"
          className="bg-accent/10 text-accent hover:bg-accent/20"
        >
          <Languages className="size-4" />
        </IconButton>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="surface absolute bottom-full z-50 mb-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {LANG_OPTIONS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setOpen(false);
                switchLang(code);
              }}
              className="cursor-pointer block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-accent/10"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
