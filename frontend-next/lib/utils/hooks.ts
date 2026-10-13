"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { SWR_CACHE_KEY } from "@/lib/provider/swrProvider";
import { clientApi } from "@/lib/utils/api";

import type { Link, ModelType } from "@/lib/types";
import type { RefObject } from "react";

export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  onOutside: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refs.every((ref) => !ref.current?.contains(target))) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, onOutside, enabled]);
};
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expires_at");
  localStorage.removeItem(SWR_CACHE_KEY);
  document.cookie = "auth_token=false; Max-Age=0; Path=/; SameSite=Lax";
};
export const useLogout = () => {
  const t = useTranslations();
  const router = useRouter();

  return useCallback(async () => {
    clearAuth();

    toast.success(t("logout.success"));

    router.push("/");
    router.refresh();
  }, [router, t]);
};

export const panelRowsKey = (model: ModelType) =>
  ["panel-rows", model] as const;

export const usePanelRows = (model: ModelType, enabled = true) => {
  const key = enabled ? panelRowsKey(model) : null;

  return useSWR<Link[]>(
    key,
    ([, currentModel]: ReturnType<typeof panelRowsKey>) =>
      clientApi.post<Link[]>(`/${currentModel}`),
  );
};
