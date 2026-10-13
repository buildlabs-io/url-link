"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

import { appConfig } from "@/lib/config";
import { ModelType } from "@/lib/types";

export default function LoginButtons() {
  const t = useTranslations();

  const routerRef = useRef<ReturnType<typeof useRouter> | null>(null);
  const router = useRouter();

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const openPopup = useCallback((url: string, name: string) => {
    const w = 30 * 16;
    const h = 40 * 16;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const popup = window.open(
      url,
      name,
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    const onMessage = (ev: MessageEvent) => {
      const data = ev.data as { token: string };
      if (
        popup &&
        ev.source === popup &&
        ev.origin === new URL(appConfig.API_URL).origin &&
        typeof data?.token === "string"
      ) {
        const maxAge = appConfig.HALF_YEAR;

        document.cookie = `auth_token=true; Max-Age=${maxAge}; Path=/; SameSite=Lax`;

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "token_expires_at",
          String(Date.now() + maxAge * 1000),
        );

        window.removeEventListener("message", onMessage);

        if (popup && !popup.closed) popup.close();

        routerRef.current?.replace(`/panel/${ModelType.link}`);
      }
    };

    window.addEventListener("message", onMessage);
  }, []);

  const loginWithGoogle = () =>
    openPopup(`${appConfig.API_URL}/login/google_login`, "google-oauth");

  return (
    <div className="grid justify-items-center gap-4">
      <h3 className="text-xl font-bold text-text">{t("login.title")}</h3>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={loginWithGoogle}
          className="inline-flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-[#3c4043] shadow-sm transition-shadow hover:shadow-md"
        >
          {t("login.google")}

          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="size-5"
          />
        </button>
      </div>

      <h3 className="text-xl text-slate-500">{t("login.description1")}</h3>
      <h3 className="text-xl text-slate-500">{t("login.description2")}</h3>
    </div>
  );
}
